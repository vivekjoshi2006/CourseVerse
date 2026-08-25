import React, { useState, useEffect, useMemo, createContext, useContext, useCallback, useRef } from 'react';
import './App.css';
import LessonList from './components/LessonList';
import LoginForm from './components/LoginForm';

import {
  Activity, ArrowDownAZ, ArrowLeftRight, ArrowRight, Banknote, BarChart3, Binary, BookOpen, Bookmark, Bot, Box, Boxes, Brain, Briefcase, Check, ChevronDown, Clock, Cloud, Code2, Coins, Combine, Compass, Component, Cpu, DollarSign, ExternalLink, Eye, Feather, FileCode, FileCode2, Flame, GitMerge, Globe, Globe2, GraduationCap, Heart, Languages, Layers, Layout, LayoutGrid, LineChart, LogOut, MessageCircle, MessageSquare, MessageSquareText, MessagesSquare, Monitor, Network, Palette, PenTool, PieChart, RefreshCw, Rocket, Scale, Scan, Search, Server, ShieldCheck, SlidersHorizontal, Smartphone, Sparkles, Star, Target, Terminal, Timer, TrendingUp, UserCheck, Workflow, X, Zap
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Authentication Provider & Context
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('courseverse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('courseverse_user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('courseverse_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

const GRADIENTS = {
  'CodeCamp': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'Coursera': 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
  'Hacker Hub': 'linear-gradient(135deg, #ea580c, #fb923c)',
  'Open Library': 'linear-gradient(135deg, #047857, #10b981)',
  'DEV Com': 'linear-gradient(135deg, #be185d, #f43f5e)',
  'Apple': 'linear-gradient(135deg, #b45309, #f59e0b)',
  'WikiBooks': 'linear-gradient(135deg, #0e7490, #06b6d4)',
};

const ICON_MAP = {
  LayoutGrid, Compass, Terminal, FileCode2, FileCode, Cpu, Layers, Boxes, GitMerge, Server, Globe, Globe2, Smartphone, Cloud, ShieldCheck, Network, Brain, BarChart3, Sparkles, Activity, Scan, Layout, Box, PenTool, Component, TrendingUp, Target, Rocket, Banknote, MessageSquareText, MessageSquare, MessageCircle, MessagesSquare, Languages, Code2, Binary, Monitor, Workflow, Bot, Palette, Combine, Briefcase, PieChart, DollarSign, LineChart, Eye, Feather, Zap, Grid: LayoutGrid, Code: Code2, BarChart: BarChart3, Figma: PenTool
};

// Category Configuration
export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Domains',
    icon: 'LayoutGrid',
    subcategories: [
      { name: 'All', icon: 'Compass' },
      // Programming
      { name: 'Python', icon: 'Terminal' },
      { name: 'JavaScript & TypeScript', icon: 'FileCode2' },
      { name: 'C / C++', icon: 'Cpu' },
      { name: 'Java & Spring', icon: 'Layers' },
      { name: 'Rust & Go', icon: 'Boxes' },
      { name: 'Algorithms & DS', icon: 'GitMerge' },
      { name: 'Full Stack', icon: 'Server' },

      // Tech & CS
      { name: 'Web Development', icon: 'Globe' },
      { name: 'Mobile Dev', icon: 'Smartphone' },
      { name: 'DevOps & Cloud', icon: 'Cloud' },
      { name: 'Cybersecurity', icon: 'ShieldCheck' },
      { name: 'System Design', icon: 'Network' },

      // AI & Data
      { name: 'Machine Learning', icon: 'Brain' },
      { name: 'Data Science', icon: 'BarChart3' },
      { name: 'LLMs & GenAI', icon: 'Sparkles' },
      { name: 'Deep Learning', icon: 'Activity' },
      { name: 'Computer Vision', icon: 'Scan' },

      // Design & Creative
      { name: 'UI/UX Design', icon: 'Layout' },
      { name: '3D Animation', icon: 'Box' },
      { name: 'Graphic Design', icon: 'PenTool' },
      { name: 'Figma & Design Systems', icon: 'Component' },

      // Business & SaaS
      { name: 'Digital Marketing', icon: 'TrendingUp' },
      { name: 'Product Management', icon: 'Target' },
      { name: 'Startup Growth', icon: 'Rocket' },
      { name: 'Fintech & Sales', icon: 'Banknote' },

      // Languages
      { name: 'English', icon: 'MessageSquareText' },
      { name: 'Spanish', icon: 'MessageSquare' },
      { name: 'French', icon: 'MessageCircle' },
      { name: 'German', icon: 'MessagesSquare' },
      { name: 'Japanese', icon: 'Languages' },
      { name: 'Mandarin', icon: 'Globe2' }
    ]
  },
  {
    id: 'programming',
    name: 'Programming',
    icon: 'Code2',
    subcategories: [
      { name: 'All', icon: 'Binary' },
      { name: 'Python', icon: 'Terminal' },
      { name: 'JavaScript & TypeScript', icon: 'FileCode2' },
      { name: 'C / C++', icon: 'Cpu' },
      { name: 'Java & Spring', icon: 'Layers' },
      { name: 'Rust & Go', icon: 'Boxes' },
      { name: 'Algorithms & DS', icon: 'GitMerge' },
      { name: 'Full Stack', icon: 'Server' }
    ]
  },
  {
    id: 'tech',
    name: 'Tech & CS',
    icon: 'Monitor',
    subcategories: [
      { name: 'All', icon: 'Workflow' },
      { name: 'Web Development', icon: 'Globe' },
      { name: 'Mobile Dev', icon: 'Smartphone' },
      { name: 'DevOps & Cloud', icon: 'Cloud' },
      { name: 'Cybersecurity', icon: 'ShieldCheck' },
      { name: 'System Design', icon: 'Network' }
    ]
  },
  {
    id: 'ai',
    name: 'AI & Data',
    icon: 'Bot',
    subcategories: [
      { name: 'All', icon: 'Cpu' },
      { name: 'Machine Learning', icon: 'Brain' },
      { name: 'Data Science', icon: 'BarChart3' },
      { name: 'LLMs & GenAI', icon: 'Sparkles' },
      { name: 'Deep Learning', icon: 'Activity' },
      { name: 'Computer Vision', icon: 'Scan' }
    ]
  },
  {
    id: 'design',
    name: 'Design & Creative',
    icon: 'Palette',
    subcategories: [
      { name: 'All', icon: 'Combine' },
      { name: 'UI/UX Design', icon: 'Layout' },
      { name: '3D Animation', icon: 'Box' },
      { name: 'Graphic Design', icon: 'PenTool' },
      { name: 'Figma & Design Systems', icon: 'Component' }
    ]
  },
  {
    id: 'business',
    name: 'Business & SaaS',
    icon: 'Briefcase',
    subcategories: [
      { name: 'All', icon: 'PieChart' },
      { name: 'Digital Marketing', icon: 'TrendingUp' },
      { name: 'Product Management', icon: 'Target' },
      { name: 'Startup Growth', icon: 'Rocket' },
      { name: 'Fintech & Sales', icon: 'Banknote' }
    ]
  },
  {
    id: 'languages',
    name: 'Languages',
    icon: 'Languages',
    subcategories: [
      { name: 'All', icon: 'Globe' },
      { name: 'English', icon: 'MessageSquareText' },
      { name: 'Spanish', icon: 'MessageSquare' },
      { name: 'French', icon: 'MessageCircle' },
      { name: 'German', icon: 'MessagesSquare' },
      { name: 'Japanese', icon: 'Languages' },
      { name: 'Mandarin', icon: 'Globe2' }
    ]
  }
];

// Classifier Helper
export const classifyText = (title = '', desc = '', tags = '') => {
  const text = `${title} ${desc} ${tags}`.toLowerCase();

  if (text.includes('spanish') || text.includes('french') || text.includes('german') || text.includes('japanese') || text.includes('english') || text.includes('language')) {
    let sub = 'English';
    if (text.includes('spanish')) sub = 'Spanish';
    if (text.includes('french')) sub = 'French';
    if (text.includes('german')) sub = 'German';
    if (text.includes('japanese')) sub = 'Japanese';
    return { category: 'languages', subcategory: sub };
  }
  if (text.includes('python') || text.includes('javascript') || text.includes('typescript') || text.includes('c++') || text.includes('rust') || text.includes('golang') || text.includes('java') || text.includes('algorithm')) {
    let sub = 'Python';
    if (text.includes('javascript') || text.includes('typescript') || text.includes('react')) sub = 'JavaScript & TypeScript';
    if (text.includes('c++') || text.includes('c#')) sub = 'C / C++';
    if (text.includes('rust') || text.includes('go')) sub = 'Rust & Go';
    if (text.includes('java')) sub = 'Java & Spring';
    if (text.includes('algorithm') || text.includes('data structure')) sub = 'Algorithms & DS';
    return { category: 'programming', subcategory: sub };
  }
  if (text.includes('data') || text.includes('machine learning') || text.includes('ai') || text.includes('gpt') || text.includes('llm')) {
    let sub = 'Machine Learning';
    if (text.includes('data science') || text.includes('analytics')) sub = 'Data Science';
    if (text.includes('prompt') || text.includes('llm') || text.includes('genai')) sub = 'LLMs & GenAI';
    return { category: 'ai', subcategory: sub };
  }
  if (text.includes('design') || text.includes('ui') || text.includes('ux') || text.includes('css') || text.includes('graphic') || text.includes('figma')) {
    return { category: 'design', subcategory: 'UI/UX Design' };
  }
  if (text.includes('business') || text.includes('marketing') || text.includes('management') || text.includes('startup') || text.includes('saas') || text.includes('growth') || text.includes('product')) {
    return { category: 'business', subcategory: 'Product Management' };
  }
  return { category: 'tech', subcategory: 'Web Development' };
};

// Course Duration
const matchesDurationFilter = (durationStr = '', filterValue) => {
  if (filterValue === 'all') return true;
  const str = (durationStr || '').toLowerCase();

  // Self-Paced, Books & Syllabi
  if (filterValue === 'selfPaced') {
    return (
      str.includes('self-paced') ||
      str.includes('textbook') ||
      str.includes('book') ||
      str.includes('open lecture') ||
      str.includes('codebase')
    );
  }

  const num = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
  const isMonth = str.includes('month');
  const isWeek = str.includes('week');
  const isHour = str.includes('hour') || str.includes('hr');

  // Convert roughly to weeks equivalent
  let approxWeeks = 0;
  if (isMonth) approxWeeks = num * 4.3;
  else if (isWeek) approxWeeks = num;
  else if (isHour) approxWeeks = num / 10;
  else approxWeeks = 4;

  // < 2 Weeks (Crash Courses)
  if (filterValue === 'under2Weeks') {
    return (isWeek && num <= 2) || (isHour && num <= 20) || (approxWeeks <= 2 && !isMonth && !str.includes('textbook'));
  }

  // 2–4 Weeks (Standard Modules)
  if (filterValue === '2to4Weeks') {
    return (isWeek && num > 2 && num <= 4) || (isHour && num > 20 && num <= 50) || (approxWeeks > 2 && approxWeeks <= 4.5);
  }

  // 1–3 Months (Deep Dives)
  if (filterValue === '1to3Months') {
    return (isMonth && num >= 1 && num <= 3) || (isWeek && num > 4 && num <= 12) || (isHour && num > 50 && num <= 150) || (approxWeeks > 4.5 && approxWeeks <= 12);
  }

  // 3+ Months (Specializations & Professional Certificates)
  if (filterValue === '3PlusMonths') {
    return (isMonth && num > 3) || (isWeek && num > 12) || (isHour && num > 150) || approxWeeks > 12;
  }

  return true;
};

// Parse enrollment count for popularity sorting
const parseEnrollment = (enrolledStr = '') => {
  const str = enrolledStr.toString().toLowerCase();
  if (str.includes('m')) return (parseFloat(str) || 1) * 1000000;
  if (str.includes('k')) return (parseFloat(str) || 1) * 1000;
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
};

const AppContent = () => {
  const { user, logout, isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, login } = useAuth();

  const [courses, setCourses] = useState([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Dedicated Filters State
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedSubCat, setSelectedSubCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [languageFilter, setLanguageFilter] = useState('all');

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bookmarks & Compare State
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('courseverse_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const syncLiveCourses = useCallback(async (forcedQuery = null, forceRefresh = false) => {
    setIsSyncing(true);
    setApiError(null);

    const queryParam = forcedQuery !== null ? forcedQuery.trim() : '';
    const endpoint = queryParam
      ? `${API_BASE_URL}/api/all-live-courses?q=${encodeURIComponent(queryParam)}`
      : `${API_BASE_URL}/api/all-live-courses${forceRefresh ? '?refresh=true' : ''}`;

    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Backend status ${response.status}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
        setCourses(data.courses);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        return;
      }
      throw new Error('Backend empty payload');
    } catch (backendErr) {
      console.warn('Backend offline, pulling live streams directly from public APIs in browser...');
      try {
        const results = await Promise.allSettled([
          // Open Library
          fetch('https://openlibrary.org/subjects/computer_science.json?limit=50'),
          fetch('https://openlibrary.org/subjects/programming.json?limit=50'),
          fetch('https://openlibrary.org/subjects/artificial_intelligence.json?limit=50'),

          // DEV.to
          fetch('https://dev.to/api/articles?tag=course&per_page=30'),
          fetch('https://dev.to/api/articles?tag=python&per_page=30'),
          fetch('https://dev.to/api/articles?tag=javascript&per_page=30'),
          fetch('https://dev.to/api/articles?tag=ai&per_page=30'),

          // WikiBooks
          fetch('https://en.wikibooks.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Subject:Computer_science&format=json&cmlimit=50&origin=*'),
          fetch('https://en.wikibooks.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Subject:Programming&format=json&cmlimit=50&origin=*'),
          fetch('https://en.wikibooks.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Subject:Languages&format=json&cmlimit=50&origin=*'),

          // Hacker Hub
          fetch('https://hn.algolia.com/api/v1/search?query=course&tags=story&hitsPerPage=50'),
          fetch('https://hn.algolia.com/api/v1/search?query=tutorial&tags=story&hitsPerPage=50'),

          // Apple Podcasts
          fetch('https://itunes.apple.com/search?term=programming+course&media=podcast&limit=40'),
          fetch('https://itunes.apple.com/search?term=computer+science&media=podcast&limit=40'),
          fetch('https://itunes.apple.com/search?term=machine+learning+podcast&media=podcast&limit=40'),

          // Coursera Live Streams
          fetch('https://hn.algolia.com/api/v1/search?query=coursera+course&tags=story&hitsPerPage=50'),
          fetch('https://hn.algolia.com/api/v1/search?query=coursera+specialization&tags=story&hitsPerPage=50'),

          // CodeCamp Live Streams
          fetch('https://dev.to/api/articles?tag=freecodecamp&per_page=50'),
          fetch('https://dev.to/api/articles?username=freecodecamp&per_page=50'),
          fetch('https://hn.algolia.com/api/v1/search?query=freecodecamp&tags=story&hitsPerPage=50'),
          fetch('https://hn.algolia.com/api/v1/search?query=free+code+camp&tags=story&hitsPerPage=50')
        ]);

        const [
          ol1, ol2, ol3,
          dev1, dev2, dev3, dev4,
          wiki1, wiki2, wiki3,
          hn1, hn2,
          apple1, apple2, apple3,
          coursera1, coursera2,
          fcc1, fcc2, fcc3, fcc4
        ] = results;

        const liveCourses = [];

        // Safely read JSON
        const readJson = async (res) => {
          if (res && res.status === 'fulfilled' && res.value && res.value.ok) {
            try { return await res.value.json(); } catch { return null; }
          }
          return null;
        };

        // 1. Parse Open Library
        for (const res of [ol1, ol2, ol3]) {
          const data = await readJson(res);
          (data?.works || []).forEach((work, idx) => {
            const authors = (work.authors || []).map(a => a.name).join(', ') || 'Academic Faculty';
            const { category, subcategory } = classifyText(work.title, (work.subject || []).join(' '));
            liveCourses.push({
              id: `ol-${(work.key || idx).toString().replace(/\//g, '-')}`,
              title: work.title,
              description: `Complete academic syllabus on ${subcategory} by ${authors}.`,
              category,
              subcategory,
              provider: 'Open Library',
              isFree: true,
              rating: '4.8',
              enrolled: `${(work.edition_count || 1) * 3}k+ reads`,
              level: idx % 2 === 0 ? 'Advanced' : 'Beginner',
              duration: 'Complete Book Track',
              url: `https://openlibrary.org${work.key}`,
              gradient: GRADIENTS['Open Library'],
              tag: 'Academic Track',
              hasCertificate: false,
              highlights: ['Full academic syllabus', 'Foundational concepts', 'Internet Archive edition']
            });
          });
        }

        // 2. Parse DEV.to
        for (const res of [dev1, dev2, dev3, dev4]) {
          const articles = await readJson(res);
          (articles || []).forEach(art => {
            if (!art.title || !art.url) return;
            const { category, subcategory } = classifyText(art.title, art.description, (art.tag_list || []).join(' '));
            liveCourses.push({
              id: `dev-${art.id}`,
              title: art.title,
              description: art.description || `Practical developer guide on ${subcategory}.`,
              category,
              subcategory,
              provider: 'DEV Com',
              isFree: true,
              rating: '4.8',
              enrolled: `${(art.positive_reactions_count || 20) * 12}+ learners`,
              level: 'Intermediate',
              duration: `${art.reading_time_minutes ? art.reading_time_minutes * 3 : 15} Hours`,
              url: art.url,
              gradient: GRADIENTS['DEV Com'],
              tag: 'Workshop',
              hasCertificate: false,
              highlights: ['Hands-on code examples', 'Author discussion & feedback', 'Production patterns']
            });
          });
        }

        // 3. Parse WikiBooks
        for (const res of [wiki1, wiki2, wiki3]) {
          const data = await readJson(res);
          (data?.query?.categorymembers || []).forEach((page, idx) => {
            if (!page.title) return;
            const { category, subcategory } = classifyText(page.title, 'textbook curriculum');
            liveCourses.push({
              id: `wiki-${page.pageid || idx}`,
              title: page.title,
              description: `Open-source textbook and complete syllabus track on ${page.title}.`,
              category,
              subcategory,
              provider: 'WikiBooks',
              isFree: true,
              rating: '4.7',
              enrolled: '50k+ readers',
              level: 'Beginner',
              duration: 'Self-Paced Track',
              url: `https://en.wikibooks.org/wiki/${encodeURIComponent(page.title)}`,
              gradient: GRADIENTS['WikiBooks'],
              tag: 'Open Textbook',
              hasCertificate: false,
              highlights: ['Community-vetted syllabus', 'Practice exercises', '100% open-access resource']
            });
          });
        }

        // 4. Parse Hacker Hub
        for (const res of [hn1, hn2]) {
          const data = await readJson(res);
          (data?.hits || []).filter(h => h.title).forEach(hit => {
            const { category, subcategory } = classifyText(hit.title, '');
            liveCourses.push({
              id: `hn-${hit.objectID}`,
              title: hit.title,
              description: `Curated learning guide submitted by @${hit.author || 'engineer'} on Hacker Hub.`,
              category,
              subcategory,
              provider: 'Hacker Hub',
              isFree: true,
              rating: '4.9',
              enrolled: `${hit.points || 150} pts`,
              level: 'Intermediate',
              duration: 'Self-Paced Track',
              url: hit.url && hit.url.startsWith('http') ? hit.url : `https://news.ycombinator.com/item?id=${hit.objectID}`,
              gradient: GRADIENTS['Hacker Hub'],
              tag: 'Vetted Track',
              hasCertificate: false,
              highlights: ['Direct link to lecture repos', 'Vetted by engineering community', 'Zero paywalls']
            });
          });
        }

        // 5. Parse Apple Podcasts
        for (const res of [apple1, apple2, apple3]) {
          const data = await readJson(res);
          (data?.results || []).forEach((item, idx) => {
            if (!item.collectionName || !item.collectionViewUrl) return;
            const { category, subcategory } = classifyText(item.collectionName, '');
            liveCourses.push({
              id: `apple-${item.collectionId || idx}`,
              title: item.collectionName,
              description: `Open curriculum lecture series by ${item.artistName || 'University Faculty'}.`,
              category,
              subcategory,
              provider: 'Apple',
              isFree: true,
              rating: '4.9',
              enrolled: '35k+ scholars',
              level: 'Intermediate',
              duration: 'Lecture Series',
              url: item.collectionViewUrl,
              gradient: GRADIENTS['Apple'],
              tag: 'Audio Track',
              hasCertificate: false,
              highlights: ['Recorded university lectures', 'Academic syllabus notes', '100% open access']
            });
          });
        }

        // 6. Parse Coursera Live Streams
        for (const res of [coursera1, coursera2]) {
          const data = await readJson(res);
          (data?.hits || []).filter(h => h.title).forEach(hit => {
            const { category, subcategory } = classifyText(hit.title, '');
            liveCourses.push({
              id: `coursera-${hit.objectID}`,
              title: hit.title.replace(/\[.*?\]|\(.*?\)/g, '').trim(),
              description: `University & industry curriculum on ${subcategory} hosted on Coursera.`,
              category,
              subcategory,
              provider: 'Coursera',
              isFree: false,
              rating: '4.9',
              enrolled: `${hit.points ? hit.points * 15 : 85}k+`,
              level: 'Intermediate',
              duration: '3 Months',
              url: hit.url && hit.url.startsWith('http') ? hit.url : `https://www.coursera.org/search?query=${encodeURIComponent(subcategory)}`,
              gradient: GRADIENTS['Coursera'],
              tag: 'Specialization',
              hasCertificate: true,
              highlights: ['University verified curriculum', 'Hands-on applied lab projects', 'Digital certificate']
            });
          });
        }

        // 7. Parse CodeCamp
        for (const res of [fcc1, fcc2, fcc3, fcc4]) {
          const data = await readJson(res);
          const list = Array.isArray(data) ? data : (data?.hits || []);
          list.forEach(item => {
            const title = item.title;
            const url = item.url && item.url.startsWith('http')
              ? item.url
              : (item.objectID ? `https://news.ycombinator.com/item?id=${item.objectID}` : null);
            if (!title || !url) return;

            const { category, subcategory } = classifyText(title, item.description || '', (item.tag_list || []).join(' '));
            liveCourses.push({
              id: `fcc-${item.id || item.objectID}`,
              title: `${title.replace(/\[.*?\]|\(.*?\)/g, '').trim()} (CodeCamp Track)`,
              description: item.description || `Interactive freeCodeCamp curriculum on ${subcategory}.`,
              category,
              subcategory,
              provider: 'CodeCamp',
              isFree: true,
              rating: '4.9',
              enrolled: `${item.positive_reactions_count ? item.positive_reactions_count * 20 : (item.points ? item.points * 12 : 95)}k+`,
              level: 'All Levels',
              duration: '300 Hours',
              url: url,
              gradient: GRADIENTS['CodeCamp'],
              tag: '100% Free Verified',
              hasCertificate: true,
              highlights: ['Interactive browser code editor', 'Mandatory capstone projects', 'Verified certification']
            });
          });
        }

        // Deduplicate & Update State
        const seen = new Set();
        const deduped = liveCourses.filter(c => {
          if (!c.url || seen.has(c.url)) return false;
          seen.add(c.url);
          return true;
        });

        if (deduped.length > 0) {
          setCourses(deduped);
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else {
          throw new Error('No live courses parsed');
        }

      } catch (err) {
        setApiError('Unable to connect to live course feeds.');
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    syncLiveCourses();
  }, [syncLiveCourses]);

  const activeCategoryObj = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCat) || CATEGORIES[0];
  }, [selectedCat]);

  const platformCounts = useMemo(() => {
    const counts = { all: courses.length };
    courses.forEach((c) => {
      counts[c.provider] = (counts[c.provider] || 0) + 1;
    });
    return counts;
  }, [courses]);

  const availablePlatforms = useMemo(() => {
    const set = new Set(courses.map((c) => c.provider).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [courses]);

  // Multi-Dimension Filtering & Sorting
  const filteredCourses = useMemo(() => {
    let result = courses.filter((course) => {
      if (showSavedOnly && !bookmarks.includes(course.id)) return false;
      if (platformFilter !== 'all' && (course.provider || '').toLowerCase() !== platformFilter.toLowerCase()) return false;
      if (selectedCat !== 'all' && (course.category || '').toLowerCase() !== selectedCat.toLowerCase()) return false;
      if (selectedSubCat !== 'All' && !(course.subcategory || '').toLowerCase().includes(selectedSubCat.toLowerCase())) return false;
      if (priceFilter === 'free' && !course.isFree) return false;
      if (priceFilter === 'paid' && course.isFree) return false;

      // Level Filter
      if (levelFilter !== 'all') {
        const lvl = (course.level || '').toLowerCase();
        if (levelFilter === 'beginner' && !lvl.includes('beginner') && !lvl.includes('all')) return false;
        if (levelFilter === 'intermediate' && !lvl.includes('intermediate') && !lvl.includes('all')) return false;
        if (levelFilter === 'advanced' && !lvl.includes('advanced') && !lvl.includes('expert') && !lvl.includes('all')) return false;
      }

      // Separate Duration Filter
      if (!matchesDurationFilter(course.duration, durationFilter)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = (course.title || '').toLowerCase().includes(q);
        const inDesc = (course.description || '').toLowerCase().includes(q);
        const inProvider = (course.provider || '').toLowerCase().includes(q);
        const inSubcat = (course.subcategory || '').toLowerCase().includes(q);
        return inTitle || inDesc || inProvider || inSubcat;
      }
      return true;
    });

    // Clean Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => parseEnrollment(b.enrolled) - parseEnrollment(a.enrolled));
    } else if (sortBy === 'titleAsc') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [courses, selectedCat, selectedSubCat, searchQuery, priceFilter, platformFilter, levelFilter, durationFilter, showSavedOnly, bookmarks, sortBy]);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('courseverse_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCompare = (course) => {
    setCompareList((prev) => {
      const exists = prev.some((c) => c.id === course.id);
      if (exists) {
        const next = prev.filter((c) => c.id !== course.id);
        if (next.length === 0) setIsCompareModalOpen(false);
        return next;
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 courses at a time.');
        return prev;
      }
      return [...prev, course];
    });
  };

  const clearAllFilters = () => {
    setSelectedCat('all');
    setSelectedSubCat('All');
    setSearchQuery('');
    setPriceFilter('all');
    setPlatformFilter('all');
    setLevelFilter('all');
    setDurationFilter('all');
    setSortBy('featured');
    setShowSavedOnly(false);
    setLanguageFilter('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar - Clean Light Mode */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shadow-sm border border-pink-200">
              <GraduationCap size={22} className="text-pink-600" />
            </div>
            <div>
              <span className="text-[20px] font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CourseVerse
                </span>
                <span className="text-[15px] uppercase tracking-wider font-black bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  Hub
                </span>
              </span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* Saved Button (Pink Theme) */}
            <button
              type="button"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[15px] font-semibold border transition-all ${showSavedOnly
                ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                : 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100'
                }`}
            >
              <Heart size={14} className={showSavedOnly ? 'fill-white text-white' : 'text-pink-600'} />
              <span>Saved ({bookmarks.length})</span>
            </button>

            {/* Compare Button */}
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[15px] font-semibold bg-pink-600 text-white border border-pink-600 hover:bg-pink-700 transition-colors shadow-sm"
              >
                <ArrowLeftRight size={14} />
                <span>Compare ({compareList.length}/4)</span>
              </button>
            )}

            {/* Live Sync Button */}
            <button
              type="button"
              onClick={() => syncLiveCourses(searchQuery || null, true)}
              disabled={isSyncing}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[15px] font-semibold bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin text-pink-600' : 'text-pink-600'} />
              <span>{isSyncing ? 'Syncing...' : 'Live Sync'}</span>
            </button>

            {/* User Section / Join Free */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-[15px] font-semibold text-pink-700 border border-pink-200">
                  <UserCheck size={14} className="text-emerald-600" />
                  <span className="hidden md:inline">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-full text-slate-500 hover:text-pink-600 hover:bg-pink-50 transition"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }}
                  className="text-[15px] font-bold text-white bg-pink-600 hover:bg-pink-700 px-4 py-1.5 rounded-full shadow-sm shadow-pink-500/20 transition"
                >
                  Join Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-indigo-100 py-14 md:py-18 relative overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/60 via-indigo-50/30 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">

          {/* Top Badge - Increased Size */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/80 text-violet-900 text-sm sm:text-base font-bold mb-6 shadow-sm shadow-violet-100">
            <Sparkles size={18} className="text-violet-600 animate-pulse" />
            <span>Multi-Platform Public Course Directory</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-center bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent pb-3 pt-1 leading-[1.3] sm:leading-[1.3]">
            Discover Verified Courses Across Every Tech Track
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-violet-900/80 max-w-2xl mx-auto mb-8 font-semibold leading-relaxed">
            Real-time curriculum indexing across CodeCamp, Coursera, Hacker Hub University Archives, Open Library, Apple OCW, WikiBooks, and DEV Community.
          </p>

          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-lg shadow-violet-500/5 rounded-2xl bg-white border border-violet-200/90 p-1.5 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 transition-all">
              <Search size={20} className="ml-3.5 text-violet-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Python, React, AI, Machine Learning, Figma, Rust..."
                className="w-full px-3 py-2.5 text-sm sm:text-base bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-violet-50 transition mr-1"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => syncLiveCourses(searchQuery)}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-[13px] sm:text-sm font-bold rounded-xl shadow-md shadow-violet-500/20 transition flex items-center gap-1.5 shrink-0"
              >
                Search <ArrowRight size={15} />
              </button>
            </div>

            {/* Sync Status Badge */}
            {lastSyncTime && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/80 w-fit mx-auto px-4 py-1.5 rounded-full shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{courses.length} Live courses • Last synced at {lastSyncTime}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Controls & Filter Bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">

        <div className="bg-indigo-50/70 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-900/5 mb-8 space-y-5">

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCat === cat.id;
              const IconComponent = cat.icon && ICON_MAP[cat.icon] ? ICON_MAP[cat.icon] : Globe;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCat(cat.id);
                    const firstSub = cat.subcategories?.[0];
                    const firstSubName = typeof firstSub === 'string' ? firstSub : firstSub?.name;
                    setSelectedSubCat(firstSubName || '');
                  }}
                  className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white ring-2 ring-blue-400 scale-[1.02]'
                    : 'bg-white text-blue-900 border border-blue-200/80 hover:bg-blue-100/80 hover:border-blue-300'
                    }`}
                >
                  <IconComponent className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Subcategories */}
          {activeCategoryObj?.subcategories && activeCategoryObj.subcategories.length > 0 && (
            <div className="pt-4 border-t border-indigo-200/60">
              <div className="text-[15px] flex items-center gap-3 bg-purple-100/60 p-3 rounded-xl border border-purple-200/50">

                {/* Tracks */}
                <div className="inline-flex flex-col items-center gap-1.5 bg-violet-900/10 border border-violet-300/60 px-3 py-1 rounded-lg shrink-0">
                  <Layers className="w-4 h-4 text-violet-700" />
                  <span className="text-[15px] font-black tracking-widest text-violet-900 uppercase">
                    TRACKS
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-2.5 flex-1">
                  {activeCategoryObj.subcategories
                    .filter((subItem) => {
                      const subName = typeof subItem === 'string' ? subItem : subItem.name;
                      const isAllDomain = activeCategoryObj.id === 'all' || activeCategoryObj.name === 'All Domains';
                      if (isAllDomain && subName.toLowerCase() === 'all') {
                        return false;
                      }
                      return true;
                    })
                    .map((subItem) => {
                      const subName = typeof subItem === 'string' ? subItem : subItem.name;

                      const isProgramming = activeCategoryObj.name === 'Programming' || activeCategoryObj.id === 'programming';
                      const subIconKey = typeof subItem === 'object' && subItem.icon ? subItem.icon : null;
                      const SubIconComponent = isProgramming && subName !== 'All'
                        ? Code2
                        : (subIconKey && ICON_MAP[subIconKey] ? ICON_MAP[subIconKey] : (activeCategoryObj.icon && ICON_MAP[activeCategoryObj.icon] ? ICON_MAP[activeCategoryObj.icon] : Globe));

                      const isSubActive = selectedSubCat === subName;

                      return (
                        <button
                          key={subName}
                          type="button"
                          onClick={() => setSelectedSubCat(subName)}
                          className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[14px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${isSubActive
                            ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/30 ring-1 ring-violet-300'
                            : 'bg-white/90 text-violet-900 border border-violet-200 hover:bg-violet-200/70 hover:text-violet-950'
                            }`}
                        >
                          <SubIconComponent className={`w-3.5 h-3.5 transition-transform duration-150 group-hover:scale-110 ${isSubActive ? 'text-white' : 'text-violet-500'}`} />
                          <span>{subName}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Control Bar */}
        <div className="relative mb-8 w-full z-30">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-200/50 via-purple-200/40 to-pink-200/50 rounded-[2.5rem] blur-2xl opacity-80 pointer-events-none -z-10" />

          {/* Equal Height Grid Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch w-full">

            {/* Left: Domain Title, Badge & 5 Dropdowns */}
            <div className="lg:col-span-8 xl:col-span-9 relative bg-white/95 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-indigo-100/80 shadow-[0_12px_40px_rgba(79,70,229,0.06)] flex flex-col justify-between gap-5 h-full transition-all">

              {/* Icon Title And Live Counter Badge */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
                  {showSavedOnly ? <Bookmark size={22} className="fill-white/20" /> : <SlidersHorizontal size={22} />}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-blue-900">
                    {showSavedOnly ? 'Saved Library' : (activeCategoryObj?.name || 'All Courses')}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 text-sm sm:text-sm font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <span>{filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Available</span>
                  </div>
                </div>
              </div>

              {/* Dropdowns Grid: 2 columns on Mobile Flex on Desktop */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 flex-1 justify-center">

                {/* Platform Dropdown */}
                <div className="relative col-span-1 sm:flex-1 min-w-0" data-dropdown>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
                    className={`w-full flex items-center justify-between gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl border transition-all duration-200 ${openDropdown === 'platform' || platformFilter !== 'all'
                      ? 'bg-sky-100/90 border-sky-300 text-sky-950 shadow-md shadow-sky-500/10'
                      : 'bg-sky-50/70 hover:bg-sky-100/60 border-sky-200/70 text-sky-900'
                      }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <div className="w-6 h-6 rounded-lg bg-sky-200/80 flex items-center justify-center text-sky-700 shrink-0">
                        <Globe2 size={14} />
                      </div>
                      <div className="text-left min-w-0 truncate">
                        <p className="text-[11px] sm:text-[13px] font-bold uppercase text-sky-600">Platform</p>
                        <p className="text-[12px] sm:text-[13px] font-extrabold capitalize truncate">
                          {platformFilter === 'all' ? 'All Sources' : platformFilter}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-sky-600 shrink-0 transition-transform duration-200 ${openDropdown === 'platform' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Platform Popover Menu */}
                  {openDropdown === 'platform' && (
                    <div className="absolute left-0 top-full mt-2 w-56 max-w-[85vw] bg-white backdrop-blur-2xl p-2 rounded-2xl border border-sky-100 shadow-2xl shadow-sky-500/20 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2 py-1.5 text-[13px] font-bold text-sky-600 uppercase tracking-wider">Select Source</div>
                      <button
                        type="button"
                        onClick={() => { setPlatformFilter('all'); setOpenDropdown(null); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${platformFilter === 'all'
                          ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                          : 'text-sky-950 hover:bg-sky-50'
                          }`}
                      >
                        <span>All Sources</span>
                        <span className={`text-[13px] px-1.5 py-0.5 rounded-full ${platformFilter === 'all' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700'}`}>
                          {platformCounts.all || 0}
                        </span>
                      </button>
                      {availablePlatforms.filter(p => p !== 'all').map(prov => (
                        <button
                          key={prov}
                          type="button"
                          onClick={() => { setPlatformFilter(prov); setOpenDropdown(null); }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all mt-1 ${platformFilter === prov
                            ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                            : 'text-sky-950 hover:bg-sky-50'
                            }`}
                        >
                          <span className="capitalize">{prov}</span>
                          <span className={`text-[13px] px-1.5 py-0.5 rounded-full ${platformFilter === prov ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700'}`}>
                            {platformCounts[prov] || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Level Dropdown */}
                <div className="relative col-span-1 sm:flex-1 min-w-0" data-dropdown>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
                    className={`w-full flex items-center justify-between gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl border transition-all duration-200 ${openDropdown === 'level' || levelFilter !== 'all'
                      ? 'bg-purple-100/90 border-purple-300 text-purple-950 shadow-md shadow-purple-500/10'
                      : 'bg-purple-50/70 hover:bg-purple-100/60 border-purple-200/70 text-purple-900'
                      }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <div className="w-6 h-6 rounded-lg bg-purple-200/80 flex items-center justify-center text-purple-700 shrink-0">
                        <BarChart3 size={14} />
                      </div>
                      <div className="text-left min-w-0 truncate">
                        <p className="text-[11px] sm:text-[13px] font-bold uppercase tracking-wider text-purple-600">Level</p>
                        <p className="text-[12px] sm:text-[13px] font-extrabold truncate">
                          {levelFilter === 'all' ? 'All Levels' : levelFilter === 'beginner' ? 'Beginner' : levelFilter === 'intermediate' ? 'Intermediate' : 'Advanced'}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-purple-600 shrink-0 transition-transform duration-200 ${openDropdown === 'level' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Level Popover Menu */}
                  {openDropdown === 'level' && (
                    <div className="absolute left-0 top-full mt-2 w-56 max-w-[85vw] bg-white backdrop-blur-2xl p-2 rounded-2xl border border-purple-100 shadow-2xl shadow-purple-500/20 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2 py-1.5 text-[13px] font-bold text-purple-600 uppercase tracking-wider">Difficulty Level</div>
                      {[
                        { value: 'all', label: 'All Levels', icon: GraduationCap },
                        { value: 'beginner', label: 'Beginner Friendly', icon: BookOpen },
                        { value: 'intermediate', label: 'Intermediate', icon: Zap },
                        { value: 'advanced', label: 'Mastery / Advanced', icon: Sparkles }
                      ].map(opt => {
                        const Icon = opt.icon;
                        const isSelected = levelFilter === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setLevelFilter(opt.value); setOpenDropdown(null); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all mt-1 ${isSelected
                              ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                              : 'text-purple-950 hover:bg-purple-50'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon size={14} className={isSelected ? 'text-white' : 'text-purple-500'} />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <Check size={14} className="stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Duration Dropdown */}
                <div className="relative col-span-1 sm:flex-1 min-w-0" data-dropdown>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'duration' ? null : 'duration')}
                    className={`w-full flex items-center justify-between gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl border transition-all duration-200 ${openDropdown === 'duration' || durationFilter !== 'all'
                      ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950 shadow-md shadow-emerald-500/10'
                      : 'bg-emerald-50/70 hover:bg-emerald-100/60 border-emerald-200/70 text-emerald-900'
                      }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <div className="w-6 h-6 rounded-lg bg-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0">
                        <Timer size={14} />
                      </div>
                      <div className="text-left min-w-0 truncate">
                        <p className="text-[11px] sm:text-[13px] font-bold uppercase tracking-wider text-emerald-600">Duration</p>
                        <p className="text-[12px] sm:text-[13px] font-extrabold truncate">
                          {durationFilter === 'all' ? 'All Durations' : durationFilter === 'under2Weeks' ? '< 2 Weeks' : durationFilter === '2to4Weeks' ? '2–4 Weeks' : durationFilter === '1to3Months' ? '1–3 Months' : durationFilter === '3PlusMonths' ? '3+ Months' : 'Self-Paced'}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-emerald-600 shrink-0 transition-transform duration-200 ${openDropdown === 'duration' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Duration Popover Menu */}
                  {openDropdown === 'duration' && (
                    <div className="absolute left-0 top-full mt-2 w-64 max-w-[85vw] bg-white backdrop-blur-2xl p-2 rounded-2xl border border-emerald-100 shadow-2xl shadow-emerald-500/20 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2 py-1.5 text-[13px] font-bold text-emerald-600 uppercase tracking-wider">Estimated Time</div>
                      {[
                        { value: 'all', label: 'All Durations', icon: Clock },
                        { value: 'under2Weeks', label: '< 2 Weeks (Crash)', icon: Timer },
                        { value: '2to4Weeks', label: '2–4 Weeks (Standard)', icon: Timer },
                        { value: '1to3Months', label: '1–3 Months (Deep Dive)', icon: Timer },
                        { value: '3PlusMonths', label: '3+ Months (Specialization)', icon: Timer },
                        { value: 'selfPaced', label: 'Self-Paced & Books', icon: BookOpen }
                      ].map(opt => {
                        const Icon = opt.icon;
                        const isSelected = durationFilter === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setDurationFilter(opt.value); setOpenDropdown(null); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all mt-1 ${isSelected
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                              : 'text-emerald-950 hover:bg-emerald-50'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon size={14} className={isSelected ? 'text-white' : 'text-emerald-600'} />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <Check size={14} className="stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Language Dropdown */}
                <div className="relative col-span-1 sm:flex-1 min-w-0" data-dropdown>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
                    className={`w-full flex items-center justify-between gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl border transition-all duration-200 ${openDropdown === 'language' || (languageFilter && languageFilter !== 'all')
                      ? 'bg-rose-100/90 border-rose-300 text-rose-950 shadow-md shadow-rose-500/10'
                      : 'bg-rose-50/70 hover:bg-rose-100/60 border-rose-200/70 text-rose-900'
                      }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <div className="w-6 h-6 rounded-lg bg-rose-200/80 flex items-center justify-center text-rose-700 shrink-0">
                        <Languages size={14} />
                      </div>
                      <div className="text-left min-w-0 truncate">
                        <p className="text-[11px] sm:text-[13px] font-bold uppercase tracking-wider text-rose-600">Language</p>
                        <p className="text-[12px] sm:text-[13px] font-extrabold truncate">
                          {languageFilter === 'all' || !languageFilter ? 'All Languages' : languageFilter === 'english' ? 'English' : languageFilter === 'hindi' ? 'Hindi' : 'Other'}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-rose-600 shrink-0 transition-transform duration-200 ${openDropdown === 'language' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Language Popover Menu */}
                  {openDropdown === 'language' && (
                    <div className="absolute right-0 sm:left-0 top-full mt-2 w-52 max-w-[85vw] bg-white backdrop-blur-2xl p-2 rounded-2xl border border-rose-100 shadow-2xl shadow-rose-500/20 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2 py-1.5 text-[13px] font-bold text-rose-600 uppercase tracking-wider">Select Language</div>
                      {[
                        { value: 'all', label: 'All Languages', icon: Globe2 },
                        { value: 'english', label: 'English', icon: Languages },
                        { value: 'hindi', label: 'Hindi', icon: Languages },
                        { value: 'other', label: 'Other', icon: Sparkles }
                      ].map(opt => {
                        const Icon = opt.icon;
                        const isSelected = (languageFilter || 'all') === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setLanguageFilter?.(opt.value); setOpenDropdown(null); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all mt-1 ${isSelected
                              ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                              : 'text-rose-950 hover:bg-rose-50'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon size={14} className={isSelected ? 'text-white' : 'text-rose-500'} />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <Check size={14} className="stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative col-span-2 sm:col-span-1 sm:flex-1 min-w-0" data-dropdown>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                    className={`w-full flex items-center justify-between gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl border transition-all duration-200 ${openDropdown === 'sort'
                      ? 'bg-amber-100/90 border-amber-300 text-amber-950 shadow-md shadow-amber-500/10'
                      : 'bg-amber-50/70 hover:bg-amber-100/60 border-amber-200/70 text-amber-900'
                      }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 truncate">
                      <div className="w-6 h-6 rounded-lg bg-amber-200/80 flex items-center justify-center text-amber-700 shrink-0">
                        <Sparkles size={14} />
                      </div>
                      <div className="text-left min-w-0 truncate">
                        <p className="text-[11px] sm:text-[13px] font-bold uppercase tracking-wider text-amber-600">Sort By</p>
                        <p className="text-[12px] sm:text-[13px] font-extrabold truncate">
                          {sortBy === 'featured' ? 'Featured First' : sortBy === 'popular' ? 'Most Popular' : sortBy === 'rating' ? 'Highest Rated' : 'Alphabetical'}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-amber-600 shrink-0 transition-transform duration-200 ${openDropdown === 'sort' ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Sort Popover Menu */}
                  {openDropdown === 'sort' && (
                    <div className="absolute left-0 top-full mt-2 w-52 max-w-[85vw] bg-white backdrop-blur-2xl p-2 rounded-2xl border border-amber-100 shadow-2xl shadow-amber-500/20 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-2 py-1.5 text-[13px] font-bold text-amber-600 uppercase tracking-wider">Sort Order</div>
                      {[
                        { value: 'featured', label: 'Featured First', icon: Sparkles },
                        { value: 'popular', label: 'Most Popular', icon: Flame },
                        { value: 'rating', label: 'Highest Rated', icon: Star },
                        { value: 'titleAsc', label: 'Alphabetical (A–Z)', icon: ArrowDownAZ }
                      ].map(opt => {
                        const Icon = opt.icon;
                        const isSelected = sortBy === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setSortBy(opt.value); setOpenDropdown(null); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all mt-1 ${isSelected
                              ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                              : 'text-amber-950 hover:bg-amber-50'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon size={14} className={isSelected ? 'text-white' : 'text-amber-600'} />
                              <span>{opt.label}</span>
                            </div>
                            {isSelected && <Check size={14} className="stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Right: Pricing Box */}
            <div className="lg:col-span-4 xl:col-span-3 relative bg-white/95 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-indigo-100/80 shadow-[0_12px_40px_rgba(79,70,229,0.06)] flex flex-col justify-between gap-4 h-full transition-all">

              <div className="flex items-center justify-center gap-2 pb-2 border-b border-indigo-100/70">
                <div className="w-6 h-6 rounded-lg bg-indigo-200/80 flex items-center justify-center text-indigo-700 shrink-0">
                  <Coins size={14} />
                </div>
                <span className="text-[15px] font-bold uppercase tracking-wider text-indigo-600">
                  Pricing Plan
                </span>
              </div>

              {/* Pricing Buttons */}
              <div className="grid grid-cols-3 lg:flex lg:flex-col gap-2.5 flex-1 justify-center">
                <button
                  type="button"
                  onClick={() => setPriceFilter('all')}
                  className={`w-full text-center py-2.5 px-2 sm:px-3 rounded-xl text-[13px] sm:text-[15px] font-extrabold transition-all duration-200 cursor-pointer ${priceFilter === 'all'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-[1.02]'
                    : 'bg-white/80 text-orange-500 border border-indigo-100/60 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-sm'
                    }`}
                >
                  All Courses
                </button>

                <button
                  type="button"
                  onClick={() => setPriceFilter('free')}
                  className={`w-full text-center py-2.5 px-2 sm:px-3 rounded-xl text-[13px] sm:text-[15px] font-extrabold transition-all duration-200 cursor-pointer ${priceFilter === 'free'
                    ? 'bg-yellow-500 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                    : 'bg-white/80 text-orange-500 border border-indigo-100/60 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-sm'
                    }`}
                >
                  Free Courses
                </button>

                <button
                  type="button"
                  onClick={() => setPriceFilter('paid')}
                  className={`w-full text-center py-2.5 px-2 sm:px-3 rounded-xl text-[13px] sm:text-[15px] font-extrabold transition-all duration-200 cursor-pointer ${priceFilter === 'paid'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-[1.02]'
                    : 'bg-white/80 text-orange-500 border border-indigo-100/60 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-sm'
                    }`}
                >
                  Paid Courses
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards */}
        {isSyncing ? (
          <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="inline-block w-8 h-8 border-3 border-zinc-900 border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="text-base font-bold text-red-800">Synchronizing Public Course Streams...</h3>
            <p className="text-[15px] text-red-500 font-bold mt-1 max-w-sm mx-auto">
              Aggregating Websites
            </p>
          </div>
        ) : apiError ? (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
              !
            </div>
            <h3 className="text-[15px] font-bold text-rose-900">Live Sync Interrupted</h3>
            <p className="text-[15px] font-bold text-rose-700 mt-1 max-w-md mx-auto">{apiError}</p>
            <button
              type="button"
              onClick={() => syncLiveCourses(searchQuery || null, true)}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[15px] font-semibold rounded-lg shadow-sm transition"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          <LessonList
            courses={filteredCourses}
            bookmarks={bookmarks}
            compareList={compareList}
            onToggleBookmark={toggleBookmark}
            onToggleCompare={toggleCompare}
            onClearFilters={clearAllFilters}
          />
        )}
      </main>

      {/* Compare Modal */}
      {isCompareModalOpen && compareList.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-indigo-950/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl border border-pink-100 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Violet Theme */}
            <div className="flex items-center justify-between pb-4 border-b border-violet-100 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <ArrowLeftRight size={22} className="text-violet-600" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                    Side-by-Side Track Comparison
                  </span>
                </h3>
                <p className="text-[18px] text-violet-600 font-medium mt-0.5">
                  Evaluating {compareList.length} <span className="text-violet-600 font-semibold">course curricula</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-xl text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {compareList.map((c) => (
                <div
                  key={c.id}
                  className="bg-pink-50/40 rounded-2xl border border-pink-200/80 flex flex-col justify-between overflow-hidden shadow-sm"
                >
                  {/* Header Gradient */}
                  <div className="p-4 text-white" style={{ background: c.gradient || 'linear-gradient(135deg, #e11d48, #be185d)' }}>
                    <div className="flex items-center justify-between text-[13px] font-extrabold uppercase tracking-wider mb-2 opacity-90">
                      <span>{c.provider}</span>
                      <button
                        type="button"
                        onClick={() => toggleCompare(c)}
                        className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 transition"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <h4 className="font-bold text-[13px] leading-snug line-clamp-2">{c.title}</h4>
                  </div>

                  {/* Spec Details */}
                  <div className="p-4 space-y-3.5 text-[13px] text-pink-950 flex-1 bg-white/60">
                    <div>
                      <span className="text-[13px] text-pink-600 font-bold uppercase tracking-wider block mb-0.5">Category</span>
                      <span className="font-bold text-pink-950 text-[14px]">{c.subcategory || c.category}</span>
                    </div>
                    <div>
                      <span className="text-[13px] text-pink-600 font-bold uppercase tracking-wider block mb-0.5">Rating</span>
                      <span className="font-bold text-pink-950 text-[14px]">⭐ {c.rating || '4.8'}</span>
                    </div>
                    <div>
                      <span className="text-[13px] text-pink-600 font-bold uppercase tracking-wider block mb-0.5">Commitment</span>
                      <span className="font-bold text-pink-950 text-[14px]">{c.duration || 'Self-Paced'}</span>
                    </div>
                    <div>
                      <span className="text-[13px] text-pink-600 font-bold uppercase tracking-wider block mb-0.5">Tuition</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[14px] font-extrabold ${c.isFree ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {c.isFree ? '100% Free' : 'Paid Course'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[13px] text-pink-600 font-bold uppercase tracking-wider block mb-0.5">Certificate</span>
                      <span className="font-semibold text-pink-900 text-[14px]">{c.hasCertificate ? '📜 Official Path' : 'Audit / Open Syllabus'}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-3 bg-white border-t border-pink-100">
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-[15px] font-bold transition shadow-sm shadow-pink-500/20"
                    >
                      Visit <ExternalLink size={15} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Auth */}
      <LoginForm
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userData) => login(userData)}
        initialMode={authMode}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
