let milSecForUpdate;


document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("FramBtn").addEventListener("click", startFrame);
    document.getElementById("MonBtn").addEventListener("click", startMon);
    document.getElementById("VolBtn").addEventListener("click", startVol);
    document.getElementById("StopBtn").addEventListener("click", stopAllProssing);

    //מהירות משוב   
    milSecForUpdate=5000;
    document.getElementById("FrqInput").value=5;
    document.getElementById("FrqInputV").innerHTML=5;    

});

//מהירות משוב
function frqChange(){
 let input =document.getElementById("FrqInput").value;
 milSecForUpdate=input*1000;
 document.getElementById("FrqInputV").innerHTML=input; 
}

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


function stopAllProssing() {
    document.getElementById("StopBtn").removeEventListener("click", stopAllProssing);
    if (isPredicting) {
        stopLoopF();
        document.getElementById("colFrameEnd").classList.remove("d-none");
        drawChartFrame();
    }
    if (isListening) {
        stopLoopM();
        document.getElementById("colMonEnd").classList.remove("d-none");
        drawChartMon();
    }
    if (isRunning) {
        stopLoopV();
        document.getElementById("colVolEnd").classList.remove("d-none");
        drawChartVol();
    }

    showEnd();
}


function showEnd() {
    //הסתרת 
    document.getElementById("OpenTxt").classList.add("d-none");
    document.getElementById("StartBtn").classList.add("d-none");
    document.getElementById("stopBtnRow").classList.add("d-none");
    document.getElementById("feedback").classList.add("d-none");

    //הצגת איזור משוב מסכם
    document.getElementById("EndTxt").classList.remove("d-none");

}

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

    // Set chart options
    var colors = ['#a6cee3', '#9a69b2', '#fb99e6', '#fdbf6f', '#cbf24d', '#b69200'];

    var options = {
        legend: { position: 'labeled', textStyle: { color: 'black', fontName: 'Rubik', fontSize: 14, bold: true }, strokeColor: { color: 'black' } },
        colors: colors,
        backgroundColor: 'none',
        fontName: 'Rubik',
        pieSliceText: 'none',
        tooltip: { text: 'percentage' },
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('VolChart'));
    chart.draw(data, options);
}


function drawChartMon() {
        // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'ביצוע');
    data.addColumn('number', 'אחוז מהזמן');
    data.addRows([
        ['מגוון',  presentegGoodM],
        ['מונוטוני', presentegBadM]
    ]);

    // Set chart options
    var colors = ['#a6cee3', '#9a69b2', '#fb99e6', '#fdbf6f', '#cbf24d', '#b69200'];

    var options = {
        legend: { position: 'labeled', textStyle: { color: 'black', fontName: 'Rubik', fontSize: 14, bold: true }, strokeColor: { color: 'black' } },
        colors: colors,
        backgroundColor: 'none',
        fontName: 'Rubik',
        pieSliceText: 'none',
        tooltip: { text: 'percentage' },
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('MonChart'));
    chart.draw(data, options);
}


function drawChartFrame() {
    // Create the data table.
var data = new google.visualization.DataTable();
data.addColumn('string', 'ביצוע');
data.addColumn('number', 'אחוז מהזמן');
data.addRows([
    ['מיקום נכון בפריים',  presentegGoodF],
    ['מיקום לא נכן בפריים', presentegBadF]
]);

// Set chart options
var colors = ['#a6cee3', '#9a69b2', '#fb99e6', '#fdbf6f', '#cbf24d', '#b69200'];

var options = {
    legend: { position: 'labeled', textStyle: { color: 'black', fontName: 'Rubik', fontSize: 14, bold: true }, strokeColor: { color: 'black' } },
    colors: colors,
    backgroundColor: 'none',
    fontName: 'Rubik',
    pieSliceText: 'none',
    tooltip: { text: 'percentage' },
};

// Instantiate and draw our chart, passing in some options.
var chart = new google.visualization.PieChart(document.getElementById('FrameChart'));
chart.draw(data, options);
}