export default function Footer() {
  return (
    <footer className="bg-[#2c3e50] dark:bg-[#1e293b] text-white w-full text-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* About the Creator */}
          <div>
            <h3 className="text-base font-semibold text-white mb-2">About the Creator</h3>
            <p className="text-gray-300 dark:text-gray-400 text-xs leading-tight">
              Fishly was created by Ariel Figueroa, a passionate software engineer and avid fisherman, to help anglers track catches and find fishing spots.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-base font-semibold text-white mb-2">Features</h3>
            <ul className="text-gray-300 dark:text-gray-400 space-y-1 text-xs">
              <li className="flex items-center gap-2">
                <span>🎣</span>
                <span>
                  <strong>Catch Tracking</strong> – Log and analyze your fishing history.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>
                  <strong>Fishing Spots</strong> – Discover and share the best locations.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>⛅</span>
                <span>
                  <strong>Live Weather</strong> – Get real-time fishing conditions.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>🗺️</span>
                <span>
                  <strong>Interactive Maps</strong> – Navigate to top fishing spots.
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-semibold text-white mb-2">Contact</h3>
            <p className="text-gray-300 dark:text-gray-400 text-xs">
              Have questions or feedback? Reach out!
            </p>
            <p className="text-gray-300 dark:text-gray-400 mt-1 text-xs">
              📧{" "}
              <strong>Email:</strong>{" "}
              <a
                href="mailto:contact@ariel-figueroa.com"
                className="underline hover:text-[#a0c4ff] transition-colors"
                aria-label="Email Ariel Figueroa"
              >
                contact@ariel-figueroa.com
              </a>
            </p>
            <p className="text-gray-300 dark:text-gray-400 mt-1 text-xs">
              🌐{" "}
              <strong>Creator:</strong>{" "}
              <a
                href="https://www.ariel-figueroa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#a0c4ff] transition-colors"
                aria-label="Visit Ariel Figueroa's website"
              >
                www.ariel-figueroa.com
              </a>
            </p>
          </div>
        </div>

        <hr className="my-4 border-gray-600 dark:border-gray-700" />

        <div className="text-center text-gray-300 dark:text-gray-400 text-xs font-medium">
          © {new Date().getFullYear()} Fishly, built by Ariel Figueroa.
        </div>
      </div>
    </footer>
  );
}