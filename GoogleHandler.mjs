let url = 'credentials.json';
let json = {};

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

// Client ID and API key from the Developer Console
var CLIENT_ID = "";
var API_KEY = "";


getJson((json) => {
    CLIENT_ID = json.web.client_id;
    API_KEY = json.web.api_key;
});

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
export function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}
/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    }).then(() => {
        getCalenderIDs();
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn().then(()=>{
        getCalenderIDs();
    });
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    document.getElementById('select').innerHTML = "";
    document.getElementById('content').innerHTML = "";
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function getCalenderIDs() {
    gapi.client.request({
        path: "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    }).then(function (response) {
        let nameValueArray = [];
        response.result.items.forEach((item) => {
            nameValueArray.push({"name": item.summary, "value": item.id});
        });
        makeSelect(nameValueArray);
    });
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents(calenderID) {
    gapi.client.calendar.events.list({
        'calendarId': calenderID,
        'timeMin': new Date(new Date(new Date().setDate(16)).setMonth(new Date().getMonth() - 2)).toISOString(),
        'timeMax': new Date(new Date(new Date().setDate(15)).setMonth(new Date().getMonth() - 1)).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 100,
        'orderBy': 'startTime'
    }).then((response) => {
        handleResponse(response);
    });
}

function makeSelect(nameValueArray) {
    document.getElementById('select').innerHTML = "";
    let selectElement = document.createElement("SELECT");

    let option = document.createElement("option");
    option.text = "Select a calender";
    option.setAttribute("disabled", true);
    option.setAttribute("selected", true);
    selectElement.options.add(option);
    nameValueArray.forEach((nameValue) => {
        let option = document.createElement("option");
        option.setAttribute("value", nameValue.value);
        option.text = nameValue.name;
        selectElement.options.add(option);
    });
    selectElement.addEventListener('change', (event) => {
        selectUpdate(event);
    });

    document.getElementById('select').append(selectElement);
}

function selectUpdate(event) {
    listUpcomingEvents(event.target.value);
}