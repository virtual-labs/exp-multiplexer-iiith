// Dimensions of working area
const circuitBoard = document.getElementById("circuit-board");
const sidePanels = document.getElementsByClassName("v-datalist-container");
// Distance of working area from top
const circuitBoardTop = circuitBoard.offsetTop;
// Full height of window
const windowHeight = window.innerHeight;
const width = window.innerWidth;
if (width < 1024) {
  circuitBoard.style.height = 600 + "px";
} else {
  circuitBoard.style.height = windowHeight - circuitBoardTop - 20 + "px";
}
sidePanels[0].style.height = circuitBoard.style.height;

"use strict";


const svg = document.querySelector(".svg");
const inputpath1 = document.querySelector("#inputpath1");
const svgns = "http://www.w3.org/2000/svg";


let input1Dot = document.createElementNS(svgns, "circle");
gsap.set(input1Dot, {
    attr: { cx: 20, cy: 20, r: 15, fill: "#FF0000" }
});
let input2Dot = document.createElementNS(svgns, "circle");
gsap.set(input2Dot, {
    attr: { cx: 20, cy: 760, r: 15, fill: "#FF0000" }
});
let selectDot1 = document.createElementNS(svgns, "circle");
gsap.set(selectDot1, {
    attr: { cx: 20, cy: 390, r: 15, fill: "#FF0000" }
});
let selectDot2 = document.createElementNS(svgns, "circle");
gsap.set(selectDot2, {
    attr: { cx: 20, cy: 390, r: 15, fill: "#FF0000" }
});



const INPUT1 = document.getElementById("input1");
const INPUT2 = document.getElementById("input2");
const OUTPUT = document.getElementById("output");
const SELECT = document.getElementById("select");
const BUTTON = document.getElementById("play/pause");
const OBSERV = document.getElementById("Observations");

let input1Text = document.createElementNS(svgns, "text");
let input2Text = document.createElementNS(svgns, "text");
let selectText = document.createElementNS(svgns, "text");

input1Text.textContent = 2;
input2Text.textContent = 2;
selectText.textContent = 2;

let mainText = document.createElementNS(svgns, "text");
mainText.textContent = -1;

svg.appendChild(input1Dot);
svg.appendChild(input2Dot);
svg.appendChild(selectDot1);
svg.appendChild(selectDot2);

svg.appendChild(input1Text);
svg.appendChild(input2Text);
svg.appendChild(selectText);
svg.appendChild(mainText);



function allDisAppear() {
    TweenLite.to(input1Dot, 0, { autoAlpha: 0 });
    TweenLite.to(input2Dot, 0, { autoAlpha: 0 });
    TweenLite.to(selectDot1, 0, { autoAlpha: 0 });
    TweenLite.to(selectDot2, 0, { autoAlpha: 0 });



}
function REBOOT() {
    input1Text.textContent = 2;
    input2Text.textContent = 2;
    selectText.textContent = 2;

    allDisAppear();
    input1Disappear();
    input2Disappear();
    selectDisappear();
    mainDisappear();
    gsap.set(INPUT1, {

        fill: "#008000"
    });
    gsap.set(INPUT2, {

        fill: "#008000"
    });
    gsap.set(SELECT, {

        fill: "#008000"
    });
    gsap.set(OUTPUT, {

        fill: "#008000"
    });

}
allDisAppear();

function input1Disappear() {
    TweenLite.to(input1Text, 0, { autoAlpha: 0 });
}
function input1Visible() {
    TweenLite.to(input1Text, 0, { autoAlpha: 1 });
}
function input2Disappear() {
    TweenLite.to(input2Text, 0, { autoAlpha: 0 });
}
function input2Visible() {
    TweenLite.to(input2Text, 0, { autoAlpha: 1 });
}
function selectDisappear() {
    TweenLite.to(selectText, 0, { autoAlpha: 0 });
}
function selectVisible() {
    TweenLite.to(selectText, 0, { autoAlpha: 1 });
}


function mainVisible() {
    TweenLite.to(mainText, 0, { autoAlpha: 1 });
}

function mainDisappear() {
    TweenLite.to(mainText, 0, { autoAlpha: 0 });
}



