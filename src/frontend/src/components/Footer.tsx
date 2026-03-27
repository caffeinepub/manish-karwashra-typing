import { Instagram, Mail, MessageCircle, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="text-white pt-10 pb-5"
      style={{
        background: "linear-gradient(to bottom, #1565c0, #0d1b4b)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Social Icons */}
        <div className="flex justify-center gap-3 mb-6">
          <a
            href="https://youtube.com/@supernatic?si=046swXr_71YSf-Dg"
            className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            data-ocid="footer.link"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/manish_karwashra?igsh=MXU5ODVoY2UydmRnYQ=="
            className="w-11 h-11 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            style={{
              background:
                "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            }}
            data-ocid="footer.link"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/sukhdev_2005"
            className="w-11 h-11 bg-black rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            data-ocid="footer.link"
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter / X"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://www.threads.com/@manish_karwashra"
            className="w-11 h-11 bg-black rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            data-ocid="footer.link"
            target="_blank"
            rel="noopener noreferrer"
            title="Threads"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a
            href="mailto:manishkarwashra07@gmail.com"
            className="w-11 h-11 bg-orange-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
            data-ocid="footer.link"
            title="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-5 mb-4 text-sm text-gray-300">
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

        {/* Copyright */}
        <div className="text-center text-xs text-gray-400">
          &copy; {year} Karwashra Typing. All Rights Reserved. &middot; Built
          with ❤️ using{" "}
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
