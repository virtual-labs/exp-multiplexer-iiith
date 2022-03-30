import * as gatejs from "./gate.js";
// import * as fajs from "./fa.js";
import * as multiplexerjs from "./multiplexer.js";
import {wireColours} from "./layout.js"

let num_wires = 0;

document.getScroll = function () {
    if (window.pageYOffset != undefined) {
        return [pageXOffset, pageYOffset];
    } else {
        let sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sx, sy];
    }
}
const workingArea = document.getElementById("working-area");
const jsPlumbInstance = jsPlumbBrowserUI.newInstance({
    container: workingArea,
    maxConnections: -1,
    endpoint: {
        type: "Dot",
        options: { radius: 7 },
    },
    dragOptions: {
        containment: "parentEnclosed",
        containmentPadding: 5,
    },
    connector: "Flowchart",
    paintStyle: { strokeWidth: 4, stroke: "#888888" },
    connectionsDetachable: false,
});

const bindEvent1 = function () {
    jsPlumbInstance.bind("beforeDrop", function (data) {
        let endpoint = data.connection.endpoints[0];
        let dropEndpoint = data.dropEndpoint;

        const start_uuid = endpoint.uuid.split(":")[0];
        const end_uuid = dropEndpoint.uuid.split(":")[0];
        
        if(endpoint.elementId == dropEndpoint.elementId) {
            return false;
        }

        if (start_uuid == "input" && end_uuid == "input") {
            return false;
        } else if (start_uuid == "output" && end_uuid == "output") {
            return false;
        } else {
            jsPlumbInstance.connect({ uuids: [endpoint.uuid, dropEndpoint.uuid], paintStyle:{ stroke: wireColours[num_wires], strokeWidth:4 }});
            num_wires++;
            num_wires = num_wires % wireColours.length;
            if (start_uuid == "output") {
                let input = gatejs.gates[endpoint.elementId];
                input.isConnected = true;
                gatejs.gates[dropEndpoint.elementId].addInput(input);
            } else if (end_uuid == "output") {
                let input = gatejs.gates[dropEndpoint.elementId];
                input.isConnected = true;
                gatejs.gates[endpoint.elementId].addInput(input);
            }

            // return true;
        }
    });
}

