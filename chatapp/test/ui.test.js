/**
 * @jest-environment jsdom
 */

describe('UI Testcases', () => {
    test('Testcase 1: Checkbox "Remember me" initial state and toggle', () => {
        document.body.innerHTML = `
            <input type="checkbox" id="rememberMe" checked>
        `;
        const checkbox = document.getElementById('rememberMe');
        
        // Expected Result 1: Checkbox is checked initially
        expect(checkbox.checked).toBe(true);
        
        checkbox.checked = false;
        
        // Expected Result 2: Checkbox state changes properly
        expect(checkbox.checked).toBe(false);
    });

    test('Testcase 2: Message form submission should prevent default behavior', () => {
        document.body.innerHTML = `
            <form id="messageForm">
                <input id="messageInput" value="Hello World!" />
                <button type="submit">Send</button>
            </form>
        `;
        const form = document.getElementById('messageForm');
        const input = document.getElementById('messageInput');
        
        let isDefaultPrevented = false;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            isDefaultPrevented = e.defaultPrevented;
        });
        
        form.dispatchEvent(new window.Event('submit', { cancelable: true }));
        
        // Expected Result: Default submission behavior is prevented
        expect(isDefaultPrevented).toBe(true);
        expect(input.value).toBe('Hello World!');
    });

    test('Testcase 3: System message UI generation is formatted correctly', () => {
        function createSystemMessage(text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message system';
            messageDiv.innerHTML = `<em>${text}</em>`;
            return messageDiv;
        }
        
        const msgElement = createSystemMessage('bhakin left the chat');
        
        // Expected Result: Element should have correct class and inner HTML wrapper
        expect(msgElement.classList.contains('system')).toBe(true);
        expect(msgElement.innerHTML).toBe('<em>bhakin left the chat</em>');
    });

    test('Testcase 4: User chat message (Self) alignment and classes', () => {
        function createMessageElement(data, currentUser) {
            const isSelf = data.username === currentUser;
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + (isSelf ? 'self' : 'other');
            return messageDiv;
        }
        
        const msgElement = createMessageElement({ username: 'aa', message: 'Hi' }, 'aa');
        
        // Expected Result: Should be marked as "self" for right alignment
        expect(msgElement.classList.contains('self')).toBe(true);
        expect(msgElement.classList.contains('other')).toBe(false);
    });

    test('Testcase 5: User chat message (Other) alignment and classes', () => {
        function createMessageElement(data, currentUser) {
            const isSelf = data.username === currentUser;
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + (isSelf ? 'self' : 'other');
            return messageDiv;
        }
        
        const msgElement = createMessageElement({ username: 'bhakin', message: 'Hello' }, 'aa');
        
        // Expected Result: Should be marked as "other" for left alignment
        expect(msgElement.classList.contains('other')).toBe(true);
        expect(msgElement.classList.contains('self')).toBe(false);
    });
});
