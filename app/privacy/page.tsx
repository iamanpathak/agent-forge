import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-3xl border border-gray-200 shadow-sm">
        
        <Link href="/" className="inline-flex items-center gap-2 text-purple-600 font-bold mb-8 hover:text-purple-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 font-medium mb-10 pb-6 border-b border-gray-100">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
        
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>
              We collect information to provide better services to our users. This includes:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-600">
              <li><strong>Account Data:</strong> Information securely managed by Clerk, including your email address, name, and profile picture.</li>
              <li><strong>Workflow Data:</strong> The structure of the nodes, logical connections, and text prompts you save on our canvas.</li>
              <li><strong>Execution Logs:</strong> Metadata regarding workflow successes, failures, and execution times to help debug and improve system performance.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Data</h2>
            <p>
              Your data is primarily used to operate the AgentForge execution engine. We do <strong>not</strong> sell your personal data to data brokers. Your workflow logic is executed strictly based on your triggers. We use metadata to monitor system health, prevent abuse, and optimize our proprietary routing algorithms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Third-Party LLMs and APIs</h2>
            <p>
              AgentForge acts as a visual middleware. To execute your workflows, data payloads are securely transmitted to third-party partners (such as Groq, OpenAI, or Discord). We do not claim ownership over the data passed through these nodes. Please review the privacy policies of the respective API providers you choose to integrate, as their data retention rules will apply to the prompts and payloads processed through their services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard encryption and security protocols to protect your sensitive information. Any external Webhook URLs, API Keys, or Database credentials entered into the nodes are processed securely. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time. If you wish to entirely delete your AgentForge account and all associated workflow data, you may do so through your account settings or by contacting us directly.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}