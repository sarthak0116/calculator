const textBox = document.getElementById('text-box');
const preDisplay = document.getElementById('previous-display');
const btns = document.querySelectorAll('.buttons>button');

let expression = '';
let previousExpression = '';

function render(){
    preDisplay.innerText = previousExpression
    textBox.value = expression;
    adjustFontSize();
}
function delExp(){
    expression = expression.slice(0, -1);
}

btns.forEach((btn) => {
    btn.addEventListener('click', (e)=>{
        if(e.target.id == 'btn-delete'){
            delExp();
        }
        else if(e.target.id == 'btn-equals'){
            previousExpression = expression;
            expression = String(parseFloat((evaluate()).toFixed(10)));
            render();
            textBox.classList.add('pop');
            preDisplay.classList.add('slideUp')
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
            let currNum =  expression.split(/[+\-×÷]/).pop();
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
            if(lastChar != '+' && lastChar != '-' && lastChar != '÷' && lastChar != '×' && expression!='')expression = expression + String(btn.innerText);
        }
        else{
            expression = expression + String(btn.innerText);
        }

        render();
    })
})

function evaluate(){
    let tokens = tokenizer();
    evaluated = parseExpression(tokens);

    return evaluated[0];
}

function tokenizer(){
    const tokens = [];
    let local = '';
    for(const char of expression){
        if(char >= '0' && char <= '9' || char == '.') local += char;
        else{
            if(local!='')tokens.push(Number(local));
            local = '';
            if(char=='÷')tokens.push('/');
            else if(char == '×') tokens.push('*');
            else tokens.push(char);
        }
    }
    if(local != '')tokens.push(Number(local));

    return tokens;
}
function parseTerm(tokens){
    let localEval;
    for(let i = 0; i < tokens.length - 1; i++){
        if(typeof tokens[i] === 'number' && (tokens[i+1]=='*')){
            localEval = tokens[i] * tokens[i+2];
            tokens[i] = localEval;
            tokens.splice(i+1, 2);
            i--;
        }
        else if(typeof tokens[i] === 'number' && (tokens[i+1]=='/')){
            localEval = tokens[i] / tokens[i+2];
            tokens[i] = localEval;
            tokens.splice(i+1, 2);
            i--
        }
    }
    return tokens;
}
function parseExpression(tokens){
    tokens = parseTerm(tokens);
    let localEval;
    for(let i = 0; i < tokens.length - 1; i++){
        if(typeof tokens[i] === 'number' && (tokens[i+1]=='+')){
            localEval = tokens[i] + tokens[i+2];
            tokens[i] = localEval;
            tokens.splice(i+1, 2);
            i--;
        }
        else if(typeof tokens[i] === 'number' && (tokens[i+1]=='-')){
            localEval = tokens[i] - tokens[i+2];
            tokens[i] = localEval;
            tokens.splice(i+1, 2);
            i--
        }
    }
    return tokens;
}





function adjustFontSize() {
    const maxWidth = textBox.parentElement.offsetWidth;
    let fontSize = 80;
    textBox.style.fontSize = fontSize + 'px';

    while (textBox.scrollWidth > maxWidth && fontSize > 20) {
        fontSize -= 2;
        textBox.style.fontSize = fontSize + 'px';
    }

    textBox.style.lineHeight = fontSize + 'px';
    textBox.style.paddingTop = (80 - fontSize) + 'px';
}
textBox.addEventListener('input', adjustFontSize);

