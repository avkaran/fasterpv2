import React, { useState, useEffect, useContext } from "react";
import { Row, Col, message, Space } from "antd";
import { Button } from "antd";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import { Spin } from "antd";
import PsContext from "../../../../../context";
import { FormItem, MyButton } from "../../../../../comp";

import moment from "moment";
import { capitalizeFirst } from "../../../../../utils";
const ResellerPayment = (props) => {
  const context = useContext(PsContext);
  const [resellers, setresellers] = useState([]);
  const [addeditFormAdvertisement] = Form.useForm();
  const [loader, setLoader] = useState(false);
  const [curAction, setCurAction] = useState("add");
  const [heading] = useState("Payment");
  const [validFromDate, setValidFromDate] = useState(moment());
  const { onListClick, onSaveFinish, resellerType, userId } = props;
  useEffect(() => {
    Loadresellers(resellerType);
    setCurAction("add");
    addeditFormAdvertisement.setFieldsValue({
      fr_br_transactions: {

        transaction_date: moment().format("YYYY-MM-DD")
      },

    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const Loadresellers = (resellerType) => {
    var query = "";
    if(resellerType){
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
        setresellers(res);
      })
      .catch((err) => {
        message.error(err);
      });
    }
    
  };
  const addFormMakePaymentOnFinish = (values) => {
    setLoader(true);
    var processedValues = {};
    Object.entries(values.fr_br_transactions
    ).forEach(([key, value]) => {
      if (value) {
        processedValues[key] = value;
      }
    });

    var reqDataInsert = {
      query_type: 'insert',
      table: 'fr_br_transactions',
      values: processedValues

    };
    processedValues['user_type'] = resellerType;
    processedValues['transaction_status'] = 'Paid';
    processedValues['transaction_type'] = 'Main Balance Added';
    processedValues['paid_by_emp'] = context.adminUser(userId).ref_id2;
    context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {

      var createdId = res;
      var BillId = 'FRP' + createdId.padStart(4, '0');
      var reqDataInner = {
        query_type: 'update',
        table: 'fr_br_transactions',
        where: { id: createdId },
        values: { bill_voucher_no: BillId }

      };
      context.psGlobal.apiRequest(reqDataInner, context.adminUser(userId).mode).then(() => {
        setLoader(false);
        message.success(heading + ' Added Successfullly');
        onSaveFinish();
      }).catch(err => {
        message.error(err);
        setLoader(false);
      })




    }).catch(err => {
      message.error(err);
      setLoader(false);
    })

  }
  const validFromDisabled = (current) => {
    // Can not select days before today and today
    // console.log(current,moment())
    return current && current < moment().subtract(1, "day");
  };

  const validFromOnChange = (date) => {
    setValidFromDate(date);

    addeditFormAdvertisement.setFieldsValue({
      fr_br_transactions: {
        transaction_date: moment(date).format('YYYY-MM-DD hh:mm')
      }
    })

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
          onFinish={addFormMakePaymentOnFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Transaction Date"
                name={['fr_br_transactions', 'transaction_date']}
                rules={[{ required: true, message: 'Please Enter Transaction Date' }]}
              >

                <Space direction="vertical">
                  <DatePicker
                    onChange={validFromOnChange}
                    // defaultValue={editData && !isNaN(moment(editData.valid_from, 'YYYY-MM-DD')) ? moment(editData.valid_from, 'YYYY-MM-DD').format('DD/MM/YYYY') : moment(moment(), 'DD/MM/YYYY')}
                    format='DD/MM/YYYY'
                    value={validFromDate}
                    disabledDate={validFromDisabled}
                    allowClear={false}
                  />
                </Space>
              </FormItem>
            </Col>

            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem label={capitalizeFirst(resellerType)}
                name={['fr_br_transactions', 'user_id']}
                rules={[{ required: true, message: 'Please select'+ resellerType }]}
                >
                <Select
                  showSearch
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
                      <Select.Option value={item.id}>{item.name}</Select.Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Credit Amount"
                name={["fr_br_transactions", "credit"]}
               rules={[{ required: true, message: 'Please Enter Credit Amount' }]}
              >
                <InputNumber
                  placeholder="Credit Amount"
                  type="number"
                  style={{ width: "100%" }}
                />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Paid Amount"
                name={["fr_br_transactions", "paid_amount"]}
               rules={[{ required: true, message: 'Please Enter Paid Amount' }]}
              >
                <InputNumber
                  placeholder="Paid Amount"
                  type="number"
                  style={{ width: "100%" }}
                />
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Payment Mode"
                name={["fr_br_transactions", "user_payment_mode"]}

              rules={[{ required: true, message: 'Please Enter Payment Mode' }]}
              >
                <Select
                  showSearch
                  placeholder="Payment Mode"

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
                    "payment-modes", 'option', ['Main Balance']
                  )}
                </Select>
              </FormItem>
            </Col>
            <Col className="gutter-row" xs={24} xl={12}>
              <FormItem
                label="Narration"
                name={["fr_br_transactions", "narration"]}
                rules={[
                  { required: true, message: "Please Enter Ad Descripton" },
                ]}
              >
                <Input.TextArea rows={3} />
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
export default ResellerPayment;
