export default async function handler(req, res) {
  const urlPath = req.url;

  // SEO Configurations Map
  const defaults = {
    title: "Victor Chidera | Full Stack Developer",
    description: "Portfolio of a Full Stack Developer specializing in React, Node.js, and modern UI design.",
    image: "https://victor-chidera-25.vercel.app/og-image.webp" 
  };

  const routes = {
    "/": defaults,
    "/works": {
      title: "Selected Works | Victor Chidera",
      description: "Explore my latest full-stack projects, SaaS applications, and frontend implementations.",
      image: defaults.image
    },
    "/services": {
      title: "Services | Victor Chidera",
      description: "Professional web development, performance optimization, and scalable serverless architecture services.",
      image: defaults.image
    },
    "/testimonials": {
      title: "Testimonials | Victor Chidera",
      description: "See what clients and partners say about my software engineering and development process.",
      image: defaults.image
    },
    "/blog": {
      title: "Blog & Insights | Victor Chidera",
      description: "Insights, tutorials, and articles on full-stack development, React, and serverless engineering.",
      image: defaults.image
    },
    "/contact": {
      title: "Contact Me | Victor Chidera",
      description: "Get in touch to discuss your next project, collaboration, or software development needs.",
      image: defaults.image
    }
  };

  // Clean the path (remove query params for matching)
  const cleanPath = urlPath.split('?')[0];
  const meta = routes[cleanPath] || defaults;

  try {
    // 1. Fetch the raw index.html payload
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    
    // We fetch explicitly fetching /index.html path to trigger the static asset rewrite
    const response = await fetch(`${protocol}://${host}/index.html`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch index.html: ${response.statusText}`);
    }
    
    let html = await response.text();

    // 2. Inject Meta Tags using regex string replacement
    const fullUrl = `${protocol}://${host}${cleanPath}`;

    html = html.replace(/<title>.*?<\/title>/gi, `<title>${meta.title}</title>`);
    html = html.replace(/<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/gi, `<meta name="description" content="${meta.description}" />`);
    
    // Open Graph
    html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:title" content="${meta.title}" />`);
    html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:description" content="${meta.description}" />`);
    html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:image" content="${meta.image}" />`);
    html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="og:url" content="${fullUrl}" />`);

    // Twitter
    html = html.replace(/<meta\s+property=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="twitter:title" content="${meta.title}" />`);
    html = html.replace(/<meta\s+property=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="twitter:description" content="${meta.description}" />`);
    html = html.replace(/<meta\s+property=["']twitter:image["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="twitter:image" content="${meta.image}" />`);
    html = html.replace(/<meta\s+property=["']twitter:url["']\s+content=["'].*?["']\s*\/?>/gi, `<meta property="twitter:url" content="${fullUrl}" />`);

    // 3. Return the modified HTML
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Cache at edge
    return res.status(200).send(html);

  } catch (error) {
    console.error("SEO Interceptor Error: ", error);
    // Fallback: If it fails, redirect to actual root file to bypass function and load SPA directly 
    return res.redirect(302, '/index.html');
  }
}
