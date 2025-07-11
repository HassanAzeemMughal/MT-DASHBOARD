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
import ProductColumn from "../../HelperFunction/ColumnData/ProductColumn";
import LoaderOverlay from "../../components/LoaderOverlay/LoaderOverlay";
import { debounce } from "lodash";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async (currentPage = page, searchTerm = search) => {
    setLoading(true);
    setNotFound(false);

    const params = {
      page: currentPage,
      limit,
      name: searchTerm.trim(),
    };
    try {
      const response = await ApiService.get("/products", params);

      if (response?.products?.length > 0) {
        setProductList(response.products);
        setTotalPages(response.totalPages);
      } else {
        setProductList([]);
        setNotFound(true);
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch products.",
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

  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await ApiService.del(
        `/products/delete/${deletingProduct._id}`
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
        message: "Failed to delete product",
        description: "There was an error deleting the product.",
        placement: "topRight",
      });
    } finally {
      setIsDeleteModalVisible(false);
      setDeletingProduct(null);
    }
  };

  const columns = ProductColumn({ openDeleteModal });

  return (
    <div>
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="font-normal text-xl leading-6">Product</h1>
            <p className="font-normal text-xs leading-4 text-text-800">
              Manage and view all your products here. You can search, add, edit,
              or delete products from the list below.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <Link
                to={"/product/add"}
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
                No products found
              </div>
            ) : (
              <>
                <Table
                  columns={columns}
                  dataSource={productList}
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
            <strong>{deletingProduct?.name}</strong>?
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default Index;
