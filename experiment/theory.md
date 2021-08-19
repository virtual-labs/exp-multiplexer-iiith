 An electronic multiplexer can be considered as a multiple-input, single-output switch, and a demultiplexer as a single-input, multiple-output switch.

2 X 1 Multiplexer
In digital circuit design, the selector wires are of digital value. In the case of a 2-to-1 multiplexer, a logic value of 0 would connect I0 to the output while a logic value of 1 would connect I1 to the output. In larger multiplexers, the number of selector pins is equal to log2(n) where n is the number of inputs.

<img src="images/2X1mux.jpg">

A 2-to-1 multiplexer has a boolean equation where A and B are the two inputs, S is the selector input, and Z is the output: Z = ( A . S') + (B . S)

**Truth Table** 

|S|A|B|Z|
|-|-|-|-|
|0|1|1|1|
|0|1|0|1|
|0|0|1|0|
|0|0|0|0|
|1|1|1|1|
|1|1|0|0|
|1|0|1|1|
|1|0|0|0|

4 X 1 Multiplexer
Larger multiplexers are also common and requires ceil(log2(n)) selector pins for n inputs. Other common sizes are 4-to-1, 8-to-1, and 16-to-1. Since digital logic uses binary values, powers of 2 are used (4, 8, 16) to maximally control a number of inputs for the given number of selector inputs. 

<img src="images/multiplexer.gif">

**Truth Table** 

|S<sub>1</sub>  S<sub>0</sub> | x<sub>3</sub> x<sub>2</sub> x<sub>1</sub> x<sub>0</sub> | y |
|-----------------------------|---------------------------------------------------------|---|
|      0           0          |       x             x             x             0       | 0 |
|      0           0          |       x             x             x             1       | 1 |
|      0           1          |       x             x             0             x       | 0 |
|      0           1          |       x             x             1             x       | 1 |
|      1           0          |       x             0             x             x       | 0 |
|      1           0          |       x             1             x             x       | 1 |
|      1           1          |       0             x             x             x       | 0 |
|      1           1          |       1             x             x             x       | 1 |         
