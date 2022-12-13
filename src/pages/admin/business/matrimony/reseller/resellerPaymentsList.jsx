import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, message, Space } from "antd";
import { MyButton } from "../../../../../comp";
import { Breadcrumb, Layout, Card, Tag, Modal, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import PsContext from "../../../../../context";
import {
  PaginatedTable,
  FormItem,
} from "../../../../../comp";
import { green, red, cyan } from "@ant-design/colors";
import ResellerPayment from "./resellerPayment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { capitalizeFirst, printDocument } from "../../../../../utils";
import { Form, DatePicker, Select } from "antd";
import ResellerReceipt from "./resellerReceipt";
import {
  faTrash,
  faClose,
  faSearch,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
const ResellerPaymentList = (props) => {
  const context = useContext(PsContext);
  const { Content } = Layout;
  const [searchForm] = Form.useForm();
  const { resellerType, userId, ...other } = props;
  const [curAction, setCurAction] = useState("list");
  const [isModal] = useState(false);
  const [viewOrEditData, setViewOrEditData] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [heading] = useState("Payment");
  const [refreshTable, setRefreshTable] = useState(0);
  const [resellers, setResellers] = useState([]);
  const [selBusiness, setSelBusiness] = useState(null);
  const [businessNames, setBusinessNames] = useState(null);
  const [VisibleCancelModal, setVisibleCancelModal] = useState(false);
  const [visiblePrintModal, setVisiblePrintModal] = useState(false);
  const [printFranchiseData, setPrintFranchisetData] = useState([]);
  const filterColumns = useRef([
    " date(transaction_date)>='" + moment().format("YYYY-MM-DD") + "'",
    " date(transaction_date)>='" + moment().format("YYYY-MM-DD") + "'",
  ]);
  useEffect(() => {
    loadBusinessNames();
    loadResellers(resellerType)
    searchForm.setFieldsValue({ transaction_date: [moment(), moment()] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableColumns = [
    {
      title: "S.No",
      dataIndex: "row_num",
      key: "row_num",
      //render: (item) => <strong>{item}</strong>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Bill No",
      dataIndex: "bill_voucher_no",
      key: "bill_voucher_no",
      //render: (item) => <strong>{item}</strong>,
    },

    {
      title: "Date",
      // dataIndex: 'transaction_date ',
      key: "transaction_date",
      render: (item) => (
        <>{moment(item.transaction_date).format("DD/MM/YYYY h:mm a")}</>
      ),
    },

    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
    },
    {
      title: "Paid Amount",
      dataIndex: "paid_amount",
      key: "paid_amount",
      // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
    },
    {
      title: "Narration",
      dataIndex: "narration",
      key: "narration",
      // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
    },
    {
      title: "Payment Mode",
      dataIndex: "user_payment_mode",
      key: "user_payment_mode",
      // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
    },

    {
      title: "Actions",
      // dataIndex: 'actions',
      key: "actions",
      render: (item) => (
        <>{
          item.transaction_status === 'Paid' && (<Space>
            <MyButton
              type="outlined"
              shape="round"
              onClick={() => {
                onPrintClick(item);
              }}
            >
              <FontAwesomeIcon icon={faPrint} />Receipt
            </MyButton>
            <Button style={{ color: 'red' }}
              type="outlined"
              shape="round"
              color={red[7]}
              onClick={() => {
                onDeleteClick(item);
              }}
            >
              <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} /> Cancel
            </Button>
          </Space>
          )
        }
          {
            item.transaction_status !== 'Paid' && <Tag color="magenta">{item.transaction_status}</Tag>
          }
        </>
      ),
    },
  ];

  const formPrintOnFinish = (values) => {
    var business = businessNames.find(
      (item) => item.id === values.business_name
    );
    setSelBusiness(business);
    // console.log('bus',business)
    printDocument("receipt-print");
  };
  const loadBusinessNames = () => {
    var reqData = {
      query_type: "query", //query_type=insert | update | delete | query
      query:
        "select * from business_names where status=1 and business_status='Active'",
    };
    context.psGlobal
      .apiRequest(reqData, context.adminUser(userId).mode)
      .then((res) => {
        setBusinessNames(res);
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const onPrintClick = (item) => {
    var printFranchiseData = item;
    setPrintFranchisetData(printFranchiseData);
    setVisiblePrintModal(true);
  };

  const onDeleteClick = (item) => {
    setViewOrEditData(item);
    setVisibleCancelModal(true);
  };
  const onChangeDate = (dates) => {
    searchForm.setFieldsValue({ transaction_date: dates });
  };
  const onFinishSearch = (values) => {
    var filter_clauses = [];
    filter_clauses.push(
      " date(transaction_date)>='" +
      moment(values.transaction_date[0]).format("YYYY-MM-DD") +
      "'"
    );
    filter_clauses.push(
      " date(transaction_date)<='" +
      moment(values.transaction_date[1]).format("YYYY-MM-DD") +
      "'"
    );
    if (values.user_id) filter_clauses.push("user_id='" + values.user_id + "'");
    filterColumns.current = filter_clauses;
    setRefreshTable((prev) => prev + 1);
  };
  const cancelOnFinish = (values) => {
    var reqDataUpdate = [{
      query_type: 'update',
      table: 'fr_br_transactions',
      where: { id: viewOrEditData.id },
      values: { transaction_status: 'Cancelled' }
    }]
    context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
      setVisibleCancelModal(false);
      setRefreshTable(prev => prev + 1)
      message.success('Bill Cancelled Successfullly');

    }).catch(err => {
      message.error(err);

    })

  };

  const onAddClick = () => {
    setCurAction("add");
    if (isModal) setVisibleModal(true);
  };
  const loadResellers = (resellerType) => {
    if (resellerType) {
      var query = "";
      if (resellerType === "broker")
        query = "select id,name,broker_code as code from brokers where status=1 and broker_status='Active'";
      else if (resellerType === "franchise")
        query =
          "select id,name,franchise_code as code from franchise where status=1 and franchise_status='Active'";
      var reqData = {
        query_type: "query", //query_type=insert | update | delete | query
        query: query,
      };
      context.psGlobal
        .apiRequest(reqData, context.adminUser(userId).mode)
        .then((res) => {
          setResellers(res);
        })
        .catch((err) => {
          message.error(err);
        });
    }


  };
  return (
    <>
      {isModal && (
        <Modal
          visible={visibleModal}
          zIndex={999}
          footer={null}
          closeIcon={
            <MyButton type="outlined" shape="circle">
              <FontAwesomeIcon icon={faClose} />
            </MyButton>
          }
          centered={false}
          closable={true}
          width={600}
          onCancel={() => {
            setVisibleModal(false);
          }}
          title={capitalizeFirst(curAction) + " " + heading}
        >

          {curAction === "add" && (
            <ResellerPayment
              onListClick={() => setCurAction("list")}
              onSaveFinish={() => {
                setCurAction("list");
                setRefreshTable((prev) => prev + 1);
                setVisibleModal(false);
              }}
              resellerType={resellerType}
              userId={userId}
            />
          )}
          {curAction === "edit" && (
            <ResellerPayment
              editIdOrObject={viewOrEditData}
              onListClick={() => setCurAction("list")}
              onSaveFinish={() => {
                setCurAction("list");
                setRefreshTable((prev) => prev + 1);
                setVisibleModal(false);
              }}
              resellerType={resellerType}
              userId={userId}
            />
          )}
        </Modal>
      )}

      {!isModal &&
        (curAction === "add" ||
          curAction === "edit" ||
          curAction === "view") && (
          <Card
            title={capitalizeFirst(curAction) + " " + heading}
            extra={
              <Button onClick={() => setCurAction("list")}>
                <i className="fa-solid fa-list pe-2"></i>List Payments
              </Button>
            }
          >
            {curAction === "add" && (
              <ResellerPayment
                onListClick={() => setCurAction("list")}
                onSaveFinish={() => {
                  setCurAction("list");
                  setRefreshTable((prev) => prev + 1);
                }}
                resellerType={resellerType}
                userId={userId}
              />
            )}
            {curAction === "edit" && (
              <ResellerPayment
                editIdOrObject={viewOrEditData}
                onListClick={() => setCurAction("list")}
                onSaveFinish={() => {
                  setCurAction("list");
                  setRefreshTable((prev) => prev + 1);
                }}
                userId={userId}
              />
            )}
          </Card>
        )}
      <Card
        title={heading + " List"}
        extra={
          <MyButton onClick={onAddClick}>
            <i className="fa-solid fa-plus pe-2"></i>Make {heading}
          </MyButton>
        }
        style={{
          display: curAction === "list" || isModal ? "block" : "none",
        }}
      >
        <Form
          name="basic"
          form={searchForm}
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinishSearch}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col className="gutter-row" xs={24} xl={10}>
              <FormItem
                label="Date"
                name="transaction_date"
              // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
              >
                <Space direction="vertical">
                  <DatePicker.RangePicker
                    onChange={onChangeDate}
                    defaultValue={[moment(), moment()]}
                    format="DD/MM/YYYY"
                    allowClear={false}
                  />
                </Space>
              </FormItem>
            </Col>

            <Col className="gutter-row" xs={24} xl={10}>
              <FormItem
                label={capitalizeFirst(resellerType)}
                name="user_id"
              //rules={[{ required: true, message: 'Please Enter Branch Status' }]}
              >
                <Select
                  showSearch
                  placeholder="User"
                  optionFilterProp="children"
                  //onChange={designationIdOnChange}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {resellers.map((item) => {
                    return (
                      <Select.Option value={item.id}>
                        {item.name +"(" +item.code+ ")"}
                      </Select.Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={4}>
              <MyButton type="primary" htmlType="submit">
                <FontAwesomeIcon icon={faSearch} /> Search
              </MyButton>
            </Col>
          </Row>
        </Form>
        <PaginatedTable
          columns={tableColumns}
          refresh={refreshTable}
          countQuery={
            "select count(*) as count from fr_br_transactions where status=1 and user_type='" + resellerType + "'" +
            context.psGlobal.getWhereClause(filterColumns.current, false)
          }
          listQuery={
            "select t.*,f.name,f.mobile_no,f.address,f."+resellerType+"_code,f.email,@rownum:=@rownum+1 as row_num from  "+(resellerType==='franchise'?'franchise':'brokers')+" f,fr_br_transactions t CROSS JOIN (SELECT @rownum:=0) crj where t.status=1 and t.user_id =f.id and user_type='" + resellerType + "'" +
            context.psGlobal.getWhereClause(filterColumns.current, false)+" ORDER BY t.transaction_date desc"
          }
          userId={userId}
          itemsPerPage={20}
        />
      </Card>

      <Modal
        visible={visiblePrintModal}
        zIndex={999}
        footer={null}
        centered={false}
        closable={true}
        style={{ marginTop: "20px" }}
        width={600}
        // footer={null}
        onCancel={() => {
          setVisiblePrintModal(false);
        }}
        title={
          <span style={{ color: green[4] }}>
            <FontAwesomeIcon icon={faPrint} /> Franchise Receipt
          </span>
        }
      >
        <Form
          name="basic"
          //form={addeditFormPrint}
          labelAlign="left"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={formPrintOnFinish}
          autoComplete="off"
        >
          <FormItem
            label="Business Name"
            name="business_name"
            rules={[{ required: true, message: "Please Enter Business Name" }]}
          >
            <Select
              showSearch
              placeholder="Business Name"
              optionFilterProp="children"
              //onChange={businessStatusOnChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {businessNames &&
                businessNames.map((item) => {
                  return (
                    <Select.Option value={item.id}>
                      {item.business_name}
                    </Select.Option>
                  );
                })}
            </Select>
          </FormItem>

          <FormItem wrapperCol={{ offset: 10, span: 24 }}>
            <Space>
              <Button
                size="large"
                type="outlined"
                onClick={() => setVisiblePrintModal(false)}
              >
                Cancel
              </Button>
              <MyButton size="large" type="primary" htmlType="submit">
                Print
              </MyButton>
            </Space>
          </FormItem>
        </Form>
      </Modal>
      <Modal
        visible={VisibleCancelModal}
        zIndex={999}
        footer={null}
        centered={false}
        closable={true}
        style={{ marginTop: "20px" }}
        width={600}
        // footer={null}
        onCancel={() => {
          setVisibleCancelModal(false);
        }}
        title={
          <span style={{ color: red[4] }}>
            <FontAwesomeIcon icon={faTrash} />
            &nbsp;&nbsp; Cancel  Franchise Bill
          </span>
        }
      >
        {viewOrEditData && (
          <Form
            name="basic"
            onFinish={cancelOnFinish}
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            title={heading}
            autoComplete="off"
          >
            <h6>Are you Sure to Cancel below Payments?</h6>
            <Row>
              <Col xs={24} xl={6}>
                <span>Bill No:</span>
                <br></br>
                <span>Transaction Date:</span>
                <br></br>
                <span> Credit:</span>
                <br></br>
                <span>Paid Amount:</span>
              </Col>
              <Col xs={24} xl={8}>
                <span
                  style={{
                    color: cyan[6],
                    fontWeight: "bold",
                    fontSize: "15px",
                    marginLeft: "7%",
                  }}
                >
                  {" "}
                  {viewOrEditData.bill_voucher_no}
                </span>
                <br></br>
                <span
                  style={{
                    color: cyan[6],
                    fontWeight: "bold",
                    fontSize: "15px",
                    marginLeft: "7%",
                  }}
                >
                  {moment(viewOrEditData.transaction_date).format(
                    "DD/MM/YYYY h:mm a"
                  )}
                </span>{" "}
                <br></br>
                <span
                  style={{
                    color: cyan[6],
                    fontWeight: "bold",
                    fontSize: "15px",
                    marginLeft: "7%",
                  }}
                >
                  {viewOrEditData.credit}
                </span>
                <br></br>
                <span
                  style={{
                    color: cyan[6],
                    fontWeight: "bold",
                    fontSize: "15px",
                    marginLeft: "7%",
                  }}
                >
                  {viewOrEditData.paid_amount}
                </span>
                <br></br>
              </Col>
            </Row>

            <FormItem wrapperCol={{ offset: 10, span: 24 }}>
              <Space>
                <Button
                  size="large"
                  type="outlined"
                  onClick={() => setVisibleCancelModal(false)}
                >
                  Close
                </Button>
                <MyButton size="large" type="primary" htmlType="submit">
                  Cancel Bill
                  {/* {curAction === "edit" ? "Update" : "Submit"} */}
                </MyButton>
              </Space>
            </FormItem>
          </Form>
        )}
      </Modal>
      <ResellerReceipt
        franchisReceipteData={printFranchiseData}
        business={selBusiness}
      // language={printLanguage}
      />
    </>
  );
};
export default ResellerPaymentList;
