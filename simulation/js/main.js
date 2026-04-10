import * as gatejs from "./gate.js";
import * as multiplexerjs from "./multiplexer.js";
import { wireColours } from "./layout.js";

("use strict");
let num_wires = 0;
let conn;

// Debug mode toggle - set to false to reduce console verbosity
const DEBUG_WIRE_DELETION = false; // Set to true for detailed debugging

document.getScroll = function () {
  if (window.scrollX != undefined) {
    return [scrollX, scrollY];
  } else {
    let sx,
      sy,
      d = document,
      r = d.documentElement,
      b = d.body;
    sx = r.scrollLeft || b.scrollLeft || 0;
    sy = r.scrollTop || b.scrollTop || 0;
    return [sx, sy];
  }
};
const workingArea = document.getElementById("working-area");
export const jsPlumbInstance = jsPlumbBrowserUI.newInstance({
  container: workingArea,
  maxConnections: -1,
  endpoint: {
    type: "Dot",
    options: { radius: 5 },
  },
  dragOptions: {
    containment: "parentEnclosed",
    containmentPadding: 5,
  },
  connector: "Flowchart",
  paintStyle: { strokeWidth: 4, stroke: "#888888" },
  connectionsDetachable: false,
});

// Add connection hover events for deletion
jsPlumbInstance.bind("connection", function (info) {
  const connection = info.connection;
  const connectorElement = connection.connector.canvas;

  if (connectorElement) {
    // Add hover class on mouse enter
    connectorElement.addEventListener("mouseenter", function () {
      connectorElement.classList.add("jtk-hover");
    });

    // Remove hover class on mouse leave
    connectorElement.addEventListener("mouseleave", function () {
      connectorElement.classList.remove("jtk-hover");
    });
  }
});

