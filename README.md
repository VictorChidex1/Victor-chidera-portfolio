# My Portfolio

A modern, responsive personal portfolio website built with React, Vite, and Tailwind CSS. This project showcases my work, skills, and provides a way for potential clients or employers to get in touch.

## 🚀 Tech Stack

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Deployment:** [GitHub Pages](https://pages.github.com/)

## ✨ Features

- **Responsive Design:** Fully optimized for mobile, tablet, and desktop devices.
- **Dynamic Routing:** Seamless navigation between Home, Works, Blog, Contact, Services, and Testimonials pages.
- **Interactive UI:** Smooth animations and transitions using Framer Motion, including stacking cards and text reveals.
- **Modern Aesthetics:** Dark theme with a global star background, glassmorphism effects, and bold typography.
- **Comprehensive Sections:**
  - **Hero:** "Designing Digital Dreams" with animated text.
  - **Process:** 5-phase workflow with a **Tech/Cyber** aesthetic, featuring corner accents, scanning line animations, and a sticky "scrollytelling" experience.
  - **FAQ:** Accordion-style frequently asked questions.
  - **Benefits & About:** Detailed sections highlighting value and personal background.
- **Scroll to Top:** A convenient button to quickly navigate back to the top of the page.
- **Contact Form:** Integrated with EmailJS (or prepared for integration) for direct messaging.
- **Modern Styling:** Clean and professional aesthetic using Tailwind CSS utility classes.

## 🛠️ Installation & Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/VictorChidex1/my-portfolio.git
    cd my-portfolio
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173` (or the port shown in your terminal).

## 📂 Project Structure

```
src/
├── assets/         # Images and static assets
├── components/     # Reusable UI components (Navbar, Footer, etc.)
├── config/         # Configuration files (e.g., navigation links)
├── context/        # React Context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components (Home, Works, Blog, Contact)
├── App.jsx         # Main application component with routing
└── main.jsx        # Entry point
```

## 📦 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.
- `npm run deploy`: Deploys the `dist` folder to GitHub Pages.

## 🚀 Deployment

### Option 1: Vercel (Recommended)

The easiest way to deploy this project is with [Vercel](https://vercel.com/import/git).

1.  Push your code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com/) and sign up with GitHub.
3.  Click **"Add New Project"** and select your repository.
4.  Vercel will automatically detect Vite and configure the build settings.
5.  Click **"Deploy"**.

**Automatic Updates:** Once deployed, every time you push changes to your GitHub repository, Vercel will automatically rebuild and update your live site.

### Option 2: GitHub Pages

This project is also configured for deployment on GitHub Pages.

1.  Ensure your `vite.config.js` has the correct `base` path set (e.g., `/my-portfolio/`).
2.  Run the deploy script:
    ```bash
    npm run deploy
    ```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
