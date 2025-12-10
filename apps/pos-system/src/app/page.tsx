'use client'

export default function POSPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-12 h-screen">
        {/* Left: Menu/Products */}
        <div className="col-span-8 p-4 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <h3 className="font-semibold">Item {item}</h3>
                <p className="text-primary font-bold">$12.99</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Current Order */}
        <div className="col-span-4 bg-white p-4 border-l">
          <h2 className="text-xl font-bold mb-4">Current Order</h2>
          <div className="flex-1 overflow-y-auto mb-4">
            <p className="text-gray-500 text-center mt-8">No items added</p>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax:</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Total:</span>
              <span>$0.00</span>
            </div>
            
            <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90">
              Charge
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

