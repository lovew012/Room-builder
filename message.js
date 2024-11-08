function statusMessage(message) {
    
    const messageWrapper = document.createElement("div");
    

    const closer = document.createElement("span");
    
    closer.innerHTML = "&#10006;";
    messageWrapper.appendChild(closer);
    

    const txtNode = document.createTextNode(message);
    const paragraph = document.createElement("p");
    messageWrapper.classList.add("statusmessage");
    paragraph.appendChild(txtNode);
    messageWrapper.appendChild(paragraph);
    document.body.appendChild(messageWrapper);

    setTimeout(() => {messageWrapper.remove()}, 10000);

    messageWrapper.addEventListener('click', () => {
        messageWrapper.remove();
    })
}