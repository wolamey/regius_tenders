import Sidebar from "../Sidebar/Sidebar";
import UserInfoLine from "../UserInfoLine/UserInfoLine";

const Layout = ({ children, pageName }) => {
  return (
    <div className="layout h-screen overflow-hidden flex w-full ">
      <Sidebar pageName={pageName} />
      <div className="flex flex-col gap-[20px] w-full h-screen">
        <UserInfoLine />
        <div className=" flex flex-col overflow-auto ">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
