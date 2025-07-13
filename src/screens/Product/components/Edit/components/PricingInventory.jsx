import { Card, Col, Row } from "antd";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";

import { FaSpinner } from "react-icons/fa";

const PricingInventory = ({
  formData,
  handleInputChange,
  errors,
  handleSelectChange,
}) => {
  return (
    <Card
      style={{
        backgroundColor: "#141421",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} md={12} lg={12}>
          <InputComponent
            label="Price"
            type={"number"}
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            error={errors.price}
            min="0"
            step="0.01"
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <InputComponent
            label="Discount (%)"
            type={"number"}
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            error={errors.discount}
            min="0"
            max="100"
            step="1"
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <InputComponent
            label="Stock Quantity"
            type={"number"}
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleInputChange}
            error={errors.stock_quantity}
            required
            min="0"
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <SelectComponent
            label="Stock Status"
            name="stock"
            selectInitial="Select Stock Status"
            value={formData.stock}
            onChange={(value) => handleSelectChange("stock", value)}
            options={[
              { value: "in_stock", label: "In Stock" },
              { value: "out_of_stock", label: "Out Of Stock" },
            ]}
            error={errors.stock}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <InputComponent
            label="Low Stock Alert"
            type={"number"}
            name="low_stock_alert"
            value={formData.low_stock_alert}
            onChange={handleInputChange}
            error={errors.low_stock_alert}
            min="0"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default PricingInventory;
