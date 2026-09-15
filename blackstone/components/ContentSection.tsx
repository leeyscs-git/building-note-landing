'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface ContentSectionProps {
    title: string;
    description: string;
    linkText: string;
    linkHref: string;
    imageSrc?: string;
    reversed?: boolean;
}

export default function ContentSection({
    title,
    description,
    linkText,
    linkHref,
    imageSrc,
    reversed = false
}: ContentSectionProps) {
    return (
        <section className="w-full py-20 px-6 md:px-12 bg-white text-bx-black border-b border-gray-100 last:border-0">
            <div className={clsx(
                "max-w-7xl mx-auto flex flex-col gap-12 items-center",
                reversed ? "md:flex-row-reverse" : "md:flex-row"
            )}>

                {/* Text Content */}
                <div className="flex-1 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
                            {title}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-8">
                            {description}
                        </p>
                        <Link
                            href={linkHref}
                            className="group inline-flex items-center text-bx-copper font-bold tracking-widest uppercase text-sm"
                        >
                            <span className="border-b border-transparent group-hover:border-bx-copper transition-all pb-1">
                                {linkText}
                            </span>
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                        </Link>
                    </motion.div>
                </div>

                {/* Image Placeholder */}
                <div className="flex-1 w-full h-[400px] md:h-[500px] bg-gray-100 relative overflow-hidden">
                    {imageSrc ? (
                        <div
                            className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                            style={{ backgroundImage: `url('${imageSrc}')` }}
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-gray-400">
                            [Image Placeholder]
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
