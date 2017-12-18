import { PlainObject } from './types';
export declare class ValidationError extends Error {
    fields: PlainObject;
    static fromSequelizeValidationError(args?: any): ValidationError;
    constructor(message?: string, fields?: PlainObject);
}
