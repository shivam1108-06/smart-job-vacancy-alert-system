import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Outlet />
    </div>
  );
}

export default MainLayout;