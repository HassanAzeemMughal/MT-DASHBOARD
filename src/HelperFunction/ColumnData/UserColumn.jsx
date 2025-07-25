import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { renderAvatar } from "../../Utils/helper";

const UserColumn = ({ openDeleteModal }) => {
  const navigate = useNavigate();

  return [
    {
      title: "User",
      render: (record) => (
        <div className="flex items-center gap-2">
          {renderAvatar(record.photo)}
          <div>
            <h1 className="text-[#FFFFFFBF] font-medium text-sm leading-4">
              {record.firstName} {record.lastName}
            </h1>
            <p className="text-[#FFFFFF66] font-normal text-xs leading-3 pt-1">
              {record.email}
            </p>
          </div>
        </div>
      ),
      key: "user",
    },
    {
      title: "Role",
      render: (record) => {
        const roleName = record.role?.name;

        return (
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[#FFFFFFBF] font-bold text-sm leading-4 pt-1">
                {roleName || "— — —"}
              </p>
            </div>
          </div>
        );
      },
      key: "role",
    },
    {
      title: "Date of Birth",
      render: (record) => {
        if (!record.dob) {
          // agar dob null ya undefined ho to ye dikhao
          return (
            <div className="flex items-center gap-2">
              <div>
                <p className="text-[#FFFFFFBF] font-bold text-sm leading-4 pt-1">
                  — — —
                </p>
              </div>
            </div>
          );
        }

        const date = new Date(record.dob);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return (
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[#FFFFFFBF] font-bold text-sm leading-4 pt-1">
                {formattedDate}
              </p>
            </div>
          </div>
        );
      },
      key: "dob",
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
                navigate(`/users/edit/${record?._id}`);
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

export default UserColumn;
