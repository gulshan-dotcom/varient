"use client";

export default function TermsPage() {
  const toggleSection = (e) => {
    const header = e.currentTarget;
    const content = header.nextElementSibling;
    const icon = header.querySelector(".expand-icon");

    content.classList.toggle("open");
    icon.classList.toggle("rotate-180");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 pb-8 border-b-4 border-amber-500">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 font-heading">
              Terms & Conditions
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Last Updated: 16 November 2025
            </p>
          </div>

          {/* Policy Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Section 1 */}
            <div className="border-b border-gray-200">
              <button
                onClick={toggleSection}
                className="w-full flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all duration-200"
              >
                <span className="text-xl font-semibold text-gray-800">
                  1. Introduction
                </span>
                <svg
                  className="expand-icon w-6 h-6 text-gray-700 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="policy-content-body max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700 space-y-4">
                  <p>
                    Welcome to Varient. By accessing or using our website or
                    mobile application, you agree to be bound by the following
                    Terms & Conditions. These terms govern the use of our
                    platform, services, and products offered through Varient.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="border-b border-gray-200">
              <button
                onClick={toggleSection}
                className="w-full flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all duration-200"
              >
                <span className="text-xl font-semibold text-gray-800">
                  2. User Responsibilities
                </span>
                <svg
                  className="expand-icon w-6 h-6 text-gray-700 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="policy-content-body max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700 space-y-4">
                  <p>As a user, you must adhere to the following rules:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      You must provide accurate information while placing
                      orders.
                    </li>
                    <li>
                      You are responsible for maintaining the confidentiality of
                      your login credentials.
                    </li>
                    <li>
                      Misuse of the platform may result in suspension or
                      termination of your اتص account.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Baaki sab sections same pattern mein — main yahan short kar raha hoon, neeche full list hai */}

            {/* Section 3 to 13 — same structure */}
            {[
              {
                title: "3. Product Information",
                content: [
                  "We try our best to display accurate product details, but variations may occur.",
                  "Prices are subject to change at any time without prior notice.",
                ],
              },
              {
                title: "4. Order Acceptance",
                content: [
                  "Orders placed are considered confirmed only after successful payment (except COD).",
                  "We reserve the right to cancel any order due to stock issues, address mismatch, or other errors.",
                ],
              },
              {
                title: "5. Payment Terms",
                content: [
                  "We support prepaid Only Not COD payment modes.",
                  "Payments are processed securely through third-party gateways.",
                ],
              },
              {
                title: "6. Shipping & Delivery",
                content: [
                  "Delivery timelines are estimates and may vary.",
                  "Shipping charges, if any, will be displayed at checkout.",
                ],
              },
              {
                title: "7. Returns & Refunds",
                content: [
                  "Returns are Not accepted as per our Return & Refund Policy.",
                  "Product can be exchanged, within 24 hours",
                ],
              },
              {
                title: "8. User-Generated Content",
                content: [
                  "Reviews, comments, or uploads must not contain abusive or illegal content.",
                  "We reserve the right to remove content violating guidelines.",
                ],
              },
              {
                title: "9. Limitation of Liability",
                content: [
                  "Delivery delays due to courier services",
                  "Third-party failures (payment gateways, logistics partners)",
                  "Product misuse by the customer",
                ],
                intro: "We are not responsible for:",
              },
              {
                title: "10. Intellectual Property",
                content: [
                  "All content including logos, images, and text is owned by Varient and may not be used without permission.",
                ],
              },
              {
                title: "11. Termination",
                content: [
                  "We may suspend or terminate your access if you violate any terms.",
                ],
              },
              {
                title: "12. Updates to These Terms",
                content: [
                  "We may update these Terms at any time. Updated versions will be posted on our website/app.",
                ],
              },
              {
                title: "13. Contact Us",
                content: [
                  "Customer Care Number: 9137650662",
                  "Email: Varientcustomercare@gmail.com",
                  "Address: Varient, Mumbai, India",
                ],
                intro: "For any support or complaints:",
              },
            ].map((section, i) => (
              <div key={i} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={toggleSection}
                  className="w-full flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all duration-200"
                >
                  <span className="text-xl font-semibold text-gray-800">
                    {section.title}
                  </span>
                  <svg
                    className="expand-icon w-6 h-6 text-gray-700 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="policy-content-body max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                  <div className="px-8 py-6 text-gray-700 space-y-4">
                    {section.intro && <p>{section.intro}</p>}
                    {Array.isArray(section.content) ? (
                      <ul className="list-disc pl-6 space-y-2">
                        {section.content.map((item, idx) => (
                          <li key={idx}>
                            {item.startsWith("Customer Care") ||
                            item.startsWith("Email:") ||
                            item.startsWith("Address:") ? (
                              <strong>{item}</strong>
                            ) : (
                              item
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{section.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Footer */}
          <div className="mt-12 text-center p-2.5 bg-white rounded-2xl border border-gray-200 shadow-lg">
            <p className="text-lg text-gray-700">
              Can&quot;t find what you&quot;re looking for?
            </p>
            <p className="text-lg text-gray-700 mt-2">
              Contact our support team directly:
            </p>
            <p className="mt-6 text-lg">
              Call us at <strong className="text-gray-900">9137650662</strong>{" "}
              or email us at{" "}
              <a
                href="mailto:Varientcustomercare@gmail.com"
                className="text-cyan-600 font-bold hover:text-amber-500 transition"
              >
                Varientcustomercare@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Critical CSS for collapse animation */}
      <style jsx>{`
        .policy-content-body {
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
        }
        .policy-content-body.open {
          max-height: 1200px;
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
        }
        @media (max-width: 640px) {
          .policy-content-body.open {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
