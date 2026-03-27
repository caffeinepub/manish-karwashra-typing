import { Instagram, Mail, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-[#0d1b4b] text-white pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://youtube.com"
            className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            data-ocid="footer.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            data-ocid="footer.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            data-ocid="footer.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="mailto:contact@example.com"
            className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            data-ocid="footer.link"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm text-gray-300">
          <a
            href="/about"
            className="hover:text-white transition-colors"
            data-ocid="footer.link"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="hover:text-white transition-colors"
            data-ocid="footer.link"
          >
            Contact Us
          </a>
          <a
            href="/privacy"
            className="hover:text-white transition-colors"
            data-ocid="footer.link"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:text-white transition-colors"
            data-ocid="footer.link"
          >
            Terms &amp; Conditions
          </a>
        </div>
        <div className="text-center text-xs text-gray-400">
          &copy; {year}. Built with &#10084;&#65039; using{" "}
          <a
            href={caffeineUrl}
            className="underline hover:text-gray-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
