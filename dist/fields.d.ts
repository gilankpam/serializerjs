import * as V from './validators';
import { Serializer, SerializerArgs } from './serializer';
export interface SerializerClass {
    new (args: SerializerArgs): Serializer;
}
export interface Field<T> {
    toIntervalValue: (value: any) => T;
    toRepresentation: (value: T) => any;
    validate: (value: any) => Promise<T>;
    blank?: boolean;
    nullable?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    source?: string;
    defaultValue?: any;
    validators?: V.Validator<any>[];
}
export declare type FieldOptions = {
    blank?: boolean;
    nullable?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    source?: string;
    validators?: V.Validator<any>[];
    defaultValue?: any;
    [key: string]: any;
};
export declare abstract class AbstractField<T> implements Field<T> {
    blank: boolean;
    nullable: boolean;
    readOnly: boolean;
    writeOnly: boolean;
    source: string;
    validators: V.Validator<T>[];
    defaultValue: any;
    constructor(options?: FieldOptions);
    abstract toIntervalValue(value: any): T;
    abstract toRepresentation(value: T): any;
    validate(value: any): Promise<T>;
    _reduce(value: any, validators: V.Validator<any>[]): Promise<any>;
}
export declare class StringField extends AbstractField<string> {
    constructor(options?: FieldOptions);
    toIntervalValue(value: any): string;
    toRepresentation(value: string): any;
}
export declare class NumericField extends AbstractField<number> {
    constructor(options?: FieldOptions);
    toIntervalValue(value: any): number;
    toRepresentation(value: number): any;
}
export declare class DateTimeField extends AbstractField<Date> {
    protected dateFormat: string;
    constructor(options?: FieldOptions);
    toIntervalValue(value: any): Date;
    toRepresentation(value: Date): any;
}
export declare abstract class ArrayField<T> extends AbstractField<T[]> {
    toIntervalValue(value: any[]): T[];
    abstract toInternalValueElem(value: any): T;
    toRepresentation(value: T[]): any[];
    abstract toRepresentationElem(value: T): any;
}
export declare class NumericArrayField extends ArrayField<number> {
    toInternalValueElem(value: any): number;
    toRepresentationElem(value: number): any;
}
export declare class SerializerField extends AbstractField<Serializer> {
    protected serializer: SerializerClass;
    constructor(options?: FieldOptions);
    toRepresentation(value: Serializer): Promise<any>;
    toIntervalValue(value: any): Serializer;
}
export declare class ChoiceField<T> extends AbstractField<T> {
    constructor(options?: FieldOptions);
    toRepresentation(value: any): T;
    toIntervalValue(value: any): T;
}
export declare class ModelReferenceField extends AbstractField<any> {
    model: any;
    field: string;
    constructor(options?: FieldOptions);
    toRepresentation(value: any): any;
    toIntervalValue(value: any): any;
}
