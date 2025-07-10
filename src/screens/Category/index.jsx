import { Button, Card, Input, Modal, notification, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import ApiService from "../../services/ApiService";
import UserColumn from "../../HelperFunction/ColumnData/UserColumn";
import CategoriesColumn from "../../HelperFunction/ColumnData/CategoriesColumn";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [filter, setFilter] = useState({
    title: "",
  });

  const fetchData = async () => {
    const params = {
      page: currentPage,
      limit,
      name: filter.title ? filter.title.trim() : "",
    };
    try {
      const response = await ApiService.get("/categories", params);
      setCategoriesList(response.categories || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
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

  const openDeleteModal = (category) => {
    setDeletingCategory(category);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await ApiService.del(
        `/categories/delete/${deletingCategory._id}`
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
        message: "Failed to delete category",
        description: "There was an error deleting the category.",
        placement: "topRight",
      });
    } finally {
      setIsDeleteModalVisible(false);
      setDeletingCategory(null);
    }
  };

  const columns = CategoriesColumn({ openDeleteModal }); // Use the Columns component to get the column definitions

  return (
    <div>
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="font-normal text-xl leading-6">Categories</h1>
            <p className="font-normal text-xs leading-4 text-text-800">
              This is the description text that will go under the title header
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <Link
                to={"/category/add"}
                className="bg-bg-900 px-4 md:px-9 py-2 rounded text-sm hover:text-white"
              >
                Add New
              </Link>
            </div>
            <div className="flex items-center border border-[#FFFFFF80] rounded-md px-2 py-[2px]">
              <Input
                placeholder="Search Anything..."
                name="search"
                id="title"
                className="flex-grow border-none outline-none bg-text-900 px-0 font-normal text-xs py-2 hover:bg-black"
                value={filter.title}
                onChange={(e) => updateFilter("title", e.target.value)}
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
                  dataSource={categoriesList}
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
            <strong>{deletingCategory?.title}</strong>?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default Index;
