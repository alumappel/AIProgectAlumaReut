// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
// const URL = "./my_model/";
let model, webcam, ctx, labelContainer, maxPredictions;

async function initFrame() {
    const modelPath = "FrameModel4/model.json";
    const metadataPath = "FrameModel4/metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelPath, metadataPath);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 200;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size; canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container-frame");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    //חשיפה של האלמנטים
    document.getElementById("video-col").classList.remove('d-none');
    document.getElementById("colFrame").classList.remove('d-none');
}


//בשביל בדיקות
let frameCount = 0;
let startTime = performance.now();
//בשביל ממוצע
let tempArry = new Array();
let staticTempArry = new Array();
let inFrameHalfMinAVGArry = new Array();
let outFrameHalfMinAVGArry = new Array();
let tooCloseHalfMinAVGArry = new Array();
let tooFarHalfMinAVGArry = new Array();
//בשביל עצירה
let isPredicting = true;

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
    //אם עברה חצי דקה    //שמירת המערך במשתנה קבוע    //חישוב מערך זמני    //הכנסה למערך קבוע    //איפוס מערך זמני    //שונה מחצי דקה ל10 שניות
    if (performance.now() - startTime >= 10000) {
        staticTempArry = tempArry;
        tempArry = new Array();
        let arrysNamesArry = [inFrameHalfMinAVGArry, outFrameHalfMinAVGArry, tooCloseHalfMinAVGArry, tooFarHalfMinAVGArry];
        for (let arryi = 0; arryi < arrysNamesArry.length; arryi++) {
            let sum = 0;
            let count = 0;
            for (let i = arryi; i < staticTempArry.length; i += 4) {
                sum += parseFloat(staticTempArry[i]);
                count++;
            }
            if (count > 0) {
                arrysNamesArry[arryi].push(sum / count);
            } else {
                console.log("error in staticTempArry AVG")
            }
        }
        startTime = performance.now();// Reset time
        updateVisualization();
    }
    //לחישוב כמות הפריימים
    //frameCount++;
    // If one second has passed
    /* if (performance.now() - startTime >= 1000) {
        // Calculate the FPS
        const fps = frameCount / ((performance.now() - startTime) / 1000);

        // Reset the frame count and start time
        frameCount = 0;
        startTime = performance.now();

        console.log(`FPS: ${fps}`);
    } */
}



async function predict() {

    if (!isPredicting) return; // exit the function if isPredicting is false
    // לחישוב הדילאיי
    //const start = performance.now();
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
        //הכנסת התחזית למערך זמני
        tempArry.push(prediction[i].probability.toFixed(2));
    }
    // המספר של כל קלאס במערך    // 0 בפריים    // 1 לא בפריים    // 2 רחוק מדי    // 3 קרוב מדי
    //לחישוב הדילאי
    //const end = performance.now();
    // Calculate the latency
    //const latency = end - start;
    //console.log(`Latency: ${latency} ms`);

    // finally draw the poses
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
           tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
           tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

//יצירת משוב מיידי
async function updateVisualization() {
    //בדוק את החצי דקה האחרונה    //אם ___ מעל 0.8 תציג משוב מתאים
    let span = document.getElementById("ansFrameTxt");
    const box = document.getElementById("ansFrame");
    if (inFrameHalfMinAVGArry[inFrameHalfMinAVGArry.length - 1] >= 0.8) {
        //הודעה חיובית
        console.log("מעולה");
        span.innerHTML = "מעולה!";

        if (box.classList.contains('feedbackbad')) {
            box.classList.remove('feedbackbad');
        }
        if (box.classList.contains('feedbackgood') == false) {
            box.classList.add('feedbackgood');
        }
    }
    else if (tooCloseHalfMinAVGArry[tooCloseHalfMinAVGArry.length - 1] >= 0.8) {
        //הודעה קרוב מדי
        console.log("קרוב");
        span.innerHTML = "כדאי להתרחק מהמלצמה";

        if (box.classList.contains('feedbackgood')) {
            box.classList.remove('feedbackgood');
        }
        if (box.classList.contains('feedbackbad') == false) {
            box.classList.add('feedbackbad');
        }
    }
    else if (tooFarHalfMinAVGArry[tooFarHalfMinAVGArry.length - 1] >= 0.8) {
        //הודעה רחוק מדי
        console.log("רחוק");
        span.innerHTML = " כדאי להתקרב למצלמה";

        if (box.classList.contains('feedbackgood')) {
            box.classList.remove('feedbackgood');
        }
        if (box.classList.contains('feedbackbad') == false) {
            box.classList.add('feedbackbad');
        }
    }
    else {
        //הודעה שלילית גנרית
        console.log("רע");
        span.innerHTML = "מיקום לא מושלם - נסי לזוז קצת";

        if (box.classList.contains('feedbackgood')) {
            box.classList.remove('feedbackgood');
        }
        if (box.classList.contains('feedbackbad') == false) {
            box.classList.add('feedbackbad');
        }
    }

}


//פונקציה לעצירת החישוב
function stopLoopF() {
    console.log("stop loop was called");
    webcam.stop();
    isPredicting = false;
    model.dispose();
}


