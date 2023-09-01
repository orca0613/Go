# Comments

## Version 1

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

## Version 2

Looks much better!! It’s common to have helper functions, so the top 2 don’t have to be in classes. One thing that might be interesting is turning the Board class into an API. Flask APIs are pretty quick to set up and you can learn about how different services connect together. Here’s a link to the documentation: https://flask.palletsprojects.com/en/2.3.x/quickstart/#a-minimal-application.

- There are more efficient algorithms such as saving the chains of the whole board so that each move is constant time. For the current implementation, we don’t care that much about speed so it should be fine. Code structure looks good. There’s one big function but most of the complex logic is contained there. This get_dead_group function should be well tested.
- Line 94 looks suspicious because it might not return something, so the type hint is inaccurate. If `new_ko_spot` is None on line 124, application will crash
- You have a class variable `ko_spot = (-1, -1)`. What if you have multiple Board class at the same time and they all try to change the ko_spot?
- This file should be split into smaller ones. Code should be separated into small files, each with clear responsibility. In other languages such as Java, you’re only allowed one class per file

### Some small things

- Line 14: this class should be inherited from Enum. You will never actually instantiate the class, so the constructor is useless.

```python
from enum import Enum
class Status(Enum):
…
```

- Line 48, You can unpack tuples with `y, x = coord`, if coord is `tuple[int, int]`
- for type hints, list is not very useful because it could be `list[str]` or `list[list[list[list[int]]]]`. How do I know which?
- in Python, you don’t have to check `if len(list) == 0`. There are certain values that are “falsy”, so the python convention is to use `if not len(list)`
- Be VERY careful when you import * from anything

