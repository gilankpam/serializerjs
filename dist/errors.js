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
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationError = (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message, fields) {
        if (message === void 0) { message = 'Validation Error'; }
        var _this = _super.call(this, message) || this;
        _this.fields = fields;
        _this.fields = fields;
        return _this;
    }
    ValidationError.fromSequelizeValidationError = function (args) {
        return new ValidationError();
    };
    return ValidationError;
}(Error));
exports.ValidationError = ValidationError;
//# sourceMappingURL=errors.js.map