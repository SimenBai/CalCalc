import * as TimeF from "./TimeFunctions.mjs";

export const SUNDAY = 0;
export const MONDAY = 1;
export const TUESDAY = 2;
export const WEDNESDAY = 3;
export const THURSDAY = 4;
export const FRIDAY = 5;
export const SATURDAY = 6;

export class TimeSpan {
    static splitTime(period, date1, date2) {
        date1 = Date.parse(date1);
        date2 = Date.parse(date2);
        let dates = [];

        let closestRoundPeriod = (Math.floor(date1 / period) * period);
        dates.push(new TimeSpan(closestRoundPeriod, closestRoundPeriod + period - date1));

        let tempDate = closestRoundPeriod + period;
        while (tempDate + period < date2) {
            dates.push(new TimeSpan(tempDate, period));
            tempDate += period;
        }
        dates.push(new TimeSpan(tempDate, date2 - tempDate));

        return dates;
    }

    constructor(from, length) {
        this.from = (typeof from !== "number") ? Date.parse(from) : from;
        this.length = length;
    }

    getLength() {
        return this.length;
    }

    getFrom() {
        return this.from;
    }

    print(rounding = 2, timeFrame = TimeF.MINUTE) {
        console.log(this.getString(rounding, timeFrame));
    }

    getString(rounding = 2, timeFrame = TimeF.MINUTE) {
        let timeWord = " time"
        if (timeFrame == TimeF.SECOND) {
            timeWord = " seconds";
        }
        if (timeFrame == TimeF.MINUTE) {
            timeWord = " minutes";
        }
        if (timeFrame == TimeF.HOUR) {
            timeWord = " hours";
        }
        return (this.length / timeFrame).toFixed(rounding) + timeWord + " in the given period from " + TimeF.getTime(new Date(this.from));
    }

    inTimespan(timeSpan) {
        return (timeSpan.getFrom() <= this.from && timeSpan.getFrom() + timeSpan.getLength() >= this.from + this.length);
    }

    inTimespanP(timeSpan) {
        let result = this.inTimespan(timeSpan)
        let resultText = result;
        console.log("Is within the given timespan: " + resultText);
        return result;
    }


    inDateTime(day, length = TimeF.HOUR, hours = 1, minutes = 0, seconds = 0) {
        let date = new Date(this.from);
        // Sunday - Saturday : 0 - 6
        let dayChecked = null;
        if(date.getDay() < day){
            //Given day is after date
            dayChecked = new Date(this.from);
            dayChecked.setDate(date.getDate() + (day - date.getDay()-7))
            dayChecked.setHours(hours, minutes, seconds);
        } else{
            //Given day is before or same as date
            dayChecked = new Date(this.from);
            dayChecked.setDate(date.getDate() + (day-date.getDay()));
            dayChecked.setHours(hours, minutes, seconds);
        }
        return (this.inTimespan(new TimeSpan(dayChecked, length)));
    }

    inDateTimeP(day, length = TimeF.HOUR, hours = 1, minutes = 0, seconds = 0) {
        let result = this.inDateTime(day, length, hours, minutes, seconds);
        let resultText = result;
        console.log("Is within the given timespan: " + resultText);
        return result;
    }
}