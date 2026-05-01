# 🔐 Password Vault (Full Stack Secure Application)

## 📌 Overview

This project is a **secure password vault** built using Django (backend) and React (frontend). It allows users to store, retrieve, and manage their passwords securely using encryption and authentication mechanisms.

The focus of this project is not just functionality, but understanding **real-world security concepts** such as authentication, authorization, encryption, and secure API communication.

---

# 🚀 What I Learned

## 🔐 Authentication vs Authorization

* **Authentication**: Verifying user identity (login system)
* **Authorization**: Controlling access to protected resources (vault access)

✔ Implemented JWT-based authentication
✔ Protected routes using access tokens

---

## 📧 Custom Authentication (Email Login)

* Built a custom Django authentication backend
* Enabled login using **email instead of username**
* Understood Django’s authentication pipeline

---

## 🔑 JWT (JSON Web Tokens)

* Implemented stateless authentication
* Used:

  * Access tokens
  * Refresh tokens

✔ Tokens sent securely in request headers

---

## 🌐 REST API Development

* Designed backend using REST principles
* Implemented endpoints:

  * `/login`
  * `/register`
  * `/vault`

✔ Learned request-response cycle
✔ Used HTTP methods (GET, POST)

---

## 🔄 Axios Interceptors (Frontend)

* Automatically attach JWT tokens to requests
* Handle expired tokens globally (401 errors)

✔ Centralized API logic
✔ Reduced repetitive code

---

## 🔐 Encryption using Fernet

* Implemented symmetric encryption for stored passwords
* Encrypted before storing, decrypted when retrieving

✔ Learned:

* Hashing vs Encryption
* Secure data handling

---

## 🔑 Key Derivation from Master Password

* Derived encryption key from master password
* Used SHA-256 + Base64 encoding

✔ Ensured:

* Key is not stored
* Only correct master password can decrypt data

---

## 💾 Local Storage (Client-side Session)

* Stored JWT tokens in localStorage
* Automatically included tokens in requests

✔ Implemented logout by clearing tokens
✔ Managed session state

---

## 🧩 Full Stack Integration

* Connected React frontend with Django backend
* Used Axios for API communication

✔ Understood real-world architecture

---

## 🐞 Debugging & Problem Solving

* Fixed issues in:

  * Authentication
  * API communication
  * Frontend-backend mismatch

✔ Improved debugging skills

---

# ⚙️ How It Works

## 🔄 Authentication Flow

1. User logs in with email & password
2. Server validates credentials
3. JWT tokens are generated
4. Tokens stored in localStorage
5. Token sent with every API request

---

## 🔐 Vault Encryption Flow

1. User enters master password
2. Master password → converted into encryption key
3. Passwords encrypted before storing
4. On retrieval:

   * Key regenerated
   * Data decrypted

---

## 🔁 Request Flow

Frontend → Axios → Interceptor adds token → Backend verifies → Response returned

---

## 🚪 Logout / Session Expiry

* On token expiration (401):

  * Tokens are cleared
  * User redirected to login

---

# ⚠️ Architecture Note: Zero-Knowledge (Current Status)

This project is **not a full zero-knowledge password manager**.

Instead, it is a **basic implementation inspired by zero-knowledge principles**.

## 🧠 What is implemented

* Passwords are encrypted before storage
* Encryption key is derived from the master password
* Plaintext passwords are never stored

## ⚠️ What is missing (for true zero-knowledge)

* Strong key derivation (PBKDF2/bcrypt with salt & iterations)
* Client-side-only encryption
* Complete isolation from backend access to decrypted data
* Advanced key management

## 📌 Current Level

👉 This is a **foundational / learning-level zero-knowledge design**, not production-grade

---

# ⚠️ Security Considerations

## Current Limitations

* Uses SHA-256 without salt (can be improved)
* Tokens stored in localStorage (XSS risk)

---

## Planned Improvements

* Use PBKDF2/bcrypt for key derivation
* Add salt + iterations
* Implement HTTP-only cookies
* Add refresh token rotation
* Add rate limiting

---

# 🎨 Future Frontend Improvements (AI Integration)

* Use AI tools to design UI/UX
* Build a modern, responsive interface
* Improve usability along with security

---

# 🧭 Key Takeaways

* Built a real-world authentication system
* Understood encryption fundamentals
* Learned secure API communication
* Gained full-stack development experience

---

# 📌 Tech Stack

* Backend: Django, Django REST Framework
* Frontend: React, Axios
* Security: JWT, Fernet Encryption

---

# 🚀 Future Enhancements

* Password generator
* Search functionality
* Master password re-authentication
* Multi-user encryption support

---

# 💡 Final Thought

This project helped me move from writing code to **understanding systems**, especially in authentication and security, aligning with my goal of pursuing cybersecurity.

---
