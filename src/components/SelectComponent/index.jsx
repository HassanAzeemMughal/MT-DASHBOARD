import React, { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi"; // Importing the icons

const MultiSelectComponent = ({
  label,
  selectInitial,
  name,
  options = [],
  onChange,
  value = [],
  multiple = false, // Add a multiple prop to enable multi-select
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to track if dropdown is open

  const handleToggle = (event) => {
    if (event.target.value === "") {
      setIsOpen(!isOpen);
    }
  };

  // Handle the change event and pass the selected value(s) to parent component
  const handleChange = (event) => {
    let selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    onChange(selectedValues); // Pass selected values (not the event object)
  };

  return (
    <div className="relative">
      <select
        id={name}
        name={name}
        className="select-box block rounded px-2.5 pb-2.5 pt-5 w-full text-sm text-[#FFFFFFE5] bg-text-900 dark:bg-[#000000] border-0 border-b-2 border-b-[#000000] appearance-none focus:outline-none focus:ring-0 focus:border-[#000000] dark:focus:border-[#000000] peer"
        onClick={handleToggle}
        onBlur={() => setIsOpen(false)}
        onChange={handleChange} // Use the handleChange method here
        value={value}
        multiple={multiple} // Enable multi-select if the prop is true
        {...props}
      >
        <option value="" disabled selected>
          {selectInitial}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-gray-400 peer-focus:dark:text-gray-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>

      {/* Displaying the icons and switching based on dropdown open/close state */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        {isOpen ? (
          <BiChevronUp className="text-gray-500" size={30} />
        ) : (
          <BiChevronDown className="text-gray-500" size={30} />
        )}
      </div>
    </div>
  );
};

export default MultiSelectComponent;
