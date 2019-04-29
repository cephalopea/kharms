var utils = require("./server-utils.js");
var fs = require("fs");

var txtDB = "public-html/txt/fake-db.txt";
var userDB = "public-html/txt/save-keys.txt";
var nodes = undefined;

function StringifyNode(node) { //returns nodes like this: id=1|parent=0|type=user|text=I spin around in a circle.|location=field
    var finishedNode = ""; //empty string to append to
    Object.entries(node).forEach(([key, value]) => { //loop through key/val pairs
        finishedNode += key + "=" + value + "|"; //add separators
    });
    var spaceRegexp = new RegExp("%20", "g");
    var apostRegexp = new RegExp("%27", "g");
    finishedNode = finishedNode.replace(spaceRegexp, " "); //replace url space with regular space
    finishedNode = finishedNode.replace(apostRegexp, "'"); //replace url ' with regular '
    return finishedNode.slice(0,-1); //remove unnecessary | from end of string, and return
}

function UnstringifyNode(node) { //returns nodes like this: {"id": 1, "parent": 0, "type": "user", "text": "I spin around in a circle.", "location": "field"}
    var finishedNode = {}; //create empty dict for finished node
    var nodeBits = node.split("|"); //split the nodes at the | symbol used to separate key/val pairs
    for (let trait of nodeBits) { //for each key/val pair in the node
        var keyval = trait.split("="); //divide the key and the value at the = symbol
        finishedNode[keyval[0]] = keyval[1]; //add the key and the value to the node object (finishedNode)
    }
    return finishedNode; //return the node
}

function LoadAllNodes(filepath) { //gets all the nodes from the txt file database
    //assumes txt file is formatted with each node on a newline, commas between key/val pairs, and = between key and value (no colon)
    //sample input line:
    //id=1|parent=0|type=user|text=I spin around in a circle.|location=field
    var finalNodes = []; //holds all the nodes retrieved from the database/txt doc
    var nodeDoc = fs.readFileSync(filepath).toString(); //read everything in the txt doc and convert to string
    if (nodeDoc != "") {
        var addNodes = nodeDoc.split("\n"); //split the string at newlines (split into nodes)
        for (let node of addNodes) { //for each string that represents a node
            finalNodes.push(UnstringifyNode(node)); //add finishedNode to the collection of all the nodes
        }
    } else {
        finalNodes = "EMPTY";
    }
    return finalNodes; //return all the nodes (or nothing, if there's nothing)
}

exports.AddNewNode = (res, newNode) => {
    delete newNode["request"]; //get rid of the request portion of the node
    var newNodeString = StringifyNode(newNode); //turn the new node into a string
    if (newNode["id"] != 0) { //this isn't the first node, it needs a newline
        newNodeString = "\n" + newNodeString;
    }
    var spaceRegexp = new RegExp("%20", "g");
    var apostRegexp = new RegExp("%27", "g");
    newNode["text"] = newNode["text"].replace(spaceRegexp, " "); //replace url space with regular space
    newNode["text"] = newNode["text"].replace(apostRegexp, "'"); //replace url ' with regular '
    fs.appendFile(txtDB, newNodeString, (err) => { //append the new node to the text file OR add it to the database, depending on implementation 
        if (err) {
            utils.sendJSONObj(res, 500, {error: "Error adding new node to database"}); //send error msg to client
        } else {
            if (nodes != "EMPTY") { //if we already have nodes loaded to this file
                nodes.push(newNode); //add the new node to the collection of all nodes already loaded
            } else {
                nodes = [newNode];
            }
            utils.sendJSONObj(res, 200, {nodes: [newNode]}); //send a JSON obj to client with new node
        }
    })   
}

exports.GetNextNodes = (res, query) => { //gets the child nodes of a given node based on that node's text content
    //get the children of this node
    var prevNode = query["parent"]; //get text of prev node
    if (nodes == undefined) { //if the nodes aren't loaded already
        nodes = LoadAllNodes(txtDB); //get all the nodes
    }
    var nodesToLoad = undefined; //create a variable to hold the child nodes and set it explicitly to undefined for now
    if (nodes == "EMPTY") {
        nodesToLoad = ["EMPTY"];
    } else if (query["text"] == "ALL") {
        nodesToLoad = nodes;
    } else {
        nodesToLoad = nodes.filter(node => { //filter all the nodes and assign the returned nodes to nodesToLoad
            return(node["parent"] == prevNode); //get the nodes whose parent matches the parent passed in
        });
    }
    var sendObj = {nodes: nodesToLoad}; //make an object (sendObj) to send that contains the child nodes of our selected parent
    utils.sendJSONObj(res, 200, sendObj); //send a JSON obj to client with sendObj
}
