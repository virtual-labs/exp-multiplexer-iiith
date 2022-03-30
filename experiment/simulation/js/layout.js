// import { simulateFA, deleteFA } from "./fa.js";
import {simulateMux,deleteMux} from "./multiplexer.js"
import { simulate, deleteElement } from "./gate.js";
import * as main from "./main.js";

// Wires
export const wireColours = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8000", "#00ff80", "#80ff00", "#ff0080", "#8080ff", "#c0c0c0"];


// Contextmenu
const menu = document.querySelector(".menu");
const menuOption = document.querySelector(".menu-option");
let menuVisible = false;

const toggleMenu = command => {
  menu.style.display = command === "show" ? "block" : "none";
  menuVisible = !menuVisible;
};

export const setPosition = ({ top, left }) => {
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  toggleMenu("show");
};

window.addEventListener("click", e => {
  if (menuVisible) toggleMenu("hide");
  window.selectedComponent = null;
  window.componentType = null;
});

menuOption.addEventListener("click", e => {
  if (e.target.innerHTML == "Delete") {
    if (window.componentType == "gate") {
      deleteElement(window.selectedComponent);
    }
    else if (window.componentType == "multiplexer") {
      deleteMux(window.selectedComponent);
    }
  }
  window.selectedComponent = null;
  window.componentType = null;
});

// Tabs
function changeTabs(e) {
  const task = e.target.parentNode.id;
  if (window.currentTab == task) {
    return;
  }

  if (window.currentTab != null) {
    document.getElementById(window.currentTab).classList.remove("is-active");
  }
  window.currentTab = task;
  document.getElementById(task).classList.add("is-active");

  // 2-bit multiplexer
  if (task == "Task1") {
    main.unbindEvent();
    main.bindEvent1();
    main.refreshWorkingArea();
    main.initTwoBitMultiplexer();
    window.simulate= simulate
  }
  else if (task == "Task2") {
    main.unbindEvent();
    main.bindEvent2();
    main.refreshWorkingArea();
    main.initFourBitMultiplexer();
    window.simulate= simulateMux;
  }
  updateInstructions();
  updateToolbar();
  clearObservations();

}

window.changeTabs = changeTabs;

function updateInstructions() {
  if (window.currentTab == "Task1") {
    document.getElementById("TaskTitle").innerHTML = "2 x 1 Multiplexer";
    document.getElementById("TaskDescription").innerHTML = 'Implement a 2-bit Multiplexer using logic gates.'
  }
  else if (window.currentTab == "Task2") {
    document.getElementById("TaskTitle").innerHTML = "4 x 1 Multiplexer";
    document.getElementById("TaskDescription").innerHTML = 'Implement a 4-bit Multiplexer using 2-bit Multiplexers.'
  }

}

// Toolbar
function updateToolbar() {
  let elem = "";
  if (window.currentTab == "Task1") {
    elem = '<div class="column is-one-half"><div class="component-button AND" onclick="Add(event)">AND</div><div class="component-button OR" onclick="Add(event)">OR</div><div class="component-button NOT" onclick="Add(event)">NOT</div><div class="component-button NAND" onclick="Add(event)">NAND</div></div><div class="column is-one-half"><div class="component-button NOR" onclick="Add(event)">NOR</div><div class="component-button XOR" onclick="Add(event)">XOR</div><div class="component-button XNOR" onclick="Add(event)">XNOR</div></div>'
  }
  else if (window.currentTab == "Task2") {
    elem = '<div class="column is-one-half"><div class="component-button Multiplexer" onclick="addMux(event)"></div></div><div class="column is-one-half"></div>'
  }

  document.getElementById("toolbar").innerHTML = elem;
}

// Clear observations
function clearObservations() {

  document.getElementById("table-body").innerHTML = "";
  let head = ''

  if (window.currentTab == "Task1") {
    head = '<tr><th colspan="3">Inputs</th><th colspan="1">Expected Values</th><th colspan="1">Observed Values</th></tr><tr><th>A</th><th>B</th><th>SelectLine</th><th>Output</th><th>Output</th></tr>'
  }
  // else if (window.currentTab == "Task2") {
  //   head = '<tr><th colspan="3">Inputs</th><th colspan="2">Expected Values</th><th colspan="2">Observed Values</th></tr><tr><th>A</th><th>B</th><th>Cin</th><th>Sum</th><th>Carry</th><th>Sum</th><th>Carry</th></tr>'
  // }
  else if (window.currentTab == "Task2") {
    head = '<tr><th colspan="2">SelectLine</th><th colspan="2">Output</th></tr><tr><th>S0</th><th>S1</th><th>Expected</th><th>Observed</th>'
  }

  document.getElementById("table-head").innerHTML = head;
  document.getElementById('result').innerHTML = "";

}
