import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Phonebook" },
    { name: "description", content: "Welcome to Phonebook!" },
  ];
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Welcome to Phonebook</h1>
        <p className="text-center text-gray-600 dark:text-gray-400">Please login to access your contacts or register for a new account.</p>
      </div>
    </div>
  );
}
