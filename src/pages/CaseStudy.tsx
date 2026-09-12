import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import PageSeo from "../components/seo/PageSeo";
import RichContent from "../components/RichContent";
import { useProjectBySlug, useProjects } from "../hooks/useFirebaseData";
import { articleSchema, breadcrumbSchema } from "../seo/schemas";

const SECTIONS: { key: string; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "problem", label: "The Problem" },
  { key: "solution", label: "The Solution" },
  { key: "technology", label: "Technology" },
  { key: "architecture", label: "Architecture" },
  { key: "keyFeatures", label: "Key Features" },
  { key: "challenges", label: "Challenges" },
  { key: "resultsNarrative", label: "Results" },
];

const toIso = (ts: any) =>
  typeof ts?.toDate === "function" ? ts.toDate().toISOString() : undefined;

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading } = useProjectBySlug(slug);
  const { projects } = useProjects();

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center pt-32">
        <div className="w-10 h-10 border-4 border-brand-ink border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6 pt-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-display text-brand-ink tracking-tighter mb-6">
            Project not found.
          </h1>
          <Link to="/works" className="inline-flex items-center gap-2 bg-brand-ink text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-colors">
            <ArrowLeft size={18} /> Back to Works
          </Link>
        </div>
      </main>
    );
  }

  const publishedAt = toIso(project.publishedAt) || toIso(project.createdAt);
  const screenshots = project.screenshots || [];
  const related = projects.filter((p) => p.slug && p.slug !== slug).slice(0, 3);
  const metaBits = [project.role, project.year, project.client].filter(Boolean);

  return (
    <main className="bg-white min-h-screen pt-32 pb-32 selection:bg-brand-accent selection:text-white">
      <PageSeo
        title={project.seoTitle || `${project.title} | Victor Chidera`}
        description={project.seoDescription || project.description}
        path={`/works/${slug}`}
        image={project.image}
        type="article"
        publishedTime={publishedAt}
        jsonLd={[
          articleSchema({
            title: project.title,
            description: project.seoDescription || project.description || "",
            slug: slug || "",
            path: `/works/${slug}`,
            type: "Article",
            coverImage: project.image,
            images: screenshots.map((s: any) => s.url),
            publishedTime: publishedAt,
            modifiedTime: publishedAt,
            section: "Case Study",
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Work", url: "/works" },
            { name: project.title, url: `/works/${slug}` },
          ]),
        ]}
      />

      <div className="max-w-5xl mx-auto px-6">
        <Link to="/works" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-ink text-sm font-semibold mb-10 transition-colors">
          <ArrowLeft size={16} /> All Works
        </Link>

        {/* Hero */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-brand-accent font-bold tracking-widest uppercase text-xs">{project.category}</span>
            {metaBits.map((m, i) => (
              <span key={i} className="flex items-center gap-3 text-brand-muted text-xs font-semibold uppercase tracking-wider">
                <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                {m}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-brand-ink tracking-tighter leading-[1.05] mb-6">
            {project.title}
          </h1>
          <p className="text-brand-muted text-lg md:text-xl max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {project.tech?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {project.tech.map((t: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-brand-surface border border-brand-line text-brand-ink text-sm rounded-full font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 bg-brand-ink text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-colors"
            >
              Visit Project <ArrowUpRight size={18} />
            </a>
          )}
        </header>

        {/* Cover */}
        {project.image && (
          <div className="mb-16 rounded-[2rem] overflow-hidden border border-brand-line">
            <img src={project.image} alt={project.title} className="w-full h-auto object-cover" loading="eager" decoding="async" />
          </div>
        )}

        {/* Results metric cards */}
        {project.results?.length > 0 && (
          <section className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {project.results.map((r: any, i: number) => (
              <div key={i} className="bg-brand-ink text-white rounded-2xl p-6">
                <p className="text-brand-accent font-mono text-xs uppercase tracking-wider mb-2">{r.label}</p>
                <p className="text-3xl md:text-4xl font-bold font-display">{r.value}</p>
              </div>
            ))}
          </section>
        )}

        {/* Narrative sections */}
        {SECTIONS.map((s) => {
          const html = (project as any)[s.key];
          if (!html) return null;
          return (
            <section key={s.key} className="mb-14">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-brand-ink tracking-tight mb-6">{s.label}</h2>
              <RichContent html={html} />
            </section>
          );
        })}

        {/* Screenshots */}
        {screenshots.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-brand-ink tracking-tight mb-8">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {screenshots.map((s: any, i: number) => (
                <figure key={i} className="rounded-2xl overflow-hidden border border-brand-line">
                  <img src={s.url} alt={s.alt || `${project.title} screenshot ${i + 1}`} loading="lazy" decoding="async" className="w-full h-auto object-cover" />
                  {s.alt && <figcaption className="px-4 py-3 text-sm text-brand-muted bg-brand-surface">{s.alt}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-brand-line pt-14">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-brand-ink tracking-tight mb-8">More Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p: any) => (
                <Link key={p.id} to={`/works/${p.slug}`} className="group block">
                  {p.image && <div className="aspect-video rounded-2xl overflow-hidden border border-brand-line mb-4"><img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                  <h3 className="font-bold font-display text-brand-ink group-hover:text-brand-accent transition-colors">{p.title}</h3>
                  <p className="text-brand-muted text-sm mt-1">{p.category}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default CaseStudy;
