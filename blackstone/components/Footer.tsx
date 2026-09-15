'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-bx-black text-white px-6 md:px-12 pt-16 pb-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-24">
                    {/* Logo Area */}
                    <div className="flex items-start mb-12 md:mb-0">
                        <div className="flex flex-col">
                            <span className="text-xl font-serif font-bold leading-none mb-1">Build</span>
                            <span className="text-sm font-serif italic text-right mr-1">with</span>
                        </div>
                        <div className="border border-white px-3 py-1 ml-2">
                            <span className="text-lg font-serif font-medium tracking-wide">SPS</span>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="flex flex-col md:flex-row gap-12 md:gap-24">
                        {/* Quick Links */}
                        <div>
                            <h4 className="text-[20px] font-bold mb-6">Quick Links</h4>
                            <ul className="space-y-4 text-[18px] text-gray-300">
                                <li><Link href="#" className="hover:text-white transition-colors">The Firm</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Our People</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Insights</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            </ul>
                        </div>

                        {/* Social */}
                        <div>
                            <h4 className="text-[20px] font-bold mb-6">Social</h4>
                            <ul className="space-y-4 text-[18px] text-gray-300">
                                <li><Link href="#" className="hover:text-white transition-colors">LinkedIn</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Instagram</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">X (Twitter)</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Facebook</Link></li>
                            </ul>
                        </div>

                        {/* Get in Touch */}
                        <div>
                            <h4 className="text-[20px] font-bold mb-6">Get in Touch</h4>
                            <ul className="space-y-4 text-[18px] text-gray-300">
                                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Our Offices</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Limited Partner Login</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-gray-400">
                    <p className="mb-4 md:mb-0">© 2025 SPS Inc.</p>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex flex-wrap justify-end gap-6">
                            <Link href="#" className="hover:text-white transition-colors">Transparency & Disclosure</Link>
                            <Link href="#" className="hover:text-white transition-colors">Legal</Link>
                            <Link href="#" className="hover:text-white transition-colors">Privacy Center</Link>
                            <Link href="#" className="hover:text-white transition-colors">Japan Disclaimer</Link>
                            <Link href="#" className="hover:text-white transition-colors">Phishing and Fraud Awareness</Link>
                        </div>
                        <Link href="#" className="hover:text-white transition-colors">Do Not Sell or Share My Personal Information</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
