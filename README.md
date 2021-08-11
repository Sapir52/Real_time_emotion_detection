## Real time face detection
Face detection is one of the most common applications of Artificial Intelligence.

# The purpose:
We will build the face recognition app that will work in the Browser. 

From the face, we will predict the Emotion, Gender, age and type of emoji.

# Explanation of the files:
Face-api.js - has brought a JavaScript API for face detection and face recognition in the browser implemented on top of the tensorflow.js core API.

Models- are the trained data that we will use to detect the feature from the face.

Index.html - we importing the face-api.min.js for processing the model data and extracting the features and main.js where we will write our logic.
Inside the body tag we are creating a video tag to get the face, result-container for showing the emotion, gender, and age.

Main.js - we are using promise.all to load the models to the face API. once the promise is resolved then we are calling the startVideo method that starts the streaming.

# Running:
Start your local Web Server: python -m http.server --bind 127.0.0.1 8081

Then open your browser and go to URL: http://127.0.0.1:8081

