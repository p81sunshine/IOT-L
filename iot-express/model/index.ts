import mongoose, { mongo } from "mongoose";
import userSchema from "./userModel";
const uri =
  "mongodb+srv://lsnfzj:cWfAvUjJAyxxVzHl@cluster0.wvslomd.mongodb.net/?retryWrites=true&w=majority";

async function main() {
  mongoose.connect(uri);
}

main()
  .then(() => {
    console.log("Mogodb ss connected22!");
  })
  .catch(() => {
    console.log("Mogodb connected failed!");
  });

const DeviceSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  clientId: Number,
  category: String,
  description: String,
  createTime: { type: Date, default: Date.now },
});

const DeviceInfoSchema = new mongoose.Schema({
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
const Device = mongoose.model("Device", DeviceSchema);
const DeviceInfo = mongoose.model("DeviceInfo", DeviceInfoSchema);
const User = mongoose.model("User", userSchema);
export { Device, User, DeviceInfo };
