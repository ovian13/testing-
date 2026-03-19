export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-neutral-200">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Create your account</h2>
        <button className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-300 text-neutral-700 py-3 px-4 rounded-lg font-semibold hover:bg-neutral-50 transition-colors">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
