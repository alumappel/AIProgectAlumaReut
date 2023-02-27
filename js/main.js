// משתנה לקביעת זמן למתן משוב מידי
let milSecForUpdate;

// הוספת מאזינים בטעינת עמוד
document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("FramBtn").addEventListener("click", startFrame);
    document.getElementById("MonBtn").addEventListener("click", startMon);
    document.getElementById("VolBtn").addEventListener("click", startVol);
    document.getElementById("StopBtn").addEventListener("click", stopAllProssing);
    document.getElementById("practiceBtn").addEventListener("click", showPractice);
    document.getElementById("tableBtn").addEventListener("click", showTable);

    //מהירות משוב   
    milSecForUpdate=5000;
    document.getElementById("FrqInput").value=5;
    document.getElementById("FrqInputV").innerHTML=5;    

});

//הצגת איזור תרגול
function showPractice() {
    document.getElementById("practiceBtn").removeEventListener("click", showPractice);
    document.getElementById("practiceortableBtn").classList.add("d-none");
    document.getElementById("StartBtn").classList.remove('d-none');
    document.getElementById("feedback").classList.remove('d-none');
    document.getElementById("stopBtnRow").classList.remove('d-none');
    document.getElementById("EndRow").classList.remove('d-none');
    document.getElementById("returnBtn").classList.remove('d-none');
}

//הצגת טבלה
//שליפה של הכל
function showTable(){
    document.getElementById("tableBtn").removeEventListener("click", showTable);
    document.getElementById("practiceortableBtn").classList.add("d-none");
    document.getElementById("tableDiv").classList.remove('d-none');
    document.getElementById("returnBtn").classList.remove('d-none');
    getPractices();
}




//מהירות משוב
function frqChange(){
 let input =document.getElementById("FrqInput").value;
 milSecForUpdate=input*1000;
 document.getElementById("FrqInputV").innerHTML=input; 
}

//התחלת בדיקת מיקום בפריים
function startFrame() {
    document.getElementById("FramBtn").removeEventListener("click", startFrame);
    isPredicting = true;
    initFrame();
    //חשיפה של האלמנטים
    document.getElementById("video-col").classList.remove('d-none');
    document.getElementById("colFrame").classList.remove('d-none');
    if (document.getElementById("StopBtn").classList.contains("d-none")) {  // check if element has the class "d-none"
        document.getElementById("StopBtn").classList.remove("d-none");  // remove the class "d-none"
    }
    //הסתרת הכפתור
    document.getElementById("FramBtn").classList.add("d-none");
}


///התחלת בדיקת דיבור מונוטוני
function startMon() {
    document.getElementById("MonBtn").removeEventListener("click", startMon);
    isListening = true;
    initMonotony();
    //חשיפה של האלמנטים       
    document.getElementById("colMon").classList.remove('d-none');
    if (document.getElementById("StopBtn").classList.contains("d-none")) {  // check if element has the class "d-none"
        document.getElementById("StopBtn").classList.remove("d-none");  // remove the class "d-none"
    }
    //הסתרת הכפתור
    document.getElementById("MonBtn").classList.add("d-none");
}


//התחלת בדיקה ווליום
function startVol() {
    document.getElementById("FramBtn").removeEventListener("click", startVol);
    isRunning = true;
    startDB();
    //חשיפה של האלמנטים
    document.getElementById("colVol").classList.remove('d-none');
    if (document.getElementById("StopBtn").classList.contains("d-none")) {  // check if element has the class "d-none"
        document.getElementById("StopBtn").classList.remove("d-none");  // remove the class "d-none"
    }
    //הסתרת הכפתור
    document.getElementById("VolBtn").classList.add("d-none");
}


//סיום ניתוח
function stopAllProssing() {    
    // בדיקה שאכן משהו נמדד
    if (staticTempArry.length > 0 || staticTempArryM.length > 0 || staticTempArryV.length > 0) {
      document.getElementById("StopBtn").removeEventListener("click", stopAllProssing);
        if (isPredicting) {
        stopLoopF();
        document.getElementById("colFrameEnd").classList.remove("d-none");
        drawChartFrame();
        document.getElementById("FrameNum").innerHTML=predictionNumF;
    }
    if (isListening) {
        stopLoopM();
        document.getElementById("colMonEnd").classList.remove("d-none");
        drawChartMon();
        document.getElementById("MonNum").innerHTML=predictionNumM;
    }
    if (isRunning) {
        stopLoopV();
        document.getElementById("colVolEnd").classList.remove("d-none");
        drawChartVol();
        document.getElementById("VolNum").innerHTML=predictionNumV;
        
    }
         showEnd();
         //מודל שמירה
         let modal = document.getElementById('addModal');
         $(modal).modal('show');
    }
    // אם שום דבר לא נמדד בפועל
    else {
        let modal = document.getElementById('errorModal');
         $(modal).modal('show');
    }
}


//הצגת משוב מסכם
function showEnd() {
    //הסתרת 
    document.getElementById("OpenTxt").classList.add("d-none");
    document.getElementById("StartBtn").classList.add("d-none");
    document.getElementById("stopBtnRow").classList.add("d-none");
    document.getElementById("feedback").classList.add("d-none");

    //הצגת איזור משוב מסכם
    document.getElementById("EndTxt").classList.remove("d-none");

}





///////////////////////////// משתנים ליצירת גרפים/////////////////////////////////////////////////////
var colors = ['#a6cee3', '#9a69b2', '#fb99e6', '#fdbf6f', '#cbf24d', '#b69200'];

var options = {
    legend: { position: 'labeled', textStyle: { color: 'black', fontName: 'Rubik', fontSize: 14, bold: true }, strokeColor: { color: 'black' } },
    colors: colors,
    backgroundColor: 'none',
    fontName: 'Rubik',
    pieSliceText: 'none',
    tooltip: { text: 'percentage' },
    'width':'auto', 
    'height':'auto'
};
////////////////////////////////////////////////////////////////////////////////////////////////



//יצירת גרף ווליום
function drawChartVol() {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'ביצוע');
    data.addColumn('number', 'אחוז מהזמן');
    data.addRows([
        ['בדיוק במידה', presentegGoodV],
        ['חלש מדי', presentegLowV],
        ['חזק מדי', presentegHighV]
    ]);  

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('VolChart'));
    chart.draw(data, options);
}

//יצירת גרף מונטוניות
function drawChartMon() {
        // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'ביצוע');
    data.addColumn('number', 'אחוז מהזמן');
    data.addRows([
        ['מגוון',  presentegGoodM],
        ['מונוטוני', presentegBadM]
    ]);   

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('MonChart'));
    chart.draw(data, options);
}

//יצירת גרף מיקום בפריים
function drawChartFrame() {
    // Create the data table.
var data = new google.visualization.DataTable();
data.addColumn('string', 'ביצוע');
data.addColumn('number', 'אחוז מהזמן');
data.addRows([
    ['מיקום נכון בפריים',  presentegGoodF],
    ['מיקום לא נכן בפריים', presentegBadF]
]);

// Instantiate and draw our chart, passing in some options.
var chart = new google.visualization.PieChart(document.getElementById('FrameChart'));
chart.draw(data, options);
}