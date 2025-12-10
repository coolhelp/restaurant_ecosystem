import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Restaurant</h1>
          <nav className="space-x-4">
            <Link href="/menu" className="hover:underline">Menu</Link>
            <Link href="/cart" className="hover:underline">Cart</Link>
            <Link href="/login" className="hover:underline">Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Delicious Food, Delivered Fast</h2>
          <p className="text-xl mb-8">Order your favorite meals and get them delivered to your door</p>
          <Link 
            href="/menu"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Order Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Fast Delivery"
              description="Get your food delivered in 30 minutes or less"
            />
            <FeatureCard 
              title="Quality Food"
              description="Fresh ingredients and expertly prepared meals"
            />
            <FeatureCard 
              title="Easy Ordering"
              description="Simple and intuitive ordering process"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

