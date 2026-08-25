# 🎓 CourseVerse Hub – Multi-Source Course Aggregator & Comparison Platform

> **A modern, multi-platform course aggregation and curriculum comparison platform for discovering, filtering, and evaluating technical learning resources from across the open web.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 Overview

**CourseVerse Hub** is a responsive course aggregation and comparison platform built with **React** and **Tailwind CSS**.

The platform addresses the fragmentation of online technical education by aggregating and normalizing learning resources from multiple public sources into a unified interface.

Users can discover courses, apply multi-dimensional filters, inspect syllabus highlights, save learning resources, and compare up to four courses side-by-side.

The application also includes a **resilient dual-layer data architecture** that can fall back to client-side API aggregation when the primary serverless endpoint is unavailable.

---

## ✨ Key Features

### 🌐 Multi-Source Course Aggregation

- Aggregates educational resources from multiple public platforms and APIs.
- Normalizes heterogeneous API responses into a unified course structure.
- Supports serverless backend aggregation with client-side fallback.
- Fetches multiple API streams concurrently using `Promise.allSettled()`.

### 🛡️ Resilient Dual-Layer Data Pipeline

- Primary aggregation through a Vercel Serverless API route.
- Automatic client-side failover when the primary endpoint is unavailable.
- Concurrent requests across multiple public REST endpoints.
- Individual API failures do not prevent successful sources from loading.

### 🏷️ Automated Course Classification

- Keyword-based heuristic classification engine.
- Automatically categorizes incoming resources by technical domain.
- Supports a structured taxonomy covering programming, technology, AI, design, business, and languages.
- Maps resources into domain-specific subcategories.

### ⚡ Advanced Filtering & Sorting

Courses can be filtered and sorted by:

- 🔎 Search query
- 💻 Domain
- 🏷️ Subcategory
- 🌐 Provider
- 💰 Free / Paid
- 📊 Difficulty
- ⏱️ Duration
- ⭐ Rating
- 🔤 Alphabetical order
- 🔥 Featured / popularity

### ⚖️ Side-by-Side Course Comparison

- Compare up to **4 courses simultaneously**.
- Compare:
  - Provider
  - Rating
  - Tuition
  - Duration
  - Difficulty
  - Certification
  - Course commitment
  - Course highlights

### 📑 Syllabus Highlights

- Detailed course information modal.
- Course descriptions and learning highlights.
- Prerequisite information.
- Certification details.
- Direct links to official learning resources.

### 💾 Persistent Saved Library

- Bookmark courses for later.
- Persistent storage using browser `localStorage`.
- Saved courses remain available across browser sessions.

### 🔐 Authentication Experience

- Centralized React Context authentication state.
- Email-based authentication simulation.
- Google OAuth popup simulation.
- GitHub OAuth popup simulation.
- Application-wide authentication state management.

---

## 🏗️ System Architecture

```text
                         ┌─────────────────────────┐
                         │     CourseVerse Hub     │
                         │       Web Client        │
                         └────────────┬────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌──────────────────────┐            ┌──────────────────────┐
        │ Primary Serverless   │            │ Browser Failover     │
        │ Aggregation Route    │            │ Aggregation Mode     │
        │ /api/all-live-courses│            │ Promise.allSettled() │
        └──────────┬───────────┘            └──────────┬───────────┘
                   │                                   │
                   │                    ┌──────────────┼──────────────┐
                   │                    ▼              ▼              ▼
                   │               Open Library      DEV.to       WikiBooks
                   │
                   │                    ┌──────────────┼──────────────┐
                   │                    ▼              ▼              ▼
                   │               Hacker News      Apple APIs    Public Feeds
                   │
                   └───────────────────┬──────────────────────────────┘
                                       ▼
                         ┌─────────────────────────┐
                         │ Data Normalization      │
                         │ Unified Course Schema   │
                         └────────────┬────────────┘
                                      ▼
                         ┌─────────────────────────┐
                         │ Heuristic Classifier    │
                         │ Domain & Subcategory    │
                         └────────────┬────────────┘
                                      ▼
                         ┌─────────────────────────┐
                         │ Filtering & Sorting     │
                         │ Search / Compare / Save │
                         └─────────────────────────┘
```

---

## 🧠 Technical Highlights

### 🔄 Concurrent API Aggregation

The client-side fallback pipeline uses `Promise.allSettled()` to execute multiple API requests concurrently.

```javascript
const results = await Promise.allSettled([
  fetchOpenLibrary(),
  fetchDevTo(),
  fetchWikiBooks(),
  fetchHackerNews(),
]);
```

This allows successful sources to continue loading even when individual endpoints fail.

### 🧹 Data Normalization

Different providers expose different response structures.

CourseVerse transforms incoming data into a consistent course model containing fields such as:

```text
id
title
description
category
subcategory
provider
isFree
rating
enrolled
level
duration
url
hasCertificate
highlights
```

This unified structure allows resources from different providers to be filtered and compared through the same interface.

### 🧠 Heuristic Classification

Course metadata is analyzed using keyword-based classification rules.

```text
Course Metadata
      ↓
Keyword Analysis
      ↓
Domain Classification
      ↓
Subcategory Assignment
      ↓
Unified Course Object
```

