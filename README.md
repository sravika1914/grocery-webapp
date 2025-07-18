# 🛒 Grocery Web App

Welcome to the **Grocery Web App** – your one-stop virtual supermarket. This full-stack application allows users to shop for fresh groceries online with features like product search, cart management, order tracking, and admin dashboard management.

---

## 📽️ Demo

🎥 Watch the project demo:  
[🔗 Grocery Web App Demo](https://drive.google.com/file/d/1HLowcIqs2d8lxTprS2jqPmR4AOnUW8xD/view?usp=drive_link)

💻 Source Code:  
[🔗 Project Folder](https://drive.google.com/drive/folders/1RP-29p9mf-bbLAK5r7S4HSF_Itai0i1G?usp=drive_link)

---

## 🌟 Features

### 👤 User
- Account registration & login
- Browse & search for products
- Add to cart & place orders
- Secure payments
- Track order status
- Leave product reviews

### 🛒 Admin
- Manage product listings
- View and manage all orders
- Access user database
- Monitor sales analytics
- Provide customer support

---

## 🧱 Tech Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Frontend       | React.js, Bootstrap, React Router |
| Backend        | Node.js, Express.js            |
| Database       | MongoDB, Mongoose              |
| Authentication | JWT, bcrypt                    |
| Styling        | CSS, React-Bootstrap           |

---

## 🧰 Setup Instructions

### 🔧 Backend

```bash
cd backend
npm install
npm start
💻 Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
Access the app at: http://localhost:5173

🧪 Sample User Flow (Use Case)
Meet Priya, a busy professional who wants fresh groceries delivered:

Signs up and logs in

Browses through categorized products

Adds items to cart

Pays using secure gateway

Tracks her order in real time

Rates products and reorders easily

🏗️ Architecture Overview
The app follows a client-server model:

Frontend (React) handles UI & user interaction

Backend (Express) handles logic, APIs, and DB access

MongoDB stores users, products, orders, etc.

Communication via RESTful APIs

🧮 Database Models (Schemas)
javascript
Copy
Edit
User: { firstname, lastname, username, email, password }

Product: { productname, description, price, image, category, stock, rating }

Category: { name, description }

Order: { user, products, total, status, address, createdAt }

AddToCart: { userId, productId, quantity }
📋 Key Functionalities
🧾 Product catalog with categories and filters

🛒 Shopping cart and multi-method checkout

📦 Real-time order tracking

⭐ Ratings and reviews

🧑‍💻 Admin dashboard for order & inventory management

⚙️ Project Milestones
Project Setup – React, Node.js, MongoDB configured

Backend Development – Routes, models, APIs created

Frontend UI – Components, navigation, routing setup

Database Integration – MongoDB models linked

Authentication – JWT login, register, logout

Testing & Bug Fixes – Final review and improvements

🚀 Getting Started (Quick Start)
Prerequisites
Node.js: Install

MongoDB: Install

Git (optional): Install

Code Editor: VS Code / Sublime / WebStorm

Run Instructions
bash
Copy
Edit
git clone <your-repo-url>
cd grocery-webapp

# Backend
cd backend
npm install
npm start

# Frontend
cd ../frontend
npm install
npm run dev
👨‍💻 Roles & Responsibilities
Users
Register, log in, shop, and place orders

Manage their profile, orders, and reviews

Admin
Add/edit/delete products

Manage orders, users, and inventory

View analytics and customer feedback

🛠️ Packages Used
Frontend:
Axios

React Router DOM

React Icons

Bootstrap

React-Bootstrap

Backend:
Express

Mongoose

CORS

Bcrypt

Dotenv

JSON Web Token (JWT)

📂 Project Structure
bash
Copy
Edit
grocery-webapp/
│
├── frontend/      # React client
├── backend/       # Express server & MongoDB models
└── README.md
🙋‍♀️ Author
Sravika Kadali
Cybersecurity Engineering Student | Full Stack Developer
📧 sravikakadali@gmail.com
🔗 GitHub

📄 License
Licensed under the MIT License.

💬 “Experience the future of grocery shopping — from your screen to your doorstep!”
