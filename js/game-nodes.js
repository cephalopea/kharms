import * as loc from "./location.js";
import * as nodeRetriever from "./file-retriever.js";

function SelectOption() { //handles selecting a node
    var id = this.id; //because we're deleting the clicked node, store its id first
    //going to remove all the history nodes as well for this game because the text flows better
    /*this.classList.remove("user"); //remove the user class from the selected node
    this.classList.add("history"); //add the history class to the selected node
    this.style.textDecoration = "none"; //remove possible underline from the text displayed
    this.removeEventListener("click", SelectOption); //remove the event listeners from this node
    this.removeEventListener("mouseover", AddUnderline);
    this.removeEventListener("mouseout", RemoveUnderline);*/
    var unchosenElems = document.getElementsByClassName("user"); //get all the remaining unpicked nodes
    var elems = undefined; //set up a var to hold elements and explicitly set it to undefined
    while (elems = document.getElementsByClassName("user")) { //while there are still user elements left, assign them to elems
        if (elems[0] == undefined) { //if there's no user elements left in the page, elems will be undefined
            break; //don't do anything, there's nothing left to do things to
        } else { //if there are user elems left in the page
            elems[0].parentNode.removeChild(elems[0]); //remove the first one from the page
        }
    }
    nodeRetriever.GetNextNodes({parent: id}, LoadNodes); //send a request to the server to load the next set of child nodes
}

function AddUnderline() { //adds an underline to an element
    this.style.textDecoration = "underline";
}

function RemoveUnderline() { //removes an underline from an element
    this.style.textDecoration = "none";
}

function LoadNodes(nodes) { //load received nodes into the html page
    if (nodes["error"] != undefined) {
        console.log("error retrieving nodes");
        return false;
    } else {
        var body = document.getElementsByTagName("body")[0]; //get the body of the page
        var authNode = nodes["nodes"].filter(node => { //filter the nodes and get only the auth node, save it in authNodes
            return (node["type"] == "auth");
        })
        authNode = authNode[0]; //should only ever be one auth node at a time, so set this to the first element to get it out of the array
        var userNodes = nodes["nodes"].filter(node => { //filter the nodes and get only the user nodes, save them in userNodes
            return (node["type"] == "user");
        })
        console.log("user nodes: " + userNodes);
        var textRep = document.createElement("p"); //create a paragraph element to hold authnode text
        textRep.innerHTML = authNode["text"]; //set inner html of p elem to authnode text
        textRep.classList.add("auth"); //add auth class to p elem
        body.appendChild(textRep); //append the p elem to the body of the page
        if (userNodes.length > 0) {
            for (let node of userNodes) { //do the same basic thing for all the user nodes
                
                var textRep = document.createElement("p"); //create p elem
                textRep.innerHTML = node["text"]; //add node text to p elem
                textRep.setAttribute("id", node["id"]);
                textRep.classList.add("user"); //add user class to p elem
                body.appendChild(textRep); //append the elem to the body
                textRep.addEventListener("click", SelectOption); //add the three event listeners
                textRep.addEventListener("mouseover", AddUnderline); 
                textRep.addEventListener("mouseout", RemoveUnderline);
                textRep.scrollIntoView(); //scroll down so this is visible
            }
        } else {
            var tryAgainLink = document.createElement("a"); //create link
            tryAgainLink.innerHTML = "Try again?"; //set link text
            tryAgainLink.setAttribute("href", "/game.html"); //set link target
            body.appendChild(tryAgainLink); //append try again to bottom
            tryAgainLink.scrollIntoView(); //scroll to bottom
        }
        var breakk = document.createElement("p"); //add some space between sets of nodes
        body.appendChild(breakk); //append to body
        loc.CheckLocation(authNode); //check location
        return authNode; //return the authnode
    }
}

function init() {
    nodeRetriever.GetNextNodes({parent: "ROOT"}, LoadNodes); //send a request to the server to load the next set of child nodes
}

init()