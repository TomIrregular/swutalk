function createSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.innerHTML = `<em>${text}</em>`;
    return messageDiv;
}

function createMessageElement(data, currentUser) {
    const isSelf = data.username === currentUser;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (isSelf ? 'self' : 'other');
    return messageDiv;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createSystemMessage,
        createMessageElement
    };
}
