import {gates, testSimulation} from './gate.js';
import { testSimulationMux } from './multiplexer.js';


export function twoBitMultiplexerTest(Input0,Input1,Select,Output)  // This function takes 4 ids of the respective Gates
{
    // Gates[input0].outputs = true;
    // Gates[input1].outputs = true;

    let gates_list = gates;
    let input0 = gates_list[Input0];
    let input1 = gates_list[Input1];
    let selectLine = gates_list[Select];
    let flag = 0;
    let dataTable = ''

    for(let i=0; i<8;i++)
    {
        // covert i to binary
        let binary = i.toString(2);
        if(binary.length < 2)
            binary = '0' + binary;
        if(binary.length < 3)
            binary = '0' + binary;
        const bit0 = binary[2] || 0;
        const bit1 = binary[1] || 0;
        const bit2 = binary[0] || 0;

        input0.setOutput(bit2 == "1");
        input1.setOutput(bit1 == "1");
        selectLine.setOutput(bit0 == "1");

        // calculated output is a.(selectline)' + b.(selectline)
        const calculatedOutput = (input0.output && !selectLine.output) || (input1.output && selectLine.output) ? 1 : 0;

        // simulate the circuit
        testSimulation(gates_list);
        const output = gates_list[Output].output ? 1 : 0;

        dataTable += '<tr><th>'+ bit2 +'</th><th>'+ bit1 +'</th><th>'+ bit0 +'</th><td>'+ calculatedOutput +'</td><td>'+ output +'</td></tr>'

        if(calculatedOutput != output)
        {
            flag = 1;
            // console.log(calculatedSum,calculatedCarry);
            // console.log(sum,carry,i);
        }
    }

    const table_elem = document.getElementById('table-body');
    table_elem.insertAdjacentHTML('beforeend', dataTable);

    const result = document.getElementById('result');

    if(flag == 0)
    {
        result.innerHTML = "<span>&#10003;</span> Success";
        result.className = "success-message";
    }
    else
    {
        result.innerHTML = "<span>&#10007;</span> Fail";
        result.className = "failure-message";
    }

}


export function fourBitMultiplexerTest(InputA0,InputB0,InputA1,InputB1,InputS0,InputS1,OutputFinal)
{
    let gates_list = gates;
    let mux = multiplexer;
    let inputA0 = gates_list[InputA0];
    let inputB0 = gates_list[InputB0];
    let inputA1 = gates_list[InputA1];
    let inputB1 = gates_list[InputB1];
    let inputS0 = gates_list[InputS0];
    let inputS1 = gates_list[InputS1];
    let dataTable = ''
    let flag = 0;



    for(let i=0;i<64;i++) // 64 = 2^6 basically calculates all the possible combinations for 6 inputs
    {
        // covert i to binary
        let binary = i.toString(2);
        const bit0 = binary[0] || 0;
        const bit1 = binary[1] || 0;
        const bit2 = binary[2] || 0;
        const bit3 = binary[3] || 0;
        const bit4 = binary[4] || 0;
        const bit5 = binary[5] || 0;


        inputA0.setOutput(bit0 == "1");
        inputB0.setOutput(bit1 == "1");
        inputA1.setOutput(bit2 == "1");
        inputB1.setOutput(bit3 == "1");
        inputS0.setOutput(bit4 == "1");
        inputS1.setOutput(bit5 == "1");

        // calculated output
        const calculatedOutput =  (inputA0.output && !inputS0.output && !inputS1.output) || (inputA1.output && !inputS0.output && inputS1.output) || (inputB0.output && inputS0.output && !inputS1.output) || (inputB1.output && inputS0.output && inputS1.output);
        
        
        // simulate the circuit
        testSimulationMux(mux,gates_list)
        const muxOut = gates_list[OutputFinal].output;
        dataTable += '<tr><th>'+ bit0 +'</th><th>'+ bit1 +'</th><th>'+ bit2 +'</th><th>'+ bit3 +'</th><th>'+ bit4 +'</th><th>'+ bit5 +'</th><td>'+ calculatedOutput +'</td><td>'+ muxOut +'</td></tr>'
        if(muxOut!=calculatedOutput)
        {
            flag=1;
            // console.log(sumS0,sumSout0,sumS1,sumSout1,sumS2,sumSout2,sumS3,sumSout3);
            break;
        }
    }

    const table_elem = document.getElementById('table-body');
    table_elem.insertAdjacentHTML('beforeend', dataTable);

    const result = document.getElementById('result');

    if(flag == 0)
    {
        result.innerHTML = "<span>&#10003;</span> Success";
        result.className = "success-message";
    }
    else
    {
        result.innerHTML = "<span>&#10007;</span> Fail";
        result.className = "failure-message";
    }

}
