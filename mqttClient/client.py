# # python 3.8

import random
import time
import json
from paho.mqtt import client as mqtt_client

broker = 'f3588cc1.ala.cn-hangzhou.emqxsl.cn'
port = 8883
topic = "iot/device"
username = 'test2'
qos = 0
password = '123456'


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
            client.subscribe(topic, qos)
        else:
            print("Failed to connect, return code %d\n", rc)

    def on_message(client, userdata, msg):
        print(f"收到消息: {msg.payload.decode()} 在主题 '{msg.topic}'")
    # client = mqtt_client.Client(f'python-mqtt-{random.randint(0, 1000)}')
    clientId = f'python-mqtt-{random.randint(0, 1000)}'
    client = mqtt_client.Client(client_id=clientId)
    client.username_pw_set(username, password)
    client.tls_set()
    client.on_connect = on_connect
    client.on_message = on_message


    client.connect(broker, port)
    return client


def publish_user_input(client):
    while True:
        time.sleep(1)
        client_id = input("Enter clientId: ")
        info = input("Enter info: ")
        value = int(input("Enter value: "))
        alert = int(input("Enter alert (1 for true, 0 for false): "))
        lng = float(input("Enter lng: "))
        lat = float(input("Enter lat: "))
        timestamp = int(input("Enter timestamp: "))

        message = {
            "clientId": client_id,
            "info": info,
            "value": value,
            "alert": alert,
            "lng": lng,
            "lat": lat,
            "timestamp": timestamp
        }

        msg = json.dumps(message)
        result = client.publish(topic, msg)
        status = result.rc
        if status == mqtt_client.MQTT_ERR_SUCCESS:
            print(f"Sent message: {msg} to topic: {topic}")
        else:
            print(f"Failed to send message to topic {topic}. Error code: {status}")


def run():
    client = connect_mqtt()
    client.loop_start()
    publish_user_input(client)


if __name__ == '__main__':
    run()
