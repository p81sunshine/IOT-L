import datetime

def generate_timestamp(year, month, day):
    # 创建一个datetime对象
    date = datetime.datetime(year, month, day)

    # 将datetime对象转换为时间戳
    timestamp = int(date.timestamp())

    return timestamp

# 生成并打印时间戳
print(generate_timestamp(2023, 12, 28))
