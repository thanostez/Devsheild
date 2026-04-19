export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl py-12 px-4 shadow-card rounded-xl bg-secondaryBg border border-border sm:px-6">
      <h1 className="text-3xl font-bold text-textPrimary mb-6 tracking-tight">Privacy Policy</h1>
      
      <div className="space-y-6 text-textSecondary text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
          <p>
            At DevShield, we take your privacy seriously. This privacy policy explains how we collect, use, and protect your data—or more accurately, how we specifically <strong>do not</strong> collect or store your private data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. Zero-Knowledge Password Checking</h2>
          <p>
            Our Credential Leak Monitor uses a strict zero-knowledge architecture. All passwords typed into our application are hashed via SHA-1 directly in your browser. We only send the first 5 characters of this hash to third-party databases, ensuring your password never leaves your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. Email Checking</h2>
          <p>
            When scanning for email breaches, your email acts solely as a query parameter strictly proxied to external databases. We do not store, log, or save any email addresses searched on this platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Third-Party Services</h2>
          <p>
            DevShield proxies requests to third-party APIs (including npm APIs, GitHub, and credential endpoints). Please note that these services operate under their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">5. Local Storage</h2>
          <p>
            We use browser LocalStorage sparingly to save your theme preferences and recent searches for convenience, none of which is tracked persistently on our backend.
          </p>
        </section>
        
        <p className="pt-4 text-xs text-textDim border-t border-border">
          Last updated: April 2026
        </p>
      </div>
    </div>
  );
}
