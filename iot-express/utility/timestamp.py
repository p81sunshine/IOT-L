import datetime
# 获取用户输入
timestamp_str = input("Please enter a timestamp: ")

# 将字符串转换为整数
timestamp = int(timestamp_str)

# 将时间戳转换为datetime对象
date_time = datetime.datetime.fromtimestamp(timestamp)

# 打印日期和时间
print("Date: ", date_time.date())
print("Time: ", date_time.time())
