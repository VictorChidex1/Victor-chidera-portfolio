import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useBlogs } from "../hooks/useFirebaseData";
import { fadeInUp, staggerContainer } from "../utils/animations";

const blog1 = "/assets/images/blog1.webp";
const blog2 = "/assets/images/blog2.webp";
const blog3 = "/assets/images/blog3.webp";

export const blogPosts = [
  {
    id: 1,
    title:
      "Blueprint Before Code: Structuring Data for a Scalable Food Delivery App",
    excerpt:
      "Why I spent hours designing my JSON structure before writing a single line of React code.",
    date: "Nov 26, 2025",
    readTime: "3 min read",
    link: "https://medium.com/@victor.chidera/blueprint-before-code-structuring-data-for-a-scalable-food-delivery-app-3ae5162f356a",
    image: blog1,
  },
  {
    id: 2,
    title: "The Art of “It Works on My Machine”",
    excerpt:
      "Surviving the beautiful chaos of modern web development and environment configs.",
    date: "Nov 27, 2025",
    readTime: "4 min read",
    link: "https://medium.com/@victor.chidera/the-art-of-it-works-on-my-machine-surviving-the-beautiful-chaos-of-modern-web-dev-ecf0795c0316",
    image: blog2,
  },
  {
    id: 3,
    title: "Building Scalable APIs: How to Prevent Your Server from Crying",
    excerpt:
      "Best practices for structuring RESTful services in Node.js environments.",
    date: "Nov 28, 2025",
    readTime: "5 min read",
    link: "https://hashnode.com/@yourusername/scalable-apis",
    image: blog3,
  },
];

const POSTS_PER_PAGE = 10;

const Blog = () => {
  const { blogs: liveBlogs } = useBlogs();
  const displayBlogs = liveBlogs.length > 0 ? liveBlogs : blogPosts;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(displayBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedBlogs = displayBlogs.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // For the Editorial layout, the very first post on Page 1 is the "Featured" hero post.
  const isFirstPage = currentPage === 1;
  const featuredPost = isFirstPage && paginatedBlogs.length > 0 ? paginatedBlogs[0] : null;
  const gridPosts = isFirstPage ? paginatedBlogs.slice(1) : paginatedBlogs;

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-white min-h-screen pt-32 pb-32 selection:bg-brand-accent selection:text-white">
      <div className="max-w-[90%] mx-auto">
        
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 md:mb-24 text-center md:text-left"
        >
          <span className="text-brand-accent font-bold tracking-widest uppercase mb-4 block">
            Journal & Insights
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold font-display text-brand-ink tracking-tighter mb-6 leading-none">
            Perspectives.
          </h1>
          <p className="text-neutral-500 text-xl md:text-2xl font-medium max-w-3xl mt-8 mx-auto md:mx-0">
            Architectural breakdowns, engineering case studies, and unfiltered thoughts on building scalable digital products.
          </p>
        </motion.div>

        {/* Featured Article (Only on Page 1) */}
        {featuredPost && (
          <motion.a
            href={featuredPost.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="group block mb-24 cursor-crosshair"
          >
            <div className="relative w-full h-[50vh] md:h-[70vh] rounded-[32px] overflow-hidden mb-8 md:mb-12">
              <motion.img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover object-center origin-center" 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/1200x800/f7f7f5/111111?text=No+Image";
                }}
              />
              <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 px-4 md:px-8">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 text-sm md:text-base text-brand-accent mb-6 font-mono uppercase tracking-widest font-bold">
                  <span>{featuredPost.date}</span>
                  <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full" />
                  <span>{featuredPost.readTime}</span>
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-7xl font-bold font-display text-brand-ink tracking-tight mb-6 group-hover:text-brand-accent transition-colors duration-300 leading-[1.1]">
                  {featuredPost.title}
                </h3>
                <p className="text-lg md:text-2xl text-neutral-500 font-medium leading-relaxed max-w-3xl">
                  {featuredPost.excerpt}
                </p>
              </div>
              
              <div className="shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-neutral-200 group-hover:border-brand-accent group-hover:bg-brand-accent transition-all duration-300 text-brand-ink group-hover:text-white group-hover:-translate-y-2 group-hover:translate-x-2">
                <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10" />
              </div>
            </div>
          </motion.a>
        )}

        {/* Masonry Grid for Remaining Articles */}
        {gridPosts.length > 0 && (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="columns-1 md:columns-2 gap-8 md:gap-16 space-y-12 md:space-y-16"
          >
            {gridPosts.map((post) => (
              <motion.a 
                key={post.id}
                href={post.link} 
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
                className="group block break-inside-avoid cursor-crosshair"
              >
                 <div className="w-full aspect-[4/3] rounded-[24px] overflow-hidden mb-6 md:mb-8 relative bg-neutral-100">
                    <motion.img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover object-center origin-center" 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/800x600/f7f7f5/111111?text=No+Image";
                      }}
                    />
                 </div>
                 
                 <div className="px-2">
                   <div className="flex items-center gap-3 text-xs md:text-sm text-neutral-400 mb-4 font-mono uppercase tracking-widest font-semibold">
                     <span>{post.date}</span>
                     <span className="w-1 h-1 bg-brand-accent rounded-full" />
                     <span>{post.readTime}</span>
                   </div>
                   
                   <h4 className="text-2xl md:text-3xl font-bold font-display text-brand-ink tracking-tight mb-4 group-hover:text-brand-accent transition-colors duration-300 leading-snug">
                     {post.title}
                   </h4>
                   
                   <p className="text-neutral-500 text-base md:text-lg font-medium leading-relaxed mb-6">
                     {post.excerpt}
                   </p>
                   
                   <div className="flex items-center text-brand-ink font-bold text-sm uppercase tracking-widest group-hover:text-brand-accent transition-colors">
                     Read Article <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </div>
                 </div>
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* Empty State Fallback */}
        {displayBlogs.length === 0 && (
          <div className="py-32 text-center text-neutral-500 font-medium text-xl">
            No articles published yet. Check back soon.
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-32 border-t border-neutral-200 pt-16">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-6 py-3.5 rounded-full text-sm font-bold uppercase tracking-widest border border-neutral-200 text-brand-ink hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <div className="hidden md:flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                    currentPage === page
                      ? "bg-brand-ink text-white scale-110 shadow-lg shadow-brand-ink/20"
                      : "bg-neutral-50 text-neutral-500 hover:bg-neutral-200"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-6 py-3.5 rounded-full text-sm font-bold uppercase tracking-widest border border-neutral-200 text-brand-ink hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </main>
  );
};

export default Blog;
