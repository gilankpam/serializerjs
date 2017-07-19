import * as R from 'ramda'
import * as moment from 'moment'

import * as V from './validators'

import { Serializer, SerializerArgs } from './serializer'

interface SerializerClass {
    new (args: SerializerArgs): Serializer
}

export interface Field <T> {
    toIntervalValue: (value: any) => T
    toRepresentation: (value: T) => any
    validate: (value: any) => Promise<T>
    // Property
    blank?: boolean 
    nullable?: boolean
    readOnly?: boolean
    writeOnly?: boolean
    source?: string
    defaultValue?: any
}

type FieldOptions = {
    blank?: boolean 
    nullable?: boolean
    readOnly?: boolean
    writeOnly?: boolean
    source?: string
    validators?: V.Validator<any>[]
    defaultValue?: any
    [key: string]: any
}

export abstract class AbstractField<T> implements Field<T> {

    blank: boolean = false 
    nullable: boolean = false
    readOnly: boolean = false
    writeOnly: boolean = false
    source: string = null
    validators: V.Validator<T>[] = []
    defaultValue: any

    constructor (options: FieldOptions = {}) 
    {
        this.blank = options.blank || false
        this.nullable = options.nullable || false
        this.readOnly = options.readOnly || false
        this.writeOnly = options.writeOnly || false
        this.validators = options.validators || []
        this.source = options.source || null
        this.defaultValue = options.defaultValue || null
    }


    abstract toIntervalValue (value: any): T

    // from value to json representative
    abstract toRepresentation (value: T): any

    async validate (value: any): Promise<T> {
        // Value is null
        if (value === null || (Array.isArray(value) &&  value.length === 0)) {
            if (this.nullable) return value
            throw new Error('This field cannot be null')
        }
        // Value is not present or blank
        if (value === undefined) {
            if (this.blank) return value
            if (!R.isNil(this.defaultValue)) {
                value = this.defaultValue
            } else {
                throw new Error('This field cannot be blank')
            }
        }
        const intervalValue = this.toIntervalValue(value)
        return await this._reduce(intervalValue, this.validators)
    }

    async _reduce (value, validators: V.Validator<any>[]) {
        return R.reduce(async (value, validator) => {
            const val = await value
            return validator(val)
        }, value, validators)
    }
}

export class StringField extends AbstractField<string> {
    validators: V.Validator<string>[] = [V.trim()]
    constructor (options: FieldOptions = {}) {
        super(options)
        const { minLength, maxLength, validators = [] } = options
        if (minLength) {
            this.validators.push(V.minLength<string>(minLength))
        }
        if (maxLength) {
            this.validators.push(V.maxLength<string>(maxLength))
        }
    }

    toIntervalValue (value: any): string {
        return V.string()(value)
    }

    toRepresentation (value: string): any {
        return value
    }
}

export class NumericField extends AbstractField<number> {
    constructor (options: FieldOptions = {}) {
        super(options)
        const numericValidators = [V.numeric()]
        const { minValue, maxValue, validators = [] } = options
        if (minValue) {
            this.validators.push(V.minValue(minValue))
        }
        if (maxValue) {
            this.validators.push(V.maxValue(maxValue))
        }
    }

    toIntervalValue (value: any): number {
        return V.numeric()(value)
    }

    toRepresentation (value: number): any {
        return value
    } 
}

export class DateTimeField extends AbstractField<Date> {
    protected dateFormat: string

    constructor (options: FieldOptions = {}) {
        super(options)
        const { format } = options
        if (format) {
            this.dateFormat = format
        }
    }

    toIntervalValue (value: any): Date {
        return V.date(this.dateFormat)(value)
    }

    toRepresentation (value: Date): any {
        if (R.isNil(value)) return value
        if (!this.dateFormat) {
            return moment(value).format()
        }
        try {
            return moment(value).format(this.dateFormat)
        } catch (err) {
            return value.toString()
        }
    }
}

abstract class ArrayField<T> extends AbstractField<T[]> {
    toIntervalValue (value: any[]): T[] {
        if (!Array.isArray(value)) {
            throw new Error('Invalid array')
        }
        return value.map(this.toInternalValueElem)
    }

    abstract toInternalValueElem (value: any): T

    toRepresentation (value: T[]): any[] {
        return value.map(this.toRepresentationElem)
    }

    abstract toRepresentationElem (value: T): any
}

export class NumericArrayField extends ArrayField<number> {
    toInternalValueElem (value: any): number {
        return V.numeric()(value)
    }

    toRepresentationElem (value: number): any {
        return value
    }
}

export class SerializerField extends AbstractField<Serializer> {
    protected serializer: SerializerClass

    constructor (options: FieldOptions = {}) {
        super(options)
        const { serializer } = options
        if (!serializer) throw new Error('Serializer cannot empty')
        this.serializer = serializer
    }

    async toRepresentation (value: Serializer): Promise<any> {
        if (R.isNil(value)) {
            return value
        }
        return await (new this.serializer({instance: value})).toRepresentation()
    }

    toIntervalValue (value: any): Serializer {
        throw new Error('Not implemented')
    }
}

export class ChoiceField<T> extends AbstractField<T> {
    constructor (options: FieldOptions = {}) {
        super(options)
        let choices: any[]
        choices = options.choices
        if (R.isEmpty(choices)) throw new Error('Choices can\'t be empty')
        this.validators.push(V.inside(choices))
    }

    toRepresentation (value: any): T {
        return value
    }

    toIntervalValue (value: any): T {
        return (<T>value)
    }
}

export class ModelReferenceField extends AbstractField<any> {
    public model: any
    public field: string
    
    constructor (options: FieldOptions = {}) {
        super(options)
        const { model, field } = options
        if (!model) throw  new Error('Model can\'t be empty')
        this.model = model
        this.field = field
        this.validators.push(V.modelExist(model, field))
    }

    toRepresentation (value: any): any {
        return value
    }

    toIntervalValue (value: any): any {
        return value
    }
}