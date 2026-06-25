# 🌱 ECOISTIC FRIENDLY — Plant Collection App

A mobile-friendly MERN stack application for tracking plant growth.

---

## 📁 Project Structure

```
ecoistic/
├── server/          ← Express + MongoDB backend
│   ├── index.js
│   ├── models/Plant.js
│   ├── routes/plants.js
│   ├── uploads/     ← Auto-created, stores all media
│   └── .env
└── client/          ← React frontend
    └── src/
        ├── App.js
        ├── App.css
        ├── context/AppContext.js
        ├── components/
        │   ├── Sidebar.js
        │   ├── TopBar.js
        │   ├── SplashScreen.js
        │   ├── PasswordModal.js
        │   ├── FloatingLeaves.js
        │   └── Toast.js
        └── pages/
            ├── HomePage.js
            ├── HistoryPage.js
            ├── AboutPage.js
            ├── UploadPage.js
            └── SettingsPage.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB running locally OR MongoDB Atlas URI

### 1. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/ecoistic
PORT=5000
```

For MongoDB Atlas, replace with your connection string.

### 3. Start the App

**Terminal 1 — Server:**
```bash
cd server
npm run dev
```

**Terminal 2 — Client:**
```bash
cd client
npm start
```

App opens at: **http://localhost:3000**

---

## 🔐 Admin Password
Hardcoded: **123456**
Used for: Upload, Edit, Delete actions.

---

## 📱 Features

| Feature | Description |
|---|---|
| Splash Screen | 2.8s animated splash with falling leaves |
| Sidebar | Collapsible left sidebar, closed by default |
| Home | Auto-carousel (4s), stats, activity feed |
| Upload | Password protected, supports 20+ photos/videos |
| Success History | Table with trimesters, edit & delete |
| About Us | Plant benefits, contact info |
| Settings | Dark/Light mode toggle + all options |

---

## 🛠 Tech Stack

- **Frontend:** React 18, React Router v6
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **File Upload:** Multer
- **Styling:** Pure CSS with CSS Variables (no UI library)

---

Made with 💚 for a Greener Tomorrow
