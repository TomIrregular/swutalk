/*
*   @jest-environment jsdom 
*/

const filterMessages = require('./searchLogic');
document.body.innerHTML = `
        <div class="message">
            <span class="username">Atom:</span>
            <span class="body">Do!</span>
            <span class="time">03:06:09</span>
        </div>
        <div class="message">
            <span class="username">Sprite:</span>
            <span class="body">Re.</span>
            <span class="time">06:12:18</span>
        </div>
        <div class="message">
            <span class="username">Book:</span>
            <span class="body">Mi?</span>
            <span class="time">06:12:18</span>
        </div>
        <div class="message">
            <span class="username">Atom:</span>
            <span class="body">Fa!</span>
            <span class="time">09:18:27</span>
        </div>
    `;

// Search testings

test('Simple filter #1', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('Do', allMessages);

    expect(allMessages[0].style.display).toBe('block');
    expect(allMessages[1].style.display).toBe('none');
    expect(allMessages[2].style.display).toBe('none');
    expect(allMessages[3].style.display).toBe('none');
});

test('Simple filter #2', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('Re', allMessages);

    expect(allMessages[0].style.display).toBe('none');
    expect(allMessages[1].style.display).toBe('block');
    expect(allMessages[2].style.display).toBe('none');
    expect(allMessages[3].style.display).toBe('none');
});

test('Simple filter #3', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('Mi', allMessages);

    expect(allMessages[0].style.display).toBe('none');
    expect(allMessages[1].style.display).toBe('none');
    expect(allMessages[2].style.display).toBe('block');
    expect(allMessages[3].style.display).toBe('none');
});

test('Simple filter #4', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('Fa', allMessages);

    expect(allMessages[0].style.display).toBe('none');
    expect(allMessages[1].style.display).toBe('none');
    expect(allMessages[2].style.display).toBe('none');
    expect(allMessages[3].style.display).toBe('block');
});

test('Simple filter #5', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('!', allMessages);

    expect(allMessages[0].style.display).toBe('block');
    expect(allMessages[1].style.display).toBe('none');
    expect(allMessages[2].style.display).toBe('none');
    expect(allMessages[3].style.display).toBe('block');
});

test('User filter #1', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('"@Atom"', allMessages);

    expect(allMessages[0].style.display).toBe('block');
    expect(allMessages[1].style.display).toBe('none');
    expect(allMessages[2].style.display).toBe('none');
    expect(allMessages[3].style.display).toBe('block');
});

test('User filter #2', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('"@sprite"', allMessages);

    expect(allMessages[0].style.display).toBe('none');
    expect(allMessages[1].style.display).toBe('block');
    expect(allMessages[2].style.display).toBe('none');
    expect(allMessages[3].style.display).toBe('none');
});

test('User filter #3', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('"@BooK"', allMessages);

    expect(allMessages[0].style.display).toBe('none');
    expect(allMessages[1].style.display).toBe('none');
    expect(allMessages[2].style.display).toBe('block');
    expect(allMessages[3].style.display).toBe('none');
});

test('Date filter #1', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('"date:03:06:09"', allMessages);

    expect(allMessages[0].style.display).toBe('block');
    expect(allMessages[1].style.display).toBe('none');
    expect(allMessages[2].style.display).toBe('none');
    expect(allMessages[2].style.display).toBe('none');
});

test('Date filter #2', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('"date:06:12:18"', allMessages);

    expect(allMessages[0].style.display).toBe('none');
    expect(allMessages[1].style.display).toBe('block');
    expect(allMessages[2].style.display).toBe('block');
    expect(allMessages[3].style.display).toBe('none');
});

test('Empty filter', () => {
    const allMessages = document.querySelectorAll('.message');

    filterMessages('', allMessages);

    expect(allMessages[0].style.display).toBe('block');
    expect(allMessages[1].style.display).toBe('block');
    expect(allMessages[2].style.display).toBe('block');
    expect(allMessages[3].style.display).toBe('block');
});