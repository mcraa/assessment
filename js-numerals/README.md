# JavaScript/Front-end Developer - Exercise 1

## Instructions

- Fork this project.
- Write tests.
- Don't use external libraries for the conversion.
- Commit the important milestones and not just the final result.

## Exercise description

Create an application that contains a web form, which has a numeric input field and a submit button.

When the user gives an arabic number, the system shows the english phrase of that number.

For example:
<pre>
7    == seven
42   == forty-two
2001 == two thousand and one
1999 == nineteen hundred and ninety-nine
17999 == seventeen thousand nine hundred and ninety-nine
</pre>

That's all.

---

# Solution / Usage

 1. clone the repo
 2. run `npm install` * assumes node intalled
 3. build / develop / test
    1. to build and observe: run `npm run build` and open `index.html` from the `dist` folder
    2. develop: run `npm run dev` then open `http://localhost:9000`, reloads on file change
    3. unit tests: `npm run test` or `npm run test:watch` to rerun tests on any change
    4. e2e test: `npm run e2e` or `npm run e2e:dev` E2e test runs with Chrome by default, so that should be installed. (runs headless with the current config)
    5. `npm run coverage` to generate test coverage report into the `coverage` folder
    
## Suggestion for development
`npm run e2e:dev` (4.) keeps the hot reload server (2.) running too, so you can see the result in the browser. Keep a terminal open with this and another with `npm run test:watch` (3.) to get immediately notified when something goes south.
