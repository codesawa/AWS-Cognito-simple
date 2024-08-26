from flask import Flask, request, jsonify
from flask_cors import CORS
from jose import jwt
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)


USER_POOL_ID = os.getenv("USER_POOL_ID")
APP_CLIENT_ID = os.getenv("CLIENT_ID")
REGION = os.getenv("AWS_REGION")

COGNITO_KEYS_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"

cognito_jwks = requests.get(COGNITO_KEYS_URL).json()

def verify_jwt(token):
    try:
        header = jwt.get_unverified_header(token)
        kid = header['kid']
        key = next(key for key in cognito_jwks['keys'] if key['kid'] == kid)
        return jwt.decode(token, key, algorithms=['RS256'], audience=APP_CLIENT_ID)
    except Exception as e:
        print(f"Token verification error: {e}")
        return None

@app.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization', '').split(' ')[1]
    claims = verify_jwt(token)
    if claims:
        return jsonify({"message": "You have accessed a protected route!"}), 200
    else:
        return jsonify({"message": "Unauthorized"}), 401

if __name__ == '__main__':
    app.run(debug=True)
