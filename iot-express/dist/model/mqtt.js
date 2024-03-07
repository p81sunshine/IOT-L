"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var mqtt = require("mqtt");
const clientId = "iot-server" + Math.random().toString(16).substring(2, 8);
const username = "server";
const password = "123456";
const client = mqtt.connect("mqtts://f3588cc1.ala.cn-hangzhou.emqxsl.cn:8883", {
    clientId,
    username,
    password,
    // ...other options
});
exports.client = client;
client.on("connect", () => {
    console.log("连接成功!");
});
const topic = "testtopic/#";
const qos = 0;
client.subscribe(topic, { qos }, (error) => {
    if (error) {
        console.log("subscribe error:", error);
        return;
    }
    console.log(`Subscribe to topic '${topic}'`);
});
