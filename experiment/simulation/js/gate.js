import { registerGate } from "./main.js";
import { setPosition } from "./layout.js";
import { twoBitMultiplexerTest, fourBitMultiplexerTest } from "./validator.js";
import {jsPlumbInstance} from "./main.js";

export let gates = {}; // Array of gates
window.numComponents = 0;
//(input0,input1,carryOut,OutputOut)
export function clearGates() {

    for (let gateId in gates) {
        delete gates[gateId];
    }

    gates = {};
}

export class Gate {
    constructor(type) {
        this.type = type;
        this.id = type + "-" + window.numComponents++;
        this.positionX = 0;
        this.positionY = 0;
        this.isConnected = false;
        this.inputPoints = [];
        this.outputPoints = [];
        // connections : start/end , line_id, button_id
        // { line_id : {button_id,start/end,}  }
        this.inputs = []; // List of input gates
        this.output = null; // Output value
        this.isInput = false;
        this.isOutput = false;
        this.name = null;
    }
    setId(id) {
        this.id = id;
    }
    addInput(gate) {
        this.inputs.push(gate);
    }
    removeInput(gate) {
        let index = this.inputs.indexOf(gate);
        if (index > -1) {
            this.inputs.splice(index, 1);
        }
    }
    updatePosition(id) {
        this.positionY = window.scrollY + document.getElementById(id).getBoundingClientRect().top // Y

        this.positionX = window.scrollX + document.getElementById(id).getBoundingClientRect().left // X
    }
    setName(name) {
        this.name = name;
    }

    generateComponent() {
        let component = '';

        if (this.type == "AND") {

            component = '<div class="drag-drop AND" id=' + this.id + '></div>'

        }
        else if (this.type == "NOT") {
            component = '<div class="drag-drop NOT" id=' + this.id + '></div>'

        }
        else if (this.type == "OR") {
            component = '<div class="drag-drop OR" id=' + this.id + '></div>'

        }
        else if (this.type == "XOR") {
            component = '<div class="drag-drop XOR" id=' + this.id + '></div>'

        }
        else if (this.type == "XNOR") {

            component = '<div class="drag-drop XNOR" id=' + this.id + '></div>'

        }
        else if (this.type == "NAND") {

            component = '<div class="drag-drop NAND" id=' + this.id + '></div>'

        }
        else if (this.type == "NOR") {

            component = '<div class="drag-drop NOR" id=' + this.id + '></div>'

        }
        else if (this.type == "Input") {
            component = '<div class="HIGH" id=' + this.id + ' ><a ondblclick="setInput(event)">1</a><p>' + this.name + '</p></div>'
            this.output = true;
            this.isInput = true;
        }
        else if (this.type == "Output") {
            component = '<div class="Output" id=' + this.id + '><a></a><p>' + this.name + '</p></div>'
            this.isOutput = true;
        }
        return component;

    }

    registerComponent(workingArea,x=0,y=0) {

        // get width of working area
        const width = document.getElementById(workingArea).offsetWidth;
        let scale = 900;
        x = (x / scale) * width;
        document.getElementById(this.id).style.left = x + "px";
        document.getElementById(this.id).style.top = y + "px";
        if (this.type != "Input" && this.type != "Output") {
            const el = document.getElementById(this.id);
            el.addEventListener('contextmenu', function (ev) {
                ev.preventDefault();
                let left = ev.pageX - document.getScroll()[0];
                let top = ev.pageY - document.getScroll()[1];
                const origin = {
                    left: left,
                    top: top
                };
                setPosition(origin);
                window.selectedComponent = this.id;
                window.componentType = "gate";
                // deleteElement(this.id);
                return false;
            }, false);
        }
        gates[this.id] = this;
        registerGate(this.id, this);

        this.updatePosition(this.id);
        
    }

    addInputPoints(input) {
        this.inputPoints.push(input);
    }

    addOutputPoints(output) {
        this.outputPoints.push(output);
    }


