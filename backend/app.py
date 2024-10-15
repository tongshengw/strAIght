from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)
sockets = Sockets(app)

@sockets.route('/screenshot')
def screenshot_socket(ws):
    print("HERE")
    while not ws.closed:
        message = ws.receive()
        if message:
            print("got here")
            # Decode the base64 image data
            header, encoded = message.split(',', 1)  # Separate the header and the data
            image_data = base64.b64decode(encoded)

            # Optionally, you can save the image to disk or process it
            image = Image.open(io.BytesIO(image_data))
            image.save('screenshot.jpg')  # Save the screenshot

            print('Screenshot received')


if __name__ == "__main__":
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()