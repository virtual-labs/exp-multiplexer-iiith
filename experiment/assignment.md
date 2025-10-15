1. Design a 2X1 multiplexer circuit using basic logic gates. The circuit should take 3 inputs (A, B, and Select) and produce 1 output (Z). Implement the logic equation Z = (A · S') + (B · S) using AND, OR, and NOT gates. Verify your implementation by testing all possible input combinations.

2. Construct a 4X1 multiplexer using three 2X1 multiplexers. Given four data inputs I₃I₂I₁I₀ and two select inputs S₁S₀, the circuit should output Y based on the select code. Verify that:

   - When S₁S₀ = 00, Output = I₀
   - When S₁S₀ = 01, Output = I₁
   - When S₁S₀ = 10, Output = I₂
   - When S₁S₀ = 11, Output = I₃

3. **Theoretical Exercise**: Design an 8X1 multiplexer using hierarchical approach. Draw the block diagram showing how two 4X1 multiplexers and one 2X1 multiplexer can be connected to create an 8X1 multiplexer. Explain the role of each select line (S₂, S₁, S₀) in the circuit operation. (Note: Implementation not possible in current simulation due to I/O limitations)

4. **Theoretical Exercise**: Analyze how multiplexers can implement Boolean functions. Consider a 2-variable Boolean function f(A,B). Explain how a 4X1 multiplexer can be used to implement any 2-variable Boolean function by:
   - Using A and B as select lines
   - Connecting appropriate constants (0 or 1) or variables to the data inputs
   - Provide the truth table approach for implementing f(A,B) = A ⊕ B (XOR function)

**Note**: Questions 3 and 4 are theoretical exercises designed to enhance understanding of multiplexer applications beyond the current simulation capabilities.
