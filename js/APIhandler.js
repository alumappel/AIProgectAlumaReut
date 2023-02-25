// שמירת כתובת השרת
const serverUrl = `https://localhost:7135/api/`
//שמירת כתובת הקונטרולר
const controllerUrl = serverUrl + `Practices/`



//שליפה של כל האימונים והפרטים
// פונקציה לשליפת השאלות מבסיס הנתונים
async function getPractices() {
    const url = controllerUrl + `GetAllPractices`;
    //  שמירת הפרמטרים לשליפה: סוג השליפה ומבנה הנתונים שיוחזר
    const params = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    } // ביצוע הקריאה לשרת, נשלח את הנתיב והפרמטרים שהגדרנו
    const response = await fetch(url, params);
    //  במידה והערך שהוחזר תקין
    if (response.ok) {
        //  נמיר את התוכן שחזר לפורמט json
        const data = await response.json();
        //console.log(data);
        showPractices(data);
    } else {
        // נציג את השגיאות במידה והערך לא תקין
        const errors = response.text();
        console.log(errors);
    }
}

// פונקציה להצגת אימונים בדף HTML
function showPractices(practices) {
    //  שמירת אלמנט הטבלה בה יוצגו השאלות
    const table = document.getElementById("practicesTable");
    // איפוס הטבלה
    table.innerHTML = "";
    // מעבר על כל השאלות 
    //משתנה ללולאה
    let i = 0;
    practices.forEach(practice => {
        //ספירה
        i++;
        //המרת תאריך
        var date = new Date(practice.date)
        var dateStr = ("00" + date.getDate()).slice(-2) + "/" + ("00" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        var timeStr = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
        //  עבור כל שאלה נבנה שורה בטבלה        
        const myHtml = `<tr>
            <th scope="row">${i}</th>
            <td class="noborder">${practice.practice_name} </td>
            <td class="text-center noborder"><button type="button" class="btn btn-outline-dark"  onclick="transferIdtoEditModal(${practice.id})" data-bs-toggle="modal" data-bs-target="#editModal"><span class="bi bi-pen"></span></button></td>
            <td>${dateStr}</td>
            <td>${timeStr}</td>
            <td>${practice.overall_length}</td>            
            <td class="text-center" ><button id="deleteBtn" type="button" onclick="transferIdtoDeleteModal(${practice.id})" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteModal"><span class="bi bi-trash3"></span></button></td>
            </tr>`
        //  נזריק את השאלה לטבלה
        table.innerHTML += myHtml;
    });
}



//העברת מידע למודל מחיקה
function transferIdtoDeleteModal(id) {
    document.getElementById("modalDeleteBtn").addEventListener("click", function () {
        deletPractice(id);
    });
}

//פונקציה למחיקת אימון
async function deletPractice(id) {
    // קריאה לבסיס הנתונים ומחיקת השאלה לפי המזהה שלה    
    const url = `${controllerUrl}PracticeIdToDelete?idToDelete=${id}`;
    // שמירת הפרמטרים לשליפה: סוג השליפה    
    const params = {
        method: 'DELETE',
    }
    // ביצוע הקריאה לשרת, נשלח את הנתיב והפרמטרים שהגדרנו    
    const response = await fetch(url, params);
    // במידה והקריאה הצליחה    
    if (response.ok) {
        // ניצור מחדש את רשימת השאלות המעודכנת        
        getPractices();
        //הודעה אישור
        const toastLiveExample = document.getElementById('deleteToast');
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    } else {
        // נציג את השגיאות במידה והערך לא תקין        
        const errors = await response.text();
        console.log(errors);
        const toastLiveExample = document.getElementById('errorToast');
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    }
}


//העברת מידע למודל עדכון
function transferIdtoEditModal(id) {
    //console.log("editPractice" + id);
    document.getElementById("modalEditBtn").addEventListener("click", function () {
        editPractice(id);
    });
}

//פונקציה לעדכון שם אימון
async function editPractice(id) {
    const newName = document.getElementById("nameInput").value;
    //הזנת ערכים באובייקט
    const practiceObj =
    {
        "id": id,
        "practice_name": newName,
        "date": "2023-02-25T10:44:50.027Z",
        "overall_length": 0,
        "locationInFrame": {
            "id": 0,
            "measurement_time": 0,
            "good_performance_time_percent": 0,
            "out_of_frame_performance_time_percent": 0,
            "too_close_performance_time_percent": 0,
            "too_far_performance_time_percent": 0,
            "practices_Id": 0
        },
        "pitch": {
            "id": 0,
            "measurement_time": 0,
            "good_performance_time_percent": 0,
            "practices_Id": 0
        },
        "volume": {
            "id": 0,
            "measurement_time": 0,
            "volume_avg": 0,
            "good_performance_time_percent": 0,
            "too_loud_performance_time_percent": 0,
            "too_quiet_performance_time_percent": 0,
            "practices_Id": 0
        }
    }

    //פה נבצע את הקריאה לקונטרולר
    const url = `${controllerUrl}UpdatePracticeName`;
    // שמירת הפרמטרים לשליפה: סוג השליפה
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(practiceObj)
    }
    // ביצוע הקריאה לשרת, נשלח את הנתיב והפרמטרים שהגדרנו
    const response = await fetch(url, params);
    // במידה והקריאה הצליחה
    if (response.ok) {
        // ניצור מחדש את רשימת השאלות המעודכנת        
        getPractices();
        //הודעה אישור
        const toastLiveExample = document.getElementById('editToast');
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    } else {
        // נציג את השגיאות במידה והערך לא תקין
        const errors = await response.text();
        console.log(errors);
        const toastLiveExample = document.getElementById('errorToast');
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    }

}

