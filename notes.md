# Class Notes

These are my notes for cs260

- Use Flexbox for everything
    - Have it take up the whole page
    - Have everything autosize to make it make sense on multiple displys


## Example JavaScript Syntax

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

* Example of sorting objects
```{javascript}
currentData.sort((a, b) => a[header].toString().localeCompare(b[header].toString()));
```

### JavaScript Async/await

📖 **Deeper dive reading**: [MDN async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

JavaScript Promise objects are great for asynchronous execution, but as developers began to build large systems with promises they started wanting a more concise representation. This was provided with the introduction of the `async/await` syntax. The `await` keyword wraps the execution of a promise and removed the need to chain functions. The `await` expression will block until the promise state moves to `fulfilled`, or throws an exception if the state moves to `rejected`. For example, if we have a function that returns a coin toss promise.

```js
const coinToss = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve(Math.random() > 0.5 ? 'heads' : 'tails');
      } else {
        reject('fell off table');
      }
    }, 1000);
  });
};
```

We can create equivalent executions with either a promise `then/catch` chain, or an `await` with a `try/catch` block.

**then/catch chain version**

```js
coinToss()
  .then((result) => console.log(`Toss result ${result}`))
  .catch((err) => console.error(`Error: ${err}`))
  .finally(() => console.log(`Toss completed`));
```

**async, try/catch version**

```js
try {
  const result = await coinToss();
  console.log(`Toss result ${result}`);
} catch (err) {
  console.error(`Error: ${err}`);
} finally {
  console.log(`Toss completed`);
}
```

#### async

One important restriction for working with `await` is that you cannot call await unless it is called at the top level of the JavaScript, or is in a function that is defined with the `async` keyword. Applying the `async` keyword transforms the function so that it returns a promise that will resolve to the value that was previously returned by the function. Basically this turns any function into an asynchronous function, so that it can in turn make asynchronous requests.

This can be demonstrated with a function that makes animal noises. Notice that the return value is a simple string.

```js
function cow() {
  return 'moo';
}
console.log(cow());
// OUTPUT: moo
```

If we designate the function to be asynchronous then the return value becomes a promise that is immediately resolved and has a value that is the return value of the function.

```js
async function cow() {
  return 'moo';
}
console.log(cow());
// OUTPUT: Promise {<fulfilled>: 'moo'}
```

We then change the cow function to explicitly create a promise instead of the automatically generated promise that the await keyword generates.

```js
async function cow() {
  return new Promise((resolve) => {
    resolve('moo');
  });
}
console.log(cow());
// OUTPUT: Promise {<pending>}
```

You can see that the promise is in the pending state because the promise's execution function has not yet resolved.

#### await

The `async` keyword declares that a function returns a promise. The `await` keyword wraps a call to the `async` function, blocks execution until the promise has resolved, and then returns the result of the promise.

We can demonstrate `await` in action with the cow promise from above. If we log the output from invoking `cow` then we see that the return value is a promise. However, if we prefix the call to the function with the await keyword, execution will stop until the promise has resolved, at which point the result of the promise is returned instead of the actual promise object.

```js
console.log(cow());
// OUTPUT: Promise {<pending>}

console.log(await cow());
// OUTPUT: moo
```

By combining `async`, to define functions that return promises, with `await`, to wait on the promise, you can create code that is asynchronous, but still maintains the flow of the code without explicitly using callbacks.

#### Putting it all together

You can see the benefit for `async`/`await` clearly by considering a case where multiple promises are required. For example, when calling the `fetch` web API on an endpoint that returns JSON, you would need to resolve two promises. One for the network call, and one for converting the result to JSON. A promise implementation would look like the following.

```js
const httpPromise = fetch('https://simon.cs260.click/api/user/me');
const jsonPromise = httpPromise.then((r) => r.json());
jsonPromise.then((j) => console.log(j));
console.log('done');

// OUTPUT: done
// OUTPUT: {email: 'bud@mail.com', authenticated: true}
```

With async/await, you can clarify the code intent by hiding the promise syntax, and also make the execution block until the promise is resolved.

```js
const httpResponse = await fetch('https://simon.cs260.click/api/user/me');
const jsonResponse = await httpResponse.json();
console.log(jsonResponse);
console.log('done');

// OUTPUT: {email: 'bud@mail.com', authenticated: true}
// OUTPUT: done

//Also, use a try catch block
try {
    // stuff
} catch (err) {
    // console.log(err)
}
```

Here's the JS for the Pizza Async function
```js
async function pickupPizza() {
  const order = createOrder();

  // Async
  try {
    let orderStatus = await placeOrder(order);
    orderStatus = serveOrder(order);
  } catch (err) {
    orderFailure(order);
  }

  // Promise
  // placeOrder(order)
  //   .then((order) => serveOrder(order))
  //   .catch((order) => {
  //     orderFailure(order);
  //   });
}

function createOrder() {
  // Make the order and associate it with a new HTML element
  const id = Math.floor(Math.random() * 10000);
  const orderElement = document.createElement("li");
  const order = { element: orderElement, id: id };

  // Insert the order into the HTML list
  orderElement.innerHTML = `<span>[${order.id}] 😋 <i>Waiting</i> ...</span>`;
  const orders = document.getElementById("orders");
  orders.appendChild(orderElement);

  return order;
}

function placeOrder(order) {
  return new Promise((resolve, reject) => {
    doWork(order, 1000, 3000, resolve, reject, `cashier too busy`);
  });
}

function doWork(order, min, max, resolve, reject, errMsg) {
  let workTime = Math.random() * (max - min) + min;
  setTimeout(() => {
    workTime = Math.round(workTime);
    if (workTime < max * 0.85) {
      resolve(order);
    } else {
      order.error = errMsg;
      reject(order);
    }
  }, workTime);
}

function serveOrder(order) {
  order.element.innerHTML = `<span>[${order.id}] 🍕 <b>Served</b>!</span>`;
}

function orderFailure(order) {
  order.element.innerHTML = `<span> [${order.id}] 😠 <b class='failure'>Failure</b>! ${order.error}</span>`;
}
```

### Arrow Functions

Because functions are first order objects in JavaScript they can be declared anywhere and passed as parameters. This results in code with lots of anonymous functions cluttering things up. To make the code more compact the `arrow` syntax was created. This syntax replaces the need for the `function` keyword with the symbols `=>` placed after the parameter declaration. The enclosing curly braces are also optional.

This is a function in arrow syntax that takes no parameters and always returns 3.

```js
() => 3;
```

The following two invocations of sort are equivalent.

```js
const a = [1, 2, 3, 4];

// standard function syntax
a.sort(function (v1, v2) {
  return v1 - v2;
});

// arrow function syntax
a.sort((v1, v2) => v1 - v2);
```

Besides being compact, the `arrow` function syntax has some important semantic differences from the standard function syntax. This includes restrictions that arrow functions cannot be used for constructors or iterator generators.

#### Return values

Arrow functions also have special rules for the `return` keyword. The return keyword is optional if no curly braces are provided for the function and it contains a single expression. In that case the result of the expression is automatically returned. If curly braces are provided then the arrow function behaves just like a standard function.

```js
() => 3;
// RETURNS: 3

() => {
  3;
};
// RETURNS: undefined

() => {
  return 3;
};
// RETURNS: 3
```

#### This pointer

Next, arrow functions inherit the `this` pointer from the scope in which they are created. This makes what is known as a `closure`. A closure allows a function to continue referencing its creation scope, even after it has passed out of that scope. This can be tricky to wrap your head around, and we discuss it in detail when we later talk about JavaScript `scope`. For now consider the following example.

The function `makeClosure` returns an anonymous function using the arrow syntax. Notice that the `a` parameter is overridden, a new `b` variable is created, and both `a` and `b` are referenced in the arrow function. Because of that reference, they are both part of the closure for the returned function.

```js
function makeClosure(a) {
  a = 'a2';
  const b = 'b2';
  return () => [a, b];
}
```

Next, we declare the variables `a` and `b` at the top level scope, and call `makeClosure` with `a`.

```js
const a = 'a';
const b = 'b';

const closure = makeClosure(a);
```

Now, when we call the `closure` function, it will output the values contained in the scope in which it was created, instead of the current values of the variables.

```js
console.log(closure());
// OUTPUT: ['a2', 'b2']

console.log(a, b);
// OUTPUT: 'a' 'b'
```

Closures provide a valuable property when we do things like execute JavaScript within the scope of an HTML page, because it can remember the values of variables when the function was created instead of what they are when they are executed.

#### Putting it all together

Now that you know how functions work in JavaScript, let's look at an example that demonstrates the use of functions, arrow functions, parameters, a function as a parameter (callback), closures, and browser event listeners. This is done by implementing a `debounce` function.

The point of a debounce function is to only execute a specified function once within a given time window. Any requests to execute the debounce function more frequently than this will case the time window to reset. This is important in cases where a user can trigger expensive events thousands of times per second. Without a debounce the performance of your application can greatly suffer.

The following code calls the browser's `window.addEventListener` function to add a callback function that is invoked whenever the user scrolls the browser's web page. The first parameter to `addEventListener` specifies that it wants to listen for `scroll` events. The second parameter provides the function to call when a scroll event happens. In this case we call a function named `debounce`.

The debounce function takes two parameters, the time window for executing the window function, and the window function to call within that limit. In this case we will execute the arrow function at most every 500 milliseconds.

```js
window.addEventListener(
  'scroll',
  debounce(500, () => {
    console.log('Executed an expensive calculation');
  })
);
```

The debounce function implements the execution of windowFunc within the restricted time window by creating a closure that contains the current timeout and returning a function that will reset the timeout every time it is called. The returned function is what the scroll event will actually call when the user scrolls the page. However, instead of directly executing the `windowFunc` it sets a timer based on the value of `windowMs`. If the debounce function is called again before the window times out then it resets the timeout.

```js
function debounce(windowMs, windowFunc) {
  let timeout;
  return function () {
    console.log('scroll event');
    clearTimeout(timeout);
    timeout = setTimeout(() => windowFunc(), windowMs);
  };
}
```

### Adding JavaScript to HTML

You can insert JavaScript into HTML either by directly including it in the HTML within the content of a `<script>` element, or by using the `src` attribute of the script element to reference an external JavaScript file.

**index.js**

```js
function sayHello() {
  console.log('hello');
}
```

**index.html**

```html
<head>
  <script src="javascript.js"></script>
</head>
<body>
  <button onclick="sayHello()">Say Hello</button>
  <button onclick="sayGoodbye()">Say Goodbye</button>
  <script>
    function sayGoodbye() {
      alert('Goodbye');
    }
  </script>
</body>
```

Notice that we call the `sayHello` and `sayGoodbye` JavaScript functions from the HTML in the `onclick` attribute of the button element. Special attributes like `onclick` automatically create event listeners for different DOM events that call the code contained in the attribute's value. The code specified by the attribute value can be a simple call to a function or any JavaScript code.

```html
<button onclick="let i=1;i++;console.log(i)">press me</button>
<!-- OUTPUT: 2 -->
```

### Local storage

📖 **Deeper dive reading**: [MDN LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

The browser's `localStorage` API provides the ability to persistently store and retrieve data (i.e. scores, usernames, etc.,) on a user's browser across user sessions and HTML page renderings. For example, your frontend JavaScript code could store a user's name on one HTML page, and then retrieve the name later when a different HTML page is loaded. The user's name will also be available in local storage the next time the same browser is used to access the same website.

In addition to persisting application data between page renderings, `localStorage` is also used as a cache for when data cannot be obtained from the server. For example, your frontend JavaScript could store the last high scores obtained from the service, and then display those scores in the future if the service is not available.

#### How to use LocalStorage

There are four main functions that can be used with localStorage.

| Function             | Meaning                                      |
| -------------------- | -------------------------------------------- |
| setItem(name, value) | Sets a named item's value into local storage |
| getItem(name)        | Gets a named item's value from local storage |
| removeItem(name)     | Removes a named item from local storage      |
| clear()              | Clears all items in local storage            |

A local storage value must be of type `string`, `number`, or `boolean`. If you want to store a JavaScript object or array, then you must first convert it to a JSON string with `JSON.stringify()` on insertion, and parse it back to JavaScript with `JSON.parse()` when retrieved.

#### Example

Open your startup website and run the following code in the browser's dev tools console window.

```js
let user = 'Alice';

let myObject = {
  name: 'Bob',
  info: {
    favoriteClass: 'CS 260',
    likesCS: true,
  },
};

let myArray = [1, 'One', true];

localStorage.setItem('user', user);
localStorage.setItem('object', JSON.stringify(myObject));
localStorage.setItem('array', JSON.stringify(myArray));

console.log(localStorage.getItem('user'));
console.log(JSON.parse(localStorage.getItem('object')));
console.log(JSON.parse(localStorage.getItem('array')));
```

**Output**

```sh
Alice
{name: 'Bob', info: {favoriteClass: 'CS 260', likesCS: true}
[1, 'One', true]
```

Notice that you are able to see the round trip journey of the local storage values in the console output. If you want to see what values are currently set for your application, then open the `Application` tab of the dev tools and select `Storage > Local Storage` and then your domain name. With the dev tools you can add, view, update, and delete any local storage values.


### JavaScript type and construct

📖 **Deeper dive reading**: [MDN Data types and structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)

#### Declaring variables

Variables are declared using either the `let` or `const` keyword. `let` allows you to change the value of the variable while `const` will cause an error if you attempt to change it.

```js
let x = 1;

const y = 2;
```

⚠ Originally JavaScript used the keyword `var` to define variables. This has been deprecated because it causes hard-to-detect errors in code related to the scope of the variable. You should avoid `var` and always declare your variables either with `let` or `const`.

#### Type

JavaScript defines several primitive types.

| Type        | Meaning                                                    |
| ----------- | ---------------------------------------------------------- |
| `Null`      | The type of a variable that has not been assigned a value. |
| `Undefined` | The type of a variable that has not been defined.          |
| `Boolean`   | true or false.                                             |
| `Number`    | A 64-bit signed number.                                    |
| `BigInt`    | A number of arbitrary magnitude.                           |
| `String`    | A textual sequence of characters.                          |
| `Symbol`    | A unique value.                                            |

Of these types Boolean, Number, and String are the types commonly thought of when creating variables. However, variables may refer to the Null or Undefined primitive. Because JavaScript does not enforce the declaration of a variable before you use it, it is entirely possible for a variable to have the type of Undefined.

In addition to the above primitives, JavaScript defines several object types. Some of the more commonly used objects include the following:

| Type       | Use                                                                                    | Example                  |
| ---------- | -------------------------------------------------------------------------------------- | ------------------------ |
| `Object`   | A collection of properties represented by name-value pairs. Values can be of any type. | `{a:3, b:'fish'}`        |
| `Function` | An object that has the ability to be called.                                           | `function a() {}`        |
| `Date`     | Calendar dates and times.                                                              | `new Date('1995-12-17')` |
| `Array`    | An ordered sequence of any type.                                                       | `[3, 'fish']`            |
| `Map`      | A collection of key-value pairs that support efficient lookups.                        | `new Map()`              |
| `JSON`     | A lightweight data-interchange format used to share information across programs.       | `{"a":3, "b":"fish"}`    |

#### Common operators

When dealing with a number variable, JavaScript supports standard mathematical operators like `+` (add), `-` (subtract), `*` (multiply), `/` (divide), and `===` (equality). For string variables, JavaScript supports `+` (concatenation) and `===` (equality).

#### Type conversions

JavaScript is a weakly typed language. That means that a variable always has a type, but the variable can change type when it is assigned a new value, or that types can be automatically converted based upon the context that they are used in. Sometimes the results of automatic conversions can be unexpected from programmers who are used to strongly typed languages. Consider the following examples.

```js
2 + '3';
// OUTPUT: '23'
2 * '3';
// OUTPUT: 6
[2] + [3];
// OUTPUT: '23'
true + null;
// OUTPUT: 1
true + undefined;
// OUTPUT: NaN
```

Getting unexpected results is especially common when dealing with the [equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness) operator.

```js
1 == '1';
// OUTPUT: true
null == undefined;
// OUTPUT: true
'' == false;
// OUTPUT: true
```

⚠ The unexpected results happen in JavaScript because it uses [complex rules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#strict_equality_using) for defining equality that depend upon the conversion of a type to a boolean value. You will sometimes hear this referred to as [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) and [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) evaluations. To remove this confusion, JavaScript introduced the strict equality (===) and inequality (!==) operators. The strict operators skip the type conversion when computing equality. This results in the following.

```js
1 === '1';
// OUTPUT: false
null === undefined;
// OUTPUT: false
'' === false;
// OUTPUT: false
```

Because strict equality is considered more intuitive, it is almost always preferred and should be used in your code.

Here is a fun example of JavaScript's type conversion. Execute the following in the browser's debugger console.

```js
('b' + 'a' + +'a' + 'a').toLowerCase();
```

#### Conditionals

JavaScript supports many common programming language conditional constructs. This includes `if`, `else`, and `if else`. Here are some examples.

```js
if (a === 1) {
  //...
} else if (b === 2) {
  //...
} else {
  //...
}
```

You can also use the ternary operator. This provides a compact `if else` representation.

```js
a === 1 ? console.log(1) : console.log('not 1');
```

You can use boolean operations in the expression to create complex predicates. Common boolean operators include `&&` (and), `||` (or), and `!` (not).

```js
if (true && (!false || true)) {
  //...
}
```

##### Loops

JavaScript supports many common programming language looping constructs. This includes `for`, `for in`, `for of`, `while`, `do while`, and `switch`. Here are some examples.

##### for

Note the introduction of the common post increment operation (`i++`) for adding one to a number.

```js
for (let i = 0; i < 2; i++) {
  console.log(i);
}
// OUTPUT: 0 1
```

##### do while

```js
let i = 0;
do {
  console.log(i);
  i++;
} while (i < 2);
// OUTPUT: 0 1
```

##### while

```js
let i = 0;
while (i < 2) {
  console.log(i);
  i++;
}
// OUTPUT: 0 1
```

##### for in

The `for in` statement iterates over an object's property names.

```js
const obj = { a: 1, b: 'fish' };
for (const name in obj) {
  console.log(name);
}
// OUTPUT: a
// OUTPUT: b
```

For arrays the object's name is the array index.

```js
const arr = ['a', 'b'];
for (const name in arr) {
  console.log(name);
}
// OUTPUT: 0
// OUTPUT: 1
```

##### for of

The `for of` statement iterates over an iterable's (Array, Map, Set, ...) property values.

```js
const arr = ['a', 'b'];
for (const val of arr) {
  console.log(val);
}
// OUTPUT: 'a'
// OUTPUT: 'b'
```

#### Break and continue

All of the looping constructs demonstrated above allow for either a `break` or `continue` statement to abort or advance the loop.

```js
let i = 0;
while (true) {
  console.log(i);
  if (i === 0) {
    i++;
    continue;
  } else {
    break;
  }
}
// OUTPUT: 0 1
```

## CSS Stuff

### CSS Animation

📖 **Deeper dive reading**: [MDN Animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

Using CSS to animate your components is an easy way to make your application feel alive and interactive. You create CSS animations using the `animation` properties and defining `keyframes` for what the element should look like at different times in the animation. Let's walk through an example.

We have a paragraph of centered text and we want it to zoom in until its size is 20% of the view height.

```css
p {
  text-align: center;
  font-size: 20vh;
}
```

To make this happen we specify that we are animating the selected elements by adding the `animation-name` property with a value of demo. This name refers to the name of the `keyframes` that we will specify in a minute. The keyframes tell what CSS properites should be applied at different key points in the animation sequence. We also add an `animation-duration` property in order to specify that the animation should last for three seconds.

```css
p {
  text-align: center;
  font-size: 20vh;

  animation-name: demo;
  animation-duration: 3s;
}
```

Now we are ready to create the keyframes. We don't have to define what happens at every millisecond of the animation. Instead we only need to define the key points, and CSS will generate a smooth transition to move from one keyframe to another. In our case we simply want to start with text that is invisible and have it zoom into the full final size. We can do this with two frames that are designated with the keywords `from` and `to`.

```css
@keyframes demo {
  from {
    font-size: 0vh;
  }

  to {
    font-size: 20vh;
  }
}
```

That's everything we need to do. However, let's make one more addition. It would look better if towards the end, the paragraph bounced out a little bigger than its final size. We can accommodate that by adding another key frame that happens 95 percent through the animation.

```css
@keyframes demo {
  from {
    font-size: 0vh;
  }

  95% {
    font-size: 21vh;
  }

  to {
    font-size: 20vh;
  }
}
```

![CSS animation](cssAnimation.gif)

You can see this animation working with this [CodePen](https://codepen.io/leesjensen/pen/LYrJEwX).

Animation is not just for pushing buttons or making text float around. Here is an example of [animating a watch](https://codepen.io/leesjensen/pen/MWBjXNq) using only HTML and CSS.

![Watch animation](cssAnimationWatch.gif)

CodePen has a lot of CSS animation examples that you can experiment with. Here is a simple one with [floating clouds](https://codepen.io/leesjensen/pen/wvXEaRq) that I found interesting. If you find an interesting one share it with us on Discord.

### CSS Flexbox

📖 **Deeper dive reading**:

- [MDN Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)
- [CSS Tricks Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Flexbox Froggy](https://flexboxfroggy.com/)

The `flex` display layout is useful when you want to partition your application into areas that responsively move around as the window resizes or the orientation changes. In order to demonstrate the power of flex we will build an application that has a header, footer, and a main content area that is split into two sections, with controls on the left and content on the right.

So we can visualize our design by quickly sketching it out.

![CSS App mock](cssAppMock.jpg)

Next we build our structural HTML to match our design.

```html
<body>
  <header>
    <h1>CSS flex &amp; media query</h1>
  </header>
  <main>
    <section>
      <h2>Controls</h2>
    </section>
    <section>
      <h2>Content</h2>
    </section>
  </main>
  <footer>
    <h2>Footer</h2>
  </footer>
</body>
```

Now we can use Flexbox to make it all come alive. We make the body element into a responsive flexbox by including the CSS `display` property with the value of `flex`. This tells the browser that all of the children of this element are to be displayed in a flex flow. We want our top level flexbox children to be column oriented and so we add the `flex-direction` property with a value of `column`. We then add some simple other declarations to zero out the margin and fill the entire viewport with our application frame.

```css
body {
  display: flex;
  flex-direction: column;
  margin: 0;
  height: 100vh;
}
```

To get the division of space for the flexbox children correct we add the following flex properties to each of the children.

- **header** - `flex: 0 80px` - Zero means it will not grow and 80px means it has a starting basis height of 80 pixels. This creates a fixed size box.
- **footer** - `flex: 0 30px` - Like the header it will not grow and has a height of 30 pixels.
- **main** - `flex: 1` - One means it will get one fractional unit of growth, and since it is the only child with a non-zero growth value, it will get all the remaining space. Main also gets some additional properties because we want it to also be a flexbox container for the controls and content area. So we set its display to be `flex` and specify the `flex-direction` to be row so that the children are oriented side by side.

```css
header {
  flex: 0 80px;
  background: hsl(223, 57%, 38%);
}

footer {
  flex: 0 30px;
  background: hsl(180, 10%, 10%);
}

main {
  flex: 1;
  display: flex;
  flex-direction: row;
}
```

Now we just need to add CSS to the control and content areas represented by the two child section elements. We want the controls to have 25% of the space and the content to have the remaining. So we set the `flex` property value to 1 and 3 respectively. That means that the controls get one unit of space and the content gets three units of space. No matter how we resize things this ratio will responsively remain.

```css
section:nth-child(1) {
  flex: 1;
  background-color: hsl(180, 10%, 80%);
}
section:nth-child(2) {
  flex: 3;
  background-color: white;
}
```

#### Media Query

That completes our original design, but we also want to handle small screen sizes. To do this, we add some media queries that drop the header and footer if the viewport gets too short, and orient the main sections as rows if it gets too narrow.

To support the narrow screen (portrait mode), we include a media query that detects when we are in portrait orientation and sets the `flex-direction` of the main element to be column instead of row. This causes the children to be stacked on top of each other instead of side by side.

To handle making our header and footer disappear when the screen is to short to display them, we use a media query that triggers when our viewport height has a maximum value of 700 pixels. When that is true we change the `display` property for both the header and the footer to `none` so that they will be hidden. When that happens the main element becomes the only child and since it has a flex value of 1, it takes over everything.

```css
@media (orientation: portrait) {
  main {
    flex-direction: column;
  }
}

@media (max-height: 700px) {
  header {
    display: none;
  }
  footer {
    display: none;
  }
}
```


You can experiment with this on [CodePen](https://codepen.io/leesjensen/pen/MWOVYpZ).


# FINAL

Here’s a quick reference table for the most common HTTP/HTTPS error codes:

## HTTP/HTTPS Error Codes Quick Reference

| Status Code | Name                     | Description                                                                 |
|-------------|--------------------------|-----------------------------------------------------------------------------|
| **1xx: Informational** |
| 100         | Continue                 | Request received, please continue.                                         |
| 101         | Switching Protocols      | Server is switching to the protocol requested by the client.               |
| **2xx: Success** |
| 200         | OK                       | Request was successful.                                                    |
| 201         | Created                  | Resource was successfully created.                                         |
| 202         | Accepted                 | Request has been accepted for processing but is not yet completed.         |
| 204         | No Content               | Request was successful but no content is returned.                         |
| **3xx: Redirection** |
| 301         | Moved Permanently        | Resource has permanently moved to a new URL.                               |
| 302         | Found                    | Resource is temporarily located at a different URL.                        |
| 304         | Not Modified             | Resource has not changed since the last request.                           |
| **4xx: Client Errors** |
| 400         | Bad Request              | Server could not understand the request due to invalid syntax.             |
| 401         | Unauthorized             | Authentication is required to access the resource.                         |
| 403         | Forbidden                | Client does not have permission to access the resource.                    |
| 404         | Not Found                | Resource could not be found.                                               |
| 405         | Method Not Allowed       | HTTP method is not allowed for the requested resource.                     |
| 408         | Request Timeout          | Client took too long to send a request.                                    |
| 409         | Conflict                 | Request could not be processed due to a conflict (e.g., resource state).   |
| 429         | Too Many Requests        | Client has sent too many requests in a given time frame.                   |
| **5xx: Server Errors** |
| 500         | Internal Server Error    | Server encountered an unexpected condition.                                |
| 501         | Not Implemented          | Server does not support the functionality required to fulfill the request. |
| 502         | Bad Gateway              | Server received an invalid response from the upstream server.              |
| 503         | Service Unavailable      | Server is currently unable to handle the request (e.g., maintenance).      |
| 504         | Gateway Timeout          | Server did not receive a timely response from the upstream server.         |


## React

# React Components and Hooks: Quick Reference Guide

## Table of Contents
1. [React Components](#react-components)
    - [Functional Components](#functional-components)
    - [Class Components](#class-components)
2. [React Hooks](#react-hooks)
    - [Basic Hooks](#basic-hooks)
    - [Additional Hooks](#additional-hooks)
    - [Custom Hooks](#custom-hooks)
3. [Component Lifecycle Methods vs Hooks](#component-lifecycle-methods-vs-hooks)
4. [Best Practices](#best-practices)

---

## React Components
React components are the building blocks of a React application. They can be **functional** or **class-based**.

### Functional Components
- **Definition**: JavaScript functions that return React elements (JSX).
- **Advantages**:
  - Simpler and more readable.
  - Support React Hooks for state and lifecycle management.

```jsx
function Greeting(props) {
    return <h1>Hello, {props.name}!</h1>;
}

export default Greeting;
```

### Class Components
- **Definition**: ES6 classes that extend `React.Component`.
- **Advantages**:
  - Can manage state and lifecycle methods (pre-Hooks).

```jsx
import React, { Component } from 'react';

class Greeting extends Component {
    render() {
        return <h1>Hello, {this.props.name}!</h1>;
    }
}

export default Greeting;
```

---

## React Hooks
Hooks are functions that allow you to "hook into" React's state and lifecycle features in functional components.

### Basic Hooks

#### `useState`
- **Purpose**: Manage state in a functional component.
- **Syntax**:

```jsx
const [state, setState] = useState(initialState);
```

- **Example**:

```jsx
import React, { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click Me</button>
        </div>
    );
}
```

#### `useEffect`
- **Purpose**: Perform side effects (e.g., data fetching, subscriptions).
- **Syntax**:

```jsx
useEffect(() => {
    // Effect logic
    return () => {
        // Cleanup logic (optional)
    };
}, [dependencies]);
```

- **Example**:

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(interval); // Cleanup
    }, []); // Empty dependency array -> runs once

    return <p>Elapsed Time: {seconds}s</p>;
}
```

#### `useContext`
- **Purpose**: Access values from a React context.
- **Syntax**:

```jsx
const value = useContext(MyContext);
```

- **Example**:

```jsx
const ThemeContext = React.createContext('light');

function ThemedButton() {
    const theme = useContext(ThemeContext);
    return <button className={theme}>Click Me</button>;
}
```

### Additional Hooks

#### `useReducer`
- **Purpose**: Manage state with a reducer function (useful for complex state logic).
- **Syntax**:

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- **Example**:

```jsx
function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        default:
            throw new Error();
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });

    return (
        <div>
            <p>{state.count}</p>
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        </div>
    );
}
```

#### `useRef`
- **Purpose**: Access and persist a mutable value that does not cause a re-render.
- **Syntax**:

```jsx
const ref = useRef(initialValue);
```

- **Example**:

```jsx
function FocusInput() {
    const inputRef = useRef();

    return (
        <div>
            <input ref={inputRef} type="text" />
            <button onClick={() => inputRef.current.focus()}>Focus Input</button>
        </div>
    );
}
```

#### `useMemo`
- **Purpose**: Memoize a value to optimize performance.
- **Syntax**:

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

#### `useCallback`
- **Purpose**: Memoize a callback function to avoid re-creation.
- **Syntax**:

```jsx
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

### Custom Hooks
- **Purpose**: Extract reusable logic into custom hooks.

```jsx
function useFetch(url) {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => setData(data));
    }, [url]);

    return data;
}

function App() {
    const data = useFetch('https://api.example.com/data');

    return <div>{data && <p>{JSON.stringify(data)}</p>}</div>;
}
```

---

## Component Lifecycle Methods vs Hooks
| Lifecycle Method          | Equivalent Hook                | Purpose                                  |
|---------------------------|---------------------------------|------------------------------------------|
| `componentDidMount`       | `useEffect` (empty deps)       | Run logic after component mounts.        |
| `componentDidUpdate`      | `useEffect` (with deps)        | Run logic when dependencies update.      |
| `componentWillUnmount`    | Cleanup function in `useEffect`| Cleanup logic when component unmounts.   |
| `shouldComponentUpdate`   | `React.memo`                  | Optimize re-renders.                     |

---

## Best Practices
1. **Use Functional Components**: Prefer functional components with hooks over class components.
2. **Keep Components Small**: Each component should have a single responsibility.
3. **Optimize Re-renders**: Use `React.memo`, `useMemo`, and `useCallback` wisely.
4. **Use Custom Hooks**: Extract complex logic into reusable custom hooks.
5. **Follow Dependency Rules**: Always declare dependencies in hooks to avoid unexpected behavior.
6. **Error Handling**: Add error boundaries or error handling logic.
7. **Testing**: Write tests for components and hooks using tools like Jest and React Testing Library.


Below is a comprehensive quick reference guide for the topics you requested. Each section is organized for clarity and ease of use during your test.

---

## **Node Web Service**

### **What is Node.js?**
- A JavaScript runtime built on Chrome's V8 engine.
- Ideal for building scalable, non-blocking I/O, and event-driven applications.
- Commonly used for:
  - Building web servers
  - APIs
  - Real-time applications

### **Key Concepts**
- **Single-threaded**: Node handles concurrent requests via an event loop.
- **Non-blocking I/O**: Operations don't block the execution of the program.

### **Core Modules**
- **HTTP**: To create HTTP servers.
  ```js
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.write('Hello World!');
    res.end();
  });
  server.listen(3000);
  ```

- **File System (fs)**: For file operations.
  ```js
  const fs = require('fs');
  fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
  ```

- **Path**: To handle and transform file paths.
  ```js
  const path = require('path');
  const dirPath = path.join(__dirname, 'files');
  ```

---

## **Express**

### **What is Express?**
- A minimal and flexible Node.js framework for building web applications and APIs.
- Simplifies the process of handling HTTP requests and responses.

### **Installation**
```bash
npm install express
```

### **Basic Setup**
```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### **Routing**
- Define endpoints to handle different HTTP methods and URLs.

```js
app.get('/users', (req, res) => res.send('GET request for users'));
app.post('/users', (req, res) => res.send('POST request for users'));
app.put('/users/:id', (req, res) => res.send(`PUT request for user ${req.params.id}`));
app.delete('/users/:id', (req, res) => res.send(`DELETE user ${req.params.id}`));
```

### **Middleware**
- Functions that execute during request-response lifecycle.
- Common uses:
  - Logging
  - Authentication
  - Request parsing
- Example:
  ```js
  app.use(express.json()); // Parse JSON bodies
  app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
  });
  ```

### **Serving Static Files**
```js
app.use(express.static('public'));
```

### **Error Handling**
```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
```

---

## **SOP (Same-Origin Policy) and CORS (Cross-Origin Resource Sharing)**

### **What is SOP?**
- Restricts how resources on a web page interact with resources from another origin.
- Same-origin: Protocol, domain, and port must match.

### **Why SOP?**
- Prevents malicious scripts from accessing sensitive data in other origins.

### **What is CORS?**
- A mechanism that allows resources on a server to be accessed by web pages from a different origin.
- Controlled via HTTP headers.

### **Setting CORS in Express**
- Install the `cors` package:
  ```bash
  npm install cors
  ```

- Example:
  ```js
  const cors = require('cors');
  app.use(cors());
  ```

- Configuring specific origins:
  ```js
  app.use(cors({
    origin: 'https://example.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  ```

### **CORS Headers**
- `Access-Control-Allow-Origin`: Specifies which origins can access the resource.
- `Access-Control-Allow-Methods`: HTTP methods allowed (e.g., `GET`, `POST`).
- `Access-Control-Allow-Headers`: Allowed headers (e.g., `Content-Type`).

---

## **WebSocket**

### **What is WebSocket?**
- A protocol enabling full-duplex communication between a client and server over a single TCP connection.
- Ideal for real-time applications like chat apps and live data feeds.

### **How WebSocket Works**
1. Client initiates a WebSocket handshake over HTTP/HTTPS.
2. Server responds with a 101 Switching Protocols status.
3. Persistent, bidirectional connection is established.

### **Setting Up WebSocket in Node.js**
- Using the `ws` package:
  ```bash
  npm install ws
  ```

- Basic Example:
  ```js
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      ws.send(`Echo: ${message}`);
    });

    ws.on('close', () => console.log('Client disconnected'));
  });
  ```

### **WebSocket Events**
- `connection`: Fired when a client connects.
- `message`: Fired when a message is received.
- `close`: Fired when the connection is closed.
- `error`: Fired on errors.

### **WebSocket Client Example**
- In JavaScript (Browser):
  ```js
  const ws = new WebSocket('ws://localhost:8080');
  
  ws.onopen = () => ws.send('Hello Server!');
  ws.onmessage = (event) => console.log(`Message from server: ${event.data}`);
  ws.onclose = () => console.log('Connection closed');
  ```

---

## **Quick Tips for Debugging**
- **Node.js**: Use `console.log` and the `debug` module for better logging.
- **Express**: Check route methods and middleware order if a request fails.
- **CORS**: Check browser console for CORS errors and adjust headers.
- **WebSocket**: Test connections with tools like `wscat`.

---

Feel free to expand or revise these notes as needed for your specific test requirements! Good luck!


Here's a detailed quick reference guide for **TypeScript** as part of JavaScript, formatted for clarity and quick access during your test.

---

## **TypeScript Quick Reference Guide**

### **What is TypeScript?**
- A superset of JavaScript that adds **static typing**, **interfaces**, and other features.
- Compiles down to plain JavaScript, making it compatible with all JavaScript environments.
- Improves code maintainability and catches errors during development.

### **Installation**
- Install TypeScript globally:
  ```bash
  npm install -g typescript
  ```
- Check the version:
  ```bash
  tsc --version
  ```

### **Compiling TypeScript**
- Compile a single file:
  ```bash
  tsc file.ts
  ```
- Watch mode for continuous compilation:
  ```bash
  tsc --watch
  ```

### **Basic Syntax**
#### **Variable Declarations**
- Type annotations:
  ```ts
  let isDone: boolean = false;
  let age: number = 25;
  let name: string = 'TypeScript';
  let list: number[] = [1, 2, 3];
  let tuple: [string, number] = ['Hello', 42];
  ```

- Union types:
  ```ts
  let id: number | string;
  id = 123;  // Valid
  id = "ABC"; // Valid
  ```

#### **Functions**
- With type annotations:
  ```ts
  function add(a: number, b: number): number {
    return a + b;
  }
  ```

- Optional and default parameters:
  ```ts
  function greet(name: string, age?: number): string {
    return `Hello ${name}, Age: ${age || 'Unknown'}`;
  }
  ```

- Arrow functions:
  ```ts
  const square = (x: number): number => x * x;
  ```

#### **Interfaces**
- Define the shape of objects:
  ```ts
  interface User {
    id: number;
    name: string;
    isAdmin?: boolean; // Optional property
  }

  const user: User = { id: 1, name: 'Alice' };
  ```

#### **Classes**
- With constructors, inheritance, and modifiers:
  ```ts
  class Animal {
    private name: string;
    constructor(name: string) {
      this.name = name;
    }
    makeSound(): void {
      console.log(`${this.name} makes a sound`);
    }
  }

  class Dog extends Animal {
    makeSound(): void {
      console.log('Woof!');
    }
  }

  const dog = new Dog('Buddy');
  dog.makeSound(); // Output: Woof!
  ```

- **Access Modifiers**:
  - `public`: Accessible everywhere (default).
  - `private`: Accessible only within the class.
  - `protected`: Accessible within the class and subclasses.

#### **Generics**
- Write reusable and type-safe code:
  ```ts
  function identity<T>(value: T): T {
    return value;
  }

  let output = identity<number>(42);  // Explicit type
  let anotherOutput = identity('Hello');  // Type inferred
  ```

#### **Enums**
- Define named constants:
  ```ts
  enum Direction {
    Up,
    Down,
    Left,
    Right,
  }

  let dir: Direction = Direction.Up;
  ```

#### **Type Aliases**
- Create custom types:
  ```ts
  type Point = { x: number; y: number };
  const p: Point = { x: 10, y: 20 };
  ```

---

### **Advanced TypeScript Features**

#### **Type Assertion**
- Tells the compiler the specific type of a value:
  ```ts
  let someValue: any = "Hello TypeScript";
  let strLength: number = (someValue as string).length;
  ```

#### **Type Guards**
- Narrow down types using conditional checks:
  ```ts
  function isString(value: any): value is string {
    return typeof value === 'string';
  }

  if (isString("Test")) {
    console.log("It's a string!");
  }
  ```

#### **Modules**
- Export and import code:
  ```ts
  // Export
  export const PI = 3.14;
  export function calculateArea(radius: number): number {
    return PI * radius * radius;
  }

  // Import
  import { PI, calculateArea } from './math';
  console.log(calculateArea(5));
  ```

#### **Decorators**
- Add metadata or modify behavior of classes and methods (requires `experimentalDecorators` in `tsconfig.json`):
  ```ts
  function Log(target: any, propertyName: string | Symbol) {
    console.log(`${String(propertyName)} was called`);
  }

  class Example {
    @Log
    greet() {
      console.log('Hello!');
    }
  }
  ```

---

### **TypeScript in Web Development**

#### **TypeScript with Node.js**
- Install Node types:
  ```bash
  npm install --save-dev @types/node
  ```
- Example:
  ```ts
  import * as fs from 'fs';

  fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
  ```

#### **TypeScript with Express**
- Install Express types:
  ```bash
  npm install --save-dev @types/express
  ```
- Example:
  ```ts
  import express, { Request, Response } from 'express';
  const app = express();

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello TypeScript with Express!');
  });

  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
  ```

#### **TypeScript with WebSocket**
- Install WebSocket types:
  ```bash
  npm install --save-dev @types/ws
  ```
- Example:
  ```ts
  import { WebSocketServer } from 'ws';

  const wss = new WebSocketServer({ port: 8080 });

  wss.on('connection', (ws) => {
    ws.on('message', (message: string) => {
      console.log(`Received: ${message}`);
      ws.send(`Echo: ${message}`);
    });
  });
  ```

---

### **Configuration with `tsconfig.json`**

#### **Basic Setup**
- Initialize TypeScript configuration:
  ```bash
  tsc --init
  ```
- Example `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "target": "es6",
      "module": "commonjs",
      "strict": true,
      "outDir": "./dist",
      "rootDir": "./src"
    }
  }
  ```

---

### **Common Errors and Debugging Tips**

1. **Error: Cannot find module or type declaration**
   - Install type declarations for libraries:
     ```bash
     npm install --save-dev @types/library-name
     ```

2. **Error: Type 'X' is not assignable to type 'Y'**
   - Check variable types and consider using type assertions or unions.

3. **Debugging**:
   - Use `console.log` for runtime debugging.
   - Integrate with IDEs (e.g., VSCode) for real-time type checks.

---

### **Benefits of Using TypeScript**
- Catch errors at compile-time, reducing runtime bugs.
- Autocomplete and IntelliSense in IDEs.
- Easier refactoring and better code maintainability.
- Better collaboration in teams due to clear types.

---

This guide should cover most of what you need for your test! Let me know if you'd like to add or expand on any sections. Good luck!



Here are detailed answers to the questions provided, along with short explanations and examples where applicable:

---
# Exam Review
### **1. What does the HTTP header `Content-Type` allow you to do?**
- **Answer**: The `Content-Type` header indicates the media type of the resource being sent in an HTTP request or response.
- **Explanation**:
  - It tells the client or server how to interpret the data in the request/response body.
  - Examples:
    - `Content-Type: application/json` means the body contains JSON data.
    - `Content-Type: text/html` means the body contains HTML.
  - **Example**:
    ```http
    POST /api/data HTTP/1.1
    Content-Type: application/json

    { "name": "John" }
    ```
    The server will parse the body as JSON.

---

### **2. What does a “Secure cookie”/“Http-only cookie”/“Same-site cookie” do?**
- **Answer**:
  - **Secure cookie**: Ensures the cookie is sent only over HTTPS.
  - **Http-only cookie**: Prevents the cookie from being accessed via JavaScript (for security).
  - **Same-site cookie**: Restricts cookies to be sent only with same-site requests or cross-site requests under specific conditions.
- **Example**:
  ```js
  document.cookie = "name=John; Secure; HttpOnly; SameSite=Strict";
  ```
- **Explanation**: These attributes enhance cookie security, protecting against cross-site scripting (XSS) and cross-site request forgery (CSRF).

---

### **3. Assuming the following Express middleware, what would be the `console.log` output for an HTTP GET request with a URL path of `/api/document`?**
- **Answer**: Middleware in Express processes requests sequentially. Example middleware:
  ```js
  app.use((req, res, next) => {
    console.log('Middleware 1');
    next();
  });
  app.get('/api/document', (req, res) => {
    console.log('Middleware 2');
    res.send('Document');
  });
  ```
  - **Output**:
    ```
    Middleware 1
    Middleware 2
    ```
- **Explanation**: The `use` middleware runs on every request, while the `get` middleware runs only for matching routes.

---

### **4. Given the following Express service code, what does the following front-end JavaScript that performs a fetch return?**
- **Example Backend**:
  ```js
  app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello World' });
  });
  ```
- **Frontend Fetch**:
  ```js
  fetch('/api/message')
    .then(res => res.json())
    .then(data => console.log(data));
  ```
- **Answer**: 
  ```json
  { "message": "Hello World" }
  ```
- **Explanation**: The fetch call retrieves the JSON response and logs it to the console.

---

### **5. Given the following MongoDB query, select all the matching documents `{name: "Mark"}`.**
- **Example Query**:
  ```js
  db.collection.find({ name: "Mark" });
  ```
- **Answer**: Returns all documents with `name` field equal to `"Mark"`.
- **Example Matching Document**:
  ```json
  { "_id": 1, "name": "Mark", "age": 30 }
  ```
- **Explanation**: MongoDB uses key-value matching to retrieve documents.

---

### **6. How should user passwords be stored?**
- **Answer**: Passwords should always be hashed using a secure hashing algorithm (e.g., bcrypt, Argon2) and never stored in plain text.
- **Example**:
  ```js
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('userPassword', 10);
  ```
- **Explanation**: Hashing makes passwords unreadable and resistant to brute-force attacks.

---

### **7. Assuming the following Node.js WebSocket code in the back end, and the following front-end WebSocket code, what will the front end log to the console?**
- **Backend**:
  ```js
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', (ws) => {
    ws.send('Welcome!');
    ws.on('message', (message) => {
      ws.send(`Echo: ${message}`);
    });
  });
  ```
- **Frontend**:
  ```js
  const ws = new WebSocket('ws://localhost:8080');
  ws.onmessage = (event) => console.log(event.data);
  ws.send('Hello Server!');
  ```
- **Answer**:
  ```
  Welcome!
  Echo: Hello Server!
  ```
- **Explanation**: The server sends a welcome message on connection and echoes back messages received.

---

### **8. What is the WebSocket protocol intended to provide?**
- **Answer**: WebSocket provides a full-duplex communication channel over a single TCP connection.
- **Explanation**: It allows real-time, bi-directional communication, ideal for applications like chat and live updates.

---

### **9. What do the following acronyms stand for?**
- **JSX**: JavaScript XML
- **JS**: JavaScript
- **AWS**: Amazon Web Services
- **NPM**: Node Package Manager
- **NVM**: Node Version Manager

---

### **10. Assuming an HTML document with a body element, what text content will the following React component generate?**
- **React Component**:
  ```js
  const Greeting = ({ name }) => <h1>Hello, {name}!</h1>;
  ReactDOM.render(<Greeting name="John" />, document.body);
  ```
- **Answer**: 
  ```
  Hello, John!
  ```
- **Explanation**: React renders the component into the `body` with the given `name` prop.

---

### **11. Given a set of React components that include each other, what will be generated?**
- **Answer**: React will generate the combined DOM output of all components based on their nesting and props.
- **Example**:
  ```js
  const Child = () => <p>Child Component</p>;
  const Parent = () => (
    <div>
      <h1>Parent Component</h1>
      <Child />
    </div>
  );
  ReactDOM.render(<Parent />, document.body);
  ```
  - **Output**:
    ```html
    <div>
      <h1>Parent Component</h1>
      <p>Child Component</p>
    </div>
    ```

---

### **12. What does a React component with `React.useState` do?**
- **Answer**: It manages state in a functional component.
- **Example**:
  ```js
  const Counter = () => {
    const [count, setCount] = React.useState(0);
    return (
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    );
  };
  ```
- **Explanation**: `useState` initializes `count` to `0` and updates it with `setCount`.

---

### **13. What are React Hooks used for?**
- **Answer**: Hooks allow functional components to manage state, lifecycle events, and side effects.
- **Explanation**: They replace class-based lifecycle methods like `componentDidMount`.

---

### **14. What does the `package.json` file do?**
- **Answer**: It defines metadata about a Node.js project, including dependencies, scripts, and project settings.

---

### **15. What does the `fetch` function do?**
- **Answer**: It performs network requests to retrieve resources from a URL.
- **Example**:
  ```js
  fetch('https://api.example.com/data')
    .then(res => res.json())
    .then(data => console.log(data));
  ```

---

### **16. What does Node.js do?**
- **Answer**: Node.js allows JavaScript to run on the server, enabling backend development.

---

### **17. What does pm2 do?**
- **Answer**: PM2 is a process manager for Node.js applications, ensuring they run continuously and restart on failure.

---

### **18. What does Vite do?**
- **Answer**: Vite is a build tool for modern web development that provides fast hot module replacement (HMR) and optimized builds.

--- 

Let me know if you'd like to expand on any of these!



































``` html
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />

    <title>Tetris Dual</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/index.jsx"></script>
  </body>
</html>
```


``` javascript
//index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

```

``` js
app.jsx

import React from 'react';
import { BrowserRouter, NavLink, Route, Routes, useParams } from 'react-router-dom';
import { Login } from './login/login';
import { GameSelect } from './play/gameSelect.jsx'
import { Play } from './play/play';
// import { WebsocketManager } from './play/websocketManager.js';
import { Leaderboard } from './leaderboard/leaderboard';
import { About } from './about/about';
import { AuthState } from './login/authState';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './app.css';

// const wsManager = new WebsocketManager();

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);
  const { gameId } = useParams();

  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header className="text-bg-dark">
          <nav className="navbar navbar-expand-sm navbar-dark bg-dark" aria-label="Navbar">
            <div className="container-fluid">
              <a className="navbar-brand" to='/'>Tetris Dual</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                  <li className='nav-item'>
                    <NavLink className='nav-link' to=''>
                      Login
                    </NavLink>
                  </li>
                  {authState === AuthState.Authenticated && (
                    <li className='nav-item'>
                      <NavLink className='nav-link' to='play'>
                        Play
                      </NavLink>
                    </li>
                  )}
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='leaderboard'>
                      Leaderboard
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='about'>
                      About
                    </NavLink>
                  </li>
                </ul>
                <form role="button">
                  <a href="https://github.com/tychart/startup" className="btn btn-secondary">GitHub</a>
                </form>
              </div>
            </div>
          </nav>
        </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
            exact
          />
          
          <Route path='/play' element={<GameSelect userName={userName}/>} />
          <Route path="/play/:gameId" element={<Play userName={userName}/>} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;
```

``` css
// app.css

.body {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  
}



main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: #1f1f1f;
  color: white;
  background-image: url('/TetrisBackgroud1.svg');
  background-size: cover;
  background-attachment: fixed;
}

menu {
  flex: 1;
  display: flex;
  /*  overwrite Bootstrap so the menu does not wrap */
  flex-direction: row !important;
  list-style: none;
}

@media (max-height: 600px) {
  header {
    display: none;
  }
  footer {
    display: none;
  }
}
```

``` js
// login.jsx

import React from 'react';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, onAuthChange }) {
  return (
    <main className='container-fluid bg-secondary text-center'>
      <div>
        {authState !== AuthState.Unknown && <h1>Welcome to Tetris Dual</h1>}
        {authState === AuthState.Authenticated && (
          <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
        )}
        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
              onAuthChange(loginUserName, AuthState.Authenticated);
            }}
          />
        )}
      </div>
    </main>
  );
}

```

``` js
// unauthenticated.js

import React from 'react';

import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ userName: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <>
      <div>
        <div className='input-group mb-3'>
          <span className='input-group-text'>👥</span>
          <input className='form-control' type='text' value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='username' />
        </div>
        <div className='input-group mb-3'>
          <span className='input-group-text'>🔒</span>
          <input className='form-control' type='password' onChange={(e) => setPassword(e.target.value)} placeholder='password' />
        </div>
        <Button variant='primary' className='mx-1' onClick={() => loginUser()} disabled={!userName || !password}>
          Login
        </Button>
        <Button variant='secondary' className='mx-1' onClick={() => createUser()} disabled={!userName || !password}>
          Create
        </Button>
      </div>

      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </>
  );
}
```

``` js
// authenticated.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        props.onLogout();
      });
  }

  return (
    <div>
      <div className='playerName'>{props.userName}</div>
      <Button variant='primary' className='mx-1' onClick={() => navigate('/play')}>
        Play
      </Button>
      <Button variant='secondary' className='mx-1' onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
}
```





``` js
// play.jsx

import React, { useState, useEffect, useRef } from 'react';
import { TetrisGame } from './tetrisGame';
import { WebSocketManager } from './webSocketManager';
import { useParams } from 'react-router-dom';

import './play.css'

export function Play({ userName }) {
  const { gameId } = useParams();
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const canvasRef = useRef(null);
  const tetrisGameRef = useRef(null);
  // const [remoteState, setRemoteState] = useState(null);
  const [webSocketManager, setWebSocketManager] = useState(null);
  
  useEffect(() => {
    // Create a new instance of WebSocketManager and open the connection
    const wsManager = new WebSocketManager(gameId, userName);
    wsManager.connect();


    console.log("sent join request ", gameId, userName)
    wsManager.joinGame(gameId, userName);

    // Set the WebSocketManager instance to state
    setWebSocketManager(wsManager);

    // Handle incoming websockets updates
    const webSocketEventHandler = (event) => {
      switch (event.type) {
        case 'gameUpdate':

          console.log('gameUpdate event received!');
          console.log(event)

          if (canvasRef.current && event.state) {
            drawOpponentBoard(event.state);
          }

          break;

        case 'gameStart':
          console.log('Game start event received!');
          if (tetrisGameRef.current) {
            tetrisGameRef.current.startGame(); // Trigger startGame in TetrisGame
          }
          break;

        default:
          break;
      }
    };

    // Add a handler to log all incoming messages
    wsManager.addHandler(webSocketEventHandler);

    // wsManager.addHandler(handleEvent);

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      wsManager.removeHandler(webSocketEventHandler);
      wsManager.disconnectWebSocket();
    };
  }, [gameId, userName]);

  const sendGameUpdate = (localState) => {
    if (webSocketManager) {
      webSocketManager.sendGameUpdate(localState);
    }
  };

  const drawOpponentBoard = (boardString) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const BLOCK_SIZE = 30;
    const BOARD_BLOCK_WIDTH = 10;
    const BOARD_BLOCK_HEIGHT = 20;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const charArray = boardString.split('')
    
    let index = 0;
    for (let i = 0; i < BOARD_BLOCK_HEIGHT; i++) {
      for (let j = 0; j < BOARD_BLOCK_WIDTH; j++) {
      
        if (charArray[index] !== '0') {
          drawBlock(context, j, i, BLOCK_SIZE, parseColor(charArray[index]))
        }
        index++;
      
      }
    }
    
  };

  const drawBlock = (ctx, x, y, size, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(
      x * size, 
      y * size, 
      size, 
      size
    );
    ctx.strokeStyle = "black"; // outline color
    ctx.strokeRect(
      x * size, 
      y * size, 
      size, 
      size
    );
  }

  const parseColor = (inChar) => {
    switch (inChar) {
      case 'o':
        return 'orange';
      case 'b':
        return 'blue';
      case 'r':
        return 'red';      
      case 'g':
        return 'green';
      case 'c':
        return 'cyan';
      case 'p':
        return 'purple'; 
      case 'y':
        return 'yellow';
      default:
        return 'blue';
    };
  }

  return (
    <main
      className="bg-secondary"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="game-container">
        <div className="local-game">
          <h2>Your Game</h2>
          <TetrisGame ref={tetrisGameRef} userName={userName} onStateChange={sendGameUpdate} webSocketManager={webSocketManager} />
        </div>
        <div></div>
        <div className="remote-game">
          <h2>Opponent's Game</h2>
          <canvas id="opponentCanvas" ref={canvasRef} width="300" height="600"></canvas>
        </div>
      </div>
    </main>
  );
}
```

``` js
// gameSelect.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverFacade } from './serverFacade.js';
import './gameSelect.css'; // Import the custom CSS file

export function GameSelect(props) {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [currUser, setCurrUser] = useState(props.userName);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // console.log(currUser)
        const games = await serverFacade.getGames();
        setGames(games);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const createGame = async () => {
    try {
      const gameName = prompt('Enter game name:');
      if (gameName) {
        const newGame = await serverFacade.createGame(gameName);
        setGames([...games, newGame]);
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const joinGame = async () => {
    if (selectedGameId) {
      try {
        await serverFacade.joinGame(selectedGameId, currUser);
        navigate(`/play/${selectedGameId}`);
      } catch (error) {
        console.error('Error joining game:', error);
      }
    }
  };

  return (
    <main className="game-select">
      <h1>Select or Create a Game</h1>
      <button onClick={createGame} className="btn btn-primary">
        Create New Game
      </button>
      <h2>Available Games</h2>
      <ul className="game-list">
        {games.map((game) => (
          <li key={game.id} className="list-group-item game-item">
            <button
              onClick={() => setSelectedGameId(game.id)}
              className={`${selectedGameId === game.id ? 'btn-selected' : 'btn-outline-light'}`}
            >
              Join Game {game.id}: {game.gameName}
            </button>
          </li>
        ))}
      </ul>
      {selectedGameId && (
        <button onClick={joinGame} className="btn btn-success">
          Join Selected Game
        </button>
      )}
    </main>
  );
}
```

``` js
// play.jsx

import React, { useState, useEffect, useRef } from 'react';
import { TetrisGame } from './tetrisGame';
import { WebSocketManager } from './webSocketManager';
import { useParams } from 'react-router-dom';

import './play.css'

export function Play({ userName }) {
  const { gameId } = useParams();
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const canvasRef = useRef(null);
  const tetrisGameRef = useRef(null);
  // const [remoteState, setRemoteState] = useState(null);
  const [webSocketManager, setWebSocketManager] = useState(null);
  
  useEffect(() => {
    // Create a new instance of WebSocketManager and open the connection
    const wsManager = new WebSocketManager(gameId, userName);
    wsManager.connect();


    console.log("sent join request ", gameId, userName)
    wsManager.joinGame(gameId, userName);

    // Set the WebSocketManager instance to state
    setWebSocketManager(wsManager);

    // Handle incoming websockets updates
    const webSocketEventHandler = (event) => {
      switch (event.type) {
        case 'gameUpdate':

          console.log('gameUpdate event received!');
          console.log(event)

          if (canvasRef.current && event.state) {
            drawOpponentBoard(event.state);
          }

          break;

        case 'gameStart':
          console.log('Game start event received!');
          if (tetrisGameRef.current) {
            tetrisGameRef.current.startGame(); // Trigger startGame in TetrisGame
          }
          break;

        default:
          break;
      }
    };

    // Add a handler to log all incoming messages
    wsManager.addHandler(webSocketEventHandler);

    // wsManager.addHandler(handleEvent);

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      wsManager.removeHandler(webSocketEventHandler);
      wsManager.disconnectWebSocket();
    };
  }, [gameId, userName]);

  const sendGameUpdate = (localState) => {
    if (webSocketManager) {
      webSocketManager.sendGameUpdate(localState);
    }
  };

  const drawOpponentBoard = (boardString) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const BLOCK_SIZE = 30;
    const BOARD_BLOCK_WIDTH = 10;
    const BOARD_BLOCK_HEIGHT = 20;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const charArray = boardString.split('')
    
    let index = 0;
    for (let i = 0; i < BOARD_BLOCK_HEIGHT; i++) {
      for (let j = 0; j < BOARD_BLOCK_WIDTH; j++) {
      
        if (charArray[index] !== '0') {
          drawBlock(context, j, i, BLOCK_SIZE, parseColor(charArray[index]))
        }
        index++;
      
      }
    }
    
  };

  const drawBlock = (ctx, x, y, size, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(
      x * size, 
      y * size, 
      size, 
      size
    );
    ctx.strokeStyle = "black"; // outline color
    ctx.strokeRect(
      x * size, 
      y * size, 
      size, 
      size
    );
  }

  const parseColor = (inChar) => {
    switch (inChar) {
      case 'o':
        return 'orange';
      case 'b':
        return 'blue';
      case 'r':
        return 'red';      
      case 'g':
        return 'green';
      case 'c':
        return 'cyan';
      case 'p':
        return 'purple'; 
      case 'y':
        return 'yellow';
      default:
        return 'blue';
    };
  }

  return (
    <main
      className="bg-secondary"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <div className="game-container">
        <div className="local-game">
          <h2>Your Game</h2>
          <TetrisGame ref={tetrisGameRef} userName={userName} onStateChange={sendGameUpdate} webSocketManager={webSocketManager} />
        </div>
        <div></div>
        <div className="remote-game">
          <h2>Opponent's Game</h2>
          <canvas id="opponentCanvas" ref={canvasRef} width="300" height="600"></canvas>
        </div>
      </div>
    </main>
  );
}
```

``` js
// tetrisGame.jsx

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { OrangeRicky } from './classes/orange-ricky.js';
import { BlueRicky } from './classes/blue-ricky.js';
import { ClevelandZ } from './classes/cleveland-z.js';
import { RhodeIslandZ } from './classes/rhode-island-z.js';
import { Hero } from './classes/hero.js';
import { Teewee } from './classes/teewee.js';
import { Smashboy } from './classes/smashboy.js';

import './tetris-game.css';



export const TetrisGame = forwardRef((props, ref) => {

  const userName = props.userName;
  const webSocketManager = props.webSocketManager;
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const boardWidth = 300; // Width of the game board
  const boardHeight = 600; // Height of the game board
  const blockSize = 30; // Size of each Tetris block
  const startingX = 4;
  const startingY = 2;

  const gameIntervalRef = useRef(null); // Ref to store interval ID
  const currentBlockRef = useRef(getRandNewBlock());
  const lockDelayRef = useRef(Date.now());
  const gameTickRef = useRef(1000); // One second
  const animationSpeedRef = useRef(gameTickRef.current / 50);
  const boardRef = useRef(Array.from({ length: 20 }, () => Array(10).fill(0)));

  const [currentBlock, setCurrentBlock] = useState(currentBlockRef.current);
  const [gameRunning, setGameRunning] = useState(false); // New state to track if the game is running
  const [showGameOver, setShowGameOver] = useState(false);

  // Expose methods to the parent component
  useImperativeHandle(ref, () => ({
    startGame,
  }));


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    contextRef.current = ctx;
    // draw();

    // Start the game loop only if the game is running
    if (gameRunning) {
      setGameLoop();
      window.addEventListener('keydown', handleKeyDown); // Add keydown event listener
    }

    // Cleanup on unmount
    return () => {
      clearInterval(gameIntervalRef.current);
      window.removeEventListener('keydown', handleKeyDown); // Clean up event listener
    };
  }, [gameRunning]); // Depend on gameRunning

  const onGameTick = () => {
    if (gameRunning) {
      fallBlockSoft(); // Move block and check collision
      scanBoard(); // Check for completed lines
      updateCanvas(); 
      sendScreen();
    }
  };

  // Handle logic for if a collision happens and if game is over
  const fallBlockSoft = () => {

    // Calculates the time for the tetris move reset lock delay 
    // (slide on the floor without freezing)
    const currentTime = Date.now();
    const canLock = currentTime - lockDelayRef.current > gameTickRef.current;

    let movedBlock = currentBlockRef.current.move(boardRef.current, 0, 1, canLock);
      if (!movedBlock) {
        if (
          currentBlockRef.current.originX === startingX && 
          currentBlockRef.current.originY === startingY
        ) {
          setGameRunning(false); // Game over!
          gameOver();
          return false;
        }
        // currentBlockRef.current = getRandNewBlockDebug();
        currentBlockRef.current = getRandNewBlock();
        setCurrentBlock(currentBlockRef.current); // Update React state for rendering purposes only
        speedUpGame();
      }
    return true;
  }

  const fallBlockHard = () => {
    while (currentBlockRef.current.move(boardRef.current, 0, 1, true)) {}

    // Hardcode the time so that the freeze will not happen after fallblockhard is called
    lockDelayRef.current = Date.now() - 10000; 

    onGameTick();
  }

  const scanBoard = async () => {
    let deletedRow = false;

    for (let row = 0; row < boardRef.current.length; row++) {
      let count = 0;
      for (let col = 0; col < boardRef.current[row].length; col++) {
        if (boardRef.current[row][col] !== 0) {
          count++;
        }
      }
      if (count === boardRef.current[row].length) {
        await clearRow(row);
        deletedRow = true;
      }
    }

    if (deletedRow) {
      await niceBoardUpdate();
    }
  }

  const clearRow = async (rowIndex) => {
    // Start the row clearing animation, but don't proceed until it's finished.
    await clearRowAnimation(rowIndex); // Ensure this completes before continuing.

    // Step 2: Move every row down one row
    for (let row = rowIndex; row > 0; row--) {
      boardRef.current[row] = [...boardRef.current[row - 1]]; // Create a new array for the current row
    }

    // Step 3: Zero the top row of the board.
    for (let col = 0; col < boardRef.current[0].length; col++) {
      boardRef.current[0][col] = 0;
    }

  }

  const clearRowAnimation = (rowIndex) => {
    return new Promise((resolve) => {
      // Animation loop for clearing the row
      let col = 0;
      
      const clearNextBlock = () => {
        if (col < boardRef.current[rowIndex].length) {
          boardRef.current[rowIndex][col] = 0; // Clear the block (e.g., fade out or remove)
  
          // Update the canvas for each animation frame
          updateCanvas();
  
          col++;
          setTimeout(clearNextBlock, animationSpeedRef.current); // Continue clearing the next block after a short delay
        } else {
          resolve(); // Once all blocks are cleared, resolve the promise to continue the row shift
        }
      };
      
      // Start the animation
      clearNextBlock();
    });
  };

  // Goes through and makes sure the subblock's internal 
  // corridinates match where it is on the board grid
  const niceBoardUpdate = async () => {
    for (let row = boardRef.current.length - 1; row >= 0; row--) {
      for (let block = 0; block < boardRef.current[row].length; block++) {
        if (boardRef.current[row][block] !== 0) {
          boardRef.current[row][block].moveExact(block, row);
          updateCanvas();
          await delay(animationSpeedRef.current);
        }
      }
    }
  }

  // Helper function to create a non-blocking delay
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const updateCanvas = () => {
    const ctx = contextRef.current; // Access ctx from ref
    ctx.clearRect(0, 0, boardWidth, boardHeight); // Clear the canvas
    currentBlockRef.current.draw(ctx);
    drawBoard();
  };

  const drawBoard = () => {
    const ctx = contextRef.current; // Access ctx from ref
    for (let i = 0; i < boardRef.current.length; i++) {
      for (let j = 0; j < boardRef.current[i].length; j++) {
        if (boardRef.current[i][j] !== 0) {
          boardRef.current[i][j].draw(ctx);
        }
      }
    }
  }

  function getRandNewBlock() {
    // Step 1: Generate a random number between 0 and 6 (for 7 possible outcomes)
    const randomChoice = Math.floor(Math.random() * 7);

    // Step 2: Use a switch statement to return a new block based on the random choice
    switch (randomChoice) {
      case 0:
        return new OrangeRicky(startingX, startingY, 'orange', blockSize);
      case 1:
        return new BlueRicky(startingX, startingY, 'blue', blockSize);
      case 2:
        return new ClevelandZ(startingX, startingY, 'red', blockSize);
      case 3:
        return new RhodeIslandZ(startingX, startingY, 'green', blockSize);
      case 4:
        return new Hero(startingX, startingY, 'cyan', blockSize);
      case 5:
        return new Teewee(startingX, startingY, 'purple', blockSize);
      case 6:
        return new Smashboy(startingX, startingY, 'yellow', blockSize);
      default:
        throw new Error("Unexpected choice in getRandNewBlock()");
    }
  }



  const speedUpGame = () => {
    gameTickRef.current = gameTickRef.current * 0.98;
    animationSpeedRef.current = gameTickRef.current / 50;
    clearInterval(gameIntervalRef.current);
    setGameLoop();
  }
  
  const setGameLoop = () => {
    gameIntervalRef.current = setInterval(onGameTick, gameTickRef.current);
  }

  const gameOver = () => {
    saveScore(Math.round(gameTickRef.current * 100) / 100);
    setShowGameOver(true); // Show the Game Over popup
  };

  async function saveScore(score) {
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    await fetch('/api/score', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newScore),
    });

    // Let other players know the game has concluded
    webSocketManager.sendGameOver(score);
  }


  // The `GameOverPopup` component
  const GameOverPopup = () => (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h1>Game Over</h1>
        <p>Score: {Math.round(gameTickRef.current * 100) / 100}</p>
        <p>Thanks for playing!</p>
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    </div>
  );
  

  const startGame = () => {
    if (!gameRunning) {
      // setCurrentBlock(new Subblock(2, 5, "red", blockSize)); // Reset the block
      setGameRunning(true); // Set game running state to true
      updateCanvas();
    }
  };

  const resetLockDelay = async () => {
    lockDelayRef.current = Date.now();
  }


  const sendScreen = () => {
    const strArray = new Array(200); // Pre-allocate array for performance
    
    let blockMap = new Map();
    const rowNum = 20;
    const colNum = 10;
    

    for (let subblock of currentBlockRef.current.block) {
        blockMap.set(subblock.y * colNum + subblock.x, subblock.color)
    }


    // sendString = "";
    let index = 0;
    for (let i = 0; i < boardRef.current.length; i++) {
      for (let j = 0; j < boardRef.current[i].length; j++) {
        if (blockMap.get(index)) {
          strArray[index++] = blockMap.get(i * colNum + j)[0];
        } else {
          if (boardRef.current[i][j] == 0) {
            strArray[index++] = 0;
          } else {
            strArray[index++] = boardRef.current[i][j].color[0];
          }
        }
      }
    }

    // Join the array into a string in one operation
    const sendString = strArray.join('');
    console.log(sendString);
    webSocketManager.sendGameUpdate(sendString);
  }

  const handleKeyDown = (event) => {
    if (!gameRunning) return; // Don't respond if the game isn't running

    switch (event.key) {
      case 'ArrowLeft':
        // console.log('Move left');
        currentBlockRef.current.move(boardRef.current, -1, 0); // Move left
        resetLockDelay();
        break;
      case 'ArrowRight':
        // console.log('Move right');
        currentBlockRef.current.move(boardRef.current, 1, 0); // Move right
        resetLockDelay();
        break;
      case 'ArrowUp':
        event.preventDefault(); // To prevent scrolling
        currentBlockRef.current.rotateClockwise(boardRef.current);
        resetLockDelay();
        break;
      case 'ArrowDown':
        event.preventDefault(); // To prevent scrolling
        // console.log('Move down');
        currentBlockRef.current.move(boardRef.current, 0, 1); // Move down faster
        break;
      case ' ':
        event.preventDefault();  // Prevent default space behavior
        fallBlockHard();
        break;
      default:
        break;
    }
    updateCanvas();
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={boardWidth}
        height={boardHeight}
        style={{ backgroundColor: 'grey', border: '2px solid black' }}
      />
      {/* <button onClick={startGame}>Start Game</button> */}
      {showGameOver && <GameOverPopup />}
    </div>
  );
});

export default TetrisGame;
```

``` js
// block.js

import { Subblock } from './subblock.js';

export class Block {
    constructor(x, y, color, size) {
        // this.id = id;
        this.originX = x;           // x position on the grid
        this.originY = y;           // y position on the grid
        this.color = color;         // color of the block
        this.size = size;           // size of the block
        this.block = [];           // Initialize the block array
        this.positions = [];
        
        this.generateBlock();
        
        
    }

    generateBlock() { // Orange ricky by defaults
        // Populate the block array with Subblock instances
        this.block.push(new Subblock(this.originX - 2, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX - 1, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX + 1, this.originY, this.color, this.size));
    }

    draw(ctx) {
        for (let i = 0; i < this.block.length; i++) {
            this.block[i].draw(ctx);
        }
    }

    move(board, dx, dy, freezeEnabled = true) {
        let collision = false;

        // Only evaluates side collisions if moving to the side
        if (dx !== 0) {
            // Don't move, but don't freeze and generate a new block
            if (this.checkBlockSideCollision(board, dx)) {return true;}
        }

        collision = this.checkBlockCollision(board, dx, dy);

        if (collision) {
            if (freezeEnabled) { // This is for the move lock reset delay
                this.freezeBlock(board);
                return false;
            } else {
                return true;
            }
        }

        // Move the block if no collisions occur
        for (let i = 0; i < this.block.length; i++) {
            this.block[i].move(board, dx, dy);
        }
        this.originX += dx;
        this.originY += dy;
        return true;
    }

    freezeBlock(board) {
        for (let i = 0; i < this.block.length; i++) {
            this.block[i].freezeSubblock(board);
        }
    }

    checkBlockSideCollision(board, dx, dy) {
        for (let i = 0; i < this.block.length; i++) {
            if (this.block[i].checkSideCollision(board, dx)) {
                return true; // Don't move, but don't freeze and generate a new block
            }
        }
    }

    checkBlockCollision(board, dx, dy) {
        for (let i = 0; i < this.block.length; i++) {
            if (this.block[i].checkBlockCollision(board, dx, dy)) {
                return true;
            }
        }
        return false;
    }
    
    // Method intended to be implemented by subclasses
    rotateClockwise(board) {
        let newBlock = this.copyBlock();
        let successes = [];
    
        successes = this.positions[this.currPos](board, newBlock, successes);

        if (successes.includes(false)) {
            return false;
        }

        this.block = newBlock;
        this.incrimentCurrPos();
        
        return true;
    }

    incrimentCurrPos() {
        if (this.currPos === this.positions.length -1) {
            this.currPos = 0;
        } else {
            this.currPos++;
        }
    }

    copyBlock() {
        let newBlock = [];
        for (let subblock of this.block) {
            newBlock.push(subblock.copy());
        }
        return newBlock;
    }

    checkSuccess(successes) {
        for (let success of successes) {
            if (!success) return false;
        }
    }
    
    // Method intended to be implemented by subclasses
    rotateCounterClockwise() {
        throw new Error("Method 'rotateCounterClockwise()' must be implemented in subclass");
    }


}
```

``` js
// subblock.js

export class Subblock {
    constructor(x, y, color, size) {
        // this.id = id;
        this.x = x;           // x position on the grid
        this.y = y;           // y position on the grid
        this.color = color;   // color of the block
        this.size = size;     // size of the block
    }

    // Copy constructor
    copy() {
        return new Subblock(this.x, this.y, this.color, this.size);
    }

    // Method to draw the block on the canvas
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x * this.size, 
            this.y * this.size, 
            this.size, 
            this.size);
        ctx.strokeStyle = "black"; // outline color
        ctx.strokeRect(
            this.x * this.size, 
            this.y * this.size, 
            this.size, 
            this.size
        );

    }

    // Method to move the block (e.g., move down or to the side)
    move(board, dx, dy) {

        if (
            !this.checkBlockCollision(board, dx, dy) &&
            !this.checkSideCollision(board, dx)
        ) {
            this.x += dx;
            this.y += dy;
            return true;
        }

        return false;
        
    }

    moveExact(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    checkSideCollision(board, dx) {
        let newX = this.x + dx;

        if (newX < 0 || newX >= 10) {
            return true; // out of bounds
        }

        // Check collision with other blocks
        if (
            board[this.y][newX] !== 0 &&
            board[this.y][newX] !== this
        ) {
            return true;
        }
        return false;

    }

    checkBlockCollision(board, dx, dy) {
        let newX = this.x + dx;
        let newY = this.y + dy;
        
        return this.checkBlockCollisionExact(board, newX, newY);
    }

    checkBlockCollisionExact(board, newX, newY) {
        if (newY >= 20) { // hit the bottom
            return true;
        }

        // Check collision with other blocks
        if (board[newY][newX] != 0) {
            return true;
        }
        return false;
    }

    freezeSubblock(board) {
        board[this.y][this.x] = this;
    }

    // Optional: Add methods for rotating, changing color, etc.
}
```

``` js
// orange-ricky.js

import { Subblock } from './subblock.js';
import { Block  } from './block.js';

export class OrangeRicky extends Block {
    constructor(x, y, color, size) {
        super(x, y, color, size); // Initializes x, y, color, and size in the Block superclass

        this.block = [];
        this.positions = [];
        this.currPos = 0;

        this.initializePositions();
        this.generateBlock();
    }

    generateBlock() {
        this.block.push(new Subblock(this.originX - 1, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX + 1, this.originY, this.color, this.size));
        this.block.push(new Subblock(this.originX + 1, this.originY - 1, this.color, this.size));
    }


    initializePositions() {
        this.positions = [
            (board, newBlock, successes) => { // To Position 1
                successes.push(newBlock[0].move(board, 1, -1));
                successes.push(newBlock[2].move(board, -1, 1));
                successes.push(newBlock[3].move(board, 0, 2));
                return successes;
            }, 
            (board, newBlock, successes) => { // To Position 2
                successes.push(newBlock[0].move(board, 1, 1));
                successes.push(newBlock[2].move(board, -1, -1));
                successes.push(newBlock[3].move(board, -2, 0));
                return successes;
            },
            (board, newBlock, successes) => { // To Position 3
                successes.push(newBlock[0].move(board, -1, 1));
                successes.push(newBlock[2].move(board, 1, -1));
                successes.push(newBlock[3].move(board, 0, -2));
                return successes;
            },
            (board, newBlock, successes) => { // To Position 0
                successes.push(newBlock[0].move(board, -1, -1));
                successes.push(newBlock[2].move(board, 1, 1));
                successes.push(newBlock[3].move(board, 2, 0));
                return successes;
            }
        ]
    }





}

```

``` js 
// leaderboard.jsx

import React from 'react';

import './leaderboard.css';

export function Leaderboard() {
  const [scores, setScores] = React.useState([]);

  // Demonstrates calling a service asynchronously so that
  // React can properly update state objects with the results.
  React.useEffect(() => {
    fetch('/api/scores')
      .then((response) => response.json())
      .then((scores) => {
        setScores(scores);
      });
  }, []);

  // Demonstrates rendering an array with React
  const scoreRows = [];
  if (scores.length) {
    for (const [i, score] of scores.entries()) {
      scoreRows.push(
        <tr key={i}>
          <td>{i}</td>
          <td>{score.name.split('@')[0]}</td>
          <td>{score.score}</td>
          <td>{score.date}</td>
        </tr>
      );
    }
  } else {
    scoreRows.push(
      <tr key='0'>
        <td colSpan='4'>Be the first to score</td>
      </tr>
    );
  }

  return (
    <main className='container-fluid bg-secondary text-center'>
      <table className='table table-warning table-striped-columns'>
        <thead className='table-dark'>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody id='scores'>{scoreRows}</tbody>
      </table>
    </main>
  );
}
```

``` css
// leaderboard.css

td {
  max-width: 40vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

## Back End

``` js
// index.js

const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');
const { webSocketHandler } = require('./websocketHandler.js'); // Import the peerProxy function
const gameManager = require('./gameManager.js'); // Import the gameManager



const authCookieName = 'token';


// Middleware to log every request
app.use((req, res, next) => {
  // console.log("my middleware");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// The service port may be set on the command line
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// console.log("Test");

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// // Middleware to log every request
// apiRouter.use((req, res, next) => {
//   console.log("my middleware");
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}`);
//   next();
// });

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.userName)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.userName, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  // console.log("Got in here!!!!!!!!")
  // console.log("With these creds: ", req);
  const user = await DB.getUser(req.body.userName);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      // console.log("allowed");
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});


// Pass through background to avoid cors
apiRouter.get('/background', async (req, res) => {

  console.log('Backend route /background called'); // Confirm route is hit

  try {
    const response = await fetch(
      'https://wallhaven.cc/api/v1/search?&sorting=random&purity=100&categories=111&colors=000000'
    );
    const text = await response.text(); // Fetch as plain text first
    console.log('Raw response from Wallhaven:', text); // Log response to debug
    const data = JSON.parse(text); // Try parsing it
    res.json(data); // Send parsed JSON to the frontend
  } catch (error) {
    console.error('Error in backend:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Wallhaven' });
  }
});

// secureApiRouter verifies credentials for endpoints
const secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  const authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// GetScores
secureApiRouter.get('/scores', async (req, res) => {
  const scores = await DB.getHighScores();
  res.send(scores);
});

// SubmitScore
secureApiRouter.post('/score', async (req, res) => {
  const score = { ...req.body, ip: req.ip };
  await DB.addScore(score);
  const scores = await DB.getHighScores();
  res.send(scores);
});

// // CreateGame
// secureApiRouter.post('/games', async (req, res) => {
//   const score = { ...req.body, ip: req.ip };

//   console.log("Got here!!!!!!!!!!!!!!!!!!")



//   await DB.addScore(score);
//   const scores = await DB.getHighScores();
//   res.send(scores);
// });

// Create a new game
secureApiRouter.post('/games', async (req, res) => {
  const { name } = req.body;
  // console.log("Got here!!!!!!!!!!!!!!!!!!")
  // console.log("Have this name: ", name)
  const game = gameManager.createGame(name);
  console.log(gameManager.toString())
  res.status(201).json(game);
});

// Get all games
secureApiRouter.get('/games', async (req, res) => {
  const games = gameManager.getAllGames();
  res.json(games);
});

// Add a player to a game
secureApiRouter.post('/games/:id/join', async (req, res) => {
  const { id } = req.params;
  const { userName } = req.body;
  // console.log(id, req.body, userName);
  const success = gameManager.addPlayerToGame(parseInt(id, 10), userName);
  console.log(gameManager.toString());
  if (success) {
    res.status(200).send({ msg: 'Player added' });
  } else {
    console.log("Game is full or does not exist")
    res.status(400).send({ msg: 'Game is full or does not exist' });
  }
});

// Remove a player from a game
secureApiRouter.post('/games/:id/leave', async (req, res) => {
  const { id } = req.params;
  const { player } = req.body;
  gameManager.removePlayerFromGame(parseInt(id, 10), player);
  res.status(200).send({ msg: 'Player removed' });
});

// Delete a game
secureApiRouter.delete('/games/:id', async (req, res) => {
  const { id } = req.params;
  gameManager.deleteGame(parseInt(id, 10));
  res.status(204).end();
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  // console.log("HIT HERE FOR SOME REASON!")
  res.sendFile('index.html', { root: 'public' });
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Initialize the WebSocket server
webSocketHandler(httpService, gameManager);
```

``` js
// database.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');

// const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const url = `mongodb://${config.userName}:${config.password}@${config.hostname}:27017`;

const client = new MongoClient(url);
const db = client.db('tetris');
const userCollection = db.collection('users');
const scoreCollection = db.collection('scores');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  await client.connect();
  await db.command({ ping: 1 });
})().catch((ex) => {
  console.log(`Unable to connect to database with ${url} because ${ex.message}`);
  process.exit(1);
});

function getUser(userName) {
  return userCollection.findOne({ userName: userName });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(userName, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    userName: userName,
    password: passwordHash,
    token: uuid.v4(),
  };
  await userCollection.insertOne(user);

  return user;
}

async function addScore(score) {
  return scoreCollection.insertOne(score);
}

function getHighScores() {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: 1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  addScore,
  getHighScores,
};
```

``` js
// gameManager.js

class Player {
  constructor(userName) {
    this.userName = userName;
    this.wsConnection = null;
  }

  setWebSocketConnection(connection) {
    this.wsConnection = connection;
  }

  getWebSocketConnection() {
    return this.wsConnection;
  }
}

class Game {
  constructor(id, gameName) {
    this.id = id;
    this.gameName = gameName;
    this.players = [];
  }

  addPlayer(userName) {
    if (this.players.length < 2) {
      // this.players.push(player);
      
      this.players.push(new Player(userName));

      return true;
    }
    return false;
  }

  getPlayer(index) {
    return this.players[index];
  }

  getPlayerByUsername(userName) {
    const index = this.players.findIndex(player => player.userName === userName);

    if (index >= 0 && index < this.players.length) {
      return this.players[index];
    } else {
      throw new Error(`Player with username '${userName}' not found.`);
    }
  }

  getOpponentByPlayerUsername(userName) {
    const index = this.players.findIndex(player => player.userName === userName);
  
    if (index >= 0 && index < this.players.length) {
      // Since there are exactly 2 players, the opponent is the other player
      const opponentIndex = (index === 0) ? 1 : 0;
      return this.players[opponentIndex];
    } else {
      throw new Error(`Player with username '${userName}' not found.`);
    }
  }

  removePlayer(playerIndex) {
    if (playerIndex >= 0 && playerIndex < this.players.length) {
      
      this.players.splice(playerIndex, 1);
      
    } else {
      throw new Error(`Invalid player index: ${playerIndex}`);
    }
  }

  removePlayerByUsername(userName) {
    const index = this.players.findIndex(player => player.userName === userName);
    if (index >= 0 && index < this.players.length) {
      this.players.splice(index, 1);
    } else {
      console.log(`Player with username '${userName}' not found.`)
      // throw new Error(`Player with username '${userName}' not found.`);
    }
    // console.log("Final: ", this.players)
  }

  isFull() {
    return this.players.length === 2;
  }
}

class GameManager {
  constructor() {
    this.games = [];
    this.nextId = 1;
  }

  createGame(gameName) {
    const game = new Game(this.nextId++, gameName);
    this.games.push(game);
    return game;
  }

  getGame(id) {
    return this.games.find(game => game.id == id);
  }

  getAllGames() {
    return this.games;
  }

  addPlayerToGame(gameId, userName) {
    const game = this.getGame(gameId);
    if (game && !game.isFull()) {
      return game.addPlayer(userName);
    }
    return false;
  }

  removePlayerFromGame(gameId, userName) {
    const game = this.getGame(gameId);
    if (game) {
      game.removePlayerByUsername(userName);
    } else {
      throw new Error(`Game with id '${gameId}' not found.`);
    }
  }

  deleteGame(gameId) {
    this.games = this.games.filter(game => game.id !== gameId);
  }

  toString() {
    return this.games.map(game => {
      const players = game.players.map((player, index) => `${index + 1}: ${player.userName}`);
      return `Game ${game.id} '${game.gameName}' - Players: ${players.join(', ')}`;
    }).join('\n');
  }
}

module.exports = new GameManager();
```

``` js
// websocketHandler.js

const { WebSocketServer } = require('ws');

function webSocketHandler(httpServer, gameManager) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    console.log("Upgrading to WebSocket...");
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    console.log("New WebSocket connection established!");

    let currentPlayer = null;
    let opponentPlayer = null;
    let currentGame = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received message: ", data);

        switch (data.type) {
          case 'join': {
            // console.log("Got to the very top of joinGame")
            const { gameId, userName } = data.value;
            const game = gameManager.getGame(gameId);
            if (!game) {
              ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
              return;
            }

            // console.log("In joinGame");
            // const success = gameManager.addPlayerToGame(gameId, userName);
            // console.log("was adding the new player to the game successful?", success)
            // if (success) {
              currentPlayer = game.getPlayer(game.players.length - 1); // Get newly added player
              currentGame = game;
              currentPlayer.setWebSocketConnection(ws);

              // console.log("Player after setting websocket connection:", currentPlayer)

              ws.send(JSON.stringify({ type: 'joined', gameId: game.id, role: `Player ${game.players.length}` }));
              // console.log("Is the game full?", game.isFull())
              if (game.isFull()) {
                // game.getPlayerByUsername()
                notifyPlayers(game, { type: 'gameStart', message: 'Both players are connected. Let the game begin!' });
              }
            // } else {
            //   ws.send(JSON.stringify({ type: 'error', message: 'Game is full or does not exist' }));
            // }
            break;
          }

          case 'gameUpdate': {
            // console.log("Is truely game update!")
            if (currentGame && currentPlayer) {
              console.log(currentPlayer.userName, currentGame)
              opponentPlayer = currentGame.getOpponentByPlayerUsername(currentPlayer.userName)
              
              // console.log("Opponent player:");
              
              // console.log(opponentPlayer.userName)

              // console.log("data", data)

              // const opponent = currentGame.players.find(p => p !== currentPlayer);
              if (opponentPlayer && opponentPlayer.getWebSocketConnection() && opponentPlayer.getWebSocketConnection().readyState == 1) {
                opponentPlayer.wsConnection.send(JSON.stringify({ type: 'gameUpdate', state: data.value.state }));
              }
            }
            break;
          }

          case 'arbitraryMessage': {
            const { targetPlayerIndex, messageContent } = data;
            if (currentGame && currentGame.players[targetPlayerIndex]) {
              const targetPlayer = currentGame.getPlayer(targetPlayerIndex);
              if (targetPlayer && targetPlayer.wsConnection && targetPlayer.wsConnection.readyState === ws.OPEN) {
                targetPlayer.wsConnection.send(JSON.stringify({ type: 'message', content: messageContent }));
              }
            }
            break;
          }

          case 'gameOver': {
            const { gameId, userName, finalScore } = data.value;
            console.log("Recieved game over event")
            console.log(gameId, userName, finalScore)
          }

          case 'disconnect': {
            const { gameId, userName } = data.value;
            console.log("Disconnecting gameId", gameId, userName);
            gameManager.removePlayerFromGame(gameId, userName);
            console.log(gameManager.toString());
          }

          default:
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
        }
      } catch (error) {
        console.error("Error processing message: ", error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      console.log("WebSocket connection closed");
      if (currentGame && currentPlayer) {
        gameManager.removePlayerFromGame(currentGame.id, currentPlayer);
        notifyPlayers(currentGame, { type: 'playerDisconnected', message: 'A player has disconnected.' });

        if (currentGame.players.length === 0) {
          gameManager.deleteGame(currentGame.id);
        }
      }
    });
  });

  function notifyPlayers(game, message) {
    // console.log("Trying to notify players", game, message)
    game.players.forEach(player => {
      // console.log("Ready state", player.getWebSocketConnection().readyState)
      if (player.getWebSocketConnection() && player.getWebSocketConnection().readyState == 1) {
        // console.log("trying to send to everyone", message)
        player.getWebSocketConnection().send(JSON.stringify(message));
      }
    });
  }

  setInterval(() => {
    wss.clients.forEach(ws => {
      // console.log("ws ping")
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    });
  }, 10000);
}

module.exports = { webSocketHandler };
```

``` bash
deployService.sh

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying React bundle $service to $hostname with $key\n"

# Step 1
printf "\n----> Build the distribution package\n"
rm -rf build
mkdir build
npm install # make sure vite is installed so that we can bundle
npm run build # build the React front end
cp -rf dist build/public # move the React front end to the target distribution
cp service/*.js build # move the back end service to the target distribution
cp service/*.json build

# Step 2
printf "\n----> Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf services/${service}
mkdir -p services/${service}
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target\n"
scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# Step 4
printf "\n----> Deploy the service on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
bash -i
cd services/${service}
npm install
pm2 restart ${service}
ENDSSH

# Step 5
printf "\n----> Removing local copy of the distribution package\n"
rm -rf build
rm -rf dist
```