export const connectGate = function () {
  jsPlumbInstance.bind("beforeDrop", function (data) {
    let fromEndpoint = data.connection.endpoints[0];
    let toEndpoint = data.dropEndpoint;

    const start_uuid = fromEndpoint.uuid.split(":")[0];
    const end_uuid = toEndpoint.uuid.split(":")[0];

    if (fromEndpoint.elementId === toEndpoint.elementId) {
      return false;
    }

    if (start_uuid === "input" && end_uuid === "input") {
      return false;
    } else if (start_uuid === "output" && end_uuid === "output") {
      return false;
    } else if (
      (end_uuid === "input" && toEndpoint.connections.length > 0) ||
      (start_uuid === "input" && fromEndpoint.connections.length > 1)
    ) {
      // If it already has a connection, do not establish a new connection
      return false;
    } else {
      conn = jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
      num_wires++;
      num_wires = num_wires % wireColours.length;
      if (start_uuid === "output") {
        let input = gatejs.gates[fromEndpoint.elementId];
        input.setConnected(true);
        gatejs.gates[toEndpoint.elementId].addInput(input);
        input.addOutput(gatejs.gates[toEndpoint.elementId]);
      } else if (end_uuid === "output") {
        let input = gatejs.gates[toEndpoint.elementId];
        input.setConnected(true);
        gatejs.gates[fromEndpoint.elementId].addInput(input);
        input.addOutput(gatejs.gates[fromEndpoint.elementId]);
      }
    }
  });
};

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
    } else if (
      (end_uuid === "input" && toEndpoint.connections.length > 0) ||
      (start_uuid === "input" && fromEndpoint.connections.length > 1)
    ) {
      // If it already has a connection, do not establish a new connection
      return false;
    } else {
      conn = jsPlumbInstance.connect({
        uuids: [fromEndpoint.uuid, toEndpoint.uuid],
        paintStyle: { stroke: wireColours[num_wires], strokeWidth: 4 },
      });
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
          } else if (Object.keys(toEndpoint.overlays)[0].includes("b")) {
            multiplexerjs.multiplexer[toEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("s0")) {
            multiplexerjs.multiplexer[toEndpoint.elementId].setSelectLine([
              input,
              pos,
            ]);
          }
          input.addOutput(multiplexerjs.multiplexer[toEndpoint.elementId]);
        } else if (end_uuid === "output") {
          let input = multiplexerjs.multiplexer[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("finalOutput")) {
            pos = "Out";
          }
          input.setConnected(true);
          if (Object.keys(fromEndpoint.overlays)[0].includes("a")) {
            multiplexerjs.multiplexer[fromEndpoint.elementId].setA0([
              input,
              pos,
            ]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("b")) {
            multiplexerjs.multiplexer[fromEndpoint.elementId].setB0([
              input,
              pos,
            ]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("s0")) {
            multiplexerjs.multiplexer[fromEndpoint.elementId].setSelectLine([
              input,
              pos,
            ]);
          }
          input.addOutput(multiplexerjs.multiplexer[fromEndpoint.elementId]);
        }
      } else if (start_type === "Multiplexer" && end_type === "Input") {
        if (end_uuid === "output") {
          let input = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("a")) {
            multiplexerjs.multiplexer[fromEndpoint.elementId].setA0([
              input,
              pos,
            ]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("b")) {
            multiplexerjs.multiplexer[fromEndpoint.elementId].setB0([
              input,
              pos,
            ]);
          } else if (Object.keys(fromEndpoint.overlays)[0].includes("s0")) {
            multiplexerjs.multiplexer[fromEndpoint.elementId].setSelectLine([
              input,
              pos,
            ]);
          }
          input.addOutput(multiplexerjs.multiplexer[fromEndpoint.elementId]);
        }
      } else if (start_type === "Input" && end_type === "Multiplexer") {
        if (start_uuid === "output") {
          let input = gatejs.gates[fromEndpoint.elementId];
          input.setConnected(true);
          let pos = "";
          if (Object.keys(toEndpoint.overlays)[0].includes("a")) {
            multiplexerjs.multiplexer[toEndpoint.elementId].setA0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("b")) {
            multiplexerjs.multiplexer[toEndpoint.elementId].setB0([input, pos]);
          } else if (Object.keys(toEndpoint.overlays)[0].includes("s0")) {
            multiplexerjs.multiplexer[toEndpoint.elementId].setSelectLine([
              input,
              pos,
            ]);
          }
          input.addOutput(multiplexerjs.multiplexer[toEndpoint.elementId]);
        }
      } else if (start_type === "Multiplexer" && end_type === "Output") {
        if (start_uuid === "output") {
          let input = multiplexerjs.multiplexer[fromEndpoint.elementId];
          let output = gatejs.gates[toEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("finalOutput")) {
            pos = "Out";
          }
          input.setConnected(true);
          output.addInput(input);
          multiplexerjs.finalOutputs[toEndpoint.elementId] = [input, pos];
          input.addOutput(output);
        }
      } else if (start_type === "Output" && end_type === "Multiplexer") {
        if (start_uuid === "input") {
          let input = multiplexerjs.multiplexer[toEndpoint.elementId];
          let output = gatejs.gates[fromEndpoint.elementId];
          let pos = "";
          if (Object.keys(fromEndpoint.overlays)[0].includes("finalOutput")) {
            pos = "Out";
          }
          input.setConnected(true);
          output.addInput(input);
          multiplexerjs.finalOutputs[fromEndpoint.elementId] = [input, pos];
          input.addOutput(output);
        }
      } else if (start_type === "Input" && end_type === "Output") {
        if (start_uuid === "output") {
          let input = gatejs.gates[fromEndpoint.elementId];
          let output = gatejs.gates[toEndpoint.elementId];
          input.setConnected(true);
          output.addInput(input);
          input.addOutput(output);
        }
      } else if (start_type === "Output" && end_type === "Input") {
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
};

export const unbindEvent = () => {
  jsPlumbInstance.unbind("beforeDrop");
};

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
  } else if (gateType === "FullAdder") {
    // carry output
    gate.addOutputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "output:0:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Cout", id: "cout", location: [3, 0.2] },
          },
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
          {
            type: "Label",
            options: { label: "Sum", id: "sum", location: [0.3, -1.7] },
          },
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
          {
            type: "Label",
            options: { label: "A0", id: "a0", location: [0.3, 1.7] },
          },
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
          {
            type: "Label",
            options: { label: "B0", id: "b0", location: [0.3, 1.7] },
          },
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
          {
            type: "Label",
            options: { label: "Cin", id: "cin", location: [-1, 0.2] },
          },
        ],
      })
    );
  } else if (gateType === "Multiplexer") {
    // Select line
    gate.addInputPoints(
      jsPlumbInstance.addEndpoint(element, {
        anchor: [0, 0.5, -1, 0, -7, 0],
        source: true,
        target: true,
        connectionsDetachable: false,
        uuid: "input:0:" + id,
        overlays: [
          {
            type: "Label",
            options: { label: "Select", id: "s0", location: [3, 0.4] },
          },
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
          {
            type: "Label",
            options: {
              label: "Output",
              id: "finalOutput",
              location: [0.3, -1.3],
            },
          },
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
          {
            type: "Label",
            options: { label: "I0", id: "a0", location: [0.3, 1.7] },
          },
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
          {
            type: "Label",
            options: { label: "I1", id: "b0", location: [0.3, 1.7] },
          },
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
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
  }
}

export function initFourBitMultiplexer() {
  const ids = [
    "Input-0",
    "Input-1",
    "Input-2",
    "Input-3",
    "Input-4",
    "Input-5",
    "Output-8",
  ]; // [A0,B0,A1,B1,S0,S1,Output0,Output1,FinalOutput]
  const types = [
    "Input",
    "Input",
    "Input",
    "Input",
    "Input",
    "Input",
    "Output",
  ];
  const names = ["I0", "I1", "I2", "I3", "S1", "S0", "FinalOutput"];
  const positions = [
    { x: 300, y: 50 },
    { x: 400, y: 50 },
    { x: 640, y: 50 },
    { x: 740, y: 50 },
    { x: 100, y: 400 },
    { x: 100, y: 200 },
    { x: 500, y: 700 },
  ];
  for (let i = 0; i < ids.length; i++) {
    let gate = new gatejs.Gate(types[i]);
    gate.setId(ids[i]);
    gate.setName(names[i]);
    const component = gate.generateComponent();
    const parent = document.getElementById("working-area");
    parent.insertAdjacentHTML("beforeend", component);
    gate.registerComponent("working-area", positions[i].x, positions[i].y);
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

const refresh = document.getElementById("refresh");

refresh.addEventListener("click", function (event) {
  jsPlumbInstance.reset();
  window.numComponents = 0;

  gatejs.clearGates();
  multiplexerjs.clearMux();
  if (window.currentTab == "task1") initTwoBitMultiplexer();
  else initFourBitMultiplexer();
});

// Context menu functionality for wire deletion
const menu = document.querySelector(".menu");
const menuOption = document.querySelector(".menu-option");
let menuVisible = false;

const toggleMenu = (command) => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = command === "show";
};

export const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};

window.addEventListener("click", () => {
  if (menuVisible) toggleMenu("hide");
  window.selectedComponent = null;
  window.componentType = null;
});

document.addEventListener("contextmenu", function (event) {
  // Only show custom context menu for specific elements
  const target = event.target;
  const isComponent =
    target.closest(".drag-drop") ||
    target.closest(".logic-gate") ||
    target.closest(".high") ||
    target.closest(".low") ||
    target.closest(".output") ||
    target.closest(".multiplexer");
  const isConnection = target.closest(".jtk-connector");
  const isWorkingArea =
    target.closest("#working-area") && !isComponent && !isConnection;

  // Only prevent default context menu for our interactive elements
  if (isComponent || isConnection || isWorkingArea) {
    event.preventDefault(); // Prevent the default context menu from appearing
    menu.style.display = "block";
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;

    // Store the target element and check if it's a connection
    window.contextMenuTarget = event.target;
    window.isConnectionContext =
      event.target.closest(".jtk-connector") !== null;

    toggleMenu("show");
  }
  // If it's not one of our elements, let the browser handle the context menu normally
});

// Menu option click handler
menuOption.addEventListener("click", (e) => {
  if (e.target.innerHTML === "Delete") {
    if (window.componentType === "gate") {
      console.log("op1");
      deleteElement(window.selectedComponent);
    } else if (window.componentType === "multiplexer") {
      deleteMultiplexer(window.selectedComponent);
    } else {
      console.log("op2 - deleting wire connections");

      // Enhanced debugging and error handling
      if (DEBUG_WIRE_DELETION) {
        const debugInfo = {
          jsPlumbMethods: Object.getOwnPropertyNames(jsPlumbInstance),
          totalConnections: jsPlumbInstance.connections
            ? jsPlumbInstance.connections.length
            : 0,
          multiplexerCount: Object.keys(multiplexerjs.multiplexer).length,
          gateCount: Object.keys(gatejs.gates).length,
          contextTarget: window.contextMenuTarget
            ? window.contextMenuTarget.className
            : "none",
          isConnectionContext: window.isConnectionContext,
        };
        console.log("Wire deletion debug info:", debugInfo);
      }
      let connectionDeleted = false;
      let deletionMethod = "none";
      let errorLog = [];

      // Enhanced state validation function
      const validateComponentState = (componentId, componentType) => {
        try {
          if (componentType === "multiplexer") {
            const mux = multiplexerjs.multiplexer[componentId];
            if (mux) {
              console.log(`Multiplexer ${componentId} state:`, {
                connected: mux.isConnected || false,
                outputs: mux.outputs ? mux.outputs.length : 0,
                a0: mux.a0,
                b0: mux.b0,
                selectLine: mux.selectLine,
              });
              return true;
            }
          } else if (componentType === "gate") {
            const gate = gatejs.gates[componentId];
            if (gate) {
              console.log(`Gate ${componentId} state:`, {
                connected: gate.isConnected || false,
                inputs: gate.inputs ? gate.inputs.length : 0,
                outputs: gate.outputs ? gate.outputs.length : 0,
                type: gate.type,
              });
              return true;
            }
          }
          return false;
        } catch (error) {
          errorLog.push(
            `State validation error for ${componentId}: ${error.message}`
          );
          return false;
        }
      };

      // Enhanced connection state cleanup function
      const cleanupConnectionState = (connection, method) => {
        try {
          const sourceId = connection.sourceId;
          const targetId = connection.targetId;

          console.log(
            `Cleaning up connection: ${sourceId} -> ${targetId} via ${method}`
          );

          // Validate components before cleanup
          const sourceType = sourceId.split("-")[0].toLowerCase();
          const targetType = targetId.split("-")[0].toLowerCase();

          let stateUpdated = false;

          // Update multiplexer connections with enhanced error checking
          if (multiplexerjs.multiplexer[sourceId]) {
            try {
              validateComponentState(sourceId, "multiplexer");
              multiplexerjs.multiplexer[sourceId].setConnected(false);
              const outputs = multiplexerjs.multiplexer[sourceId].outputs;
              if (outputs && Array.isArray(outputs)) {
                const targetIndex = outputs.findIndex(
                  (output) => output && output.id === targetId
                );
                if (targetIndex !== -1) {
                  outputs.splice(targetIndex, 1);
                  console.log(
                    `Removed output connection from multiplexer ${sourceId}`
                  );
                  stateUpdated = true;
                }
              }
            } catch (error) {
              errorLog.push(
                `Multiplexer source cleanup error (${sourceId}): ${error.message}`
              );
            }
          }

          if (multiplexerjs.multiplexer[targetId]) {
            try {
              validateComponentState(targetId, "multiplexer");
              const targetEndpoint = connection.endpoints
                ? connection.endpoints[1]
                : null;
              if (targetEndpoint && targetEndpoint.overlays) {
                const overlayKey = Object.keys(targetEndpoint.overlays)[0];
                console.log(
                  `Resetting multiplexer input via overlay: ${overlayKey}`
                );

                if (overlayKey && overlayKey.includes("a")) {
                  multiplexerjs.multiplexer[targetId].setA0([null, ""]);
                  stateUpdated = true;
                } else if (overlayKey && overlayKey.includes("b")) {
                  multiplexerjs.multiplexer[targetId].setB0([null, ""]);
                  stateUpdated = true;
                } else if (overlayKey && overlayKey.includes("s0")) {
                  multiplexerjs.multiplexer[targetId].setS0([null, ""]);
                  stateUpdated = true;
                }
              }
            } catch (error) {
              errorLog.push(
                `Multiplexer target cleanup error (${targetId}): ${error.message}`
              );
            }
          }

          // Update gate connections with enhanced error checking
          if (gatejs.gates[sourceId]) {
            try {
              validateComponentState(sourceId, "gate");
              gatejs.gates[sourceId].setConnected(false);
              const outputs = gatejs.gates[sourceId].outputs;
              if (outputs && Array.isArray(outputs)) {
                const targetIndex = outputs.findIndex(
                  (output) => output && output.id === targetId
                );
                if (targetIndex !== -1) {
                  outputs.splice(targetIndex, 1);
                  console.log(
                    `Removed output connection from gate ${sourceId}`
                  );
                  stateUpdated = true;
                }
              }
            } catch (error) {
              errorLog.push(
                `Gate source cleanup error (${sourceId}): ${error.message}`
              );
            }
          }

          if (gatejs.gates[targetId]) {
            try {
              validateComponentState(targetId, "gate");
              const inputs = gatejs.gates[targetId].inputs;
              if (inputs && Array.isArray(inputs)) {
                const sourceIndex = inputs.findIndex(
                  (input) => input && input.id === sourceId
                );
                if (sourceIndex !== -1) {
                  inputs.splice(sourceIndex, 1);
                  console.log(`Removed input connection from gate ${targetId}`);
                  stateUpdated = true;
                }
              }
            } catch (error) {
              errorLog.push(
                `Gate target cleanup error (${targetId}): ${error.message}`
              );
            }
          }

          if (!stateUpdated) {
            console.warn(
              `No state updates performed for connection ${sourceId} -> ${targetId}`
            );
          }

          return stateUpdated;
        } catch (error) {
          errorLog.push(`Connection cleanup error: ${error.message}`);
          return false;
        }
      };

      // Try to delete connection that was right-clicked with enhanced error handling
      if (window.isConnectionContext && window.contextMenuTarget) {
        const connectorElement =
          window.contextMenuTarget.closest(".jtk-connector");
        if (connectorElement) {
          console.log("Found connector element for deletion");

          try {
            // Method 1: Use JSPlumb's select method with enhanced validation
            if (
              jsPlumbInstance.select &&
              typeof jsPlumbInstance.select === "function"
            ) {
              console.log("Attempting Method 1: JSPlumb select()");
              const allConnections = jsPlumbInstance.select();

              if (allConnections && typeof allConnections.each === "function") {
                let found = false;
                allConnections.each(function (connection) {
                  if (
                    !found &&
                    connection &&
                    connection.connector &&
                    connection.connector.canvas === connectorElement
                  ) {
                    console.log("Found matching connection via select():", {
                      sourceId: connection.sourceId,
                      targetId: connection.targetId,
                      endpoints: connection.endpoints
                        ? connection.endpoints.length
                        : 0,
                    });

                    // Enhanced state cleanup
                    const stateCleanupSuccess = cleanupConnectionState(
                      connection,
                      "Method 1"
                    );

                    try {
                      jsPlumbInstance.deleteConnection(connection);
                      connectionDeleted = true;
                      deletionMethod = "Method 1 (select)";
                      found = true;
                      console.log(
                        "✅ Connection deleted successfully via Method 1"
                      );

                      // Verify deletion
                      const remainingConnections = jsPlumbInstance.connections
                        ? jsPlumbInstance.connections.length
                        : 0;
                      console.log(
                        `Connections remaining: ${remainingConnections}`
                      );
                    } catch (deleteError) {
                      errorLog.push(
                        `Method 1 deleteConnection error: ${deleteError.message}`
                      );
                      console.error(
                        "Method 1 deleteConnection failed:",
                        deleteError
                      );
                    }

                    return false; // break from each loop
                  }
                });

                if (!found) {
                  console.log("No matching connection found via Method 1");
                }
              } else {
                errorLog.push(
                  "Method 1: select() returned invalid object or missing each method"
                );
              }
            } else {
              errorLog.push("Method 1: select() method not available");
            }

            // Method 2: Use the connections property directly with enhanced validation
            if (
              !connectionDeleted &&
              jsPlumbInstance.connections &&
              Array.isArray(jsPlumbInstance.connections)
            ) {
              console.log(
                `Attempting Method 2: Direct connections array (${jsPlumbInstance.connections.length} connections)`
              );

              for (let i = 0; i < jsPlumbInstance.connections.length; i++) {
                const connection = jsPlumbInstance.connections[i];

                if (
                  connection &&
                  connection.connector &&
                  connection.connector.canvas === connectorElement
                ) {
                  console.log(
                    "Found matching connection via connections array:",
                    {
                      index: i,
                      sourceId: connection.sourceId,
                      targetId: connection.targetId,
                    }
                  );

                  // Enhanced state cleanup
                  const stateCleanupSuccess = cleanupConnectionState(
                    connection,
                    "Method 2"
                  );

                  try {
                    jsPlumbInstance.deleteConnection(connection);
                    connectionDeleted = true;
                    deletionMethod = "Method 2 (connections array)";
                    console.log(
                      "✅ Connection deleted successfully via Method 2"
                    );

                    // Verify deletion
                    const remainingConnections =
                      jsPlumbInstance.connections.length;
                    console.log(
                      `Connections remaining: ${remainingConnections}`
                    );

                    break;
                  } catch (deleteError) {
                    errorLog.push(
                      `Method 2 deleteConnection error: ${deleteError.message}`
                    );
                    console.error(
                      "Method 2 deleteConnection failed:",
                      deleteError
                    );
                  }
                }
              }

              if (!connectionDeleted) {
                console.log("No matching connection found via Method 2");
              }
            } else if (!connectionDeleted) {
              errorLog.push(
                "Method 2: connections array not available or not array"
              );
            }

            // Method 3: Remove the DOM element directly (enhanced fallback)
            if (!connectionDeleted && connectorElement.parentNode) {
              console.log("Attempting Method 3: Direct DOM removal");

              try {
                // Log element info before removal
                console.log("DOM element info:", {
                  tagName: connectorElement.tagName,
                  className: connectorElement.className,
                  parentNode: connectorElement.parentNode
                    ? connectorElement.parentNode.tagName
                    : "none",
                });

                connectorElement.parentNode.removeChild(connectorElement);
                connectionDeleted = true;
                deletionMethod = "Method 3 (DOM removal)";
                console.log("✅ Connection deleted via DOM removal (fallback)");

                // Note: DOM removal doesn't clean up component state, add warning
                console.warn(
                  "⚠️ DOM removal used - component state may be inconsistent"
                );
              } catch (domError) {
                errorLog.push(
                  `Method 3 DOM removal error: ${domError.message}`
                );
                console.error("Method 3 DOM removal failed:", domError);
              }
            }
          } catch (generalError) {
            errorLog.push(
              `General connection deletion error: ${generalError.message}`
            );
            console.error(
              "General error during connection deletion:",
              generalError
            );
          }
        } else {
          errorLog.push("No connector element found for context menu target");
          console.log("No connector element found for context menu target");
        }
      }

      // Enhanced fallback: delete hovered connections
      if (!connectionDeleted) {
        const elementsToDelete = document.querySelectorAll(
          ".jtk-connector.jtk-hover"
        );
        console.log(
          `Fallback: Found ${elementsToDelete.length} hovered elements for deletion`
        );

        if (elementsToDelete.length > 0) {
          elementsToDelete.forEach(function (connectorElement, index) {
            if (connectionDeleted) return; // Skip if already deleted

            console.log(
              `Processing hovered element ${index + 1}/${
                elementsToDelete.length
              }`
            );

            try {
              // Method 1: Try JSPlumb's select and check entries (enhanced)
              if (jsPlumbInstance.select && !connectionDeleted) {
                const allConnections = jsPlumbInstance.select();
                if (
                  allConnections &&
                  typeof allConnections.each === "function"
                ) {
                  allConnections.each(function (connection) {
                    if (connectionDeleted) return false; // Already deleted

                    if (
                      connection &&
                      connection.connector &&
                      connection.connector.canvas === connectorElement
                    ) {
                      console.log("Found hovered connection via select():", {
                        sourceId: connection.sourceId,
                        targetId: connection.targetId,
                      });

                      // Enhanced state cleanup
                      const stateCleanupSuccess = cleanupConnectionState(
                        connection,
                        "Hovered Method 1"
                      );

                      try {
                        jsPlumbInstance.deleteConnection(connection);
                        connectionDeleted = true;
                        deletionMethod = "Hovered Method 1 (select)";
                        console.log(
                          "✅ Hovered connection deleted successfully via Method 1"
                        );
                        return false; // break from each loop
                      } catch (deleteError) {
                        errorLog.push(
                          `Hovered Method 1 deleteConnection error: ${deleteError.message}`
                        );
                      }
                    }
                  });
                }
              }

              // Method 2: Use the connections property directly (enhanced)
              if (
                !connectionDeleted &&
                jsPlumbInstance.connections &&
                Array.isArray(jsPlumbInstance.connections)
              ) {
                for (let i = 0; i < jsPlumbInstance.connections.length; i++) {
                  const connection = jsPlumbInstance.connections[i];

                  if (
                    connection &&
                    connection.connector &&
                    connection.connector.canvas === connectorElement
                  ) {
                    console.log(
                      "Found hovered connection via connections array:",
                      {
                        index: i,
                        sourceId: connection.sourceId,
                        targetId: connection.targetId,
                      }
                    );

                    // Enhanced state cleanup
                    const stateCleanupSuccess = cleanupConnectionState(
                      connection,
                      "Hovered Method 2"
                    );

                    try {
                      jsPlumbInstance.deleteConnection(connection);
                      connectionDeleted = true;
                      deletionMethod = "Hovered Method 2 (connections array)";
                      console.log(
                        "✅ Hovered connection deleted successfully via Method 2"
                      );
                      break;
                    } catch (deleteError) {
                      errorLog.push(
                        `Hovered Method 2 deleteConnection error: ${deleteError.message}`
                      );
                    }
                  }
                }
              }

              // Method 3: Remove the DOM element directly (enhanced fallback)
              if (!connectionDeleted && connectorElement.parentNode) {
                console.log("Using DOM removal for hovered element");

                try {
                  connectorElement.parentNode.removeChild(connectorElement);
                  connectionDeleted = true;
                  deletionMethod = "Hovered Method 3 (DOM removal)";
                  console.log(
                    "✅ Hovered connection deleted via DOM removal (fallback)"
                  );
                  console.warn(
                    "⚠️ DOM removal used - component state may be inconsistent"
                  );
                } catch (domError) {
                  errorLog.push(
                    `Hovered Method 3 DOM removal error: ${domError.message}`
                  );
                }
              }
            } catch (error) {
              errorLog.push(
                `Hovered connection deletion error: ${error.message}`
              );
              console.error("Error deleting hovered connection:", error);
            }
          });
        } else {
          console.log("No hovered connector elements found");
        }
      }

      // Enhanced final status reporting
      if (DEBUG_WIRE_DELETION) {
        console.log("=== Wire Deletion Summary ===");
        console.log(`Connection deleted: ${connectionDeleted}`);
        console.log(`Deletion method: ${deletionMethod}`);
        console.log(`Errors encountered: ${errorLog.length}`);
      }

      if (errorLog.length > 0) {
        console.warn("Deletion errors:", errorLog);
      }

      if (!connectionDeleted) {
        // Determine if this is a user action issue or a technical problem
        const hasConnections =
          jsPlumbInstance.connections && jsPlumbInstance.connections.length > 0;
        const hasHoveredElements =
          document.querySelectorAll(".jtk-connector.jtk-hover").length > 0;
        const hasContextTarget =
          window.isConnectionContext && window.contextMenuTarget;

        if (!hasConnections && !hasHoveredElements && !hasContextTarget) {
          // This is normal - user clicked on empty space or component
          console.log("ℹ️ No wire connections available to delete");
          console.log(
            "💡 To delete a wire: Right-click directly on a wire connection"
          );
        } else if (errorLog.length > 0) {
          // This indicates a technical issue
          console.error("❌ Wire deletion failed due to technical errors");
          console.log("🔧 Technical troubleshooting needed:");
          console.log("1. Check if jsPlumb instance is properly initialized");
          console.log(
            "2. Verify connection exists in jsPlumb's internal state"
          );
          console.log("3. Check for API version compatibility issues");
          console.log("4. Ensure proper event handling for context menu");
        } else {
          // This indicates the wire wasn't found despite apparent setup
          console.warn("⚠️ Wire connection not found for deletion");
          console.log("🔍 Possible causes:");
          console.log("1. Right-clicked near but not directly on a wire");
          console.log("2. Connection was already deleted");
          console.log("3. Wire rendering issue - try refreshing the circuit");

          // Additional diagnostic information
          console.log("📊 Current state:", {
            totalConnections: hasConnections
              ? jsPlumbInstance.connections.length
              : 0,
            hoveredElements: hasHoveredElements,
            contextTarget: hasContextTarget,
            targetClassName: window.contextMenuTarget
              ? window.contextMenuTarget.className
              : "none",
          });
        }
      } else {
        console.log(
          `✅ Wire deletion completed successfully using ${deletionMethod}`
        );

        // Post-deletion validation
        const finalConnectionCount = jsPlumbInstance.connections
          ? jsPlumbInstance.connections.length
          : 0;
        console.log(`Final connection count: ${finalConnectionCount}`);
      }
    }
  }
  // Reset context variables
  window.contextMenuTarget = null;
  window.isConnectionContext = false;
  toggleMenu("hide"); // Hide menu after selection
});

window.currentTab = "task1";
connectGate();
refreshWorkingArea();
initTwoBitMultiplexer();
