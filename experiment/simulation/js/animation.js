import { setCoordinates, fillInputDots, fillColor, objectDisappear, objectAppear, setColor, unsetColor, calculateAnd, calculateOr } from "./animation-utility.js";

'use strict';

window.appendInput1 = appendInput1;
window.appendInput0 = appendInput0;
window.appendSelect = appendSelect;
window.simulationStatus = simulationStatus;
window.restartCircuit = restartCircuit;
window.setSpeed = setSpeed;



// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
const sidePanels = document.getElementsByClassName("v-datalist-container");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window
const windowHeight = window.innerHeight;
const width = window.innerWidth;

const svg = document.querySelector(".svg");
const svgns = "http://www.w3.org/2000/svg";

const EMPTY = "";
// stroing the necessary div elements in const
const status = document.getElementById("play-or-pause");
const observ = document.getElementById("observations");
const speed = document.getElementById("speed");

// global varaibles declared here
// input 0 is at the top (its AND gate gets the inverted select line), input 1 is at the bottom
const objects = [
    document.getElementById("input0"),
    document.getElementById("select"),
    document.getElementById("input1"),
    document.getElementById("output")
];
const textInput = [
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text"),
    document.createElementNS(svgns, "text")
];
const textOutput = [
    document.createElementNS(svgns, "text")
];
const dots = [
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle"),
    document.createElementNS(svgns, "circle")
];
// First dot emerges from input 0
// Next 2 dots emerge from select
// Next dot emerges from input 1



// decide help to decide the speed
let decide = false;
// circuitStarted is initialised to 0 which depicts that demo hasn't started whereas circuitStarted 1 depicts that the demo has started.
let circuitStarted = false;


// function to take care of width
function demoWidth() {
    if (width < 1024) {
        circuitBoard.style.height = "600px";
    } else {
        circuitBoard.style.height = `${windowHeight - circuitBoardTop - 20}px`;
    }
    sidePanels[0].style.height = circuitBoard.style.height;
}

// function to initialise the input text i.e. either 0/1 that gets displayed after user click on them
function textIOInit() {
    for (const text of textInput) {
        text.textContent = 2;
    }
}


// function to mark the output coordinates
function outputCoordinates() {
    setCoordinates(876, 394, textOutput[0]);
    svg.append(textOutput[0]);
}

// function to mark the input dots
function inputDots() {
    for (const dot of dots) {
        fillInputDots(dot, 20, 550, 15, "#FF0000");
        svg.append(dot);
    }
}

// function to disappear the input dots
function inputDotDisappear() {
    for (const dot of dots) {
        objectDisappear(dot);
    }
}

// function to appear the input dots
function inputDotVisible() {
    for (const dot of dots) {
        objectAppear(dot);
    }
}
// function to disappear the output text
function outputDisappear() {
    for (const text of textOutput) {
        objectDisappear(text);
    }
}
// function to appear the output text
function outputVisible() {
    for (const text of textOutput) {
        objectAppear(text);
    }
}
// function to diappear the input text
function inputTextDisappear() {
    for (const text of textInput) {
        objectDisappear(text);
    }
}

function clearObservation() {
    observ.innerHTML = EMPTY;
}
function allDisappear() {
    inputDotDisappear();
    outputDisappear();
    inputTextDisappear();
    for (const object of objects) {
        fillColor(object, "#008000");
    }
}

// returns true if the inputs can be changed; a finished simulation is rewound so that new inputs can be tried
function inputsEditable() {
    if (timeline.progress() === 1) {
        rewind();
    }
    if (timeline.progress() !== 0) {
        observ.innerHTML = "Inputs cannot be changed while the simulation is running. Please click on Reset to change them.";
        return false;
    }
    return true;
}

// colours the dots of every input as per the value of that input
function inputDotColours() {
    setter(textInput[0].textContent, dots[0]);
    for (let i = 1; i < 3; i++) {
        setter(textInput[1].textContent, dots[i]);
    }
    setter(textInput[2].textContent, dots[3]);
}

// sets all the inputs to 0 so that the simulation can be started right away
function initInputs() {
    textIOInit();
    appendInput0();
    appendSelect();
    appendInput1();
}

function appendInput0() {
    if (!inputsEditable()) {
        return;
    }
    if (textInput[0].textContent !== "0") {
        changeto0(16, 24, 0, 0);
    }
    else {
        changeto1(16, 24, 0, 0);
    }
    setter(textInput[0].textContent, dots[0]);
}
function appendSelect() {
    if (!inputsEditable()) {
        return;
    }
    if (textInput[1].textContent !== "0") {
        changeto0(16, 394, 1, 1);
    }
    else {
        changeto1(16, 394, 1, 1);
    }
    for (let i = 1; i < 3; i++) {
        setter(textInput[1].textContent, dots[i]);
    }
}
function appendInput1() {
    if (!inputsEditable()) {
        return;
    }
    if (textInput[2].textContent !== "0") {
        changeto0(16, 764, 2, 2);
    }
    else {
        changeto1(16, 764, 2, 2);
    }
    setter(textInput[2].textContent, dots[3]);
}

function changeto1(coordinateX, coordinateY, object, textObject) {
    textInput[textObject].textContent = 1;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX, coordinateY, textInput[textObject]);
    fillColor(objects[object], "#29e");
    clearObservation();
    objectAppear(textInput[textObject]);
}

