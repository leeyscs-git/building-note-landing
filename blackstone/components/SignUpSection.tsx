'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function SignUpSection() {
    return (
        <section className="w-full py-24 px-6 md:px-12 bg-bx-black text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-32">

                {/* Left Side: Heading */}
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Stay Up-To-Date</span>
                        <div className="h-[1px] w-12 bg-gray-600"></div>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-serif font-light leading-tight">
                        Sign up for our latest insights and firm announcements.
                    </h2>
                </div>

                {/* Right Side: Form */}
                <div className="flex-1 max-w-xl">
                    <form className="space-y-6">
                        <div className="space-y-6">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email Address *"
                                    className="w-full bg-transparent border-b border-gray-600 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="First Name *"
                                    className="w-full bg-transparent border-b border-gray-600 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Last Name *"
                                    className="w-full bg-transparent border-b border-gray-600 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Job Title"
                                    className="w-full bg-transparent border-b border-gray-600 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-8 space-y-8">
                            <label className="flex items-start gap-4 cursor-pointer group">
                                <div className="relative pt-1">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 border border-white/50 peer-checked:bg-white transition-colors"></div>
                                </div>
                                <span className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    By submitting this request, you consent to receive email from Blackstone. For information on our privacy practices see our Privacy Policy.
                                </span>
                            </label>

                            <button className="flex items-center gap-4 group">
                                <span className="text-sm font-bold uppercase tracking-widest">Submit</span>
                                <div className="rounded-full border border-white/30 p-2 group-hover:bg-white group-hover:text-bx-black transition-colors">
                                    <ArrowRight size={20} />
                                </div>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </section>
    );
}
