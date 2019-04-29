//author: Virtue Winter
//date: 12 February 2019
//description: the following code supplies the listeners and
//event handlers for the possible actions taken in a brief, interactive quiz.
//hovering, clicking, and double-clicking all trigger different events.

//hide the first message, proceed to message 2
function hidemymsg1() {
    document.getElementById("mymsg1").style.visibility = "hidden";
    document.getElementById("mymsg2").style.visibility = "visible";
}

//hide the second message, proceed to message 3
function hidemymsg2() {
    document.getElementById("mymsg2").style.visibility = "hidden";
    document.getElementById("mymsg3").style.visibility = "visible";

}

//hide the third message, proceed to last message
function hidemymsg3() {
    document.getElementById("mymsg3").style.visibility = "hidden";
    document.getElementById("mymsg4").style.visibility = "visible";
}

//hide last message and show first message in order to start over
function startover() {
    document.getElementById("mymsg4").style.visibility = "hidden";
    document.getElementById("mymsg1").style.visibility = "visible";
}

//on hover, hide first message and show second
mymsg1listener = document.getElementById("mymsg1");
mymsg1listener.addEventListener("mouseover",hidemymsg1)

//on click, either button will hide the second message and show the third
mymsg2listener1 = document.getElementById("choice1");
mymsg2listener1.addEventListener("click",hidemymsg2)

//on click, either button will hide the second message and show the third
mymsg2listener2 = document.getElementById("choice2");
mymsg2listener2.addEventListener("click",hidemymsg2)

//on click, either button will hide the third message and show the last
mymsg3listener1 = document.getElementById("choice3");
mymsg3listener1.addEventListener("click",hidemymsg3)

//on click, either button will hide the third message and show the last
mymsg3listener2 = document.getElementById("choice4");
mymsg3listener2.addEventListener("click",hidemymsg3)

//on double click, the last message will hide and the first will show again
mymsg4listener = document.getElementById("mymsg4");
mymsg4listener.addEventListener("dblclick",startover)