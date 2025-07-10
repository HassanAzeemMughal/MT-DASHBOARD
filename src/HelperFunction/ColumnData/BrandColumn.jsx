import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const BrandColumn = ({ openDeleteModal }) => {
  const navigate = useNavigate(); // Use the navigate hook here

  return [
    {
      title: "Name",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-[#FFFFFFBF] font-medium text-sm leading-4">
              {record.name}
            </h1>
          </div>
        </div>
      ),
      key: "user",
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
                navigate(`/brand/edit/${record?._id}`);
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

export default BrandColumn;
