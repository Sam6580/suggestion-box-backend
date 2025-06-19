# 📬 Suggestion Box Backend

A smart backend system for managing suggestions using **AI-generated replies**, **impact scoring**, and **email responses**. Designed for academic institutions or organizations that want to streamline student/staff feedback efficiently.

---

## 🔥 Features

- ✅ **Suggestion submission** with name, email, and message
- 🤖 **AI-generated reply** using OpenRouter (ChatGPT 3.5)
- 📊 **Impact score** automatically rated from 1 to 10
- 📧 **Email response module** for admin replies
- 🔐 Simple login support with admin role access
- 📁 Admin dashboard to view and respond to suggestions

---

## 🚀 Demo Screenshot

![Screenshot 2025-05-13 185632](https://github.com/user-attachments/assets/2fcb2331-2060-422d-9e49-c55bd836c419)
![Screenshot 2025-05-13 185710](https://github.com/user-attachments/assets/455b95dc-76ce-4342-9b1c-6e3124603218)
![Screenshot 2025-05-13 185802](https://github.com/user-attachments/assets/3efd9aa5-afb6-4cf2-89cd-ce6c23d8af07)


![Admin Dashboard](https://github.com/Sam6580/suggestion-box-backend/blob/main/public/screenshot.png)

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **AI Integration**: OpenRouter API (ChatGPT 3.5)
- **Email Service**: Nodemailer
- **Frontend**: HTML, CSS, JS (served via `public/` folder)
- **Authentication**: Basic hardcoded user login (admin & student)

---

## 📦 Installation

```bash
git clone https://github.com/Sam6580/suggestion-box-backend.git
cd suggestion-box-backend
npm install
