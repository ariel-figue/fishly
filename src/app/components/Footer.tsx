export default function Footer() {
  return (
    <footer className="bg-[#2c3e50] text-white w-[100vw] py-4 text-sm">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
      {/* About the Creator */}
      <div>
        <h3 className="text-lg font-semibold mb-3">About the Creator</h3>
        <p className="text-gray-400 leading-tight">
          Fishly was created by Ariel Figueroa, a passionate software engineer and avid fisherman.
          Combining his love for technology and the outdoors, he built Fishly to help anglers track their
          catches, find the best fishing spots, and optimize their trips with real-time data.
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Features</h3>
        <ul className="text-gray-400 space-y-1">
          <li>🎣 <strong>Catch Tracking</strong> – Log and analyze your fishing history.</li>
          <li>📍 <strong>Fishing Spots</strong> – Discover and share the best locations.</li>
          <li>⛅ <strong>Live Weather</strong> – Get real-time fishing conditions.</li>
          {/* <li>📊 <strong>AI Insights</strong> – Optimize your strategy with data.</li> */}
          <li>🗺️ <strong>Interactive Maps</strong> – Navigate to top fishing spots.</li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Contact</h3>
        <p className="text-gray-400">Have questions or feedback? Reach out!</p>
        <p className="text-gray-400 mt-1">📧 <strong>Email:</strong> <a href="mailto:contact@ariel-figueroa.com" className="underline hover:text-blue-400">contact@ariel-figueroa.com</a></p>
        <p className="text-gray-400 mt-1">🌐 <strong>Creator:</strong> <a href="https://www.ariel-figueroa.com" target="_blank" className="underline hover:text-blue-400">www.ariel-figueroa.com</a></p>
      </div>
    </div>

    <hr className="my-4 border-gray-700" />

    <div className="text-center text-white text-xs font-medium">
      © {new Date().getFullYear()} Fishly, built by Ariel Figueroa.
    </div>
  </div>
</footer>

  );
}
