import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-3xl border border-gray-200 shadow-sm">
        <Link href="/" className="inline-flex items-center gap-2 text-purple-600 font-bold mb-8 hover:text-purple-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-500 font-medium mb-10 pb-6 border-b border-gray-100">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing, registering for, or using the AgentForge platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you are strictly prohibited from using the Service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Intellectual Property Rights</h2>
            <p>
              The AgentForge platform, including but not limited to its source code, visual node-builder interface, execution engine, design, algorithms, and documentation, is the exclusive intellectual property of <strong>Aman Pathak</strong>. You are granted a limited, non-exclusive, non-transferable license to use the Service. You may not copy, modify, distribute, sell, or lease any part of our Service or included software without explicit written permission from Aman Pathak.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Acceptable Use & API Integrations</h2>
            <p>
              AgentForge allows you to build automated workflows using third-party APIs (e.g., Groq, OpenAI, Resend, Discord). You agree that:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-600">
              <li>You will not use the Service to build workflows that violate the terms of service of any third-party API provider.</li>
              <li>You will not use the platform to generate illegal, malicious, or highly abusive content (e.g., DDoS attacks, spam bots, malware distribution).</li>
              <li>You are solely responsible for the costs and limits associated with the API keys you utilize within your workflows.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Limitation of Liability</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. In no event shall Aman Pathak be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; or (iii) unauthorized access, use, or alteration of your transmissions or content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}