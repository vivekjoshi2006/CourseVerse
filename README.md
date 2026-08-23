# 🎓 CourseVerse Hub – Multi-Source Course Discovery & Comparison

> **Discover, filter, and compare courses from multiple educational platforms in one place.**

CourseVerse Hub is a modern, responsive **course discovery and comparison platform** built with **React** and **Tailwind CSS**. It aggregates educational content from multiple public sources, normalizes diverse course data into a unified format, and provides powerful filtering, syllabus previews, bookmarking, and side-by-side course comparison.

The platform is designed to simplify learning-resource discovery by bringing courses, tutorials, lectures, and open educational content into a single searchable interface.

---

## ✨ Key Features

### 🌐 Multi-Source Course Aggregation

- Aggregates educational content from multiple public APIs
- Fetches data from multiple sources in parallel
- Normalizes different API response formats into a unified course model
- Supports optional custom backend integration
- Client-side fallback when the primary backend is unavailable

### 🔍 Smart Course Discovery

- Global course search
- Keyword-based course classification
- Automatic technical domain assignment
- Platform-based filtering
- Free vs. paid filtering
- Difficulty-level filtering
- Duration-based filtering

### 🧭 Advanced Filtering & Sorting

Filter courses by:

- 💻 Programming
- 🤖 AI & Data
- 🌐 Web & Computer Science
- 🎨 Design
- 💼 Business
- 🗣️ Languages

Additional filters include:

- **Tuition:** Free / Paid
- **Difficulty:** Beginner / Intermediate / Advanced
- **Duration:** Crash Course / Standard / Deep Dive / Specialization / Self-Paced
- **Sorting:** Featured / Popularity / Rating / Alphabetical

### ⚖️ Side-by-Side Course Comparison

- Select up to **4 courses**
- Compare courses simultaneously
- Compare:
  - Platform
  - Rating
  - Tuition
  - Duration
  - Difficulty
  - Certification
  - Course commitment

### 📚 Syllabus Preview

- Detailed course information modal
- Course highlights
- Prerequisites
- Duration
- Platform information
- Direct course/resource links

### 🔖 Saved Learning Library

- Bookmark courses for later
- Persistent saved courses using `localStorage`
- Access saved resources across browser sessions

### 🔐 Authentication Experience

- Application-wide authentication state
- Email-based authentication simulation
- Google OAuth popup simulation
- GitHub OAuth popup simulation
- React Context-based authentication state

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend Framework |
| JavaScript ES6+ | Application Logic |
| Tailwind CSS | UI Styling |
| Custom CSS | Glassmorphism Design System |
| React Context API | Authentication State |
| React Hooks | State & Lifecycle Management |
| Fetch API | API Communication |
| `Promise.allSettled()` | Parallel API Aggregation |
| `useMemo()` | Optimized Filtering |
| `localStorage` | Persistent Bookmarks |
| Lucide React | UI Icons |

---

# 🌐 Data Sources

CourseVerse Hub integrates educational content from multiple public sources.

| Source | Data |
|--------|------|
| FreeCodeCamp | Open curriculum and learning tracks |
| Hacker News Algolia | Curated educational repositories and resources |
| Open Library | Educational books and learning resources |
| DEV.to | Course and educational articles |
| Custom Backend | Optional normalized course API |

> Availability and response formats of external APIs may change over time.

---

# 🧠 Architecture

CourseVerse Hub uses a resilient multi-source aggregation pipeline.

```text
                 ┌─────────────────────┐
                 │   CourseVerse Hub   │
                 └──────────┬──────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ Multi-Source Fetcher  │
                └───────────┬───────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
     FreeCodeCamp      Open Library        DEV.to
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                  Hacker News / Backend
                            │
                            ▼
                ┌───────────────────────┐
                │ Data Normalization    │
                └───────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Classification       │
                 │ & Taxonomy Engine    │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Unified Course Model │
                 └──────────┬───────────┘
                            │
                            ▼
              Search • Filter • Compare
                            │
                            ▼
                 Saved Learning Library
```

---

# ⚡ Architectural Highlights

### 🔄 Resilient Aggregation Pipeline

