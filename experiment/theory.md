**Half Adder**

<img src="images/Half_Adder.svg.png">
A half adder adds two 1-bit binary numbers A and B to generate a 1-bit SUM (S) and a 1-bit CARRY (C) as output. The carry is theoretically carried on to the next bit position. The final sum numerically equals 2C + S. The simplest half-adder design, shown in the picture, incorporates an XOR gate for S and an AND gate for C. Half adders cannot be composed to produce larger bit adders as they lack a carry-in input. The outputs S and C can be expressed as logical functions of input variables A,B as follows:

**S** = **1** either if (**A = 0** and **B = 1**) or if (**A = 1** and **B = 0**) = **A XOR B**
**C= 1** only if (**A = 1** and **B = 1**) = **A AND B**

**Truth Table**

|A|B|CARRY|SUM|
|-|-|-----|---|
|0|0|0    |0  |
|0|1|0    |1  |	
|1|0|0    |1  |
|1|1|1    |0  |


Full Adder

<img src="images/Full_Adder.svg.png">

A full adder adds two 1-bit binary numbers along with a carry brought in and produces a sum and carry out as ouputs.1-bit full adder adds three 1-bit numbers, often written as A, B, and Cin, where A and B are the operands, and Cin is a bit carried in from a “past” addition.Circuit produces a 2-bit output sum typically represented by the signals Cout and S, where the sum numerically equals 2Cout + S . A full adder can be implemented in many different ways using custom transistor-level circuits or using other gates.

**S = A XOR B XOR Cin
Cout = (A
AND B) OR (Cin AND (A XOR B))**


**Truth Table**

|A|B|Cin|Cout|S|
|-|-|---|----|-|
|0|0|0  |0   |0|
|1|0|0  |0   |1|
|0|1|0  |0   |1|
|1|1|0  |1   |0|
|0|0|1  |0   |1|
|1|0|1  |1   |0|
|0|1|1  |1   |0|
|1|1|1  |1   |1|


**Ripple Carry Adder**

<img src="images/ripple_carry_adder.svg.png">

Multiple full adders can be used to create adders of greater bit lengths. Each full adder uses the Cout of the previous adder as its Cin. This kind of adder is a ripple carry adder, since the carry bits "ripple" through the full adder stages. Note that the first (and only the first) full adder may be replaced by a half adder.



