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



const numpadButtons = document.querySelectorAll(".numpad>div");
const display = document.querySelector(".display");

// const operationLog = ["0"];

let inputState = OVERRIDE;

window.addEventListener("keydown", operate);
numpadButtons.forEach(button => {
    button.addEventListener("click", operate);
});




//Function Definitions
function showText(){


}

function operate(e){
    let buttonSelected;
    if(e.type === "keydown"){
        buttonSelected = document.querySelector(`.numpad>div[data-key='${e.key}']`);
    } else{
        buttonSelected = e.target;
    }

    const processingMethod = getMethodType(buttonSelected);

    const newOperation = document.createElement("div");
    newOperation.classList.add("operation");

    //Check for existing (incomplete) operation

    newOperation.textContent = buttonSelected.textContent;
    display.insertBefore(newOperation, display.children[0]);
    display.scrollTop = "0";
}


//Checks last input(s) to determine the current input status.
function setInputState(){
    if(inputState !== "") return inputState;
    const currentOp = display.children[0].textContent;
    const wordArray = currentOp.split(" ");
    const lastWord = wordArray[wordArray.length-1];
    const charArray = lastWord.split("");
    const lastChar = charArray[charArray.length-1]

    if(lastWord === lastChar && lastWord === "0") return OVERRIDE;
    if(lastChar !== "." || isNaN(Number(lastChar))) return OPERATOR_1ST;
    if(wordArray.length < 3) return EXTEND_1ST;
    return EXTEND_2ND;
}

// function getLastWord(text){
//     const wordArray = text.split(" ");
//     return lastWord = wordArray[wordArray.length-1];
// }

// function getLastChar(text){
//     const charArray = text.split("");
//     return lastChar = charArray[charArray.length-1];
// }

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

function getMethodType(buttonSelected){

    const className = buttonSelected.className();
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
                case "delete":
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
                case "delete":
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
                case "delete":
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
                case "delete":
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