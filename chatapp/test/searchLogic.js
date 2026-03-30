function filterMessages(searchKey, allMessages) {
    searchKey = searchKey.toLowerCase();
    Array.from(allMessages).forEach((msg) => {
        const usernameText = msg.querySelector('.username').textContent.toLowerCase();
        const messageText = msg.querySelector('.body').textContent.toLowerCase();
        const dateText = msg.querySelector('.time').textContent.toLowerCase();
        let textChecker = false;
                
        if (searchKey.startsWith('"@') && searchKey.endsWith('"')) {
            const targetUser = searchKey.slice(2,-1);
            textChecker = usernameText.includes(targetUser);
        } 
        else if (searchKey.startsWith('"date:') && searchKey.endsWith('"')) {
            const targetDate = searchKey.slice(6,-1);
            textChecker = dateText.includes(targetDate);
        }
        else {
            textChecker = messageText.includes(searchKey);
        }

        msg.style.display = textChecker ? 'block' : 'none';
    });
}
module.exports = filterMessages;