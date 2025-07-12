import { Button, Card, Col, Row } from "antd";
import InputComponent from "../../../../../components/InputComponent";

import { FaPlus, FaSpinner, FaTrash, FaTrashAlt } from "react-icons/fa";

const Specification = ({
  specifications,
  handleSpecificationChange,
  handleAddSpecification,
  handleRemoveSpecification,
  errors,
}) => {
  return (
    <Card
      style={{
        backgroundColor: "#141421",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      {specifications.map((spec, index) => (
        <Row key={index} gutter={[20, 20]}>
          <Col xs={24} sm={12} md={11} lg={11}>
            <InputComponent
              label="Specification Name"
              type={"text"}
              name="specification_name"
              value={spec.specification_name}
              onChange={(e) =>
                handleSpecificationChange(index, "name", e.target.value)
              }
              error={errors.specification_name}
            />
          </Col>
          <Col xs={24} sm={12} md={11} lg={11}>
            <InputComponent
              label="Specification Value"
              type={"text"}
              name="specification_value"
              value={spec.specification_value}
              onChange={(e) =>
                handleSpecificationChange(index, "value", e.target.value)
              }
              error={errors.specification_value}
            />
          </Col>
          <Col xs={24} sm={12} md={2} lg={2}>
            <div className="text-right">
              {specifications.length > 1 && (
                <Button
                  type="primary"
                  className="h-[50px]"
                  color="danger"
                  variant="outlined"
                  onClick={() => handleRemoveSpecification(index)}
                >
                  <FaTrashAlt />
                </Button>
              )}
            </div>
          </Col>
        </Row>
      ))}
      <Button
        type="dashed"
        icon={<FaPlus />}
        onClick={handleAddSpecification}
        className="mt-4"
      >
        Add Another Specification
      </Button>
    </Card>
  );
};

export default Specification;
