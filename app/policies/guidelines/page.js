"use client";

export default function PoliciesPage() {
  const toggleSection = (e) => {
    const header = e.currentTarget;
    const content = header.nextElementSibling;
    const icon = header.querySelector(".expand-icon");

    content.classList.toggle("open");
    icon?.classList.toggle("rotate-180");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-12 pb-8 border-b-4 border-amber-500">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Varient Policies & Guidelines
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              All necessary rules and information for your convenience.
            </p>
          </div>

          {/* All Policy Sections */}
          <div className="space-y-8">
            {/* Refund & Return Policy */}
            <section className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div
                onClick={toggleSection}
                className="policy-header cursor-pointer flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  Refund & Return Policy
                </h2>
                <svg
                  className="expand-icon w-6 h-6 text-gray-700 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="policy-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700 space-y-6">
                  <p>
                    <strong>Last Updated: 16 November 2025</strong>
                  </p>
                  <p>
                    At Varient, customer satisfaction is our priority. This
                    Refund & Return Policy explains the conditions under which
                    products can be returned, replaced, or refunded.
                  </p>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    1. Eligibility for Returns
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Returns must be requested within{" "}
                      <strong>48 hours of delivery</strong>.
                    </li>
                    <li>
                      An <strong>Unboxing Video is mandatory</strong> for all
                      return and refund claims.
                    </li>
                    <li>
                      Product must be in original condition, unused, and with
                      all packaging intact.
                    </li>
                    <li>
                      If a wrong or defective product is delivered by our side,
                      the return/replacement will be accepted without any issue.
                    </li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    2. Non-Returnable Items
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>Personal care items</li>
                    <li>Innerwear</li>
                    <li>Perishable goods</li>
                    <li>Customized items</li>
                    <li>Items marked “Non-Returnable” on the product page</li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    3. Mandatory Unboxing Video Requirement
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      The video must clearly show the package from all sides
                      before opening.
                    </li>
                    <li>
                      The entire opening process must be recorded without cuts.
                    </li>
                    <li>
                      Product issues must be clearly visible in the video.
                    </li>
                    <li>
                      Claims without a valid unboxing video will not be
                      accepted.
                    </li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    4. Refund Process
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Refund will be issued only after successful quality check
                      of the returned item.
                    </li>
                    <li>Refund timeline: 3–7 working days.</li>
                    <li>
                      Refund method: original payment mode or wallet credit.
                    </li>
                  </ul>

                  <div className="pt-6 border-t border-dashed border-gray-300 text-sm text-gray-600">
                    <strong>Contact:</strong> Customer Care Number:{" "}
                    <strong>9137650662</strong> | Email:{" "}
                    <a
                      href="mailto:Varientcustomercare@gmail.com"
                      className="text-cyan-600 font-medium hover:text-amber-500"
                    >
                      Varientcustomercare@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div
                onClick={toggleSection}
                className="policy-header cursor-pointer flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  Cancellation Policy
                </h2>
                <svg
                  className="expand-icon w-6 h-6 text-gray-700 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="policy-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700 space-y-6">
                  <p>
                    <strong>Last Updated: 16 November 2025</strong>
                  </p>
                  <p>
                    This Cancellation Policy explains how customers can cancel
                    their orders placed on Varient.
                  </p>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    1. Order Cancellation Before Dispatch
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Orders can be cancelled within{" "}
                      <strong>
                        12 hours of placing the order OR before dispatch
                      </strong>
                      .
                    </li>
                    <li>
                      If the order is already packed or shipped, cancellation
                      will not be possible.
                    </li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    2. Cancellation After Dispatch
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Once the order is dispatched, it cannot be cancelled.
                    </li>
                    <li>
                      If the customer refuses/cancels the order at the doorstep,{" "}
                      <strong>
                        DELIVERY CHARGES must be paid by the customer
                      </strong>
                      .
                    </li>
                    <li>
                      You may apply for a return after receiving the product (if
                      eligible as per our Return Policy).
                    </li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    3. Auto-Cancellation by Varient
                  </h4>
                  <p>
                    We may automatically cancel an order under the following
                    conditions:
                  </p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>Product out of stock</li>
                    <li>Incorrect or incomplete address</li>
                    <li>Payment failure or suspected fraudulent activity</li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    4. Refund for Cancelled Orders
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      For prepaid orders, refund will be issued within 3–7
                      business days to the original payment method.
                    </li>
                  </ul>

                  <div className="pt-6 border-t border-dashed border-gray-300 text-sm text-gray-600">
                    <strong>Contact:</strong> Customer Care Number:{" "}
                    <strong>9137650662</strong> | Email:{" "}
                    <a
                      href="mailto:Varientcustomercare@gmail.com"
                      className="text-cyan-600 font-medium hover:text-amber-500"
                    >
                      Varientcustomercare@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping & Delivery Policy */}
            <section className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div
                onClick={toggleSection}
                className="policy-header cursor-pointer flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  Shipping & Delivery Policy
                </h2>
                <svg
                  className="expand-icon w-6 h-6 text-gray-700 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="policy-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700 space-y-6">
                  <p>
                    <strong>Last Updated: 16 November 2025</strong>
                  </p>
                  <p>
                    This Shipping & Delivery Policy explains how and when your
                    orders will be delivered.
                  </p>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    1. Shipping Time & Charges
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>Orders are dispatched within 1–3 business days.</li>
                    <li>
                      Delivery time is typically 3–7 business days depending on
                      location.
                    </li>
                    <li>
                      Standard shipping charges may apply as shown during
                      checkout.
                    </li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    2. Delivery Issues
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>Courier partners will attempt delivery 2–3 times.</li>
                    <li>
                      Orders with incorrect or incomplete addresses may face
                      delays or cancellation.
                    </li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    3. Damaged or Tampered Package
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      If the package appears damaged or tampered, please record
                      an <strong>unboxing video</strong> and contact us
                      immediately.
                    </li>
                    <li>Unboxing video is mandatory for any damage claim.</li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    4. Delays Beyond Our Control
                  </h4>
                  <p>Varient is not responsible for delays caused by:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Courier delays, Weather conditions, or Natural disasters.
                    </li>
                    <li>Strikes or unforeseen events.</li>
                  </ul>

                  <div className="pt-6 border-t border-dashed border-gray-300 text-sm text-gray-600">
                    <strong>Contact:</strong> Customer Care Number:{" "}
                    <strong>9137650662</strong> | Email:{" "}
                    <a
                      href="mailto:Varientcustomercare@gmail.com"
                      className="text-cyan-600 font-medium hover:text-amber-500"
                    >
                      Varientcustomercare@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Policy */}
            <section className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div
                onClick={toggleSection}
                className="policy-header cursor-pointer flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  Payment Policy
                </h2>
                <svg
                  className="expand-icon w-6 h-6 text-gray-700 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="policy-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700 space-y-6">
                  <p>
                    <strong>Last Updated: 16 November 2025</strong>
                  </p>
                  <p>
                    This Payment Policy explains acceptable payment methods,
                    processing rules, and safety guidelines for transactions on
                    Varient.
                  </p>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    1. Accepted Payment Methods
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      UPI (PhonePe, Paytm, Google Pay, etc.), Debit/Credit
                      Cards, Net Banking, and Wallets.
                    </li>
                    <li>Cash on Delivery (COD) | Coming Soon...</li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    2. Payment Security
                  </h4>
                  <p>
                    All online payments are processed through secure, encrypted
                    third-party payment gateways. We do not store your card or
                    banking information on our servers.
                  </p>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    3. Fraud Prevention
                  </h4>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Orders identified as suspicious or fraudulent may be
                      cancelled.
                    </li>
                    <li>
                      Repeated payment failures refusals may lead to account
                      restrictions.
                    </li>
                  </ul>

                  <div className="pt-6 border-t border-dashed border-gray-300 text-sm text-gray-600">
                    <strong>Contact:</strong> Customer Care Number:{" "}
                    <strong>9137650662</strong> | Email:{" "}
                    <a
                      href="mailto:Varientcustomercare@gmail.com"
                      className="text-cyan-600 font-medium hover:text-amber-500"
                    >
                      Varientcustomercare@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div
                onClick={toggleSection}
                className="policy-header cursor-pointer flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all"
              >
                <h2 className="text-2xl font-semibold text-gray-800">
                  Disclaimer
                </h2>
                <svg
                  className="expand-icon w-6 h-6 text-gray-700 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="policy-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700 space-y-6">
                  <p>
                    <strong>Last Updated: 16 November 2025</strong>
                  </p>
                  <p>
                    This Disclaimer outlines the limitations and
                    responsibilities related to the use of Varient website and
                    mobile application.
                  </p>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    1. General Information & Accuracy
                  </h4>
                  <p>
                    We do not guarantee that product descriptions, images, or
                    details are always accurate, complete, or error-free. Minor
                    variations may occur due to screen display, lighting, or
                    manufacturer updates.
                  </p>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    2. Liability Limitations
                  </h4>
                  <p>Varient is not responsible for:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Damages due to misuse or improper handling of products.
                    </li>
                    <li>Delivery delays caused by courier partners.</li>
                    <li>
                      Losses due to incorrect addresses given by customers.
                    </li>
                    <li>
                      Third-party service failures (payment gateways, logistics,
                      vendors).
                    </li>
                  </ul>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    3. Pricing Errors
                  </h4>
                  <p>
                    Prices may change without notice. In case of pricing errors,
                    we may cancel the order and notify the customer.
                  </p>

                  <h4 className="text-xl font-bold text-cyan-600 mt-8">
                    4. Customer Responsibility
                  </h4>
                  <p>Users must:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>
                      Provide accurate information and check product details
                      before ordering.
                    </li>
                    <li>Read all policies before making a purchase.</li>
                  </ul>

                  <div className="p-2.5 border-t border-dashed border-gray-300 text-sm text-gray-600">
                    <strong>Contact:</strong> Customer Care Number:{" "}
                    <strong>9137650662</strong> | Email:{" "}
                    <a
                      href="mailto:Varientcustomercare@gmail.com"
                      className="text-cyan-600 font-medium hover:text-amber-500"
                    >
                      Varientcustomercare@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Smooth Collapse Animation */}
      <style jsx>{`
        .policy-content {
          transition: max-height 0.5s ease, padding 0.4s ease;
        }
        .policy-content.open {
          max-height: 3000px;
        }
        @media (max-width: 640px) {
          .policy-header {
            padding: 1.25rem;
          }
          .policy-content.open {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
