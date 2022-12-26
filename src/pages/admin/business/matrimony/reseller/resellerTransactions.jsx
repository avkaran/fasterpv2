import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, message, Space } from "antd";
import { MyButton } from "../../../../../comp";
import { Breadcrumb, Layout, Card } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import PsContext from "../../../../../context";
import {
  PaginatedTable,
  FormItem,
} from "../../../../../comp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { Form, DatePicker, Select } from "antd";

import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirst } from "../../../../../utils";
const ResellerTransactions = (props) => {
  const context = useContext(PsContext);
  const [resellers, setResellers] = useState([]);
  const { Content } = Layout;
  const navigate = useNavigate();
  const [searchForm] = Form.useForm();
  const { editIdOrObject, onListClick, onSaveFinish, resellerType, userId, ...other } = props;
  const [refreshTable, setRefreshTable] = useState(0);
  const [selReseller, setSelReseller] = useState('');
  const filterColumns = useRef([
    " date(transaction_date)>='" + dayjs().format("YYYY-MM-DD") + "'",
    " date(transaction_date)>='" + dayjs().format("YYYY-MM-DD") + "'",
  ]);
  useEffect(() => {
    loadResellers(resellerType)
    searchForm.setFieldsValue({ transaction_date: [dayjs(), dayjs()] });
    if(context.adminUser(userId).role==='franchise' || context.adminUser(userId).role==='broker' ){
      searchForm.setFieldsValue({ user_id: context.adminUser(userId).ref_id });
    }
  }, []);

  const tableColumns = [
    {
      title: "S.No",
      dataIndex: "row_num",
      key: "row_num",
      //render: (item) => <strong>{item}</strong>,
    },



    {
      title: "Date",
      // dataIndex: 'transaction_date ',
      key: "transaction_date",
      render: (item) => (
        <>{dayjs(item.transaction_date).format("DD/MM/YYYY h:mm a")}</>
      ),
    },
    {
      title: "Type",
      dataIndex: "transaction_type",
      key: "transaction_type",
      // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
    },
    {
      title: "Narration",
      dataIndex: "narration",
      key: "narration",
      // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
    },


    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
    },

   


  ];
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
  const onFinishSearch = (values) => {
    setSelReseller(values.user_id)
    var filter_clauses = [];
    filter_clauses.push(
      " date(transaction_date)>='" +
      dayjs(values.transaction_date[0]).format("YYYY-MM-DD") +
      "'"
    );
    filter_clauses.push(
      " date(transaction_date)<='" +
      dayjs(values.transaction_date[1]).format("YYYY-MM-DD") +
      "'"
    );
    filterColumns.current = filter_clauses;
    setRefreshTable((prev) => prev + 1);
  };
  const onChangeDate = (dates) => {
    searchForm.setFieldsValue({ transaction_date: dates });
  };
  
  return (
    <>
        <Card title="Transactions"
       >

          <Form
            name="basic"
            form={searchForm}
            labelAlign="left"
            labelCol={{ span: 6 }}
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
                      defaultValue={[dayjs(), dayjs()]}
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
                  rules={[{ required: true, message: 'Please Enter ' + resellerType }]}
                >
                  <Select
                    showSearch
                    disabled={context.adminUser(userId).role==='franchise' || context.adminUser(userId).role==='broker'}
                    placeholder={capitalizeFirst(resellerType)}
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
                          {item.name}
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
            "select count(*) as count from fr_br_transactions where status=1 and user_type='" + resellerType + "' and user_id='" + selReseller + "'" +
            context.psGlobal.getWhereClause(filterColumns.current, false)
          }
          listQuery={
            "select t.*,f.name,f.mobile_no,f.address,f."+resellerType+"_code,f.email,@rownum:=@rownum+1 as row_num from " + (resellerType==='franchise'?'franchise':'brokers') + " f,fr_br_transactions t CROSS JOIN (SELECT @rownum:=0) crj where t.status=1 and t.user_id =f.id and t.user_type='" + resellerType + "' and t.user_id='" + selReseller + "'" +
            context.psGlobal.getWhereClause(filterColumns.current, false) +" ORDER BY t.transaction_date desc"
          }
          userId={userId}
          itemsPerPage={20}
        />
        </Card>
    </>
  );
};
export default ResellerTransactions;
