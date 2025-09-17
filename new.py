
import secrets
import string

def generate_password(length):
    # Use alphanumeric + safe special chars for environment variables
    characters = string.ascii_letters + string.digits + "!@#$%^&*-_=+"
    password = ''.join(secrets.choice(characters) for i in range(length))
    return password

length = 24
password = generate_password(length)
print(password)