//פונקציה שקוראת בלחיצה על כפתור הוספה לבסיס נתונים
async function addPractice() {
    let overallLength = 0;
    if (overAllTimeMinF > overallLength) {
        overallLength = overAllTimeMinF;
    }
    if (overAllTimeMinM > overallLength) {
        overallLength = overAllTimeMinM;
    }
    if (overAllTimeMinV > overallLength) {
        overallLength = overAllTimeMinV;
    }    
    const newName = document.getElementById("nameInput2").value;
    const date = new Date().toISOString();
    //console.log("date: "+date + "date type" + typeof date);

    //הזנת ערכים לאובייקט
    const practiceObj = {
        "id": 0,
        "practice_name": newName,
        "date": date,
        "overall_length": overallLength,
        "locationInFrame": {
            "id": 0,
            "measurement_time": overAllTimeMinF,
            "good_performance_time_percent": presentegGoodF,
            "out_of_frame_performance_time_percent": 0,
            "too_close_performance_time_percent": 0,
            "too_far_performance_time_percent": 0,
            "practices_Id": 0
        },
        "pitch": {
            "id": 0,
            "measurement_time": overAllTimeMinM,
            "good_performance_time_percent": presentegBadM,
            "practices_Id": 0
        },
        "volume": {
            "id": 0,
            "measurement_time": overAllTimeMinV,
            "volume_avg": avgV,
            "good_performance_time_percent": presentegGoodV,
            "too_loud_performance_time_percent": presentegHighV,
            "too_quiet_performance_time_percent": presentegLowV,
            "practices_Id": 0
        }
    }
    //הדפסת האוביקט של השאלה לצורך בדיקה
    console.log(practiceObj);
    //פה נבצע את הקריאה לקונטרולר
    
    const url = `${controllerUrl}InsertPractice`;
    // שמירת הפרמטרים לשליפה: סוג השליפה
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(practiceObj)
    }
    // ביצוע הקריאה לשרת, נשלח את הנתיב והפרמטרים שהגדרנו
    const response = await fetch(url, params);
    // במידה והקריאה הצליחה
    if (response.ok) {
        //הודעה אישור
        const toastLiveExample = document.getElementById('editToast');
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    } else {
        // נציג את השגיאות במידה והערך לא תקין
        const errors = await response.text();
        console.log(errors);
        const toastLiveExample = document.getElementById('errorToast');
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    }


}


