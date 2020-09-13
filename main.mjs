import * as TimeF from "./TimeFunctions.mjs";
import {TimeSpan} from "./TimeSpan.mjs";
import * as GoogleHandler from "./GoogleHandler.mjs";
import {createConfig} from "./TimeConfigParser.mjs";

window.onload = () => {
    GoogleHandler.handleClientLoad()
};

let RESET = "";
let RED = "";
let GREEN = "";

if (false) {
    RESET = "\x1b[0m";
    RED = "\x1b[31m";
    GREEN = "\x1b[36m";
}

export {RESET, RED, GREEN}

let period = 30 * TimeF.MINUTE;

window.handleResponse = handleResponse;
window.apiResponse = {};

document.getElementById("calculate").addEventListener("click", ()=>{
    createConfig(JSON.parse(document.getElementById("config").value));
    handleResponse(window.apiResponse);
});

function handleResponse(response) {
    document.getElementById("content").innerHTML = "";
    window.timeSpans = [];
    window.apiResponse = response;

    let resp = response.result.items;

    let content = document.getElementById("content");

    for (let res in resp) {
        let item = resp[res];
        TimeSpan.splitTime(period, item.start.dateTime, item.end.dateTime).forEach((timeSpan) => {
            timeSpans.push(timeSpan);
        })
    }


    let timeCounter = {};
    let currentMonth = 0;
    timeSpans.forEach((timeSpan) => {
            //if(currentMonth == 0 || )
            for (let timeKey in timeConfig) {
                let time = timeConfig[timeKey];
                if (timeSpan.inDateTime(time.day, time.length, time.hours, time.minutes, time.seconds)) {
                    //content.innerHTML += "<p style='color:red'>" + time.name + " - " + timeSpan.getString(undefined, TimeF.HOUR) + "</p>"
                    if (isNaN(timeCounter[time.name])) {
                        timeCounter[time.name] = 0
                    }
                    timeCounter[time.name] += 1;
                    return;
                }
            }
        }
    )
    let totalWage = 0;
    let totalHours = 0;
    for (let shift in timeCounter) {
        timeCounter[shift] /= 2;
        let rate = timeConfig[0][shift];
        totalWage += timeCounter[shift] * rate;
        totalHours += timeCounter[shift];
        content.innerHTML += "<p>" + shift + " - " + timeCounter[shift] + " - " + timeCounter[shift] * rate + ",-</p>";
    }
    content.innerHTML += "<p>Sum: " + totalWage + ",-</p>";
    content.innerHTML += "<p>Sum hours: " + totalHours + "</p>";
}