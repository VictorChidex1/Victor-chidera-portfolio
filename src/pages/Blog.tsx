import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useBlogs } from "../hooks/useFirebaseData";

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

const Blog = () => {
  const { blogs } = useBlogs();

  return (
    <section className="py-24 pt-32 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-brand-ink mb-4">
            Latest Articles
          </h2>
          <p className="text-brand-muted">
            Thoughts on development, design, and tech.
          </p>
        </motion.div>

        <div className="space-y-8">
          {blogs.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="block bg-white rounded-2xl overflow-hidden border border-brand-line hover:border-brand-ink transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row">
                {/* IMAGE COLUMN */}
                <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400/f7f7f5/111111?text=No+Image"; // Fallback if image missing
                    }}
                  />
                </div>

                {/* CONTENT COLUMN */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-sm text-brand-muted mb-3">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 bg-brand-ink rounded-full"></span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold font-display text-brand-ink mb-3 group-hover:text-brand-muted transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-brand-muted mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-brand-ink font-medium text-sm mt-auto">
                    Read Article <ExternalLink size={14} className="ml-2" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
