import { Button, Card, Col, message, Modal, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import InputComponent from "../../../components/InputComponent/index";
import { Link, useParams } from "react-router-dom";
import ApiService from "../../../services/ApiService";
import { FaPlus, FaSpinner, FaTrashAlt } from "react-icons/fa";
import useFormHandler from "../../../HelperFunction/FormHandler";

const Edit = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [valueToDelete, setValueToDelete] = useState({
    index: null,
    value: "",
    isNew: false, // Track if value is new or existing
  });
  const [errors, setErrors] = useState({});
  const [initialValues, setInitialValues] = useState([]); // Store original values from API
  const { id } = useParams();

  const { formData, handleInputChange, setFormData } = useFormHandler(
    {
      name: "",
      values: [""],
    },
    errors,
    setErrors
  );
  // Handle adding new value field
  const handleAddValue = () => {
    setFormData({
      ...formData,
      values: [...formData.values, ""],
    });
  };

  // Handle removing value field locally
  const handleRemoveValue = (index) => {
    if (formData.values.length <= 1) {
      message.warning("At least one value is required");
      return;
    }

    const newValues = [...formData.values];
    newValues.splice(index, 1);

    setFormData({
      ...formData,
      values: newValues,
    });
  };

  // Handle value change for specific index
  const handleValueChange = (index, value) => {
    const newValues = [...formData.values];
    newValues[index] = value;

    setFormData({
      ...formData,
      values: newValues,
    });
  };

  useEffect(() => {
    const fetchAttributesData = async () => {
      try {
        const response = await ApiService.get(`/attributes/${id}`);
        if (response.success && response.data) {
          const { name, values } = response.data;
          setInitialValues(values); // Store original values
          setFormData({
            name: name,
            values: values && values.length > 0 ? values : [""],
          });
        } else {
          notification.error({
            message: "Error",
            description: response.message || "Attribute not found",
            placement: "topRight",
          });
        }
      } catch (error) {
        console.error("Error fetching attributes data", error);
        notification.error({
          message: "Failed to load attribute data",
          description: error.message,
          placement: "topRight",
        });
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchAttributesData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // Prepare data for API
    const payload = {
      name: formData.name,
      values: formData.values.filter((val) => val.trim() !== ""), // Remove empty values
    };

    try {
      const response = await ApiService.put(`/attributes/${id}`, payload);
      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message || "Attribute updated successfully",
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "Error",
          description: response.message || "Failed to update attribute",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error updating attribute:", error.message);
      notification.error({
        message: "Update Failed",
        description:
          error.response?.data?.message ||
          "An error occurred while updating the attribute.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (index, value) => {
    // Check if value exists in initial values (from database)
    const isExistingValue = initialValues.includes(value);

    if (isExistingValue) {
      // Existing value - show confirmation modal
      setValueToDelete({ index, value, isNew: false });
      setDeleteModalVisible(true);
    } else {
      // New value - remove immediately
      handleRemoveValue(index);
    }
  };

  // Handle actual deletion (for existing values)
  const handleDeleteValue = async () => {
    try {
      const response = await ApiService.del(`/attributes/value/delete`, {
        attributeId: id,
        value: valueToDelete.value,
      });

      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message || "Value deleted successfully",
          placement: "topRight",
        });

        // Update local state to remove the deleted value
        const newValues = [...formData.values];
        newValues.splice(valueToDelete.index, 1);

        // Ensure at least one value remains
        if (newValues.length === 0) {
          newValues.push("");
        }

        setFormData({
          ...formData,
          values: newValues,
        });

        // Update initial values to reflect deletion
        setInitialValues((prev) =>
          prev.filter((v) => v !== valueToDelete.value)
        );
      } else {
        notification.error({
          message: "Failed to delete value",
          description: response.message || "The value could not be deleted.",
          placement: "topRight",
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error?.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
        placement: "topRight",
      });
    } finally {
      setDeleteModalVisible(false);
      setValueToDelete({ index: null, value: "", isNew: false });
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <Link
          to={"/attributes/list"}
          className="bg-[#FFFFFF1A] px-[6px] py-2 rounded"
        >
          <IoArrowBack size={20} />
        </Link>
        <div>
          <h1 className="font-normal text-xl leading-6">Update Attribute</h1>
          <p className="font-normal text-xs leading-4 text-text-800">
            Update attribute name and values. Use the + button to add more
            values.
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
              <Col xs={24} sm={24} md={11} lg={11}>
                <InputComponent
                  label="Name"
                  type={"text"}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                />
              </Col>
              {formData.values.map((value, index) => (
                <React.Fragment key={index}>
                  <Col xs={24} sm={12} md={11} lg={11}>
                    <InputComponent
                      label={index === 0 ? "Value" : ""}
                      type={"text"}
                      value={value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      error={index === 0 ? errors.values : null}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={1} lg={1}>
                    <div className="text-right">
                      {index === 0 ? (
                        <Button
                          type="primary"
                          className="h-[50px]"
                          color="primary"
                          variant="outlined"
                          onClick={handleAddValue}
                        >
                          <FaPlus />
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          className="h-[50px]"
                          color="danger"
                          variant="outlined"
                          onClick={() => handleDeleteClick(index, value)}
                        >
                          <FaTrashAlt />
                        </Button>
                      )}
                    </div>
                  </Col>
                  {/* Empty column for layout */}
                  {index === 0 && <Col xs={24} sm={12} md={1} lg={1}></Col>}
                </React.Fragment>
              ))}
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
                {loading && <FaSpinner className="animate-spin mr-2" />}
                Update
              </button>
            </div>
          </form>
          <Modal
            title="Delete Value Confirmation"
            open={deleteModalVisible}
            onOk={handleDeleteValue}
            onCancel={() => setDeleteModalVisible(false)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <p>Are you sure you want to delete this value?</p>
            <p className="font-bold mt-2 text-lg">{valueToDelete.value}</p>
            <p className="text-red-500 mt-2">
              This action will permanently remove this value from the attribute.
            </p>
          </Modal>
        </Card>
      </div>
    </div>
  );
};

export default Edit;
