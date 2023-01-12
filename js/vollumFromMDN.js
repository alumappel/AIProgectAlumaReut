document.addEventListener("DOMContentLoaded", function (event) {

});



let tempArryV = new Array();
let staticTempArryV = new Array();
let volTenSecAVGArry = new Array();




async function startDB() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  const audioContext = new AudioContext();
  const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  mediaStreamAudioSourceNode.connect(analyserNode);
  const volumeMeterEl = document.getElementById("volume-meter");

  const pcmData = new Float32Array(analyserNode.fftSize);
  //מציג את המשוב
  document.getElementById("colVol").classList.remove('d-none');

  const onFrame = () => {
    analyserNode.getFloatTimeDomainData(pcmData);
    let sumSquares = 0.0;
    for (const amplitude of pcmData) { sumSquares += amplitude * amplitude; }
    volumeMeterEl.value = Math.sqrt(sumSquares / pcmData.length);
    //הוספה למערך זמני
    tempArryM.push(Math.sqrt(sumSquares / pcmData.length).toFixed(2));

    window.requestAnimationFrame(onFrame);
  };
  window.requestAnimationFrame(onFrame);
  //console.log("after" + volumeMeterEl.value);
  // console.log(volumeMeterEl.value);
  // console.log(volumeMeterEl.value);



  //פונקציה שקוראת כל 10 שניות
  const everyTenSeconds = () => {
    //console.log("ten seconds");
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
    //console.log(volTenSecAVGArry);

    updateVisualizationV();
  };
  setInterval(everyTenSeconds, 10000);
}




//יצירת משוב מיידי
async function updateVisualizationV() {
  //בדוק את החצי דקה האחרונה
  //אם ___ מעל 0.8 תציג משוב מתאים
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