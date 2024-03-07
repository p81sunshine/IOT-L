from pymongo import MongoClient
from deviceInfoDataGenerate import generate_random_data 

# 创建一个MongoClient实例
client = MongoClient('mongodb+srv://lsnfzj:cWfAvUjJAyxxVzHl@cluster0.wvslomd.mongodb.net/?retryWrites=true&w=majority')

# 获取数据库
db = client['test']

# 获取collections
collection = db['deviceinfos']

# 要插入的数据
data = generate_random_data(20)
print(data)

# 插入数据
collection.insert_many(data)
