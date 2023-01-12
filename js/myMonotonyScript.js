// more documentation available at
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/ZnR7rgHeL/";


async function createModel() {
    const checkpointURL = URL + "model.json"; // model topology
    const metadataURL = URL + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();

    return recognizer;
}

let tempArryM = new Array();
let staticTempArryM = new Array();
let monotonyTenSecAVGArry = new Array();
let VarietyTenSecAVGArry = new Array();


async function initMonotony() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    const labelContainer = document.getElementById("label-container-monotony");
    for (let i = 0; i < classLabels.length; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    //הצגת מחלקת המשוב
    document.getElementById("colMon").classList.remove('d-none');

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
        const scores = result.scores; // probability of prediction for each class
        // render the probability scores per class
        for (let i = 0; i < classLabels.length; i++) {
            const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
            //הכנסת התחזית למערך זמני
            tempArryM.push(result.scores[i].toFixed(2));
            //המספר של כל קלאס במערך
            // 0 רעש רקע
            // 1 מונוטוני
            // 2 מגוון
        }
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Add condition that happens every 10 seconds
    //כל 10 שניות שמירה במערך זמני יציב
    //יצירת ממוצעים
    //עדכון המשוב
    setInterval(() => {
        //console.log("This function is called every 10 seconds");
        staticTempArryM = tempArryM;
        tempArryM = new Array();
        let arrysNamesArry = ["placeHolder", monotonyTenSecAVGArry, VarietyTenSecAVGArry];
        for (let arryi = 1; arryi < arrysNamesArry.length; arryi++) {
            let sum = 0;
            let count = 0;
            for (let i = arryi; i < staticTempArryM.length; i += 3) {
                sum += parseFloat(staticTempArryM[i]);
                count++;
            }
            if (count > 0) {
                arrysNamesArry[arryi].push(sum / count);
            } else {
                console.log("error in staticTempArryM AVG")
            }
        }
        updateVisualizationM();
    }, 10000);


    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);
}


//יצירת משוב מיידי
async function updateVisualizationM() {
    //בדוק את החצי דקה האחרונה
    //אם ___ מעל 0.8 תציג משוב מתאים
    let span = document.getElementById("ansMonTxt");
    const box = document.getElementById("ansMon");
    if (VarietyTenSecAVGArry.length - 1 >= 0.8) {
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
    else {
        //הודעה קרוב מדי
        console.log("מונוטוני");
        span.innerHTML = "הדיבור שלך מונוטוני מדי - נסי לגוון";


        if (box.classList.contains('feedbackgood')) {
            box.classList.remove('feedbackgood');
        }
        if (box.classList.contains('feedbackbad') == false) {
            box.classList.add('feedbackbad');
        }
    }


}