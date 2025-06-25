import React from "react";
import { useState } from "react";
import "./Auth.scss";
import ErrorPopup from "../../Components/ErrorPopup/ErrorPopup";
import Loader from "../../Components/Loader/Loader";
import { data, Link, useNavigate } from "react-router-dom";
import InputText from "../../Components/InputText/InputText";
import { useCookies } from "react-cookie";
export default function Auth() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [cookies, setCookie] = useCookies(["auth_token", "user_email"]);
  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    // console.log(formData);
    try {
      const response = await fetch(
        "https://tenderstest.dev.regiuslab.by/v1/user/login",
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
        setCookie("auth_token", data.access_token, { path: "/", maxAge: 3600 });
navigate('/')
      } else {
        setError("Ошибка авторизации: " + data.detail);
      }
    } catch (err) {
      setError("Ошибка авторизации 2 " + data.detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth flex">
      {error !== "" && <ErrorPopup errText={error} setError={setError} />}
      {loading && <Loader isFull={true} />}
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
            className="button auth_submit w-fit m-auto pl-[40px] pr-[40px] pt-[20px] pb-[20px] bg-[#93A188] border-2  border-transparent cursor-pointer rounded-md text-white uppercase text-xl hover:bg-transparent hover:border-2 hover:border-[#93A188] hover:text-[#93A188]"
          />
          <Link
            to="/register"
            className="button auth_register text-center text-[#93A188] underline hover:text-black"
          >
            Зарегистрироваться
          </Link>
        </form>
      </div>
    </div>
  );
}
