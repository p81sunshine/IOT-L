import { Device, User, DeviceInfo } from "./model";
import express, { Response, Request, NextFunction } from "express";

var createError = require("http-errors");
// var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
// var MongoClient =
require("./model/index");

var app = express();
const cors = require("cors"); // 导入cors中间件
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// mqtt part
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
client.on("connect", () => {
  console.log("更新连接成功!");
});

const topic = "iot/device";
const qos = 0;

client.subscribe(topic, { qos }, (error: any) => {
  if (error) {
    console.log("subscribe error:", error);
    return;
  }
  console.log(`Subscribe to topic '${topic}'`);
});

const payload = "nodejs mqtt test";

client.on("message", (topic: any, payload: { toString: () => any }) => {
  const deviceInfo = JSON.parse(payload.toString());
  const clientId = deviceInfo.clientId;
  const info = deviceInfo.info;
  const value = deviceInfo.value;
  const alert = deviceInfo.alert;
  const lng = deviceInfo.lng;
  const lat = deviceInfo.lat;
  const timestamp = deviceInfo.timestamp;
  console.log("ssdeviceInfo", deviceInfo);
  console.log("alert", alert);

  DeviceInfo.findOne({
    clientId,
    timestamp,
  })
    .then((data) => {
      if (data) {
        console.log("This device info has already been saved.");
      } else {
        const newDeviceInfo = new DeviceInfo({
          clientId,
          info,
          value,
          alert,
          lng,
          lat,
          timestamp,
        });
        newDeviceInfo
          .save()
          .then(() => console.log("aaaaaDevice info saved successfully"))
          .catch((err) => console.error("Error saving device info:", err));
      }
    })
    .catch((error) => console.error("Error checking device info:", error));
});

//

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.get("/api/devices", async (req, res) => {
  try {
    // 从数据库中获取所有设备数据
    const devices = await Device.find();
    console.log(devices);
    res.json(devices); // 将设备数据以JSON格式发送给前端
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "An error occurred while fetching devices" });
  }
});

