let displayText = '0';
const display = document.getElementById('output-string');
let dot = true;

function appendToDisplay(value) {
    if (displayText == '0') {
        if (!isNaN(value) || value == '-') {
            displayText = '';
        }
        if (value == '.') {
            dot = false;
        }
        displayText += value;
    }
    else {
        if (priority(value) > 0) {
            if (priority(display.textContent[display.textContent.length - 1]) > 0) {
                return;
            }
            displayText += " " + value; 
            dot = true;   
        }
        else {
            if (value == '.') {
                if (!dot || priority(display.textContent[display.textContent.length - 1]) > 0) {
                    return;
                }
                dot = false;
            }
            
            if (priority(display.textContent[display.textContent.length - 1]) > 0) {
                displayText += ' ';
            }
            
            displayText += value;
        }
    }
    display.textContent = displayText;
    updateDisplay();
}

function clearDisplay() {
    display.textContent = '0';
    displayText = '0';
    updateDisplay();
}

function calculateResult() {
    //displayText = displayText.replaceAll(' ', '')

    try {
        const result = math_RPN(RPN());
        //console.log(result);
        display.textContent = result;
        if (result == 0) {
            displayText = '0';
            display.textContent = '0';
        }
        else {
            displayText = result.toString(); // Сохраняем результат для дальнейших вычислений
        }    
    }
    catch (error) {
        display.textContent = 'Ошибка';
        displayText = '0';
    }
    updateDisplay();
}

function RPN () {
    
    const tokens = displayText.split(' ');
    const output = [];
    const stack = [];

    for(const token of tokens) {
        if (!isNaN(token)) {
            output.push(token);
        }
        else {
            while (stack.length != 0 && priority(stack[stack.length-1]) >= priority(token)) {
                output.push(stack.pop());
            }
            stack.push(token);
        }
    }

    while (stack.length != 0) {
        output.push(stack.pop());
    }

    console.log('Постфиксная запись: ', output.join(' '));
    return output;

}

function math_RPN (output) {
    const temp = [];

    for (const token of output) {
        if (!isNaN(token)) {
            temp.push(parseFloat(token));
        } else {
            const b = temp.pop();
            const a = temp.pop();
            let result;

            switch (token) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    if (b === 0) return error;
                    result = a / b;
                    break;
                }
        temp.push(result);
        }
    }

    return temp.pop();
}

function priority(op) {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
}

function clearLast () {
    if (displayText != '0') {
        displayText = displayText.slice(0, -1);
        display.textContent = display.textContent.slice(0, -1);
        if (displayText[displayText.length-1] == ' ') {
            displayText = displayText.slice(0, -1);
            display.textContent = display.textContent.slice(0, -1);
        }
    }
    if (displayText.length == 0) {
        displayText = '0';
        display.textContent = displayText;
    }
    //display.textContent = displayText;

    updateDisplay();
}

function updateDisplay() {
    const t = display.textContent.split(' ');
    console.log(t);

    const last = document.createElement("span");
    last.setAttribute('id', 'space');

    if (t.length == 1) {
        last.textContent = t[0];
        display.textContent = '';
        display.appendChild(last);
    }
    else {
        last.textContent = ' '+t[t.length-1];
        const temporary = t.slice(0, -1);
        display.textContent = temporary.join(' ');
        display.appendChild(last);
    }

}