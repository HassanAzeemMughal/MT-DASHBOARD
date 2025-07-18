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
import { renderImage } from "../../../Utils/helper";

const Edit = () => {
  const backendPath = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null); // For new image preview
  const [imageFile, setImageFile] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false); // Flag to remove exist

  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useFormHandler({
      title: "",
      parentCategory: "",
      status: "",
      description: "",
      image: null,
    });
  const { id } = useParams();

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

  useEffect(() => {
    if (id) {
      const fetchCategoryData = async () => {
        try {
          const response = await ApiService.get(`/categories/edit/${id}`);
          if (response.success) {
            const category = response.category;
            setFormData({
              title: category.title,
              parentCategory: category.parent ? category.parent._id : "",
              status: category.status || "inactive",
              description: category.description,
              image: category.image,
            });
          } else {
            notification.error({
              message: "Error",
              description: response.message,
              placement: "topRight",
            });
          }
        } catch (error) {
          console.error("Error fetching category data", error);
          notification.error({
            message: "Failed to load category data",
            description:
              error.message ||
              "There was an error fetching the category data. Please try again.",

            placement: "topRight",
          });
        }
      };
      fetchCategoryData();
    }
  }, [id]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    // Clean up old preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create preview and store file
    const fileURL = URL.createObjectURL(file);
    setPreviewUrl(fileURL);
    setImageFile(file);

    // Clear remove flag if new image is added
    setRemoveExistingImage(false);
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      // Remove new image preview
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setImageFile(null);
    } else if (formData.image) {
      // Mark existing image for removal
      setRemoveExistingImage(true);
      setFormData((prev) => ({ ...prev, image: null }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageId = null;

      // Handle image scenarios:
      if (imageFile) {
        // Upload new image
        const folder = "categories";
        const response = await ApiService.uploadFile(
          "/files/upload",
          imageFile,
          folder
        );
        imageId = response.data._id;
      } else if (!removeExistingImage && formData.image) {
        // Keep existing image
        imageId = formData.image._id;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("parent", formData.parentCategory); // Ensure you're sending the parent category as well
      if (imageId !== null) {
        formDataToSend.append("image", imageId);
      } else if (removeExistingImage) {
        // Explicitly send null to remove image
        formDataToSend.append("image", "null");
      }
      // Ensure you're sending the file under the correct field name "image"
      // if (uploadedImages.length > 0) {
      //   const imageFile = document.getElementById("uploadInput").files[0];
      //   if (imageFile) {
      //     formDataToSend.append("image", imageFile); // The field name "image" should match the multer setup
      //   }
      // }

      const response = await ApiService.put(
        `/categories/${id}`,
        formDataToSend
      );
      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });
        // Reset image states
        setPreviewUrl(null);
        setImageFile(null);
        setRemoveExistingImage(false);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error adding category:", error.message);
      notification.error({
        message: "Failed to Update category",
        description:
          error.message ||
          "There was an error updating the category. Please try again.",

        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log("======formData", formData.image);

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
          <h1 className="font-normal text-xl leading-6">Update Category</h1>
          <p className="font-normal text-xs leading-4 text-text-800">
            Update the category details below. Make sure to fill in all required
            fields before saving your changes.
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
                  value={formData.status} // Ensure this uses formData.status, not selectedStatus
                  onChange={(value) => handleSelectChange("status", value)} // Pass "status" as the name
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <TextAreaComponent
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
                      multiple={false} // Ensures only one image can be selected
                    />
                  </div>
                  <div className="uploaded-images mt-4 flex flex-wrap gap-3">
                    {previewUrl || (formData.image && !removeExistingImage) ? (
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
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          renderImage(formData.image.url)
                        )}

                        <span
                          className="absolute top-0 right-0 m-1 border-0 rounded-full w-5 h-5 text-sm text-center cursor-pointer"
                          onClick={handleRemoveImage}
                          style={{ backgroundColor: "red" }}
                        >
                          ×
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Col>
            </Row>
            <div className="flex items-center justify-end mt-7">
              <button
                type="submit"
                disabled={loading}
                // className="flex items-center justify-center w-[250px] h-[50px] rounded text-text-900 font-semibold text-[14px] leading-4 hover:bg-black hover:border-black hover:text-black"
                className={`flex items-center justify-center w-[250px] h-[50px] rounded text-text-900 font-semibold text-[14px] leading-4 
                  ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-black hover:border-black hover:text-black"
                  }`}
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
