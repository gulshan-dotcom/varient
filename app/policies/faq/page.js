"use client";

export default function FAQPage() {
  const toggleFAQ = (e) => {
    const header = e.currentTarget;
    const content = header.nextElementSibling;
    const icon = header.querySelector(".expand-icon");

    content.classList.toggle("open");
    icon?.classList.toggle("rotate-180");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 pb-8 border-b-4 border-amber-500">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Quick answers to your most common questions about ordering,
              delivery, and returns.
            </p>
          </div>

          {/* FAQ Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* FAQ Item 1 */}
            <div className="border-b border-gray-200 last:border-b-0">
              <div
                onClick={toggleFAQ}
                className="faq-question-header cursor-pointer flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all duration-200"
              >
                <span className="text-lg font-semibold text-gray-800">
                  1. How long does delivery take?
                </span>
                <svg
                  className="expand-icon w-5 h-5 text-gray-700 transition-transform duration-300"
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
              <div className="faq-answer-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700">
                  <p>
                    Delivery usually takes <strong>3–7 business days</strong>{" "}
                    depending on your location. Orders are typically dispatched
                    within 1–3 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="border-b border-gray-200 last:border-b-0">
              <div
                onClick={toggleFAQ}
                className="faq-question-header cursor-pointer flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all duration-200"
              >
                <span className="text-lg font-semibold text-gray-800">
                  2. Is an unboxing video required for returns?
                </span>
                <svg
                  className="expand-icon w-5 h-5 text-gray-700 transition-transform duration-300"
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
              <div className="faq-answer-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700">
                  <p>
                    Yes, an <strong>unboxing video is mandatory</strong> for all
                    return, damage, and refund claims. The video must be
                    continuous and clearly show the opening process and the
                    issue.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="border-b border-gray-200 last:border-b-0">
              <div
                onClick={toggleFAQ}
                className="faq-question-header cursor-pointer flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all duration-200"
              >
                <span className="text-lg font-semibold text-gray-800">
                  3. What if I receive a damaged or wrong product?
                </span>
                <svg
                  className="expand-icon w-5 h-5 text-gray-700 transition-transform duration-300"
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
              <div className="faq-answer-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700">
                  <p>
                    Please <strong>record an unboxing video</strong> showing the
                    damage/error and contact our Customer Support immediately
                    (within 48 hours of delivery) for a return/replacement
                    process.
                  </p>
                </div>
              </div>
            </div>

            {/* Baaki sab FAQs — same pattern */}
            {[
              {
                q: "4. Can I cancel my order after placing it?",
                a: "You can cancel your order within <strong>12 hours of placing it OR before it is dispatched</strong>. Once shipped, cancellation is not possible.",
              },
              {
                q: "5. What happens if I cancel/refuse the order at delivery?",
                a: "If the delivery partner has already reached your address and you refuse the order, the customer <strong>must pay the delivery charges</strong> as per our Cancellation Policy.",
              },
              {
                q: "6. How long does a refund take?",
                a: "Refunds take <strong>3–7 working days</strong> to reflect in your account after the return is successfully approved and processed by our Quality Check team.",
              },
              {
                q: "7. How do I track my order?",
                a: "Once dispatched, a tracking ID will be shared via SMS/email. You can also go to the <strong>&quot;My Orders&quot;</strong> section in the app/website to track your shipment.",
              },
              {
                q: "8. What items are non-returnable?",
                a: "The following items are generally non-returnable: Personal care items, innerwear, perishables, customized items, and any product specifically marked &quot;Non-Returnable&quot; on its page.",
              },
              {
                q: "9. What should I do if my payment fails but money is deducted?",
                a: "If your payment is deducted but the order status is not updated, the money is usually held by the bank and <strong>refunded automatically within 3–7 working days</strong>.",
              },
              {
                q: "10. Are returns free?",
                a: "Returns are <strong>free only for wrong or damaged items</strong> delivered from our side. For returns based on other reasons, return shipping charges may apply.",
              },
              {
                q: "11. How do I request a return?",
                a: "Go to the <strong>&quot;My Orders&quot;</strong> section on the website/app, select the order, and choose the option to request a return. Remember to include your unboxing video proof.",
              },
              {
                q: "12. Do I need the original packaging for returns?",
                a: "Yes, it is mandatory. The product must be returned in its <strong>original packaging</strong> along with all accessories, tags, and freebies (if any).",
              },
              {
                q: "13. Do you ship everywhere in India?",
                a: "Yes, we deliver across India, except for a few restricted pin codes. You can check delivery availability using your pin code on the product page.",
              },
              {
                q: "14. Are shipping charges included?",
                a: "No, shipping charges (if applicable) are shown <strong>separately during the checkout</strong> process before you make the final payment.",
              },
              {
                q: "15. Can I modify my order after placing it?",
                a: "Unfortunately, modification is <strong>not possible</strong> after the order is placed. You will need to cancel and place a new order if it's within the cancellation window.",
              },
              {
                q: "16. Do you offer replacements?",
                a: "Yes, replacements are available for <strong>damaged, defective, or wrong items</strong> received. Replacement is subject to stock availability.",
              },
              {
                q: "17. What if the delivery is delayed?",
                a: "Delays may occur due to courier operational issues, extreme weather conditions, or other factors beyond our control. We advise checking the tracking link for the latest update.",
              },
              {
                q: "18. Is my personal information safe?",
                a: "Yes, absolutely. We use <strong>secure, encrypted systems</strong> and adhere to a strict Privacy Policy to protect all customer data and information.",
              },
              {
                q: "19. How do I contact customer care?",
                a: (
                  <>
                    <p>You can reach us through:</p>
                    <ul className="list-disc pl-6 mt-3 space-y-1">
                      <li>
                        <strong>Customer Care Number:</strong> 9137650662
                      </li>
                      <li>
                        <strong>Email:</strong> Varientcustomercare@gmail.com
                      </li>
                    </ul>
                  </>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-200 last:border-b-0">
                <div
                  onClick={toggleFAQ}
                  className="faq-question-header cursor-pointer flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all duration-200"
                >
                  <span className="text-lg font-semibold text-gray-800">
                    {item.q}
                  </span>
                  <svg
                    className="expand-icon w-5 h-5 text-gray-700 transition-transform duration-300"
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
                <div className="faq-answer-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                  <div className="px-8 py-6 text-gray-700">
                    {typeof item.a === "string" ? (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: item.a.replace(/"/g, "&quot;"),
                        }}
                      />
                    ) : (
                      item.a
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Footer */}
          <div className="mt-12 text-center p-2.5 bg-white rounded-2xl border border-gray-200 shadow-lg">
            <p className="text-lg text-gray-700">
              Can&apos;t find what you&apos;re looking for?
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

      {/* Smooth Collapse Animation */}
      <style jsx>{`
        .faq-answer-content {
          transition: max-height 0.5s ease, padding 0.4s ease;
        }
        .faq-answer-content.open {
          max-height: 1200px;
        }
        @media (max-width: 640px) {
          .faq-question-header {
            padding: 1.25rem;
            font-size: 1rem;
          }
          .faq-answer-content.open {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
