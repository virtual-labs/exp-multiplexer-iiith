import {gates} from './gate.js';
import {jsPlumbInstance} from "./main.js";

let fullAdder = {}

function clearFAs() {

    for (let faID in fullAdder) {
        delete fullAdder[faID];
    }
    fullAdder = {};
}


// {output-id: [gate,pos]}
let finalOutputs = {
    "Output-5": [],
    "Output-8": [],
    "Output-11": [],
    "Output-12": [],
};

class FullAdder {
    constructor() {
        this.id = "FullAdder-" + window.numComponents++;
        this.a0 = [];  // Takes 2 items in a list : Gate, Output endpoint of gate
        this.b0 = [];
        this.Cin = [];
        this.sum = null;
        this.Cout = null;
        this.inputPoints = [];
        this.outputPoints = [];
        this.CoutIsConnected = false;
        this.sumIsConnected = false;
    }
    generateComponent(x = 0, y = 0) {
        let component = '';
        component += '<div class="drag-drop FullAdder" id=' + this.id + ' style="width:150px;height:150px;"></div>';
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
            window.componentType = "fullAdder";
            // deleteElement(this.id);
            return false;
        }, false);

        fullAdder[this.id] = this;
        registerGate(this.id, this);
    }

    setA0(A0) {
        this.a0 = A0;
    }

    setB0(B0) {
        this.b0 = B0;
    }

    setCin(Cin) {
        this.Cin = Cin;
    }

    setSum(Sum) {
        this.sum = Sum;
    }

    setCout(Cout) {
        this.Cout = Cout;
    }

    addInputPoints(input) {
        this.inputPoints.push(input);
    }

    addOutputPoints(output) {
        this.outputPoints.push(output);
    }

    generateOutput() {
        const aXorb = (getOutputFA(this.a0[0], this.a0[1]) && !getOutputFA(this.b0[0], this.b0[1])) || (!getOutputFA(this.a0[0], this.a0[1]) && getOutputFA(this.b0[0], this.b0[1]));
        this.Cout = (getOutputFA(this.a0[0], this.a0[1]) && getOutputFA(this.b0[0], this.b0[1])) || (getOutputFA(this.Cin[0], this.Cin[1]) && aXorb);
        this.sum = (getOutputFA(this.Cin[0], this.Cin[1]) && !aXorb) || (!(getOutputFA(this.Cin[0], this.Cin[1])) && aXorb);
    }

    setConnected(val, pos) {
        console.log(val, pos);
        if (pos == "Carry") {
            this.CoutIsConnected = val;
        }
        else if (pos == "Sum") {
            this.sumIsConnected = val;
        }
    }

}

function addFA() {
    let fA = new FullAdder();
    fA.generateComponent();
}

function getOutputFA(gate, pos) {
    if (pos == "Carry") {
        return gate.Cout;
    }
    else if (pos == "Sum") {
        return gate.sum;
    }
    // But if the gate is not an FA, but an input bit, then return the value of the input
    else {
        return gate.output;
    }
}




function getResultFA(fa) {
// check if fa type is Gate object
    if (fa.constructor.name == "Gate") {
        return;
    }

    if (fa.Cout != null && fa.sum != null) {
        return;
    }

    if (getOutputFA(fa.a0[0], fa.a0[1]) == null) {
        getResultFA(fa.a0[0]);
    }
    if (getOutputFA(fa.b0[0], fa.b0[1]) == null) {
        getResultFA(fa.b0[0]);
    }
    if (getOutputFA(fa.Cin[0], fa.Cin[1]) == null) {
        getResultFA(fa.Cin[0]);
    }

    fa.generateOutput();

    return;
}

function checkConnectionsFA() {
    let flag = 0;
    for (let faID in fullAdder) {
        const gate = fullAdder[faID];
        // For Full Adder objects
        // Check if all the outputs are connected
        if (gate.CoutIsConnected == false) {
            flag = 1;
            break;
        }
        if (gate.sumIsConnected == false) {
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
        if (gate.Cin == null) {
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

function simulateFA() {
    if (!checkConnectionsFA()) {
        return;
    }

    // reset output in gate
    for (let faID in fullAdder) {
        fullAdder[faID].Cout = null;
        fullAdder[faID].sum = null;
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
            getResultFA(gates[gateId].inputs[0]);
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

function testSimulationFA(fA,gates) {
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

function deleteFA(id) {
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

export {clearFAs, addFA, getOutputFA, getResultFA, checkConnectionsFA, simulateFA, testSimulationFA, deleteFA, fullAdder, FullAdder, finalOutputs};