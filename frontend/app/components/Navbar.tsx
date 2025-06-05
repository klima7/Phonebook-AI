import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Phonebook
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200">
            Home
          </Link>
          <Link to="/login" className="hover:text-blue-200">
            Login
          </Link>
          <Link to="/register" className="hover:text-blue-200">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
} 