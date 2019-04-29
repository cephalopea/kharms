import * as utils from "./client-utils.js";

var textDiv = undefined;
var form = undefined;
var formDiv = undefined;
var passField = undefined;
var nextID = undefined;

function init() {
    nextID = 0;
    textDiv = document.getElementById("text");
    form = document.getElementById("password");
    passField = document.getElementById("pass");
    formDiv = document.getElementById("form");
    textDiv.innerHTML = "";
    document.getElementById("sub").addEventListener("click", checkPassword);
    return true;
}

function addNodeInfo(data) { //spawns the entry form for adding new nodes
    var nodes = JSON.parse(data.srcElement.responseText);
    if (nodes["nodes"] == "EMPTY") {
        addChildNodeForm();
        return true;
    } else {
        for (let node of nodes["nodes"]) {
            var nodePar = document.createElement("div"); //create paragraph elem to hold node info
            nodePar.classList.add("nodeDesc");
            if (node.id > nextID) { //check if the next available id needs to be incremented
                nextID = node.id; //set id equal to larger, taken, id
                nextID++; //increment next id by 1
            }
            nodePar.innerHTML = "<p>id: " + node["id"] + "</p><p>parent: " + node["parent"] + "</p><p>type: " + node["type"] + "</p><p>text: " + node["text"] + "</p><p>location: " + node["location"] + "</p>"; //add node info to parent elem
            textDiv.appendChild(nodePar); //add paragraph elem to text div
            nodePar.addEventListener("click", addChildNodeForm); //add event listener to create a new child when node is clicked
        }
        return true;
    }
}

function addChildNodeForm() { //creates a form to add a child node and adds it to the page
    var newForm = document.createElement("div"); //create a div that acts like a form
    var formElements = [];
    
    var idLabel = document.createElement("label"); //create a label for id field
    idLabel.innerHTML = "ID: ";
    formElements.push(idLabel);
        
    var idField = document.createElement("label"); //create an id label for new node
    idField.innerHTML = nextID; //set text to next available id
    nextID++; //increment next id
    formElements.push(idField);
    
    var parentLabel = document.createElement("label");
    parentLabel.innerHTML = "Parent: ";
    formElements.push(parentLabel);
    
    var parentField = document.createElement("input"); //create an parent id field for new node
    parentField.setAttribute("type", "text"); //set to text field
    if (nextID > 1) { //if nextID is 1, this new node will be the first node, so it has no parent
        parentField.setAttribute("value", this.childNodes[0].innerHTML.split(" ")[1]); //set default value to clicked node's id
    } else { //this is the first node, set parent to ROOT
        parentField.setAttribute("value", "ROOT"); //set default value to clicked node's id
    }
    formElements.push(parentField);
    
    var typeLabel = document.createElement("label");
    typeLabel.innerHTML = "Type: ";
    formElements.push(typeLabel);
    
    var typeField = document.createElement("input"); //create a type field for new node
    typeField.setAttribute("type", "text"); //set to text field
    formElements.push(typeField);
    
    var textLabel = document.createElement("label");
    textLabel.innerHTML = "Text: ";
    formElements.push(textLabel);
    
    var textField = document.createElement("input"); //create a text field for new node
    textField.setAttribute("type", "text"); //set to text field
    formElements.push(textField);
    
    var locationLabel = document.createElement("label");
    locationLabel.innerHTML = "Location: ";
    formElements.push(locationLabel);
    
    var locationField = document.createElement("input"); //create a location field for new node
    locationField.setAttribute("type", "text"); //set to text field
    if (nextID > 1) { //if nextID is 1, this new node will be the first node, so it has no default location, just leave it blank, otherwise set it to parent
        locationField.setAttribute("value", this.childNodes[4].innerHTML.split(" ")[1]); //set default value to clicked node's location
    }
    formElements.push(locationField);
    
    var submitButton = document.createElement("button"); //add a button to create new node
    submitButton.setAttribute("id", idField.innerHTML);
    submitButton.innerHTML = "Add Node"; //set button text
    submitButton.addEventListener("click", enterChildNode); //add submit event listener to button
    formElements.push(submitButton);
    
    formElements.forEach((elem) => { //append all child elems to new form
        newForm.appendChild(elem);
    });
    
    newForm.classList.add("nodeDesc"); //add the nodeDesc class to the div, this mostly is just to make the page a little neater
    newForm.setAttribute("id", idField.innerHTML + "form") //set id so that form is locatable from button
    
    textDiv.appendChild(newForm); //append container div to text div
    
    return true;
}

function enterChildNode() {
    var fields = this.parentNode.childNodes; //get all the child nodes of the form div (input fields, button, and labels)
    var xmlObj = {}; //create empty xml obj
    xmlObj["request"] = "AddNewNode"; //add request
    xmlObj["id"] = fields[1].innerHTML; //add assigned id
    xmlObj["parent"] = fields[3].value; //add parent node
    xmlObj["type"] = fields[5].value; //add type of node
    xmlObj["text"] = fields[7].value; //add node text
    xmlObj["location"] = fields[9].value; //add node location
    this.parentNode.parentNode.removeChild(this.parentNode); //remove this form and its encapsulating div from the page
    utils.SendXML(xmlObj, addNodeInfo); //send request and info for new node to server
    return true;
}

function checkPassword() { //checks the password
    if (passField.value == "dundermifflin") { //if the password is correct
        formDiv.innerHTML = ""; //remove the password field
        utils.SendXML({request: "GetNextNodes", text: "ALL"}, addNodeInfo); //get all the nodes, then add to page
    } else {
        textDiv.innerHTML = "<p>Password incorrect, please try again.</p>"; //display incorrect password message
    }
    return true;
}

init();