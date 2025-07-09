import React, { useState } from "react";
import "./Register.scss";
import InputText from "../../Components/InputText/InputText";
import ErrorPopup from "../../Components/ErrorPopup/ErrorPopup";
import Loader from "../../Components/Loader/Loader";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { notify } from "../../utils/notify";
import Marquee from "react-fast-marquee";

export default function Register() {
  const [error, setError] = useState("");
  const [cookies, setCookie] = useCookies(["auth_token", "user_email"]);
  const navigate = useNavigate();
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
    // console.log(formData);
    try {
      const response = await fetch(
        "https://tendersiteapi.dev.regiuslab.by/v1/user/register",
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
             setCookie("refresh_token", data.refresh_token, {
          path: "/regius_tenders",
          maxAge: 86400,
        });
        navigate("/");
      } else {
        // setError("Ошибка регистрации: " + data.detail);

            notify({
            title: "Ошибка",
            message: "Ошибка регистрации: " + data.detail,
            type: "danger",
          });
      }
    } catch (err) {
      // setError("Ошибка регистрации ");

         notify({
            title: "Ошибка",
            message: "Ошибка регистрации ",
            type: "danger",
          });
      
    } finally {
      setLoading(false);
    }
  };
  const backDeco = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  return (
    <div className="auth flex h-screen w-screen overflow-hidden relative">
      {error !== "" && <ErrorPopup errText={error} setError={setError} />}
      {loading && <Loader isFull={true} />}
       <div className=" z-0 w-screen absolute text-[#D2E3C8] text-[300px] md:text-[200px]  lg:text-[300px]  max-[768px]:text-[100px] font-black leading-60 md:leading-40 lg:leading-60 max-[768px]:leading-20 transform-[translate(-50%,-50%)]  top-[50%] left-[50%]  ">
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
            className="button auth_submit w-fit m-auto pl-[40px] pr-[40px] pt-[20px] pb-[20px] bg-[#93A188] border-2  border-transparent cursor-pointer rounded-md text-white uppercase text-xl hover:bg-transparent hover:border-2 hover:border-[#93A188] hover:text-[#93A188] big-button"
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
