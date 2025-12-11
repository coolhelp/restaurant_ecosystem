import Link from 'next/link'
import { Clock, Star, Truck, ShieldCheck, ChefHat, Sparkles, ArrowRight, Phone, Mail, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TastyBites
              </h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/menu" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Menu
              </Link>
              <Link href="/locations" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Locations
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary transition-colors font-medium">
                About
              </Link>
              <Link href="/cart" className="relative text-gray-700 hover:text-primary transition-colors font-medium">
                Cart
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
              </Link>
              <Link 
                href="/login"
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2 rounded-full hover:shadow-lg transition-all transform hover:scale-105 font-medium"
              >
                Sign In
              </Link>
            </nav>
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Modern Design */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Now Delivering in 30 Minutes</span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Delicious Food,
                <span className="block text-accent mt-2">Delivered Fast</span>
              </h2>
              <p className="text-xl text-white/90 leading-relaxed max-w-xl">
                Order your favorite meals from the best restaurants in town. 
                Fresh, hot, and delivered right to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/menu"
                  className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/menu"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all"
                >
                  View Menu
                </Link>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="font-semibold">4.8/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span className="font-semibold">5000+ Orders</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="space-y-4">
                    {/* Mock food image cards */}
                    <div className="bg-white rounded-2xl p-4 shadow-xl transform rotate-2">
                      <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-xl transform -rotate-2 translate-x-4">
                      <div className="h-48 bg-gradient-to-br from-green-400 to-teal-400 rounded-xl mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose TastyBites
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering the best food experience with quality, speed, and care
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Clock className="h-8 w-8" />}
              title="Fast Delivery"
              description="Get your food delivered in 30 minutes or less, guaranteed"
              color="bg-blue-500"
              delay="0"
            />
            <FeatureCard 
              icon={<Star className="h-8 w-8" />}
              title="Quality Food"
              description="Fresh ingredients and expertly prepared by professional chefs"
              color="bg-yellow-500"
              delay="100"
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8" />}
              title="Safe & Secure"
              description="Contactless delivery and secure payment options"
              color="bg-green-500"
              delay="200"
            />
            <FeatureCard 
              icon={<Truck className="h-8 w-8" />}
              title="Track Orders"
              description="Real-time tracking from kitchen to your doorstep"
              color="bg-purple-500"
              delay="300"
            />
          </div>
        </div>
      </section>

      {/* Popular Items Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Popular Items</h3>
              <p className="text-gray-600">Customer favorites you'll love</p>
            </div>
            <Link href="/menu" className="hidden sm:flex items-center text-primary hover:text-primary-dark font-semibold text-lg group">
              View All
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MenuItem 
              name="Margherita Pizza"
              description="Fresh mozzarella, tomato sauce, and basil"
              price={14.99}
              rating={4.8}
              reviews={256}
              category="Pizza"
            />
            <MenuItem 
              name="Beef Burger Deluxe"
              description="Angus beef, cheddar, lettuce, and special sauce"
              price={12.99}
              rating={4.9}
              reviews={412}
              category="Burgers"
            />
            <MenuItem 
              name="Caesar Salad"
              description="Crisp romaine, parmesan, croutons, and dressing"
              price={9.99}
              rating={4.7}
              reviews={189}
              category="Salads"
            />
          </div>
          <div className="text-center mt-12 sm:hidden">
            <Link href="/menu" className="inline-flex items-center text-primary hover:text-primary-dark font-semibold text-lg">
              View All Menu Items
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ordering from TastyBites is easy and fast
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number={1}
              title="Choose Your Meal"
              description="Browse our delicious menu and select your favorite dishes"
            />
            <StepCard 
              number={2}
              title="Place Your Order"
              description="Add items to cart and checkout securely in seconds"
            />
            <StepCard 
              number={3}
              title="Enjoy Your Food"
              description="Get your order delivered hot and fresh to your door"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-dark to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">Ready to Order?</h3>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying delicious meals every day. 
            Your next favorite dish is just a click away!
          </p>
          <Link 
            href="/menu"
            className="inline-flex items-center bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Start Ordering Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Top Rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">TastyBites</h4>
              </div>
              <p className="text-gray-400 mb-4">
                Delivering happiness, one meal at a time. Experience the best food delivery service in town.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-lg">Quick Links</h5>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/menu" className="hover:text-white transition-colors">Menu</Link></li>
                <li><Link href="/locations" className="hover:text-white transition-colors">Locations</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-lg">Support</h5>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-lg">Contact Us</h5>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start space-x-2">
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>support@tastybites.com</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>1-800-TASTY-00</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>123 Food Street, NY 10001</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">Available 24/7</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2025 TastyBites. All rights reserved.
              </p>
              <div className="flex space-x-6 text-gray-400 text-sm">
                <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: string;
  delay: string;
}) {
  return (
    <div 
      className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`${color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3 text-gray-900">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function MenuItem({ name, description, price, rating, reviews, category }: {
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      <div className="relative overflow-hidden">
        <div className="w-full h-56 bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 group-hover:scale-110 transition-transform duration-300"></div>
        <div className="absolute top-4 left-4">
          <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
            {category}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">{rating}</span>
        </div>
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold mb-2 text-gray-900">{name}</h4>
        <p className="text-gray-600 mb-4 text-sm">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>{reviews} reviews</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-primary">${Number(price).toFixed(2)}</span>
          <button className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all font-medium transform hover:scale-105 active:scale-95">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

function StepCard({ number, title, description }: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center relative">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary text-white rounded-full font-bold text-3xl mb-6 shadow-lg">
        {number}
      </div>
      {number < 3 && (
        <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
      )}
      <h4 className="text-2xl font-bold mb-3 text-gray-900">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
