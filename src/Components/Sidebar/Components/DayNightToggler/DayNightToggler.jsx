import { useCookies } from "react-cookie";
import "./style.scss";
import { useEffect } from "react";

export default function DayNightToggler() {
  const [cookie, setCookie] = useCookies(["isDark"]);

  const bodyTag = document.querySelector("body");

  useEffect(() => {
    if (cookie.isDark) {
      bodyTag.classList.remove("light");
      bodyTag.classList.add("dark");
    } else {
      bodyTag.classList.remove("dark");
      bodyTag.classList.add("light");
    }
  } );
  return (
    <div className="toggleWrapper">
      <input
        checked={cookie.isDark}
        onChange={() => setCookie("isDark", !cookie.isDark)}
        type="checkbox"
        className="dn"
        id="dn"
      />
      <label for="dn" className="toggle">
        <span className="toggle__handler">
          <span className="crater crater--1"></span>
          <span className="crater crater--2"></span>
          <span className="crater crater--3"></span>
        </span>
        <span className="star star--1"></span>
        <span className="star star--2"></span>
        <span className="star star--3"></span>
        <span className="star star--4"></span>
        <span className="star star--5"></span>
        <span className="star star--6"></span>
      </label>
    </div>
  );
}
