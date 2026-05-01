import base64
import hashlib
from cryptography.fernet import Fernet



def generate_key(master_password: str) -> bytes:
    key = hashlib.sha256(master_password.encode()).digest()
    return base64.urlsafe_b64encode(key)

def encrypt_password(master_password: str, password: str) -> str:
    key = generate_key(master_password)
    f = Fernet(key)
    return f.encrypt(password.encode()).decode()

def decrypt_password(master_password: str, encrypted_password: str) -> str:
    key = generate_key(master_password)
    f = Fernet(key)
    return f.decrypt(encrypted_password.encode()).decode()