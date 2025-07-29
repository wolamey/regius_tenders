import React from "react";

export default function InputText({
  value,
  type,
  onChange,
  placeholder,
  isRequired,
}) {
  return (
    <input
      required={isRequired}
      type={type}
      className=" input_comp auth_input w-full rounded-lg bg-[var(--input)] pr-[20px] pl-[20px] pt-[10px] pb-[10px] border  border-transparent
 focus-visible:border-[var(--main)]  focus-visible:bg-[var(--main)]/10 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.1)] "
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
