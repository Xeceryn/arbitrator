import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Crypto Manager</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm [&.active]:border-blue-500 [&.active]:text-blue-600"
              >
                Dashboard
              </Link>
              <Link 
                to="/cryptocurrencies" 
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm [&.active]:border-blue-500 [&.active]:text-blue-600"
              >
                Cryptocurrencies
              </Link>
              <Link 
                to="/exchanges" 
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm [&.active]:border-blue-500 [&.active]:text-blue-600"
              >
                Exchanges
              </Link>
              <Link 
                to="/assignments" 
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm [&.active]:border-blue-500 [&.active]:text-blue-600"
              >
                Assignments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
