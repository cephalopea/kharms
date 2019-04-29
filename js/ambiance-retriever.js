var utils = require("./server-utils.js");
var fileserver = require("./fileserve");
var fs = require("fs");
var path = require('path');

export updateBackground = function(query) { // location is the location of the story. eg. 'field'
    var file_name = "images/" + query["location"] + ".mp3";
    return {error: undefined, files: file_name};
}

export updateSound = function(query) {
    var file_name = "sounds/" + query["location"] + ".jpeg";
    return {error: undefined, files: file_name};
}