### ⚡ Memoized Filtering

React `useMemo()` is used to optimize expensive filtering and sorting operations and reduce unnecessary recalculation during UI interactions.

---

## 🗂️ Taxonomy Structure

| Domain | Subcategories |
|---|---|
| **Programming** | Python, JavaScript & TypeScript, C / C++, Java & Spring, Rust & Go, Algorithms & DS, Full Stack |
| **Tech & CS** | Web Development, Mobile Dev, DevOps & Cloud, Cybersecurity, System Design |
| **AI & Data** | Machine Learning, Data Science, LLMs & GenAI, Deep Learning, Computer Vision |
| **Design & Creative** | UI/UX Design, 3D Animation, Graphic Design, Figma & Design Systems |
| **Business & SaaS** | Digital Marketing, Product Management, Startup Growth, Fintech & Sales |
| **Languages** | English, Spanish, French, German, Japanese, Mandarin |

---

## 🌐 Data Sources

CourseVerse Hub can aggregate resources from multiple public sources, including:

| Provider | Source |
|---|---|
| **FreeCodeCamp** | Public curriculum and learning resources |
| **Open Library** | Open Library APIs |
| **DEV.to** | Public article API |
| **WikiBooks** | Public educational resources |
| **Hacker News** | Algolia Search API |
| **Apple** | Public podcast directory resources |
| **Custom Backend** | Optional normalized REST endpoint |

> External API availability and response formats may change over time.

---

## 📂 Project Structure

```text
courseverse/
├── api/
│   └── Courses.js
│       # Vercel Serverless Function & course aggregation logic
│
├── public/
│   └── index.html
│       # Application HTML entry point
│
├── src/
│   ├── components/
│   │   ├── LessonList.js
│   │   │   # Course cards, grid, syllabus modal & actions
│   │   │
│   │   └── LoginForm.js
│   │       # Authentication modal & OAuth simulation
│   │
│   ├── App.js
│   │   # Core application logic, filtering & comparison
│   │
│   ├── App.css
│   │   # Glassmorphism UI & custom styling
│   │
│   └── index.js
│       # React application entry point
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js v16+**
- **npm** or **Yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/vivekjoshi2006/CourseVerse.git
cd CourseVerse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root if a custom backend endpoint is being used:

```env
REACT_APP_API_URL=
```

Leave the value empty when using the Vercel Serverless API.

### 4. Run the Application

```bash
npm start
```

Open:

```text
http://localhost:3000
```

### 5. Run Vercel Serverless Functions Locally

To emulate the Vercel environment locally:

```bash
npx vercel dev
```

---

## 🔌 API Reference

### `GET /api/all-live-courses`

Returns normalized course resources from the configured aggregation pipeline.

#### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `q` | string | Optional search query matching course title, description, category, or provider |

#### Example

```text
GET /api/all-live-courses?q=python
```

#### Example Response

```json
{
  "success": true,
  "count": 217,
  "courses": [
    {
      "id": "fcc-programming-python",
      "title": "Python Master Curriculum & Certification",
      "description": "Complete interactive Python learning curriculum.",
      "category": "programming",
      "subcategory": "Python",
      "provider": "CodeCamp",
      "isFree": true,
      "rating": "4.9",
      "enrolled": "120k+",
      "level": "Beginner",
      "duration": "300 Hours",
      "url": "https://www.freecodecamp.org/",
      "tag": "100% Free Verified",
      "hasCertificate": true,
      "highlights": [
        "Interactive browser environment",
        "Portfolio projects",
        "Digital certification"
      ]
    }
  ]
}
```

---

## 🎨 UI & UX

CourseVerse Hub uses a modern glassmorphism-inspired interface featuring:

- 🪟 Frosted glass cards
- ✨ Soft gradient effects
- 📱 Responsive layouts
- 🔍 Interactive search
- 🎛️ Dynamic filtering controls
- ⚖️ Comparison workspace
- 📑 Modal-based syllabus previews
- 🔖 Persistent bookmarks
- 🎞️ Smooth UI transitions

---

## 📱 Responsive Design

The interface is optimized for:

- 💻 Desktop
- 💼 Laptop
- 📱 Mobile
- 📟 Tablet

Course cards, filters, comparison views, and modal interfaces adapt to different screen sizes.

---

## 🚢 Deployment

### Vercel

CourseVerse Hub is configured for deployment on Vercel.

1. Push the repository to GitHub.
2. Open the Vercel Dashboard.
3. Import the repository.
4. Configure environment variables if required.
5. Deploy the application.

The `/api` directory can be deployed as Vercel Serverless Functions.

---

## 🔮 Future Enhancements

- 🤖 AI-powered course recommendations
- 🧭 Personalized learning paths
- 👤 Real OAuth authentication
- 📊 Learning progress tracking
- ⭐ User reviews and ratings
- 🔎 Advanced search indexing
- 🗄️ Persistent database integration
- 📈 Learning analytics dashboard
- 🌐 Additional educational platforms
- ⚡ Server-side caching and optimization

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/new-feature
```

3. Commit your changes:

```bash
git commit -m "Add new feature"
```

4. Push the branch:

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Vivek Joshi**

Built with ⚡ React, JavaScript, Tailwind CSS, REST APIs, and modern web technologies.
