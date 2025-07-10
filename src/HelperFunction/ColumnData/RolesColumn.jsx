import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const RolesColumn = ({ openDeleteModal }) => {
  const navigate = useNavigate(); // Use the navigate hook here

  return [
    {
      title: "Role",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div>
            <p className="text-[#FFFFFFBF] font-bold text-sm leading-4 pt-1">
              {record?.name}
            </p>
          </div>
        </div>
      ),
      key: "role",
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
              onClick={() => openDeleteModal(record)} // Ensure openDeleteModal is used here
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                navigate(`/roles/edit/${record?.slug}`);
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

export default RolesColumn;
