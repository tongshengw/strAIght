from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('image')
def handle_image(data):
    print(data)

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print("client has connected")


if __name__ == "__main__":
    socketio.run(app, debug = True, port=8000)