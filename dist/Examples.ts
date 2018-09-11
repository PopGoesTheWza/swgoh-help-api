// Optional Types
let isDone: boolean = false;
let height: number = 6;
let bob: string = "bob";
let list1: number[] = [1, 2, 3];
let list2: Array<number> = [1, 2, 3];
enum Color {Red, Green, Blue};
let c: Color = Color.Green;
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
function showMessage(data: string): void { // Void
 alert(data);
}
showMessage('hello');

// Classes
class Hamburger {
  constructor() {
    // This is the constructor.
  }
  listToppings() {
    // This is a method.
  }
}

// Template strings
var name = 'Sam';
var age = 42;
console.log(`hello my name is ${name}, and I am ${age} years old`);

// Rest arguments
const add = (a, b) => a + b;
let args = [3, 5];
add(...args); // same as `add(args[0], args[1])`, or `add.apply(null, args)`

// Spread operator (array)
let cde = ['c', 'd', 'e'];
let scale = ['a', 'b', ...cde, 'f', 'g'];  // ['a', 'b', 'c', 'd', 'e', 'f', 'g']

// Spread operator (map)
let mapABC  = { a: 5, b: 6, c: 3};
let mapABCD = { ...mapABC, d: 7};  // { a: 5, b: 6, c: 3, d: 7 }

// Destructure map
let jane = { firstName: 'Jane', lastName: 'Doe'};
let john = { firstName: 'John', lastName: 'Doe', middleName: 'Smith' }
function sayName({firstName, lastName, middleName = 'N/A'}) {
  console.log(`Hello ${firstName} ${middleName} ${lastName}`)
}
sayName(jane) // -> Hello Jane N/A Doe
sayName(john) // -> Helo John Smith Doe

// Export (The export keyword is ignored)
export const pi = 3.141592;

// Google Apps Script Services
var doc = DocumentApp.create('Hello, world!');
doc.getBody().appendParagraph('This document was created by Google Apps Script.');

// Decorators
function Override(label: string) {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      configurable: false,
      get: () => label
    });
  }
}
class Test {
  @Override('test') // invokes Override, which returns the decorator
  name: string = 'pat';
}
let t = new Test();
console.log(t.name); // 'test'
