"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("./validator"));
const cloud_data_json_1 = __importDefault(require("./cloud-data.json"));
const config_json_1 = __importDefault(require("./config.json"));
const validator = new validator_1.default(cloud_data_json_1.default, config_json_1.default);
if (validator.validate()) {
    console.log('All configurations are valid.');
}
else {
    console.log('One or more configurations are invalid.');
}
