import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import React from 'react';

import type { Route } from "./+types/root";
import Navbar from "./components/navbar";
import { AuthProvider } from "./hooks/useAuth";

import 'bootstrap/dist/css/bootstrap.min.css';

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
  },
];

export function meta() {
  return [
    { title: "Phonebook" },
    { name: "description", content: "Your AI powered phonebook application" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="phonebook-app">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="content-container">
        <Outlet />
      </main>
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mt-5 pt-4">
      <div className="alert alert-danger">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="border p-3 bg-light mt-3 overflow-auto">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
