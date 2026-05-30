import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Maps route paths to document titles for client-side navigation.
 * The SEO interceptor handles crawler-facing titles server-side;
 * this hook keeps the browser tab title in sync for human users.
 */
const routeTitles: Record<string, string> = {
  '/':              'Victor Chidera | Full Stack Developer',
  '/works':         'Selected Works | Victor Chidera',
  '/services':      'Services | Victor Chidera',
  '/testimonials':  'Testimonials | Victor Chidera',
  '/blog':          'Blog & Insights | Victor Chidera',
  '/contact':       'Contact Me | Victor Chidera',
};

const useDocumentTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = routeTitles[pathname] || routeTitles['/'];
    document.title = title;
  }, [pathname]);
};

export default useDocumentTitle;
