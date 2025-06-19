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
      className="auth_input w-full rounded-lg bg-white pr-[20px] pl-[20px] pt-[10px] pb-[10px] border  border-transparent
 focus-visible:border-gray-500  focus-visible:bg-gray-100/40 "
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
