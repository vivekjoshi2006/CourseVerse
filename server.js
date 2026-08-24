const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const HTTP = axios.create({
  timeout: 8500,
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 25 }),
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CourseVerse/4.0',
    'Api-User-Agent': 'CourseVerse/4.0 (contact: courseverse.project@gmail.com)',
    Accept: 'application/json, text/plain, */*',
  },
});

let cachedCourses = [];
let lastCacheTime = 0;
let ingestionPromise = null;
const CACHE_TTL = 10 * 60 * 1000;

// Categories
const CATEGORIES_CONFIG = [
  {
    category: 'programming',
    subcategories: ['Python', 'JavaScript & TypeScript', 'C / C++', 'Java & Spring', 'Rust & Go', 'Algorithms & DS', 'Full Stack'],
  },
  {
    category: 'tech',
    subcategories: ['Web Development', 'Mobile Dev', 'DevOps', 'Cybersecurity', 'System Design'],
  },
  {
    category: 'ai',
    subcategories: ['Machine Learning', 'Data Science', 'LLMs', 'Deep Learning', 'Computer Vision'],
  },
  {
    category: 'design',
    subcategories: ['UI/UX Design', '3D Animation', 'Graphic Design', 'Figma & Design Systems'],
  },
  {
    category: 'business',
    subcategories: ['Digital Marketing', 'Product Management', 'Startup Growth', 'Fintech & Sales'],
  },
  {
    category: 'languages',
    subcategories: ['Spanish', 'French', 'German', 'Japanese', 'English', 'Mandarin'],
  },
];

const DEV_TAG_MAP = {
  // Programming
  'Python': 'python',
  'JavaScript & TypeScript': 'javascript',
  'C / C++': 'cpp',
  'Java & Spring': 'java',
  'Rust & Go': 'rust',
  'Algorithms & DS': 'algorithms',
  'Full Stack': 'webdev',

  // Tech & CS
  'Web Development': 'webdev',
  'Mobile Dev': 'mobile',
  'DevOps': 'devops',
  'Cybersecurity': 'security',
  'System Design': 'architecture',

  // AI & Data
  'Machine Learning': 'machinelearning',
  'Data Science': 'datascience',
  'LLMs': 'ai',
  'Deep Learning': 'deeplearning',
  'Computer Vision': 'computervision',

  // Design & Creative
  'UI/UX Design': 'design',
  '3D Animation': 'blender',
  'Graphic Design': 'design',
  'Figma & Design Systems': 'figma',

  // Business & SaaS
  'Digital Marketing': 'marketing',
  'Product Management': 'product',
  'Startup Growth': 'startup',
  'Fintech & Sales': 'fintech',

  // Languages
  'Spanish': 'learning',
  'French': 'learning',
  'German': 'learning',
  'Japanese': 'learning',
  'English': 'beginners',
  'Mandarin': 'learning',
};

const GRADIENTS = {
  'CodeCamp': 'linear-gradient(135deg, #4c1d95, #24202c)',
  'Coursera': 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
  'Hacker Hub': 'linear-gradient(135deg, #c2410c, #ea580c)',
  'Open Library': 'linear-gradient(135deg, #065f46, #059669)',
  'DEV Community': 'linear-gradient(135deg, #4338ca, #6366f1)',
  'DEV Com': 'linear-gradient(135deg, #4338ca, #6366f1)',
  'Stanford & Oxford': 'linear-gradient(135deg, #6b21a8, #9333ea)',
  'WikiBooks': 'linear-gradient(135deg, #0f766e, #0d9488)',
};

const stripHtml = (html = '') => (typeof html === 'string' ? html.replace(/<[^>]*>?/gm, '').trim() : '');

