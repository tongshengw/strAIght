from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from datauri import DataURI
import base64
import csv
import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

printed = False

@socketio.on('image')
def handle_image(data):
    # printed is a debugging var to only print data once
    global printed
    uri = DataURI(data)
    imgdata = uri.data
    filename = "test_image.jpg"
    with open(filename, 'wb') as f:
        f.write(imgdata)

@socketio.on('training')
def handle_training_data(data):
    # print(data['dat']['rawData'])
    write_to_csv(data)

@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print("client has connected")

def write_to_csv(data):
    print("data recieved")
    with open('test1.csv', 'a', newline='') as csvfile:
        fieldnames = ['pos', 'eyeDistance', 'shoulderDistance', 'eyeShoulderAngle', 'eyesNoseDistanceDiff', 'eyesShouldersY', 'noseEarsY', 'rawData']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        # Check if the file is empty to write the header
        if csvfile.tell() == 0:
            writer.writeheader()

        raw_data = data['dat']['rawData']
        writer.writerow({
            'pos': data['pos'],
            'eyeDistance': data['dat']['eyeDistance'],
            'shoulderDistance': data['dat']['shoulderDistance'],
            'eyeShoulderAngle': data['dat']['eyeShoulderAngle'],
            'eyesNoseDistanceDiff': data['dat']['eyesNoseDistanceDiff'],
            'eyesShouldersY': data['dat']['eyesShouldersY'],
            'noseEarsY': data['dat']['noseEarsY'],
            'rawData': json.dumps(raw_data)
        })

if __name__ == "__main__":
    socketio.run(app, debug = True, port=8081)