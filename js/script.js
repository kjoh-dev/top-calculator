//HTML References
const numpadButtons = document.querySelectorAll(".numpad>div");
const display = document.querySelector(".display");
const errorElement = document.querySelector(".error");

//Operation Property Names:
const OPERAND_1 = "operand1";
const OPERATOR_1 = "operator1";
const OPERAND_2 = "operand2";
const OPERATOR_2 = "operator2";
const RESULT = "result";

//Error Codes:
const DIVBY0 = " YOU CAN'T DIVIDE SOMETHING WITH NOTHING!";

//Setup EventListeners for key presses and button clicks
window.addEventListener("keydown", processInput);
numpadButtons.forEach(button => {
    button.addEventListener("click", processInput);
    button.addEventListener("animationend", resetAnimState);
});
errorElement.addEventListener("transitionend", hideErrorNotice);

//Initialization
let numOfDecimals = 3;
const operationsLog = [];
operationsLog[0] = {operand1: "", operator1: "", operand2: "", operator2: "", result: ""};



//Function Definitions

const operationObj = {

    addInputToOperand: function(propertyName, input){
        console.log(`addInputToOperand - Input: ${input} | PropertyName: ${propertyName}`);

        let propertyModified = false;
        const operation = operationsLog[0];
        initialValue = operation[propertyName];
        modifiedValue = initialValue + input;
        if(!(isNaN(Number(modifiedValue)))){
            operation[propertyName] = Number(modifiedValue).toString();
            if(input === "."){
                operation[propertyName] = operation[propertyName] + ".";
            }
            propertyModified = true;
        } else if (modifiedValue === "."){
            operation[propertyName] = `0${modifiedValue}`;
            propertyModified = true;
        } else if (modifiedValue === "-"){
            operation[propertyName] = modifiedValue;
            propertyModified = true;
        } else {
            propertyModified = false;
        }
        return propertyModified;
    },

    addInputToOperator: function(propertyName, input){
        console.log(`addInputToOperator - Input: ${input} | PropertyName: ${propertyName}`);

        let propertyModified = false;
        const operation = operationsLog[0];
        initialValue = operation[propertyName];
        modifiedValue = initialValue + input;
        if (modifiedValue === "+" || modifiedValue === "-" || modifiedValue === "*" || modifiedValue === "/" || (modifiedValue === "=" && propertyName === OPERATOR_2)) {
            operation[propertyName] = modifiedValue;
            propertyModified = true;
        } 
        return propertyModified;
    },

    addInput: function(input){
        let inputAdded = false;
        const operation = operationsLog[0];
        let propertyName = this.getCurrentProperty();

        (propertyName === OPERAND_1 || propertyName === OPERAND_2) ?
        inputAdded = this.addInputToOperand(propertyName, input) :
        inputAdded = this.addInputToOperator(propertyName, input);

        if (inputAdded) return;

        if (operation[propertyName] === "") return `Error in operation.addInput - Invalid Input (1), ${input}: Ignored | ${operation[propertyName]}`;

        if(propertyName === OPERAND_1 || propertyName === OPERAND_2){
            if(isNaN(operation[propertyName])){
                return `Error in operation.addInput - Invalid Input (2), ${input}: Ignored | ${operation[propertyName]}`;
            }
        }

        propertyName = this.getNextProperty(propertyName);

        (propertyName === OPERAND_1 || propertyName === OPERAND_2) ?
            inputAdded = this.addInputToOperand(propertyName, input) :
            inputAdded = this.addInputToOperator(propertyName, input);

        if (inputAdded) return;

        return `Error in operation.addInput - Invalid Input (3), ${input}: Ignored | ${operation[propertyName]}`;
    },

    backspace: function() {
        const operation = operationsLog[0];
        const propertyName = this.getCurrentProperty();
        const initialProp = operation[propertyName];
        const modProp = initialProp.slice(0, initialProp.length-1);
        operation[propertyName] = modProp;
    },

    initialize: function() {
        const operation = operationsLog[0];
        operation.operand1 = "";
        operation.operator1 = "";
        operation.operand2 = "";
        operation.operator2 = "";
        operation.result = "";
    },

    getCurrentProperty: function(){
        const operation = operationsLog[0];
        return (operation.operand1 === "") ? OPERAND_1 :
        (operation.operator1 === "") ? OPERAND_1 :
        (operation.operand2 === "") ? OPERATOR_1 :
        (operation.operator2 === "") ? OPERAND_2 :
        (operation.result === "") ? OPERATOR_2 :
        RESULT;
    },

    getNextProperty: function(propertyName){
        switch (true) {
            case (propertyName === OPERAND_1):
                return OPERATOR_1;
            case (propertyName === OPERATOR_1):
                return OPERAND_2;
            case (propertyName === OPERAND_2):
                return OPERATOR_2;
            case (propertyName === OPERATOR_2):
                return RESULT;
            default:
                console.log(`Error in getNextProperty - propertyName: ${propertyName}`);
                return;
        }
    },
}

function enableClickAnim(animElement){
    animElement.style.animationName = "click";
}

function resetAnimState(e){
    const clickedButton = e.target;
    if(clickedButton instanceof HTMLElement){
        clickedButton.style.animationName = "none";
    }
}

