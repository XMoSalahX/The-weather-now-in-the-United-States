/* Global Variables */

// const { json } = require("body-parser");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) + '.' + d.getDate() + '.' + d.getFullYear();
// API Key
const apiKey = "47610b680b30c71c5f40d4a1e93f2b2e&units=metric";

// run set
document.getElementById("generate").addEventListener("click", setUrlAndCall);
// set Url and call another function 
function setUrlAndCall() {
    //Get Felling Text
    let FeelingText = document.getElementById("feelings").value;
    // ZIP value from User
    let zip = document.getElementById("zip").value;
    // API URL Link
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zip}&appid=${apiKey}`;
    // Call GetWether Function and path apiUrl to get wether
    getWetherNow(apiUrl).then(function(jsonRespond) {

        let dataJson = {
            icon: jsonRespond.list[0].weather[0].icon,
            temperature: jsonRespond.list[0].main.temp,
            feels_like: jsonRespond.list[0].main.feels_like,
            temp_max: jsonRespond.list[0].main.temp_max,
            temp_min: jsonRespond.list[0].main.temp_min,
            date: newDate,
            text: FeelingText,
            city: jsonRespond.city.name,
            describtion: jsonRespond.list[0].weather[0].description
        }
        console.log(jsonRespond)
        console.log(dataJson)
            // Call Post Data To Local Server
        postDataToLocalServer('http://127.0.0.1:8000/postdata', dataJson);



    }).then(setTimeout(function() { // Call Get Data From Local Server after .5s

        getDataFromLocalServer('http://127.0.0.1:8000/all')
    }, 500))

}

var number = 0

// async get wether function to get json data
const getWetherNow = async(apiUrl) => {
    let respond = await fetch(apiUrl)
    try {
        if (respond.status != 200) {

            number = 1
            document.getElementById("zipErorr").innerHTML = "Zip Cod is invalid"
            document.getElementById("temp").innerHTML = ""
            document.getElementById("feels_like").innerHTML = ""
            document.getElementById("temp_max").innerHTML = ""
            document.getElementById("temp_min").innerHTML = ""
            console.log(document.getElementById("zipErorr"))
            let removeElement = document.getElementsByClassName("icon-img")[0]
            if (removeElement != null) {
                removeElement.remove()
            }
            // document.getElementById("zip").cssText = "{color:red}"
        }
        let jsonRespond = respond.json()
        return jsonRespond
    } catch (error) {
        console.log("Error", error)
    }
}

// post object to local server
var postDataToLocalServer = async(url = '', data = {}) => {

    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {

        const addNewData = res.json()
        return addNewData
    } catch (error) {
        console.log("Error", error)
    }
}

const holder = document.getElementById("entryHolder")


// To Update Our UI
const getDataFromLocalServer = async(url = '') => {
    let res = await fetch(url)
    try {

        dataToUI = await res.json()
        console.log(dataToUI)
        if (dataToUI.text) {
            if (dataToUI.icon) {


                let img = `<div class="icon-img"><img src="http://openweathermap.org/img/wn/${dataToUI.icon}@2x.png">
        <h4>
        You feel that the weather is ${dataToUI.text} in ${dataToUI.city} and the actual weather condition ${dataToUI.describtion}
        </h4>
        </div>`
                var removeElement = document.getElementsByClassName("icon-img")[0]
                if (removeElement != null) {
                    removeElement.remove()
                }
                document.getElementById("zipErorr").innerHTML = ""
                holder.insertAdjacentHTML('afterbegin', img)
                document.getElementById("temp").innerHTML = "Temperature: " + dataToUI.temperature + "°C"
                document.getElementById("feels_like").innerHTML = "Feels like: " + dataToUI.feels_like + "°C"
                document.getElementById("temp_max").innerHTML = "Temp max: " + dataToUI.temp_max + "°C"
                document.getElementById("temp_min").innerHTML = "Temp min: " + dataToUI.temp_min + "°C"
            }
        } else {
            if (number === 1) {
                console.log("true")
                number = 0
            } else {
                document.getElementById("zipErorr").innerHTML = "Please write down how you feel about the weather now"
                number = 0
                document.getElementById("temp").innerHTML = ""
                document.getElementById("feels_like").innerHTML = ""
                document.getElementById("temp_max").innerHTML = ""
                document.getElementById("temp_min").innerHTML = ""
                console.log(document.getElementById("zipErorr"))
                let removeElement = document.getElementsByClassName("icon-img")[0]
                if (removeElement != null) {
                    removeElement.remove()
                }
            }

        }
    } catch (error) {
        console.log("Zip Not Found", error)
    }
}