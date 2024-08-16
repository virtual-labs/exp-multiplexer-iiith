import { gates, testSimulation } from './gate.js';
import { testSimulationMux, multiplexer } from './multiplexer.js';

'use strict';

// Helper functions
export function computeXor(a, b) {
    return a != b;
}
export function computeAnd(a, b) {
    return a && b;
}
export function computeOr(a, b) {
    return a || b;
}
export function computeXnor(a, b) {
    return a == b;
}
export function computeNand(a, b) {
    return !(a && b);
}
export function computeNor(a, b) {
    return !(a || b);
}

export function twoBitMultiplexerTest(inputA, inputB, select, outputId)  // This function takes 4 ids of the respective Gates
{
    let gates_list = gates;
    let input0 = gates_list[inputA];
    let input1 = gates_list[inputB];
    let selectLine = gates_list[select];
    let circuitIsCorrect = true;
    let dataTable = "";
    let head = '<tr><th colspan="3">Inputs</th><th colspan="1">Expected Values</th><th colspan="1">Observed Values</th></tr><tr><th>A</th><th>B</th><th>Select</th><th>Output</th><th>Output</th></tr>';
    document.getElementById("table-head").innerHTML = head;

    for (let i = 0; i < 8; i++) {
        // covert i to binary
        let binary = i.toString(2).padStart(3, "0");
        binary = binary.split("").reverse().join("");


        input0.setOutput(binary[2] === "1");
        input1.setOutput(binary[1] === "1");
        selectLine.setOutput(binary[0] === "1");

        // calculated output is a.(selectline)' + b.(selectline)
        const calculatedOutput = computeOr(computeAnd(input0.output, !selectLine.output), computeAnd(input1.output, selectLine.output)) ? 1 : 0;

        // simulate the circuit
        if (!testSimulation(gates_list)) {
            return;
        }
        const output = gates_list[outputId].output ? 1 : 0;

        let className = calculatedOutput === output ? "success-table" : "failure-table";
        if (calculatedOutput != output) {
            circuitIsCorrect = false;
        }
        dataTable += `<tr class="bold-table"><th> ${binary[2]} </th><th> ${binary[1]}</th><th> ${binary[0]}</th><td> ${calculatedOutput}</td><td class="${className}"> ${output}</td></tr>`;
    }

    const table_elem = document.getElementById('table-body');
    table_elem.insertAdjacentHTML('beforeend', dataTable);

    const result = document.getElementById('result');

    if (circuitIsCorrect) {
        result.innerHTML = "<span>&#10003;</span> Success";
        result.className = "success-message";
    }
    else {
        result.innerHTML = "<span>&#10007;</span> Fail";
        result.className = "failure-message";
    }

}


export function fourBitMultiplexerTest(i0, i1, i2, i3, s1, s0, OutputFinal) // I0,I1,I2,I3,S0,S1,Output
{
    let gates_list = gates;
    let mux = multiplexer;
    let inputI0 = gates_list[i0];
    let inputI1 = gates_list[i1];
    let inputI2 = gates_list[i2];
    let inputI3 = gates_list[i3];
    let inputS0 = gates_list[s0];
    let inputS1 = gates_list[s1];
    let dataTable = '';
    let head = '<tr><th colspan="2">Select</th><th colspan="2">Output</th></tr><tr><th>S0</th><th>S1</th><th>Expected</th><th>Observed</th>';
    document.getElementById("table-head").innerHTML = head;
    let circuitIsCorrect = true;


    let cnt00 = true; // this value will become false if for any combination of A0,B0, the S1,S0=00combination will give wrong output.
    let cnt01 = true;
    let cnt10 = true;
    let cnt11 = true;

    let outputName00 = ""; //this stores the outputName that we get for all combo's of A0 & B0 when S1,S0 = 00
    let outputName01 = "";
    let outputName10 = "";
    let outputName11 = "";
    for (let i = 0; i < 64; i++) // 64 = 2^6 basically calculates all the possible combinations for 6 inputs
    {
        // covert i to binary
        let binary = i.toString(2).padStart(6, "0");
        binary = binary.split("").reverse().join("");


        inputI0.setOutput(binary[5] === "1");
        inputI1.setOutput(binary[4] === "1");
        inputI2.setOutput(binary[3] === "1");
        inputI3.setOutput(binary[2] === "1");
        inputS0.setOutput(binary[1] === "1");
        inputS1.setOutput(binary[0] === "1");

        // calculated output
        const calculatedOutput = (inputI0.output && !inputS0.output && !inputS1.output) || (inputI2.output && !inputS0.output && inputS1.output) || (inputI1.output && inputS0.output && !inputS1.output) || (inputI3.output && inputS0.output && inputS1.output);


        // simulate the circuit
        const output = testSimulationMux(mux, gates_list);
        if (output == false) {
            return;
        }
        let outputName = output;
        const muxOut = gates_list[OutputFinal].output;

        // let className = calculatedOutput === muxOut ? "success-table" : "failure-table";
        if (muxOut != calculatedOutput) {
            circuitIsCorrect = false;
        }

        if (binary[1] === "0" && binary[0] === "0") {

            if (muxOut != calculatedOutput)
                cnt00 = false;
            outputName00 = outputName;
        }
        else if (binary[1] === "1" && binary[0] === "0") {
            if (muxOut != calculatedOutput)
                cnt10 = false;
            outputName10 = outputName;
        }
        else if (binary[1] === "1" && binary[0] === "1") {
            if (muxOut != calculatedOutput)
                cnt11 = false;
            outputName11 = outputName;
        }
        else if (binary[1] === "0" && binary[0] === "1") {
            if (muxOut != calculatedOutput)
                cnt01 = false;
            outputName01 = outputName;
        }
    }

    let className = "";

    className = cnt00 === true ? "success-table" : "failure-table";
    dataTable += `<tr class="bold-table"><th>0</th><th>0</th><th> I0 </th><td class="${className}">${outputName00}</td></tr>`;
    className = cnt10 === true ? "success-table" : "failure-table";
    dataTable += `<tr class="bold-table"><th>1</th><th>0</th><th> I1 </th><td class="${className}">${outputName10}</td></tr>`;
    className = cnt11 === true ? "success-table" : "failure-table";
    dataTable += `<tr class="bold-table"><th>1</th><th>1</th><th> I3 </th><td class="${className}">${outputName11}</td></tr>`;
    className = cnt01 === true ? "success-table" : "failure-table";
    dataTable += `<tr class="bold-table"><th>0</th><th>1</th><th> I2 </th><td class="${className}">${outputName01}</td></tr>`;

    const table_elem = document.getElementById('table-body');
    table_elem.insertAdjacentHTML('beforeend', dataTable);

    const result = document.getElementById('result');

    if (circuitIsCorrect) {
        result.innerHTML = "<span>&#10003;</span> Success";
        result.className = "success-message";
    }
    else {
        result.innerHTML = "<span>&#10007;</span> Fail";
        result.className = "failure-message";
    }

}
