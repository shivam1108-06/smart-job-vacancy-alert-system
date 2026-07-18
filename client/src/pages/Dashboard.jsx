function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-blue-600 text-white p-5 shadow">
        <h1 className="text-2xl font-bold">
          Job Vacancy Alert System
        </h1>
      </header>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-3">
          Dashboard
        </h2>

        <p className="text-gray-600">
          Welcome 👋
        </p>

        <div className="grid grid-cols-3 gap-5 mt-8">

          <div className="bg-white shadow rounded p-6">
            <h3 className="text-xl font-semibold">
              Total Jobs
            </h3>

            <p className="text-4xl mt-3 font-bold">
              0
            </p>
          </div>

          <div className="bg-white shadow rounded p-6">
            <h3 className="text-xl font-semibold">
              Applied Jobs
            </h3>

            <p className="text-4xl mt-3 font-bold">
              0
            </p>
          </div>

          <div className="bg-white shadow rounded p-6">
            <h3 className="text-xl font-semibold">
              Saved Jobs
            </h3>

            <p className="text-4xl mt-3 font-bold">
              0
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;