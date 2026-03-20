Swastiik Electronics
A MERN-Stack E-commerce Application

Welcome to Swastiik Electronics, a full-stack e-commerce web application built using the MERN stack:

MongoDB – Database

Express.js – Backend framework

React.js – Frontend UI

Node.js – Server runtime

This project was built to learn and demonstrate how a real online shopping website works, from browsing products to checkout and order confirmation.

🔗 Live Project

Frontend: http://localhost:3000
 (local)

Backend API: http://localhost:5000
 (local)

This project can also be deployed on Vercel / Render, but it works fully on local machine.

🏪 About Swastiik Electronics

Swastiik Electronics is an online electronics store where users can:

Browse electronic products

Search and filter items

Add products to cart

Checkout and place orders

Track orders

Register & login

View order history

The goal was to build a real-world e-commerce flow, not just UI screens.

🖥️ User Interface Pages

Home Page

Product Listing

Product Details

Cart

Checkout

Order Success

Order Tracking

Login / Register

Support / About

Terms & Privacy

Footer with brand info

All pages are responsive and work on mobile and desktop.

✨ Main Features (Easy Explanation)
🛍️ Product System

Products stored in MongoDB

Each product has:

Name

Price (converted to INR ₹)

Brand (Swastiik)

Category

Description

Image

🛒 Cart System

Add products to cart

Update quantity

Remove products

Cart total updates automatically

💳 Checkout System

User enters:

Name

Email

Address

Card details (demo only)

Card validation using Luhn algorithm

No real payment gateway (safe for learning)

✅ Order Confirmation

Shows:

Order number

Items purchased

Total amount (₹ INR)

Estimated delivery date

🔍 Product Search

Search by name, brand, category

Fast and responsive

👤 Authentication

User registration

Login with JWT

Protected pages

Forgot & reset password

🤖 Product Recommendations (Simple Explanation)

We used vector search to recommend similar products.

How it works:

Product data is converted into embeddings

Stored in Pinecone / Weaviate

When a user views a product:

Similar products are suggested automatically

If vector service is unavailable, the app falls back to normal recommendations.

🧰 Technologies Used
Frontend

React.js

Material-UI

React Router

Axios

React Hook Form

React Toastify

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Bcrypt

Swagger API Docs

Extras

Pinecone / Weaviate (recommendations)

Docker

GitHub Actions

Jest (testing)

📁 Project Structure (Simple View)
fullstack-ecommerce/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── seed/
│   └── index.js
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── index.js
│
├── public/
└── package.json


Create .env file:

MONGO_URI=mongodb://localhost:27017/swastiik-db
JWT_SECRET=your_secret


Seed products:

cd seed
node productSeeds.js
Start backend:

cd ..
npm start

Open browser:

http://localhost:3000
