document.addEventListener("DOMContentLoaded", function (event) {
});


//משתנים לחישוב
let tempArryV = new Array();
let staticTempArryV = new Array();
let volTenSecAVGArry = new Array();

//לעצירה
let isRunning;
let animationId;
let intervalId;

async function startDB() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  const audioContext = new AudioContext();
  const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  mediaStreamAudioSourceNode.connect(analyserNode);
  const volumeMeterEl = document.getElementById("volume-meter");

  const pcmData = new Float32Array(analyserNode.fftSize); 
  

  const onFrame = () => {
    if (!isRunning) {
      window.cancelAnimationFrame(animationId);
      return;
    }
    analyserNode.getFloatTimeDomainData(pcmData);
    let sumSquares = 0.0;
    for (const amplitude of pcmData) { sumSquares += amplitude * amplitude; }
    volumeMeterEl.value = Math.sqrt(sumSquares / pcmData.length);
    //הוספה למערך זמני
    tempArryM.push(Math.sqrt(sumSquares / pcmData.length).toFixed(2));

    window.requestAnimationFrame(onFrame);
  };
  animationId = window.requestAnimationFrame(onFrame);


  //פונקציה שקוראת כל 10 שניות
  const everyTenSeconds = () => {
    staticTempArryV = tempArryM;
    tempArryV = new Array();
    let sum = 0;
    let count = 0;
    for (let i = 0; i < staticTempArryV.length; i++) {
      sum += parseFloat(staticTempArryV[i]);
      count++;
    }
    if (count > 0) {
      volTenSecAVGArry.push(sum / count);
    } else {
      console.log("error in staticTempArryM AVG")
    }    
    updateVisualizationV();
  };
  intervalId= setInterval(everyTenSeconds,milSecForUpdate);
}



//יצירת משוב מיידי
async function updateVisualizationV() {
  //בדוק את החצי דקה האחרונה  //אם ___ מעל 0.8 תציג משוב מתאים
  let span = document.getElementById("ansVolTxt");
  const box = document.getElementById("ansVol");
  if (volTenSecAVGArry[volTenSecAVGArry.length - 1] <= 0.032) {
    //חלש
    console.log("חלש");
    span.innerHTML = "הדיבור שלך חלש מדי - נסי להגביר";

    if (box.classList.contains('feedbackgood')) {
      box.classList.remove('feedbackgood');
    }
    if (box.classList.contains('feedbackbad') == false) {
      box.classList.add('feedbackbad');
    }
  }
  else if (volTenSecAVGArry[volTenSecAVGArry.length - 1] >= 0.07) {
    //חזק
    console.log("חזק");
    span.innerHTML = "הדיבור שלך חזק מדי - נסי להחליש";

    if (box.classList.contains('feedbackgood')) {
      box.classList.remove('feedbackgood');
    }
    if (box.classList.contains('feedbackbad') == false) {
      box.classList.add('feedbackbad');
    }
  }
  else {
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

}



function stopLoopV() {
  isRunning = false;
  clearInterval(intervalId);
  creatEndVarsV();
}


//שמירת נתונים בסיום
let overAllTimeMinV;
let presentegGoodV;
let presentegLowV;
let presentegHighV;
function creatEndVarsV(){
  overAllTimeMinV = volTenSecAVGArry.length * (milSecForUpdate/1000) / 60;
  let lowCount = 0;
  let highCount = 0;
  for (let i = 0; i < volTenSecAVGArry.length; i++) {
      if (volTenSecAVGArry[i] < 0.032) {
          lowCount++;
      } else if (volTenSecAVGArry[i] > 0.07) {
          highCount++;
      }
  }
  presentegLowV = (lowCount / volTenSecAVGArry.length) * 100;
  presentegHighV = (highCount / volTenSecAVGArry.length) * 100;
  presentegGoodV = 100 - presentegLowV - presentegHighV;  
}