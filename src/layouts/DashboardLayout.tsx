import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div>
      {/* <header className="bg-green-400 text-cyan-900">header</header> */}
      <Outlet />
      {/* <footer className="bg-green-400 text-cyan-900">footer</footer> */}
    </div>
  );
};

export default DashboardLayout;
