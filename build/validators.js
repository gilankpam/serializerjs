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
    return function (val) {
        if (R.length(val) < min) {
            throw new Error(errMsg ? errMsg : 'Min length ' + min);
        }
        return val;
    };
}
exports.minLength = minLength;
function maxLength(max, errMsg) {
    return function (val) {
        if (R.length(val) > max) {
            throw new Error(errMsg ? errMsg : 'Max length ' + max);
        }
        return val;
    };
}
exports.maxLength = maxLength;
function string(errMsg) {
    return function (val) {
        if (!R.is(String, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be string');
        }
        return val;
    };
}
exports.string = string;
function numeric(errMsg) {
    return function (val) {
        if (!R.is(Number, val)) {
            throw new Error(errMsg ? errMsg : 'Value must be numeric');
        }
        return val;
    };
}
exports.numeric = numeric;
function minValue(min, errMsg) {
    return function (val) {
        if (val < min) {
            throw new Error(errMsg ? errMsg : 'Min value ' + min);
        }
        return val;
    };
}
exports.minValue = minValue;
function maxValue(max, errMsg) {
    return function (val) {
        if (val > max) {
            throw new Error(errMsg ? errMsg : 'Max value ' + max);
        }
        return val;
    };
}
exports.maxValue = maxValue;
exports.required = function (errMsg) { return function (val) {
    if (R.isNil(val) || R.isEmpty(val)) {
        throw new Error(errMsg ? errMsg : 'Value required');
    }
    return val;
}; };
exports.boolean = function (errMsg) { return function (val) {
    if (!R.is(Boolean, val)) {
        throw new Error(errMsg ? errMsg : 'Value must be boolean');
    }
    return val;
}; };
function trim(errMsg) {
    return function (val) {
        if (!R.is(String, val)) {
            throw new Error('Value must be string');
        }
        return R.trim(val);
    };
}
exports.trim = trim;
function date(format, errMsg) {
    return function (val) {
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
}
exports.date = date;
function inside(list, errMsg) {
    return function (val) {
        if (!R.contains(val, list)) {
            throw new Error(errMsg ? errMsg : 'Invalid value');
        }
        return val;
    };
}
exports.inside = inside;
function modelExist(model, field, errMsg) {
    return function (val) {
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
}
exports.modelExist = modelExist;
