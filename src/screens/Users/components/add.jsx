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
  const [roles, setRoles] = useState([]);
  // const [imagePreview, setImagePreview] = useState(null);
  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useFormHandler({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dob: "",
      selectedRole: "",
      selectedStatus: "",
      // photo: null, // added field for photo
    });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await ApiService.get("/roles");
        setRoles(response.roles);
      } catch (error) {
        console.error("Error fetching roles", error);
        notification.error({
          message: "Failed to load roles",
          description: "There was an error loading roles. Please try again.",
          placement: "topRight",
        });
      }
    };
    fetchRoles();
  }, []);

  // Generic change handler

  // Handle file input change (image preview)
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       photo: file, // Set the selected file in formData
  //     }));

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result); // Set preview URL
  //     };
  //     reader.readAsDataURL(file); // Read the file and create a data URL
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("role", formData.selectedRole);
    formDataToSend.append("status", formData.selectedStatus);

    // if (formData.photo) {
    //   formDataToSend.append("photo", formData.photo); // The file is appended here
    // }

    try {
      const response = await ApiService.post("/auth/user/add", formDataToSend);
      if (response.success === "true") {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });
        // Reset form fields after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          dob: "",
          selectedRole: "",
          selectedStatus: "",
          // photo: null,
        });
        setImagePreview(null); // Reset preview after submission
      } else if (response.success === "false") {
        notification.error({
          message: "Error",
          description: response.message,
          placement: "topRight", // Position of the notification
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
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="First Name"
                  type={"text"}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Last Name"
                  type={"text"}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Email"
                  type={"text"}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Password"
                  type={"password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </Col>
              {/* <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Photo"
                  type={"file"}
                  name="photo"
                  onChange={handleFileChange} // Corrected handler
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      width={100}
                      height={100}
                    />
                  </div>
                )}
              </Col> */}

              <Col xs={24} sm={12} md={8} lg={6}>
                <InputComponent
                  label="Date of Birth"
                  type={"date"}
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <SelectComponent
                  label="Status"
                  name="status"
                  selectInitial="Select Status"
                  value={formData.selectedStatus}
                  onChange={
                    (value) => handleSelectChange("selectedStatus", value) // pass just the value
                  }
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <SelectComponent
                  label="Role"
                  name="roles"
                  selectInitial="Select Role"
                  value={formData.selectedRole} // This should hold the selected role id
                  onChange={(value) =>
                    handleSelectChange("selectedRole", value)
                  } // pass just the value (ObjectId)
                  options={roles.map((role) => ({
                    value: role._id, // Use role._id as the ObjectId
                    label: role.name, // This will display the role name in the dropdown
                  }))}
                />
              </Col>
            </Row>
            {/* <Row gutter={[20, 20]} className="mt-7">
              <Col xs={24}>
                <TextAreaComponent label={"About User..."} />
              </Col>
            </Row> */}
            <div className="flex items-center justify-end mt-7">
              {/* <Link
                loading={loading}
                className="flex items-center justify-center w-[250px] h-[50px] rounded text-text-900 font-semibold text-[14px] leading-4 hover:bg-black hover:border-black hover:text-black"
                style={{
                  background:
                    "linear-gradient(225.2deg, #FFC700 0.18%, #FF5C00 99.82%)",
                  border: "1px solid transparent",
                }}
              >
                Submit
              </Link> */}
              <button
                type="submit"
                disabled={loading} // Disable the button while loading
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
