"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("ramda");
var errors_1 = require("./errors");
var fields_1 = require("./fields");
var AbstractSerializer = (function () {
    function AbstractSerializer(args) {
        if (args === void 0) { args = {}; }
        this.validatedData = null;
        this.validationErrors = null;
        var _a = args.data, data = _a === void 0 ? null : _a, _b = args.partial, partial = _b === void 0 ? false : _b, _c = args.instance, instance = _c === void 0 ? null : _c, _d = args.many, many = _d === void 0 ? false : _d, _e = args.req, req = _e === void 0 ? null : _e;
        this.data = data;
        this.partial = partial;
        this.instance = instance;
        this.many = many;
        this.req = req;
    }
    AbstractSerializer.prototype.validate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var validatedData, validationErrors, _i, _a, fieldName, fieldData, field_1, validatedValue, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.data === null)
                            throw new Error('Data cannot be null');
                        validatedData = {};
                        validationErrors = {};
                        _i = 0, _a = Object.keys(this.fields);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        fieldName = _a[_i];
                        fieldData = this.data[fieldName];
                        if (this.partial && fieldData === undefined) {
                            return [3 /*break*/, 5];
                        }
                        field_1 = this.fields[fieldName];
                        // Read Only fields, skip
                        if (field_1.readOnly === true) {
                            return [3 /*break*/, 5];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, field_1.validate(fieldData)];
                    case 3:
                        validatedValue = _b.sent();
                        validatedData[fieldName] = validatedValue;
                        this[fieldName] = validatedValue;
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _b.sent();
                        validationErrors[fieldName] = err_1.message;
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        this.validatedData = this._removeUndefined(validatedData);
                        if (!R.isEmpty(validationErrors)) {
                            this.validationErrors = validationErrors;
                            throw new errors_1.ValidationError(null, validationErrors);
                        }
                        return [2 /*return*/, this.validatedData];
                }
            });
        });
    };
    AbstractSerializer.prototype._removeUndefined = function (obj) {
        return R.filter(function (k) { return k !== undefined; }, obj);
    };
    AbstractSerializer.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.validatedData === null)
                            throw new Error('Serializer must be validated');
                        if (this.validationErrors !== null)
                            throw new Error('Cannot save when validation error');
                        return [4 /*yield*/, this.performSave(this.validatedData)];
                    case 1:
                        instance = _a.sent();
                        this.instance = instance;
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    AbstractSerializer.prototype.update = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.validatedData === null)
                            throw new Error('Serializer must be validated');
                        if (this.validationErrors !== null)
                            throw new Error('Cannot save when validation error');
                        return [4 /*yield*/, this.performUpdate(instance, this.validatedData)];
                    case 1:
                        updatedInstance = _a.sent();
                        this.instance = updatedInstance;
                        return [2 /*return*/, updatedInstance];
                }
            });
        });
    };
    AbstractSerializer.prototype.toRepresentation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var instances, _i, _a, instance, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (this.instance === null) {
                            throw new Error('Instance cannot be null');
                        }
                        if (!(this.many === true)) return [3 /*break*/, 5];
                        instances = [];
                        _i = 0, _a = this.instance;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        instance = _a[_i];
                        _c = (_b = instances).push;
                        return [4 /*yield*/, this._toRepresentation(instance)];
                    case 2:
                        _c.apply(_b, [_d.sent()]);
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, instances];
                    case 5: return [4 /*yield*/, this._toRepresentation(this.instance)];
                    case 6: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    AbstractSerializer.prototype._toRepresentation = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var json, _i, _a, fieldName, field_2, value, fn, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        json = {};
                        _i = 0, _a = Object.keys(this.fields);
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                        fieldName = _a[_i];
                        field_2 = this.fields[fieldName];
                        if (field_2.writeOnly === true)
                            return [3 /*break*/, 8];
                        value = void 0;
                        if (!!R.isNil(field_2.source)) return [3 /*break*/, 5];
                        fn = this[field_2.source];
                        if (!(typeof fn === 'function')) return [3 /*break*/, 3];
                        return [4 /*yield*/, fn.call(this, instance, this.validatedData)];
                    case 2:
                        value = _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        value = instance[field_2.source];
                        _d.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        value = instance[fieldName];
                        _d.label = 6;
                    case 6:
                        _b = json;
                        _c = fieldName;
                        return [4 /*yield*/, field_2.toRepresentation(value)];
                    case 7:
                        _b[_c] =
                            _d.sent();
                        _d.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/, json];
                }
            });
        });
    };
    return AbstractSerializer;
}());
exports.AbstractSerializer = AbstractSerializer;
// For Sequelize Model
var ModelSerializer = (function (_super) {
    __extends(ModelSerializer, _super);
    function ModelSerializer(args, model) {
        var _this = _super.call(this, args) || this;
        _this.model = model;
        _this._setupModelFields();
        return _this;
    }
    ModelSerializer.prototype._setupModelFields = function () {
        var modelAttributes = this.model.attributes;
        var modelFields;
        if (this.modelFields === 'all' || modelFields === undefined) {
            // Filter model atributes based on fields
            modelFields = Object.keys(this.model.attributes);
        }
        else {
            modelFields = this.modelFields;
        }
        if (!R.isEmpty(this.modelFieldExcludes)) {
            modelFields = R.difference(modelFields, this.modelFieldExcludes);
        }
        this.modelFields = modelFields;
        var fields = this.fields;
        for (var _i = 0, modelFields_1 = modelFields; _i < modelFields_1.length; _i++) {
            var fieldName = modelFields_1[_i];
            if (this.fields[fieldName]) {
                fields[fieldName] = this.fields[fieldName];
            }
            else {
                fields[fieldName] = getModelField(modelAttributes[fieldName]);
            }
        }
        this.fields = fields;
    };
    ModelSerializer.prototype.performSave = function (validatedData) {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = this.model.build(validatedData);
                        return [4 /*yield*/, this._modelValidate(instance)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, instance.save()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ModelSerializer.prototype._modelValidate = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instance.validate()];
                    case 1:
                        err = _a.sent();
                        if (err !== null && err.name === 'SequelizeValidationError') {
                            throw errors_1.ValidationError.fromSequelizeValidationError(err);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ModelSerializer.prototype.performUpdate = function (instance, validatedData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, instance.update(validatedData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ModelSerializer;
}(AbstractSerializer));
exports.ModelSerializer = ModelSerializer;
function getModelField(attribute) {
    var _a = attribute.type, _length = _a._length, type = _a.key;
    var _autoGenerated = attribute._autoGenerated, _b = attribute.allowNull, allowNull = _b === void 0 ? true : _b, defaultValue = attribute.defaultValue;
    var nullable = _autoGenerated || allowNull;
    switch (type) {
        case 'INTEGER':
            return new fields_1.NumericField({ defaultValue: defaultValue, nullable: nullable, blank: nullable });
        case 'STRING':
        case 'TEXT':
            return new fields_1.StringField({ defaultValue: defaultValue, nullable: nullable, blank: nullable, maxLength: _length });
        case 'DATE':
            return new fields_1.DateTimeField({ defaultValue: defaultValue, nullable: nullable, blank: nullable });
        case 'ENUM':
            var values = attribute.values;
            return new fields_1.ChoiceField({ defaultValue: defaultValue, nullable: nullable, blank: nullable, choices: values });
        default:
            throw new Error('Invalid attribute type: ' + type);
    }
}
function field(field) {
    return function (target, key) {
        if (target.fields === undefined) {
            target.fields = {};
        }
        target.fields[key] = field;
    };
}
exports.field = field;
//# sourceMappingURL=serializer.js.map