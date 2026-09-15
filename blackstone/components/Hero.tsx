'use client';

import { motion, Variants } from 'framer-motion';
import { Play, ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';

export default function Hero() {
    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    return (
        <section className="relative w-full min-h-screen bg-bx-black text-white px-[4.5rem] pt-48 pb-12 flex flex-col justify-between">

            {/* Top Section: Heading & Subtext */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <h1 className="text-7xl md:text-8xl font-serif text-white tracking-tight leading-[0.9]">
                        <span className="font-bold">Build</span> with<br />
                        SPS
                    </h1>
                </motion.div>

                <motion.div
                    className="mt-8 md:mt-0 max-w-md text-right md:-translate-y-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ ...fadeInUp, visible: { ...fadeInUp.visible, transition: { delay: 0.2, duration: 0.8 } } }}
                >
                    <p className="text-lg md:text-xl text-white/90 font-light leading-snug">
                        At SPS, we deliver for investors by<br />
                        building businesses that power tomorrow&apos;s<br />
                        economy
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="relative w-full aspect-video md:aspect-[2.35/1] bg-cover bg-center rounded-sm overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop')",
                }}
            >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {/* Play Button */}
                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center pl-1 transition-transform group-hover:scale-110">
                    <Play className="text-bx-black w-5 h-5 md:w-6 md:h-6 fill-current" />
                </div>
            </motion.div>

            {/* Bottom Section: Slider & Info matching reference image */}
            <div className="flex flex-col md:flex-row justify-between items-end mt-16 border-t border-white/10 pt-8">

                {/* Left Side: Title & Controls */}
                <div className="mb-8 md:mb-0 w-full md:w-1/2">
                    <h3 className="text-4xl md:text-5xl font-serif font-light leading-tight mb-8">
                        Celebrating 40 Years at<br />SPS
                    </h3>

                    <div className="flex items-center space-x-6">
                        <button className="rounded-full border border-white/30 p-2 hover:bg-white hover:text-bx-black transition-colors disabled:opacity-50">
                            <ArrowLeft size={20} />
                        </button>

                        <div className="flex space-x-3">
                            <div className="w-2 h-2 rounded-full bg-white ring-2 ring-white ring-offset-2 ring-offset-bx-black"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30"></div>
                        </div>

                        <button className="rounded-full border border-white/30 p-2 hover:bg-white hover:text-bx-black transition-colors">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Right Side: Description & Watch Link */}
                <div className="w-full md:w-1/3 flex flex-col justify-between h-full min-h-[160px]">
                    <p className="text-lg font-light text-white/90 leading-relaxed mb-6">
                        SPS Chairman, CEO & Co-Founder Steve Schwarzman and President & COO Jon Gray interview each other on SPS’s past, present, and future.
                    </p>

                    <div className="flex items-center space-x-3 group cursor-pointer w-fit">
                        <span className="font-bold uppercase text-sm tracking-widest border-b border-transparent group-hover:border-white transition-all pb-1">Watch Now</span>
                        <PlayCircle className="text-white fill-transparent group-hover:fill-white/20 transition-all stroke-1" size={32} />
                    </div>
                </div>
            </div>

        </section >
    );
}
