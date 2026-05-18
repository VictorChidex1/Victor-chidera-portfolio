import { useState  } from "react";
import emailjs from "@emailjs/browser";
import { EMAIL_CONFIG } from "../config/email";

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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setStatus("sending");

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: "Victor Chidera",
    };

    emailjs
      .send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 3000);
      })
      .catch((err) => {
        console.error("FAILED...", err);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      });
  };

  return (
    <section className="py-24 pt-32 min-h-screen flex items-center bg-brand-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Let's Work Together
            </h2>
            <p className="text-slate-400">
              Have a project in mind or just want to say hi? I'm always open to
              new opportunities.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors"
                  placeholder="Ron Joe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors"
                  placeholder="joe@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-brand-dark border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition-colors"
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
                  : "bg-brand-orange hover:bg-orange-600 text-white"
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
