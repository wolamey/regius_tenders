import { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import UserInfoLine from "../UserInfoLine/UserInfoLine";

const Layout = ({ children, pageName,refreshToken }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isSideBarHidden, setIsSideBarHidden] = useState(false);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    // console.log(screenWidth);
    setIsSideBarHidden(screenWidth < 1024 ? true : false);
    // console.log(isSideBarHidden);
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="layout h-screen overflow-hidden flex w-full ">

        {screenWidth < 1024 && (

      <Sidebar
        pageName={pageName}
        isSideBarHidden={isSideBarHidden}
        setIsSideBarHidden={setIsSideBarHidden}
        screenWidth={screenWidth}
          refreshToken={refreshToken}

      />

        )}
      <div className="flex flex-col gap-[20px] w-full h-screen bg-[var(--bg)]">
        <UserInfoLine
          isSideBarHidden={isSideBarHidden}
          setIsSideBarHidden={setIsSideBarHidden}
          screenWidth={screenWidth}
          refreshToken={refreshToken}
        />
        <div className="h-full flex flex-col overflow-x-hidden overflow-y-auto w-full   mx-auto max-w-[1400px] ">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
