const textBox = document.getElementById('text-box');

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


