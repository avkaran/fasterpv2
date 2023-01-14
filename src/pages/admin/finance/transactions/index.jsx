import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, message, Space } from "antd";
import { AvatarPaginatedList, MyButton } from "../../../../comp";
import dayjs from 'dayjs';


import { Breadcrumb, Layout, Card, Form, DatePicker, Select, Modal, Button, Tag, } from "antd";

import { HomeOutlined } from "@ant-design/icons";
import PsContext from "../../../../context";
import { PaginatedTable, FormItem, DeleteButton, } from "../../../../comp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClose, faPrint, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirst } from "../../../../utils";
import AddEditTrans from "./addEditTrans";
import ViewBusinessName from './viewTrans';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import PrintFinancialTransactions from "../printFormats/printTransaction";
const FinancialTransactions = (props) => {
  const context = useContext(PsContext);
  const { userId } = useParams();
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
  const [refreshPrintData,setRefreshPrintData]=useState(0);
  const [isPrint,setIsPrint]=useState(false);
  const filterColumns = useRef([
    " date(tr_date)>='" + dayjs().format("YYYY-MM-DD") + "'",
    " date(tr_date)>='" + dayjs().format("YYYY-MM-DD") + "'",
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
  const onFinishSearch = (values) => {
    var filter_clauses = [];
    filter_clauses.push(
      " date(tr_date)>='" + dayjs(values.tr_date[0]).format("YYYY-MM-DD") + "'"
    )
    filter_clauses.push(
      " date(tr_date)<='" + dayjs(values.tr_date[1]).format("YYYY-MM-DD") + "'"
    );
    filterColumns.current = filter_clauses;
    setRefreshTable((prev) => prev + 1);
  };
  const onChangeDate = (dates) => {
    searchForm.setFieldsValue({ tr_date: dates });
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

  const onPrintClick=()=>{
    setIsPrint(true);
    setRefreshPrintData(prev=>prev+1);
  }
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
            <span>Finance</span>
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
            {curAction === "add" && (<AddEditTrans onListClick={() => {setCurAction("list");setVisibleModal(false);}} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
            {curAction === "edit" && (<AddEditTrans editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

          </Modal>)
        }


        <Card>
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
              <Col className="gutter-row" xs={24} xl={8}>
               
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
              <Col className="gutter-row" xs={24} xl={8}>
                  <MyButton type="primary" htmlType="submit">
                    <FontAwesomeIcon icon={faSearch} /> Search
                  </MyButton>
               
              </Col>
              <Col className="gutter-row" xs={24} xl={2}>
                
                  <MyButton type="primary" onClick={onPrintClick}>
                    <FontAwesomeIcon icon={faPrint} /> Print
                  </MyButton>
                
              </Col>
              <Col className="gutter-row" xs={24} xl={2}>
                  <MyButton type="primary" >
                    <FontAwesomeIcon icon={faFileExcel} /> Excel
                  </MyButton>
              </Col>
              <Col className="gutter-row" xs={24} xl={4}>
                <MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>
              </Col>
            </Row>
          </Form>
        


    
          <AvatarPaginatedList
            // ref={InfiniteListRef}
            listHeading={"Transactions"}

            countQuery={"select count(*) as count from acc_transactions t where t.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)}


            listQuery={"select t.*,lc.ledger_name as credit_account_name,ld.ledger_name as debit_account_name,cc.category_name as credit_account_category_name,cd.category_name as debit_account_category_name,row_number() OVER (ORDER BY t.tr_date) as row_num from acc_transactions t,acc_ledgers lc,acc_ledgers ld,acc_ledger_categories cc,acc_ledger_categories cd where t.status=1 and t.credit_account=lc.id and t.debit_account=ld.id and lc.category=cc.id and ld.category=cd.id " + context.psGlobal.getWhereClause(filterColumns.current, false)}
            recordsPerRequestOrPage={100}

            userId={userId}
            refresh={refreshTable}
            // isCheckboxList={true}
            //  onCheckedChange={onCheckedChange}
            // onPageChange={onListPageChange}
            renderItem={(item, index) => {
              return <><Row key={item.id} gutter={32} style={{ borderBottom: '1px solid', borderColor: cyan[7], background: '#fff', paddingTop:'5px',paddingBottom:'5px',margin:'10px 10px 10px 10px', }}>
                <Col span={1} style={{fontWeight:'bold',fontSize:'16px'}}>
                  {item.row_num}
                </Col>
                <Col span={2} style={{fontWeight:'bold',fontSize:'16px'}}>
                  {dayjs(item.tr_date).format("DD/MM/YYYY")}
                </Col>
                <Col span={7} style={{fontWeight:'bold',fontSize:'16px'}}>
                <span style={{ fontWeight: 'bold', color: 'green' }}>BY</span> {item.credit_account_name}
                <br />
											&nbsp; &nbsp; &nbsp; <span style={{ fontWeight: 'bold', color: 'red' }}>TO</span> {item.debit_account_name}
                </Col>
                <Col span={4}>
                  <Row>
                    <Col span={12} style={{fontWeight:'bold',fontSize:'16px'}}> {item.amount}</Col>
                    <Col span={12} style={{fontWeight:'bold',fontSize:'16px'}}><br/>{item.amount}</Col>
                  </Row>
                </Col>

                <Col span={6} style={{fontWeight:'bold',fontSize:'16px'}}>
                  {item.narration}
                </Col>

                <Col span={2}>
                  <Space>
                    <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                      onClick={() => onEditClick(item)}
                    ><i class="fa-solid fa-pencil"></i></MyButton>
                    <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1) }}
                      title={heading}
                      table="acc_transactions"
                      //id must,+ give first three colums to display
                      dataItem={{ id: item.id, tr_date: dayjs(item.tr_date).format("DD/MM/YYYY"), credit_account: item.credit_account_name, debit_account: item.debit_account_name, amount: item.amount, narration: item.narration }}
                    // avatar={context.baseUrl + item.course_image}
                    />

                  </Space>
                </Col>
              </Row></>
            }}

          />
          </Card>
  
      </Content>
      {
        isPrint && (<PrintFinancialTransactions 
    
          listHeading={"Transactions"}
          countQuery={"select count(*) as count from acc_transactions t where t.status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)}
          listQuery={"select t.*,lc.ledger_name as credit_account_name,ld.ledger_name as debit_account_name,cc.category_name as credit_account_category_name,cd.category_name as debit_account_category_name,row_number() OVER (ORDER BY t.tr_date) as row_num from acc_transactions t,acc_ledgers lc,acc_ledgers ld,acc_ledger_categories cc,acc_ledger_categories cd where t.status=1 and t.credit_account=lc.id and t.debit_account=ld.id and lc.category=cc.id and ld.category=cd.id " + context.psGlobal.getWhereClause(filterColumns.current, false)}
          userId={userId}
          recordsPerRequestOrPage={50}
          refresh={refreshPrintData}
          onPreviewFinish={()=>{}}
          />)
      }
     
    </>
  );
};
export default FinancialTransactions;
