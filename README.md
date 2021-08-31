# Real time emotion detection

Face detection is one of the most common applications of Artificial Intelligence.

# The purpose:
I built the face recognition app that will work in the Browser. 

From the face, I predicted the Emotion, Gender, age and type of emoji.

# Explanation of the files:
Face-api.js - Has brought a JavaScript API for face detection and face recognition in the browser implemented on top of the tensorflow.js core API.

Models- Are the trained data that we will use to detect the feature from the face.

Index.html - Import the face-api.min.js for processing the model data and extracting the features and main.js where we will write our logic.
Inside the body tag we are creating a video tag to get the face, result-container for showing the emotion, gender, age and type of emoji.

Main.js - Use promise.all to load the models to the face API. once the promise is resolved then we are calling the startVideo method that starts the streaming.

# Running the code:
Start your local Web Server: python -m http.server --bind 127.0.0.1 8081

Then open your browser and go to URL: http://127.0.0.1:8081

