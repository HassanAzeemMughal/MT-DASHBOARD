import { Card, Col, notification, Row, Tag } from "antd";
import { useEffect, useState } from "react";
import Select from "react-select";
import ApiService from "../../../../../services/ApiService";

const Specification = ({
  productAttributes,
  setProductAttributes,
  customStyles,
  errors = {},
}) => {
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch attributes
  useEffect(() => {
    const fetchAttributes = async () => {
      setLoading(true);
      try {
        const response = await ApiService.get("/attributes");
        setAttributes(response.attributes || []);
      } catch {
        notification.error({
          message: "Failed to load attributes",
          description: "There was an error fetching the attributes.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, []);

  const handleAttributeChange = (attributeId) => {
    setSelectedAttribute(attributeId);
  };

  const handleValuesChange = (selectedOptions) => {
    const values = selectedOptions.map((opt) => opt.value);

    setProductAttributes((prev) => {
      const exists = prev.find((a) => a.attribute === selectedAttribute);

      if (exists) {
        return prev.map((a) =>
          a.attribute === selectedAttribute
            ? { ...a, selectedValues: values }
            : a
        );
      }

      const newEntry = {
        attribute: selectedAttribute,
        selectedValues: values,
      };
      return [...prev, newEntry];
    });
  };

  const handleRemoveValue = (attributeId, valueToRemove) => {
    setProductAttributes((prev) =>
      prev
        .map((a) =>
          a.attribute === attributeId
            ? {
                ...a,
                selectedValues: a.selectedValues.filter(
                  (v) => v !== valueToRemove
                ),
              }
            : a
        )
        .filter((a) => a.selectedValues.length > 0)
    );
  };

  const getAttributeValuesOptions = () => {
    const attr = attributes.find((a) => a._id === selectedAttribute);
    return attr ? attr.values.map((v) => ({ label: v, value: v })) : [];
  };

  return (
    <Card
      style={{
        backgroundColor: "#1f1f2e",
        borderRadius: 8,
        marginTop: 20,
      }}
    >
      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <div className="mb-4">
            <Select
              options={attributes.map((a) => ({
                value: a._id,
                label: a.name,
              }))}
              value={
                attributes
                  .map((a) => ({
                    value: a._id,
                    label: a.name,
                  }))
                  .find((opt) => opt.value === selectedAttribute) || null
              }
              onChange={(opt) => handleAttributeChange(opt?.value || "")}
              placeholder="-- Select Attribute --"
              styles={customStyles}
            />
            {errors.attribute && (
              <p className="text-red-500 text-sm mt-1">{errors.attribute}</p>
            )}
          </div>

          {selectedAttribute && (
            <div className="mb-4">
              <Select
                isMulti
                options={getAttributeValuesOptions()}
                value={
                  productAttributes
                    .find((a) => a.attribute === selectedAttribute)
                    ?.selectedValues.map((v) => ({ label: v, value: v })) || []
                }
                onChange={handleValuesChange}
                closeMenuOnSelect={false}
                placeholder="Select values"
                styles={customStyles}
              />
            </div>
          )}
        </Col>

        <Col xs={24} md={12}>
          <div>
            <h6 className="text-white mb-2">Selected Attributes:</h6>
            {productAttributes.length === 0 && (
              <p className="text-gray-400">No attributes selected yet.</p>
            )}
            {productAttributes.map((attr) => {
              const attrName =
                attributes.find((a) => a._id === attr.attribute)?.name || "";
              return (
                <div key={attr.attribute} className="mb-2">
                  <span className="text-white font-semibold">{attrName}:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {attr.selectedValues.map((val, idx) => (
                      <Tag
                        key={idx}
                        closable
                        onClose={() => handleRemoveValue(attr.attribute, val)}
                        color="blue"
                      >
                        {val}
                      </Tag>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default Specification;
