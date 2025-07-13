import {
  Card,
  Input,
  Modal,
  notification,
  Pagination,
  Spin,
  Table,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { debounce } from "lodash";
import AttributesColumn from "../../HelperFunction/ColumnData/AttributesColumn";

const PAGE_SIZE = 10;

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [attributesToDelete, setAttributesToDelete] = useState(null);
  const [search, setSearch] = useState("");

  const fetchAttributes = async ({ page = 1, search = "" } = {}) => {
    setLoading(true);
    setNotFound(false);
    try {
      const params = { page, limit: PAGE_SIZE, name: search.trim() };
      const res = await ApiService.get("/attributes", params);

      if (res?.attributes?.length) {
        setAttributes(res.attributes);
        setTotalPages(res.totalPages ?? 1);
      } else {
        setAttributes([]);
        setNotFound(true);
      }
    } catch {
      notification.error({
        message: "Error",
        description: "Failed to fetch attributes.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes({ page, search });
  }, [page]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      fetchAttributes({ page: 1, search: value });
    }, 500),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
  };

  const handlePageChange = (current) => setPage(current);

  const openDeleteModal = (attr) => {
    setAttributesToDelete(attr);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await ApiService.del(
        `/attributes/delete/${attributesToDelete._id}`
      );

      if (response.success) {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });
        fetchAttributes();
      } else {
        notification.error({
          message: "Failed to delete attributes",
          description:
            response.message || "The attributes could not be deleted.",
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
      setAttributesToDelete(null);
    }
  };

  const columns = AttributesColumn({ openDeleteModal });

  return (
    <div>
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="font-normal text-xl leading-6">Attributes</h1>
            <p className="font-normal text-xs leading-4 text-text-800">
              View, search, and manage the list of roles in the system. You can
              add new roles, delete existing ones, or modify permissions as
              needed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <Link
                to={"/attributes/add"}
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
                No attributes found
              </div>
            ) : (
              <>
                <Table
                  columns={columns}
                  dataSource={attributes}
                  rowKey="_id"
                  pagination={false}
                  scroll={{ x: 1300 }}
                />
                <div className="flex justify-end my-4">
                  <Pagination
                    current={page}
                    pageSize={PAGE_SIZE}
                    total={totalPages * PAGE_SIZE}
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
          open={deleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText="Yes, Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to delete{" "}
            <strong>{attributesToDelete?.name}</strong>?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default Index;
