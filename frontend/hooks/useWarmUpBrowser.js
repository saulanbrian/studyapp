"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWarmUpBrowser = void 0;
var react_1 = require("react");
var WebBrowser = require("expo-web-browser");
var useWarmUpBrowser = function () {
    (0, react_1.useEffect)(function () {
        WebBrowser.warmUpAsync();
        return function () {
            WebBrowser.coolDownAsync();
        };
    }, []);
};
exports.useWarmUpBrowser = useWarmUpBrowser;
