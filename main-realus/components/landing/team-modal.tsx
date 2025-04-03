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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto my-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="text-gray-600 mt-2">
              Meet the talented people behind Realus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="aspect-square relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {member.role}
                  </p>
                  {/* <p className="mt-2 text-sm text-gray-600">{member.bio}</p> */}

                  <div className="mt-4 flex space-x-3">
                   
                    <a href="#" className="text-gray-400 hover:text-gray-700">
                      <svg
                        className="h-5 w-5"
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
                    <a href="#" className="text-gray-400 hover:text-gray-700">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 2c-4.411 0-8 3.589-8 8 0 3.35 2.072 6.21 5 7.4v-2.65c-0.845 0.184-1.477 0.247-2 0.247-0.845 0-1.654-0.462-2.064-1.272-0.424-0.836-0.696-1.499-1.48-1.963-0.277-0.171-0.414-0.354-0.414-0.708 0-0.438 0.468-0.552 0.643-0.552 0.921 0 1.858 0.932 2.007 1.304 0.696 1.195 1.306 1.431 2.025 1.431 0.845 0 1.457-0.124 1.898-0.307 0.248-0.93 0.645-1.772 1.268-2.173-3.257-0.364-5.577-1.579-5.577-5.159 0-1.18 0.408-2.215 1.089-3.019-0.216-0.762-0.512-2.316 0.111-2.939 1.525 0 2.442 0.994 2.65 1.26 0.764-0.262 1.584-0.402 2.444-0.402s1.68 0.14 2.444 0.402c0.208-0.266 1.125-1.26 2.65-1.26 0.623 0.623 0.327 2.177 0.111 2.939 0.681 0.804 1.089 1.839 1.089 3.019 0 3.58-2.32 4.795-5.577 5.159 0.645 0.398 1.05 1.501 1.05 2.284v3.475c2.928-1.19 5-4.05 5-7.4 0-4.411-3.589-8-8-8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Join Our Team
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our team. If
              you're passionate about real estate and technology, check out our
              open positions.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              View Open Positions
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