const bindEvent2 = function () {
    jsPlumbInstance.bind("beforeDrop", function (data) {
        let endpoint = data.connection.endpoints[0];
        let dropEndpoint = data.dropEndpoint;

        const start_uuid = endpoint.uuid.split(":")[0];
        const end_uuid = dropEndpoint.uuid.split(":")[0];

        if (start_uuid == "input" && end_uuid == "input") {
            return false;
        } else if (start_uuid == "output" && end_uuid == "output") {
            return false;
        } else {
            jsPlumbInstance.connect({ uuids: [endpoint.uuid, dropEndpoint.uuid], paintStyle:{ stroke: wireColours[num_wires], strokeWidth:4 }});
            num_wires++;
            num_wires = num_wires % wireColours.length;
            const start_type = endpoint.elementId.split("-")[0];
            const end_type = dropEndpoint.elementId.split("-")[0];
            if (start_type == "Multiplexer" && end_type == "Multiplexer") {
                if (start_uuid == "output") {
                    let input = multiplexerjs.multiplexer[endpoint.elementId];
                    console.log(endpoint.overlays);
                    let pos = "";
                    if (Object.keys(endpoint.overlays)[0].includes("finalOutput")) {
                        pos = "Out";
                    }
                    // else if (Object.keys(endpoint.overlays)[0].includes("cout")) {
                    //     pos = "Carry";
                    // }
                    input.setConnected(true);
                    console.log(input);
                    if (Object.keys(dropEndpoint.overlays)[0].includes("a")) {
                        multiplexerjs.multiplexer[dropEndpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("b")) {
                        multiplexerjs.multiplexer[dropEndpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("s0")) {
                        multiplexerjs.multiplexer[dropEndpoint.elementId].setSelectLine([input, pos]);
                    }
                    // else if (Object.keys(dropEndpoint.overlays)[0].includes("cin")) {
                    //     multiplexerjs.fullAdder[dropEndpoint.elementId].setCin([input, pos]);
                    // }
                } else if (end_uuid == "output") {
                    let input = multiplexerjs.multiplexer[dropEndpoint.elementId];
                    let pos = "";
                    if (Object.keys(dropEndpoint.overlays)[0].includes("finalOutput")) {
                        pos = "Out";
                    }
                    input.setConnected(true);
                    if (Object.keys(endpoint.overlays)[0].includes("a")) {
                        multiplexerjs.multiplexer[endpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("b")) {
                        multiplexerjs.multiplexer[endpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("s0")) {
                        multiplexerjs.multiplexer[endpoint.elementId].setSelectLine([input, pos]);
                    }
                }
            }
            else if (start_type == "Multiplexer" && end_type == "Input") {
                if (end_uuid == "output") {
                    let input = gatejs.gates[dropEndpoint.elementId];
                    input.setConnected(true);
                    let pos = "";
                    if (Object.keys(endpoint.overlays)[0].includes("a")) {
                        multiplexerjs.multiplexer[endpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("b")) {
                        multiplexerjs.multiplexer[endpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("s0")) {
                        multiplexerjs.multiplexer[endpoint.elementId].setSelectLine([input, pos]);
                    }
                    // else if (Object.keys(endpoint.overlays)[0].includes("cin")) {
                    //     multiplexerjs.multiplexer[endpoint.elementId].setCin([input, pos]);
                    // }
                }
            }
            else if (start_type == "Input" && end_type == "Multiplexer") {
                if (start_uuid == "output") {
                    let input = gatejs.gates[endpoint.elementId];
                    input.setConnected(true);
                    let pos = "";
                    if (Object.keys(dropEndpoint.overlays)[0].includes("a")) {
                        multiplexerjs.multiplexer[dropEndpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("b")) {
                        multiplexerjs.multiplexer[dropEndpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("s0")) {
                        multiplexerjs.multiplexer[dropEndpoint.elementId].setSelectLine([input, pos]);
                    }
                    // else if (Object.keys(dropEndpoint.overlays)[0].includes("cin")) {
                    //     multiplexerjs.multiplexer[dropEndpoint.elementId].setCin([input, pos]);
                    // }
                }
            }
            else if (start_type == "Multiplexer" && end_type == "Output") {
                if (start_uuid == "output") {
                    let input = multiplexerjs.multiplexer[endpoint.elementId];
                    let output = gatejs.gates[dropEndpoint.elementId];
                    // console.log(endpoint.overlays);
                    let pos=""
                    if (Object.keys(endpoint.overlays)[0].includes("finalOutput")) {
                        pos = "Out";
                    }
                    input.setConnected(true);
                    output.addInput(input);
                    multiplexerjs.finalOutputs[dropEndpoint.elementId] = [input, pos];
                    console.log(multiplexerjs.finalOutputs);
                }
            }
            else if (start_type == "Output" && end_type == "Multiplexer") {
                if (start_uuid == "input") {
                    let input = multiplexerjs.multiplexer[dropEndpoint.elementId];
                    let output = gatejs.gates[endpoint.elementId];
                    console.log(endpoint.overlays);
                    let pos=""
                    if (Object.keys(endpoint.overlays)[0].includes("finalOutput")) {
                        pos = "Out";
                    }
                    input.setConnected(true);
                    output.addInput(input);
                    multiplexerjs.finalOutputs[endpoint.elementId] = [input, pos];
                    console.log(multiplexerjs.finalOutputs);
                }
            }
            else if (start_type == "Input" && end_type == "Output") {
                if (start_uuid == "output") {
                    let input = gatejs.gates[endpoint.elementId];
                    let output = gatejs.gates[dropEndpoint.elementId];
                    input.setConnected(true);
                    output.addInput(input);
                    // multiplexerjs.finalOutputs[dropEndpoint.elementId] = [input, ""];
                }
            }
            else if (start_type == "Output" && end_type == "Input") {
                if (start_uuid == "input") {
                    let input = gatejs.gates[dropEndpoint.elementId];
                    let output = gatejs.gates[endpoint.elementId];
                    input.setConnected(true);
                    output.addInput(input);
                    // multiplexerjs.finalOutputs[endpoint.elementId] = [input, ""];
                }
            }
            // return true;
        }
    });
}

const unbindEvent = () => {
    jsPlumbInstance.unbind("beforeDrop");
}


function registerGate(id, gate) {
    const element = document.getElementById(id);
    const gateType = id.split("-")[0];

    if (
        gateType == "AND" ||
        gateType == "OR" ||
        gateType == "XOR" ||
        gateType == "XNOR" ||
        gateType == "NAND" ||
        gateType == "NOR"
    ) {
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0, 0.5, -1, 0, -7, -9],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:0:" + id,
            })
        );
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0, 0.5, -1, 0, -7, 10],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:1:" + id,
            })
        );
        gate.addOutputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [1, 0.5, 1, 0, 7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "output:0:" + id,
            })
        );
    } else if (gateType == "NOT") {
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0, 0.5, -1, 0, -7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:0:" + id,
            })
        );
        gate.addOutputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [1, 0.5, 1, 0, 7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "output:0:" + id,
            })
        );
    } else if (gateType == "Input") {
        gate.addOutputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [1, 0.5, 1, 0, 7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "output:0:" + id,
            })
        );
    } else if (gateType == "Output") {
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0, 0.5, -1, 0, -7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:0:" + id,
            })
        );
    }
    else if (gateType == "FullAdder") {
        // carry output
        gate.addOutputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0, 0.5, -1, 0, -7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "output:0:" + id,
                overlays: [
                    { type: "Label", options: { label: "Cout", id: "cout", location: [3, 0.2] } }
                ],
            })
        );
        // sum output
        gate.addOutputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0.5, 1, 0, 1, 0, 7],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "output:1:" + id,
                overlays: [
                    { type: "Label", options: { label: "Sum", id: "sum", location: [0.3, -1.7] } }
                ],
            })
        );
        // input A0
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0.5, 0, 0, -1, -25, -7],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:0:" + id,
                overlays: [
                    { type: "Label", options: { label: "A0", id: "a0", location: [0.3, 1.7] } }
                ],
            })
        );
        // input B0
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0.5, 0, 0, -1, 25, -7],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:1:" + id,
                overlays: [
                    { type: "Label", options: { label: "B0", id: "b0", location: [0.3, 1.7] } }
                ],
            })
        );
        // carry input
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [1, 0.5, 1, 0, 7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:2:" + id,
                overlays: [
                    { type: "Label", options: { label: "Cin", id: "cin", location: [-1, 0.2] } }
                ],
            })
        );
    }
    else if (gateType == "Multiplexer") {
        // Select line
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0, 0.5, -1, 0, -7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:0:" + id,
                overlays: [
                    { type: "Label", options: { label: "SelectLine", id: "s0", location: [4, 0.2] } }
                ],
            })
        );
        // output of 2x1 MUX
        gate.addOutputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0.5, 1, 0, 1, 0, 7],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "output:1:" + id,
                overlays: [
                    { type: "Label", options: { label: "Output", id: "finalOutput", location: [0.3, -1.7] } }
                ],
            })
        );
        // input A0
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0.5, 0, 0, -1, -25, -7],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:2:" + id,
                overlays: [
                    { type: "Label", options: { label: "I0", id: "a0", location: [0.3, 1.7] } }
                ],
            })
        );
        // input B0
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0.5, 0, 0, -1, 25, -7],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:3:" + id,
                overlays: [
                    { type: "Label", options: { label: "I1", id: "b0", location: [0.3, 1.7] } }
                ],
            })
        );
        
    }
}

