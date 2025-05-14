"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface TeamModalProps {
  onClose: () => void;
}

export default function TeamModal({ onClose }: TeamModalProps) {
  const teamMembers = [
    {
      name: "Rohit Choukiker",
      role: "Developer",
      // bio: "With over 15 years of experience in real estate and technology, John founded RealEstate Pro to streamline transaction management for agents and brokers.",
      image: "https://media.licdn.com/dms/image/v2/D5603AQHmEWlSaHZdLA/profile-displayphoto-shrink_800_800/B56ZW.htATHQAc-/0/1742658263861?e=1749081600&v=beta&t=mTRhjzGItzWf447ef8UT50nKBCx9dQVeG5DBholizdM",
    },
    {
      name: "Vibha Kushwaha",
      role: "Chief Documentaion Officer",
      // bio: "Sarah leads our engineering team, bringing 10+ years of experience building scalable software solutions for the real estate industry.",
      image: "https://media.licdn.com/dms/image/v2/D4E03AQGiF5Pnvti2yA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731061456407?e=1749081600&v=beta&t=TQ6D1AtbiGKeropKivJve669y4BpO_fYZUpm2WTNCy8",
    },
  ];

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto my-8"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-4 sm:p-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Our Team</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Meet the talented people behind Realus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-square relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {member.role}
                  </p>

                  <div className="mt-4 flex space-x-4">
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      aria-label="GitHub"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg 
                        className="h-6 w-6" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Join Our Team
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. If
              you're passionate about real estate and technology, check out our
              open positions.
            </p>
            <motion.button
              type="button"
              className="mt-4 inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Open Positions
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
