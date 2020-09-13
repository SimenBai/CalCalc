import * as TimeF from "./TimeFunctions.mjs";
import {TimeSpan} from "./TimeSpan.mjs";
import {MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY} from "./TimeSpan.mjs";

let url = 'TimeSettings.json';
let json = {};

let keywords =
    {
        "monday": MONDAY,
        "tuesday": TUESDAY,
        "wednesday": WEDNESDAY,
        "thursday": THURSDAY,
        "friday": FRIDAY,
        "saturday": SATURDAY,
        "sunday": SUNDAY,
        "weekdays": [
            MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY
        ],
        "weekends": [SATURDAY, SUNDAY]
    }

function getJson(callback) {
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            callback(out);
        })
        .catch(err => {
            throw err
        });
}

window.timeConfig = [];

getJson((json) => {
    createConfig(json);
    document.getElementById("config").value = JSON.stringify(json, undefined, 4);
});

export function createConfig(json){
    let data = json;
    window.timeConfig = [];
    window.timeConfig.push(data.wages);
    for (let keyword in keywords) {
        for (let day in data) {
            if (day.toLowerCase() == keyword) {
                if (keywords[keyword] instanceof Array) {
                    for (let key in keywords[keyword]) {
                        for (let point in data[day]) {
                            let dataPoint = data[day][point];
                            let fromTimes = splitTimeString(dataPoint.from);
                            window.timeConfig.push(new TimeSlot(keywords[keyword][key], addTimeStringTogether(dataPoint.duration), fromTimes["hour"], fromTimes["minute"], fromTimes["second"], dataPoint.name));
                        }
                    }
                } else {
                    for (let point in data[day]) {
                        let dataPoint = data[day][point];
                        let fromTimes = splitTimeString(dataPoint.from);
                        window.timeConfig.push(new TimeSlot(keywords[keyword], addTimeStringTogether(dataPoint.duration), fromTimes["hour"], fromTimes["minute"], fromTimes["second"], dataPoint.name));
                    }
                }
            }
        }
    }
}

function splitTimeString(string) {
    let response = {};
    string = string.toLowerCase();
    if (string.includes("h")) {
        let split = string.split("h");
        response["hour"] = parseInt(split[0]);
        string = split[1];
    }
    if (string.includes("m")) {
        let split = string.split("m");
        response["minute"] = parseInt(split[0]);
        string = split[1];
    }
    if (string.includes("s")) {
        let split = string.split("s");
        response["second"] = parseInt(split[0]);
    }
    return response;
}

function addTimeStringTogether(string) {
    let result = 0;
    string = string.toLowerCase();
    if (string.includes("h")) {
        let split = string.split("h");
        result += TimeF.HOUR * parseInt(split[0]);
        string = split[1];
    }
    if (string.includes("m")) {
        let split = string.split("m");
        result += TimeF.MINUTE * parseInt(split[0]);
        string = split[1];
    }
    if (string.includes("s")) {
        let split = string.split("s");
        result += TimeF.SECOND * parseInt(split[0]);
    }
    return result;
}

class TimeSlot {
    constructor(day, length = TimeF.HOUR, hours = 1, minutes = 0, seconds = 0, name = "") {
        this.day = day;
        this.length = length;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.name = name;
    }
}