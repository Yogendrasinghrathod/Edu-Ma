import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] dark:from-gray-950 dark:to-gray-900 px-4 text-center overflow-hidden pt-16">
      {/* Background decorative elements with animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 -right-24 w-[500px] h-[500px] bg-indigo-500 opacity-10 rounded-full blur-[100px]"
        ></motion.div>
        <motion.div
          animate={{
            rotate: [0, -180, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 left-1/4 w-80 h-80 bg-blue-400 opacity-10 rounded-full blur-[80px]"
        ></motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-white font-extrabold text-5xl md:text-7xl text-center leading-[1.1] mb-6 tracking-tight">
            Elevate Your Path with the{" "}
            <span className="relative inline-block text-blue-400 dark:text-blue-500">
              Best Courses
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 7C25 7 25 1 50 1C75 1 75 7 100 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
          </h1>
        </motion.div>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-blue-100 dark:text-gray-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Master new skills with industry-leading mentors. Your growth starts
          here, faster than ever before.
        </motion.p>

        {/* Search Bar with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-2xl mb-10"
        >
          <form
            onSubmit={searchHandler}
            className="flex items-center bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transition-all p-1.5"
          >
            <div className="flex items-center flex-grow px-4">
              <Search className="text-white/60 dark:text-gray-500 h-5 w-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn today?"
                className="flex-grow border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-4 text-white placeholder-white/50 bg-transparent text-lg dark:bg-transparent"
              />
            </div>
            <Button
              type="submit"
              className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-7 rounded-xl hover:bg-white hover:text-blue-700 transition-all font-bold text-lg shadow-lg"
            >
              Search
            </Button>
          </form>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button
            onClick={() => navigate(`/course/search?query`)}
            className="bg-white text-blue-800 hover:bg-blue-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 rounded-full px-10 py-7 font-bold text-lg shadow-xl hover:scale-105 transition-all"
          >
            Explore All Courses
          </Button>
          <Button
            variant="outline"
            className="backdrop-blur-md border  text-blue-800 dark:text-white border-white/30  hover:bg-white/10 rounded-full px-10 py-7 font-bold text-lg hover:scale-105 transition-all"
          >
            Learn More
          </Button>
        </motion.div>
      </div>

      {/* Decorative Wave at the bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[60px] dark:text-gray-950 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,10,11.59,214.34,120,402.13,115.65,321.39,56.44Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}

export default HeroSection;
