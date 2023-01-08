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
  Modal,
  Button,Tag,
} from "antd";

import { HomeOutlined } from "@ant-design/icons";
import PsContext from "../../../context";
import {
  PaginatedTable,
  FormItem,
  DeleteButton,
} from "../../../comp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,faClose
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirst } from "../../../utils";
import AddEditTrans from "./addEditTrans";
import ViewBusinessName from './viewTrans';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
const Trans = (props) => {
  const context = useContext(PsContext);
const {userId}=useParams();
  const { Content } = Layout;
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [heading] = useState('Transction');
  const [curAction, setCurAction] = useState("list");
//   const [isModal] = useState(false);
  const [isModal] = useState(true);
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

    searchForm.setFieldsValue({ tr_date: [dayjs(), dayjs()] });
  }, []);
  
  const motablecoloums = [
    {
      title: "S.No",
      dataIndex: "row_num",
      key: "row_num",
      //render: (item) => <strong>{item}</strong>,
    },
    {
        title: "Date",
        // dataIndex: 'msg_date',
        key: "tr_date",
        render: (item) => (
          <>{dayjs(item.log_time).format("DD/MM/YYYY")}</>
        ),
      },
    // {
    //   title: "Paticular",
    //   dataIndex: "ledger_name",
    //   key: "log_name",
    //   //render: (item) => <strong>{item}</strong>,
    // },
    // {
    //   title: "Credit",
    //   // dataIndex: 'msg_date',
    //   key: "credit_account",
    //   render: (item) => (
    //     <>{dayjs(item.credit_account).format("DD/MM/YYYY h:mm a")}</>
    //   ),
    // },
    {
        title: "Credit",
        dataIndex: "Credit",
        key: "credit_account",
      },
    {
        title: "Debit",
        dataIndex: "Debit",
        key: "debit_account",
      },
    {
      title: "Description",
      dataIndex: "narration",
      key: "narration",
    },
    
    {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
      },
  ];
  const tableColumns = [
    {
      title: "S.No",
      dataIndex: "row_num",
      key: "row_num",
      //render: (item) => <strong>{item}</strong>,
    },
    {
        title: "Date",
        // dataIndex: 'msg_date',
        key: "tr_date",
        render: (item) => (
          <>{dayjs(item.log_time).format("DD/MM/YYYY")}</>
        ),
      },
    // {
    //   title: "Paticular",
    //   dataIndex: "ledger_name",
    //   key: "log_name",
    //   //render: (item) => <strong>{item}</strong>,
    // },
    // {
    //   title: "Credit",
    //   // dataIndex: 'msg_date',
    //   key: "credit_account",
    //   render: (item) => (
    //     <>{dayjs(item.credit_account).format("DD/MM/YYYY h:mm a")}</>
    //   ),
    // },
    {
        title: "Credit",
        dataIndex: "Credit",
        key: "credit_account",
      },
    {
        title: "Debit",
        dataIndex: "Debit",
        key: "debit_account",
      },
    {
      title: "Description",
      dataIndex: "narration",
      key: "narration",
    },
    
    {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: 'Status',
        //dataIndex: 'COLUMN_COMMENT',
        key: 'tr_status',
        render: (item) => <Tag color={item.tr_status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.tr_status}</Tag>,
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
            <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() =>{ setCurAction("list");setRefreshTable(prev=>prev+1)}}
            title={heading}
                table="acc_transactions"
                //id must,+ give first three colums to display
                dataItem={{ id: item.id,tr_date:item.tr_date, credit_account: item.credit_account, debit_account: item.debit_account, amount: item.amount, narration: item.narration ,tr_status: item.tr_status}}
               // avatar={context.baseUrl + item.course_image}
            />

        </Space>,
    },
  ];
  
  const onFinishSearch = (values) => {
    var filter_clauses = [];
    filter_clauses.push(
    
        dayjs(values.tr_date[0]).format("YYYY-MM-DD") +
        "'"
    );
    filter_clauses.push(
    
        dayjs(values.tr_date[1]).format("YYYY-MM-DD") +
        "'"
    );
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
const onViewClick = (item) => {
    setViewOrEditData(item);
    setCurAction("view");
    if (isModal)
        setVisibleModal(true);
}

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
          <Breadcrumb.Item>Transaction</Breadcrumb.Item>
        </Breadcrumb>
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
                        title={capitalizeFirst(curAction) + " " + heading}
                    >
                        {curAction === "view" && (<ViewBusinessName viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditTrans onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditTrans editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List Transaction</Button>}>

                        {curAction === "view" && (<ViewBusinessName viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditTrans onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditTrans editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
        <Card title="Transcation">
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
                      name="tr_date"
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
                </Row>
                <Row>
                </Row>
              
              </Col>
              <Col className="gutter-row" xs={24} xl={4}>
             <Row style={{marginTop:'0%',marginLeft:'9%'}}>
             <MyButton style={{marginTop:'6%'}}
             type="primary" htmlType="submit">
                  <FontAwesomeIcon icon={faSearch} /> Search
                </MyButton>
             </Row>
              </Col>
            </Row>
          </Form>
          <Card title={heading+" List"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{display:(curAction === "list" || isModal)?'block':'none'}}>
                   
                        <PaginatedTable
                         columns={tableColumns} 
                         refresh={refreshTable}
                         countQuery="select count(*) as count from acc_transactions where status=1 "
                         listQuery="select *,@rownum:=@rownum+1 as row_num from acc_transactions CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 "
                         itemsPerPage={20}
                        />
                    
                </Card>
        </Card>
        <Card  style={{}}>
        {/* margin: '20px 1rem',
                    fontSize: '1rem',
                    borderRadius: 4,
                    border: '2px solid rgba(0,0,0,0.3)', */}
 <table style={{width:"100%",borderCollapse:"collapse",height:"30%",}} >
  <tr style={{border:"1px solid black",fontSize:'1rem', borderRadius: 4,width:'100%',height:"30%"}}>
    <th>S.NO</th>
    <th>Date</th>
    <th>Particular</th>
    <th>Credit</th>
    <th>Debit</th>
    <th>Description</th>
    <th>Amount	</th>
    <th>Edit</th>
    
  </tr>
  <tr  style={{border:"1px solid black",fontSize: '1rem', borderRadius: 4,width:'1000%',fontWeight:"bold"}}>
    <td>1</td>
    <td>06/01/2023</td>
    <td><span style={{color:"green",fontWeight:"bold"}}>By </span>Cashing <br></br> <span style={{color:"Red",fontWeight:"bold"}}>To </span>Saving</td>
    <th></th>
    <td>Cash</td>
    
    <td>Very good</td>
    <td>1200</td>
    <td> <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                onClick={() => onEditClick()}
            ><i class="fa-solid fa-pencil"></i></MyButton></td>
  </tr>
  <tr  style={{border:"1px solid black",fontSize: '1rem', borderRadius: 4,width:'1000%',fontWeight:"bold"}}>
  <td>2</td>
    <td>06/01/2023</td>
    <td><span style={{color:"green",fontWeight:"bold"}}>By </span>Cashing <br></br> <span style={{color:"Red",fontWeight:"bold"}}>To </span>Saving</td>
    <th></th>
    <td>Cash</td>
  
    <td>Very good</td>
    <td>1200</td>
    <td> <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                onClick={() => onEditClick()}
            ><i class="fa-solid fa-pencil"></i></MyButton></td>
  </tr>
  <tr  style={{border:"1px solid black",fontSize: '1rem', borderRadius: 4,width:'1000%',fontWeight:"bold"}}>
  <td>3</td>
    <td>06/01/2023</td>
    <td><span style={{color:"green",fontWeight:"bold"}}>By </span>Cashing <br></br> <span style={{color:"Red",fontWeight:"bold"}}>To </span>Saving</td>
    <th></th>
    <td>Cash</td>
    
    <td>Very good</td>
    <td>1200</td>
    <td> <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                onClick={() => onEditClick()}
            ><i class="fa-solid fa-pencil"></i></MyButton></td>
  </tr>
  <tr  style={{border:"1px solid black",fontSize: '1rem', borderRadius: 4,width:'1000%',fontWeight:"bold"}}>
  <td>4</td>
    <td>06/01/2023</td>
    <td><span style={{color:"green",fontWeight:"bold"}}>By </span>Cashing <br></br> <span style={{color:"Red",fontWeight:"bold"}}>To </span>Saving</td>
    <th></th>
    <td>Cash</td>
    
    <td>Very good</td>
    <td>1200</td>
    <td> <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                onClick={() => onEditClick()}
            ><i class="fa-solid fa-pencil"></i></MyButton></td>
  </tr>
  
  
</table>

        </Card>
      </Content>
    </>
  );
};
export default Trans;
