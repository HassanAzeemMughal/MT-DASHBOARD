// Edit.jsx
import { notification } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { Link, useParams, useNavigate } from "react-router-dom";
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

const Edit = () => {
  const backendPath = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [triedToNext, setTriedToNext] = useState(false);
  const [productAttributes, setProductAttributes] = useState([]);

  // Image states
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

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

  // Calculate preview images
  const previewImages = useMemo(() => {
    console.log("Existing Images:", existingImages);

    const deletedUrls = new Set(imagesToDelete.map((img) => img.url));

    const existingPreviews = existingImages
      .filter((img) => !deletedUrls.has(img.url))
      .map((img) => img.url);

    const newPreviews = newImages.map((obj) => obj.preview);

    return [...existingPreviews, ...newPreviews];
  }, [existingImages, newImages, imagesToDelete]);

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
      const params = { page: 1, limit: 100 };
      const categoryRes = await ApiService.get("/categories", params);
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

  const fetchProductData = async () => {
    try {
      const response = await ApiService.get(`/products/detail/${id}`);
      if (response.success) {
        const product = response.product;
        setExistingImages(product.images || []);

        // Initialize product attributes
        if (product.attributes) {
          setProductAttributes(product.attributes);
        }

        // Initialize form data
        setFormData({
          name: product.name,
          price: product.price,
          discount: product.discount,
          deliveryTime: product.deliveryTime,
          stock_quantity: product.stock_quantity,
          low_stock_alert: product.low_stock_alert,
          stock: product.stock,
          description: product.description,
          status: product.status,
          categories: product.categories.map((c) => c._id),
          seo_title: product.seo.title || "",
          seo_keywords: product.seo?.keywords?.join(", ") || "",
          seo_description: product.seo.description || "",
        });
      }
    } catch (error) {
      notification.error({
        message: "Failed to load product data",
        description: error.message || "Please try again later",
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    fetchData();
    if (id) {
      fetchProductData();
    }

    // Clean up object URLs on unmount
    return () => {
      newImages.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [id]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).filter((f) =>
      f.type.startsWith("image/")
    );

    if (files.length === 0) {
      alert("Only image files are allowed.");
      return;
    }

    // Create preview URLs and store with files
    const imageObjects = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...imageObjects]);
  };

  const handleRemoveImage = (index) => {
    // Calculate how many existing images are visible
    const visibleExistingCount = existingImages.length - imagesToDelete.length;

    if (index < visibleExistingCount) {
      // Find the actual existing image at this position
      let actualIndex = -1;
      let count = 0;

      for (let i = 0; i < existingImages.length; i++) {
        if (!imagesToDelete.includes(existingImages[i])) {
          if (count === index) {
            actualIndex = i;
            break;
          }
          count++;
        }
      }

      if (actualIndex !== -1) {
        const imageToDelete = existingImages[actualIndex];
        setImagesToDelete((prev) => [...prev, imageToDelete]);
      }
    } else {
      // It's a new image
      const newIndex = index - visibleExistingCount;
      const removedImage = newImages[newIndex];

      // Revoke object URL to free memory
      URL.revokeObjectURL(removedImage.preview);

      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
    }
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
    e.preventDefault();
    setLoading(true);
    try {
      // Upload new images
      const uploadedImageIds = [];
      for (const imageObj of newImages) {
        const res = await ApiService.uploadFile(
          "/files/upload",
          imageObj.file,
          "products"
        );
        if (res?.data?._id) uploadedImageIds.push(res.data._id);
      }

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

      // Prepare remaining existing images
      const remainingImages = existingImages.filter(
        (img) => !imagesToDelete.includes(img)
      );

      formDataToSend.append(
        "existingImages",
        remainingImages.map((img) => img._id).join(",")
      );
      formDataToSend.append("imagesToDelete", imagesToDelete.join(","));
      formDataToSend.append("images", uploadedImageIds.join(","));

      // Append attributes
      formDataToSend.append("attributes", JSON.stringify(productAttributes));

      // Append SEO data
      formDataToSend.append("seo_title", formData.seo_title);
      formDataToSend.append("seo_keywords", formData.seo_keywords);
      formDataToSend.append("seo_description", formData.seo_description);

      const response = await ApiService.put(
        `/products/update/${id}`,
        formDataToSend
      );

      if (response.success) {
        notification.success({
          message: "Success",
          description: "Product updated successfully!",
          placement: "topRight",
        });
        navigate("/product/list");
      }
    } catch (error) {
      const res = error.response?.data;
      notification.error({
        message: res?.message || "Update failed",
        description: res?.error || "Please check your data and try again",
        placement: "topRight",
      });
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
          to="/product/list"
          className="bg-[#FFFFFF1A] px-[6px] py-2 rounded"
        >
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="font-normal text-xl leading-6">Edit Product</h1>
          <p className="font-normal text-xs leading-4 text-text-800">
            Update the product details below
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
            handleFileChange={handleFileChange}
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
            {loading ? "Saving..." : "Update"}
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

export default Edit;
