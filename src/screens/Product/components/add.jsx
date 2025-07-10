import { Card, Col, message, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import Select from "react-select";
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
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]); // For backend
  const [previewImages, setPreviewImages] = useState([]); // For preview

  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useFormHandler(
      {
        name: "",
        price: "",
        discount: "",
        color: [],
        size: "",
        deliveryTime: "",
        stock: "",
        description: "",
        brands: [],
        status: "",
        categories: [],
      },
      errors,
      setErrors
    );

  const fetchData = async () => {
    const params = {
      page: 1,
      limit: 100,
    };
    try {
      const categoryRes = await ApiService.get("/categories", params);
      const brandsRes = await ApiService.get("/brands", params);
      setBrands(brandsRes.brands);
      setCategories(
        (categoryRes.categories || []).map((category) => ({
          label: category.title,
          value: category._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    // Generate preview URLs
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    // Store original file objects for backend & URLs for preview
    setUploadedImages((prevImages) => [...prevImages, ...files]);
    setPreviewImages((prevPreviews) => [...prevPreviews, ...imageUrls]);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setPreviewImages((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index)
    );
  };

  const validateForm = (formData) => {
    const formErrors = {};

    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.price) formErrors.price = "Price is required";
    if (!formData.color) formErrors.color = "Color is required";
    if (!formData.size) formErrors.size = "Size is required";
    if (!formData.deliveryTime)
      formErrors.deliveryTime = "Delivery Time is required";
    if (!formData.stock) formErrors.stock = "Stock status is required";
    if (!formData.status) formErrors.status = "Status is required";
    if (!formData.categories) formErrors.categories = "Category is required";

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
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("discount", formData.discount);
    formDataToSend.append("size", formData.size);
    formDataToSend.append("deliveryTime", formData.deliveryTime);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("brands", formData.brands);
    formDataToSend.append("status", formData.status);
    formData.categories.forEach((category) => {
      formDataToSend.append("categories[]", category);
    });

    formData.color.forEach((color) => {
      formDataToSend.append("color[]", color);
    });

    uploadedImages.forEach((file) => {
      formDataToSend.append("images", file);
    });

    try {
      const response = await ApiService.post("/products/add", formDataToSend);
      if (response.success === "true") {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });

        // Reset form fields after successful submission
        setFormData({
          name: "",
          price: "",
          discount: "",
          color: "",
          size: "",
          deliveryTime: "",
          stock: "",
          description: "",
          categories: [],
          status: "",
        });
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
        description:
          "There was an error creating the product. Please try again.",
        placement: "topRight", // Position of the notification
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    const selectedCategoryValues = selectedOptions.map(
      (option) => option.value
    );
    // Set the selected categories in formData using handleSelectChange
    handleSelectChange("categories", selectedCategoryValues);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f0f0f0", // Background color of the Select box
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#e1e1e1"
        : "#ffffff", // Option background color (focused, selected, default)
      color: state.isSelected ? "#fff" : "#000", // Text color of the option
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#007bff", // Background color of selected categories
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff", // Text color for the selected categories
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#fff", // Remove button color in the multi-value
      ":hover": {
        backgroundColor: "#ff0000", // Hover color for the remove button
      },
    }),
  };

  const colorOptions = [
    { value: "#FF0000", label: "Red" },
    { value: "#00FF00", label: "Green" },
    { value: "#0000FF", label: "Blue" },
    { value: "#FFFF00", label: "Yellow" },
    { value: "#000000", label: "Black" },
    // Add more color options here
  ];

  const handleColorChange = (selectedColors) => {
    setFormData((prevState) => ({
      ...prevState,
      color: selectedColors.map((color) => color.value), // Store selected color values
    }));
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Link
          to={"/product/list"}
          className="bg-[#FFFFFF1A] px-[6px] py-2 rounded"
        >
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="font-normal text-xl leading-6">Add Product</h1>
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
              <Col xs={24} sm={12} md={8} lg={8}>
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
              <Col xs={24} sm={12} md={8} lg={8}>
                <InputComponent
                  label="Price"
                  type={"number"}
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                {errors.price && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.price}
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <InputComponent
                  label="Discount"
                  type={"number"}
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <Select
                  isMulti
                  className="bg-[#000000]"
                  name="color"
                  options={colorOptions}
                  value={colorOptions.filter((option) =>
                    formData.color.includes(option.value)
                  )}
                  onChange={handleColorChange}
                  placeholder="Select Color"
                  styles={customStyles} // Apply custom styles
                />
                {errors.color && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.color}
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <Select
                  isMulti
                  className="bg-[#000000]"
                  options={categories} // Pass categories fetched from API
                  value={categories.filter((cat) =>
                    formData.categories.includes(cat.value)
                  )} // Set currently selected categories from formData
                  onChange={handleCategoryChange} // Handle changes
                  placeholder="Select Categories"
                  styles={customStyles} // Apply custom styles
                />
                {errors.categories && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.categories}
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <SelectComponent
                  label="Size"
                  name="size"
                  selectInitial="Select Size"
                  value={formData.size}
                  onChange={
                    (value) => handleSelectChange("size", value) // pass just the value
                  }
                  options={[
                    { value: "small", label: "Small" },
                    { value: "medium", label: "Medium" },
                    { value: "large", label: "Large" },
                  ]}
                />
                {errors.size && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.size}
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <SelectComponent
                  label="Delivery Time"
                  name="deliveryTime"
                  selectInitial="Select Delivery Time"
                  value={formData.deliveryTime}
                  onChange={(value) =>
                    handleSelectChange("deliveryTime", value)
                  }
                  options={[
                    { value: "1-3", label: "1 - 3" },
                    { value: "1-5", label: "1 - 5" },
                    { value: "1-7", label: "1 - 7" },
                  ]}
                />
                {errors.deliveryTime && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.deliveryTime}
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <SelectComponent
                  label="Stock"
                  name="stock"
                  selectInitial="Select Stock"
                  value={formData.stock}
                  onChange={(value) => handleSelectChange("stock", value)}
                  options={[
                    { value: "in_stock", label: "In Stock" },
                    { value: "out-of-stock", label: "Out Of Stock" },
                  ]}
                />
                {errors.stock && (
                  <div className="invalid-feedback" style={{ color: "red" }}>
                    {errors.stock}
                  </div>
                )}
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <SelectComponent
                  label="Brand"
                  name="brands"
                  selectInitial="Select Brand"
                  value={formData.brands}
                  onChange={(value) => handleSelectChange("brands", value)}
                  options={brands.map((brand) => ({
                    value: brand._id,
                    label: brand.name,
                  }))}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
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
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <div className="uploaded-images mt-4 flex flex-wrap gap-3">
                    {previewImages.map((image, index) => (
                      <div
                        key={index}
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
                          src={image}
                          alt={`Uploaded ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute top-0 right-0 m-1 bg-white border-0 rounded-full w-5 h-5 text-sm text-center cursor-pointer"
                          onClick={() => handleRemoveImage(index)}
                          style={{ backgroundColor: "red" }}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <TextAreaComponent
                  className="h-[140px]"
                  name="description"
                  label={"About User..."}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={8}>
                <SelectComponent
                  label="Status"
                  name="status"
                  selectInitial="Select status"
                  value={formData.status}
                  onChange={(value) => handleSelectChange("status", value)}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "In Active" },
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
