import * as R from 'ramda'
import * as moment from 'moment'

export type Validator<T> = (value: any) => T

export function minLength<T> (min: number, errMsg?: string): Validator<T> {
    return function (val: any): T {
        if (R.length(val) < min) {
            throw new Error(errMsg ? errMsg : 'Min length ' + min)
        }

        return val
    }
}

export function maxLength<T> (max: number, errMsg?: string): Validator<T> {
    return function(val: any): T {
        if (R.length(val) > max) {
            throw new Error(errMsg ? errMsg : 'Max length ' + max)
        }

        return val
    }
}

export function string(errMsg?: string): Validator<string> {
    return function (val: any): string {
        if (!R.is(String, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be string')
        }

        return val
    }
}

export function numeric (errMsg?: string): Validator<number> {
    return function(val: any): number {
        if (!R.is(Number, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be numeric')
        }
        return val
    }
}

export function minValue (min?: number, errMsg?: string): Validator<number> {
    return function (val: any): number {
        if (val < min) {
            throw new Error(errMsg ? errMsg : 'Min value ' + min)
        }
        return val
    }
}

export function maxValue (max: number, errMsg?: string): Validator<number> {
    return function (val: any): number {
        if (val > max) {
            throw new Error(errMsg ? errMsg : 'Max value ' + max)
        }

        return val
    }
}

export const required = (errMsg?: string) => val => {
    if (R.isNil(val) || R.isEmpty(val)) {
        throw new Error(errMsg ? errMsg : 'Value required')
    }

    return val
}

export const boolean = (errMsg?: string) => val => {
    if (!R.is(Boolean, val)) {
        throw new Error(errMsg ? errMsg : 'Value must be boolean')
    }

    return val
}

export function trim (errMsg?: string): Validator<string> {
    return function (val: any): string {
        if (!R.is(String, val)) {
            throw new Error('Value must be string')
        }

        return R.trim(val)
    }
}

export function date (format?: string, errMsg?: string): Validator<Date> {
    return function (val: any): Date {
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
}

export function inside (list: any[], errMsg?: string) {
    return function (val: any): any {
        if (!R.contains(val, list)) {
            throw new Error(errMsg ? errMsg : 'Invalid value')
        }
        return val
    }
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