## ⭐ Swastik Electronics — MERN Stack E-Commerce Project

## 📌 Project Overview

Swastik Electronics is a full-stack e-commerce web application developed using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

The project simulates a real-world online electronics store where users can browse products, manage carts, place orders, and complete secure online payments. It was developed to gain practical experience in full-stack application development, authentication systems, API integration, and e-commerce workflows.

This project also explores AI-powered product search using vector search technologies to improve product discovery beyond traditional keyword-based search systems.

## 🎓 Academic Context

This project was developed as my **First Year Master’s Field Project** during my MSc in Computer Science. The goal of the project was to gain hands-on experience in full-stack web development, real-world e-commerce workflows, authentication systems, payment integration, and AI-based search implementation.

## 🎯 Objectives

1.Build a complete full-stack e-commerce application

2.Implement secure authentication and authorization

3.Integrate online payment gateway functionality

4.Explore AI-based product search concepts

5.Create a responsive and user-friendly shopping experience

6.Understand frontend-backend communication in real-world applications

## ✨ Key Features

🛒 E-Commerce Functionality

* Browse and explore electronic products
* Product search and filtering
* Add and remove items from cart
* Secure checkout process
  
🔍 AI-Based Product Search
* Intelligent product discovery system
* Vector search implementation using Pinecone & FAISS
* Improved search relevance compared to traditional search
  
🔐 Authentication System
* User registration and login
* JWT-based authentication
* Password reset functionality
* Protected user routes
  
💳 Payment Integration
* Secure online payments using Stripe
* Order confirmation workflow
* Order history tracking
  
📱 Responsive User Interface
* Mobile-friendly design
* Optimized layouts for desktop, tablet, and mobile devices
  
📄 API Documentation
* Swagger integration for API documentation and testing

## 📸 Application Screenshots
## home.png
![image_alt](https://github.com/sakshiparadkar/electronics-store-mern/blob/25423f7550d72a4d367943f57bbda3312a1a5fac/imgs/home.png)
## register.png
![image_alt](https://github.com/sakshiparadkar/electronics-store-mern/blob/25423f7550d72a4d367943f57bbda3312a1a5fac/imgs/register.png)
## products.png
![image_alt](https://github.com/sakshiparadkar/electronics-store-mern/blob/42beb04885f191782f071a4a7b4bdb3c596863ef/imgs/products_list.png)
## cart.png
![image_alt](https://github.com/sakshiparadkar/electronics-store-mern/blob/25423f7550d72a4d367943f57bbda3312a1a5fac/imgs/cart.png
)
## checkout.png
![image_alt](https://github.com/sakshiparadkar/electronics-store-mern/blob/25423f7550d72a4d367943f57bbda3312a1a5fac/imgs/checkout-pg.png)
## live-tracking.png
![image_alt](https://github.com/sakshiparadkar/electronics-store-mern/blob/42beb04885f191782f071a4a7b4bdb3c596863ef/imgs/live-tracking.png
)
## 🛠️ Tech Stack

Frontend | React.js | React Router | HTML5 | CSS3 | JavaScript

Backend | Node.js | Express.js | MongoDB | Mongoose | JWT Authentication

Additional Tools | Stripe | Swagger | Pinecone | FAISS 

## ⚙️ System Workflow

-User browses or searches products

-Product data is fetched from MongoDB

-Users can add products to the cart

-Authentication validates secure access

-Stripe handles payment processing

-Orders are stored and tracked in the database

-AI-based search improves product discovery experience

## 📂 Project Structure
```
electronics-store-mern/
│
├── backend/
│
├── src/
│
├── public/
│
└── package.json
```

## 🚀 How to Run the Project
# 🚀 How to Run the Project

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/sakshiparadkar/electronics-store-mern.git
cd electronics-store-mern
```

---

## 2️⃣ Install Dependencies

###  Backend Setup

```bash
cd backend
npm install
```

###  Frontend Setup

```bash
cd ..
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file inside the `backend/` directory and add the following:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 4️⃣ Run the Application

### ▶️ Start Backend Server

```bash
cd backend
npx nodemon index.js
```

### 💻 Start Frontend

Open a new terminal and run:

```bash
npm start
```

---

# 🌐 Open in Browser

```bash
http://localhost:3000
```

## 💡 Key Learnings

* Building complete full-stack MERN applications
* Managing frontend-backend communication
* Implementing JWT-based authentication
* Integrating Stripe payment gateway
* Working with MongoDB and REST APIs
* Understanding AI-powered search concepts
* Structuring scalable web applications

## 🔮 Future Enhancements

* Admin dashboard for product management
* Product reviews and ratings
* Wishlist functionality
* Advanced recommendation system
* Cloud deployment and scalability improvements
* Enhanced analytics and reporting

## 📄 Disclaimer

This project was created for educational and learning purposes. While it demonstrates practical implementation of modern web development concepts, additional optimization and security improvements would be required for production deployment.

## 👩‍💻 Author

Sakshi Paradkar
Computer Science Student
