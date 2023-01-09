
document.addEventListener("DOMContentLoaded", function (event) { });



async function startVideo() {
    // נשמור את תג הוידאו לתוך משתנה
    const player = document.getElementById('player');
    // נגדיר דרישות למדיה - נרצה להציג רק וידאו מהמצלמה האחורית
    const constraints = {
        audio: false,
        video: {
            facingMode: 'environment'
        }
    };
    //במידה ונצליח לפנות למצלמה, נזרים את הוידאו לתג הוידאו
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {
            player.srcObject = mediaStream;
        })
        .catch(function (err) { console.log(err.name + ": " + err.message); });
}




