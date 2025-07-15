import React, { useEffect } from "react";
import { useState } from "react";
import "./Auth.scss";
import ErrorPopup from "../../Components/ErrorPopup/ErrorPopup";
import Loader from "../../Components/Loader/Loader";
import Marquee from "react-fast-marquee";
import { data, Link, useNavigate } from "react-router-dom";
import InputText from "../../Components/InputText/InputText";
import { useCookies } from "react-cookie";
import { notify } from "../../utils/notify";
export default function Auth() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "auth_token",
    "user_email",
    "theme",
    "isDark",
  ]);
  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    // console.log(formData);
    try {
      const response = await fetch(
        "https://tendersiteapi.dev.regiuslab.by/v1/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCookie("auth_token", data.access_token, {
          path: "/regius_tenders",
          maxAge: 3600,
        });
        setCookie("refresh_token", data.refresh_token, {
          path: "/regius_tenders",
          maxAge: 86400,
        });
        navigate("/");
      } else {
        notify({
          title: "Ошибка",
          message: "Ошибка авторизации: " + data.detail,
          type: "danger",
        });
      }
    } catch (err) {
      notify({
        title: "Ошибка",
        message: "Ошибка авторизации  " + data.detail,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const backDeco = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  const themes = [
    {
      name: "green",
    },
    {
      name: "purple",
    },
    {
      name: "",
      img: "",
    },
  ];

  const bodyTag = document.querySelector("body");
  useEffect(() => {
    themes.map((item) => {
      if (bodyTag.classList.contains(item.name)) {
        bodyTag.classList.remove(item.name);
      }
    });
    bodyTag.classList.add(cookies.theme);
  }, [cookies.theme]);
  useEffect(() => {
    if (!cookies.theme)
      setCookie("theme", "green", {
        path: "/",
        expires: new Date("2099-12-31"),
      });
  });
  useEffect(() => {
    if (cookies.isDark) {
      bodyTag.classList.remove("light");
      bodyTag.classList.add("dark");
    } else {
      bodyTag.classList.remove("dark");
      bodyTag.classList.add("light");
    }
  });

  return (
    <div className="auth flex h-screen w-screen overflow-hidden relative ">
      {error !== "" && <ErrorPopup errText={error} setError={setError} />}
      {loading && <Loader isFull={true} />}
      <div className=" z-0 w-screen absolute text-[var(--bg2)] text-[300px] md:text-[200px]  lg:text-[300px]  max-[768px]:text-[100px] font-black leading-60 md:leading-40 lg:leading-60 max-[768px]:leading-20 transform-[translate(-50%,-50%)]  top-[50%] left-[50%] bg-[var(--bg2)] ">
        {backDeco.map((item, index) => (
          <div key={index}>
            <Marquee
              direction={item % 2 === 0 ? "left" : "right"}
              style={{ overflow: "hidden" }}
              speed={
                item === 1
                  ? 20
                  : item === 2
                  ? 150
                  : item === 3
                  ? 90
                  : item === 4
                  ? 10
                  : 60
              }
              gradient={false}
            >
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>
              <div>9</div>
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>
              <div>9</div>
            </Marquee>
          </div>
        ))}
      </div>
      <div className="auth_container max-w-[550px] p-[30px] backdrop-blur-xs bg-white/20 rounded-2xl  m-auto w-[90%]">
        <p className="title text-6xl font-medium text-center">Вход</p>
        <form
          className="auth_form  flex flex-col mt-[30px] gap-[20px]  w-full"
          onSubmit={handleSubmit}
        >
          <InputText
            value={formData.email}
            type={"email"}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder={"Email"}
            isRequired={true}
          />

          <InputText
            value={formData.password}
            type={"password"}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder={"Пароль"}
            isRequired={true}
          />

          <input
            type="submit"
            className="button auth_submit w-fit m-auto pl-[40px] pr-[40px] pt-[20px] pb-[20px] bg-[var(--main)]/80 border-2  border-transparent cursor-pointer rounded-md text-white uppercase text-xl hover:bg-transparent hover:border-2 hover:border-[var(--main)]/80 hover:text-[var(--main)]/80 big-button"
            value={"Войти"}
          />
          <Link
            to="/register"
            className="button auth_register text-center text-[var(--main)]/80 underline hover:text-black"
          >
            Зарегистрироваться
          </Link>
        </form>
      </div>
    </div>
  );
}
