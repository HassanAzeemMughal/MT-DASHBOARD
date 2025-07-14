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
  const [parentCategories, setParentCategories] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    // Clean up old URL
    if (uploadedImages[0]) {
      URL.revokeObjectURL(uploadedImages[0]);
    }

    // Create preview
    const fileURL = URL.createObjectURL(file);
    setUploadedImages([fileURL]);
    setImageFile(file); // Store file for later upload
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(uploadedImages[index]);
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageFile(null);
  };

  useEffect(() => {
    fetchParentCategories();
  }, []);

  const fetchParentCategories = async () => {
    try {
      const response = await ApiService.get("/categories/parent");
      setParentCategories(response.categories || []);
    } catch (error) {
      console.error("Error fetching parent categories:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.status) newErrors.status = "Status is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      let imageId = null;

      // Upload image if exists
      if (imageFile) {
        const folder = "categories";
        const response = await ApiService.uploadFile(
          "/files/upload",
          imageFile,
          folder
        );
        imageId = response.data._id;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("parent", formData.parentCategory);
      formDataToSend.append("image", imageId);

      // if (uploadedImages.length > 0) {
      //   const imageFile = document.getElementById("uploadInput").files[0];
      //   if (imageFile) {
      //     formDataToSend.append("image", imageFile);
      //   }
      // }

      const response = await ApiService.post(
        "/categories/add",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });

        fetchParentCategories();

        setFormData({
          title: "",
          status: "",
          description: "",
          parentCategory: "",
        });
        setUploadedImages([]);
        setImageFile(null);

        // Clear file input
        const fileInput = document.getElementById("uploadInput");
        if (fileInput) fileInput.value = "";
      } else {
        notification.error({
          message: "Error",
          description: response.message,
          placement: "topRight",
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
            Create and organize a new category to better structure your content
            or products.
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
                  error={errors.title}
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <SelectComponent
                  label="Parent Category"
                  name="parentCategory"
                  selectInitial="Select Parent Category"
                  value={formData.parentCategory}
                  onChange={(value) =>
                    handleSelectChange("parentCategory", value)
                  }
                  options={parentCategories.map((cat) => ({
                    value: cat._id,
                    label: cat.title,
                  }))}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
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
                  error={errors.status}
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
                      onChange={handleFileChange}
                      multiple={false}
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
