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
import React, { useCallback, useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import ApiService from "../../services/ApiService";
import UserColumn from "../../HelperFunction/ColumnData/UserColumn";
import debounce from "lodash/debounce";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
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
      const res = await ApiService.get("/auth", params);

      if (res?.users?.length > 0) {
        setUsers(res.users);
        setTotalPages(res.totalPages);
      } else {
        setUsers([]);
        setNotFound(true);
      }
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Failed to fetch users.",
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

  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const res = await ApiService.del(`/auth/user/delete/${deletingUser._id}`);
      if (res.success) {
        notification.success({
          message: "Deleted",
          description: res.message || "User deleted successfully.",
        });
        fetchData();
      } else {
        notification.error({
          message: "Failed",
          description: res.message || "Failed to delete user.",
        });
      }
    } catch {
      notification.error({
        message: "Error",
        description:
          err?.response?.data?.message ||
          "Failed to delete user due to server error.",
      });
    } finally {
      setDeleteModalVisible(false);
      setDeletingUser(null);
    }
  };

  const columns = UserColumn({ openDeleteModal });

  return (
    <div>
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="font-normal text-xl leading-6">Users</h1>
            <p className="font-normal text-xs leading-4 text-text-800">
              View and manage all registered users of the system. Use the search
              bar to find specific users or add a new one.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <Link
                to={"/users/add"}
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
                No users found
              </div>
            ) : (
              <>
                <Table
                  columns={columns}
                  dataSource={users}
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
          open={deleteModalVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText="Yes, Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <p>
            Are you sure you want to delete{" "}
            <strong>{deletingUser?.firstName}</strong>?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default Index;
