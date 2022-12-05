import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, message, Space, Radio } from "antd";
import { MyButton } from "../../../comp";
import {
  Breadcrumb,
  Layout,
  Spin,
  Card,
  Tag,
  Modal,
  Button,
  Form,
  DatePicker,
  Input,
  Select,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import PsContext from "../../../context";
import {
  MyTable,
  DeleteButton,
  PaginatedTable,
  FormItem,
} from "../../../comp";
import { green, blue, red, cyan, grey } from "@ant-design/colors";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faUserTimes,
  faClose,
  faImage,
  faFilePdf,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirst } from "../../../utils";
import AddEditCRM from './addEditCRM';
import ViewCRM from './viewCRM';
import moment from "moment";
const CRMList = (props) => {
  const context = useContext(PsContext);
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
  const [selPlanData, setSelPlanData] = useState({})
  const [selCategory, setSelCategory] = useState({})
  const [visibleModal, setVisibleModal] = useState(false);
  const [heading] = useState('CMS');
  const [refreshTable, setRefreshTable] = useState(0);
  const [selType, setSelType] = useState('Lead');
  const [planNames, setPlanNames] = useState(null);
  const [categoryNames, setCategoryName] = useState(null);
  const { editIdOrObject, viewIdOrObject, onListClick, userId, ...other } = props;
  const filterColumns = useRef([

    // " date(log_time)>='" + moment().format("YYYY-MM-DD") + "'",
    // " date(log_time)>='" + moment().format("YYYY-MM-DD") + "'",
  ]);
  useEffect(() => {
    LoadCategories();
    loadPlanNames();
    loadCategory();


    searchForm.setFieldsValue({ case_tasks: [moment(), moment()] });
  }, []);
  const loadPlanNames = () => {
    var reqData = {
      query_type: 'query', //query_type=insert | update | delete | query

      query: "select * from employees where status=1 and employee_status='Active'"
    };
    context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
      setPlanNames(res);
    }).catch(err => {
      message.error(err);
    })
  }
  const loadCategory = () => {
    var reqData = {
      query_type: 'query', //query_type=insert | update | delete | query

      query: "select * from case_categories where status=1 and active_status='Active'"
    };
    context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
      setCategoryName(res);
    }).catch(err => {
      message.error(err);
    })
  }
  const tableColumns = [
    {
      title: "S.No",
      dataIndex: "row_number",
      key: "row_number",
      //render: (item) => <strong>{item}</strong>,
    },
    {
      title: "Case No",
      dataIndex: "case_no",
      key: "case_no",
      //render: (item) => <strong>{item}</strong>,
    },
    {
      title: "Title",
      dataIndex: 'title',
      key: "title",
      //   render: (item) => (
      //     <>{moment(item.log_time).format("DD/MM/YYYY h:mm a")}</>
      //   ),
    },
   
    {
      title: "Channel",
      dataIndex: "source_channel",
      key: "source_channel",
    },
    {
      title: "Assigned to",
      dataIndex: "assigned_to",
      key: "assigned_to",
    },
    {
      title: "customer ",
      dataIndex: "customer_id",
      key: "customer_id",
    },
    {
      title: 'Actions',
      // dataIndex: 'actions',
      key: 'actions',
      render: (item) => <Space>
        <MyButton type="outlined" size="small" shape="circle"
          onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
        <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
          onClick={() => onEditClick(item)}
        ><i class="fa-solid fa-pencil"></i></MyButton>
      

      </Space>,
    },
  ];
  const onViewClick = (item) => {
    setViewOrEditData(item);
    setVisibleModal(true);
    setCurAction("view");
    if (isModal)
      setVisibleModal(true);
  };
  const onFinishSearch = (values) => {
   
    var filter_clauses = [];
    if (values.category_name) filter_clauses.push(" category='" + values.category_name + "'");
    if (values.source_channel)
      filter_clauses.push(" source_channel='" + values.source_channel + "'");
    if (values.assigned_to) filter_clauses.push("assigned_to='" + values.assigned_to + "'");
    if (values.case_status) filter_clauses.push("case_status-'" + values.case_status + "'");

    filterColumns.current = filter_clauses;
    setRefreshTable(pre=>pre+1)
  };
  const LoadCategories = () => {
    var reqData = {
      query_type: "query", //query_type=insert | update | delete | query
      query:
        "select * from case_tasks where status=1"
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
  const onAddClick = () => {
    setCurAction("add");

    if (isModal)
      setVisibleModal(true);

  }
  const onEditClick = (item) => {
    setViewOrEditData(item);
    setCurAction("edit");

    if (isModal)
      setVisibleModal(true);

  }
  const addeditFormBranchOnFinish = (values) => {
    setLoader(true);
    var processedValues = {};
    Object.entries(values.case_tasks).forEach(([key, value]) => {
      if (value) {
        processedValues[key] = value;
      }
    });


    processedValues['name'] = selPlanData.employees_name;


    var reqDataInsert = {
      query_type: 'insert',
      table: 'case_tasks',
      values: processedValues

    };
    context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
      setLoader(false);
      message.success('Payment Made Successfullly');

    }).catch(err => {
      message.error(err);
      setLoader(false);
    })

  };
  const addeditFormCategoryOnFinish = (values) => {
    setLoader(true);
    var processedValues = {};
    Object.entries(values.case_tasks).forEach(([key, value]) => {
      if (value) {
        processedValues[key] = value;
      }
    });
    processedValues['category_name'] = setSelCategory.category_name;


    var reqDataInsert = {
      query_type: 'insert',
      table: 'case_tasks',
      values: processedValues

    };
    context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
      setLoader(false);
      message.success('Payment Made Successfullly');

    }).catch(err => {
      message.error(err);
      setLoader(false);
    })

  };

  const onTypeChange = ({ target: { value } }) => {
    setSelType(value);
    setRefreshTable(prev=>prev+1)
  }
  return (
    <>
       {
          isModal && (<Modal
            visible={visibleModal}
            zIndex={999}
            footer={null}
            closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
            centered={false}
            closable={true}
            width={600}
            onCancel={() => { setVisibleModal(false) }}
            title={capitalizeFirst(curAction) + " " + selType}
          >
            {curAction === "view" && (<ViewCRM viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
            {curAction === "add" && (<AddEditCRM onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
            {curAction === "edit" && (<AddEditCRM editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

          </Modal>)
        }

        {
          !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List Employees</Button>}>

            {curAction === "view" && (<ViewCRM viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
            {curAction === "add" && (<AddEditCRM onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
            {curAction === "edit" && (<AddEditCRM editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

          </Card>)
        }

        <Row style={{ marginBottom: '10px' }}>
          <Radio.Group defaultValue="Lead" optionType="button" buttonStyle="solid"
            onChange={onTypeChange}>
            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'case-types', 'radio')}
          </Radio.Group>
        </Row>
        <Card title={selType + " List"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" >
        </i>Add {selType}</MyButton>} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>


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
              <Col className="gutter-row" xs={34} xl={20}>
                <Row>


                  <Col className="gutter-row" xs={24} xl={12}>
                    <FormItem
                      label="Category"
                      name='category_name'

                    // rules={[{ required: true, message: 'Please Enter  Categories' }]}
                    >
                      <Select
                        showSearch
                        placeholder="category name"
                        // onChange={onPlanChange}
                        onFinish={addeditFormCategoryOnFinish}
                        optionFilterProp="children"
                        //onChange={businessStatusOnChange}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      >
                        {
                          categoryNames && categoryNames.filter(obj => obj.case_type === selType).map(item => {
                            return <Select.Option value={item.id} >{item.category_name}</Select.Option>
                          })
                        }
                      </Select>
                    </FormItem>


                  </Col>

                  {/* <Row> */}

                  <Col className="gutter-row" xs={25} xl={12}>
                    <FormItem
                      label="Source Channel"
                      // style={{marginLeft:'5px'}}
                      name='source_channel'
                    // rules={[{ required: true, message: 'Please Enter Source Channel' }]}
                    >

                      <Select
                        showSearch
                        placeholder="Source Channel"

                        optionFilterProp="children"
                        //onChange={genderOnChange}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      >
                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'case-channels')}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col className="gutter-row" xs={24} xl={12}>
                    <FormItem
                      label="Assigned To"
                      name='assigned_to'

                    // rules={[{ required: true, message: 'Please Enter Plan Name' }]}
                    >
                      <Select
                        showSearch
                        placeholder="name"
                        // onChange={onPlanChange}
                        onFinish={addeditFormBranchOnFinish}
                        optionFilterProp="children"
                        //onChange={businessStatusOnChange}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      >
                        {
                          planNames && planNames.map(item => {
                            return <Select.Option value={item.id} >{item.name}</Select.Option>
                          })
                        }
                      </Select>
                    </FormItem>
                  </Col>
                  <Col className="gutter-row" xs={24} xl={12}>
                    <FormItem
                      label="Case Status"
                      name='case_status'
                    // rules={[{ required: true, message: 'Please Enter Case Status' }]}
                    >

                      <Select
                        showSearch
                        placeholder="Case Status"

                        optionFilterProp="children"
                        //onChange={genderOnChange}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      >
                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'case-status')}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

              </Col>
              <Col className="gutter-row" xs={24} xl={4}>
                <Row style={{ marginTop: '18%', marginLeft: '9%' }}>
                  <MyButton style={{ marginTop: '6%' }}
                    type="primary" htmlType="submit">
                    <FontAwesomeIcon loadPlanNamesicon={faSearch} /> Search
                  </MyButton>
                </Row>
              </Col>
            </Row>
          </Form>

          <PaginatedTable
            columns={tableColumns}
            refresh={refreshTable}
            countQuery={"select count(*) as count from case_tasks where status=1 and type='"+selType+"'" +
              context.psGlobal.getWhereClause(filterColumns.current, false)
            }

            listQuery={
              "select *,@rownum:=@rownum+1 as row_number from case_tasks CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 and type='"+selType+"'" +
              context.psGlobal.getWhereClause(filterColumns.current, false)
            }
            itemsPerPage={20}
          />
        </Card>
     
    </>
  );
};
export default CRMList;