app.get("/api/statistic/infoCount", async (req, res) => {
  try {
    const messagesCountPerDay = await DeviceInfo.aggregate([
      {
        $addFields: {
          date: {
            $toDate: { $multiply: ["$timestamp", 1000] },
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log("messagesCountPerDay", messagesCountPerDay);
    res.json(
      messagesCountPerDay.map((item) => ({ date: item._id, count: item.count }))
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/statistic/createStat", async (req, res) => {
  try {
    const deviceStats = await Device.aggregate([
      {
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createTime" },
            // Assuming 'createdAt' field in your device document records the creation datetime of a device
          },
        },
      },
      {
        $group: {
          _id: "$date",
          createdDevice: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          createdDevice: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    if (!deviceStats) throw Error("No device stats available.");

    // send final deviceStats
    res.status(200).json(deviceStats);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});
app.get("/api/statistic/onlineStat", async (req, res) => {
  try {
    const offlineThreshold = Date.now() / 1000 - 30 * 24 * 60 * 60;

    const Onlinedevices = await DeviceInfo.aggregate([
      { $match: { timestamp: { $gt: offlineThreshold } } },
      { $group: { _id: "$clientId" } },
    ]);

    const totalDevicesCount = await Device.countDocuments();

    const onlineDevicesCount = Onlinedevices.length;

    const offlineDevicesCount = totalDevicesCount - onlineDevicesCount;

    const data = [
      { name: "Online Device", count: onlineDevicesCount },
      { name: "Offline Device", count: offlineDevicesCount },
    ];

    res.json(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/statistic/alertCount", async (req: Request, res: Response) => {
  try {
    const alertCounts = await DeviceInfo.aggregate([
      {
        $group: {
          _id: "$alert",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          alert: "$_id",
          count: 1,
        },
      },
    ]);

    res.json(alertCounts);
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching alert counts" });
  }
});
app.get("/api/alerts/daily", async (req: Request, res: Response) => {
  try {
    const dailyAlertCounts = await DeviceInfo.aggregate([
      {
        $project: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: { $multiply: ["$timestamp", 1000] } },
            },
          },
          alert: 1,
        },
      },
      {
        $group: {
          _id: { date: "$date", alert: "$alert" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          alerts: {
            $push: {
              alert: "$_id.alert",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          alertCount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$alerts",
                      as: "item",
                      cond: { $eq: ["$$item.alert", 1] },
                    },
                  },
                  0,
                ],
              },
              { count: 0 },
            ],
          },
          noAlertCount: {
            $ifNull: [
              {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$alerts",
                      as: "item",
                      cond: { $eq: ["$$item.alert", 0] },
                    },
                  },
                  0,
                ],
              },
              { count: 0 },
            ],
          },
        },
      },
      {
        $project: {
          date: 1,
          alertCount: "$alertCount.count",
          noAlertCount: "$noAlertCount.count",
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    res.json(dailyAlertCounts);
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching daily alert counts" });
  }
});
app.get("/api/deviceData", async (req, res) => {
  try {
    // 从数据库中获取所有设备数据
    const deviceData = await DeviceInfo.find();
    console.log(deviceData);
    res.json(deviceData); // 将设备数据以JSON格式发送给前端
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "An error occurred while fetching devices" });
  }
});
// app.get("/api/deviceInfos/:clientID", async (req, res) => {
//   try {
//     const coordinates = await DeviceInfo.find({
//       clientId: req.params.clientID,
//     }).select("lat lng -_id");
//     console.log("coordinates", coordinates);
//     res.json({ coordinates: coordinates.map((doc) => [doc.lat, doc.lng]) });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "An error occurred fetching coordinates" });
//   }
// });
app.get("/api/deviceInfos/:clientID", async (req, res) => {
  try {
    const deviceInfos = await DeviceInfo.find({
      clientId: req.params.clientID,
    }).select("lat lng alert info timestamp -_id"); // 选择lat、lng、alert、info和time字段

    const data = deviceInfos.map((doc) => ({
      coordinates: [doc.lat, doc.lng],
      alert: doc.alert,
      info: doc.info,
      time: doc.timestamp,
    }));

    console.log("data", data);
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred fetching coordinates" });
  }
});

app.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log("req.body", req.body);
  const newUser = new User({ username, email, password });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while creating user" });
  }
});

app.post("/reset", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Hash the new password before saving it to the database

    const user = await User.findOneAndUpdate(
      { email },
      { password: password },
      { new: true }
    );

    if (!user) {
      return res.json({ status: 0 });
    }

    res.json({ status: 1 });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while resetting password" });
  }
});
// 用户传来email和password信息，查询数据库中是否有相同的email，如果有则查询密码是否匹配，如果匹配则返回登录成功1，否则返回密码错误(2)
// 如果email不存在，返回3
app.post("/login", async (req: Request, res: Response) => {
  try {
    console.log("req.body", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log(user);
    if (!user) {
      return res.json({ status: 2 });
    }

    const isPasswordMatch = password == user.password;

    if (!isPasswordMatch) {
      return res.json({ status: 3 });
    }

    return res.json({ status: 1, username: user.username });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
});
app.post("/checkDuplicate", async (req: Request, res: Response) => {
  // 前端传回来username和email数据，查询数据库中是否有相同的username或者email，返回usernameExists和emailExists两个字段
  try {
    const { username, email } = req.body;

    const usernameId = await User.exists({ username });
    const emailId = await User.exists({ email });
    const usernameExists = usernameId ? 1 : 0;
    const emailExists = emailId ? 1 : 0;

    console.log("usernameExists", usernameExists);
    console.log("emailExists", emailExists);
    res.json({ usernameExists, emailExists });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "An error occurred while checking existence" });
  }
});
// 例如，假设你的设备模型为 Device，设备的唯一标识字段为 clientId

app.put("/api/edit/:clientId", async (req, res) => {
  const clientId = req.params.clientId;
  const { name, category, description } = req.body;

  try {
    // 根据 clientId 更新对应的设备行，注意不修改 createTime 字段
    await Device.findOneAndUpdate(
      { clientId: clientId },
      { name, category, description },
      { new: true }
    );

    res.json({ success: true, message: "Device updated successfully" });
  } catch (error) {
    console.error("Error updating device:", error);
    res.status(500).json({ success: false, message: "Error updating device" });
  }
});

app.delete("/delete/:clientId", async (req, res) => {
  const clientId = req.params.clientId;

  try {
    await Device.findOneAndDelete({ clientId: clientId });

    res.json({ success: true, message: "Device deleted successfully" });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ success: false, message: "Error deleting device" });
  }
});

app.post("/api/devices", async (req: Request, res: Response) => {
  try {
    // 从请求体中获取前端发送的数据
    const { name, category, description, createTime } = req.body;
    console.log("req.body", req.body);
    const deviceCount = await Device.countDocuments();
    // 创建新的设备实例
    const newDevice = new Device({
      clientId: deviceCount + 1,
      name,
      category,
      description,
      createTime,
    });

    try {
      await newDevice.save();
      // 发送成功响应
      res.status(201).json({ message: "Device created successfully" });
    } catch (error: any) {
      // 处理 name重复错误
      if (error.code === 11000 && error.message.includes("name")) {
        // 处理name重复错误
        res.status(400).json({
          error: "Device name already exists",
        });
      } else {
        res.status(500).json({
          error: "An error occurred while creating device",
        });
      }
    }
    // 将设备保存到数据库
    await newDevice.save();
  } catch (error) {
    console.error("Error:", error);
    // 发送错误响应
    res.status(500).json({ error: "An error occurred while creating device" });
  }
});

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.listen("3000", () => {
  console.log("server start at 3000");
});
module.exports = app;
