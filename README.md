# 用户手册 

## 运行环境

前端：react + ant design library

后端：express.js

mqtt: 使用了emqx在线物联网设备管理（https://www.emqx.com/zh）

数据库： 使用了在线的 mongodb 服务网站(https://www.mongodb.com/)

### docker 运行

进入到有`docker-compose.yml` 文件夹，运行命令：`docker-compose up` ，即可build镜像，并且运行镜像。

其中前端的端口是`8080` ，后端的端口是`3000` 。

### 非docker 运行

运行`npm install` ，之后运行`npm run dev` 即可。

### 发送设备信息

> 由于发送设备的client只是一个简单的python脚本，所以并未在docker中打包

在`client` 文件夹下有一个python脚本文件，首先通过

- `pip install -r requirements.txt`  这个命令安装所需要的包
- 再通过python3 client根据提示进行输入相关的信息

![image-20231230162631035](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230162631035.png)



## 功能介绍

### 用户管理界面

默认主页为登陆界面

![image-20231230142236847](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230142236847.png)



可以点击`register now` 进入到注册界面

![image-20231230142405343](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230142405343.png)

注册界面对用户输入的信息进行格式验证

![image-20231230142444995](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230142444995.png)

恢复密码界面

<img src="C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230142601454.png" alt="image-20231230142601454" style="zoom:67%;" />

进入主界面之后，点击logout可以

![image-20231230145109789](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230145109789.png)

### 主界面

主界面展示了设备总数，在线总数（online定义为在30天内发送消息的设备），收到的消息的数量，还有登陆的用户名以及邮箱信息。上方最右侧展示了项目的logo。

下方左侧用一个饼状图展示了在线与不在线的设备比例，下方右侧展示了收到消息之中alert和没有alert的比例。

![image-20231230143040898](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230143040898.png)

### 设备管理界面

下图展示了我们所管理的所有设备：

![image-20231230143539272](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230143539272.png)

点击edit，进入编辑界面

![image-20231230143920883](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230143920883.png)

点击删除之后会进行确认，确认之后即可删除。

![image-20231230144140964](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230144140964.png)

### 地图界面

进入Map界面之后，默认没有选中设备，没有轨迹显示。

![image-20231230144226666](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230144226666.png)

点击`select device` 界面选择具体的设备，点击对应的设备之后，地图会自适应到相应的轨迹

![image-20231230144352659](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230144352659.png)

地图展示的时候会对返回的设备信息根据alert级别展示不同的颜色，绿色的alert=0，黄色的alert=1.

![image-20231230144544447](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230144544447.png)

点击具体的轨迹标记点，可以查看相应设备返回的信息，包括alert,info还有reporting time.

![image-20231230144840370](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230144840370.png)

### 设备返回的信息

![image-20231230144948360](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230144948360.png)

### 统计界面

包含三个信息图：

第一个图是设备每日返回信息的数量和日期相关的histogram，第二个图是设备创建设备数量和日期的条形统计图，第三个图

![image-20231230151117631](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230151117631.png)

![image-20231230151131388](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230151131388.png)

### 

### 发送设备信息

> 由于发送设备的client只是一个简单的python脚本，所以并未在docker中打包

在`client` 文件夹下有一个python脚本文件，首先通过

- `pip install -r requirements.txt`  这个命令安装所需要的包
- 再通过python3 client根据提示进行输入相关的信息

![image-20231230162631035](C:\Users\winston\AppData\Roaming\Typora\typora-user-images\image-20231230162631035.png)