function changeto0(coordinateX, coordinateY, object, textObject) {
    textInput[textObject].textContent = 0;
    svg.appendChild(textInput[textObject]);
    setCoordinates(coordinateX, coordinateY, textInput[textObject]);
    fillColor(objects[object], "#eeeb22");
    clearObservation();
    objectAppear(textInput[textObject]);
}
let not = "0";
let and1 = "0";
let and2 = "0";
let or = "0";

// NOT gate inverts the select line
function stage1() {
    not = textInput[1].textContent === "1" ? "0" : "1";
    setter(not, dots[1]);
}
// upper AND gate: input 0 AND (NOT select), lower AND gate: input 1 AND select
function stage2() {
    and1 = calculateAnd(textInput[0].textContent, not);
    and2 = calculateAnd(textInput[2].textContent, textInput[1].textContent);
    setter(and1, dots[0]);
    setter(and2, dots[3]);
    objectDisappear(dots[1]);
    objectDisappear(dots[2]);
}
// OR gate combines the outputs of the two AND gates
function stage3() {
    or = calculateOr(and1, and2);
    setter(or, dots[0]);
    objectDisappear(dots[3]);
}



function outputSetter() {
    inputDotDisappear();
    textOutput[0].textContent = or;
    setter(textOutput[0].textContent, objects[3]);
}

function display() {
    decide = false;
    status.innerHTML = "Start";
    const selected = textInput[1].textContent === "1" ? "INPUT 1" : "INPUT 0";
    observ.innerHTML = `Simulation has finished.<br>SELECT = ${textInput[1].textContent}, so OUTPUT = ${selected} = ${textOutput[0].textContent}<br>Click on an input to change it and then click on Start to simulate again.`;
}

// takes the timeline back to the beginning while keeping the selected input values
function rewind() {
    timeline.seek(0);
    timeline.pause();
    inputDotDisappear();
    inputDotColours();
    outputDisappear();
    fillColor(objects[3], "#008000");
    decide = false;
    status.innerHTML = "Start";
}

function setter(value, component) {
    if (value === "1") {
        unsetColor(component);
    }
    else if (value === "0") {
        setColor(component);
    }
}

function setSpeed(speed) {
    timeline.timeScale(parseInt(speed));
    if (circuitStarted) {
        observ.innerHTML = `${speed}x speed`;
    }
}

function restartCircuit() {
    if (circuitStarted) {
        circuitStarted = false;
    }
    timeline.seek(0);
    timeline.pause();
    allDisappear();
    initInputs();
    decide = false;
    status.innerHTML = "Start";
    observ.innerHTML = "Successfully restored";
    speed.selectedIndex = 0;
    timeline.timeScale(1);
}

function simulationStatus() {
    if (!decide) {
        startCircuit();
    }
    else if (decide) {
        stopCircuit();
    }
}
function stopCircuit() {
    if (timeline.time() !== 0 && timeline.progress() !== 1) {
        timeline.pause();
        observ.innerHTML = "Simulation has been Paused. Please click on the 'Start' button to Resume.";
        decide = false;
        status.innerHTML = "Start";
    }
    else if (timeline.progress() === 1) {
        observ.innerHTML = "Please Restart the simulation";
    }
}
function startCircuit() {
    for (const text of textInput) {
        if (text.textContent === "2") {
            observ.innerHTML = "Please set the input values";
            return;
        }
    }
    if (timeline.progress() === 1) {
        rewind();
    }
    if (timeline.progress() !== 1) {
        if (!circuitStarted) {
            circuitStarted = true;
        }
        timeline.play();
        timeline.timeScale(parseInt(speed.value));
        observ.innerHTML = "Simulation has started.";
        decide = true;
        status.innerHTML = "Pause";
    }
    else if (timeline.progress() === 1) {
        observ.innerHTML = "Please Restart the simulation";
    }
}



// all the execution begin here
let timeline = gsap.timeline({ repeat: 0, repeatDelay: 0 });
gsap.registerPlugin(MotionPathPlugin);
demoWidth();
// calling all the functions that are going to initialise 
textIOInit();
outputCoordinates();
inputDots();
outputDisappear();

timeline.add(inputDotVisible, 0);
timeline.add(stage1, 10);
timeline.add(stage2, 12.5);
timeline.add(stage3, 20);
timeline.add(outputSetter, 25);
timeline.add(outputVisible, 25);
timeline.eventCallback("onComplete", display);

timeline.to(dots[0], {
    motionPath: {
        path: "#path1",
        align: "#path1",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 20,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[1], {
    motionPath: {
        path: "#path3",
        align: "#path3",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 12,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[2], {
    motionPath: {
        path: "#path4",
        align: "#path4",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 12,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[3], {
    motionPath: {
        path: "#path2",
        align: "#path2",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 20,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);
timeline.to(dots[0], {
    motionPath: {
        path: "#path5",
        align: "#path5",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
    },

    duration: 5,
    delay: 20,
    repeat: 0,
    repeatDelay: 3,
    yoyo: true,
    ease: "none",
    paused: false,

}, 0);


timeline.pause();
inputDotDisappear();
initInputs();