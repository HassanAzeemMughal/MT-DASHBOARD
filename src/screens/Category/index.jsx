import {
  Button,
  Card,
  Input,
  Modal,
  notification,
  Pagination,
  Spin,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import ApiService from "../../services/ApiService";
import UserColumn from "../../HelperFunction/ColumnData/UserColumn";
import CategoriesColumn from "../../HelperFunction/ColumnData/CategoriesColumn";
import { useCallback } from "react";
import { debounce } from "lodash";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async (currentPage = page, searchTerm = search) => {
    setLoading(true);
    setNotFound(false);

    try {
      const params = {
        page: currentPage,
        limit,
        name: searchTerm.trim(),
      };

      const response = await ApiService.get("/categories", params);
      if (response?.categories?.length > 0) {
        setCategoriesList(response.categories);
        setTotalPages(response.totalPages);
      } else {
        setCategoriesList([]);
        setNotFound(true);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch categories.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      fetchData(1, value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handlePageChange = (current) => {
    setPage(current);
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

  const columns = CategoriesColumn({ openDeleteModal });

  return (
    <div>
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="font-normal text-xl leading-6">Categories</h1>
            <p className="font-normal text-xs leading-4 text-text-800">
              Manage and organize all your product or content categories here.
              You can add, search, edit, or delete categories to keep your data
              structured.
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
                value={search}
                onChange={handleSearchChange}
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
            {loading ? (
              <div
                className="flex justify-center items-center"
                style={{ minHeight: "300px" }}
              >
                <Spin size="large" />
              </div>
            ) : notFound ? (
              <div
                className="flex justify-center items-center"
                style={{ minHeight: "300px", color: "#fff" }}
              >
                No categories found
              </div>
            ) : (
              <>
                <Table
                  columns={columns}
                  dataSource={categoriesList}
                  rowKey="_id"
                  pagination={false}
                  scroll={{ x: 1300 }}
                />
                <div className="flex justify-end mt-4">
                  <Pagination
                    current={page}
                    pageSize={limit}
                    total={totalPages * limit}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              </>
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
