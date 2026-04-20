/*
* @jest-environment jsdom 
*/

describe('Chat Search Logic', () => {
    let simulateSearch;

    beforeEach(() => {
        // 1. Clear the require cache so the script re-runs for the new DOM
        jest.resetModules();

        // 2. Set up the exact HTML structure your logic expects
        // Added style="display: flex" to ensure JSDOM starts with a value we can test against
        document.body.innerHTML = `
            <input id="searchInput" />
            <div id="searchSuggestions"></div>
            <div id="messages">
                <div class="message" style="display: flex">
                    <span class="msg-username">Atom</span>
                    <div class="msg-bubble"><span class="body">Do!</span></div>
                    <span class="msg-time">19/04/2026 03:06:09</span>
                </div>
                <div class="message" style="display: flex">
                    <span class="msg-username">Sprite</span>
                    <div class="msg-bubble"><span class="body">Re.</span></div>
                    <span class="msg-time">20/04/2026 06:12:18</span>
                </div>
                <div class="message" style="display: flex">
                    <span class="msg-username">Book</span>
                    <div class="msg-bubble"><span class="body">Mi?</span></div>
                    <span class="msg-time">20/04/2026 06:12:18</span>
                </div>
                <div class="message" style="display: flex">
                    <span class="msg-username">Atom</span>
                    <div class="msg-bubble"><span class="body">Fa!</span></div>
                    <span class="msg-time">21/04/2026 09:18:27</span>
                </div>
            </div>
        `;

        require('./searchLogic');

        simulateSearch = (term) => {
            const input = document.getElementById('searchInput');
            input.value = term;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        };
    });

    // --- Search testings ---

    test('Simple filter #1', () => {
        simulateSearch('Do');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('flex');
        expect(allMessages[1].style.display).toBe('none');
        expect(allMessages[2].style.display).toBe('none');
        expect(allMessages[3].style.display).toBe('none');
    });

    test('Simple filter #2', () => {
        simulateSearch('Re');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('none');
        expect(allMessages[1].style.display).toBe('flex');
        expect(allMessages[2].style.display).toBe('none');
        expect(allMessages[3].style.display).toBe('none');
    });

    test('Simple filter #3', () => {
        simulateSearch('Mi');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('none');
        expect(allMessages[1].style.display).toBe('none');
        expect(allMessages[2].style.display).toBe('flex');
        expect(allMessages[3].style.display).toBe('none');
    });

    test('Simple filter #4', () => {
        simulateSearch('Fa');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('none');
        expect(allMessages[1].style.display).toBe('none');
        expect(allMessages[2].style.display).toBe('none');
        expect(allMessages[3].style.display).toBe('flex');
    });

    test('Simple filter #5', () => {
        simulateSearch('!');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('flex');
        expect(allMessages[1].style.display).toBe('none');
        expect(allMessages[2].style.display).toBe('none');
        expect(allMessages[3].style.display).toBe('flex');
    });

    test('User filter #1', () => {
        simulateSearch('"@Atom"');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('flex');
        expect(allMessages[1].style.display).toBe('none');
        expect(allMessages[2].style.display).toBe('none');
        expect(allMessages[3].style.display).toBe('flex');
    });

    test('User filter #2', () => {
        simulateSearch('"@sprite"');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('none');
        expect(allMessages[1].style.display).toBe('flex');
        expect(allMessages[2].style.display).toBe('none');
        expect(allMessages[3].style.display).toBe('none');
    });

    test('User filter #3', () => {
        simulateSearch('"@BooK"');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('none');
        expect(allMessages[1].style.display).toBe('none');
        expect(allMessages[2].style.display).toBe('flex');
        expect(allMessages[3].style.display).toBe('none');
    });

    test('Date filter #1', () => {
        simulateSearch('"date:19/04/2026"');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('flex');
        expect(allMessages[1].style.display).toBe('none');
        expect(allMessages[2].style.display).toBe('none');
        expect(allMessages[3].style.display).toBe('none');
    });

    test('Date filter #2', () => {
        simulateSearch('"date:20/04/2026"');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('none');
        expect(allMessages[1].style.display).toBe('flex');
        expect(allMessages[2].style.display).toBe('flex');
        expect(allMessages[3].style.display).toBe('none');
    });

    test('Combination filter #1', () => {
        simulateSearch('"@Sprite" "Date:20/04/2026"')
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('none');
        expect(allMessages[1].style.display).toBe('flex');
        expect(allMessages[2].style.display).toBe('none');
        expect(allMessages[3].style.display).toBe('none');
    });

    test('Combination filter #2', () => {
        simulateSearch('"Date:20/04/2026" "@Book"')
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('none');
        expect(allMessages[1].style.display).toBe('none');
        expect(allMessages[2].style.display).toBe('flex');
        expect(allMessages[3].style.display).toBe('none');
    });

    test('Empty filter', () => {
        simulateSearch('');
        const allMessages = document.querySelectorAll('.message');
        expect(allMessages[0].style.display).toBe('flex');
        expect(allMessages[1].style.display).toBe('flex');
        expect(allMessages[2].style.display).toBe('flex');
        expect(allMessages[3].style.display).toBe('flex');
    });

    test('System filter: matches joined/left messages', () => {
        const msgContainer = document.getElementById('messages');
        const systemMsg = document.createElement('div');
        systemMsg.className = 'message system';
        systemMsg.style.display = 'flex'; // Initialize
        systemMsg.textContent = 'User123 joined the chat';
        msgContainer.appendChild(systemMsg);

        simulateSearch('joined');
        expect(systemMsg.style.display).toBe('flex');

        simulateSearch('left');
        expect(systemMsg.style.display).toBe('none');
    });

    test('Search suggestions show on opening quote', () => {
        const suggestions = document.getElementById('searchSuggestions');
        
        simulateSearch('"'); 
        expect(suggestions.classList.contains('show')).toBe(true);

        simulateSearch('"@Atom"'); 
        expect(suggestions.classList.contains('show')).toBe(false);
    });

    test('Clicking a suggestion replaces the last quote', () => {
        const input = document.getElementById('searchInput');
        const suggestions = document.getElementById('searchSuggestions');
        
        // 1. Manually add a suggestion item to the DOM
        suggestions.innerHTML = '<div class="suggestion-item" data-val="@Atom">@Atom</div>';
        
        // 2. Set input to a state with a quote
        input.value = 'hello "'; 
        
        // 3. Click the suggestion
        const item = suggestions.querySelector('.suggestion-item');
        item.click();

        // 4. Verify the quote was replaced by the keyword
        expect(input.value).toBe('hello @Atom');
        expect(suggestions.classList.contains('show')).toBe(false);
    });

    test('Clicking a suggestion appends keyword if no quote found', () => {
        const input = document.getElementById('searchInput');
        const suggestions = document.getElementById('searchSuggestions');
        
        suggestions.innerHTML = '<div class="suggestion-item" data-val="date:">date:</div>';
        
        // Set input to a state with NO quote
        input.value = 'search '; 
        
        const item = suggestions.querySelector('.suggestion-item');
        item.click();

        // Should just append
        expect(input.value).toBe('search date:');
    });

    test('Edge Case: Defensive guards and missing elements', () => {
        // 1. Test missing data fallbacks (Lines 47-49)
        const msgContainer = document.getElementById('messages');
        const brokenMsg = document.createElement('div');
        brokenMsg.className = 'message';
        brokenMsg.innerHTML = '<span>Empty Message</span>'; // No .msg-username or .body
        msgContainer.appendChild(brokenMsg);
        
        simulateSearch('anything'); 
        expect(brokenMsg.style.display).toBe('none');

        // 2. Test Suggestion Click Logic (Lines 63-66)
        const suggestions = document.getElementById('searchSuggestions');
        const input = document.getElementById('searchInput');
        
        // Inject a suggestion and click it
        suggestions.innerHTML = '<div class="suggestion-item" data-val="@Atom">Atom</div>';
        input.value = '"'; 
        const item = suggestions.querySelector('.suggestion-item');
        item.click(); 
        
        expect(input.value).toBe('@Atom');
    });

    test('Edge Case: Clicking outside a suggestion item', () => {
        const suggestions = document.getElementById('searchSuggestions');
        suggestions.innerHTML = '<div class="not-a-suggestion">I do nothing</div>';
        
        // This clicks the container but NOT a .suggestion-item
        // Covers the "false" branch of Line 63/64
        suggestions.querySelector('.not-a-suggestion').click();
        
        // If the code doesn't crash, the guard worked!
    });
});