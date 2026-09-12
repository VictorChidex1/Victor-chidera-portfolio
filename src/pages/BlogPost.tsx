import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageSeo from "../components/seo/PageSeo";
import RichContent from "../components/RichContent";
import { useBlogBySlug } from "../hooks/useFirebaseData";
import { articleSchema, breadcrumbSchema } from "../seo/schemas";

const toIso = (ts: any) =>
  typeof ts?.toDate === "function" ? ts.toDate().toISOString() : undefined;

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading } = useBlogBySlug(slug);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center pt-32">
        <div className="w-10 h-10 border-4 border-brand-ink border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6 pt-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-display text-brand-ink tracking-tighter mb-6">Post not found.</h1>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-brand-ink text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-colors">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const publishedAt = toIso(post.publishedAt) || toIso(post.createdAt);
  const cover = post.coverImage || post.image;

  return (
    <main className="bg-white min-h-screen pt-32 pb-32 selection:bg-brand-accent selection:text-white">
      <PageSeo
        title={post.seoTitle || `${post.title} | Victor Chidera`}
        description={post.seoDescription || post.excerpt}
        path={`/blog/${slug}`}
        image={cover}
        type="article"
        publishedTime={publishedAt}
        jsonLd={[
          articleSchema({
            title: post.title,
            description: post.seoDescription || post.excerpt || "",
            slug: slug || "",
            coverImage: cover,
            publishedTime: publishedAt,
            modifiedTime: publishedAt,
            section: "Blog",
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${slug}` },
          ]),
        ]}
      />

      <article className="max-w-3xl mx-auto px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-ink text-sm font-semibold mb-10 transition-colors">
          <ArrowLeft size={16} /> All Posts
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-brand-accent font-mono uppercase tracking-widest font-bold mb-6">
            {post.date && <span>{post.date}</span>}
            {post.date && post.readTime && <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />}
            {post.readTime && <span>{post.readTime}</span>}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-brand-ink tracking-tighter leading-[1.1] mb-6">
            {post.title}
          </h1>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-brand-surface border border-brand-line text-brand-muted text-sm rounded-full font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>

        {cover && (
          <div className="mb-10 rounded-[2rem] overflow-hidden border border-brand-line">
            <img src={cover} alt={post.title} className="w-full h-auto object-cover" loading="eager" decoding="async" />
          </div>
        )}

        <RichContent html={post.content} />
      </article>
    </main>
  );
};

export default BlogPost;
