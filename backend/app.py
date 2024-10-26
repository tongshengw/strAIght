from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from datauri import DataURI
import base64

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

printed = False

@socketio.on('image')
def handle_image(data):
    global printed
    uri = DataURI(data)
    imgdata = uri.data
    filename = "test_image.jpg"
    with open(filename, 'wb') as f:
        f.write(imgdata)

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print("client has connected")


if __name__ == "__main__":
    socketio.run(app, debug = True, port=8000)