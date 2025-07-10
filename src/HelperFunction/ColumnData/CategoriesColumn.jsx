import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import NoImage from "../../assets/no-image/no-image-icon.png";

const CategoriesColumn = ({ openDeleteModal }) => {
  const navigate = useNavigate(); // Use the navigate hook here
  const backendPath = import.meta.env.VITE_BACKEND_URL;

  return [
    {
      title: "Categories",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-[#FFFFFFBF] font-medium text-sm leading-4">
              {record.title}
            </h1>
          </div>
        </div>
      ),
      key: "categories",
    },
    {
      title: "Image",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div className="w-[100px] h-[70px] overflow-hidden rounded-lg shadow-md border border-gray-300">
            <img
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              src={record?.image ? `${backendPath}${record.image}` : NoImage}
              alt="Category"
            />
          </div>
        </div>
      ),
      key: "image",
    },
    {
      title: "Parent",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div>
            <p className="text-[#FFFFFFBF] font-bold text-sm leading-4 pt-1">
              {record.parent?.title}
            </p>
          </div>
        </div>
      ),
      key: "parent",
    },
    {
      title: "Status",
      render: (record) => {
        // Check the status and apply colors accordingly
        let statusBgColor = "";
        let statusTextColor = "";

        if (record.status === "active") {
          statusBgColor = "#34980033"; // Green background for active
          statusTextColor = "#349800"; // Green text for active
        } else if (record.status === "inactive") {
          statusBgColor = "#FE2A5D33"; // Red background for inactive
          statusTextColor = "#FE2A5D"; // Red text for inactive
        }

        return (
          <div className="">
            <span
              className="text-xs font-semibold px-[20px] py-[10px] leading-4 rounded-3xl uppercase"
              style={{
                backgroundColor: statusBgColor,
                color: statusTextColor,
              }}
            >
              {record.status}
            </span>
          </div>
        );
      },
      key: "status",
    },
    {
      title: "Action",
      render: (record) => {
        return (
          <div>
            <Button
              className="text-text-900 font-semibold text-[14px] leading-4 hover:bg-black hover:border-black hover:text-black me-3"
              style={{
                background:
                  "linear-gradient(225.2deg, #FFC700 0.18%, #FF5C00 99.82%)",
                border: "1px solid transparent",
              }}
              onClick={() => openDeleteModal(record)}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                navigate(`/category/edit/${record?._id}`);
              }}
              className="text-text-900 font-semibold text-[14px] leading-4 hover:bg-black hover:border-black hover:text-black"
              style={{
                background:
                  "linear-gradient(225.2deg, #FFC700 0.18%, #FF5C00 99.82%)",
                border: "1px solid transparent",
              }}
            >
              Edit
            </Button>
          </div>
        );
      },
      key: "action",
    },
  ];
};

export default CategoriesColumn;
