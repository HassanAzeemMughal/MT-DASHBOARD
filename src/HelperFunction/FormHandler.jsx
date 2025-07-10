import { useState } from "react";

const useFormHandler = (initialState = {}, errors, setErrors) => {
  const [formData, setFormData] = useState(initialState);

  // Handle text input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // If the field is filled, remove the error
    if (value && errors[name]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name]; // Remove the specific error for this field
        return updatedErrors;
      });
    }
  };

  // Handle select input change
  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // If the value is selected and an error exists, clear the error
    if (value && errors[name]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name]; // Remove error for this field
        return updatedErrors;
      });
    }
  };

  return {
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData,
  };
};

export default useFormHandler;
