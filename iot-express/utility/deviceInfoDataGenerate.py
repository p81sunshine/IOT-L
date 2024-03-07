import json
import random
import string

def generate_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

def generate_random_data(num_data):
    data = []
    for i in range(num_data):
        data.append({
            "clientId": str(random.randint(1, 5)),
            "info": generate_random_string(10),
            "value": random.randint(100, 999),
            "alert": random.randint(0, 1),
            "lng": round(random.uniform(120, 121), 2),
            "lat": round(random.uniform(30, 31), 2),
            "timestamp": random.randint(1701360000, 1703001600)
        })
    return data

if __name__ == "__main__":
    num_data = 10
    print(generate_random_data(num_data))