// Multi-Domain Classifier
const classifyText = (title = '', desc = '', tags = '') => {
  const text = `${title} ${desc} ${tags}`.toLowerCase();

  // Languages
  if (text.includes('spanish') || text.includes('espanol')) return { category: 'languages', subcategory: 'Spanish' };
  if (text.includes('french') || text.includes('francais')) return { category: 'languages', subcategory: 'French' };
  if (text.includes('german') || text.includes('deutsch')) return { category: 'languages', subcategory: 'German' };
  if (text.includes('japanese') || text.includes('nihongo')) return { category: 'languages', subcategory: 'Japanese' };
  if (text.includes('mandarin') || text.includes('chinese')) return { category: 'languages', subcategory: 'Mandarin' };
  if (text.includes('english') || text.includes('grammar') || text.includes('language')) return { category: 'languages', subcategory: 'English' };

  // Programming

  if (
    text.includes('python') || text.includes('javascript') || text.includes('typescript') ||
    text.includes('c++') || text.includes('rust') || text.includes('golang') ||
    text.includes('java') || text.includes('algorithm') || text.includes('full stack')
  ) {
    let sub = 'Python';
    if (text.includes('javascript') || text.includes('typescript') || text.includes('react') || text.includes('node')) sub = 'JavaScript & TypeScript';
    if (text.includes('c++') || text.includes('c#') || text.includes('c /')) sub = 'C / C++';
    if (text.includes('rust') || text.includes('go') || text.includes('golang')) sub = 'Rust & Go';
    if (text.includes('java') || text.includes('spring')) sub = 'Java & Spring';
    if (text.includes('algorithm') || text.includes('data structure') || text.includes('leetcode')) sub = 'Algorithms & DS';
    if (text.includes('full stack') || text.includes('fullstack')) sub = 'Full Stack';
    return { category: 'programming', subcategory: sub };
  }

  // AI & Data

  if (text.includes('prompt') || text.includes('llm') || text.includes('gpt') || text.includes('genai') || text.includes('generative ai')) return { category: 'ai', subcategory: 'LLMs' };
  if (text.includes('computer vision') || text.includes('opencv')) return { category: 'ai', subcategory: 'Computer Vision' };
  if (text.includes('deep learning') || text.includes('neural')) return { category: 'ai', subcategory: 'Deep Learning' };
  if (text.includes('data science') || text.includes('analytics') || text.includes('sql') || text.includes('pandas')) return { category: 'ai', subcategory: 'Data Science' };
  if (text.includes('data') || text.includes('machine learning') || text.includes('ai')) return { category: 'ai', subcategory: 'Machine Learning' };

  // Design & Creative

  if (text.includes('3d') || text.includes('blender') || text.includes('animation') || text.includes('threejs')) return { category: 'design', subcategory: '3D Animation' };
  if (text.includes('figma') || text.includes('design system')) return { category: 'design', subcategory: 'Figma & Design Systems' };
  if (text.includes('graphic') || text.includes('photoshop') || text.includes('illustrator')) return { category: 'design', subcategory: 'Graphic Design' };
  if (text.includes('ui') || text.includes('ux') || text.includes('user experience')) return { category: 'design', subcategory: 'UI/UX Design' };

  // Business & SaaS

  if (text.includes('startup') || text.includes('entrepreneurship') || text.includes('saas') || text.includes('venture')) return { category: 'business', subcategory: 'Startup Growth' };
  if (text.includes('marketing') || text.includes('seo') || text.includes('social media')) return { category: 'business', subcategory: 'Digital Marketing' };
  if (text.includes('product management') || text.includes('scrum') || text.includes('agile')) return { category: 'business', subcategory: 'Product Management' };
  if (text.includes('fintech') || text.includes('sales') || text.includes('finance')) return { category: 'business', subcategory: 'Fintech & Sales' };

  // Tech & CS

  if (text.includes('devops') || text.includes('docker') || text.includes('kubernetes') || text.includes('cloud') || text.includes('aws')) return { category: 'tech', subcategory: 'DevOps' };
  if (text.includes('mobile') || text.includes('android') || text.includes('ios') || text.includes('flutter') || text.includes('react native')) return { category: 'tech', subcategory: 'Mobile Dev' };
  if (text.includes('security') || text.includes('cyber') || text.includes('hacking')) return { category: 'tech', subcategory: 'Cybersecurity' };
  if (text.includes('system design') || text.includes('architecture')) return { category: 'tech', subcategory: 'System Design' };

  return { category: 'tech', subcategory: 'Web Development' };
};

async function runInBatches(tasks, batchSize = 8, delayMs = 120) {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((fn) => fn()));
    results.push(...batchResults);
    if (i + batchSize < tasks.length && delayMs > 0) {
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  return results;
}

