"use strict";
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
function minLength(min, errMsg) {
    var fn = function (val) {
        if (R.length(val) < min) {
            throw new Error(errMsg ? errMsg : 'Min length ' + min);
        }
        return val;
    };
    fn.description = "Min length of " + min;
    return fn;
}
exports.minLength = minLength;
function maxLength(max, errMsg) {
    var fn = function (val) {
        if (R.length(val) > max) {
            throw new Error(errMsg ? errMsg : 'Max length ' + max);
        }
        return val;
    };
    fn.description = "Max length of " + max;
    return fn;
}
exports.maxLength = maxLength;
function string(errMsg) {
    var fn = function (val) {
        if (!R.is(String, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be string');
        }
        return val;
    };
    fn.description = 'Must be string';
    return fn;
}
exports.string = string;
function numeric(errMsg) {
    var fn = function (val) {
        if (!R.is(Number, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be numeric');
        }
        return val;
    };
    fn.description = "Must be number";
    return fn;
}
exports.numeric = numeric;
function minValue(min, errMsg) {
    var fn = function (val) {
        if (val < min) {
            throw new Error(errMsg ? errMsg : 'Min value ' + min);
        }
        return val;
    };
    fn.description = "Min value of " + min;
    return fn;
}
exports.minValue = minValue;
function maxValue(max, errMsg) {
    var fn = function (val) {
        if (val > max) {
            throw new Error(errMsg ? errMsg : 'Max value ' + max);
        }
        return val;
    };
    fn.description = "Max value of " + max;
    return fn;
}
exports.maxValue = maxValue;
function required(errMsg) {
    var fn = function (val) {
        if (R.isNil(val) || R.isEmpty(val)) {
            throw new Error(errMsg ? errMsg : 'Value required');
        }
        return val;
    };
    fn.description = "Required field";
    return fn;
}
exports.required = required;
function boolean(errMsg) {
    var fn = function (val) {
        if (!R.is(Boolean, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be boolean');
        }
        return val;
    };
    fn.description = "Must be boolean";
    return fn;
}
exports.boolean = boolean;
function trim(errMsg) {
    var fn = function (val) {
        if (!R.is(String, val)) {
            throw new Error('Value must be string');
        }
        return R.trim(val);
    };
    fn.description = "Trim the value";
    return fn;
}
exports.trim = trim;
function date(format, errMsg) {
    var fn = function (val) {
        var date;
        if (format) {
            date = moment(val, format);
        }
        else {
            date = moment(val);
        }
        if (!date.isValid()) {
            throw new Error('Invalid date format');
        }
        return date.toDate();
    };
    fn.description = "Must be date.";
    if (format) {
        fn.description += "Format must be " + format;
    }
    return fn;
}
exports.date = date;
function inside(list, errMsg) {
    var fn = function (val) {
        if (!R.contains(val, list)) {
            throw new Error(errMsg ? errMsg : 'Invalid value');
        }
        return val;
    };
    fn.description = "Value must in " + list.map(function (l) { return l.toString(); }).join(', ');
    return fn;
}
exports.inside = inside;
function modelExist(model, field, errMsg) {
    var fn = function (val) {
        return __awaiter(this, void 0, void 0, function () {
            var keyValue, instance, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!field) {
                            field = model.primaryKeyField;
                        }
                        keyValue = isNaN(Number(val)) ? val : Number(val);
                        return [4 /*yield*/, model.findOne({
                                where: (_a = {},
                                    _a[field] = keyValue,
                                    _a)
                            })];
                    case 1:
                        instance = _b.sent();
                        if (R.isNil(instance)) {
                            throw new Error(errMsg ? errMsg : 'Object not found');
                        }
                        return [2 /*return*/, keyValue];
                }
            });
        });
    };
    fn.description = 'Value must be exist in database';
    return fn;
}
exports.modelExist = modelExist;
function modelUniqueField(model, field, errMsg) {
    var fn = function (val) {
        return __awaiter(this, void 0, void 0, function () {
            var keyValue, instance, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!field) {
                            field = model.primaryKeyField;
                        }
                        keyValue = isNaN(Number(val)) ? val : Number(val);
                        return [4 /*yield*/, model.findOne({
                                where: (_a = {},
                                    _a[field] = keyValue,
                                    _a)
                            })];
                    case 1:
                        instance = _b.sent();
                        if (!R.isNil(instance)) {
                            throw new Error(errMsg ? errMsg : 'Object already exist');
                        }
                        return [2 /*return*/, keyValue];
                }
            });
        });
    };
    fn.description = 'Value must be unique in database';
    return fn;
}
exports.modelUniqueField = modelUniqueField;
//# sourceMappingURL=validators.js.map