'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DeliveringSection() {
    return (
        <section className="w-full py-24 px-6 md:px-12 bg-white text-bx-black">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 block">Our Mission</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-light mb-16">
                        Delivering for Investors
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                    {/* Left Column: Text */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div>
                            <h3 className="text-lg font-bold uppercase tracking-widest text-bx-copper mb-4">Investment Performance</h3>
                            <p className="text-xl md:text-2xl leading-relaxed font-light text-gray-800">
                                We seek to deliver attractive risk-adjusted returns over the long term across our investment strategies. We have a 40-year track record of creating value for our investors.
                            </p>
                        </div>

                        <Link
                            href="#"
                            className="group inline-flex items-center text-bx-black font-bold tracking-widest uppercase text-sm mt-4"
                        >
                            <span className="border-b border-gray-300 group-hover:border-bx-copper transition-all pb-1">
                                See Our Results
                            </span>
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                        </Link>
                    </motion.div>

                    {/* Right Column: Key Stat */}
                    <motion.div
                        className="flex flex-col justify-start border-t border-gray-200 pt-8 md:pt-0 md:border-none"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="border-b border-gray-200 pb-8 mb-8">
                            <h3 className="text-7xl md:text-8xl font-serif text-bx-black">$1.1T</h3>
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-4">Assets Under Management</p>
                            <p className="text-sm text-gray-400 mt-2">as of September 30, 2024</p>
                        </div>

                        <Link
                            href="#"
                            className="group inline-flex items-center text-bx-black font-bold tracking-widest uppercase text-sm"
                        >
                            <span className="border-b border-gray-300 group-hover:border-bx-copper transition-all pb-1">
                                Read the Earnings
                            </span>
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
