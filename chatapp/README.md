## Step by step on how to use website  
1. สร้าง .env เเละใส่เข้าไปตามนี้  
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SESSION_SECRET=

2. เข้า google api https://console.cloud.google.com/apis/credentials?  
เลือกโปรเจคหรือสร้างใหม่จากนั้น สร้าง OAuth consent screen ถ้าไม่เคยทำ 

3. สร้าง OAuth 2.0 Client IDs ตรง Credentials เเละอย่าลืมเพิ่ม  
http://localhost:3000/auth/google/callback   
ที่ Authorized redirect URIs จะได้ 2 อันเเรกใน .env file มา  

4. SESSION_SECRET เป็นรหัสลับสร้างเองเลย อะไรก็ได้เดี๋ยวจะมีผลทีหลัง  