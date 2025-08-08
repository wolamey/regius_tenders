import React from "react";

import proYear from "../../../assets/images/pro_year.png";

import proMonth from "../../../assets/images/pro_month.png";
import proHalf from "../../../assets/images/pro_half.png";
import { Link } from "react-router-dom";
export default function CurrentPlan({ plan, remaining_days }) {
  const images = [proMonth, proHalf, proYear];
  console.log(plan);
  return (
    <div>
      <p className="text-3xl font-medium mb-3">Текущий план</p>

      <div className="flex gap-2 items-start border-1 border-[var(--main)] bg-[var(--main)]/20 w-fit rounded-lg pr-7 pl-2 py-3">
        <img className="max-w-[50px]" src={images[plan.plan_id - 1]} alt="" />

        <div className="flex flex-col gap-2">
         <p className="text-[18px] ">
          {plan.plan_is_trial ? 'Пробный период' : plan.plan_name}
         </p>

          <div className="flex flex-col">
            <p className="text-xs leading-1 opacity-60 font-thin">
              Осталось дней:
            </p>
            <p className="text-[14px]">
              {remaining_days}/{plan.plan_duration_days}
            </p>
          </div>
        </div>
      </div>

      <a
        className={`block p-[7px_15px] w-fit rounded-xl text-white justify-center whitespace-nowrap
    bg-[var(--main)]/90 cursor-pointer hover:bg-[var(--main)] mt-[10px]`}
        href="/pro"
      >
        Продлить
      </a>
    </div>
  );
}
