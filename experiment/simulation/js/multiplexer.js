import { registerGate, jsPlumbInstance } from "./main.js";
import { setPosition } from "./layout.js";
import { clearResult, gates, printErrors } from "./gate.js";
import {computeAnd, computeOr} from "./validator.js";
'use strict';
// let fullAdder = {}
export let multiplexer = {};

export function clearMux() {
    for (let muxID in multiplexer) {
        delete multiplexer[muxID];
    }
    multiplexer = {};
}

export let finalOutputs = {
    "Output-8": [],
};

export class Multiplexer {
    constructor() {
        this.id = "Multiplexer-" + window.numComponents++;
        this.a0 = []; // Takes 2 items in a list : Gate, Output endpoint of gate
        this.b0 = [];
        this.outputName = "";
        this.selectLine = [];
        this.out = [];
        this.outputs=[]; // list of gates to which output of mux is connected
        this.inputPoints = [];
        this.outputPoints = [];
        this.outputIsConnected = false;
        this.component = `<div class="drag-drop multiplexer" id=${this.id} style="width:100px;height:100px;"></div>`;
    }
    generateComponent(workingArea, x = 0, y = 0) {
        const parent = document.getElementById(workingArea);
        parent.insertAdjacentHTML("beforeend", this.component);
        const el = document.getElementById(this.id);
        el.style.left = x + "px";
        el.style.top = y + "px";

        el.addEventListener("contextmenu",
            function (ev) {
                ev.preventDefault();
                const origin = {
                    left: ev.pageX - document.getScroll()[0],
                    top: ev.pageY - document.getScroll()[1],
                };
                setPosition(origin);
                window.selectedComponent = this.id;
                window.componentType = "multiplexer";
                return false;
            },
            false
        );

        multiplexer[this.id] = this;
        registerGate(this.id, this);
    }

    setA0(A0) {
        this.a0 = A0;
    }

    setB0(B0) {
        this.b0 = B0;
    }

    setSelectLine(SelectLine) {
        this.selectLine = SelectLine;
    }

    addOutput(gate){
        this.outputs.push(gate);
    }

    removeOutput(gate)
    {
        // Find and remove all occurrences of gate
        for (let i = this.outputs.length - 1; i >= 0; i--) {
        if (this.outputs[i] === gate) {
        this.outputs.splice(i, 1);
            }
        }
    }

    addInputPoints(input) {
        this.inputPoints.push(input);
    }

    addOutputPoints(output) {
        this.outputPoints.push(output);
    }

    generateOutput() {
        // we know that for a Multiplexer
        // final output = D0(!S) + D1(S)
        this.out = computeOr(computeAnd(getOutputMux(this.a0[0], this.a0[1]),!getOutputMux(this.selectLine[0], this.selectLine[1])),computeAnd(getOutputMux(this.b0[0], this.b0[1]),getOutputMux(this.selectLine[0], this.selectLine[1]))); 
        this.setOutputName();
    }

    setConnected(val) {
        this.outputIsConnected = val;
    }

    setOutputName() {
        this.outputName = getOutputName(this);
    }
}

export function addMux() {
    let mux = new Multiplexer();
    mux.generateComponent("working-area");
}

window.addMux = addMux;

export function getOutputMux(gate, pos) {
    if (pos === "Out") {
        return gate.out;
    }
    // But if the gate is not a Multiplexer, but an input bit, then return the value of the input
    else {
        return gate.output;
    }
}

export function getResultMux(mux) {
    // check if mux type is Gate object
    if (mux.constructor.name === "Gate") {
        return;
    }

    if (mux.out != null) {
        return;
    }

    if (getOutputMux(mux.a0[0], mux.a0[1]) == null) {
        getResultMux(mux.a0[0]);
    }
    if (getOutputMux(mux.b0[0], mux.b0[1]) == null) {
        getResultMux(mux.b0[0]);
    }

    mux.generateOutput();

    return;
}

