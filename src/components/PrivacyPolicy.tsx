import { privacyPolicy } from '../privacy-policy.mjs';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-slate-700">
        <a href="/" className="text-blue-700 font-semibold hover:underline">← Back to RP Innovation Labs</a>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-8">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Effective date: {privacyPolicy.effectiveDate}</p>

        <section className="mt-8 space-y-4">
          <p>RP Innovation Labs respects your privacy. This policy explains how we handle information submitted through our website.</p>
          <h2 className="text-xl font-bold text-slate-900">Information we collect</h2>
          <p>When you submit a service request, we collect your {privacyPolicy.collectedData.join(', ')}.</p>
          <h2 className="text-xl font-bold text-slate-900">How we use information</h2>
          <p>{privacyPolicy.dataUse}</p>
          <h2 className="text-xl font-bold text-slate-900">Sharing and protection</h2>
          <p>We do not sell your personal information. We share it only with service providers needed to operate the request process, such as our secure email provider, and only for that purpose.</p>
          <h2 className="text-xl font-bold text-slate-900">Your choices</h2>
          <p>You may ask us to update or delete your submitted information, subject to legal or operational requirements.</p>
          <h2 className="text-xl font-bold text-slate-900">Contact</h2>
          <p>For privacy questions, email <a className="text-blue-700 hover:underline" href={`mailto:${privacyPolicy.contact}`}>{privacyPolicy.contact}</a>.</p>
        </section>
      </article>
    </main>
  );
}

