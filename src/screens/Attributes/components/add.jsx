import { Button, Card, Col, message, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import InputComponent from "../../../components/InputComponent/index";
import SelectComponent from "../../../components/SelectComponent";
import TextAreaComponent from "../../../components/TextAreaComponent";
import { Link } from "react-router-dom";
import ApiService from "../../../services/ApiService";
import { FaPlus, FaSpinner, FaTrashAlt } from "react-icons/fa";
import useFormHandler from "../../../HelperFunction/FormHandler";

const Add = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { formData, handleInputChange, setFormData } = useFormHandler(
    {
      name: "",
      values: [""],
    },
    errors,
    setErrors
  );

  // Handle adding new value field
  const handleAddValue = () => {
    setFormData({
      ...formData,
      values: [...formData.values, ""],
    });
  };

  // Handle removing value field
  const handleRemoveValue = (index) => {
    if (formData.values.length <= 1) {
      message.warning("At least one value is required");
      return;
    }

    const newValues = [...formData.values];
    newValues.splice(index, 1);

    setFormData({
      ...formData,
      values: newValues,
    });
  };

  // Handle value change for specific index
  const handleValueChange = (index, value) => {
    const newValues = [...formData.values];
    newValues[index] = value;

    setFormData({
      ...formData,
      values: newValues,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";

    // Validate at least one non-empty value
    const hasValidValue = formData.values.some((val) => val.trim() !== "");
    if (!hasValidValue) newErrors.values = "At least one value is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    // Prepare data for API
    const payload = {
      name: formData.name,
      values: formData.values.filter((val) => val.trim() !== ""), // Remove empty values
    };

    try {
      const response = await ApiService.post("/attributes/add", payload);
      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });
        setFormData({ name: "", values: [""] });
        setErrors({});
      } else {
        notification.error({
          message: "Error",
          description: response.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error adding user:", error.message);
      notification.error({
        message: "Failed to Add attribute",
        description:
          "There was an error creating the attribute. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Link
          to={"/attributes/list"}
          className="bg-[#FFFFFF1A] px-[6px] py-2 rounded"
        >
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="font-normal text-xl leading-6">Add Attibutes</h1>
          <p className="font-normal text-xs leading-4 text-text-800">
            Add new attributes with multiple possible values. Use the + button
            to add more values.
          </p>
        </div>
      </div>
      <div>
        <Card
          style={{
            backgroundColor: "#141421",
            borderRadius: "8px",
            marginTop: "20px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Row gutter={[20, 20]}>
              <Col xs={24} sm={12} md={11} lg={11}>
                <InputComponent
                  label="Name"
                  type={"text"}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                />
              </Col>
              {formData.values.map((value, index) => (
                <React.Fragment key={index}>
                  <Col xs={24} sm={12} md={11} lg={11}>
                    <InputComponent
                      label={index === 0 ? "Value" : ""}
                      type={"text"}
                      value={value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      error={index === 0 ? errors.values : null}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={1} lg={1}>
                    <div className="text-right">
                      {index === 0 ? (
                        <Button
                          type="primary"
                          className="h-[50px]"
                          color="primary"
                          variant="outlined"
                          onClick={handleAddValue}
                        >
                          <FaPlus />
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          className="h-[50px]"
                          color="danger"
                          variant="outlined"
                          onClick={() => handleRemoveValue(index)}
                        >
                          <FaTrashAlt />
                        </Button>
                      )}
                    </div>
                  </Col>
                  {/* Empty column for layout */}
                  {index === 0 && <Col xs={24} sm={12} md={1} lg={1}></Col>}
                </React.Fragment>
              ))}
            </Row>
            {/* Show error if no values provided */}
            {errors.values && typeof errors.values === "string" && (
              <div className="text-red-500 text-xs mt-2 ml-4">
                {errors.values}
              </div>
            )}
            <div className="flex items-center justify-end mt-7">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-[250px] h-[50px] rounded text-text-900 font-semibold text-[14px] leading-4 hover:bg-black hover:border-black hover:text-black"
                style={{
                  background:
                    "linear-gradient(225.2deg, #FFC700 0.18%, #FF5C00 99.82%)",
                  border: "1px solid transparent",
                }}
              >
                {loading && (
                  <FaSpinner
                    className="animate-spin"
                    style={{ marginRight: "6px" }}
                  />
                )}
                Submit
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Add;
