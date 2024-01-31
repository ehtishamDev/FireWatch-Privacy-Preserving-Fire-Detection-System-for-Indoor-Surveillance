import cv2
import numpy as np
import tensorflow as tf
import base64
from exponent_server_sdk import PushClient, PushMessage
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import firebase_admin
from firebase_admin import credentials, storage
import time
import os
import subprocess

# Initialize Firebase app
cred = credentials.Certificate('firebase.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'firewatch-mobile-app.appspot.com'  # Replace with your project's storage bucket
})

app = FastAPI()

out = None  # Define 'out' globally

# Load the trained model and define other necessary variables
model = tf.saved_model.load('sa-fds-tensorrt')
class_names = ['Fire', 'Non Fire']
confidence_threshold = 0.8
T1 = 0.7
T2 = 60
F_ref = None

# Function to process frames and evaluate predictions
def evaluate_frame(frame):
    global F_ref, out, start_time
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (112, 112), interpolation=cv2.INTER_AREA)
    x = np.expand_dims(resized, axis=0) / 255.0
    x = np.expand_dims(x, axis=-1)
    x = x.astype(np.float32)

    prediction = model(x)
    cnn_label = class_names[np.argmax(prediction)]
    confidence_score = np.max(prediction)

    prediction = cnn_label

    if cnn_label == 'Fire':
        if out is None:  # Start recording if fire is detected
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter('fire_clip.mp4', fourcc, 20.0, (frame.shape[1], frame.shape[0]))
            start_time = time.time()  # Assign start_time here
        else:
            if time.time() - start_time < 30:  # Continue recording for 30 seconds
                out.write(frame)
            else:  # Stop recording and upload to Firebase
                out.release()
                out = None
                subprocess.run(['ffmpeg', '-i', 'fire_clip.mp4', '-c:v', 'libx264', '-crf', '23', 'fire.mp4'])
                os.remove('fire_clip.mp4') 
                bucket = storage.bucket()
                blob = bucket.blob('fire_clips/fire.mp4')
                blob.upload_from_filename('fire.mp4')
                os.remove('fire.mp4')  # Delete local file (optional)
                send_push_notification()

    F_ref = resized

    text = f'{prediction} ({confidence_score:.2f})'
    cv2.putText(frame, text, (140, 180), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 2, cv2.LINE_AA)
    return frame

# Function to generate frames for HTTP streaming
def generate_frames():
    cap = cv2.VideoCapture("rtsp://admin:admin123@192.168.1.12:554/cam/realmonitor?channel=1&subtype=0")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Apply model evaluation
        frame = evaluate_frame(frame)

        # Encode the frame as JPEG
        ret, encoded_image = cv2.imencode(".jpg", frame)
        if not ret:
            continue

        # Convert the encoded image to base64
        encoded_image_base64 = base64.b64encode(encoded_image.tobytes()).decode("utf-8")

        # Yield the base64-encoded image
        yield encoded_image_base64

# HTTP endpoint to serve base64-encoded images
@app.get("/video_feed")
async def video_feed():
    frame_generator = generate_frames()
    return JSONResponse(content={"image": next(frame_generator)})

def send_push_notification():
    # Replace with the actual Expo Push Token obtained from the app
    expo_push_token = 'n8UkQmP8No4qaPzAvAOqEI'

    try:
        # Create a new client
        client = PushClient()

        # Create a new message
        message = PushMessage(to=expo_push_token, body='Fire is detected!')

        # Send the message
        client.publish(message)

        print('Push notification sent successfully!')

    except Exception as e:
        print('Failed to send push notification:', e)

# Start the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