async function fetchAllLiveStreamsAuto() {
  if (ingestionPromise) {
    return ingestionPromise;
  }

  ingestionPromise = (async () => {
    console.log('\n[Auto-Ingestion] Fetching dynamic course streams for all categories...');
    const collected = [];
    const tasks = [];

    // Coursera

    tasks.push(async () => {
      try {
        const response = await HTTP.get('https://api.coursera.org/api/courses.v1', {
          params: {
            limit: 100,
            start: 0,
            fields: 'name,description,slug,workload,domainTypes,photoUrl,certificates',
          },
          timeout: 9000,
        });

        const elements = response.data?.elements || [];
        console.log(`✅ Coursera API Successfully fetched ${elements.length} live courses`);

        elements.forEach((item, idx) => {
          const domainStr = (item.domainTypes || [])
            .map((d) => `${d.domainId || ''} ${d.subdomainId || ''}`)
            .join(' ');

          const { category, subcategory } = classifyText(item.name, item.description || '', domainStr);

          collected.push({
            id: `coursera-live-${item.id || item.slug || idx}`,
            title: item.name,
            description: item.description
              ? item.description.substring(0, 160) + '...'
              : `University and industry curriculum on ${item.name} hosted on Coursera.`,
            category,
            subcategory,
            provider: 'Coursera',
            isFree: idx % 2 === 0,
            rating: (4.7 + (idx % 3) * 0.1).toFixed(1),
            enrolled: `${(35 + (idx % 8) * 8).toFixed(1)}k+`,
            level: idx % 3 === 0 ? 'Advanced' : 'Intermediate',
            duration: item.workload || '4–6 Weeks',
            url: `https://www.coursera.org/learn/${item.slug}`,
            imageUrl: item.photoUrl || null,
            gradient: GRADIENTS['Coursera'],
            tag: subcategory,
            hasCertificate: true,
            highlights: [
              'Official university & partner syllabus',
              'Hands-on applied learning labs',
              'Shareable digital certificate',
            ],
          });
        });
      } catch (err) {
        console.warn(`⚠️ Coursera Live API Error: ${err.message}`);
      }
    });

    // Loop Through All Categories & Subcategories
    CATEGORIES_CONFIG.forEach(({ category, subcategories }) => {
      subcategories.forEach((subcat) => {
        const cleanKeyword = encodeURIComponent(subcat.toLowerCase());
        const devTag = DEV_TAG_MAP[subcat] || 'programming';

        // DEV Community & CodeCamp
        tasks.push(async () => {
          try {
            const r = await HTTP.get(`https://dev.to/api/articles?tag=${encodeURIComponent(devTag)}&per_page=6`);
            const articles = r.data || [];

            // First 2 articles -> DEV Community
            articles.slice(0, 2).forEach((art) => {
              if (!art.title || !art.url) return;
              collected.push({
                id: `dev-${category}-${subcat.replace(/\s+/g, '-')}-${art.id}`,
                title: art.title,
                description: art.description ? art.description.substring(0, 150) + '...' : `Practical interactive guide on ${subcat}.`,
                category,
                subcategory: subcat,
                provider: 'DEV Community',
                isFree: true,
                rating: '4.8',
                enrolled: `${(2.4 + (art.positive_reactions_count || 10) * 0.1).toFixed(1)}k+`,
                level: 'Intermediate',
                duration: `${art.reading_time_minutes ? art.reading_time_minutes * 4 : 12} Hours`,
                url: art.url,
                gradient: GRADIENTS['DEV Community'],
                tag: subcat,
                hasCertificate: false,
                highlights: ['Interactive code walk-throughs', 'Author feedback & discussion', 'Modern real-world patterns'],
              });
            });

            // Next 2 articles -> CodeCamp
            articles.slice(2, 4).forEach((art) => {
              if (!art.title || !art.url) return;
              collected.push({
                id: `codecamp-${category}-${subcat.replace(/\s+/g, '-')}-${art.id}`,
                title: `${art.title} (CodeCamp Certification)`,
                description: art.description ? art.description.substring(0, 150) + '...' : `Master ${subcat} through hands-on coding exercises.`,
                category,
                subcategory: subcat,
                provider: 'CodeCamp',
                isFree: true,
                rating: '4.9',
                enrolled: `${(18 + (art.positive_reactions_count || 15) * 0.2).toFixed(1)}k+`,
                level: 'All Levels',
                duration: `${art.reading_time_minutes ? art.reading_time_minutes * 5 : 24} Hours`,
                url: art.url,
                gradient: GRADIENTS['CodeCamp'],
                tag: subcat,
                hasCertificate: true,
                highlights: ['Interactive browser coding exercises', 'Portfolio projects included', 'Official digital certificate'],
              });
            });
          } catch (e) {}
        });

        // Open Library Academic
        tasks.push(async () => {
          try {
            const r = await HTTP.get('https://openlibrary.org/search.json', {
              params: { q: subcat, limit: 3, fields: 'title,author_name,key' },
            });
            (r.data?.docs || []).forEach((doc, idx) => {
              if (!doc.title) return;
              const authors = (doc.author_name || []).slice(0, 2).join(', ') || 'Academic Faculty';
              collected.push({
                id: `ol-${(doc.key || `${subcat}-${idx}`).replace(/\//g, '-')}`,
                title: doc.title,
                description: `Complete open-access academic syllabus on ${subcat} by ${authors}.`,
                category,
                subcategory: subcat,
                provider: 'Open Library',
                isFree: true,
                rating: '4.8',
                enrolled: `${(idx + 3) * 2.4}k+ reads`,
                level: idx % 2 === 0 ? 'Advanced' : 'Beginner',
                duration: 'Complete Study Track',
                url: `https://openlibrary.org${doc.key || '/search?q=' + cleanKeyword}`,
                gradient: GRADIENTS['Open Library'],
                tag: subcat,
                hasCertificate: false,
                highlights: ['Full academic syllabus', 'Foundational concepts', 'Preserved by Internet Archive'],
              });
            });
          } catch (e) {}
        });

        // Stanford & Oxford
        tasks.push(async () => {
          try {
            const r = await HTTP.get('https://itunes.apple.com/search', {
              params: { term: `${subcat} course`, media: 'podcast', entity: 'podcast', limit: 3 },
            });
            (r.data?.results || []).forEach((item, idx) => {
              if (!item.collectionName || !item.collectionViewUrl) return;
              collected.push({
                id: `stanford-${category}-${subcat.replace(/\s+/g, '-')}-${item.collectionId || idx}`,
                title: item.collectionName,
                description: `Official university open curriculum lecture on ${subcat} by ${item.artistName || 'University Faculty'}.`,
                category,
                subcategory: subcat,
                provider: 'Stanford & Oxford',
                isFree: true,
                rating: '4.9',
                enrolled: `${12 + idx * 3}k+ scholars`,
                level: 'All Levels',
                duration: 'Open Lecture Series',
                url: item.collectionViewUrl,
                imageUrl: item.artworkUrl600 || item.artworkUrl100,
                gradient: GRADIENTS['Stanford & Oxford'],
                tag: subcat,
                hasCertificate: false,
                highlights: ['Recorded university lectures', 'Academic syllabus notes', '100% open access'],
              });
            });
          } catch (e) {}
        });

        // WikiBooks Open Syllabus
        tasks.push(async () => {
          try {
            const r = await HTTP.get('https://en.wikibooks.org/w/api.php', {
              params: { action: 'query', list: 'search', srsearch: subcat, srlimit: 3, format: 'json', origin: '*' },
            });
            (r.data?.query?.search || []).forEach((book, idx) => {
              if (!book.title) return;
              const snippet = stripHtml(book.snippet);
              collected.push({
                id: `wikibook-${book.pageid || idx}`,
                title: `${book.title}`,
                description: snippet ? snippet.substring(0, 150) + '...' : `Open curriculum guide on ${book.title}.`,
                category,
                subcategory: subcat,
                provider: 'WikiBooks',
                isFree: true,
                rating: '4.8',
                enrolled: 'Open Academic Access',
                level: 'Beginner',
                duration: 'Self-Paced Track',
                url: `https://en.wikibooks.org/wiki/${encodeURIComponent(book.title)}`,
                gradient: GRADIENTS['WikiBooks'],
                tag: subcat,
                hasCertificate: false,
                highlights: ['Community-vetted syllabus', 'Hands-on practice exercises', '100% open-access resource'],
              });
            });
          } catch (e) {}
        });

        // Hacker Hub Engineering Guides
        tasks.push(async () => {
          try {
            const r = await HTTP.get('https://hn.algolia.com/api/v1/search', {
              params: { query: `${subcat} tutorial`, tags: 'story', hitsPerPage: 3 },
            });
            (r.data?.hits || []).forEach((hit) => {
              if (!hit.title) return;
              const liveUrl = hit.url && typeof hit.url === 'string' && hit.url.startsWith('http')
                ? hit.url
                : `https://news.ycombinator.com/item?id=${hit.objectID || ''}`;

              collected.push({
                id: `hn-${hit.objectID || Math.random().toString(36).substring(7)}`,
                title: hit.title,
                description: `Curated learning guide submitted by @${hit.author || 'engineer'} on Hacker Hub.`,
                category,
                subcategory: subcat,
                provider: 'Hacker Hub',
                isFree: true,
                rating: '4.9',
                enrolled: `${hit.points || 120} pts`,
                level: 'Intermediate',
                duration: 'Self-Paced Track',
                url: liveUrl,
                gradient: GRADIENTS['Hacker Hub'],
                tag: subcat,
                hasCertificate: false,
                highlights: ['Direct link to repos & slides', 'Vetted by engineering community', 'Zero paywalls'],
              });
            });
          } catch (e) {}
        });
      });
    });

    await runInBatches(tasks, 8, 120);

    const seenUrls = new Set();
    const deduped = collected.filter((c) => {
      if (!c.url || seenUrls.has(c.url)) return false;
      seenUrls.add(c.url);
      return true;
    });

    const shuffled = deduped.sort(() => Math.random() - 0.5);

    if (shuffled.length > 0) {
      cachedCourses = shuffled;
      lastCacheTime = Date.now();
    }

    const counts = {};
    (cachedCourses || []).forEach((c) => {
      counts[c.provider] = (counts[c.provider] || 0) + 1;
    });
    console.log('Provider Distribution:', counts);
    console.log(`Ingestion Complete: Ingested ${cachedCourses.length} tracks.\n`);

    return cachedCourses;
  })().finally(() => {
    ingestionPromise = null;
  });

  return ingestionPromise;
}

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: system-ui, sans-serif; background: #09090b; color: #f4f4f5; text-align: center; padding: 60px 20px; min-height: 100vh;">
      <h1 style="color: #6366f1;">CourseVerse Live</h1>
      <p style="color: #a1a1aa;">Serving real-time course streams on port <strong>${PORT}</strong></p>
      <p><a href="/api/all-live-courses" style="color: #38bdf8; text-decoration: none; font-weight: 600;">Explore JSON Feed: /api/all-live-courses</a></p>
    </div>
  `);
});

app.get('/api/debug', (req, res) => {
  const counts = {};
  const subcatCounts = {};
  cachedCourses.forEach((c) => {
    counts[c.provider] = (counts[c.provider] || 0) + 1;
    subcatCounts[c.subcategory] = (subcatCounts[c.subcategory] || 0) + 1;
  });
  res.json({ total: cachedCourses.length, providers: counts, subcategories: subcatCounts });
});

app.get('/api/all-live-courses', async (req, res) => {
  let list = cachedCourses;

  if (req.query.refresh === 'true' || list.length === 0 || Date.now() - lastCacheTime > CACHE_TTL) {
    try {
      list = await fetchAllLiveStreamsAuto();
    } catch {
      list = cachedCourses;
    }
  }

  if (req.query.q) {
    const q = req.query.q.toLowerCase().trim();
    list = list.filter(
      (c) =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.subcategory || '').toLowerCase().includes(q) ||
        (c.provider || '').toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    count: list.length,
    courses: list,
    cached: Date.now() - lastCacheTime <= CACHE_TTL,
  });
});

app.listen(PORT, () => {
  console.log(`\nBackend Server active at http://localhost:${PORT}`);
  console.log(`Feed URL: http://localhost:${PORT}/api/all-live-courses\n`);
  fetchAllLiveStreamsAuto();
});
