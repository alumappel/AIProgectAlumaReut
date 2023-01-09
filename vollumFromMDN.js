document.addEventListener("DOMContentLoaded", function (event) {

  document.getElementById("DBbutton").addEventListener('click', startDB);
});

async function startDB() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  const audioContext = new AudioContext();
  const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  mediaStreamAudioSourceNode.connect(analyserNode);
  const volumeMeterEl = document.getElementById("volume-meter");

  const pcmData = new Float32Array(analyserNode.fftSize);
  const onFrame = () => {
    analyserNode.getFloatTimeDomainData(pcmData);
    let sumSquares = 0.0;
    for (const amplitude of pcmData) { sumSquares += amplitude * amplitude; }
    volumeMeterEl.value = Math.sqrt(sumSquares / pcmData.length); 
    
    window.requestAnimationFrame(onFrame);
  };
  window.requestAnimationFrame(onFrame);
 //console.log("after" + volumeMeterEl.value);
  // console.log(volumeMeterEl.value);
  // console.log(volumeMeterEl.value);
}