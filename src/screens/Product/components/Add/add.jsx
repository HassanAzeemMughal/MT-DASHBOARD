import { notification } from "antd";
import React, { useCallback, useEffect, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("1");
  const [triedToNext, setTriedToNext] = useState(false);
  const [productAttributes, setProductAttributes] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [inputKey, setInputKey] = useState(0);

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
      case "1":
        if (!formData.name) errors.name = "Name is required";
        if (formData.categories.length === 0)
          errors.categories = "Category is required";
        if (!formData.deliveryTime)
          errors.deliveryTime = "Delivery Time is required";
        if (!formData.status) errors.status = "Status is required";
        break;
      case "2":
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
  }, [activeTab, formData]);

  const handleTabChange = (key) => setActiveTab(key);

  const Tab = ({ tab }) => (
    <span
      onClick={() => handleTabChange(tab.key)}
      className="text-xs px-4 py-2 font-medium rounded-3xl leading-3 transition-colors duration-200"
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
      const res = await ApiService.get("/categories", { page: 1, limit: 100 });
      setCategories(
        (res.categories || []).map((c) => ({ label: c.title, value: c._id }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) {
      alert("Only image files are allowed.");
      return;
    }
    const previews = files.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
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
    try {
      const uploadedImageIds = [];
      for (const file of imageFiles) {
        const res = await ApiService.uploadFile(
          "/files/upload",
          file,
          "products"
        );
        if (res?.data?._id) uploadedImageIds.push(res.data._id);
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, value.join(","));
        } else {
          formDataToSend.append(key, value);
        }
      });
      formDataToSend.append("attributes", JSON.stringify(productAttributes));
      formDataToSend.append("images", uploadedImageIds.join(","));

      const res = await ApiService.post("/products/add", formDataToSend);
      if (res.success) {
        notification.success({ message: "Success", description: res.message });
        setFormData(initialFormData);
        setImageFiles([]);
        setPreviewImages([]);
        setInputKey((prev) => prev + 1);
        setActiveTab("1");
        setTriedToNext(false);
      } else {
        notification.error({ message: "Error", description: res.message });
      }
    } catch (err) {
      notification.error({ message: "Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided) => ({ ...provided, backgroundColor: "#f0f0f0" }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#e1e1e1"
        : "#fff",
      color: state.isSelected ? "#fff" : "#000",
    }),
    multiValue: (provided) => ({ ...provided, backgroundColor: "#007bff" }),
    multiValueLabel: (provided) => ({ ...provided, color: "#fff" }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#fff",
      ":hover": { backgroundColor: "#ff0000" },
    }),
  };

  const handleCategoryChange = (selectedOptions) => {
    handleSelectChange(
      "categories",
      selectedOptions.map((o) => o.value)
    );
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Link
          to="/product/list"
          className="bg-[#FFFFFF1A] px-[6px] py-2 rounded"
        >
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="font-normal text-xl leading-6">Add Product</h1>
          <p className="font-normal text-xs leading-4 text-text-800">
            Fill in the details below to add a new product.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-5">
        <div className="flex items-center gap-3">
          {tabs.map((tab) => (
            <Tab key={tab.key} tab={tab} />
          ))}
        </div>
      </div>

      <div>
        {activeTab === "1" && (
          <BasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
            errors={triedToNext ? errors : {}}
            handleSelectChange={handleSelectChange}
            previewImages={previewImages}
            handleRemoveImage={handleRemoveImage}
            categories={categories}
            handleCategoryChange={handleCategoryChange}
            customStyles={customStyles}
            handleFileChange={handleFileChange}
            inputKey={inputKey}
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
          onClick={handlePrevTab}
          disabled={activeTab === "1"}
          className="w-32 h-10 rounded border border-gray-500"
        >
          Previous
        </button>

        {activeTab === "4" ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-32 h-10 rounded text-white"
            style={{
              background:
                "linear-gradient(225.2deg, #FFC700 0.18%, #FF5C00 99.82%)",
            }}
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        ) : (
          <button
            onClick={handleNextTab}
            className="w-32 h-10 rounded text-white"
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
