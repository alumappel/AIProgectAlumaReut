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
        var dateStr = ("00" + date.getDate()).slice(-2) + "/" +  ("00" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        var timeStr= ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);        
        //  עבור כל שאלה נבנה שורה בטבלה        
        const myHtml = `<tr>
            <th scope="row">${i}</th>
            <td class="noborder">${practice.practice_name} </td>
            <td class="text-center noborder"><button type="button" class="btn btn-outline-dark"><span class="bi bi-pen"></span></button></td>
            <td>${dateStr}</td>
            <td>${timeStr}</td>
            <td>${practice.overall_length}</td>            
            <td class="text-center" ><button type="button" class="btn btn-outline-danger"><span class="bi bi-trash3"></span></button></td>
            </tr>`
        //  נזריק את השאלה לטבלה
        table.innerHTML += myHtml;
    });
}
