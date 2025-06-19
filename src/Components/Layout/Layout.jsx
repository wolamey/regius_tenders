import Sidebar from "../Sidebar/Sidebar";
import UserInfoLine from "../UserInfoLine/UserInfoLine";

const Layout = ({ children, pageName }) => {
  return (
    <div className="layout h-screen overflow-hidden flex w-full ">
      <Sidebar pageName={pageName} />
      <div className="flex flex-col gap-[50px] w-full h-screen">
        <UserInfoLine />
        <div className="pl-[20px] pt-[10px] pr-[20px] pb-[20px] flex flex-col overflow-auto ">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
