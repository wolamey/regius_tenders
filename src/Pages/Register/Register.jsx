import React, { useState } from "react";
import "./Register.scss";
import InputText from "../../Components/InputText/InputText";
import ErrorPopup from "../../Components/ErrorPopup/ErrorPopup";
import Loader from "../../Components/Loader/Loader";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(["auth_token", "user_email"]);
const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    password: "",
    phone_number: "",
    unp: "",
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch(
        "https://tenderstest.dev.regiuslab.by/v1/user/register",
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
        setError("Ошибка регистрации: " + data.detail);
      }
    } catch (err) {
      setError("Ошибка регистрации ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth flex">
      {error !== "" && <ErrorPopup errText={error} setError={setError} />}
      {loading && <Loader isFull={true} />}
      <div className="auth_container max-w-[550px] p-[30px] backdrop-blur-xs bg-white/20 rounded-2xl  m-auto w-[90%]">
        <p className="title text-6xl font-medium text-center">Регистрация</p>
        <form
          className="auth_form  flex flex-col mt-[30px] gap-[20px]  w-full"
          onSubmit={handleSubmit}
        >
          <InputText
            value={formData.VATIN}
            isRequired={true}
            type={"text"}
            placeholder={"УНП"}
            onChange={(e) => setFormData({ ...formData, unp: e.target.value })}
          />

          <InputText
            value={formData.company_name}
            isRequired={true}
            type={"text"}
            placeholder={"Название организации"}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
          />

          <InputText
            value={formData.email}
            type={"email"}
            isRequired={true}
            placeholder={"Email"}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <InputText
            value={formData.password}
            isRequired={true}
            type={"password"}
            placeholder={"Пароль"}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <InputText
            value={formData.phone_number}
            isRequired={true}
            type={"tel"}
            placeholder={"Номер телефона"}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />

          <input
            type="submit"
            className="button auth_submit w-fit m-auto pl-[40px] pr-[40px] pt-[20px] pb-[20px] bg-[#93A188] border-2  border-transparent cursor-pointer rounded-md text-white uppercase text-xl hover:bg-transparent hover:border-2 hover:border-[#93A188] hover:text-[#93A188]"
          />

          <Link
            to="/auth"
            className="button auth_register text-center text-[#93A188] underline hover:text-black"
          >
            Войти
          </Link>
        </form>
      </div>
    </div>
  );
}
