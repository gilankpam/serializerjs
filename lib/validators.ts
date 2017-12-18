import * as R from 'ramda'
import * as moment from 'moment'

export interface Validator<T> {
    (value: any): T
    description?: string
}

export function minLength<T> (min: number, errMsg?: string): Validator<T> {
    const fn = <Validator<T>>function (val: any): T {
        if (R.length(val) < min) {
            throw new Error(errMsg ? errMsg : 'Min length ' + min)
        }

        return val
    }
    fn.description = `Min length of ${min}`
    return fn
}

export function maxLength<T> (max: number, errMsg?: string): Validator<T> {
    const fn = <Validator<T>>function(val: any): T {
        if (R.length(val) > max) {
            throw new Error(errMsg ? errMsg : 'Max length ' + max)
        }

        return val
    }
    fn.description = `Max length of ${max}`
    return fn
}

export function string(errMsg?: string): Validator<string> {
    const fn = <Validator<string>>function (val: any): string {
        if (!R.is(String, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be string')
        }

        return val
    }
    fn.description = 'Must be string'
    return fn
}

export function numeric (errMsg?: string): Validator<number> {
    const fn = <Validator<number>>function(val: any): number {
        if (!R.is(Number, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be numeric')
        }
        return val
    }
    fn.description = `Must be number`
    return fn
}

export function minValue (min?: number, errMsg?: string): Validator<number> {
    const fn = <Validator<number>>function (val: any): number {
        if (val < min) {
            throw new Error(errMsg ? errMsg : 'Min value ' + min)
        }
        return val
    }
    fn.description = `Min value of ${min}`
    return fn
}

export function maxValue (max: number, errMsg?: string): Validator<number> {
    const fn = <Validator<number>>function (val: any): number {
        if (val > max) {
            throw new Error(errMsg ? errMsg : 'Max value ' + max)
        }

        return val
    }
    fn.description = `Max value of ${max}`
    return fn
}

export function required<T> (errMsg?: string): Validator<T> {
    const fn = <Validator<T>>function(val: any): T {
        if (R.isNil(val) || R.isEmpty(val)) {
            throw new Error(errMsg ? errMsg : 'Value required')
        }
        return val
    }
    fn.description = `Required field`
    return fn
}

export function boolean (errMsg?: string): Validator<boolean> {
    const fn = <Validator<boolean>> function (val: any): boolean {
        if (!R.is(Boolean, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be boolean')
        }

        return val
    }
    fn.description = `Must be boolean`
    return fn
}

export function trim (errMsg?: string): Validator<string> {
    const fn = <Validator<string>>function (val: any): string {
        if (!R.is(String, val)) {
            throw new Error('Value must be string')
        }

        return R.trim(val)
    }
    fn.description = `Trip the value`
    return fn
}

export function date (format?: string, errMsg?: string): Validator<Date> {
    const fn = <Validator<Date>>function (val: any): Date {
        let date;
        if (format) {
            date = moment(val, format)
        } else {
            date = moment(val)
        }
        if (!date.isValid()) {
            throw new Error('Invalid date format')
        }
        return date.toDate()
    }
    fn.description = `Must be date.`
    if (format) {
        fn.description += `Format must be ${format}`
    }
    return fn
}

export function inside (list: any[], errMsg?: string): Validator<any> {
    const fn = <Validator<any[]>>function (val: any): any {
        if (!R.contains(val, list)) {
            throw new Error(errMsg ? errMsg : 'Invalid value')
        }
        return val
    }
    fn.description = `Value must in ${list.map(l => l.toString()).join(', ')}`
    return fn
}

export function modelExist (model: any, field?: string, errMsg?: string): Validator<Promise<any>> {
    return async function (val: string | number): Promise<any> {
        if (!field) {
            field = model.primaryKeyField
        }
        const keyValue = isNaN(Number(val)) ? val : Number(val)
        const instance = await model.findOne({
            where: {
                [field]: keyValue
            }
        })
        if (R.isNil(instance)) {
            throw new Error(errMsg ? errMsg : 'Object not found')
        }
        return keyValue
    }
}

export function modelUniqueField (model: any, field?: string, errMsg?: string): Validator<Promise<any>> {
    return async function (val: string | number): Promise<any> {
        if (!field) {
            field = model.primaryKeyField
        }
        const keyValue = isNaN(Number(val)) ? val : Number(val)
        const instance = await model.findOne({
            where: {
                [field]: keyValue
            }
        })
        if (!R.isNil(instance)) {
            throw new Error(errMsg ? errMsg : 'Object already exist')
        }
        return keyValue
    }
}