import bcrypt

password = str.encode("Infra2018!", encoding="UTF-8")
password_hash = bcrypt.hashpw(password, bcrypt.gensalt())
print(password_hash.decode("utf-8"))