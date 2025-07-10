import { Button, Card, Input, Modal, notification, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import ApiService from "../../services/ApiService";
import BrandColumn from "../../HelperFunction/ColumnData/BrandColumn";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [brandsList, setBrandsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingBrands, setDeletingBrands] = useState(null);
  const [filter, setFilter] = useState({
    name: "",
  });

  const fetchData = async () => {
    const params = {
      page: currentPage,
      limit,
      name: filter.name ? filter.name.trim() : "",
    };
    try {
      const response = await ApiService.get("/brands", params);
      setBrandsList(response.brands || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      setIsNotfound(true);
      console.error("Error fetching brands:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, filter]);

  const updateFilter = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openDeleteModal = (brands) => {
    setDeletingBrands(brands);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await ApiService.del(
        `/brands/delete/${deletingBrands._id}`
      );
      if (response.success === "true") {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });
        fetchData();
      }
    } catch (error) {
      notification.error({
        message: "Failed to delete brands",
        description: "There was an error deleting the brands.",
        placement: "topRight",
      });
    } finally {
      setIsDeleteModalVisible(false);
      setDeletingBrands(null);
    }
  };

  const columns = BrandColumn({ openDeleteModal }); // Use the Columns component to get the column definitions

  return (
    <div>
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="font-normal text-xl leading-6">Brand</h1>
            <p className="font-normal text-xs leading-4 text-text-800">
              This is the description text that will go under the title header
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <Link
                to={"/brand/add"}
                className="bg-bg-900 px-4 md:px-9 py-2 rounded text-sm hover:text-white"
              >
                Add New
              </Link>
            </div>
            <div className="flex items-center border border-[#FFFFFF80] rounded-md px-2 py-[2px]">
              <Input
                placeholder="Search Anything..."
                name="search"
                id="name"
                className="flex-grow border-none outline-none bg-text-900 px-0 font-normal text-xs py-2 hover:bg-black"
                value={filter.name}
                onChange={(e) => updateFilter("name", e.target.value)}
              />
              <IoIosSearch size={14} className="text-[#FFFFFF80]" />
            </div>
          </div>
        </div>
        <div>
          <Card
            styles={{ body: { padding: "0 20px" } }}
            style={{
              backgroundColor: "#141421",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            {isLoading ? (
              <div
                className="flex justify-center items-center"
                style={{ minHeight: "300px" }}
              >
                <Spin size="large" />
              </div>
            ) : (
              <div
                className="table-container overflow-y-hidden"
                style={{ overflowX: "auto" }}
              >
                <Table
                  columns={columns}
                  dataSource={brandsList}
                  scroll={{ x: 1300 }}
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </Card>
        </div>
        <Modal
          title="Delete Confirmation"
          open={isDeleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Yes, Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to delete{" "}
            <strong>{deletingBrands?.name}</strong>?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default Index;
