const SECOND = 1000;
const MINUTE = SECOND*60;
const HOUR = MINUTE*60;

const localeDateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export function printTime(date){
    console.log(getTime(date));
}

export function getTime(date){
    return date.toLocaleTimeString("en-GB",localeDateOptions);
}

export {SECOND, MINUTE, HOUR};