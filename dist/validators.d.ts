export interface Validator<T> {
    (value: any): T;
    description?: string;
}
export declare function minLength<T>(min: number, errMsg?: string): Validator<T>;
export declare function maxLength<T>(max: number, errMsg?: string): Validator<T>;
export declare function string(errMsg?: string): Validator<string>;
export declare function numeric(errMsg?: string): Validator<number>;
export declare function minValue(min?: number, errMsg?: string): Validator<number>;
export declare function maxValue(max: number, errMsg?: string): Validator<number>;
export declare function required<T>(errMsg?: string): Validator<T>;
export declare function boolean(errMsg?: string): Validator<boolean>;
export declare function trim(errMsg?: string): Validator<string>;
export declare function date(format?: string, errMsg?: string): Validator<Date>;
export declare function inside(list: any[], errMsg?: string): Validator<any>;
export declare function modelExist(model: any, field?: string, errMsg?: string): Validator<Promise<any>>;
export declare function modelUniqueField(model: any, field?: string, errMsg?: string): Validator<Promise<any>>;
