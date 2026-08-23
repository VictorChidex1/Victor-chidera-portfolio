import { useState } from "react";
import emailjs from "@emailjs/browser";
import { EMAIL_CONFIG } from "../config/email";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const COOLDOWN_MS = 30000; // 30-second cooldown

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < COOLDOWN_MS) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("sending");
    setLastSubmitTime(now);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: "Victor Chidera",
    };

    try {
      // 1. Submit to Firestore contacts collection
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
      });

      // 2. Submit to EmailJS for email notification
      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Contact Submission Error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section className="py-24 pt-32 min-h-screen flex items-center bg-brand-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-brand-line">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-display text-brand-ink mb-4">
              Let's Work Together
            </h2>
            <p className="text-brand-muted">
              Have a project in mind or just want to say hi? I'm always open to
              new opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-ink transition-colors"
                  placeholder="Ron Joe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-ink mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-ink transition-colors"
                  placeholder="joe@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-ink mb-2">
                Message
              </label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-white border border-brand-line rounded-lg px-4 py-3 text-brand-ink focus:outline-none focus:border-brand-ink transition-colors"
                placeholder="Tell me about your project..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className={`w-full font-bold py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.01] ${
                status === "success"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : status === "error"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-brand-ink hover:bg-neutral-800 text-white"
              }`}
            >
              {status === "idle" && "Send Message"}
              {status === "sending" && "Sending..."}
              {status === "success" && "Message Sent!"}
              {status === "error" && "Failed to Send. Try again."}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
