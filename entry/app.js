//app.js creates the server and passes info to module
var http = require('http');
var url = require('url');
var utils = require('./server-utils.js');
var fileServer = require('./fileserve.js');
var nodeRetriever = require("./node-retriever.js");
var ambRetriever = require("./ambiance-retriever.js");

function ProcessQuery(query, res) { //handle queries
    switch (query["request"]) { //switch case that looks at the request portion of the query
        case "GetNextNodes": //if the request is GetNextNodes
            nodeRetriever.GetNextNodes(res, query); //get the child nodes of the user selected parent
            break;
        case "UpdateBackground": //if the request is UpdateBackground
            ambRetriever.updateBackground(res, query["location"]);
            //write a function for this- should be in ambiance-retriever.js
            break;
        case "UpdateSound": //if the request is UpdateSound
            ambRetriever.updateSound(res, query["location"]);
            //write a function for this- should be in ambiance-retriever.js
            break;
        case "AddNewNode":
            nodeRetriever.AddNewNode(res, query); //run the code to add a new node
            break;
        default: //otherwise there's an unrecognized request
            var errObj = {message: "Query not supported"}; //create error msg
            utils.sendJSONObj(res, 500, errObj); //send error msg via json
            break;
    }
}

function ServeStuff(req, res) { //serves stuff
    //extracts possible query from req
    var query = url.parse(req.url).query; //if there's a query, put it here
    var filepath = url.parse(req.url).pathname.substring(1); //if there's a filepath, put it here
    if (filepath) { //if there's a filepath
        fileServer.ServeFile(filepath, res); //serve that file to the client
    }
    if (query) { //if there's a query
        query = utils.StringToQuery(query); //parse the query into a dictionary and replace query with the parsed version
        ProcessQuery(query, res); //process the parsed query
    }
}

var server = http.createServer(ServeStuff); //creates a server
server.listen(8080); //listens for an incoming request from the client
console.log("Server running on port 8080");
