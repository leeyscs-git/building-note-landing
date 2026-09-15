'use client';

import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 w-full bg-bx-black text-white py-6 flex justify-between items-center z-50 px-[4.5rem]">
            {/* Boxed Logo */}
            <Link href="/" className="border border-white px-4 py-2 hover:bg-white hover:text-bx-black transition-colors">
                <span className="text-xl font-serif font-medium tracking-wide">SPS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center gap-8">
                <nav className="hidden md:flex items-center space-x-6 text-sm font-guardian font-bold tracking-wide">
                    <div className="group relative">
                        <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                            The Firm <ChevronDown size={14} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="group relative">
                        <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                            What We Do <ChevronDown size={14} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="group relative">
                        <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                            News & Insights <ChevronDown size={14} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="group relative">
                        <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                            Financial Advisors <ChevronDown size={14} strokeWidth={3} />
                        </button>
                    </div>
                    <Link href="#" className="hover:text-gray-300 transition-colors">
                        Shareholders
                    </Link>
                    <Link href="#" className="hover:text-gray-300 transition-colors">
                        LP Login
                    </Link>
                </nav>

                {/* Search Icon */}
                <button aria-label="Search" className="hover:text-gray-300 transition-colors">
                    <Search size={20} strokeWidth={2.5} />
                </button>
            </div>
        </header>
    );
}
