function QueryToString(obj) { //convert a query to a string so it can be sent to server
    var queryString = ""; //create str to return
    var keyz = Object.keys(obj); //get keys from obj
    for (let key of keyz) { //loop through keys and add key/val pairs to string
        queryString += key + "=" + obj[key] + "&";
    }
    return queryString.slice(0,-1); //remove unnecessary ampersand from end and return
}

export function SendXML(request, callback) { //send an xml request to the server and then run the callback function
    var xmlhttp = new XMLHttpRequest(); //create ajax request
    xmlhttp.onload = callback; //run the given callback function when ajax request is received
    xmlhttp.onerror = function() {alert("Error with XML");}; //if there's an error, alert
    request = QueryToString(request); //request to list albums through url
    xmlhttp.open("GET", ("http://localhost:8080/?" + request)); //add request to url query string
    xmlhttp.send(); //send ajax request
}