import os
import webapp.libs.utils as utils


dir = "D:/t/1932"
keys = {}
for root, dirs, files in os.walk(dir):
    for f in files:
        filename = os.path.join(dir, f)
        file = open(filename, "rb")
        key = utils.build_hash(file.read())
        if key not in keys:
            keys[key] = True
            print(key)
        else:
            print(key, f)
            exit(1)
