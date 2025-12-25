"use client";

export default function PrivacyPolicyPage() {
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
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12 pb-8 border-b-4 border-amber-500">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Last Updated: 16 November 2025
            </p>
          </div>

          {/* Policy Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Introduction */}
            <div className="border-b border-gray-200">
              <div
                onClick={toggleSection}
                className="flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all cursor-pointer"
              >
                <span className="text-xl font-semibold text-gray-800">
                  Introduction
                </span>
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
              <div className="policy-content-body max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                <div className="px-8 py-6 text-gray-700">
                  <p>
                    Varient (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
                    committed to protecting your privacy. This Privacy Policy
                    explains how we collect, use, store, and protect your
                    personal information when you use our website and mobile
                    application.
                  </p>
                </div>
              </div>
            </div>

            {/* All Sections */}
            {[
              {
                title: "1. Information We Collect",
                content: (
                  <>
                    <p>
                      We collect various types of information to provide and
                      improve our services:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                      <li>
                        <strong>Personal details:</strong> name, phone number,
                        email address, shipping address.
                      </li>
                      <li>
                        <strong>Account information:</strong> login details,
                        saved preferences.
                      </li>
                      <li>
                        <strong>Payment details:</strong> processed securely
                        through third-party payment gateways.
                      </li>
                      <li>
                        <strong>Device & usage data:</strong> app usage, IP
                        address, browser type.
                      </li>
                      <li>
                        <strong>Cookies & tracking data</strong> for improving
                        user experience.
                      </li>
                    </ul>
                  </>
                ),
              },
              {
                title: "2. How We Use Your Information",
                content: (
                  <>
                    <p>
                      We use your information for the following primary
                      purposes:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                      <li>To process and deliver your orders.</li>
                      <li>To provide customer support.</li>
                      <li>To improve our website/app performance.</li>
                      <li>
                        To send promotional updates (only with your consent).
                      </li>
                      <li>To prevent fraud and ensure platform safety.</li>
                    </ul>
                  </>
                ),
              },
              {
                title: "3. Sharing of Information",
                content: (
                  <>
                    <p>
                      We do not sell your data. We may share your information
                      with:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                      <li>Delivery partners for shipping your order.</li>
                      <li>Payment gateways for processing transactions.</li>
                      <li>
                        Service providers such as analytics and security tools.
                      </li>
                    </ul>
                    <p className="mt-4">
                      All third-party partners follow strict confidentiality and
                      security rules.
                    </p>
                  </>
                ),
              },
              {
                title: "4. Data Security",
                content:
                  "We use industry-standard encryption and security protocols to protect user information.",
              },
              {
                title: "5. Your Rights",
                content: (
                  <>
                    <p>You may request:</p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                      <li>Correction of inaccurate information.</li>
                      <li>Deletion of your account.</li>
                      <li>Access to the data we hold about you.</li>
                    </ul>
                  </>
                ),
              },
              {
                title: "6. Children Privacy",
                content:
                  "Our services are not intended for individuals under 13 years of age.",
              },
              {
                title: "7. Third-Party Links",
                content:
                  "Our website/app may contain external links. We are not responsible for their content or privacy practices.",
              },
              {
                title: "8. Updates to This Policy",
                content:
                  "We may update this Privacy Policy from time to time. Updated versions will be posted on our website/app.",
              },
              {
                title: "9. Contact Us",
                content: (
                  <>
                    <p>For any queries, support, or complaints:</p>
                    <ul className="list-disc pl-6 mt-4 space-y-2">
                      <li>
                        <strong>Customer Care Number:</strong> 9137650662
                      </li>
                      <li>
                        <strong>Email:</strong> Varientcustomercare@gmail.com
                      </li>
                      <li>
                        <strong>Address:</strong> Varient, Mumbai, India
                      </li>
                    </ul>
                  </>
                ),
              },
            ].map((section, i) => (
              <div key={i} className="border-b border-gray-200 last:border-b-0">
                <div
                  onClick={toggleSection}
                  className="flex justify-between items-center px-8 py-6 bg-cyan-50 hover:bg-cyan-100 transition-all cursor-pointer"
                >
                  <span className="text-xl font-semibold text-gray-800">
                    {section.title}
                  </span>
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
                <div className="policy-content-body max-h-0 overflow-hidden transition-all duration-500 ease-in-out">
                  <div className="px-8 py-6 text-gray-700 space-y-4">
                    {typeof section.content === "string" ? (
                      <p>{section.content}</p>
                    ) : (
                      section.content
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
        .policy-content-body {
          transition: max-height 0.5s ease, padding 0.4s ease;
        }
        .policy-content-body.open {
          max-height: 1500px;
        }
        @media (max-width: 640px) {
          .policy-content-body.open {
            padding: 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
