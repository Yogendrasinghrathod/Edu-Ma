import {
  Github,
  Linkedin,
  Instagram,
  Globe,
  Mail,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    from_name: "",
    reply_to: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const templateParams = {
        title: formData.title,
        description: formData.description,
        from_name: formData.from_name,
        reply_to: formData.reply_to,
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      toast.success("Message sent successfully!");
      setIsOpen(false);
      setFormData({ title: "", description: "", from_name: "", reply_to: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                Edu-Ma
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium italic">
              &quot;Learn. Grow. Build your future with Edu-Ma.&quot;
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed">
              Empowering learners with world-class education from industry
              experts.
            </p>
            <div className="flex space-x-4  bg-blue-800 rounded-full align-center justify-between px-8 py-5">
              <a
                href="https://github.com/Yogendrasinghrathod"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/yogendra02/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/yogendra_singh_rathod_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://yogendaportfolio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                aria-label="Portfolio"
              >
                <Globe size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/myLearning"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  My Learning
                </Link>
              </li>
              <li>
                <Link
                  to="/instructor"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/support"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Help / Support
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h3 className="text-gray-900 dark:text-white font-semibold mb-6">
              Stay Updated
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Subscribe to our newsletter for latest updates and course offers.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm focus:ring-blue-500 dark:text-gray-100"
              />
              <Button
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
              >
                <ArrowRight size={18} />
              </Button>
            </div>
            <div className="pt-4">
              <a
                href="mailto:rathodyogi91221@gmail.com"
                className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors mb-4"
              >
                <Mail size={16} className="mr-2" />
                rathodyogi91221@gmail.com
              </a>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white transition-all text-sm font-semibold"
                  >
                    Send us a message
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] dark:bg-gray-950 dark:border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold dark:text-white">
                      Send us a message
                    </DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                      We&apos;ll get back to you as soon as possible.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="from_name" className="dark:text-gray-200">
                        Your Name
                      </Label>
                      <Input
                        id="from_name"
                        name="from_name"
                        required
                        placeholder="John Doe"
                        value={formData.from_name}
                        onChange={handleInputChange}
                        className="dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reply_to" className="dark:text-gray-200">
                        Your Email
                      </Label>
                      <Input
                        id="reply_to"
                        name="reply_to"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.reply_to}
                        onChange={handleInputChange}
                        className="dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title" className="dark:text-gray-200">
                        Subject
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        required
                        placeholder="How can we help?"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="dark:text-gray-200"
                      >
                        Message
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Tell us more about your inquiry..."
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 transition-all"
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            © 2026 Edu-Ma. All rights reserved.
          </p>
          <p className="text-gray-400 dark:text-gray-600 text-xs">
            Support Hours: Mon - Fri, 9:00 AM - 6:00 PM IST
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
