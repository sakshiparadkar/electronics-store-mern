## ⚡ Swastik Electronics — MERN Stack Project

Swastik Electronics is a full-stack e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js).

This project simulates a real-world online electronics store where users can explore products, add them to cart, and complete purchases securely. It was developed as part of my learning to understand how frontend and backend systems work together in a complete application.

## 🚀 Project Overview

The application allows users to browse a variety of electronic products with a clean and responsive interface. It includes features like authentication, cart management, and online payments to give a practical understanding of real-world e-commerce workflows.

I also experimented with AI-based search functionality using vector search tools, making product discovery more efficient compared to traditional keyword search.

## ✨ Features

1) Product Browsing — View and explore different electronics

2) Search Functionality — AI-powered product search

3) Cart System — Add/remove items and manage cart

4) Secure Checkout — Integrated with Stripe payment gateway

5) Order Tracking — View orders after purchase

6) Authentication — User login, registration, and password reset

7) Responsive UI — Works across mobile, tablet, and desktop

## 🛠️ Tech Stack

Frontend |React | React Router

Backend |Node.js |Express.js |MongoDB + MongooseJWT Authentication 

Additional Tools |Swagger (API documentation)| Pinecone + FAISS (for AI search implementation)

## 📁 Folder Structure

electronics-store-mern/

├── backend/

├── src/

├── public/

└── package.json


## ⚙️ How to Run the Project

1. Clone the Repository
   
git clone https://github.com/sakshiparadkar/electronics-store-mern.git

cd electronics-store-mern

2. Install Dependencies

Backend:

cd backend

npm install

Frontend:

cd ..

npm install

3. Setup Environment Variables

Create a .env file inside backend/:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret

STRIPE_SECRET_KEY=your_key

4. Run the Project

Start backend:

cd backend

npx nodemon index.js

Start frontend (new terminal):

npm start

5. Open in Browser
   
http://localhost:3000


## 🎯 What I Learned

1.Building a complete full-stack application

2.Managing frontend-backend communication

3.Implementing authentication using JWT

4.Integrating payment gateway (Stripe)

5.Working with databases and APIs

6.Exploring AI-based search concepts

## 📜 Note

This is a student project created for learning purposes.
It may not be production-ready but demonstrates practical implementation of modern web development concepts.

