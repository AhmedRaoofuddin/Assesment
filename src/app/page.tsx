import { RegistrationForm } from '@/components/RegistrationForm';

export default function Home() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl leading-tight">
            Premium Pizza
            <span className="text-red-600"> Experiences</span>
          </h1>
          <p className="mt-8 text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
            Join the Pizza Hut community and discover amazing flavors. Register now to get exclusive access to our premium content and special offers.
          </p>
        </div>

        {/* Registration Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg mx-auto border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Join Pizza Hut</h2>
            <p className="text-gray-700 mt-3 text-lg">Register for exclusive access</p>
          </div>
          
          <RegistrationForm />
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">Premium Content</h3>
            <p className="mt-3 text-gray-700 leading-relaxed">Access exclusive videos and recipes from top chefs</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">Quick Service</h3>
            <p className="mt-3 text-gray-700 leading-relaxed">Fast uploads and instant downloads for your convenience</p>
          </div>
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">Quality Assured</h3>
            <p className="mt-3 text-gray-700 leading-relaxed">All content is carefully curated and high-quality</p>
          </div>
        </div>
      </div>
    </div>
  );
}
