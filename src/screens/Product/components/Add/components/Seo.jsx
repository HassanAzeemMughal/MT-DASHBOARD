import { Button, Card, Col, Row } from "antd";
import InputComponent from "../../../../../components/InputComponent";

import { FaSpinner, FaTrashAlt } from "react-icons/fa";
import TextAreaComponent from "../../../../../components/TextAreaComponent";

const Seo = ({ formData, handleInputChange, handleSubmit }) => {
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
            label="Optimized title for search engines"
            type={"text"}
            name="seo_title"
            value={formData.seo_title}
            onChange={handleInputChange}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <InputComponent
            label="Comma-separated keywords (e.g., phone, headphone, phone case)"
            type={"text"}
            name="seo_keywords"
            value={formData.seo_keywords}
            onChange={handleInputChange}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <TextAreaComponent
            className="h-[140px]"
            name="seo_description"
            label={
              "Detailed description for search engines (160 characters recommended)"
            }
            value={formData.seo_description}
            onChange={handleInputChange}
            rows={4}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Seo;