    generateOutput() {
        if (this.type == "AND") {
            this.output = this.inputs[0].output && this.inputs[1].output;
        }
        else if (this.type == "OR") {
            this.output = this.inputs[0].output || this.inputs[1].output;
        }
        else if (this.type == "NOT") {
            this.output = !this.inputs[0].output;
        }
        else if (this.type == "XOR") {
            this.output = (this.inputs[0].output && !this.inputs[1].output) || (!this.inputs[0].output && this.inputs[1].output);
        }
        else if (this.type == "XNOR") {
            this.output = (!this.inputs[0].output || this.inputs[1].output) && (this.inputs[0].output || !this.inputs[1].output);
        }
        else if (this.type == "NAND") {
            this.output = !(this.inputs[0].output && this.inputs[1].output);
        }
        else if (this.type == "NOR") {
            this.output = !(this.inputs[0].output || this.inputs[1].output);
        }
        else if (this.type == "Output") {
            this.output = this.inputs[0].output;
        }
    }

    setOutput(val) {
        this.output = val;
    }
    setConnected(val) {
        this.isConnected = val;
    }
}



function addGate(event) {
    const type = event.target.innerHTML;
    const gate = new Gate(type);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML('beforeend', component);
    gate.registerComponent("working-area");
}

window.addGate = addGate;

export function getResult(gate) {
    if (gate.output != null) {
        return;
    }
    for (let i = 0; i < gate.inputs.length; i++) {
        if (gate.inputs[i].output == null) {
            getResult(gate.inputs[i]);
        }
    }
    gate.generateOutput();
    return;
}

 function setInput(event) {
    let parentElement = event.target.parentElement;
    let element = event.target;
    let type = parentElement.className.split(" ")[0];
    let gate = gates[parentElement.id];
    if (type == "HIGH") {
        // change class HIGH to LOW
        parentElement.classList.replace("HIGH", "LOW");
        element.innerHTML = "0";
        gate.setOutput(false);
    }
    else if (type == "LOW") {
        parentElement.classList.replace("LOW", "HIGH");
        element.innerHTML = "1";
        gate.setOutput(true);
    }
}

window.setInput = setInput;

export function checkConnections() {
    let flag = 0;
    for (let gateId in gates) {
        const gate = gates[gateId];
        if (gate.inputPoints.length != gate.inputs.length) {
            flag = 1;
        }
        else if (gate.isConnected == false && gate.isOutput == false) {
            flag = 1;
        }
    }
    if (flag == 0) {
        return true;
    }
    else {
        alert("Connections are not correct");
        return false;
    }
}

export function simulate() {

    if (!checkConnections()) {
        return;
    }

    // reset output in gate
    for (let gateId in gates) {
        if (!gates[gateId].isInput) {
            gates[gateId].output = null;
        }
    }


    for (let gateId in gates) {
        const gate = gates[gateId];
        if (gate.isOutput == true) {
            getResult(gate);
            let element = document.getElementById(gate.id)
            if (gate.output == true) {
                element.className = "HIGH";
                element.childNodes[0].innerHTML = "1";
            }
            else {
                element.className = "LOW";
                element.childNodes[0].innerHTML = "0";
            }
        }
    }
}

window.simulate = simulate;

export function testSimulation(gates) {
    if (!checkConnections()) {
        return;
    }

    // reset output in gate
    for (let gateId in gates) {
        if (!gates[gateId].isInput) {
            gates[gateId].output = null;
        }
    }

    for (let gateId in gates) {
        const gate = gates[gateId];
        if (gate.isOutput == true) {
            getResult(gate);
        }
    }
}

// function to submit the desired circuit and get the final success or failure message
export function submitCircuit() {

    document.getElementById("table-body").innerHTML = "";
    if (window.currentTab == "Task1") {
        twoBitMultiplexerTest("Input-0", "Input-1", "Input-2", "Output-3");
    }
    // else if (window.currentTab == "Task2") {
    //     fullAdderTest("Input-0", "Input-1", "Input-2", "Output-4", "Output-3");
    // }
    else if (window.currentTab == "Task2") {
        fourBitMultiplexerTest("Input-0", "Input-1", "Input-2", "Input-3", "Input-4", "Input-5","Output-8");
    }
}
window.submitCircuit = submitCircuit;


export function deleteElement(gateid) {

    let gate = gates[gateid];
    // jsPlumbInstance.selectEndpoints().detachAll();
    jsPlumbInstance.removeAllEndpoints(document.getElementById(gate.id));
    // jsPlumbInstance.detach(gate.id); // <--
    jsPlumbInstance._removeElement(document.getElementById(gate.id));
    for (let elem in gates) {
        if (gates[elem].inputs.includes(gate)) {
            gates[elem].removeInput(gate);
        }
    }
    delete gates[gateid];
    // jsPlumbInstance.repaintEverything();
}


