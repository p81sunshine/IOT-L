"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceInfo = exports.User = exports.Device = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("./userModel"));
const uri = "mongodb+srv://lsnfzj:cWfAvUjJAyxxVzHl@cluster0.wvslomd.mongodb.net/?retryWrites=true&w=majority";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        mongoose_1.default.connect(uri);
    });
}
main()
    .then(() => {
    console.log("Mogodb ss connected22!");
})
    .catch(() => {
    console.log("Mogodb connected failed!");
});
const DeviceSchema = new mongoose_1.default.Schema({
    name: { type: String, unique: true },
    clientId: Number,
    category: String,
    description: String,
    createTime: { type: Date, default: Date.now },
});
const DeviceInfoSchema = new mongoose_1.default.Schema({
    clientId: {
        type: String,
    },
    info: {
        type: String,
    },
    value: {
        type: Number,
    },
    alert: {
        type: Number,
    },
    lng: {
        type: Number,
    },
    lat: {
        type: Number,
    },
    timestamp: {
        type: Number,
    },
});
const Device = mongoose_1.default.model("Device", DeviceSchema);
exports.Device = Device;
const DeviceInfo = mongoose_1.default.model("DeviceInfo", DeviceInfoSchema);
exports.DeviceInfo = DeviceInfo;
const User = mongoose_1.default.model("User", userModel_1.default);
exports.User = User;
