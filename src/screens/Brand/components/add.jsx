import { Card, Col, message, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import InputComponent from "../.././../components/InputComponent/index";
import SelectComponent from "../../../components/SelectComponent";
import TextAreaComponent from "../../../components/TextAreaComponent";
import { Link } from "react-router-dom";
import ApiService from "../../../services/ApiService";
import { FaSpinner } from "react-icons/fa";
import useFormHandler from "../../../HelperFunction/FormHandler";

const Add = () => {
  const [loading, setLoading] = useState();
  const [errors, setErrors] = useState({});
  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useFormHandler(
      {
        name: "",
        status: "",
      },
      errors,
      setErrors
    );

  const validateForm = (formData) => {
    const formErrors = {};

    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.status) formErrors.status = "Status is required";

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formErrors = validateForm(formData);

    // If there are errors, set the errors state and stop form submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("status", formData.status);

    try {
      const response = await ApiService.post("/brands/add", formDataToSend);
      if (response.success === "true") {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });

        setFormData({
          name: "",
          status: "",
        });
      } else if (response.success === "false") {
        notification.error({
          message: "Error",
          description: response.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error adding brand:", error.message);
      notification.error({
        message: "Failed to Add brand",
        description: "There was an error creating the brand. Please try again.",
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
          to={"/brand/list"}
          className="bg-[#FFFFFF1A] px-[6px] py-2 rounded"
        >
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="font-normal text-xl leading-6">Add Brand</h1>
          <p className="font-normal text-xs leading-4 text-text-800">
            This is the description text that will go under the title header
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
              <Col xs={24} sm={12} md={12} lg={12}>
                <InputComponent
                  label="Name"
                  type={"text"}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.name}
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <SelectComponent
                  label="Status"
                  name="status"
                  selectInitial="Select Status"
                  value={formData.status}
                  onChange={(value) => handleSelectChange("status", value)}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
                {errors.status && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.status}
                  </div>
                )}
              </Col>
            </Row>
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
                {loading ? (
                  <FaSpinner
                    className="animate-spin"
                    style={{ marginRight: "6px" }}
                  />
                ) : null}{" "}
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
