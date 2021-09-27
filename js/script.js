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

window.addEventListener("keydown", showText);
numpadButtons.forEach(button => {
    button.addEventListener("click", showText);
});




//Function Definitions
function showText(e){
    let buttonSelected;
    if(e.type === "keydown"){
        buttonSelected = document.querySelector(`.numpad>div[data-key='${e.key}']`);
    } else{
        buttonSelected = e.target;
    }
    // console.log(buttonSelected);
}

