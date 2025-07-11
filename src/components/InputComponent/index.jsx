import React from "react";

const InputComponent = ({ label, name, type, error, ...props }) => {
  return (
    <div className="relative mb-2">
      <input
        type={type}
        id={name}
        name={name}
        className={`block rounded px-2.5 pb-2.5 pt-5 w-full text-sm text-[#FFFFFFE5] bg-text-900 dark:bg-[#000000] border-0 border-b-2 ${
          error
            ? "border-b-red-500 focus:border-red-500"
            : "border-b-[#000000] focus:border-[#000000]"
        } appearance-none focus:outline-none focus:ring-0 peer ${
          type === "date" ? "custom-date" : ""
        }`}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-gray-400 peer-focus:dark:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
      >
        {label}
      </label>
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default InputComponent;
