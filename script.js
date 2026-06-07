const textBox = document.getElementById('text-box');
const preDisplay = document.getElementById('previous-display');
const btns = document.querySelectorAll('.buttons>button');

let expression = '';
let previousExpression = '';
let lastLength = 0;
let fontSizeTimer;

function render(){
    preDisplay.innerText = previousExpression;
    textBox.value = expression;
    clearTimeout(fontSizeTimer);
    fontSizeTimer = setTimeout(adjustFontSize, 50);
}

function delExp(){
    expression = expression.slice(0, -1);
}

function btnDel(){
    delExp();
}

btns.forEach((btn) => {
    btn.addEventListener('click', (e)=>{
        if(e.target.id == 'btn-delete'){
            btnDel();
        }
        else if(e.target.id == 'btn-equals'){
            previousExpression = expression;
            expression = String(parseFloat((evaluate()).toFixed(10)));
            render();
            textBox.classList.add('pop');
            preDisplay.classList.add('slideUp');
            setTimeout(() => {
                textBox.classList.remove('pop');
                preDisplay.classList.remove('slideUp');
            }, 200);
        }
        else if(e.target.id == 'btn-ac'){
            previousExpression = '';
            expression = '';
        }
        else if(e.target.id == 'btn-decimal'){
            let currNum = expression.split(/[+\-×÷]/).pop();
            const hasDecimal = (num) => num.includes('.');
            if(expression == '' && currNum == ''){
                expression = '0.';
            }
            else if(!hasDecimal(currNum)){
                expression = expression + String(btn.innerText);
            }
        }
        else if(e.target.id == 'btn-divide' || e.target.id == 'btn-percent' || e.target.id=='btn-multiply' || e.target.id == 'btn-add' || e.target.id=='btn-subtract'){
            const lastChar = expression.at(-1);
            if(lastChar != '+' && lastChar != '-' && lastChar != '÷' && lastChar != '×' && expression!=''){
                expression = expression + String(btn.innerText);
            }
        }
        else{
            expression = expression + String(btn.innerText);
        }

        render();
    });
});

function evaluate(){
    let tokens = tokenizer();
    let evaluated = parseExpression(tokens);
    return evaluated[0];
}

function tokenizer(){
    const tokens = [];
    let local = '';
    for(const char of expression){
        if((char >= '0' && char <= '9') || char == '.') local += char;
        else{
            if(local != '') tokens.push(Number(local));
            local = '';
            if(char == '÷') tokens.push('/');
            else if(char == '×') tokens.push('*');
            else tokens.push(char);
        }
    }
    if(local != '') tokens.push(Number(local));
    return tokens;
}

function parseTerm(tokens){
    let localEval;
    for(let i = 0; i < tokens.length - 1; i++){
        if(typeof tokens[i] === 'number' && tokens[i+1] == '*'){
            localEval = tokens[i] * tokens[i+2];
            tokens[i] = localEval;
            tokens.splice(i+1, 2);
            i--;
        }
        else if(typeof tokens[i] === 'number' && tokens[i+1] == '/'){
            localEval = tokens[i] / tokens[i+2];
            tokens[i] = localEval;
            tokens.splice(i+1, 2);
            i--;
        }
    }
    return tokens;
}

function parseExpression(tokens){
    tokens = parseTerm(tokens);
    let localEval;
    for(let i = 0; i < tokens.length - 1; i++){
        if(typeof tokens[i] === 'number' && tokens[i+1] == '+'){
            localEval = tokens[i] + tokens[i+2];
            tokens[i] = localEval;
            tokens.splice(i+1, 2);
            i--;
        }
        else if(typeof tokens[i] === 'number' && tokens[i+1] == '-'){
            localEval = tokens[i] - tokens[i+2];
            tokens[i] = localEval;
            tokens.splice(i+1, 2);
            i--;
        }
    }
    return tokens;
}

function adjustFontSize() {
    const maxWidth = textBox.parentElement.offsetWidth;
    let low = 20, high = 80;
    textBox.style.fontSize = high + 'px';
    if(textBox.scrollWidth <= maxWidth){
        textBox.style.lineHeight = high + 'px';
        textBox.style.paddingTop = '0px';
        return;
    }
    while(low < high - 1){
        const mid = Math.floor((low + high) / 2);
        textBox.style.fontSize = mid + 'px';
        if(textBox.scrollWidth <= maxWidth) low = mid;
        else high = mid;
    }
    textBox.style.fontSize = low + 'px';
    textBox.style.lineHeight = low + 'px';
    textBox.style.paddingTop = (80 - low) + 'px';
}

textBox.addEventListener('input', adjustFontSize);

document.addEventListener("keydown", (event) => {
    if(event.key === 'Backspace'){
        btnDel();
        render();
    } else if(event.key === 'Enter'){
        previousExpression = expression;
        expression = String(parseFloat((evaluate()).toFixed(10)));
        render();
    } else if(event.key >= '0' && event.key <= '9'){
        expression += event.key;
        render();
    } else if(event.key === '+' || event.key === '-'){
        const lastChar = expression.at(-1);
        if(lastChar !== '+' && lastChar !== '-' && lastChar !== '÷' && lastChar !== '×' && expression !== ''){
            expression += event.key;
            render();
        }
    } else if(event.key === '*'){
        expression += '×';
        render();
    } else if(event.key === '/'){
        event.preventDefault();
        expression += '÷';
        render();
    } else if(event.key === '.'){
        let currNum = expression.split(/[+\-×÷]/).pop();
        if(!currNum.includes('.')){
            expression += '.';
            render();
        }
    }
});