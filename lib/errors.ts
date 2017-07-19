import { PlainObject } from './types'

export class ValidationError extends Error {
    static fromSequelizeValidationError (args?: any) : ValidationError {
        return new ValidationError()
    }
    constructor(message: string = 'Validation Error', public fields?: PlainObject) {
        super(message)
        this.fields = fields
    }
}