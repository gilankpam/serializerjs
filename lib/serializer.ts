import * as R from 'ramda'
import { ValidationError } from './errors'
import {
    Field,
    NumericField,
    StringField,
    DateTimeField,
    ChoiceField
} from './fields'
import { PlainObject } from './types'

export interface Serializer {
    validate(): Promise<any>
    save (): Promise<any>
    update (instance: any): Promise<any>
    toRepresentation (): Promise<any>
    // fromInstance (instance: any, req?: any): Serializer
    // fromData (data: any, req?: any, partial?: boolean): Serializer
}

export type SerializerArgs = {
    data?: any, 
    partial?: boolean,
    instance?: any, 
    many?: boolean,
    req?: any
}

export abstract class AbstractSerializer implements Serializer {
    // static fromInstance(instance: any, req: any): Serializer {
    //     if (Array.isArray(instance)) {
    //         return new this({ instance, many: true, req})
    //     }
    //     return new this({ instance, req })
    // }

    // static fromData(data: any, req: any, partial: boolean = false): Serializer {
    //     return new this({ data, partial, req })
    // }

    protected fields: {[s: string]: Field<any>}
    protected data: PlainObject
    protected partial: boolean
    protected instance: any
    protected many: boolean
    protected req: any
    protected validatedData: any = null
    protected validationErrors: any = null

    constructor (args: SerializerArgs = {}) {
        const { 
            data = null, 
            partial = false,
            instance = null, 
            many = false,
            req = null
        } = args
        this.data = data
        this.partial = partial
        this.instance = instance
        this.many = many
        this.req = req
    }

    async validate(): Promise<any> {
        if (this.data === null) throw new Error('Data cannot be null')
        const validatedData: any = {}
        const validationErrors: any = {}

        for (let fieldName of Object.keys(this.fields)) {
            const fieldData = this.data[fieldName]

            if (this.partial && fieldData === undefined) {
                continue
            }

            const field: Field<any> = this.fields[fieldName]
            // Read Only fields, skip
            if (field.readOnly === true) {
                continue
            }

            try {
                const validatedValue = await field.validate(fieldData)
                validatedData[fieldName] = validatedValue
                this[fieldName] = validatedValue
            } catch (err) {
                validationErrors[fieldName] = err.message
            }
        }
        this.validatedData = this._removeUndefined(validatedData)
        if (!R.isEmpty(validationErrors)) {
            this.validationErrors = validationErrors
            throw new ValidationError(null, validationErrors)
        }
        return this.validatedData
    }

    _removeUndefined (obj: PlainObject) {
        return R.filter(k => k !== undefined, obj)
    }

    async save () : Promise<any> {
        if (this.validatedData === null) 
            throw new Error('Serializer must be validated')
        if (this.validationErrors !== null) 
            throw new Error('Cannot save when validation error')
        const instance = await this.performSave(this.validatedData)
        this.instance = instance
        return instance
    }

    abstract async performSave (validatedData: PlainObject): Promise<any>

    async update (instance) {
        if (this.validatedData === null) 
            throw new Error('Serializer must be validated')
        if (this.validationErrors !== null) 
            throw new Error('Cannot save when validation error')
        const updatedInstance = await this.performUpdate(instance, this.validatedData)
        this.instance = updatedInstance
        return updatedInstance
    }

    abstract async performUpdate(instance: any, validatedData: PlainObject): Promise<any>

    async toRepresentation () {
        if (this.instance === null) {
            throw new Error('Instance cannot be null')
        }
        if (this.many === true) {
            const instances = []
            for (let instance of this.instance) {
                instances.push(await this._toRepresentation(instance))
            }
            return instances
        }

        return await this._toRepresentation(this.instance)
    }

    async _toRepresentation (instance) {
        const json = {}
        for (let fieldName of Object.keys(this.fields)) {
            const field: Field<any> = this.fields[fieldName]
            if (field.writeOnly === true) continue
            let value;
            if (!R.isNil(field.source)) {
                const fn = this[field.source]
                if (typeof fn === 'function') {
                    value = await fn.call(this, instance, this.validatedData)
                } else {
                    value = instance[field.source]
                }
            } else {
                value = instance[fieldName]
            }
            json[fieldName] = 
                await field.toRepresentation(value)
        }

        return json
    }
}

// For Sequelize Model
export abstract class ModelSerializer extends AbstractSerializer {

    // private model: any
    abstract modelFields: string[] | string
    abstract modelFieldExcludes: string[]

    constructor (args: SerializerArgs, private model) {
        super(args)
        this._setupModelFields()
    }

    _setupModelFields (): void {
        const modelAttributes = this.model.attributes
        let modelFields: string[]
        if (this.modelFields === 'all' || modelFields === undefined) {
            // Filter model atributes based on fields
            modelFields = Object.keys(this.model.attributes)
        } else {
            modelFields = <string[]>this.modelFields
        }

        if (!R.isEmpty(this.modelFieldExcludes)) {
            modelFields = R.difference(modelFields, this.modelFieldExcludes)
        }

        this.modelFields = modelFields

        const fields = this.fields
        for (let fieldName of modelFields) {
            if (this.fields[fieldName]) {
                fields[fieldName] = this.fields[fieldName]
            } else {
                fields[fieldName] = getModelField(modelAttributes[fieldName])
            }
        }
        this.fields = fields
    }
    
    async performSave (validatedData: any): Promise<any> {
        const instance = this.model.build(validatedData);
        await this._modelValidate(instance)
        return await instance.save()
    }
    
    async _modelValidate(instance): Promise<void> {
        const err = await instance.validate()
        if (err !== null && err.name === 'SequelizeValidationError') {
            throw ValidationError.fromSequelizeValidationError(err)
        }
    }

    async performUpdate (instance, validatedData): Promise<any> {
        return await instance.update(validatedData)
    }
}

function getModelField(attribute): Field<any> {
    const { _length, key: type } = attribute.type
    const { _autoGenerated, allowNull = true, defaultValue } = attribute
    const nullable = _autoGenerated || allowNull
    switch (type) {
        case 'INTEGER':
            return new NumericField({ defaultValue, nullable, blank: nullable })

        case 'STRING':
        case 'TEXT':
            return new StringField({ defaultValue, nullable, blank: nullable, maxLength: _length })

        case 'DATE':
            return new DateTimeField({ defaultValue, nullable, blank: nullable })

        case 'ENUM':
            const values = attribute.values
            return new ChoiceField({ defaultValue, nullable, blank: nullable, choices: values })

        default:
            throw new Error('Invalid attribute type: ' + type);
    }
}

export function field(field: Field<any>) {
    return function(target: any, key: string) {
        if (target.fields === undefined) {
            target.fields = {}
        }
        target.fields[key] = field
    }
}