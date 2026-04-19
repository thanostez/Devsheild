export default function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-4xl py-12 px-4 shadow-card rounded-xl bg-secondaryBg border border-border sm:px-6">
      <h1 className="text-3xl font-bold text-textPrimary mb-6 tracking-tight">Terms and Conditions</h1>
      
      <div className="space-y-6 text-textSecondary text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing and using DevShield, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. Description of Service</h2>
          <p>
            DevShield provides tools for npm package risk analysis and credential breach monitoring. These services are provided "as is" and without warranty of any kind.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. User Responsibilities</h2>
          <p>
            You agree not to misuse the services. You must not attempt to breach or circumvent any security measures, rate limits, or use the service for malicious intent. 
            All credential checks hash passwords locally on your device, adhering to our zero-knowledge policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Disclaimer of Liability</h2>
          <p>
            DevShield shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services. Data is sourced from external APIs and we do not guarantee its absolute accuracy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes take effect immediately upon being posted. Continued use constitutes acceptance of revised terms.
          </p>
        </section>
        
        <p className="pt-4 text-xs text-textDim border-t border-border">
          Last updated: April 2026
        </p>
      </div>
    </div>
  );
}
