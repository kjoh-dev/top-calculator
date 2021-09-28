// Buttons:
// 1. Add 2. Subtract 3. Multiply 4. Divide 5. Equals 6. Clear 7. Period 8. Delete 9. Numbers
// Functions/Features:
// 1. Operate(operator, operand1, operand2)
// 2. Round long decimals
// 3. Handle premature = operator input
// 4. Implement decimals
// 5. Different colors for each operator
// 6. Implement a delete button (backspace)
// 7. Implement support for keyboard

//Input States/Methods:
const OVERRIDE = "override";
const EXTEND_1ST = "extend-1st";
const EXTEND_2ND = "extend-2nd";
const OPERATOR_1ST = "operator-1st";
const OPERATOR_2ND = "operator-2nd";
const EQUAL = "equal";
const BACKSPACE = "backspace";
const ZERO = "zero";
const CLEAR = "clear";
const INVALID = "invalid";

let inputState = OVERRIDE;
let inputMethod = "";
//HTML References
const numpadButtons = document.querySelectorAll(".numpad>div");
const display = document.querySelector(".display");

//Setup EventListeners for key presses and button clicks
window.addEventListener("keydown", processInput);
numpadButtons.forEach(button => {
    button.addEventListener("click", processInput);
});







//Function Definitions


function processInput(e){
    let buttonSelected;
    if(e.type === "keydown"){
        buttonSelected = document.querySelector(`.numpad>div[data-key='${e.key}']`);
    } else{
        buttonSelected = e.target;
    }

    // setInputState();
    inputMethod = getMethodType(buttonSelected.className);

    const dataKey = buttonSelected.getAttribute("data-key");
    executeMethod(dataKey);

    console.log(`method: ${inputMethod} | inputState: ${inputState}`);
}

function createNewOperation(innerText){
    const newOperation = document.createElement("div");
    newOperation.classList.add("operation");
    if(innerText !== undefined) newOperation.innerText = innerText;
    display.insertBefore(newOperation, display.children[0]);
    display.scrollTop = "0";
}

function executeMethod(dataKey){

    const currentOp = display.children[0];
    const lastChar = currentOp.textContent.charAt(currentOp.textContent.length-1);
    switch (true) {
        case (inputMethod === OVERRIDE):
            currentOp.innerText = dataKey;
            (dataKey !== "0") ? inputState = EXTEND_1ST : inputState = OVERRIDE; 
            break;
        case (inputMethod === EXTEND_1ST):
            currentOp.innerText += dataKey; 
            inputState = EXTEND_1ST;
            break;
        case (inputMethod === EXTEND_2ND):
            (isNaN(Number(lastChar))) ?
                currentOp.innerText += (" " + dataKey) :
                currentOp.innerText += dataKey;
            inputState = EXTEND_2ND;
            break;
        case (inputMethod === OPERATOR_1ST):
            currentOp.innerText += ` ${getMathSignCode(dataKey)}`;
            inputState = EXTEND_2ND;
            break;
        case (inputMethod === OPERATOR_2ND):{
            const result = operate(currentOp.innerText);
            currentOp.innerText += ` ${getMathSignCode("=")} ${result}`;

            const innerText = `${result} ${getMathSignCode(dataKey)}`;
            createNewOperation(innerText);
            inputState = EXTEND_2ND;
            break;
        }
        case (inputMethod === EQUAL):{
            const result = operate(currentOp.innerText);
            currentOp.innerText += ` ${getMathSignCode("=")} ${result}`;

            const innerText = `${result}`;
            createNewOperation(innerText);
            inputState = OVERRIDE;
            break;
        }
        case (inputMethod === BACKSPACE):
            let currentOpText = currentOp.textContent;
            console.log(currentOpText);
            currentOpText = currentOpText.slice(0, currentOpText.length-1);
            console.log(currentOpText);
            currentOpText = currentOpText.trimEnd();
            console.log(currentOpText);

            if(currentOpText.length === 0){
                currentOp.innerText = `0`;
                inputState = OVERRIDE;
            } else {
                currentOp.innerText = currentOpText;
                const wordCount = currentOpText.split(" ").length;
                switch (wordCount) {
                    case 3:
                        inputState = EXTEND_2ND;
                        break;
                    case 2:
                        inputState = EXTEND_2ND;
                        break;
                    case 1:
                        inputState = EXTEND_1ST;
                        break;
                    default:
                        console.log(`Error - unexpected word count: ${wordCount}`);
                        break;
                }
            }
            break;
        case (inputMethod === ZERO):
            currentOp.innerText = `0`;
            inputState = OVERRIDE;
            break;
        case (inputMethod === CLEAR):
            for (let i = display.children.length-1; i >= 0; i--) {
                display.children[i].remove();
                
            }

            const innerText = `0`;
            createNewOperation(innerText);
            inputState = OVERRIDE;
            break;
        case (inputMethod === INVALID):
            console.log(`Invalid Input: ${dataKey}. Ignored.`);
            break;

        default:
            break;
    }

}

function getMathSignCode(operator){
    switch(operator){
        case "/": return "\u00F7";
        case "*": return "\u00D7";
        case "-": return "\u2212";
        case "+": return "\u002b";
        case "=": return "\u003D";
        default:
            return `Error - invalid operator: ${operator}`;
    }
}

