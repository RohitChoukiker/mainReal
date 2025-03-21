export default function NotFoundPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
        <h1 className="text-5xl font-bold text-gray-800">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go Back Home
        </a>
      </div>
    );
  }
  