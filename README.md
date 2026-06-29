# 🔥 BlogForge

A full-stack blog platform where users can write, share, and engage with blog posts. Built with React and Spring Boot.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen?style=flat&logo=springboot)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat&logo=mysql)

---

## ✨ Features

- 🔐 **Authentication** — Register, login with JWT-based security
- ✍️ **Posts** — Create, edit, delete, and browse blog posts with image uploads
- 💬 **Comments** — Nested comment threads with reply support
- 👍 **Likes** — LinkedIn-style like/unlike on posts
- 🔔 **Notifications** — Real-time bell notifications for likes, comments, and replies
- 👤 **User Profiles** — View any user's profile and their posts
- 🖼️ **Image Uploads** — Cloudinary-powered image hosting for posts and profile photos
- 🔍 **Search** — Search posts by keyword or find users by username
- 📱 **Responsive UI** — Works across desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Tech | Version |
|------|---------|
| React | 19 |
| Vite | Latest |
| React Router | v7 |
| Axios | Latest |

### Backend
| Tech | Version |
|------|---------|
| Java | 21 |
| Spring Boot | 4.1.0 |
| Spring Security | 7.x |
| Hibernate ORM | 7.4.1 |
| jjwt | 0.11.5 |
| Cloudinary SDK | 1.36.0 |

### Database & Storage
| Tech | Purpose |
|------|---------|
| MySQL 8 | Primary database |
| Cloudinary | Image storage |

---

## 📁 Project Structure

```
blogforge/
├── blogforge-frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── api/                 # Axios instance with JWT interceptor
│   │   ├── components/          # Navbar, PostCard, LikeButton, etc.
│   │   ├── context/             # AuthContext (global user state)
│   │   └── pages/               # Home, Login, Register, PostDetail, etc.
│   └── vite.config.js
│
└── blogforge-backend/           # Spring Boot backend
    └── backend/
        └── src/main/java/com/blog/backend/
            ├── config/          # Security, CORS, Cloudinary config
            ├── controller/      # REST API controllers
            ├── dto/             # Request and response DTOs
            ├── entity/          # JPA entities
            ├── repository/      # Spring Data JPA repositories
            ├── security/        # JWT filter and utilities
            └── service/         # Business logic
```

---

## 🚀 Getting Started

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8
- Maven

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/blogforge.git
cd blogforge
```

---

### 2. Backend Setup

```bash
cd blogforge-backend/backend
```

Copy the example properties file and fill in your values:

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Edit `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/blogdb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT
jwt.secret=YOUR_JWT_SECRET_KEY
jwt.expiration=86400000

# Cloudinary
cloudinary.cloud-name=YOUR_CLOUD_NAME
cloudinary.api-key=YOUR_API_KEY
cloudinary.api-secret=YOUR_API_SECRET
```

Run the backend:

```bash
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`

---

### 3. Frontend Setup

```bash
cd blogforge-frontend
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts (paginated) |
| GET | `/api/posts/{id}` | Get post by ID |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/{id}` | Edit post |
| DELETE | `/api/posts/{id}` | Delete post |
| GET | `/api/posts/by-user/{username}` | Get posts by user |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/{id}/comments` | Get comments for a post |
| POST | `/api/posts/{id}/comments` | Add comment or reply |
| PUT | `/api/comments/{id}` | Edit comment |
| DELETE | `/api/comments/{id}` | Delete comment |

### Likes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/{id}/like` | Toggle like on a post |
| GET | `/api/posts/{id}/like` | Get like status and count |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get all notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PUT | `/api/notifications/mark-all-read` | Mark all as read |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get current user profile |
| PUT | `/api/profile` | Update password |
| POST | `/api/profile/photo` | Upload profile photo |
| GET | `/api/users/search` | Search users by keyword |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/image` | Upload image to Cloudinary |

---

## 🔐 Environment Variables

Never commit your `application.properties`. Use the provided `application.properties.example` as a template.

| Variable | Description |
|----------|-------------|
| `spring.datasource.username` | MySQL username |
| `spring.datasource.password` | MySQL password |
| `jwt.secret` | Secret key for JWT signing |
| `cloudinary.cloud-name` | Cloudinary cloud name |
| `cloudinary.api-key` | Cloudinary API key |
| `cloudinary.api-secret` | Cloudinary API secret |

---


## 🙋‍♀️ Author

**Krishna Deepika K**  
B.E. Computer Science Engineering  
[GitHub] (https://github.com/diya969)
[LinkedIn] (https://www.linkedin.com/in/krishna-deepika-k-72baa0293/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
