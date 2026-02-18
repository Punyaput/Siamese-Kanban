# 🐈 Siamese - Kanban Project Management Tool

**Siamese** is a robust and responsive Project Management application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It provides a seamless Kanban board experience with drag-and-drop capabilities, allowing users to organize tasks, manage projects, and track progress efficiently.

![Project Preview](https://via.placeholder.com/800x400?text=Siamese+Kanban+Board+Preview)

---

## 📑 Table of Contents
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [License](#license)

---

## ✨ Key Features
* **Authentication**: Secure user registration and login using **JWT** and **Bcrypt**.
* **Workspace Management**: Create, rename, and delete multiple projects.
* **Interactive Kanban Board**:
    * Dynamic columns (categories).
    * **Drag & Drop** tasks between columns using `@hello-pangea/dnd`.
    * Auto-reordering of tasks within columns.
* **User Profile**: Update personal details and profile pictures via URL.
* **Responsive UI**: Modern interface built with React and CSS Modules.

---

## 🛠 Tech Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), React Router DOM, Axios, @hello-pangea/dnd |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JSON Web Token (JWT), Bcrypt.js |
| **Tools** | Git, Postman, VS Code |

---

## 📂 Project Structure

```bash
siamese-kanban/
├── backend/                # Server-side logic
│   ├── config/             # Database connection configurations
│   ├── controllers/        # Request handlers (Auth, Project, Task, Category)
│   ├── middlewares/        # Authentication middleware
│   ├── models/             # Mongoose schemas (User, Project, Task, Category)
│   ├── routes/             # API route definitions
│   └── server.js           # Entry point for the backend
│
└── frontend/               # Client-side application
    ├── public/             # Static assets
    └── src/
        ├── components/     # Reusable components (Navbar, Modal, TaskCard)
        ├── pages/          # Page views (Auth, Workspace, Project, Profile, Welcome)
        ├── App.jsx         # Main application component & Routing
        └── main.jsx        # DOM entry point

```

---

## 🚀 Installation & Setup

Follow these steps to run the project locally.

### Prerequisites

Ensure you have the following installed:

* [Node.js](https://nodejs.org/) (v14+)
* [MongoDB](https://www.mongodb.com/) (Local service or Atlas cluster)

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install

```

Create a `.env` file in the `backend` folder and add the following:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/siamese_db
JWT_SECRET=your_super_secure_secret_key

```

Start the server:

```bash
npm run dev
# Server will run on http://localhost:5000

```

### 2. Frontend Setup

Open a **new terminal** and navigate to the `frontend` directory:

```bash
cd frontend

```

Install the dependencies:

```bash
npm install

```

Start the React application:

```bash
npm run dev
# Client will run on http://localhost:5173 (or similar)

```

---

## 📡 API Reference

Here is a comprehensive list of available API endpoints.

### Authentication (`/api/auth`)

| Method |   Endpoint  |       Description       |                   Body Parameters                   |
| ------ | ----------- | ----------------------- | --------------------------------------------------- |
| `POST` | `/register` | Register a new user     | `{ user_id, password, firstName, lastName, email }` |
| `POST` | `/login`    | Login and receive Token | `{ user_id, password }`                             |
| `GET`  | `/me`       | Get current user info   | N/A (Requires Token)                                |
| `PUT`  | `/update`   | Update user profile     | `{ firstName, lastName, email, profileImage }`      |

### Projects (`/api/projects`)

|  Method  | Endpoint |     Description      | Body Parameters |
| -------- | -------- | -------------------- | --------------- |
| `GET`    | `/`      | Get all projects     | N/A             |
| `POST`   | `/`      | Create a new project | `{ name }`      |
| `PUT`    | `/:id`   | Rename a project     | `{ name }`      |
| `DELETE` | `/:id`   | Delete a project     | N/A             |

### Categories & Tasks (`/api/categories`, `/api/tasks`)

|  Method  |         Endpoint         |        Description        |      Body Parameters       |
| -------- | ------------------------ | ------------------------- | -------------------------- |
| `GET`    | `/categories/:projectId` | Get columns for a project | N/A                        |
| `POST`   | `/categories`            | Create a new column       | `{ name, projectId }`      |
| `GET`    | `/tasks/:categoryId`     | Get tasks in a column     | N/A                        |
| `POST`   | `/tasks`                 | Create a new task         | `{ title, categoryId }`    |
| `PUT`    | `/tasks/move/:id`        | Move/Reorder task         | `{ categoryId, newOrder }` |
| `DELETE` | `/tasks/:id`             | Delete a task             | N/A                        |

---

## 📝 Usage Guide

1. **Register/Login**: Create an account to access your personal workspace.
2. **Create Project**: Click "New Project" in the workspace to start a board.
3. **Manage Board**:
* Add columns (e.g., To Do, In Progress, Done).
* Add tasks to columns.
* **Drag and drop** tasks to update their status or priority.


4. **Profile**: Go to the profile page to update your information or avatar.

---

## 📄 License

This project is licensed under the **Thammasat License**.

Developed by **Phattaraphol Saeheng** - Software Engineering Student.

```

```




