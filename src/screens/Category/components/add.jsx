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
  const [parentCategories, setParentCategories] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useFormHandler(
      {
        title: "",
        status: "",
        description: "",
        parentCategory: "",
      },
      errors,
      setErrors
    );

  // Fetch parent categories on initial load
  useEffect(() => {
    fetchParentCategories();
  }, []);

  // Fetch parent categories from the server
  const fetchParentCategories = async () => {
    try {
      const response = await ApiService.get("/categories/parent");
      setParentCategories(response.categories || []);
    } catch (error) {
      console.error("Error fetching parent categories:", error.message);
    }
  };

  // Handle image file selection
  const handleImageUpload = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setUploadedImages((prevImages) => [...prevImages, ...fileArray]);
  };

  // Handle removing an image from the uploaded list
  const handleRemoveImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const validateForm = (formData) => {
    const formErrors = {};

    if (!formData.title) formErrors.title = "Title is required";
    if (!formData.description)
      formErrors.description = "Description is required";

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Use the validation function to get errors
    const formErrors = validateForm(formData);

    // If there are errors, set the errors state and stop form submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("parent", formData.parentCategory); // Ensure you're sending the parent category as well

    // Ensure you're sending the file under the correct field name "image"
    if (uploadedImages.length > 0) {
      const imageFile = document.getElementById("uploadInput").files[0];
      if (imageFile) {
        formDataToSend.append("image", imageFile); // The field name "image" should match the multer setup
      }
    }

    try {
      const response = await ApiService.post(
        "/categories/add",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ); // Assuming the endpoint for adding category is "/categories/add"
      if (response.success === "true") {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });

        // Fetch updated parent categories after adding the new category
        fetchParentCategories();

        // Reset form fields after successful submission
        setFormData({
          title: "",
          status: "",
          description: "",
          parentCategory: "", // Reset parent category
        });
        setUploadedImages([]); // Clear the uploaded images after successful submission
      } else if (response.success === "false") {
        notification.error({
          message: "Error",
          description: response.message,
          placement: "topRight", // Position of the notification
        });
      }
    } catch (error) {
      console.error("Error adding category:", error.message);
      const errorMessage =
        error.response?.data?.message ||
        "There was an error creating the category. Please try again.";

      notification.error({
        message: "Failed to Add Category",
        description: errorMessage,
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
          to={"/category/list"}
          className="bg-[#FFFFFF1A] px-[6px] py-2 rounded"
        >
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="font-normal text-xl leading-6">Add Category</h1>
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
                  label="Title"
                  type={"text"}
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                {errors.title && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.title}
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <SelectComponent
                  label="Parent Category"
                  name="parentCategory"
                  selectInitial="Select Parent Category"
                  value={formData.parentCategory}
                  onChange={(value) =>
                    handleSelectChange("parentCategory", value)
                  } // pass just the value (ObjectId)
                  options={parentCategories.map((cat) => ({
                    value: cat._id, // Use cat._id as the ObjectId
                    label: cat.title, // This will display the cat name in the dropdown
                  }))}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <SelectComponent
                  label="Status"
                  name="status"
                  selectInitial="Select Status"
                  value={formData.status}
                  onChange={
                    (value) => handleSelectChange("status", value) // pass just the value
                  }
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <TextAreaComponent
                  className="h-[140px]"
                  label="Write some text..."
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                {errors.description && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.description}
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <div className="card-body">
                  <div className="dropzone needsclick p-0 border-2 border-dotted border-gray-300 rounded-lg p-5 text-center">
                    <p className="h4 needsclick pt-4 mb-2">
                      Drag and drop your image here
                    </p>
                    <p className="h6 text-muted d-block font-normal mb-2">or</p>
                    <span
                      className="btn btn-primary btn-sm mb-4 bg-blue-500 text-white rounded px-4 py-2 cursor-pointer"
                      onClick={() =>
                        document.getElementById("uploadInput").click()
                      }
                    >
                      Browse Image
                    </span>
                    <input
                      id="uploadInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      multiple={false} // Ensures only one image can be selected
                    />
                  </div>
                  <div className="uploaded-images mt-4 flex flex-wrap gap-3">
                    {uploadedImages.length > 0 && (
                      <div
                        key={0}
                        className="image-preview relative"
                        style={{
                          width: "100px",
                          height: "100px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          overflow: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={uploadedImages[0]}
                          alt={`Uploaded`}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute top-0 right-0 m-1 border-0 rounded-full w-5 h-5 text-sm text-center cursor-pointer"
                          onClick={() => handleRemoveImage(0)}
                          style={{ backgroundColor: "red" }}
                        >
                          ×
                        </span>
                      </div>
                    )}
                  </div>
                </div>
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
