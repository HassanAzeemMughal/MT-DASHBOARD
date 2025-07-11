import { useState } from "react";

/**
 * A simple form handler hook.
 *
 * @param {Object} initialState - Initial form data.
 * @param {Object} [errors] - Optional errors state.
 * @param {Function} [setErrors] - Optional setErrors function.
 */
const useFormHandler = (
  initialState = {},
  errors = {},
  setErrors = () => {}
) => {
  const [formData, setFormData] = useState(initialState);

  const clearError = (name) => {
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  return {
    formData,
    handleInputChange,
    handleSelectChange,
    setFormData,
  };
};

export default useFormHandler;
