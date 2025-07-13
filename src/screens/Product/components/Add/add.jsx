import { notification } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import ApiService from "../../../../services/ApiService";
import useFormHandler from "../../../../HelperFunction/FormHandler";
import BasicInfo from "./components/BasicInfo";
import PricingInventory from "./components/PricingInventory";
import Specification from "./components/Specification";
import Seo from "./components/Seo";

const tabs = [
  { key: "1", label: "Basic Info" },
  { key: "2", label: "Pricing & Inventory" },
  { key: "3", label: "Specifications" },
  { key: "4", label: "SEO" },
];

const Add = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [triedToNext, setTriedToNext] = useState(false);
  const [productAttributes, setProductAttributes] = useState([]);

  const initialFormData = {
    name: "",
    price: "",
    discount: "",
    deliveryTime: "",
    stock_quantity: "",
    low_stock_alert: "",
    stock: "",
    description: "",
    status: "",
    categories: [],
    seo_title: "",
    seo_keywords: "",
    seo_description: "",
  };

  const { formData, handleInputChange, handleSelectChange, setFormData } =
    useFormHandler(initialFormData, errors, setErrors);

  const getCurrentTabErrors = useCallback(() => {
    const errors = {};

    switch (activeTab) {
      case "1": // Basic Info
        if (!formData.name) errors.name = "Name is required";
        if (formData.categories.length === 0)
          errors.categories = "Category is required";
        if (!formData.deliveryTime)
          errors.deliveryTime = "Delivery Time is required";
        if (!formData.status) errors.status = "Status is required";
        // if (previewImages.length === 0)
        //   errors.images = "At least one image is required";
        break;

      case "2": // Pricing & Inventory
        if (!formData.price) errors.price = "Price is required";
        if (!formData.stock_quantity)
          errors.stock_quantity = "Stock Quantity is required";
        if (!formData.stock) errors.stock = "Stock Status is required";
        if (!formData.discount) errors.discount = "Discount is required";
        if (!formData.low_stock_alert)
          errors.low_stock_alert = "Low Stock Alert is required";
        break;

      default:
        break;
    }

    return errors;
  }, [activeTab, formData, previewImages]);

  const handleTabChange = (key) => setActiveTab(key);

  const Tab = ({ tab }) => (
    <span
      onClick={() => handleTabChange(tab.key)}
      className={`text-xs px-4 py-2 font-medium rounded-3xl leading-3 transition-colors duration-200`}
      style={{
        background:
          activeTab === tab.key
            ? "linear-gradient(258.88deg, #FF00E6 -18.44%, #00E0FF 109.8%)"
            : "transparent",
        color: activeTab === tab.key ? "white" : "#AAAAAA",
        border: activeTab === tab.key ? "none" : "1px solid #666666",
      }}
    >
      {tab.label}
    </span>
  );

  const fetchData = async () => {
    try {
      const params = {
        page: 1,
        limit: 100,
      };

      const categoryRes = await ApiService.get("/categories", params);
      // const brandsRes = await ApiService.get("/brands", params);
      // setBrands(brandsRes.brands);
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
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...imageUrls]);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextTab = () => {
    const tabErrors = getCurrentTabErrors();
    setTriedToNext(true);

    if (Object.keys(tabErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...tabErrors }));
      return;
    }

    if (activeTab < tabs.length) {
      setActiveTab(String(Number(activeTab) + 1));
      setTriedToNext(false);
    }
  };

  const handlePrevTab = () => {
    if (activeTab > 1) {
      setActiveTab(String(Number(activeTab) - 1));
      setTriedToNext(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("discount", formData.discount || 0);
    formDataToSend.append("deliveryTime", formData.deliveryTime);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("stock_quantity", formData.stock_quantity);
    formDataToSend.append("low_stock_alert", formData.low_stock_alert);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("categories", formData.categories.join(","));

    // Append attributes as JSON string
    formDataToSend.append("attributes", JSON.stringify(productAttributes));

    // Append SEO data
    formDataToSend.append("seo_title", formData.seo_title);
    formDataToSend.append("seo_keywords", formData.seo_keywords);
    formDataToSend.append("seo_description", formData.seo_description);

    uploadedImages.forEach((file) => {
      formDataToSend.append("images", file);
    });

    try {
      const response = await ApiService.post("/products/add", formDataToSend);
      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });

        setFormData(initialFormData);
        setPreviewImages([]);
        setUploadedImages([]);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
          placement: "topRight",
        });
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, errorMsg]) => {
            notification.error({
              message: `Error in ${field}`,
              description: errorMsg,
              placement: "topRight",
            });
          });
        }
      }
    } catch (error) {
      // Try to parse backend error response
      if (error.response?.data) {
        const data = error.response.data;

        notification.error({
          message: "Failed to Add product",
          description: data.message || "Something went wrong",
          placement: "topRight",
        });

        if (data.errors) {
          Object.entries(data.errors).forEach(([field, errorMsg]) => {
            notification.error({
              message: `Error in ${field}`,
              description: errorMsg,
              placement: "topRight",
            });
          });
        }
      } else {
        notification.error({
          message: "Failed to Add product",
          description:
            "There was an error creating the product. Please try again.",
          placement: "topRight",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f0f0f0",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#e1e1e1"
        : "#ffffff",
      color: state.isSelected ? "#fff" : "#000",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#007bff",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#fff",
      ":hover": {
        backgroundColor: "#ff0000",
      },
    }),
  };

  const handleCategoryChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    handleSelectChange("categories", selectedValues);
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
            Fill in the details below to add a new product to your store
            inventory.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 mt-5">
        <div className="flex items-center gap-3">
          {tabs.map((tab) => (
            <Tab key={tab.key} tab={tab} />
          ))}
        </div>
        <div>
          <Link
            to={"/attributes/add"}
            className="bg-bg-900 px-4 md:px-9 py-2 rounded text-sm hover:text-white"
          >
            Add Attributes
          </Link>
        </div>
      </div>

      <div>
        {activeTab === "1" && (
          <BasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
            errors={triedToNext ? errors : {}}
            handleSelectChange={handleSelectChange}
            handleImageUpload={handleImageUpload}
            previewImages={previewImages}
            handleRemoveImage={handleRemoveImage}
            categories={categories}
            handleCategoryChange={handleCategoryChange}
            customStyles={customStyles}
          />
        )}

        {activeTab === "2" && (
          <PricingInventory
            formData={formData}
            handleInputChange={handleInputChange}
            errors={triedToNext ? errors : {}}
            handleSelectChange={handleSelectChange}
          />
        )}

        {activeTab === "3" && (
          <Specification
            productAttributes={productAttributes}
            setProductAttributes={setProductAttributes}
            customStyles={customStyles}
            errors={errors}
          />
        )}

        {activeTab === "4" && (
          <Seo
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
      <div className="flex justify-between mt-7">
        <button
          type="button"
          onClick={handlePrevTab}
          disabled={activeTab === "1"}
          className="w-32 h-10 rounded font-semibold text-sm border border-gray-500 disabled:opacity-50"
        >
          Previous
        </button>

        {activeTab === "4" ? (
          <button
            type="button"
            onClick={handleSubmit}
            form="seo-form"
            disabled={loading}
            className="flex items-center justify-center w-32 h-10 rounded font-semibold text-sm text-white disabled:opacity-70"
            style={{
              background:
                "linear-gradient(225.2deg, #FFC700 0.18%, #FF5C00 99.82%)",
            }}
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextTab}
            className="w-32 h-10 rounded font-semibold text-sm text-white"
            style={{
              background:
                "linear-gradient(225.2deg, #FFC700 0.18%, #FF5C00 99.82%)",
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Add;
