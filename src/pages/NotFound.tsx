import { Link } from "react-router-dom";
import PageSeo from "../components/seo/PageSeo";

const NotFound = () => {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <PageSeo title="Page Not Found | Victor Chidera" path="/404" noindex />
      <div className="text-center">
        <span className="text-brand-accent font-bold tracking-widest uppercase block mb-4">
          Error 404
        </span>
        <h1 className="text-6xl md:text-8xl font-bold font-display text-brand-ink tracking-tighter leading-none mb-6">
          Page not found.
        </h1>
        <p className="text-brand-muted text-lg max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-ink text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
