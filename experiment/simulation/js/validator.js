import {gates, testSimulation} from './gate.js';
import { testSimulationMux } from './multiplexer.js';
import { multiplexer } from './multiplexer.js';

export function twoBitMultiplexerTest(Input0,Input1,Select,Output)  // This function takes 4 ids of the respective Gates
{
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


export function fourBitMultiplexerTest(InputI0,InputI1,InputI2,InputI3,InputS1,InputS0,OutputFinal) // I0,I1,I2,I3,S0,S1,Output
{
    let gates_list = gates;
    let mux = multiplexer;
    let inputI0 = gates_list[InputI0];
    let inputI1 = gates_list[InputI1];
    let inputI2 = gates_list[InputI2];
    let inputI3 = gates_list[InputI3];
    let inputS0 = gates_list[InputS0];
    let inputS1 = gates_list[InputS1];
    let dataTable = ''
    let flag = 0;


    let cnt1=0;
    let cnt2=0;
    let cnt3=0;
    let cnt4=0;
    for(let i=0;i<64;i++) // 64 = 2^6 basically calculates all the possible combinations for 6 inputs
    {
        // covert i to binary
        let binary = i.toString(2);

        if(binary.length < 2)
            binary = '0' + binary;
        if(binary.length < 3)
            binary = '0' + binary;
        if(binary.length < 4)
            binary = '0' + binary;
        if(binary.length < 5)
            binary = '0' + binary;

        
        const bit0 = binary[5] || 0;
        const bit1 = binary[4] || 0;
        const bit2 = binary[3] || 0;
        const bit3 = binary[2] || 0;
        const bit4 = binary[1] || 0;
        const bit5 = binary[0] || 0;


        inputI0.setOutput(bit5 == "1");
        inputI1.setOutput(bit4 == "1");
        inputI2.setOutput(bit3 == "1");
        inputI3.setOutput(bit2 == "1");
        inputS0.setOutput(bit1 == "1");
        inputS1.setOutput(bit0 == "1");

        // calculated output
        const calculatedOutput =  (inputI0.output && !inputS0.output && !inputS1.output) || (inputI2.output && !inputS0.output && inputS1.output) || (inputI1.output && inputS0.output && !inputS1.output) || (inputI3.output && inputS0.output && inputS1.output);
        
        
        // simulate the circuit
        let outputName = testSimulationMux(mux,gates_list)
        const muxOut = gates_list[OutputFinal].output;
        
        if(bit1 == "0" && bit0=="0" && cnt1==0)
        {
            dataTable += '<tr><th>'+ bit1 +'</th><th>'+ bit0 +'</th><th>'+ "I0" + '</th><th>'+ outputName
            cnt1++;
        }
        else if(bit1 == "1" && bit0=="0" && cnt2==0)
        {
            dataTable += '<tr><th>'+ bit1 +'</th><th>'+ bit0 +'</th><th>'+ "I1" + '</th><th>'+ outputName
            cnt2++;
        }
        else if(bit1 == "1" && bit0=="1" && cnt3==0)
        {
            dataTable += '<tr><th>'+ bit1 +'</th><th>'+ bit0 +'</th><th>'+ "I3" + '</th><th>'+ outputName
            cnt3++;
        }
        else if(bit1 == "0" && bit0=="1" && cnt4==0)
        {
            dataTable += '<tr><th>'+ bit1 +'</th><th>'+ bit0 +'</th><th>'+ "I2" + '</th><th>'+ outputName
            cnt4++;
        }
        if(muxOut!=calculatedOutput)
        {
            flag=1;
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
