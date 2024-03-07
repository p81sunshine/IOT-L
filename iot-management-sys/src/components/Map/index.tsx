import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Button, Input, List, Menu, Modal, Space } from "antd";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import dayjs from "dayjs";

const SimpleMap = () => {
  const mapRef = useRef(null);
  const latitude = 30;
  const longitude = 120;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setClickedItem(null); // 每次打开模态框时重置点击项
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [clientID, setClientID] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [clickedItem, setClickedItem] = useState(null); // 添加一个新的状态用来存储点击的item
  const [actualCoordinates, setactualCoordinates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000/api/devices");
      setDeviceData(response.data);
    };

    fetchData();
  }, []);

  const getDeviceData = async (deviceID) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/deviceInfos/${deviceID}`
      );
      const data = response.data;

      if (data.data && data.data.length > 0) {
        const deviceInfos = data.data;

        // 从后端返回的数据中提取坐标和其他信息
        const coordinates = deviceInfos.map((info: any) => ({
          coordinates: info.coordinates,
          alert: info.alert,
          info: info.info,
          time: info.time,
        }));
        console.log(coordinates);

        setCoordinates(coordinates);
        const ac = deviceInfos.map((info) => info.coordinates);
        setactualCoordinates(ac);

        const mapInstance = mapRef.current;
        if (mapInstance != null) {
          // 设置地图中心点为轨迹的第一个点
          mapInstance.flyTo(coordinates[0].coordinates);
          // // 设置缩放级别以适应所有轨迹点
          mapInstance.fitBounds(coordinates.map((info) => info.coordinates));
        }
      } else {
        setCoordinates([]);
      }
    } catch (error) {
      console.error("An error occurred fetching device data", error);
      // 处理错误，例如显示用户提示或日志
    }
  };

  return (
    // Make sure you set the height and width of the map container otherwise the map won't show
    <div>
      <Button
        type="primary"
        onClick={showModal}
        style={{ background: "#1890ff" }}
      >
        Select Device
      </Button>
      <Modal
        title="Device List"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          style: {
            backgroundColor: "blue",
            borderColor: "blue",
            color: "white",
          },
        }}
      >
        <Menu onClick={(e) => setClickedItem(e.key)}>
          {deviceData.map((device: any) => (
            <Menu.Item
              key={device.clientId}
              onClick={() => getDeviceData(device.clientId)}
              style={
                clickedItem === device.id
                  ? { backgroundColor: "blue", color: "white" }
                  : null
              }
            >
              {device.name}
            </Menu.Item>
          ))}
        </Menu>
      </Modal>
      {/* <Space>
        <Input
          allowClear
          type="text"
          value={clientID}
          onChange={(e) => setClientID(e.target.value)}
          placeholder="Please Input ClientID"
        />
        <Button onClick={handleSearch} style={{ background: "#1890f0" }}>
          Search
        </Button>
      </Space> */}
      <MapContainer
        center={[latitude, longitude]}
        zoom={10}
        ref={mapRef}
        style={{ height: "99vh", width: "100vw" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates.map((info: any, index) => (
          <Marker
            key={index}
            position={info.coordinates}
            icon={
              info.alert === 1
                ? new L.Icon({
                    iconUrl: "/3.png",
                    iconSize: [25, 41],
                    iconAnchor: [12.5, 41],
                    popupAnchor: [-3, -56],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94],
                  })
                : new L.Icon({
                    iconUrl: "/4.png",
                    iconSize: [25, 41],
                    iconAnchor: [12.5, 41],
                    popupAnchor: [-3, -56],
                    shadowSize: [68, 95],
                    shadowAnchor: [22, 94],
                  })
            }
          >
            <Popup>
              <div>
                <strong>Alert:</strong> {info.alert}
                <br />
                <strong>Info:</strong> {info.info}
                <br />
                <strong>Reporting Time:</strong>{" "}
                {dayjs(info.time * 1000).format("YYYY-MM-DD HH:mm:ss")}
                <br />
              </div>
            </Popup>
          </Marker>
        ))}
        <Polyline
          positions={coordinates.map((info: any) => info.coordinates)}
          color="red"
          weight={5}
        />
      </MapContainer>
    </div>
  );
};

export default SimpleMap;