CourseVerse uses `Promise.allSettled()` to request multiple external sources concurrently.

This allows individual API failures to be isolated without preventing the remaining sources from loading.

```javascript
const results = await Promise.allSettled([
  fetchFreeCodeCamp(),
  fetchHackerNews(),
  fetchOpenLibrary(),
  fetchDevTo(),
]);
```

Successful responses are normalized while unavailable sources can be safely skipped.

---

### 🧹 Unified Data Normalization

Different APIs expose different field structures.

CourseVerse transforms these responses into a common course representation containing fields such as:

```text
Title
Description
Platform
Category
Difficulty
Duration
Price
Rating
Certification
URL
```

This allows courses from completely different sources to be displayed and compared through the same UI.

---

### 🧠 Smart Classification

Incoming resources are categorized using keyword-based heuristics to automatically assign them to relevant learning domains and technical tracks.

Example:

```text
React + JavaScript + Frontend
        ↓
Web Development
        ↓
Frontend Development
```

---

### ⚡ Optimized Client-Side Filtering

React `useMemo()` is used to memoize filtered and sorted course collections, reducing unnecessary recalculation during UI interactions.

Filtering can combine:

```text
Search
   +
Platform
   +
Domain
   +
Price
   +
Difficulty
   +
Duration
   +
Rating
```

---

# 📂 Project Structure

```text
courseverse-hub/
│
├── src/
│   ├── components/
│   │   ├── LessonList.js
│   │   │   # Course grid, cards, syllabus modal & actions
│   │   │
│   │   └── LoginForm.js
│   │       # Authentication modal & OAuth simulation
│   │
│   ├── context/
│   │   └── AuthContext.js
│   │       # Global authentication state
│   │
│   ├── App.js
│   │   # Aggregation, filtering & comparison logic
│   │
│   ├── App.css
│   │   # Glassmorphism styles & UI utilities
│   │
│   └── index.js
│       # React application entry point
│
├── public/
├── package.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

- Node.js **v16 or later**
- npm or Yarn

---

## 1. Clone the Repository

```bash
git clone https://github.com/vivekjoshi2006/CourseVerse.git
```

---

## 2. Navigate to the Project

```bash
cd CourseVerse
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Configure Backend (Optional)

If you are using the optional custom backend, create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:5001
```

If the backend is unavailable, CourseVerse automatically falls back to direct client-side API aggregation.

---

## 5. Start the Development Server

```bash
npm start
```

---

## 6. Open the Application

Visit:

```text
http://localhost:3000
```

---

# 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm test` | Runs the test suite |

---

# 🎯 Core User Workflow

```text
Discover Courses
       ↓
Search & Filter
       ↓
Preview Syllabus
       ↓
Compare Courses
       ↓
Save to Library
       ↓
Launch Learning Resource
```

---

# 📱 Responsive Design

CourseVerse Hub is designed for:

- 💻 Desktop
- 💼 Laptop
- 📱 Mobile
- 📟 Tablet

The interface adapts course grids, comparison tables, filters, and modals for different screen sizes.

---

# 🎨 UI & UX

The application features a modern **Glassmorphism-inspired interface** with:

- Frosted glass cards
- Responsive course grids
- Smooth transitions
- Soft gradients
- Interactive modals
- Dynamic filtering
- Clean learning-resource presentation

---

# 🚀 Future Enhancements

- Real OAuth authentication
- User profiles
- Personalized learning paths
- Course progress tracking
- AI-powered course recommendations
- Advanced recommendation engine
- Course reviews and ratings
- More educational platforms
- Server-side caching
- PostgreSQL database integration
- Advanced search indexing
- Learning analytics dashboard

---

# 🤝 Contributing

Contributions are welcome!

### 1. Fork the Repository

### 2. Create a Feature Branch

```bash
git checkout -b feature/new-feature
```

### 3. Commit Your Changes

```bash
git commit -m "Add new feature"
```

### 4. Push Your Branch

```bash
git push origin feature/new-feature
```

### 5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

Developed with ❤️ using **React**, **JavaScript**, **Tailwind CSS**, and modern web APIs.

If you found CourseVerse Hub useful, consider giving the repository a ⭐ on GitHub.