//Checks whether the designated operand and returns true if found to be a float
function checkOperandForFloat(inputState){
    const currentOp = display.children[0].textContent;
    const wordArray = currentOp.split(" ");
    
    switch(true){
        case (inputState === EXTEND_1ST):
            if(Number(wordArray[0]) % 1 === 0) return false;
            break;
        case (inputState === EXTEND_2ND):
            if(Number(wordArray[2]) % 1 === 0) return false;
            break;
        default:
            console.log(`Error - invalid input state: ${inputState}`);
            break;
    }
    return true;
}

function getMethodType(className){

    switch (true) {
        case (inputState === OVERRIDE):
            switch(className){
                case "num":
                    return OVERRIDE;
                case "operator":
                    return OPERATOR_1ST;
                case "equal":
                    return INVALID;
                case "decimal":
                    return OVERRIDE;
                case "backspace":
                    return ZERO;
                case "clear":
                    return CLEAR;
                default:
                    console.log(`Error - Unknown class name: ${className}`);
                    return;
            }
        case (inputState === EXTEND_1ST):
            switch(className){
                case "num":
                    return EXTEND_1ST;
                case "operator":
                    return OPERATOR_1ST;
                case "equal":
                    return INVALID;
                case "decimal":
                    if(checkOperandForFloat(inputState)) return INVALID;
                    return EXTEND_1ST;
                case "backspace":
                    return BACKSPACE;
                case "clear":
                    return CLEAR;
                default:
                    console.log(`Error - Unknown class name: ${className}`);
                    return;
            }
        case (inputState === EXTEND_2ND):
            switch (className) {
                case "num":
                    return EXTEND_2ND;
                case "operator":
                    return OPERATOR_2ND;
                case "equal":
                    return EQUAL;
                case "decimal":
                    if(checkOperandForFloat(inputState)) return INVALID;
                    return EXTEND_2ND;
                case "backspace":
                    return BACKSPACE;
                case "clear":
                    return CLEAR;
                default:
                    console.log(`Error - Unknown class name: ${className}`);
                    return;
            }
        case (inputState === OPERATOR_1ST):
            switch(className){
                case "num":
                    return EXTEND_2ND;
                case "operator":
                    return INVALID;
                case "equal":
                    return INVALID;
                case "decimal":
                    return EXTEND_2ND;
                case "backspace":
                    return BACKSPACE;
                case "clear":
                    return CLEAR;
                default:
                    console.log(`Error - Unknown class name: ${className}`);
                    return;
            }
        default:
            console.log(`Error - Unknown input state: ${inputState}`);
            break;
    }
}

function operate(operation){
    const opArray = operation.split(" ");
    const operator = opArray[1];
    const operand1 = Number(opArray[0]);
    const operand2 = Number(opArray[2]);
    switch(operator){
        case "\u00F7": return calculator.divide(operand1, operand2);
        case "\u00D7": return calculator.multiply(operand1, operand2);
        case "\u2212": return calculator.subtract(operand1, operand2);
        case "\u002b": return calculator.add(operand1, operand2);
        default: return `Error - invalid operator: ${operator}`;
    }
}


const calculator = {

    numOfDecimals: 3,

    add: function (prevResult, ...operands) {
        if (Array.isArray(prevResult) && operands.length === 0) return add(0, ...prevResult);

        if (operands.some(operand => !this.checkInputValidity(operand))) return NaN;

        const result = operands.reduce((currentSum, operand) => {
            return currentSum + operand;
        }, prevResult);

        return this.roundToMaxDecimal(result);
    },

    subtract: function (prevResult, ...operands) {
        if (Array.isArray(prevResult) && operands.length === 0) return subtract(0, ...prevResult);

        if (operands.some(operand => !this.checkInputValidity(operand))) return NaN;

        const result = operands.reduce((currentSum, operand) => {
            return currentSum - operand;
        }, prevResult);

        return this.roundToMaxDecimal(result);
    },

    multiply: function (prevResult, ...operands) {
        if (Array.isArray(prevResult) && operands.length === 0) return multiply(1, ...prevResult);

        if (operands.some(operand => !this.checkInputValidity(operand))) return NaN;

        const result = operands.reduce((currentproduct, operand) => {
            return currentproduct * operand;
        }, prevResult);

        return this.roundToMaxDecimal(result);
    },

    divide: function (prevResult, ...operands){
        if (Array.isArray(prevResult) && operands.length === 0){
            let first = prevResult.shift();
            if(prevResult.length > 0){
                return divide(first, ...prevResult);
            } else {
                return NaN;
            }
        } 

        if (operands.some(operand => !this.checkInputValidity(operand))) return NaN;

        if (operands.some(operand => (operand === 0))) return "Error - cannot divide by 0";

        const result = operands.reduce((currentproduct, operand) => {
            return currentproduct / operand;
            // const remainder = currentproduct % operand;
            // console.log(`quotient: ${quotient} | remainder: ${remainder}`);
            // return quotient + remainder;
        }, prevResult);

        return this.roundToMaxDecimal(result);
    },

    checkInputValidity: function (input) {
        return (input === "+" || input === "-" || input === "*" || input === "**" || input === "/" || input === "%") ? true :
            (isNaN(Number(input))) ? false :
                true;
    },

    roundToMaxDecimal: function (numToRound){
        return isNaN(numToRound) ? NaN : 
        (numToRound % 1 === 0) ? numToRound.toFixed(0) :
        numToRound.toFixed(this.numOfDecimals);
    },
};


