function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Branding panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 items-center justify-center p-12">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
              JV
            </div>
            <span className="text-xl font-semibold">Job Vacancy Alert</span>
          </div>

          <h2 className="text-3xl font-bold leading-tight mb-4">{title}</h2>
          <p className="text-slate-300 text-base leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile-only brand header */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              JV
            </div>
            <span className="text-lg font-semibold text-slate-800">
              Job Vacancy Alert
            </span>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