function selectDotDisappear() {
    TweenLite.to(selectDot1, 0, { autoAlpha: 0 });
    TweenLite.to(selectDot2, 0, { autoAlpha: 0 });
}
function inputDotDisappear() {
    TweenLite.to(input1Dot, 0, { autoAlpha: 0 });
    TweenLite.to(input2Dot, 0, { autoAlpha: 0 });
}


function makeVisible() {
    TweenLite.to(input1Dot, 0, { autoAlpha: 1 });
    TweenLite.to(input2Dot, 0, { autoAlpha: 1 });
    TweenLite.to(selectDot1, 0, { autoAlpha: 1 });
    TweenLite.to(selectDot2, 0, { autoAlpha: 1 });

}
function set(a) {
    gsap.set(a, {

        fill: "#eeeb22"
    });
}//output 0
function unset(a) {
    gsap.set(a, {

        fill: "#29e"
    });
}//output 1
function SETTER(a, b) {
    if (a == 1) {
        unset(b);

    }
    else if (a == 0) {
        set(b);
    }
}
function free() {
    OBSERV.innerHTML = "";
}
function appendInput1() {
    if (input1Text.textContent != 0 && tl.progress() == 0) {
        input1Disappear();
        input1Text.textContent = 0;
        svg.appendChild(input1Text);
        gsap.set(input1Text, {
            x: 16,
            y: 24
        });

        gsap.set(INPUT1, {

            fill: "#eeeb22"
        });
        input1Visible();
        free();
        SETTER(input1Text.textContent, input1Dot);
        OBSERV.innerHTML = "Input1 is set to 0";
    }
    else if (input1Text.textContent != 1 && tl.progress() == 0) {
        appendInput1To1();
    }
}
function appendInput1To1() {
    input1Disappear();
    input1Text.textContent = 1;
    svg.appendChild(input1Text);
    gsap.set(input1Text, {
        x: 16,
        y: 24
    });
    gsap.set(INPUT1, {

        fill: "#29e"
    });
    input1Visible();
    free();
    SETTER(input1Text.textContent, input1Dot);
    OBSERV.innerHTML = "input1 is set to 1";

}
function appendSelect() {
    if (selectText.textContent != 0 && tl.progress() == 0) {
        selectDisappear();
        selectText.textContent = 0;
        svg.appendChild(selectText);
        gsap.set(selectText, {
            x: 16,
            y: 394
        });

        gsap.set(SELECT, {

            fill: "#eeeb22"
        });
        selectVisible();
        free();
        SETTER(selectText.textContent, selectDot1);
        SETTER(selectText.textContent, selectDot2);
        OBSERV.innerHTML = "Select is set to 0";
    }
    else if (selectText.textContent != 1 && tl.progress() == 0) {
        appendSelectTo1();
    }
}
function appendSelectTo1() {
    selectDisappear();
    selectText.textContent = 1;
    svg.appendChild(selectText);
    gsap.set(selectText, {
        x: 16,
        y: 394
    });
    gsap.set(SELECT, {

        fill: "#29e"
    });
    selectVisible();
    free();
    SETTER(selectText.textContent, selectDot1);
    SETTER(selectText.textContent, selectDot2);
    OBSERV.innerHTML = "Select is set to 1";

}
function appendInput2() {
    if (input2Text.textContent != 0 && tl.progress() == 0) {
        input2Disappear();
        input2Text.textContent = 0;
        svg.appendChild(input2Text);
        gsap.set(input2Text, {
            x: 16,
            y: 764
        });

        gsap.set(INPUT2, {

            fill: "#eeeb22"
        });
        input2Visible();
        free();
        SETTER(input2Text.textContent, input2Dot);
        OBSERV.innerHTML = "Input2 is set to 0";

    }
    else if (input2Text.textContent != 1 && tl.progress() == 0) {
        appendInput2To1();
    }
}
function appendInput2To1() {
    input2Disappear();
    input2Text.textContent = 1;
    svg.appendChild(input2Text);
    gsap.set(input2Text, {
        x: 16,
        y: 764
    });
    gsap.set(INPUT2, {

        fill: "#29e"
    });
    input2Visible();
    free();
    SETTER(input2Text.textContent, input2Dot);
    OBSERV.innerHTML = "Input2 is set to 1";


}