function initTwoBitMultiplexer() {
    let ids = ["Input-0", "Input-1", "Input-2", "Output-3"]; // [A B Select Out]
    let types = ["Input", "Input", "Input", "Output"];
    let names = ["A", "B", "Select", "Output"];
    let positions = [
        { x: 40, y: 100 },
        { x: 40, y: 450 },
        { x: 40, y: 700 },
        { x: 820, y: 550 },
    ];
    for (let i = 0; i < ids.length; i++) {
        let gate = new gatejs.Gate(types[i]);
        gate.setId(ids[i]);
        gate.setName(names[i]);
        const component = gate.generateComponent();
        const parent = document.getElementById("working-area");
        parent.insertAdjacentHTML('beforeend', component);
        gate.registerComponent("working-area",positions[i].x, positions[i].y);;
    }
}



function initFourBitMultiplexer() {
    let ids = ["Input-0", "Input-1", "Input-2", "Input-3", "Input-4", "Input-5","Output-8"] // [A0,B0,A1,B1,S0,S1,Output0,Output1,FinalOutput]
    let types = ["Input", "Input", "Input", "Input", "Input", "Input", "Output"]
    let names = ["I0", "I1","I2", "I3", "S1","S0","FinalOutput"]
    let positions = [
        { x: 300, y: 50 }, 
        { x: 400, y: 50 }, 
        { x: 640, y: 50 }, 
        { x: 740, y: 50 }, 
        { x: 100, y: 400 },
        { x: 100, y: 200 },
        { x: 500, y: 700 }
    ];
    for (let i = 0; i < ids.length; i++) {
        let gate = new gatejs.Gate(types[i]);
        gate.setId(ids[i]);
        gate.setName(names[i]);
        const component = gate.generateComponent();
        const parent = document.getElementById("working-area");
        parent.insertAdjacentHTML('beforeend', component);
        gate.registerComponent("working-area",positions[i].x, positions[i].y);
    }
}


function refreshWorkingArea() {
    jsPlumbInstance.reset();
    window.numComponents = 0;

    gatejs.clearGates();
    multiplexerjs.clearMux();
}


const getInfo = function () {
    console.log(gatejs.gates, multiplexerjs.multiplexer,multiplexerjs.finalOutputs)
}

window.getInfo = getInfo



window.currentTab = "Task1";
bindEvent1();
refreshWorkingArea();
initTwoBitMultiplexer();


export {initFourBitMultiplexer,initTwoBitMultiplexer,refreshWorkingArea, registerGate, unbindEvent, bindEvent1, bindEvent2, jsPlumbInstance}