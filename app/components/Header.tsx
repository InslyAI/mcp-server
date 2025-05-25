export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img src="/insly-logo-2.png" alt="Insly" className="h-10 w-auto" />
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="https://insly.com"
              className="insly-nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Main Platform
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
