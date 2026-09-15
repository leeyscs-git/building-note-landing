'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stories = [
    {
        category: "Real Estate",
        title: "The Future of Logistics",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    },
    {
        category: "Private Equity",
        title: "Investing in Energy Transition",
        image: "https://images.unsplash.com/photo-1473355612376-3d90e36e347e?auto=format&fit=crop&q=80&w=800",
    },
    {
        category: "Technology",
        title: "AI and Data Infrastructure",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    },
    {
        category: "People",
        title: "Meet Our Team",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    }
];

export default function FeaturedStories() {
    return (
        <section className="w-full py-24 px-6 md:px-12 bg-white text-bx-black border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl font-serif">Featured Stories</h2>
                    <Link href="#" className="text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-bx-black transition-all pb-1">View All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {stories.map((story, index) => (
                        <motion.div
                            key={index}
                            className="group cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-6">
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-bx-copper mb-2">{story.category}</p>
                            <h3 className="text-xl font-serif group-hover:text-gray-600 transition-colors">{story.title}</h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
