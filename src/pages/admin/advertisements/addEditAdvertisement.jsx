import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, message, Space } from "antd";
import { Button, Card } from "antd";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Checkbox,
  DatePicker,
} from "antd";
import { Breadcrumb, Layout, Spin } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import PsContext from "../../../context";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { Editor } from "@tinymce/tinymce-react";
import { ImageUpload, FormItem, MyButton } from "../../../comp";
import { capitalizeFirst } from "../../../utils";
import PhoneInput from "react-phone-input-2";

import moment from "moment";
const AddEditAdvertisement = (props) => {
  const context = useContext(PsContext);
  const navigate = useNavigate();
  const [addeditFormAdvertisement] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [curAction, setCurAction] = useState("add");
  const [editData, setEditData] = useState(null);
  const [heading] = useState("Advertisement");

  const [jobCountry, setJobCountry] = useState("India");
  const [jobDistricts, setJobDistricts] = useState([]);
  const [jobDistrictLoading, setJobDistrictLoading] = useState(false);
  const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
  const [editId, setEditId] = useState(null);
  const [designations, setDesignations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selDob, setSelDob] = useState(moment().subtract(18, "years"));
  const [selDoj, setSelDoj] = useState(moment());
  const [country, setCountry] = useState("India");
  const [districts, setDistricts] = useState([]);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [preferedDistrictLoading, setPreferedDistrictLoading] = useState(false);
  const [casteList, setCasteList] = useState([]);
  const [casteLoader, setCasteLoader] = useState(false);
  const [addeditFormMember] = Form.useForm();
  const [subCasteList, setSubCasteList] = useState([]);
  const [subCasteLoader, setSubCasteLoader] = useState(false);
  const [educationList, setEducationList] = useState([]);
 
  const [preferedCasteLoader, setPreferedCasteLoader] = useState(false);
  const [preferedCasteList, setPreferedCasteList] = useState([]);
  const [location, setlocation] = useState([]);
  useEffect(() => {
    LoadLocation();
    if (editIdOrObject) {
      if (typeof editIdOrObject === 'object') {
          setCurAction("edit");
          setEditId(editIdOrObject.id);
          setEditData(editIdOrObject);
          setEditValues(editIdOrObject);

      } else {
          setCurAction("edit");
          setEditId(editIdOrObject)
          loadEditData(editIdOrObject);
      }


  } else {
      setCurAction("add");
      addeditFormAdvertisement.setFieldsValue({
          ads: {
             
              active_status: 'Active',
          },
        
      });
  }
  }, []);
  const LoadLocation= () => {
    var reqData = {
        query_type: 'query', //query_type=insert | update | delete | query
        query: "select id,location from ad_locations where status=1"
    };
    console.log(reqData)
    context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
      setlocation(res);
     }).catch(err => {
        message.error(err);
    })
}
  const loadEditData = (id) => {
    setLoader(true);
    var reqData = {
      query_type: "query",
      query: "SELECT * from ads  where status=1 and id=" + id,
    };
    context.psGlobal
      .apiRequest(reqData, context.adminUser(userId).mode)
      .then((res) => {
        setEditData(res[0]);
        setEditValues(res[0]);

        setLoader(false);
      })
      .catch((err) => {
        message.error(err);
        setLoader(false);
      });
  };
 
 
  const setEditValues = (mydata) => {
    
    addeditFormAdvertisement.setFieldsValue({
      ads: {
        customer: mydata.customer,

        mobile_no: mydata.mobile_no,

        location_id: mydata.location_id,

       

        ad_image: mydata.ad_image,

        alt_text: mydata.alt_text,

        ad_url: mydata.ad_url,

      	cpc_cost: mydata.	cpc_cost,

        cpm_cost: mydata.cpm_cost,

        cpa_cost: mydata.cpa_cost,

      	ad_html: mydata.ad_html,

        ad_description: mydata.ad_description,

        budget: mydata.budget,

        active_status: mydata.active_status,
      

     
      }
      
    
    });
}

  const addeditFormAdvertisementOnFinish = (values) => {
    setLoader(true);
    var processedValues = {};
    Object.entries(values.ads).forEach(([key, value]) => {
        if (value) {
            processedValues[key] = value;
        }
    });
    if (curAction === "add") {
        var reqDataInsert = {
            query_type: 'insert',
            table: 'ads',
            values: processedValues

        };
        context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {

            setLoader(false);
            message.success(heading + ' Added Successfullly');
            onSaveFinish();

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    } else if (curAction === "edit") {
        var reqDataUpdate = {
            query_type: 'update',
            table: 'ads',
            where: { id: editId },
            values: processedValues

        };
        context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
            setLoader(false);
            message.success(heading + ' Update Successfullly');
            onSaveFinish();

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
};
 
  
 

  return (
    <>
      <Spin spinning={loader}>
        <Form
          //name="basic"
          form={addeditFormAdvertisement}
          labelAlign="left"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={addeditFormAdvertisementOnFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Customer Name"
                name={["ads", "customer"]}
                rules={[
                  { required: true, message: "Please Enter Customer Name" },
                ]}
              >
                <Input placeholder="Customer Name" />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Mobile No"
                name={["ads", "mobile_no"]}
                rules={[
                  { required: true, message: "Please Enter Mobile No" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        value &&
                        value.toString().startsWith("91") &&
                        value.toString().length < 12
                      ) {
                        return Promise.reject(
                          new Error("Invalid Indian Mobile Number")
                        );
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <PhoneInput
                  country={"in"}

                  //onChange={phone => {}}
                />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem label="Ad Location" 
              name={["ads", "location_id"]}>
                <Select
                  showSearch
                  placeholder="Ad Location"
                  optionFilterProp="children"
                  //onChange={designationIdOnChange}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {location.map((item) => {
                    return (
                      <Select.Option value={item.id}>
                        {item.location}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Ad Image"
                name={["ads", "ad_image"]}
                //  rules={[{ required: true, message: 'Please Enter Photo' }]}
              >
                <ImageUpload
                  cropRatio="1/1"
                  defaultImage={
                    editData && editData.photo ? editData.photo : null
                  }
                  storeFileName={
                    editData && editData.photo
                      ? editData.photo
                      : "public/uploads/" + new Date().valueOf() + ".jpg"
                  }
                  onFinish={(fileName) => {
                    addeditFormAdvertisement.setFieldsValue({
                      ads: {ad_image: fileName },
                    });
                  }}
                />
              </FormItem>
            </Col>

            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Alternative Text"
                name={["ads", "alt_text"]}
                rules={[{ required: true, message: "Please Enter Alt text" }]}
              >
                <Input placeholder="Alternative Text" />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Ad Url"
                name={["ads", "ad_url"]}
                rules={[{ required: true, message: "Please Enter Ad Url" }]}
              >
                <Input placeholder="Alt Urlt" />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="CPC Cost"
                name={["ads", "cpc_cost"]}
                // rules={[{ required: true, message: 'Please Enter Aadhar No' }]}
              >
                <InputNumber
                  placeholder="CPC Cost"
                  type="number"
                  style={{ width: "100%" }}
                />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="CPM Cost"
                name={["ads", "cpm_cost"]}
                // rules={[{ required: true, message: 'Please Enter Aadhar No' }]}
              >
                <InputNumber
                  placeholder="CPM Cost"
                  type="number"
                  style={{ width: "100%" }}
                />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="CPA Cost"
                name={["ads", "cpa_cost"]}
                // rules={[{ required: true, message: 'Please Enter Aadhar No' }]}
              >
                <InputNumber
                  placeholder="CPA Cost"
                  type="number"
                  style={{ width: "100%" }}
                />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Ad Content"
                name={["ads", "ad_html"]}
                rules={[{ required: true, message: "Please Enter Ad Content" }]}
              >
                <Input.TextArea rows={3} />
              </FormItem>
            </Col>

            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Ad Description"
                name={["ads", "ad_description"]}
                rules={[
                  { required: true, message: "Please Enter Ad Descripton" },
                ]}
              >
                <Input.TextArea rows={3} />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Budget"
                name={["ads", "budget"]}
                // rules={[{ required: true, message: 'Please Enter Aadhar No' }]}
              >
                <InputNumber
                  placeholder="Budget"
                  type="number"
                  style={{ width: "100%" }}
                />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Status"
                name={["ads", "active_status"]}
                rules={[{ required: true, message: "Please Enter  Status" }]}
              >
                <Radio.Group defaultValue="Active" optionType="default">
                  {context.psGlobal.collectionOptions(
                    context.psGlobal.collectionData,
                    "active-inactive",
                    "radio"
                  )}
                </Radio.Group>
              </FormItem>
            </Col>
          </Row>

          <FormItem wrapperCol={{ offset: 10, span: 24 }}>
            <Space>
              <Button size="large" type="outlined" onClick={onListClick}>
                Cancel
              </Button>
              <MyButton size="large" type="primary" htmlType="submit">
                {curAction === "edit" ? "Update" : "Submit"}
              </MyButton>
            </Space>
          </FormItem>
        </Form>
      </Spin>
    </>
  );
};
export default AddEditAdvertisement;
