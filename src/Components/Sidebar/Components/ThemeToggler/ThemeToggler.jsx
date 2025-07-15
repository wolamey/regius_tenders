import React, { useEffect, useState } from "react";
import greenTheme from "../../../../assets/images/greenTheme.svg";
import greendark from "../../../../assets/images/greendark.svg";
import purpleTheme from "../../../../assets/images/purpleTheme.svg";
import purpledark from "../../../../assets/images/purpledark.svg";
import { useCookies } from "react-cookie";
import DayNightToggler from "../DayNightToggler/DayNightToggler";
export default function ThemeToggler({isDark}) {
  const [cookie, setCookie] = useCookies(["theme"]);

  const handleChangeTheme = (theme) => {
    setCookie("theme", theme, { path: "/", expires: new Date("2099-12-31") });
  };

  console.log(isDark)
  const themes = [
    {
      name: "green",
      img: isDark ?   greendark :  greenTheme,
    },
    {
      name: "purple",
      img:  isDark ?   purpledark :  purpleTheme,
    },
    {
      name: "",
      img: "",
    },
  ];

  const bodyTag = document.querySelector("body");

  useEffect(() => {
    themes.map(item=>{
        if (bodyTag.classList.contains(item.name) ){
            bodyTag.classList.remove(item.name)
        }
    })
    bodyTag.classList.add(cookie.theme);
  }, [cookie.theme]);


  useEffect(()=>{
    if(!cookie.theme) 
    setCookie("theme", 'green', { path: "/", expires: new Date("2099-12-31") });

  })



  return (
    <div className="p-3 rounded-lg bg-white/20 flex flex-col gap-2">
      <div className="flex gap-1 justify-between">
      <p className=" text-[14px] text-white">Выберите тему:</p>

      <DayNightToggler />

      </div>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((item, index) => (
          <img
            key={index}
            src={item.img}
            className={`${cookie.theme === item.name ? 'border-[var(--main)]' :' border-transparent hover:shadow-[0px_0px_11px_5px_rgba(34,_60,_80,_0.09)]' }  border-2  rounded-lg cursor-pointer  `}
            alt=""
            onClick={() => handleChangeTheme(item.name)}
          />
        ))}

     
      </div>
    </div>
  );
}
