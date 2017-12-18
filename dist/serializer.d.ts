import { Field } from './fields';
import { PlainObject } from './types';
export interface Serializer {
    validate(): Promise<any>;
    save(): Promise<any>;
    update(instance: any): Promise<any>;
    toRepresentation(): Promise<any>;
}
export declare type SerializerArgs = {
    data?: any;
    partial?: boolean;
    instance?: any;
    many?: boolean;
    req?: any;
};
export declare abstract class AbstractSerializer implements Serializer {
    protected fields: {
        [s: string]: Field<any>;
    };
    protected data: PlainObject;
    protected partial: boolean;
    protected instance: any;
    protected many: boolean;
    protected req: any;
    protected validatedData: any;
    protected validationErrors: any;
    constructor(args?: SerializerArgs);
    validate(): Promise<any>;
    _removeUndefined(obj: PlainObject): any;
    save(): Promise<any>;
    abstract performSave(validatedData: PlainObject): Promise<any>;
    update(instance: any): Promise<any>;
    abstract performUpdate(instance: any, validatedData: PlainObject): Promise<any>;
    toRepresentation(): Promise<{}>;
    _toRepresentation(instance: any): Promise<{}>;
}
export declare abstract class ModelSerializer extends AbstractSerializer {
    private model;
    abstract modelFields: string[] | string;
    abstract modelFieldExcludes: string[];
    constructor(args: SerializerArgs, model: any);
    _setupModelFields(): void;
    performSave(validatedData: any): Promise<any>;
    _modelValidate(instance: any): Promise<void>;
    performUpdate(instance: any, validatedData: any): Promise<any>;
}
export declare function field(field: Field<any>): (target: any, key: string) => void;
