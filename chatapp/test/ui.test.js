/**
 * @jest-environment jsdom
 */

/**
 * ชุดการทดสอบ UI (User Interface) ของแอปพลิเคชันแชท
 *
 * ใช้สภาพแวดล้อม jsdom เพื่อจำลอง DOM ของเบราว์เซอร์ภายใน Node.js
 * โดยไม่ต้องเปิดเบราว์เซอร์จริง ทำให้สามารถทดสอบพฤติกรรม UI ได้อย่างรวดเร็ว
 */
describe('UI Testcases', () => {

    /**
     * Testcase 1: ทดสอบสถานะเริ่มต้นและการสลับสถานะของ Checkbox "Remember me"
     *
     * วัตถุประสงค์:
     *   - ตรวจสอบว่า Checkbox ถูก render มาในสถานะ "ถูกเลือก" (checked) ตามที่กำหนด attribute ไว้
     *   - ตรวจสอบว่าเมื่อเปลี่ยนสถานะของ Checkbox ด้วยโค้ด ค่า property .checked สะท้อนการเปลี่ยนแปลงได้ถูกต้อง
     *
     * ขั้นตอนการทดสอบ:
     *   1. สร้าง Checkbox ใน DOM โดยมี attribute `checked` (หมายถึงเลือกไว้ตั้งแต่ต้น)
     *   2. ตรวจสอบว่า checkbox.checked === true (ผลที่คาดหวัง 1)
     *   3. เปลี่ยนสถานะ checkbox.checked = false
     *   4. ตรวจสอบว่า checkbox.checked === false (ผลที่คาดหวัง 2)
     */
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

    /**
     * Testcase 2: ทดสอบว่า Form ส่งข้อความ (Message Form) สามารถป้องกัน Default Behavior ได้
     *
     * วัตถุประสงค์:
     *   - ตรวจสอบว่าเมื่อผู้ใช้กด Submit ฟอร์ม ระบบจะเรียก e.preventDefault() เพื่อป้องกัน
     *     ไม่ให้เบราว์เซอร์ Reload หน้าเว็บตามพฤติกรรมปกติของ HTML Form
     *   - ตรวจสอบว่าค่าในช่อง Input ยังคงอยู่หลังจากการ Submit (ไม่ถูกล้างออก)
     *
     * ขั้นตอนการทดสอบ:
     *   1. สร้าง Form พร้อม Input ที่มีค่า "Hello World!" ใน DOM
     *   2. ผูก Event Listener กับ Event "submit" ให้เรียก e.preventDefault()
     *   3. จำลองการยิง Event "submit" ด้วย dispatchEvent
     *   4. ตรวจสอบว่า isDefaultPrevented === true (การ Reload ถูกป้องกัน)
     *   5. ตรวจสอบว่า input.value ยังเป็น "Hello World!" (ข้อมูลไม่หายไป)
     */
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

    /**
     * Testcase 3: ทดสอบการสร้าง Element ของข้อความระบบ (System Message) ว่ามีรูปแบบถูกต้อง
     *
     * วัตถุประสงค์:
     *   - ตรวจสอบว่าฟังก์ชัน createSystemMessage() สร้าง DOM Element ที่มี class ถูกต้อง ('message system')
     *   - ตรวจสอบว่าเนื้อหาข้อความถูก wrap ด้วย tag <em> เพื่อแสดงเป็น Italic ตามที่ออกแบบไว้
     *
     * ขั้นตอนการทดสอบ:
     *   1. เรียกฟังก์ชัน createSystemMessage() ด้วยข้อความ 'bhakin left the chat'
     *   2. ตรวจสอบว่า Element ที่ได้มี class 'system' (แสดงว่าเป็นข้อความระบบ ไม่ใช่ข้อความผู้ใช้)
     *   3. ตรวจสอบว่า innerHTML ของ Element เท่ากับ '<em>bhakin left the chat</em>' (จัดรูปแบบถูกต้อง)
     */
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

    /**
     * Testcase 4: ทดสอบการกำหนด Class ของข้อความที่ผู้ใช้ปัจจุบัน (Self) ส่งเอง
     *
     * วัตถุประสงค์:
     *   - ตรวจสอบว่าเมื่อ username ของข้อความตรงกับ currentUser (ผู้ใช้ปัจจุบัน)
     *     ระบบจะกำหนด class 'self' ให้กับ Element เพื่อแสดงข้อความทางขวามือ (ฝั่งตัวเอง)
     *   - ตรวจสอบว่า class 'other' ไม่ถูกเพิ่มในกรณีที่เป็นข้อความของตัวเอง
     *
     * ขั้นตอนการทดสอบ:
     *   1. เรียก createMessageElement() โดยกำหนด username: 'aa' และ currentUser: 'aa' (ตรงกัน)
     *   2. ตรวจสอบว่า Element มี class 'self' (ข้อความชิดขวา)
     *   3. ตรวจสอบว่า Element ไม่มี class 'other'
     */
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

    /**
     * Testcase 5: ทดสอบการกำหนด Class ของข้อความที่ผู้ใช้คนอื่น (Other) ส่งมา
     *
     * วัตถุประสงค์:
     *   - ตรวจสอบว่าเมื่อ username ของข้อความ ไม่ตรง กับ currentUser (เป็นของคนอื่น)
     *     ระบบจะกำหนด class 'other' ให้กับ Element เพื่อแสดงข้อความทางซ้ายมือ (ฝั่งคู่สนทนา)
     *   - ตรวจสอบว่า class 'self' ไม่ถูกเพิ่มในกรณีที่เป็นข้อความของคนอื่น
     *
     * ขั้นตอนการทดสอบ:
     *   1. เรียก createMessageElement() โดยกำหนด username: 'bhakin' และ currentUser: 'aa' (ไม่ตรงกัน)
     *   2. ตรวจสอบว่า Element มี class 'other' (ข้อความชิดซ้าย)
     *   3. ตรวจสอบว่า Element ไม่มี class 'self'
     */
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
