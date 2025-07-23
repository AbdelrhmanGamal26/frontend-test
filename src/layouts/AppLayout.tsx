import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div className="min-h-dvh">
      <Outlet />
    </div>
  );
};

export default AppLayout;
