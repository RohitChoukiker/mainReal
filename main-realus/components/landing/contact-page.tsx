 {/* Contact Section */}
 <section
 id="contact"
 className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50"
>
 <div className="container mx-auto px-4">
   <motion.div
     className="text-center mb-12"
     initial={{ opacity: 0, y: 20 }}
     whileInView={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.5 }}
     viewport={{ once: true }}
   >
     <h2 className="text-3xl font-bold mb-4 text-gray-900">
       Contact Us
     </h2>
     <p className="text-gray-600 max-w-2xl mx-auto">
       Have questions about our platform? Get in touch with our team and
       we'll be happy to help.
     </p>
   </motion.div>

   <div className="flex flex-col md:flex-row gap-8">
     <motion.div
       className="md:w-1/2"
       initial={{ opacity: 0, x: -20 }}
       whileInView={{ opacity: 1, x: 0 }}
       transition={{ duration: 0.5 }}
       viewport={{ once: true }}
     >
       <div className="bg-white p-6 rounded-xl shadow-md">
         <h3 className="text-xl font-semibold mb-4 text-gray-900">
           Send us a message
         </h3>
         <form className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label
                 htmlFor="name"
                 className="block text-sm font-medium text-gray-700 mb-1"
               >
                 Name
               </label>
               <input
                 type="text"
                 id="name"
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                 placeholder="Your name"
               />
             </div>
             <div>
               <label
                 htmlFor="email"
                 className="block text-sm font-medium text-gray-700 mb-1"
               >
                 Email
               </label>
               <input
                 type="email"
                 id="email"
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                 placeholder="Your email"
               />
             </div>
           </div>
           <div>
             <label
               htmlFor="subject"
               className="block text-sm font-medium text-gray-700 mb-1"
             >
               Subject
             </label>
             <input
               type="text"
               id="subject"
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
               placeholder="Subject"
             />
           </div>
           <div>
             <label
               htmlFor="message"
               className="block text-sm font-medium text-gray-700 mb-1"
             >
               Message
             </label>
             <textarea
               id="message"
               rows={4}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
               placeholder="Your message"
             ></textarea>
           </div>
           <button
             type="submit"
             className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
           >
             Send Message
           </button>
         </form>
       </div>
     </motion.div>

     <motion.div
       className="md:w-1/2"
       initial={{ opacity: 0, x: 20 }}
       whileInView={{ opacity: 1, x: 0 }}
       transition={{ duration: 0.5 }}
       viewport={{ once: true }}
     >
       <div className="bg-white p-6 rounded-xl shadow-md h-full">
         <h3 className="text-xl font-semibold mb-4 text-gray-900">
           Contact Information
         </h3>
         <div className="space-y-4">
           <div className="flex items-start">
             <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
             <div>
               <p className="font-medium text-gray-900">Address</p>
               <p className="text-gray-600">Indore, Madhya Pradesh</p>
               <p className="text-gray-600">India</p>
             </div>
           </div>
           <div className="flex items-start">
             <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
             <div>
               <p className="font-medium text-gray-900">Phone</p>
               <p className="text-gray-600">+91 123456789</p>
             </div>
           </div>
           <div className="flex items-start">
             <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
             <div>
               <p className="font-medium text-gray-900">Email</p>
               <p className="text-gray-600">info@realus.com</p>
             </div>
           </div>
           <div className="flex items-start">
             <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
             <div>
               <p className="font-medium text-gray-900">
                 Business Hours
               </p>
               <p className="text-gray-600">
                 Monday - Friday: 9am - 5pm
               </p>
               <p className="text-gray-600">Saturday: 10am - 2pm</p>
               <p className="text-gray-600">Sunday: Closed</p>
             </div>
           </div>
         </div>

         <div className="mt-6">
           <h4 className="font-medium mb-2 text-gray-900">Follow Us</h4>
           <div className="flex space-x-4">
             <a href="#" className="text-gray-600 hover:text-primary">
               <svg
                 className="h-6 w-6"
                 fill="currentColor"
                 viewBox="0 0 24 24"
                 aria-hidden="true"
               >
                 <path
                   fillRule="evenodd"
                   d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                   clipRule="evenodd"
                 />
               </svg>
             </a>
             <a href="#" className="text-gray-600 hover:text-primary">
               <svg
                 className="h-6 w-6"
                 fill="currentColor"
                 viewBox="0 0 24 24"
                 aria-hidden="true"
               >
                 <path
                   fillRule="evenodd"
                   d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                   clipRule="evenodd"
                 />
               </svg>
             </a>

             <a href="#" className="text-gray-600 hover:text-primary">
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
           </div>
         </div>

         <div className="mt-6">
           <div className="relative h-48 rounded-lg overflow-hidden">
             <Image
               src="/images/map.jpg"
               alt="Office location"
               fill
               className="object-cover"
             />
             <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
               <button className="bg-white text-primary px-4 py-2 rounded-md shadow-md hover:bg-gray-50 transition-colors">
                 View on Google Maps
               </button>
             </div>
           </div>
         </div>
       </div>
     </motion.div>
   </div>
 </div>
</section>
