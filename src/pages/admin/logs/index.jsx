import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { Row, Col, message, Space } from "antd";
import { MyButton } from "../../../comp";
import dayjs from 'dayjs';

import {
  Breadcrumb,
  Layout,
  Card,
  Form,
  DatePicker,
  Select,
} from "antd";

import { HomeOutlined } from "@ant-design/icons";
import PsContext from "../../../context";
import {
  PaginatedTable,
  FormItem,
} from "../../../comp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirst } from "../../../utils";

const Logs = (props) => {
  const context = useContext(PsContext);
const {userId}=useParams();
  const { Content } = Layout;
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [curAction, setCurAction] = useState("list");
  const [isModal] = useState(false);
  const [categories, setcategories] = useState([]);
  const [action, setaction] = useState([]);
  const [reference, setreference] = useState([]);
  const [viewOrEditData, setViewOrEditData] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);
  const filterColumns = useRef([
    " date(log_time)>='" + dayjs().format("YYYY-MM-DD") + "'",
    " date(log_time)>='" + dayjs().format("YYYY-MM-DD") + "'",
  ]);
  useEffect(() => {
    LoadCategories();

    searchForm.setFieldsValue({ log_dates: [dayjs(), dayjs()] });
  }, []);

  const tableColumns = [
    {
      title: "S.No",
      dataIndex: "row_num",
      key: "row_num",
      //render: (item) => <strong>{item}</strong>,
    },
    {
      title: "Log Name",
      dataIndex: "log_name",
      key: "log_name",
      //render: (item) => <strong>{item}</strong>,
    },
    {
      title: "Date",
      // dataIndex: 'msg_date',
      key: "log_time",
      render: (item) => (
        <>{dayjs(item.log_time).format("DD/MM/YYYY h:mm a")}</>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];
  const onViewClick = (item) => {
    setViewOrEditData(item);
    setVisibleModal(true);
  };
  const onFinishSearch = (values) => {
    var filter_clauses = [];
    filter_clauses.push(
      " date(log_time)>='" +
        dayjs(values.log_dates[0]).format("YYYY-MM-DD") +
        "'"
    );
    filter_clauses.push(
      " date(log_time)<='" +
        dayjs(values.log_dates[1]).format("YYYY-MM-DD") +
        "'"
    );
    if (values.action) filter_clauses.push(" log_name='" + values.action + "'");
    if (values.action_by)
      filter_clauses.push(" logged_type='" + values.action_by + "'");
    if (values.reference)
      filter_clauses.push(" logged_by='" + values.reference + "'");

    filterColumns.current = filter_clauses;
    setRefreshTable((prev) => prev + 1);
  };
  const onChangeDate = (dates) => {
    searchForm.setFieldsValue({ msg_dates: dates });
  };
  const LoadCategories = () => {
    var reqData = {
      query_type: "query", //query_type=insert | update | delete | query
      query:
        "select id,resource_name,permission_types from application_resources where status=1",
    };
    context.psGlobal
      .apiRequest(reqData, context.adminUser(userId).mode)
      .then((res) => {
        setcategories(res);
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const oncategoriesChange = (value) => {
    var categoryData = categories.find((item) => item.resource_name === value);
    var curActions =
      categoryData &&
      categoryData.permission_types &&
      categoryData.permission_types.split(",");
    //console.log(curAction,categories);
    setaction(curActions);
  };

  const onactionChange = (value) => {
    if (value.toString() !== "admin") {
      var query = "";
      if (value.toString() === "employee")
        query =
          "select id,name from employees where status=1 and employee_status='Active'";
      else if (value.toString() === "broker")
        query =
          "select id,name from brokers where status=1 and broker_status='Active'";
      else if (value.toString() === "franchise")
        query =
          "select id,name from franchise where status=1 and franchise_status='Active'";
      var reqData = {
        query_type: "query", //query_type=insert | update | delete | query
        query: query,
      };
      console.log(value, query);
      context.psGlobal
        .apiRequest(reqData, context.adminUser(userId).mode)
        .then((res) => {
          setreference(res);
        })
        .catch((err) => {
          message.error(err);
        });
    }
  };
  return (
    <>
      <Content
        className="site-layout-background"
        style={{
          padding: "5px 24px 0px 24px",
          margin: 0,
        }}
      >
        <Breadcrumb style={{ margin: "0", padding: "8px 0px 8px 0px" }}>
          <Breadcrumb.Item href="">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>Logs</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Logs Report</Breadcrumb.Item>
        </Breadcrumb>

        <Card title="Logs Report">
          <Form
            name="basic"
            form={searchForm}
            labelAlign="left"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ remember: true }}
            onFinish={onFinishSearch}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col className="gutter-row" xs={24} xl={20}>
                <Row>
                  <Col className="gutter-row" xs={24} xl={12}>
                    <FormItem
                      label="Date"
                      name="log_dates"
                      // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                    >
                      <Space direction="vertical">
                        <DatePicker.RangePicker
                          onChange={onChangeDate}
                          defaultValue={[dayjs(), dayjs()]}
                          format="DD/MM/YYYY"
                          allowClear={false}
                        />
                      </Space>
                    </FormItem>
                  </Col>

                  <Col className="gutter-row" xs={24} xl={12}>
                    <FormItem label="Categories" name="resource_name">
                      <Select
                        showSearch
                        placeholder="Categories"
                        onChange={oncategoriesChange}
                        optionFilterProp="children"
                        //onChange={designationIdOnChange}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {categories.map((item) => {
                          return (
                            <Select.Option value={item.resource_name}>
                              {capitalizeFirst(
                                item.resource_name.replace("-", " ")
                              )}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col className="gutter-row" xs={24} xl={8}>
                    <FormItem
                      label="Action"
                      name="action"
                      //   rules={[{ required: true, message: "Please Enter Action" }]}
                    >
                      <Select
                        showSearch
                        placeholder="Action"
                        optionFilterProp="children"
                        //onChange={designationIdOnChange}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {action.map((item) => {
                          return (
                            <Select.Option value={item}>
                              {capitalizeFirst(item.replace("-", " "))}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col className="gutter-row" xs={24} xl={8}>
                    <FormItem
                      label="Action By"
                      name="action_by"

                      //rules={[{ required: true, message: 'Please Enter Branch Name' }]}
                    >
                      <Select
                        showSearch
                        placeholder="Action By"
                        onChange={onactionChange}
                        optionFilterProp="children"
                        //onChange={genderOnChange}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {context.psGlobal.collectionOptions(
                          context.psGlobal.collectionData,
                          "user-types"
                        )}
                      </Select>
                    </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={24} xl={8}>
                    <FormItem
                      label="Reference"
                      name="reference"
                      //rules={[{ required: true, message: 'Please Enter Branch Status' }]}
                    >
                      <Select
                        showSearch
                        placeholder="Reference"
                        optionFilterProp="children"
                        //onChange={designationIdOnChange}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {reference.map((item) => {
                          return (
                            <Select.Option value={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
            
                </Row>
              </Col>
              <Col className="gutter-row" xs={24} xl={4}>
             <Row style={{marginTop:'18%',marginLeft:'9%'}}>
             <MyButton style={{marginTop:'6%'}}
             type="primary" htmlType="submit">
                  <FontAwesomeIcon icon={faSearch} /> Search
                </MyButton>
             </Row>
              </Col>
            </Row>
          </Form>
          <PaginatedTable
            columns={tableColumns}
            refresh={refreshTable}
            countQuery={
              "select count(*) as count from logs" +
              context.psGlobal.getWhereClause(filterColumns.current, true)
            }
            listQuery={
              "select *,@rownum:=@rownum+1 as row_num from logs CROSS JOIN (SELECT @rownum:={rowNumberVar}) c " +
              context.psGlobal.getWhereClause(filterColumns.current, true)
            }
            itemsPerPage={20}
          />
        </Card>
      </Content>
    </>
  );
};
export default Logs;
