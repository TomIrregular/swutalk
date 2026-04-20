const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const messages = document.getElementById('messages');

/**
 * Handles the visibility of the "Accessibility" suggestion menu
 */
function showSearchSuggestions(rawSearch) {
    /* istanbul ignore next */
    if (!searchSuggestions) return;
    const quotes = (rawSearch.match(/"/g) || []).length;
    if (quotes % 2 !== 0 && !rawSearch.includes('"@') && !rawSearch.includes('"date:')) {
        searchSuggestions.classList.add('show');
    } else {
        searchSuggestions.classList.remove('show');
    }
}

/* istanbul ignore next */
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const rawSearch = e.target.value.toLowerCase();
        
        const userMatch = rawSearch.match(/"@([^"]+)"/);
        const dateMatch = rawSearch.match(/"date:([^"]+)"/);
        
        let textSearch = rawSearch
            .replace(/"@[^"]*"/g, '') 
            .replace(/"date:[^"]*"/g, '')
            .replace(/"/g, '') 
            .trim();

        const targetUser = userMatch ? userMatch[1].toLowerCase() : null;
        const targetDate = dateMatch ? dateMatch[1].toLowerCase() : null;
        
        /* istanbul ignore next */
        if (!messages) return;
        const allMessages = messages.getElementsByClassName('message');

        Array.from(allMessages).forEach((msg) => {
            if (msg.classList.contains('system')) {
                const matchesSystem = msg.textContent.toLowerCase().includes(rawSearch);
                msg.style.display = matchesSystem ? 'flex' : 'none';
                return;
            }

            const usernameText = msg.querySelector('.msg-username')?.textContent.toLowerCase() || '';
            const messageText = msg.querySelector('.body')?.textContent.toLowerCase() || '';
            const dateText = msg.querySelector('.msg-time')?.textContent.toLowerCase() || '';

            const matchesUser = !targetUser || usernameText.includes(targetUser);
            const matchesDate = !targetDate || dateText.includes(targetDate);
            const matchesText = !textSearch || messageText.includes(textSearch);

            msg.style.display = (matchesUser && matchesDate && matchesText) ? 'flex' : 'none';
        });

        showSearchSuggestions(rawSearch);
    });
}

// Logic for clicking suggestions
/* istanbul ignore next */
if (searchSuggestions) {
    searchSuggestions.addEventListener('click', (e) => {
        const suggestion = e.target.closest('.suggestion-item');
        /* istanbul ignore next */
        if (suggestion && searchInput) {
            const keyword = suggestion.getAttribute('data-val');
            const currentVal = searchInput.value;
            const lastQuoteIdx = currentVal.lastIndexOf('"');
            
            if (lastQuoteIdx !== -1) {
                searchInput.value = currentVal.substring(0, lastQuoteIdx) + keyword;
            } else {
                searchInput.value += keyword;
            }
            
            searchSuggestions.classList.remove('show');
            searchInput.focus();
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
}