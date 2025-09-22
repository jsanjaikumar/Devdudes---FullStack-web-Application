import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0b0410] to-[#1a1a2e] text-white px-6 py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <aside>
          <div className="flex items-center gap-3 mb-3">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              className="fill-fuchsia-500"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
            <h2 className="text-lg font-semibold">DevDudes</h2>
          </div>
          <p className="text-sm text-white/70">
            Building connections through clean code and creative UI. Since 2024.
          </p>
        </aside>

        {/* Services */}
        <nav>
          <h6 className="text-fuchsia-400 font-semibold mb-2">🛠️ Services</h6>
          <ul className="space-y-1 text-sm text-white/80">
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                🎨 Branding
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                🧩 Design
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                📈 Marketing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                📢 Advertisement
              </a>
            </li>
          </ul>
        </nav>

        {/* Company */}
        <nav>
          <h6 className="text-fuchsia-400 font-semibold mb-2">🏢 Company</h6>
          <ul className="space-y-1 text-sm text-white/80">
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                📘 About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                📞 Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                💼 Jobs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                📰 Press Kit
              </a>
            </li>
          </ul>
        </nav>

        {/* Legal */}
        <nav>
          <h6 className="text-fuchsia-400 font-semibold mb-2">⚖️ Legal</h6>
          <ul className="space-y-1 text-sm text-white/80">
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                📜 Terms of Use
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                🔒 Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                🍪 Cookie Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-fuchsia-300">
                💸 Refund Policy
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} DevDudes — All rights reserved. Developed
        with ❤️ by Sanjai Kumar
      </div>
    </footer>
  );
};

export default Footer;
