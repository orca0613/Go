### Comments

- Should think about moving this code to 1-2 classes and put related methods inside them - learning Object Oriented Programming (OO or OOP) is useful for interviews
- Aim to write small & independent pieces of code that work together - this function has inner functions that make it very hard to debug. For example. the BFS algorithms are not obvious
- Don’t Repeat Yourself principle - whenever you see any code that is duplicated, write a helper function so that function can be called. For example, finding neighbours of points. Duplicated code is bad because if you ever need to change it, you have to change it in every place. Also if there’s a bug, the bug is everywhere.
- Tests are important. You can’t prove the code works without writing good tests

### Minor comments

- add type hints wherever possible - For example, `board: list[list[str]]`, `x: str`, color should be enum.
- Unless function is small, there should a docstring describing the inputs, what the function does, and what the function returns. For example
    
    ```python
    def remove_deadgroup(group: list[list[int]]):
    		"""Remove all coordinates in group from the board
    
        Arguments:
        group - list of coodinates to be removed
        """
    ```
    
    Some docstrings might be one line. Some functions might not need it. Generally you want someone else (or yourself in a year from now) to quickly know what the code does.
    
- Try to keep nesting minimum - if there’s a lot of indentation, that means something should be refactored. A good rule is 3-4 maximum indentations
- Constants should not be defined inside functions. For example, lines 9-10
- `clear_ko_point` looks like a bad idea, we shouldn’t be traversing the whole board looking for the `‘#’` symbol. Can we save coordinates that are ko and just replacing those?
