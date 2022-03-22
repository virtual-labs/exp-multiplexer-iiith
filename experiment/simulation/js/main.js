import * as gatejs from "./gate.js";
import * as fajs from "./fa.js";

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
    paintStyle: { strokeWidth: 3, stroke: "#456" },
    connectionsDetachable: false,
});

export const bindEvent1 = function () {
    jsPlumbInstance.bind("beforeDrop", function (data) {
        let endpoint = data.connection.endpoints[0];
        let dropEndpoint = data.dropEndpoint;

        const start_uuid = endpoint.uuid.split(":")[0];
        const end_uuid = dropEndpoint.uuid.split(":")[0];
        
        if (endpoint.elementId == dropEndpoint.elementId) {
            return false;
        }

        if (start_uuid == "input" && end_uuid == "input") {
            return false;
        } else if (start_uuid == "output" && end_uuid == "output") {
            return false;
        } else {
            jsPlumbInstance.connect({ uuids: [endpoint.uuid, dropEndpoint.uuid] });

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

export const bindEvent2 = function () {
    jsPlumbInstance.bind("beforeDrop", function (data) {
        let endpoint = data.connection.endpoints[0];
        let dropEndpoint = data.dropEndpoint;

        const start_uuid = endpoint.uuid.split(":")[0];
        const end_uuid = dropEndpoint.uuid.split(":")[0];
        
        if (endpoint.elementId == dropEndpoint.elementId) {
            return false;
        }

        if (start_uuid == "input" && end_uuid == "input") {
            return false;
        } else if (start_uuid == "output" && end_uuid == "output") {
            return false;
        } else {
            jsPlumbInstance.connect({ uuids: [endpoint.uuid, dropEndpoint.uuid] });
            const start_type = endpoint.elementId.split("-")[0];
            const end_type = dropEndpoint.elementId.split("-")[0];
            if (start_type == "FullAdder" && end_type == "FullAdder") {
                if (start_uuid == "output") {
                    
                    let input = fajs.fullAdder[endpoint.elementId];
                    console.log(endpoint.overlays);
                    let pos = "";
                    if (Object.keys(endpoint.overlays)[0].includes("sum")) {
                        pos = "Sum";
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("cout")) {
                        pos = "Carry";
                    }
                    input.setConnected(true, pos);
                    console.log(input);
                    if (Object.keys(dropEndpoint.overlays)[0].includes("a")) {
                        fajs.fullAdder[dropEndpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("b")) {
                        fajs.fullAdder[dropEndpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("cin")) {
                        fajs.fullAdder[dropEndpoint.elementId].setCin([input, pos]);
                    }
                } else if (end_uuid == "output") {
                    let input = fajs.fullAdder[dropEndpoint.elementId];
                    let pos = "";
                    if (Object.keys(dropEndpoint.overlays)[0].includes("sum")) {
                        pos = "Sum";
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("cout")) {
                        pos = "Carry";
                    }
                    input.setConnected(true, pos);
                    if (Object.keys(endpoint.overlays)[0].includes("a")) {
                        fajs.fullAdder[endpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("b")) {
                        fajs.fullAdder[endpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("cin")) {
                        fajs.fullAdder[endpoint.elementId].setCin([input, pos]);
                    }
                }
            }
            else if (start_type == "FullAdder" && end_type == "Input") {
                if (end_uuid == "output") {
                    let input = gatejs.gates[dropEndpoint.elementId];
                    input.setConnected(true);
                    let pos = "";
                    if (Object.keys(endpoint.overlays)[0].includes("a")) {
                        fajs.fullAdder[endpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("b")) {
                        fajs.fullAdder[endpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("cin")) {
                        fajs.fullAdder[endpoint.elementId].setCin([input, pos]);
                    }
                }
            }
            else if (start_type == "Input" && end_type == "FullAdder") {
                if (start_uuid == "output") {
                    let input = gatejs.gates[endpoint.elementId];
                    input.setConnected(true);
                    let pos = "";
                    if (Object.keys(dropEndpoint.overlays)[0].includes("a")) {
                        fajs.fullAdder[dropEndpoint.elementId].setA0([input, pos]);
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("b")) {
                        fajs.fullAdder[dropEndpoint.elementId].setB0([input, pos]);
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("cin")) {
                        fajs.fullAdder[dropEndpoint.elementId].setCin([input, pos]);
                    }
                }
            }
            else if (start_type == "FullAdder" && end_type == "Output") {
                if (start_uuid == "output") {
                    let input = fajs.fullAdder[endpoint.elementId];
                    let output = gatejs.gates[dropEndpoint.elementId];
                    if (Object.keys(endpoint.overlays)[0].includes("sum")) {
                        pos = "Sum";
                    }
                    else if (Object.keys(endpoint.overlays)[0].includes("cout")) {
                        pos = "Carry";
                    }
                    input.setConnected(true, pos);
                    output.addInput(input);
                    fajs.finalOutputs[dropEndpoint.elementId] = [input, pos];
                }
            }
            else if (start_type == "Output" && end_type == "FullAdder") {
                if (start_uuid == "input") {
                    let input = fajs.fullAdder[dropEndpoint.elementId];
                    let output = gatejs.gates[endpoint.elementId];
                    if (Object.keys(dropEndpoint.overlays)[0].includes("sum")) {
                        pos = "Sum";
                    }
                    else if (Object.keys(dropEndpoint.overlays)[0].includes("carry")) {
                        pos = "Carry";
                    }
                    input.setConnected(true, pos);
                    output.addInput(input);
                    fajs.finalOutputs[endpoint.elementId] = [input, pos];
                }
            }
            else if (start_type == "Input" && end_type == "Output") {
                if (start_uuid == "output") {
                    let input = gatejs.gates[endpoint.elementId];
                    let output = gatejs.gates[dropEndpoint.elementId];
                    input.setConnected(true);
                    output.addInput(input);
                    fajs.finalOutputs[dropEndpoint.elementId] = [input, ""];
                }
            }
            else if (start_type == "Output" && end_type == "Input") {
                if (start_uuid == "input") {
                    let input = gatejs.gates[dropEndpoint.elementId];
                    let output = gatejs.gates[endpoint.elementId];
                    input.setConnected(true);
                    output.addInput(input);
                    fajs.finalOutputs[endpoint.elementId] = [input, ""];
                }
            }
            // return true;
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
}
export function initHalfAdder() {
    let ids = ["Input-0", "Input-1", "Output-2", "Output-3"]; // [A B Sum Carry Out]
    let types = ["Input", "Input", "Output", "Output"];
    let names = ["A", "B", "Sum", "Carry"];
    let positions = [
        { x: 40, y: 200 },
        { x: 40, y: 550 },
        { x: 820, y: 200 },
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

export function initFullAdder() {
    let ids = ["Input-0", "Input-1", "Input-2", "Output-3", "Output-4"]; // [A,B,carry -input,Sum,carry-output]
    let types = ["Input", "Input", "Input", "Output", "Output"];
    let names = ["A", "B", "CarryIn", "Sum", "CarryOut"];
    let positions = [
        { x: 40, y: 150 },
        { x: 40, y: 375 },
        { x: 40, y: 600 },
        { x: 820, y: 262.5 },
        { x: 820, y: 487.5 },
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

export function initRippleAdder() {
    let ids = ["Input-0", "Input-1", "Output-2", "Input-3", "Input-4", "Output-5", "Input-6", "Input-7", "Output-8", "Input-9", "Input-10", "Output-11", "Output-12", "Input-13"] // [A0,B0,Sum0,A1,B1,Sum1,A2,B2,Sum2,A3,B3,Sum3,CarryOut, CarryIn]
    let types = ["Input", "Input", "Output", "Input", "Input", "Output", "Input", "Input", "Output", "Input", "Input", "Output", "Output", "Input"]
    let names = ["A0", "B0", "Sum0", "A1", "B1", "Sum1", "A2", "B2", "Sum2", "A3", "B3", "Sum3", "CarryOut", "CarryIn"]
    let positions = [
        { x: 640, y: 50 },
        { x: 740, y: 50 },
        { x: 800, y: 625 },
        { x: 440, y: 50 },
        { x: 540, y: 50 },
        { x: 600, y: 625 },
        { x: 240, y: 50 },
        { x: 340, y: 50 },
        { x: 400, y: 625 },
        { x: 40, y: 50 },
        { x: 140, y: 50 },
        { x: 200, y: 625 },
        { x: 40, y: 500 },
        { x: 820, y: 150 },
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
    fajs.clearFAs();
}



window.currentTab = "Task1";
bindEvent1();
refreshWorkingArea();
initHalfAdder();
