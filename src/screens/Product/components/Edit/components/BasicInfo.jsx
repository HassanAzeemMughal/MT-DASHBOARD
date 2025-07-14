// BasicInfo.jsx
import { Card, Col, Row } from "antd";
import Select from "react-select";
import InputComponent from "../../../../../components/InputComponent";
import TextAreaComponent from "../../../../../components/TextAreaComponent";
import SelectComponent from "../../../../../components/SelectComponent";

const BasicInfo = ({
  formData,
  handleInputChange,
  errors,
  handleSelectChange,
  handleFileChange,
  previewImages,
  handleRemoveImage,
  categories,
  handleCategoryChange,
  customStyles,
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
            label="Name"
            type={"text"}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Select
            isMulti
            className="bg-[#000000]"
            options={categories}
            value={categories.filter((cat) =>
              formData.categories.includes(cat.value)
            )}
            onChange={handleCategoryChange}
            placeholder="Select Categories"
            styles={customStyles}
          />
          {errors.categories && (
            <div className="text-red-500 text-xs mt-1">{errors.categories}</div>
          )}
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <InputComponent
            label="Delivery Time (days)"
            type="number"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleInputChange}
            error={errors.deliveryTime}
            required
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <SelectComponent
            label="Status"
            name="status"
            selectInitial="Select status"
            value={formData.status}
            onChange={(value) => handleSelectChange("status", value)}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "In Active" },
            ]}
            error={errors.status}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <TextAreaComponent
            className="h-[140px]"
            name="description"
            label={"About User..."}
            value={formData.description}
            onChange={handleInputChange}
          />
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <div className="card-body">
            <div className="dropzone needsclick p-0 border-2 border-dotted border-gray-300 rounded-lg p-5 text-center">
              <p className="h4 needsclick pt-4 mb-2">
                Drag and drop your image here
              </p>
              <p className="h6 text-muted d-block font-normal mb-2">or</p>
              <span
                className="btn btn-primary btn-sm mb-4 bg-blue-500 text-white rounded px-4 py-2 cursor-pointer"
                onClick={() => document.getElementById("uploadInput").click()}
              >
                Browse Image
              </span>
              <input
                id="uploadInput"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="uploaded-images mt-4 flex flex-wrap gap-3">
              {previewImages.map((image, index) => {
                console.log("Image URL:", image);
                return (
                  <div
                    key={index}
                    className="image-preview relative"
                    style={{
                      width: "100px",
                      height: "100px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-0 right-0 m-1 bg-white border-0 rounded-full w-5 h-5 text-sm text-center cursor-pointer"
                      onClick={() => handleRemoveImage(index)}
                      style={{ backgroundColor: "red", color: "white" }}
                    >
                      ×
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BasicInfo;
