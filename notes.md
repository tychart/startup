# Class Notes

These are my notes for cs260

- Use Flexbox for everything
    - Have it take up the whole page
    - Have everything autosize to make it make sense on multiple displys
### Example JavaScript Syntax

* Anonemons Functions
* Lambda Functions (I think)
* Pass function as a peramiter
```{javascript}
function testAll(input, tester) {
  const result = input.every(tester);
  return result;
}

const result = testAll(
  ["Hello", "How are", "you doing", "Today", "hi"],
  (x) => {
    return x.length > 3;
  }
);
```
