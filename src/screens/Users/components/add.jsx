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
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useFormHandler(
      {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dob: "",
        selectedRole: "",
        selectedStatus: "",
        photo: "",
      },
      errors,
      setErrors
    );
  useEffect(() => {
    ApiService.get("/roles")
      .then((response) => setRoles(response.roles || []))
      .catch(() => {
        notification.error({
          message: "Failed to load roles",
          description: "There was an error loading roles. Please try again.",
        });
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.selectedRole) newErrors.selectedRole = "Role is required";
    if (!formData.selectedStatus)
      newErrors.selectedStatus = "Status is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("role", formData.selectedRole);
    formDataToSend.append("status", formData.selectedStatus);

    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }

    try {
      const response = await ApiService.post("/auth/user/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          dob: "",
          selectedRole: "",
          selectedStatus: "",
          photo: null,
        });
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
        message: "Failed to Add user",
        description: "There was an error creating the user. Please try again.",
        placement: "topRight", // Position of the notification
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Link
          to={"/users/list"}
          className="bg-[#FFFFFF1A] px-[6px] py-2 rounded"
        >
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="font-normal text-xl leading-6">Add User</h1>
          <p className="font-normal text-xs leading-4 text-text-800">
            Use this form to create a new user account. Make sure to enter
            accurate information for proper access and role assignment.
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
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="First Name"
                  type={"text"}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Last Name"
                  type={"text"}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Email"
                  type={"text"}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Password"
                  type={"password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                />
              </Col>

              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Date of Birth"
                  type={"date"}
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  error={errors.dob}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <SelectComponent
                  label="Status"
                  name="status"
                  selectInitial="Select Status"
                  value={formData.selectedStatus}
                  onChange={(value) =>
                    handleSelectChange("selectedStatus", value)
                  }
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                  error={errors.selectedStatus}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <SelectComponent
                  label="Role"
                  name="roles"
                  selectInitial="Select Role"
                  value={formData.selectedRole}
                  onChange={(value) =>
                    handleSelectChange("selectedRole", value)
                  } // pass just the value (ObjectId)
                  options={roles.map((role) => ({
                    value: role._id, // Use role._id as the ObjectId
                    label: role.name, // This will display the role name in the dropdown
                  }))}
                  error={errors.selectedRole}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Profile Image"
                  type="file"
                  name="photo"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      photo: e.target.files[0],
                    })
                  }
                />
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
