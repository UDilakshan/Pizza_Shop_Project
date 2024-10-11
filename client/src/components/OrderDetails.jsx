import React from 'react'

const OrderDetails = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
      name: '',
      address: '',
      phone: '',
    });
    
    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCustomerDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toggleModal(); // Close the modal after submission
        // Here you can handle the customer details, like sending them to the backend or saving in state
        console.log('Customer Details:', customerDetails);
        routeChange(); // Navigate to OrderDetails page
      };
      
    

    return (
        <>
          {/* Cart Component UI */}
          <button
            className='text-slate-900 text-base md:ml-8 ml-4 py-2 px-4 hover:text-slate-100 font-semibold hover:bg-orange-600 bg-orange-500 rounded-xl cursor-pointer'
            onClick={toggleModal}
          >
            Order
          </button>
      
          {/* Modal for Customer Details */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={customerDetails.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={customerDetails.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="mr-4 bg-gray-300 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      );
      
  
}

export default OrderDetails
