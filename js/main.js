/**
    * @description      : 
    * @author           : ספיר
    * @group            : 
    * @created          : 11/08/2021 - 13:04:31
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 11/08/2021
    * - Author          : ספיר
    * - Modification    : 
**/
// Access to DOM for video and face icon
const video = document.getElementById("video");
const face = document.getElementById('face');

// Define the array with emoji
let statusIcons = {
  default: '😎',
  neutral: '🙂',
  happy: '😀',
  sad: '😥',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😳'
}


// Load models for Face Detection and Face Expression
Promise.all([
  loadModels()
]).then(startVideo);

//** Load models for Face Detection and Face Expression ***//
async function loadModels() {
  // TinyFaceDetector - realtime face detector
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  // FaceLandmark68Net - to detect face landmarks
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  // FaceRecognitionNet -for face recognition of any person
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  // FaceExpressionNet - to detect the expressions on face 
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  // AgeGenderNet - the age and gender recognition model is a multitask network
  faceapi.nets.ageGenderNet.loadFromUri("/models")
}

// Start the live webcam video stream
function startVideo() {
  // get the webcam's video stream
  navigator.getUserMedia(
    { video: {} },
    // Access to Camera and display it on video DIV
    stream => (video.srcObject = stream),
    // If something went wrong
    err => console.error(err)
  );
}

//***  Add a listener once the Video is played ***//
video.addEventListener("playing", () => {
  //Call function
  createAndDrawCanvas();
  detectExpression();
});

function createAndDrawCanvas(){
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  // Resize the canvas to the #video dimensions
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  // Get "detections" for every 100 milliseconds 
  setInterval(async () => {

    const detections = await faceapi
      // This "detections" array has all the things like the "prediction results" as well as the "bounding box" configurations! 
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();   // Add age and gender to the predictions

    // Resize the detected boxes to match our video dimensions
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    //*** Add drawing to canvas ***//
    // Before start drawing, clear the canvas
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    // Use faceapi.draw to draw "detections"
    faceapi.draw.drawDetections(canvas, resizedDetections);
    // To draw expressions
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    // To draw face landmarks
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    //*** Get predictions ***//
    resizedDetections.forEach(result => {
      const { age, gender, genderProbability } = result;
      new faceapi.draw.DrawTextField(
        [
          `${faceapi.utils.round(age, 0)} years`,
          `${gender} (${faceapi.utils.round(genderProbability)})`
        ],
        result.detection.box.bottomRight
      ).draw(canvas);
    });
  }, 100);
}

function detectExpression() {
  //Set the default Emoji
  face.innerHTML = statusIcons.default
  //SetInterval to detect face/espression periodically (every 500 milliseconds)
  const milliseconds = 500
  setInterval(async () => {
    // Wait to detect face with Expression
    const detection = await
      faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()
    //detectAllFaces retruns an array of faces with some interesting attributes
    if (detection.length > 0) {
      // walk through all faces detected
      detection.forEach(element => {
        // each face element has a expressions attribute
        let status = "";
        let valueStatus = 0.0;
        for (const [key, value] of Object.entries(element.expressions)) {
          if (value > valueStatus) {
            status = key
            valueStatus = value;
          }
        }
        // Once we have the highest scored expression (status) we display the right Emoji
        face.innerHTML = statusIcons[status]
      });
    } else {
      // Face.innerHTML = statusIcons.default;
      console.log("No Faces")
    }
  }, milliseconds);
}
