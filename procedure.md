### 2X1 Multiplexer

#### Circuit Diagram

<img src="images/2X1mux.jpg" alt="2X1 Multiplexer Circuit Diagram">

_Figure 1: 2X1 Multiplexer circuit diagram showing basic logic implementation with AND, OR, and NOT gates. Reference: Theory section_

#### Components Required

- 2 AND gates
- 1 OR gate
- 1 NOT gate

**Note**: Input and Output components (A, B, Select, Output) are pre-placed in the simulation workspace.

#### Circuit Connections

1. From the toolbar, drag a NOT gate and connect its input point to the Select input bit.
2. Drag the first AND gate from the toolbar and connect its input points to the input bit A and the output point of the NOT gate.
3. Drag the second AND gate from the toolbar and connect its input points to the input bit B and the Select input bit.
4. Drag an OR gate from the toolbar and connect its input points to the output points of the two AND gates.
5. Connect the output of the OR gate to the Output bit in the circuit.
6. After setting the values of A, B, and Select click "Simulate".

#### Additional Features

- **Wire Deletion**: Right-click on any wire connection and select "Delete" to remove it.
- **Component Deletion**: Right-click on any logic gate and select "Delete" to remove it.

#### Observations

- When Select is 0 the output is the value of A and when Select is 1 the output is the value of B.
- If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".

### 4X1 Multiplexer

#### Circuit Diagram

<img src="images/multiplexer.gif" alt="4X1 Multiplexer Circuit Diagram">

_Figure 2: 4X1 Multiplexer circuit diagram showing hierarchical construction using three 2X1 multiplexers with select line control. Reference: Theory section_

#### Components Required

- 3 2X1 Multiplexers

**Note**: Input and Output components (I<sub>0</sub>, I<sub>1</sub>, I<sub>2</sub>, I<sub>3</sub>, S<sub>0</sub>, S<sub>1</sub>, FinalOutput) are pre-placed in the simulation workspace.

#### Circuit Connections

1. From the toolbar, drag the first 2X1 Multiplexer and connect its input points I<sub>0</sub> and I<sub>1</sub> to the input bits I<sub>0</sub> and I<sub>1</sub> respectively.
2. Connect its Select input point to the input bit S<sub>0</sub>.
3. Drag the second 2X1 Multiplexer from the toolbar and connect its input points I<sub>0</sub> and I<sub>1</sub> to the input bits I<sub>2</sub> and I<sub>3</sub> respectively.
4. Connect its Select input point to the input bit S<sub>0</sub>.
5. Drag the third 2X1 Multiplexer from the toolbar and connect its input points I<sub>0</sub> and I<sub>1</sub> to the output points of first and second Multiplexer respectively.
6. Connect its Select input point to the input bit S<sub>1</sub> and its output point to the FinalOutput bit of the circuit.
7. After setting the values of I<sub>0</sub>, I<sub>1</sub>, I<sub>2</sub>, I<sub>3</sub>, S<sub>0</sub>, and S<sub>1</sub>, click "Simulate".

#### Additional Features

- **Wire Deletion**: Right-click on any wire connection and select "Delete" to remove it.
- **Component Deletion**: Right-click on any multiplexer and select "Delete" to remove it.

#### Observations

- When S<sub>1</sub> is 0 the output of the first 2X1 Multiplexer is the output and when S<sub>1</sub> is 1 the output of the second 2X1 Multiplexer is the output.
- The select code S<sub>1</sub>S<sub>0</sub> determines which input (I<sub>0</sub>, I<sub>1</sub>, I<sub>2</sub>, or I<sub>3</sub>) appears at the output:
  - S<sub>1</sub>S<sub>0</sub> = 00: Output = I<sub>0</sub>
  - S<sub>1</sub>S<sub>0</sub> = 01: Output = I<sub>1</sub>
  - S<sub>1</sub>S<sub>0</sub> = 10: Output = I<sub>2</sub>
  - S<sub>1</sub>S<sub>0</sub> = 11: Output = I<sub>3</sub>
- If the circuit has been made as described above, a "Success" message will be displayed upon clicking "Submit".
