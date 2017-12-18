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
var moment = require("moment");
var V = require("./validators");
var AbstractField = /** @class */ (function () {
    function AbstractField(options) {
        if (options === void 0) { options = {}; }
        this.blank = false;
        this.nullable = false;
        this.readOnly = false;
        this.writeOnly = false;
        this.source = null;
        this.validators = [];
        this.blank = options.blank || false;
        this.nullable = options.nullable || false;
        this.readOnly = options.readOnly || false;
        this.writeOnly = options.writeOnly || false;
        this.validators = options.validators || [];
        this.source = options.source || null;
        this.defaultValue = options.defaultValue || null;
    }
    AbstractField.prototype.validate = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var intervalValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Value is null
                        if (value === null || (Array.isArray(value) && value.length === 0)) {
                            if (this.nullable)
                                return [2 /*return*/, value];
                            throw new Error('This field cannot be null');
                        }
                        // Value is not present or blank
                        if (value === undefined) {
                            if (this.blank)
                                return [2 /*return*/, value];
                            if (!R.isNil(this.defaultValue)) {
                                value = this.defaultValue;
                            }
                            else {
                                throw new Error('This field cannot be blank');
                            }
                        }
                        intervalValue = this.toIntervalValue(value);
                        return [4 /*yield*/, this._reduce(intervalValue, this.validators)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AbstractField.prototype._reduce = function (value, validators) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, R.reduce(function (value, validator) { return __awaiter(_this, void 0, void 0, function () {
                        var val;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, value];
                                case 1:
                                    val = _a.sent();
                                    return [2 /*return*/, validator(val)];
                            }
                        });
                    }); }, value, validators)];
            });
        });
    };
    return AbstractField;
}());
exports.AbstractField = AbstractField;
var StringField = /** @class */ (function (_super) {
    __extends(StringField, _super);
    function StringField(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        var minLength = options.minLength, maxLength = options.maxLength, _a = options.validators, validators = _a === void 0 ? [] : _a;
        if (minLength) {
            _this.validators.push(V.minLength(minLength));
        }
        if (maxLength) {
            _this.validators.push(V.maxLength(maxLength));
        }
        _this.validators.push(V.trim());
        return _this;
    }
    StringField.prototype.toIntervalValue = function (value) {
        return V.string()(value);
    };
    StringField.prototype.toRepresentation = function (value) {
        return value;
    };
    return StringField;
}(AbstractField));
exports.StringField = StringField;
var NumericField = /** @class */ (function (_super) {
    __extends(NumericField, _super);
    function NumericField(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        var numericValidators = [V.numeric()];
        var minValue = options.minValue, maxValue = options.maxValue, _a = options.validators, validators = _a === void 0 ? [] : _a;
        if (minValue) {
            _this.validators.push(V.minValue(minValue));
        }
        if (maxValue) {
            _this.validators.push(V.maxValue(maxValue));
        }
        return _this;
    }
    NumericField.prototype.toIntervalValue = function (value) {
        return V.numeric()(value);
    };
    NumericField.prototype.toRepresentation = function (value) {
        return value;
    };
    return NumericField;
}(AbstractField));
exports.NumericField = NumericField;
var DateTimeField = /** @class */ (function (_super) {
    __extends(DateTimeField, _super);
    function DateTimeField(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        var format = options.format;
        if (format) {
            _this.dateFormat = format;
        }
        return _this;
    }
    DateTimeField.prototype.toIntervalValue = function (value) {
        return V.date(this.dateFormat)(value);
    };
    DateTimeField.prototype.toRepresentation = function (value) {
        if (R.isNil(value))
            return value;
        if (!this.dateFormat) {
            return moment(value).format();
        }
        try {
            return moment(value).format(this.dateFormat);
        }
        catch (err) {
            return value.toString();
        }
    };
    return DateTimeField;
}(AbstractField));
exports.DateTimeField = DateTimeField;
var ArrayField = /** @class */ (function (_super) {
    __extends(ArrayField, _super);
    function ArrayField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArrayField.prototype.toIntervalValue = function (value) {
        if (!Array.isArray(value)) {
            throw new Error('Invalid array');
        }
        return value.map(this.toInternalValueElem);
    };
    ArrayField.prototype.toRepresentation = function (value) {
        return value.map(this.toRepresentationElem);
    };
    return ArrayField;
}(AbstractField));
exports.ArrayField = ArrayField;
var NumericArrayField = /** @class */ (function (_super) {
    __extends(NumericArrayField, _super);
    function NumericArrayField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumericArrayField.prototype.toInternalValueElem = function (value) {
        return V.numeric()(value);
    };
    NumericArrayField.prototype.toRepresentationElem = function (value) {
        return value;
    };
    return NumericArrayField;
}(ArrayField));
exports.NumericArrayField = NumericArrayField;
var SerializerField = /** @class */ (function (_super) {
    __extends(SerializerField, _super);
    function SerializerField(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        var serializer = options.serializer;
        if (!serializer)
            throw new Error('Serializer cannot empty');
        _this.serializer = serializer;
        return _this;
    }
    SerializerField.prototype.toRepresentation = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (R.isNil(value)) {
                            return [2 /*return*/, value];
                        }
                        return [4 /*yield*/, (new this.serializer({ instance: value })).toRepresentation()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SerializerField.prototype.toIntervalValue = function (value) {
        throw new Error('Not implemented');
    };
    return SerializerField;
}(AbstractField));
exports.SerializerField = SerializerField;
var ChoiceField = /** @class */ (function (_super) {
    __extends(ChoiceField, _super);
    function ChoiceField(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        var choices;
        choices = options.choices;
        if (R.isEmpty(choices))
            throw new Error('Choices can\'t be empty');
        _this.validators.push(V.inside(choices));
        return _this;
    }
    ChoiceField.prototype.toRepresentation = function (value) {
        return value;
    };
    ChoiceField.prototype.toIntervalValue = function (value) {
        return value;
    };
    return ChoiceField;
}(AbstractField));
exports.ChoiceField = ChoiceField;
var ModelReferenceField = /** @class */ (function (_super) {
    __extends(ModelReferenceField, _super);
    function ModelReferenceField(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        var model = options.model, field = options.field;
        if (!model)
            throw new Error('Model can\'t be empty');
        _this.model = model;
        _this.field = field;
        _this.validators.push(V.modelExist(model, field));
        return _this;
    }
    ModelReferenceField.prototype.toRepresentation = function (value) {
        return value;
    };
    ModelReferenceField.prototype.toIntervalValue = function (value) {
        return value;
    };
    return ModelReferenceField;
}(AbstractField));
exports.ModelReferenceField = ModelReferenceField;
//# sourceMappingURL=fields.js.map