import * as gatejs from "./gate.js";
import * as multiplexerjs from "./multiplexer.js";
import {wireColours} from "./layout.js"

'use strict';
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
export const jsPlumbInstance = jsPlumbBrowserUI.newInstance({
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

export const connectGate = function () {
    jsPlumbInstance.bind("beforeDrop", function (data) {
        let fromEndpoint = data.connection.endpoints[0];
        let toEndpoint = data.dropEndpoint;

        const start_uuid = fromEndpoint.uuid.split(":")[0];
        const end_uuid = toEndpoint.uuid.split(":")[0];
        
        if(fromEndpoint.elementId === toEndpoint.elementId) {
            return false;
        }

        if (start_uuid === "input" && end_uuid === "input") {
            return false;
        } else if (start_uuid === "output" && end_uuid === "output") {
            return false;
        } else if ((end_uuid==="input" && toEndpoint.connections.length > 0) || (start_uuid==="input" && fromEndpoint.connections.length>1)) {
            // If it already has a connection, do not establish a new connection
            return false;
        } else {
            jsPlumbInstance.connect({ uuids: [fromEndpoint.uuid, toEndpoint.uuid], paintStyle:{ stroke: wireColours[num_wires], strokeWidth:4 }});
            num_wires++;
            num_wires = num_wires % wireColours.length;
            if (start_uuid === "output") {
                let input = gatejs.gates[fromEndpoint.elementId];
                input.isConnected = true;
                gatejs.gates[toEndpoint.elementId].addInput(input);
                input.addOutput(gatejs.gates[toEndpoint.elementId]);
            } else if (end_uuid === "output") {
                let input = gatejs.gates[toEndpoint.elementId];
                input.isConnected = true;
                gatejs.gates[fromEndpoint.elementId].addInput(input);
                input.addOutput(gatejs.gates[fromEndpoint.elementId]);
            }

        }
    });
}

export const connectMultiplexer = function () {
    jsPlumbInstance.bind("beforeDrop", function (data) {
        let fromEndpoint = data.connection.endpoints[0];
        let toEndpoint = data.dropEndpoint;

        const start_uuid = fromEndpoint.uuid.split(":")[0];
        const end_uuid = toEndpoint.uuid.split(":")[0];

        if (start_uuid === "input" && end_uuid === "input") {
            return false;
        } else if (start_uuid === "output" && end_uuid === "output") {
            return false;
        } else if ((end_uuid==="input" && toEndpoint.connections.length > 0) || (start_uuid==="input" && fromEndpoint.connections.length>1)) {
            // If it already has a connection, do not establish a new connection
            return false;
        } else {
            jsPlumbInstance.connect({ uuids: [fromEndpoint.uuid, toEndpoint.uuid], paintStyle:{ stroke: wireColours[num_wires], strokeWidth:4 }});
            num_wires++;
            num_wires = num_wires % wireColours.length;
            const start_type = fromEndpoint.elementId.split("-")[0];
            const end_type = toEndpoint.elementId.split("-")[0];
            if (start_type === "Multiplexer" && end_type === "Multiplexer") {
                if (start_uuid === "output") {
                    let input = multiplexerjs.multiplexer[fromEndpoint.elementId];
                    let pos = "";
                    if (Object.keys(fromEndpoint.overlays)[0].includes("finalOutput")) {
                        pos = "Out";
                    }
                 
                    input.setConnected(true);
                    if (Object.keys(toEndpoint.overlays)[0].includes("a")) {
                        multiplexerjs.multiplexer[toEndpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(toEndpoint.overlays)[0].includes("b")) {
                        multiplexerjs.multiplexer[toEndpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(toEndpoint.overlays)[0].includes("s0")) {
                        multiplexerjs.multiplexer[toEndpoint.elementId].setSelectLine([input, pos]);
                    }
                   
                } else if (end_uuid === "output") {
                    let input = multiplexerjs.multiplexer[toEndpoint.elementId];
                    let pos = "";
                    if (Object.keys(toEndpoint.overlays)[0].includes("finalOutput")) {
                        pos = "Out";
                    }
                    input.setConnected(true);
                    if (Object.keys(fromEndpoint.overlays)[0].includes("a")) {
                        multiplexerjs.multiplexer[fromEndpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(fromEndpoint.overlays)[0].includes("b")) {
                        multiplexerjs.multiplexer[fromEndpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(fromEndpoint.overlays)[0].includes("s0")) {
                        multiplexerjs.multiplexer[fromEndpoint.elementId].setSelectLine([input, pos]);
                    }
                }
            }
            else if (start_type === "Multiplexer" && end_type === "Input") {
                if (end_uuid === "output") {
                    let input = gatejs.gates[toEndpoint.elementId];
                    input.setConnected(true);
                    let pos = "";
                    if (Object.keys(fromEndpoint.overlays)[0].includes("a")) {
                        multiplexerjs.multiplexer[fromEndpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(fromEndpoint.overlays)[0].includes("b")) {
                        multiplexerjs.multiplexer[fromEndpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(fromEndpoint.overlays)[0].includes("s0")) {
                        multiplexerjs.multiplexer[fromEndpoint.elementId].setSelectLine([input, pos]);
                    }
                    input.addOutput(multiplexerjs.multiplexer[fromEndpoint.elementId]);
                  
                }
            }
            else if (start_type === "Input" && end_type === "Multiplexer") {
                if (start_uuid === "output") {
                    let input = gatejs.gates[fromEndpoint.elementId];
                    input.setConnected(true);
                    let pos = "";
                    if (Object.keys(toEndpoint.overlays)[0].includes("a")) {
                        multiplexerjs.multiplexer[toEndpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(toEndpoint.overlays)[0].includes("b")) {
                        multiplexerjs.multiplexer[toEndpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(toEndpoint.overlays)[0].includes("s0")) {
                        multiplexerjs.multiplexer[toEndpoint.elementId].setSelectLine([input, pos]);
                    }
                    input.addOutput(multiplexerjs.multiplexer[toEndpoint.elementId]);
                }
            }
            else if (start_type === "Multiplexer" && end_type === "Output") {
                if (start_uuid === "output") {
                    let input = multiplexerjs.multiplexer[fromEndpoint.elementId];
                    let output = gatejs.gates[toEndpoint.elementId];
                    let pos=""
                    if (Object.keys(fromEndpoint.overlays)[0].includes("finalOutput")) {
                        pos = "Out";
                    }
                    input.setConnected(true);
                    output.addInput(input);
                    multiplexerjs.finalOutputs[toEndpoint.elementId] = [input, pos];
                }
            }
            else if (start_type === "Output" && end_type === "Multiplexer") {
                if (start_uuid === "input") {
                    let input = multiplexerjs.multiplexer[toEndpoint.elementId];
                    let output = gatejs.gates[fromEndpoint.elementId];
                    let pos=""
                    if (Object.keys(fromEndpoint.overlays)[0].includes("finalOutput")) {
                        pos = "Out";
                    }
                    input.setConnected(true);
                    output.addInput(input);
                    multiplexerjs.finalOutputs[fromEndpoint.elementId] = [input, pos];
                }
            }
            else if (start_type === "Input" && end_type === "Output") {
                if (start_uuid === "output") {
                    let input = gatejs.gates[fromEndpoint.elementId];
                    let output = gatejs.gates[toEndpoint.elementId];
                    input.setConnected(true);
                    output.addInput(input);
                    input.addOutput(output);
                }
            }
            else if (start_type === "Output" && end_type === "Input") {
                if (start_uuid === "input") {
                    let input = gatejs.gates[toEndpoint.elementId];
                    let output = gatejs.gates[fromEndpoint.elementId];
                    input.setConnected(true);
                    output.addInput(input);
                    input.addOutput(output);
                }
            }
        }
    });
}

export const unbindEvent = () => {
    jsPlumbInstance.unbind("beforeDrop");
}


export function registerGate(id, gate) {
    const element = document.getElementById(id);
    const gateType = id.split("-")[0];

    if (
        gateType === "AND" ||
        gateType === "OR" ||
        gateType === "XOR" ||
        gateType === "XNOR" ||
        gateType === "NAND" ||
        gateType === "NOR"
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
    } else if (gateType === "NOT") {
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
    } else if (gateType === "Input") {
        gate.addOutputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [1, 0.5, 1, 0, 7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "output:0:" + id,
            })
        );
    } else if (gateType === "Output") {
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
    else if (gateType === "FullAdder") {
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
    else if (gateType === "Multiplexer") {
        // Select line
        gate.addInputPoints(
            jsPlumbInstance.addEndpoint(element, {
                anchor: [0, 0.5, -1, 0, -7, 0],
                source: true,
                target: true,
                connectionsDetachable: false,
                uuid: "input:0:" + id,
                overlays: [
                    { type: "Label", options: { label: "Select", id: "s0", location: [3, 0.4] } }
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
                    { type: "Label", options: { label: "Output", id: "finalOutput", location: [0.3, -1.3] } }
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

export function initTwoBitMultiplexer() {
    const ids = ["Input-0", "Input-1", "Input-2", "Output-3"]; // [A B Select Out]
    const types = ["Input", "Input", "Input", "Output"];
    const names = ["A", "B", "Select", "Output"];
    const positions = [
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



export function initFourBitMultiplexer() {
    const ids = ["Input-0", "Input-1", "Input-2", "Input-3", "Input-4", "Input-5","Output-8"] // [A0,B0,A1,B1,S0,S1,Output0,Output1,FinalOutput]
    const types = ["Input", "Input", "Input", "Input", "Input", "Input", "Output"]
    const names = ["I0", "I1","I2", "I3", "S1","S0","FinalOutput"]
    const positions = [
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


export function refreshWorkingArea() {
    jsPlumbInstance.reset();
    window.numComponents = 0;

    gatejs.clearGates();
    multiplexerjs.clearMux();
}


// const getInfo = function () {
//     console.log(multiplexerjs.multiplexer);
// }

// window.getInfo = getInfo



window.currentTab = "task1";
connectGate();
refreshWorkingArea();
initTwoBitMultiplexer();