function not() {
    if (selectText.textContent == 1) {
        SETTER(0, selectDot1);
    }
    if (selectText.textContent == 0) {
        SETTER(1, selectDot1);
    }
}
let int1;
let int2;
function OR1() {
    if (selectText.textContent == 1 && input1Text.textContent == 0) {
        SETTER(0, input1Dot);
        int1 = 0;
    }
    else {
        SETTER(1, input1Dot);
        int1 = 1;

    }
}
function OR2() {
    if (selectText.textContent == 0 && input2Text.textContent == 0) {
        SETTER(0, input2Dot);
        int2 = 0;
    }
    else {
        SETTER(1, input2Dot);
        int2 = 1;
    }
}
function pit() {
    console.log(int1 * int2);
}
function outputHandler() {
    if ((int1 * int2) == 0) {
        gsap.set(OUTPUT, {

            fill: "#eeeb22"
        });
        mainText.textContent = 0;
    }
    else if ((int1 * int2) == 1) {
        gsap.set(OUTPUT, {

            fill: "#29e"
        });
        mainText.textContent = 1;

    }
}

gsap.registerPlugin(MotionPathPlugin);

gsap.set(mainText, {


    x: 876,
    y: 394
});



var tl = gsap.timeline({ repeat: 0, repeatDelay: 0 });


function fourXspeed() {

    if (input1Text.textContent != 2 && input2Text.textContent != 2 && selectText.textContent != 2 && tl.progress() != 1 && tl.progress() != 0) {
        tl.resume();
        OBSERV.innerHTML = "4x speed";

        tl.timeScale(4);
        decide = 1;
        BUTTON.innerHTML = "Halt";
    }



}
function setSpeed(speed) {
    if (speed == "1" &&tl.progress()) {
        StartCircuit();
    }
    else if (speed == "2") {
        doubleSpeed();
    }
    else if (speed == "4") {
        fourXspeed();
    }
}
function doubleSpeed() {
    if (input1Text.textContent != 2 && input2Text.textContent != 2 && selectText.textContent != 2 && tl.progress() != 1 && tl.progress() != 0) {
        tl.resume();

        tl.timeScale(2);

        OBSERV.innerHTML = "2x speed";
        decide = 1;
        BUTTON.innerHTML = "Halt";
    }
}
const SPEED = document.getElementById("speed");
function StopCircuit() {
    if (tl.progress() != 1 && tl.progress() != 0) {
        tl.pause();
        console.log(tl.progress());
        decide = 0;
        BUTTON.innerHTML = "Start";
        OBSERV.innerHTML = "Simulation has stopped";
        SPEED.selectedIndex=0;
    }
    else if (tl.progress() == 1) {
        OBSERV.innerHTML = "Please restart the simulation";
    }

}

let decide = 0;
function button() {
    if (decide == 0) {
        StartCircuit();

    }
    else if (decide == 1) {
        StopCircuit();

    }
}
function StartCircuit() {
    if (input1Text.textContent == 2 || input2Text.textContent == 2 || selectText.textContent == 2) {
        OBSERV.innerHTML = "Please select the input";
    }
    if (input1Text.textContent != 2 && input2Text.textContent != 2 && selectText.textContent != 2 && tl.progress() != 1) {
        tl.resume();
        tl.timeScale(1);


        decide = 1;
        BUTTON.innerHTML = "Halt";
        OBSERV.innerHTML = "Simulation has started";
        SPEED.selectedIndex=0;
    }
    else if (tl.progress() == 1) {
        OBSERV.innerHTML = "Please restart the simulation";
    }

}

function RestartCircuit() {

    tl.seek(0);
    REBOOT();
    tl.pause();
    decide = 0;
    BUTTON.innerHTML = "Start";




    OBSERV.innerHTML = "Successfully Restored";
    SPEED.selectedIndex=0;

}
function batado() {
    OBSERV.innerHTML = "Simulation has finished. Press Restart to start again";
}
tl.add(makeVisible, 0);
tl.add(not, 10);
tl.add(selectDotDisappear, 12);
tl.add(OR1, 12.5);
tl.add(OR2, 12.5);
tl.add(inputDotDisappear, 20);
tl.add(outputHandler, 22);
tl.add(pit, 20)
tl.add(mainVisible, 22);
tl.add(batado, 22);

mainDisappear();


tl.pause();
allDisAppear();

tl.to(input1Dot, {
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
tl.to(selectDot1, {
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
tl.to(input2Dot, {
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

tl.to(selectDot2, {
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
