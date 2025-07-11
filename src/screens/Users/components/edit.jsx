import { Card, Col, message, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import InputComponent from "../../../components/InputComponent/index";
import SelectComponent from "../../../components/SelectComponent";
import TextAreaComponent from "../../../components/TextAreaComponent";
import { Link, useParams } from "react-router-dom";
import ApiService from "../../../services/ApiService";
import { FaSpinner } from "react-icons/fa";
import useFormHandler from "../../../HelperFunction/FormHandler";
import { useDispatch, useSelector } from "react-redux";
import { getReducer } from "../../../redux/reducer";

const Edit = () => {
  const loginUser = useSelector((state) => state.userInfo.data);
  const dispatch = useDispatch();
  const setToken = getReducer("token");
  const setUpdateLoginData = getReducer("userInfo");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [userData, setUserData] = useState(null);
  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useFormHandler({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dob: "",
      selectedRole: "",
      selectedStatus: "",
    });
  const { id } = useParams();

  // Fetch the available roles
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

  // Fetch user data by ID to pre-fill the form
  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const response = await ApiService.get(`/auth/${id}`);
          if (response.success === "true") {
            const user = response.user;
            setUserData(user);

            // Format the dob to YYYY-MM-DD
            const formattedDob = user.dob
              ? new Date(user.dob).toISOString().split("T")[0]
              : "";

            setFormData({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              password: "", // Keep password empty for security
              dob: formattedDob, // Set formatted DOB
              selectedRole: user.role,
              selectedStatus: user.status,
            });
          } else {
            notification.error({
              message: "Error",
              description: response.message,
              placement: "topRight",
            });
          }
        } catch (error) {
          console.error("Error fetching user data", error);
          notification.error({
            message: "Failed to load user data",
            description:
              "There was an error fetching the user data. Please try again.",
            placement: "topRight",
          });
        }
      };
      fetchUserData();
    }
  }, [id]);

  // Handle form submission
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
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }

    try {
      const response = await ApiService.put(
        `/auth/user/update/${id}`,
        formDataToSend
      );
      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message || "User updated successfully",
          placement: "topRight",
        });

        console.log("Updated user:", response);

        // 🔷 Check if editing own profile
        if (loginUser?._id === id) {
          const updatedUser = {
            ...loginUser,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            dob: response.user.dob,
            role: response.user.role,
            status: response.user.status,
            photo: response.user.photo,
          };

          dispatch(setUpdateLoginData(updatedUser));

          console.log("Updated user info in localStorage:", updatedUser);
        }
      } else {
        const description = Array.isArray(response.errors)
          ? response.errors.join(", ")
          : response.message || "Update failed";

        notification.error({
          message: "Error",
          description,
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error adding user:", error.message);
      notification.error({
        message: "Failed to update user",
        description: error.message || "An unexpected error occurred.",
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
          to={"/users/list"}
          className="bg-[#FFFFFF1A] px-[6px] py-2 rounded"
        >
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="font-normal text-xl leading-6">Update User</h1>
          <p className="font-normal text-xs leading-4 text-text-800">
            Update an existing user’s information, including personal details,
            role, status, and profile image.
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
                  onChange={(value) =>
                    handleSelectChange("selectedStatus", value)
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
                  value={formData.selectedRole}
                  onChange={(value) =>
                    handleSelectChange("selectedRole", value)
                  }
                  options={roles.map((role) => ({
                    value: role._id, // Use role._id as the ObjectId
                    label: role.name, // This will display the role name in the dropdown
                  }))}
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
                Update
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Edit;
