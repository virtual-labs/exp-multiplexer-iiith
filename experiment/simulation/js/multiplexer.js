// import { getOutputFA } from './fa.js';
import {gates} from './gate.js';
import {jsPlumbInstance} from "./main.js";

// let fullAdder = {}
let multiplexer = {}


function clearMux() {

    for (let muxID in multiplexer) {
        delete multiplexer[muxID];
    }
    multiplexer = {};
}

class Multiplexer {
    constructor() {
        this.id = "Multiplexer-" + window.numComponents++;
        this.a0 = [];  // Takes 2 items in a list : Gate, Output endpoint of gate
        this.b0 = [];
        this.selectLine = null;
        this.out = null;
        this.inputPoints = [];
        this.outputPoints = [];
        this.outputIsConnected = false;
    }
    generateComponent(x = 0, y = 0) {
        let component = '';
        component += '<div class="drag-drop Multiplexer" id=' + this.id + ' style="width:150px;height:150px;"></div>';
        const parent = document.getElementById("working-area");
        parent.insertAdjacentHTML('beforeend', component);
        document.getElementById(this.id).style.left = x + "px";
        document.getElementById(this.id).style.top = y + "px";

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
            window.componentType = "multiplexer";
            // deleteElement(this.id);
            return false;
        }, false);

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
        this.selectLine = SelectLine ;
    }

    setOutput(Out) {
        this.out = Out;
    }

    addInputPoints(input) {
        this.inputPoints.push(input);
    }

    addOutputPoints(output) {
        this.outputPoints.push(output);
    }

    generateOutput() {
        this.out = (getOutputMux(this.a0[0],this.a0[1]) && !(this.selectLine)) || (getOutputMux(this.a0[0],this.a0[1]) && this.selectLine)
    }

    setConnected(val) {
        this.outputIsConnected = val;
    }

}

function addMux() {
    let mux = new Multiplexer();
    mux.generateComponent();
}

function getOutputMux(gate, pos) {
    if (pos == "Out") {
        return gate.out;
    }
    // But if the gate is not a Multiplexer, but an input bit, then return the value of the input
    else {
        return gate.output;
    }
}


function getResultMux(mux) {
// check if fa type is Gate object
    if (mux.constructor.name == "Gate") {
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

function checkConnectionsMux() {
    let flag = 0;
    for (let muxID in multiplexer) {
        const gate = multiplexer[muxID];
        // For Multiplexer objects
        // Check if all the outputs are connected
        if (gate.outputIsConnected == false) {
            flag = 1;
            break;
        }

        // Check if all the inputs are connected
        if (gate.a0 == null) {
            flag = 1;
            break;
        }
        if (gate.b0 == null) {
            flag = 1;
            break;
        }
        if (gate.selectLine == null) {
            flag = 1;
            break;
        }
    }
    for (let gateId in gates) {
        const gate = gates[gateId];
        if (gate.isInput == true) {
            if (gate.isConnected == false) {
                flag = 1;
                break;
            }
        }
        if (gate.isOutput == true) {
            if (gate.inputs.length == 0) {
                flag = 1;
                break;
            }
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

function simulateMux() {
    if (!checkConnectionsMux()) {
        return;
    }

    // reset output in gate
    for (let muxID in multiplexer) {
        multiplexer[muxID].out = null;
    }
    for (let gateId in gates) {
        const gate = gates[gateId];
        if (gate.isOutput == true) {
            gates[gateId].output = null;    
        }
    }


    // for (let faID in fullAdder) {
    //     getResultFA(fullAdder[faID]);
    // }
    for (let gateId in gates) {
        if (gates[gateId].isOutput == true) {
            getResultMux(gates[gateId].inputs[0]);
        }
    }

    for (key in finalOutputs) {
        let element = document.getElementById(key);
        gates[key].output = getOutputFA(finalOutputs[key][0], finalOutputs[key][1]);
        if (gates[key].output == true) {
            element.className = "HIGH";
            element.childNodes[0].innerHTML = "1";
        }
        else {
            element.className = "LOW";
            element.childNodes[0].innerHTML = "0";
        }
    }
}

function testSimulationMux(mux,gates) {
    if (!checkConnectionsFA()) {
        return;
    }

     // reset output in gate
    for (let faID in fA) {
        fA[faID].Cout = null;
        fA[faID].sum = null;
    }
    for (let gateId in gates) {
        const gate = gates[gateId]
        if (gate.isOutput == true) {
            gates[gateId].output = null;
        }
    }

    for(let gateId in gates){
        if(gates[gateId].isOutput == true){
            getResultFA(gates[gateId].inputs[0]);
        }
    }

    for(key in finalOutputs){
        gates[key].output = getOutputFA(finalOutputs[key][0], finalOutputs[key][1]);
    }
    
   
}

function deleteMux(id) {
    const fa = fullAdder[id];
    jsPlumbInstance.removeAllEndpoints(document.getElementById(fa.id));
    jsPlumbInstance._removeElement(document.getElementById(fa.id));

    for (key in fullAdder) {
        if(fullAdder[key].a0[0] == fa) {
            fullAdder[key].a0 = null;
        }
        if(fullAdder[key].b0[0] == fa) {
            fullAdder[key].b0 = null;
        }
        if(fullAdder[key].Cin[0] == fa) {
            fullAdder[key].Cin = null;
        }
    }

    delete fullAdder[id];
}

export {clearMux, addMux, getOutputMux, getResultMux, checkConnectionsMux, simulateMux, testSimulationMux, deleteMux, multiplexer, Multiplexer};