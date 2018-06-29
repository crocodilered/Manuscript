import hashlib


def build_hash(b):
    return hashlib.sha224(b).hexdigest()
