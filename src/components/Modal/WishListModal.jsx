import React, { useState } from 'react';

function WishlistModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Button to Open the Modal */}

      <button
              onClick={openModal}
              type="button"
              className="relative rounded-full  p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">View notifications</span>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4094 20.81C13.0694 20.93 12.5094 20.93 12.1694 20.81C9.26943 19.82 2.78943 15.69 2.78943 8.69C2.78943 5.6 5.27943 3.1 8.34943 3.1C10.1694 3.1 11.7794 3.98 12.7894 5.34C13.7994 3.98 15.4194 3.1 17.2294 3.1C20.2994 3.1 22.7894 5.6 22.7894 8.69C22.7894 15.69 16.3094 19.82 13.4094 20.81Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50">
          <div
            className="fixed top-0 right-0 z-50 w-80 h-screen bg-white p-6 transition-transform duration-300"
            style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }} // Translate to the right when hidden
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-900 p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 8.586l4.95-4.95a1 1 0 011.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10 3.636 5.05a1 1 0 011.414-1.414L10 8.586z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4">
              <p className="text-gray-500">Your wishlist is currently empty.</p>

              {/* Example Wishlist Items */}
              <ul className="mt-4 space-y-2">
                
                <li className="flex justify-between items-center">
                  <span className="text-gray-800">Product 2</span>
                  <button className="text-red-500 hover:underline">
                    Remove
                  </button>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-800">Product 2</span>
                  <button className="text-red-500 hover:underline">
                    Remove
                  </button>
                </li>
                <li class="py-3 sm:py-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Neil Sims
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $320
                    </div>
                </div>
            </li>
              </ul>
            </div>

            

<div class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Latest Customers</h5>
        <a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
            View all
        </a>
   </div>
   <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
           
            <li class="py-3 sm:py-4">
                <div class="flex items-center ">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Bonnie image"/>
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Bonnie Green
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>
            <li class="py-3 sm:py-4">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-2.jpg" alt="Michael image"/>
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Michael Gough
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $67
                    </div>
                </div>
            </li>
            <li class="py-3 sm:py-4">
                <div class="flex items-center ">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-4.jpg" alt="Lana image"/>
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Lana Byrd
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $367
                    </div>
                </div>
            </li>
            <li class="pt-3 pb-0 sm:pt-4">
                <div class="flex items-center ">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-5.jpg" alt="Thomas image"/>
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Thomes Lean
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $2367
                    </div>
                </div>
            </li>
        </ul>
   </div>
</div>


            {/* Modal Footer */}
            <div className="mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WishlistModal;
