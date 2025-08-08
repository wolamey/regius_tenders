import React, { useEffect, useState } from "react";
import greenTheme from "../../../../assets/images/greenTheme.svg";
import greendark from "../../../../assets/images/greendark.svg";
import purpleTheme from "../../../../assets/images/purpleTheme.svg";
import purpledark from "../../../../assets/images/purpledark.svg";
import blueTheme from "../../../../assets/images/blue.svg";
import bluedark from "../../../../assets/images/blue_dark.svg";
import { useCookies } from "react-cookie";
import DayNightToggler from "../DayNightToggler/DayNightToggler";
export default function ThemeToggler({ isDark }) {
  const [cookie, setCookie] = useCookies(["theme",'isDark']);

  const handleChangeTheme = (theme) => {
    setCookie("theme", theme, {
      path: "/",
      expires: new Date("2099-12-31"),
    });
  };
  const [themes, setThemes] = useState([{
      name: "green",
      img: cookie.isDark ? greendark : greenTheme,
    },
    {
      name: "purple",
      img: cookie.isDark ? purpledark : purpleTheme,
    },
    {
      name: "blue",
      img: cookie.isDark ? bluedark : blueTheme,
    },]);




useEffect(() => {
  // console.log(isDark)
  setThemes([
    {
      name: "green",
      img: cookie.isDark ? greendark : greenTheme,
    },
    {
      name: "purple",
      img: cookie.isDark ? purpledark : purpleTheme,
    },
    {
      name: "blue",
      img: cookie.isDark ? bluedark : blueTheme,
    },
  ]);
}, [cookie.isDark]);


  const bodyTag = document.querySelector("body");

  useEffect(() => {
    themes.map((item) => {
      if (bodyTag.classList.contains(item.name)) {
        bodyTag.classList.remove(item.name);
      }
    });
    bodyTag.classList.add(cookie.theme);
  }, [cookie.theme]);

  useEffect(() => {
    if (!cookie.theme)
      setCookie("theme", "blue", {
        path: "/",
        expires: new Date("2099-12-31"),
      })
  },[]);


  useEffect(() => {
    bodyTag.classList.add(cookie.theme);
  
  },[cookie.isDark]);


  return (
    <div className="p-3 rounded-lg gap-[30px]  flex flex-col col-span-2 w-full gap-2 bg-[var(--bg2)] ">
      <div className="flex gap-1 justify-between">
        <p className=" text-3xl font-medium ">Выберите тему:</p>

      </div>
      <div className="flex gap-2 flex-wrap">
        {themes.map((item, index) => (
          <img
            key={index}
            src={item.img}
            className={`${
              cookie.theme === item.name
                ? "border-[var(--main)]"
                : " border-transparent hover:shadow-[0px_0px_11px_5px_rgba(34,_60,_80,_0.09)]"
            }   border-2  rounded-lg cursor-pointer shadow-[0px_0px_11px_5px_rgba(34,_60,_80,_0.02)] `}
            alt=""
            onClick={() => handleChangeTheme(item.name)}
          />
        ))}
      </div>
    </div>
  );
}
