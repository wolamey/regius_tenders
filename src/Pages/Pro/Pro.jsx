import React from "react";
import "./Pro.scss";
export default function Pro({ refreshToken }) {
  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-col justify-center items-center gap-4 pt-10 max-w-[90%] m-auto ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 27 25"
          fill="none"
        >
          <path
            d="M16.5493 14.1494L15.3334 10.8467C15.0587 10.1006 14.3415 9.5684 13.5 9.5684C12.6585 9.5684 11.9413 10.1006 11.6665 10.8467L10.4506 14.1494C10.1758 14.8956 9.45867 15.4278 8.61717 15.4278C7.77567 15.4278 7.05848 14.8956 6.78373 14.1494L5.76312 10.8467C5.48832 10.1006 4.77118 9.5684 3.92968 9.5684C2.85102 9.5684 1.97656 10.4428 1.97656 11.5215V21.2871C1.97656 22.3658 2.85102 23.2402 3.92968 23.2402H23.0703C24.149 23.2402 25.0234 22.3658 25.0234 21.2871V11.5215C25.0234 10.4428 24.149 9.5684 23.0703 9.5684C22.2287 9.5684 21.5116 10.1006 21.2368 10.8467L20.2162 14.1494C19.9415 14.8956 19.2243 15.4278 18.3828 15.4278C17.5412 15.4278 16.8241 14.8956 16.5493 14.1494Z"
            stroke="var(--main)"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5.8828 3.70899C5.8828 4.78765 5.00834 5.66211 3.92968 5.66211C2.85102 5.66211 1.97656 4.78765 1.97656 3.70899C1.97656 2.63033 2.85102 1.75587 3.92968 1.75587C5.00834 1.75587 5.8828 2.63033 5.8828 3.70899Z"
            stroke="var(--main)"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.4531 3.70899C15.4531 4.78765 14.5787 5.66211 13.5 5.66211C12.4213 5.66211 11.5468 4.78765 11.5468 3.70899C11.5468 2.63033 12.4213 1.75587 13.5 1.75587C14.5787 1.75587 15.4531 2.63033 15.4531 3.70899Z"
            stroke="var(--main)"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M25.0234 3.70899C25.0234 4.78765 24.149 5.66211 23.0702 5.66211C21.9915 5.66211 21.1171 4.78765 21.1171 3.70899C21.1171 2.63033 21.9915 1.75587 23.0702 1.75587C24.149 1.75587 25.0234 2.63033 25.0234 3.70899Z"
            stroke="var(--main)"
            stroke-width="2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <div className=" flex flex-col gap-2">
          <p className="text-center text-3xl">Выберите ваш премиум план</p>

          <p className="text-center opacity-50 max-w-[700px]">
            Разблокируйте весь потенциал ByTenders.by, пользуйтесь в любое время
            и с любого устройства с особым комфортом, ведь мы сделали этот
            продукт с любовью для Вас!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 max-w-[800px] m-auto w-full">
        <div className="cardP m-auto">
          <div className="cardP__shine"></div>
          <div className="cardP__glow"></div>
          <div className="cardP__content ">
            <div className="cardP__badge">NEW</div>
            <div  className="cardP__image"></div>
            <div className="cardP__text">
              <p className="cardP__title">Premium Design</p>
              <p className="cardP__description">
                Hover to reveal stunning effects
              </p>
            </div>
            <div className="cardP__footer">
              <div className="cardP__price">$49.99</div>
              <div className="cardP__button">
                <svg height="16" width="16" viewBox="0 0 24 24">
                  <path
                    stroke-width="2"
                    stroke="currentColor"
                    d="M4 12H20M12 4V20"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

           <div className="cardP m-auto scale-120">
          <div className="cardP__shine"></div>
          <div className="cardP__glow"></div>
          <div className="cardP__content">
            <div className="cardP__badge">NEW</div>
            <div  className="cardP__image"></div>
            <div className="cardP__text">
              <p className="cardP__title">Premium Design</p>
              <p className="cardP__description">
                Hover to reveal stunning effects
              </p>
            </div>
            <div className="cardP__footer">
              <div className="cardP__price">$49.99</div>
              <div className="cardP__button">
                <svg height="16" width="16" viewBox="0 0 24 24">
                  <path
                    stroke-width="2"
                    stroke="currentColor"
                    d="M4 12H20M12 4V20"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

           <div className="cardP m-auto">
          <div className="cardP__shine"></div>
          <div className="cardP__glow"></div>
          <div className="cardP__content">
            <div className="cardP__badge">NEW</div>
            <div  className="cardP__image"></div>
            <div className="cardP__text">
              <p className="cardP__title">Premium Design</p>
              <p className="cardP__description">
                Hover to reveal stunning effects
              </p>
            </div>
            <div className="cardP__footer">
              <div className="cardP__price">$49.99</div>
              <div className="cardP__button">
                <svg height="16" width="16" viewBox="0 0 24 24">
                  <path
                    stroke-width="2"
                    stroke="currentColor"
                    d="M4 12H20M12 4V20"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