export function checkConnectionsMux() {
    for (let muxID in multiplexer) {
        const gate = multiplexer[muxID];
        const id = document.getElementById(gate.id);
        // For Multiplexer objects
        // Check if all the outputs are connected
        if (!gate.outputIsConnected || gate.outputs.length===0) {
            printErrors("Output of Multiplexer not connected\n",id);
            return false;
        }

        // Check if all the inputs are connected
        if (gate.a0 == null || gate.a0.length === 0) {
            printErrors("I0 of Multiplexer not connected properly\n",id);
            return false;
        }
        if (gate.b0 == null || gate.b0.length === 0) {
            printErrors("I1 of Multiplexer not connected properly\n",id);
            return false;
        }
        if (gate.selectLine == null || gate.selectLine.length === 0) {
            printErrors("Select Line of Multiplexer not connected properly\n",id);
            return false;
        }
    }
    for (let gateId in gates) {
        const gate = gates[gateId];
        const id = document.getElementById(gate.id);
        if (gate.isInput) {
            if (!gate.isConnected || gate.outputs.length===0) {
                printErrors("Highlighted component not connected properly\n",id);
                return false;
            }
        }
        if (gate.isOutput) {
            if (gate.inputs.length === 0) {
                printErrors("Highlighted component not connected properly\n",id);
                return false;
            }
        }
    }

    return true;
}

export function simulateMux() {
    clearResult();
    if (!checkConnectionsMux()) {
        return;
    }

    // reset output in gate
    for (let muxID in multiplexer) {
        multiplexer[muxID].out = null;
    }
    for (let gateId in gates) {
        const gate = gates[gateId];
        if (gate.isOutput) {
            gates[gateId].output = null;
        }
    }

    for (let gateId in gates) {
        if (gates[gateId].isOutput) {
            getResultMux(gates[gateId].inputs[0]);
        }
    }

    for (let key in finalOutputs) {
        let element = document.getElementById(key);
        gates[key].output = getOutputMux(
            finalOutputs[key][0],
            finalOutputs[key][1]
        );
        if (gates[key].output) {
            element.className = "high";
            element.childNodes[0].innerHTML = "1";
        } else {
            element.className = "low";
            element.childNodes[0].innerHTML = "0";
        }
    }

    // Displays message confirming Simulation completion
    let message = "Simulation has finished";
    const result = document.getElementById('result');
    result.innerHTML += message;
    result.className = "success-message";
    setTimeout(clearResult, 2000);
}

export function testSimulationMux(mux, gates) {
    if (!checkConnectionsMux()) {
        document.getElementById("table-body").innerHTML = "";
        return false;
    }

    // reset output in gate
    for (let muxID in mux) {
        mux[muxID].out = null;
    }
    for (let gateId in gates) {
        const gate = gates[gateId];
        if (gate.isOutput) {
            gates[gateId].output = null;
        }
    }

    for (let gateId in gates) {
        if (gates[gateId].isOutput) {
            getResultMux(gates[gateId].inputs[0]);
        }
    }

    for (let key in finalOutputs) {
        gates[key].output = getOutputMux(
            finalOutputs[key][0],
            finalOutputs[key][1]
        );
        return finalOutputs[key][0].outputName;
    }

}

export function deleteMux(id) {
    const mux = multiplexer[id];
    jsPlumbInstance.removeAllEndpoints(document.getElementById(mux.id));
    jsPlumbInstance._removeElement(document.getElementById(mux.id));
    for (let key in multiplexer) {
        if (multiplexer[key].id == id) {
            continue;
        }
        if (multiplexer[key].a0[0] === mux) {
            multiplexer[key].a0 = null;
        }
        if (multiplexer[key].b0[0] === mux) {
            multiplexer[key].b0 = null;
        }
        if (multiplexer[key].selectLine[0] === mux) {
            multiplexer[key].selectLine = null;
        }
        if(multiplexer[key].outputs.includes(mux)){
            multiplexer[key].removeOutput(mux);
        }
    }

    for (let key in finalOutputs) {
        if (finalOutputs[key][0] === mux) {
            delete finalOutputs[key];
            gates[key].inputs = [];
        }
    }

    for (let elem in gates) {
        if (gates[elem].inputs.includes(mux)) {
          gates[elem].removeInput(mux);
        }
        if(gates[elem].outputs.includes(mux)) {
          gates[elem].removeOutput(mux);
          if(gates[elem].isInput && gates[elem].outputs.length ==0)
          gates[elem].setConnected(false);
        }
      }


    delete multiplexer[id];
}

function getOutputName(mux) {
    let pos = null;
    let gate = null;
    if (mux.selectLine[0].output === false) {
        pos = mux.a0[1];
        gate = mux.a0[0];
    } else {
        pos = mux.b0[1];
        gate = mux.b0[0];
    }

    if (pos === "Out") {
        return gate.outputName;
    } else {
        return gate.name;
    }
}
