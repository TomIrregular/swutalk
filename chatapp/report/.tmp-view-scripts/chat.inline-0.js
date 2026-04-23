/* extracted from views/chat.ejs */
// Constants
        const socket = io();
        const username = '"__EJS_TEMPLATE__"';
        const messages = document.getElementById('messages');
        const messageForm = document.getElementById('messageForm');
        const messageInput = document.getElementById('messageInput');
        const usersList = document.getElementById('usersList');
        const searchInput = document.getElementById('searchInput');

        // Track last messages per user
        const lastMessages = {};

        // SVG icons
        const userAvatarSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>`;

        // Join + Disconnect
        socket.emit('join', username);

        window.addEventListener('beforeunload', () => {
            socket.disconnect();
        });

        // ── Helper: create a message element ──
        function createMessageElement(data) {
            const now = new Date();
            const isSelf = data.username === username;
            
            let dateVal = '';
            let timeVal = '';
            if (data.time) {
                if (data.time.includes(',')) {
                    const parts = data.time.split(', ');
                    dateVal = parts[0];
                    timeVal = parts[1];
                } else {
                    timeVal = data.time;
                    dateVal = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
                }
            } else {
                timeVal = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                dateVal = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
            }

            // Store as last message
            lastMessages[data.username] = data.message;
            refreshUserCards();

            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + (isSelf ? 'self' : 'other');

            messageDiv.innerHTML = `
                <div class="msg-avatar">${userAvatarSVG}</div>
                <div class="msg-content">
                    <span class="msg-username">${data.username}</span>
                    <div class="msg-bubble"><span class="body">${data.message}</span></div>
                    <span class="msg-date" style="display:none;">${dateVal}</span>
                    <span class="msg-time time">${dateVal} ${timeVal}</span>
                </div>
            `;

            return messageDiv;
        }

        // ── Helper: create a system message ──
        function createSystemMessage(text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message system';
            messageDiv.innerHTML = `<em>${text}</em>`;
            return messageDiv;
        }

        // ── Message form submit ──
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (messageInput.value) {
                socket.emit('chat message', { message: messageInput.value });
                messageInput.value = '';
            }
        });

        // ── Search listener ──
        const searchSuggestions = document.getElementById('searchSuggestions');
        
        function showSearchSuggestions(rawSearch) {
            // Hide suggestions only when a complete keyword is already typed
            const hasCompleteKeyword = rawSearch.includes('"@') || rawSearch.includes('"date:');
            if (hasCompleteKeyword) {
                searchSuggestions.classList.remove('show');
            }
            // Otherwise keep whatever state it's currently in (shown on focus)
        }

        // Show suggestions immediately on focus
        searchInput.addEventListener('focus', () => {
            searchSuggestions.classList.add('show');
        });

        searchInput.addEventListener('input', (e) => {
            const rawSearch = e.target.value.toLowerCase();
            
            const userMatch = rawSearch.match(/"@([^"]+)"/);
            const dateMatch = rawSearch.match(/"date:([^"]+)"/);
            
            let textSearch = rawSearch.replace(/"@[^"]*"?/g, '').replace(/"date:[^"]*"?/g, '').trim();
            const targetUser = userMatch ? userMatch[1].toLowerCase() : null;
            const targetDate = dateMatch ? dateMatch[1].toLowerCase() : null;
            
            const allMessages = messages.getElementsByClassName('message');

            Array.from(allMessages).forEach((msg) => {
                if (msg.classList.contains('system')) {
                    msg.style.display = msg.textContent.toLowerCase().includes(rawSearch) ? 'flex' : 'none';
                    return;
                }
                const usernameText = msg.querySelector('.msg-username').textContent.toLowerCase() || '';
                const messageText = msg.querySelector('.body').textContent.toLowerCase() || '';
                const dateText = msg.querySelector('.msg-date').textContent.toLowerCase() || '';

                const matchesUser = !targetUser || usernameText.includes(targetUser);
                const matchesDate = !targetDate || dateText.includes(targetDate);
                const matchesText = !textSearch || messageText.includes(textSearch);

                msg.style.display = (matchesUser && matchesDate && matchesText) ? 'flex' : 'none';
            });
            showSearchSuggestions(rawSearch);
        });

        document.addEventListener('click', (e) => {
            if (e.target !== searchInput && !searchSuggestions.contains(e.target)) {
                searchSuggestions.classList.remove('show');
            }
        });

        searchSuggestions.addEventListener('click', (e) => {
            const suggestion = e.target.closest('.suggestion-item');
            if (suggestion) {
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
                searchInput.dispatchEvent(new Event('input'));
            }
        });

        // ── Chat history ──
        socket.on('chat history', (history) => {
            history.forEach(data => {
                const el = createMessageElement(data);
                messages.appendChild(el);
            });
            messages.scrollTop = messages.scrollHeight;
        });

        // ── New chat message ──
        socket.on('chat message', (data) => {
            const el = createMessageElement(data);
            messages.appendChild(el);
            messages.scrollTop = messages.scrollHeight;
        });

        // ── User joined / left ──
        socket.on('user joined', (user) => {
            messages.appendChild(createSystemMessage(`${user} joined the chat`));
            messages.scrollTop = messages.scrollHeight;
        });

        socket.on('user left', (user) => {
            messages.appendChild(createSystemMessage(`${user} left the chat`));
            messages.scrollTop = messages.scrollHeight;
        });

        // ── User list (with cards) ──
        let currentUsers = [];

        function refreshUserCards() {
            usersList.innerHTML = '';
            currentUsers.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'user-item';

                const lastMsg = lastMessages[user] || 'last message from me';

                userDiv.innerHTML = `
                    <div class="user-avatar">${userAvatarSVG}</div>
                    <div class="user-info">
                        <div class="user-name">${user}</div>
                        <div class="user-last-msg">${lastMsg}</div>
                    </div>
                `;
                usersList.appendChild(userDiv);
            });
        }

        socket.on('users update', (users) => {
            currentUsers = users;
            refreshUserCards();
        });
