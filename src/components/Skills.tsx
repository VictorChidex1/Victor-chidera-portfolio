import { Code2, Database, Layout, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const skillsData = [
  {
    category: "Frontend",
    icon: Layout,
    skills: [
      "React",
      "Vue.js",
      "Tailwind CSS",
      "TypeScript",
      "HTML5/CSS3",
      "Redux",
    ],
  },
  {
    category: "Backend & Data",
    icon: Database,
    skills: [
      "Node.js",
      "Express",
      "Firebase",
      "PostgreSQL",
      "MongoDB",
      "REST APIs",
    ],
  },
  {
    category: "Tools & DevOps",
    icon: Code2,
    skills: ["Git & GitHub", "VS Code", "Vite", "NPM/Yarn", "Figma"],
  },
  {
    category: "Mobile",
    icon: Smartphone,
    skills: ["React Native", "Responsive Design", "Mobile-First approach"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Skills = () => {
  return (
    <section className="py-20 bg-brand-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            The technologies and tools I use to bring ideas to life.
          </p>
          <div className="w-20 h-1 bg-brand-orange mx-auto mt-6"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {skillsData.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-brand-orange/50 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-brand-orange">
                <category.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-brand-dark text-slate-400 text-xs rounded-full border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