function processInput(e){

    let inputElement;
    if(e.type === "keydown"){
        if(e.key === "/") e.preventDefault();
        inputElement = document.querySelector(`.numpad>div[data-key='${e.key}']`);
    } else if(e.type === "click"){
        inputElement = e.target;
    } else {return;}

    if(inputElement === null || !(inputElement instanceof HTMLElement)) return;

    enableClickAnim(inputElement);

    let input = inputElement.getAttribute("data-key"); 
    const currentOpDisplay = display.children[1];
    const currentOp = operationsLog[0];
    
    if(input === "Enter") input = "=";1

    if(input === "Delete"){
        
        operationsLog.splice(1, operationsLog.length-1);
        operationObj.initialize();

        for (let i = display.children.length-1; i > 1; i--) {
            display.children[i].remove();
        }
        currentOpDisplay.innerText = convertOpToDisplayText();
        addBlinker();
        return;
    }

    if(input === "Backspace"){
        operationObj.backspace();

        currentOpDisplay.innerText = convertOpToDisplayText();
        addBlinker();
        return;
    }

    const errorMsg = operationObj.addInput(input);
    if(errorMsg !== undefined){
        console.log(errorMsg);
        return;
    }
    
    const currentProperty = operationObj.getCurrentProperty();
    if(currentProperty === OPERATOR_2){
        const result = calculator.operate(currentOp);
        if(isNaN(result)) {
            console.log(result);
            if(result === DIVBY0){
                showErrorNotice(DIVBY0);

                operationObj.backspace();
                currentOpDisplay.innerText = convertOpToDisplayText();
                addBlinker();
            }
            return;
        } else{
            currentOp[RESULT] = result;
            currentOpDisplay.innerText = convertOpToDisplayText();

            const newOperand1 = result.toString();
            const newOperator1 = (currentOp[OPERATOR_2] !== "=") ? currentOp[OPERATOR_2] : "";
            const newOp = {operand1: newOperand1, operator1: newOperator1, operand2: "", operator2: "", result: ""};
            operationsLog.unshift(newOp);
            const newOpDisplayText = convertOpToDisplayText();
            createNewDisplayOp(newOpDisplayText);
        }
    } else {
        currentOpDisplay.innerText = convertOpToDisplayText();
    }
    addBlinker();
}

function convertOpToDisplayText(){
    const operation = operationsLog[0];
    let displayText;
    if(operation[RESULT] !== ""){
        displayText = `${operation[OPERAND_1]} ${getMathSignCode(operation[OPERATOR_1])} ${operation[OPERAND_2]} = ${operation[RESULT]}`;
    } else {
        displayText = `${operation[OPERAND_1]} ${getMathSignCode(operation[OPERATOR_1])} ${operation[OPERAND_2]}`;
    }
    
    return displayText.trimEnd();
}


function showErrorNotice(noticeType){
    switch(true){
        case (noticeType === DIVBY0):
            errorElement.children[0].innerText = DIVBY0;
            break;
        case (noticeType === DUP_OPERATOR):
            errorElement.children[0].innerText = DUP_OPERATOR;
            break;
        case (noticeType === DUP_POINT):
            errorElement.children[0].innerText = DUP_POINT;
            break;
        default:
            break;
    }
    errorElement.classList.add("show");
}

function hideErrorNotice(e){
    if(e.propertyName !== "font-size") return;
    setTimeout(function () {
        errorElement.classList.remove("show");
    }, 2000);
}

function createNewDisplayOp(operationText){
    const newOperation = document.createElement("div");
    newOperation.classList.add("operation");
    if(operationText !== undefined) newOperation.innerText = operationText;

    display.insertBefore(newOperation, display.children[1]);
    display.scrollTop = "0";
}

function addBlinker(){
    const newBlinker = document.createElement("small");
    const currentPropertyName = operationObj.getCurrentProperty();
    (currentPropertyName === OPERATOR_1) ? 
    newBlinker.innerText = " _" :
    newBlinker.innerText = "_";

    display.children[1].appendChild(newBlinker);
}

function getMathSignCode(operator){
    switch(operator){
        case "/": return "\u00F7";
        case "*": return "\u00D7";
        case "-": return "\u2212";
        case "+": return "\u002b";
        case "=": return "\u003D";
        case "": return "";
        default:
            return `Error in getMathSignCode: invalid operator: ${operator}`;
    }
}

//Checks whether the designated operand and returns true if decimal point is found
function checkOperandForFloat(){
    const currentOp = display.children[1].textContent;
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

const calculator = {
    
    operate: function(operation){
        const operand1 = Number(operation["operand1"]);
        const operand2 = Number(operation["operand2"]);
        const operator = operation["operator1"];
        switch(operator){
            case "/": return this.divide(operand1, operand2);
            case "*": return this.multiply(operand1, operand2);
            case "-": return this.subtract(operand1, operand2);
            case "+": return this.add(operand1, operand2);
            default:
                return `Error in calculator.operate - invalid operator: ${operator}`;
        }
    },

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

        if (operands.some(operand => (operand === 0))) return DIVBY0;

        const result = operands.reduce((currentproduct, operand) => {
            return currentproduct / operand;
        }, prevResult);

        return this.roundToMaxDecimal(result);
    },

    checkInputValidity: function (input) {
        return (input === "+" || input === "-" || input === "*" || input === "**" || input === "/" || input === "%") ? true :
            (isNaN(Number(input))) ? false :
                true;
    },

    roundToMaxDecimal: function (numToRound){
        if(isNaN(numToRound)) return NaN;
        if(numToRound % 1 === 0) return numToRound;

        const numAsTextArray = numToRound.toString().split("."); 
        if(numAsTextArray[1].length <= numOfDecimals) {
            return numToRound;
        } else {
            return numToRound.toFixed(numOfDecimals);
        }
    },
};


