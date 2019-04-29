//images from search.creativecommons.org
//sound files from freesound.org
import * as ambRetriever from "./ambiance-retriever.js";

var location = undefined;
var audio = null;

function GetSound(query) {
    var file_name = "sounds/" + query["location"] + ".jpeg";
    UpdateSound({error: undefined, files: file_name});
}

function GetBackground(query) { // location is the location of the story. eg. 'field'
    var file_name = "images/" + query["location"] + ".mp3";
    UpdateBackground({error: undefined, files: file_name});
}

function UpdateBackground(backgroundObj) { //change the background image file to the one sent by the server
    if (backgroundObj["error"] != undefined) {
        alert("Error loading photos"); //if did not successfully receive a response
    } else { //if successfully received a response
        document.body.style.backgroundImage = "url(" + backgroundObj["files"] + ")";
    }     
}

function UpdateSound(soundObj) { //change the sound file to the one sent by the server
    if (soundObj["error"] != undefined) {
        alert("Error loading sounds");
    }
    else {
        //next if/else adapted from here:
        //https://stackoverflow.com/questions/20071328/how-to-stop-and-play-multiple-sounds-in-html5-without-overlapping-them
        var audio_file_name = + soundObj["files"];
        if (audio === null) {  
            audio = new Audio(audio_file_name);  
            audio.loop = true;
            audio.play();        
        }  
        else {
            audio.pause();  
            audio.src = audio_file_name;  
            audio.play();  
        }    
    }
}

export function CheckLocation(currNode) { //figure out if the location has changed
    if (location != currNode["location"]) { //if the location stored doesn't equal the new location
        location = currNode["location"]; //set the stored location to equal the new one
        GetBackground({"location": location});
        GetSound({"location": location});
    }
}