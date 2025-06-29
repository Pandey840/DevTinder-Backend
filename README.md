# DevTinder Backend

DevTinder is a developer matchmaking platform inspired by Tinder, designed to connect developers for collaboration, learning, and projects. This is the backend codebase built with Node.js, Express.js, and MongoDB.

---

## 🚀 Tech Stack

### 🧰 Core Technologies
- **Node.js** – JavaScript runtime environment
- **Express.js** – Fast, minimalist backend framework
- **MongoDB** – NoSQL document database
- **Mongoose** – MongoDB object modeling for Node.js

### 🔐 Authentication & Security
- **bcryptjs** – Password hashing
- **jsonwebtoken (JWT)** – Secure access and refresh token generation
- **cookie-parser** – Parse cookies for token handling
- **validator** – Input and email validation
- **http-errors** – Custom and consistent error responses

### 📬 Mailing & OTP
- **@sendgrid/mail** – Send OTP emails securely
- **handlebars** – Templating engine for email HTML

### ⚡ Real-time Communication *(Planned/Optional)*
- **Socket.IO** – Real-time notifications and chat (to be integrated)

### 📦 Utilities & Middleware
- **dotenv** – Manage environment variables
- **cors** – Enable CORS for API requests
- **crypto** – Secure token/OTP generation

### 🧪 Dev & Testing Tools
- **nodemon** – Auto-reload server in development
- **@faker-js/faker** – Generate dummy data for testing
- **prettier** – Code formatting and consistency

---

🧠 Developer Notes
This project is structured using industry best practices:

Modular and scalable file structure

Environment-based configuration

Middleware-driven route protection

Real-time Socket.IO communication layer

Clean separation of concerns (routes, controllers, models, utils)

## ✍️ Author

**Dhiraj Pandey**  
Full Stack Developer  
📧 [dhirajpandey37@gmail.com](mailto:dhirajpandey37@gmail.com)  
🌐 [LinkedIn](https://linkedin.com/in/dhiraj-pandey-478aa9231/)
