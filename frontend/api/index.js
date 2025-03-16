"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var API_URL = process.env.EXPO_PUBLIC_API_URL;
var createAxiosInstance = function (token) {
    var axiosInstance = axios_1.default.create({
        baseURL: API_URL,
        headers: __assign({ "Content-Type": "application/json" }, (token && { "Authorization": "Bearer ".concat(token) }))
    });
    return axiosInstance;
};
exports.default = createAxiosInstance;
