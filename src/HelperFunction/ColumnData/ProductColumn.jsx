import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import NoImage from "../../assets/no-image/no-image-icon.png";
import { renderImage } from "../../Utils/helper";

const ProductColumn = ({ openDeleteModal }) => {
  const navigate = useNavigate(); // Use the navigate hook here
  const backendPath = import.meta.env.VITE_BACKEND_URL;

  return [
    {
      title: "Product",
      render: (record) => (
        console.log("====== Record:", record),
        (
          <div className="flex items-center gap-2">
            <div className="w-[100px] h-[70px] overflow-hidden rounded-lg shadow-md border border-gray-300">
              {/* <img
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              src={
                record?.images[0]
                  ? `${backendPath}${record?.images[0]}`
                  : NoImage
              }
              alt="Category"
            /> */}
              {renderImage(record?.images[0]?.url)}
            </div>
            <div>
              <h1 className="text-[#FFFFFFBF] font-medium text-sm leading-4">
                {record.name}
              </h1>
              <p className="text-[#FFFFFF66] font-normal text-xs leading-3 pt-1">
                {record.email}
              </p>
            </div>
          </div>
        )
      ),
      key: "product",
    },
    {
      title: "Categories",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div>
            {record?.categories.map((cat) => {
              return (
                <h1
                  key={cat.id}
                  className="text-[#FFFFFFBF] font-medium text-sm leading-4"
                >
                  {cat.title}
                </h1>
              );
            })}
          </div>
        </div>
      ),
      key: "categories",
    },
    {
      title: "Price",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div>
            {/* Main price display */}
            <h1 className="text-white font-semibold text-lg leading-5">
              {/* Check if offerPrice exists and is a valid number */}
              {record.offerPrice && !isNaN(record.offerPrice) ? (
                <>
                  {/* If offerPrice exists, display it */}
                  {record.offerPrice.toFixed(2)}
                  {record.discount !== null &&
                    record.discount !== "" &&
                    record.discount !== undefined && (
                      <span className="text-green-600 text-sm ml-2">
                        {record.discount}%
                      </span>
                    )}

                  {/* Offer price in smaller, gray font */}
                  <p className="text-gray-400 font-normal text-xs leading-3 pt-1 line-through">
                    {record.price} {/* Original price with line-through */}
                  </p>
                </>
              ) : (
                <>
                  {/* If no offerPrice exists, display original price and discount */}
                  {record.price}
                  {record.discount !== null &&
                    record.discount !== "" &&
                    record.discount !== undefined && (
                      <span className="text-green-600 text-sm ml-2">
                        {record.discount}%
                      </span>
                    )}
                </>
              )}
            </h1>
          </div>
        </div>
      ),
      key: "price",
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
                navigate(`/product/edit/${record?._id}`);
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

export default ProductColumn;
