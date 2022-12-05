import React, { useState, useEffect, useContext } from 'react';
import { Button, Checkbox, Form, Input, Space, Spin, Select, DatePicker, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { CardFixedTop, momentDate } from '../../../../../utils';
import { listCollections } from '../../../../../models/core'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Steps } from 'antd';
import PsContext from '../../../../../context';

const MakePayment = (props) => {
    const context = useContext(PsContext);
    const { Step } = Steps;
    const { TextArea } = Input;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(true);
    const [memberId] = useState(props.match.params.memberId)
    const [collectionData, setCollectionData] = useState([]);
    const [viewData, setViewData] = useState([])
    const [selDate] = useState(new Date())
    const [isActivate, setIsActivate] = useState(false)
    const [membershipPlans, setMembershipPlans] = useState([])
    useEffect(() => {
        addForm.setFieldsValue({
            paid_date: moment().format('YYYY-MM-DD')
        })
        loadMembershipPlans();
        listCollections().then(res => {
            if (res) {
                setCollectionData(res)
                loadViewData(memberId);

            }

        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadMembershipPlans = () => {
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select *  from membership_plans",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                setMembershipPlans(res['data'].data)
            }
            else {

                message.error("Error")

            }

        });
    }
    const loadViewData = (id) => {

        setViewData([]);
        setLoader(true);
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from members where id='" + id + "'"
        };

        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res) => {
            setViewData(res[0]);
            setLoader(false);

        }).catch(err => {
         
            message.error(err);
            setLoader(false);
        })


    };
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value], index) => {
            // 👇️ name Tom 0, country Chile 1

            if (key === 'paid_date')
                processedValues['paid_date'] = selDate;
            else if (key === 'activate')
                if (isActivate) processedValues['member_status'] = 'active';
                else processedValues['member_status'] = 'waiting';
            else
                processedValues[key] = value;
        });
        processedValues['payment_status'] = 'paid';
        var reqData = { 
            query_type: 'update',
            table:'members',
            where:{id:memberId},
            values:processedValues

        };
       
        context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res)=>{

            message.success("payment done")
            navigate('/' + props.match.params.userId + '/admin/members')
           
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
      
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onChangePaidDate = (date) => {
        addForm.setFieldsValue({
            paid_date: moment(date).format('YYYY-MM-DD')
        })

    };

    const collectionOptions = (collectionName) => {

        if (collectionData && collectionData.length > 0) {
            let m = collectionData.find(item => item.name === collectionName)
            if (m) {
                let cData = m.collections.split(",")

                return cData.map(item => <option value={item}>{item}</option>)
            } else return <option value=''>Not in Database</option>

        }
    };
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment();
    };
    return (
        <>
            <CardFixedTop title="Make Payment" >
                <ul className="list-inline mb-0">
                    <li className='list-inline-item' >
                        <Button variant="white" className='border-start ms-2' onClick={() => navigate.goBack()}>
                            <i className='fa fa-arrow-left  pe-3'></i> Back
                        </Button>
                    </li>
                </ul>
            </CardFixedTop>
            <Row style={{ background: '#fff', padding: '5px 30px 5px 30px' }}>


                <Steps size="small" current={1} >
                    <Step title="Add Member" />
                    <Step title="Payment" />
                    <Step title="Done" />
                </Steps>
            </Row>
            <div className="fnew-device-page-wrapper" style={{ backgroundColor: '#FFFFFF', padding: '10px 20px 15px 20px' }}>
                <Spin spinning={loader} >
                   {viewData && (<Form
                        name="basic"
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={addForm}
                    >
                        <Row> {/* tow column row start */}
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item
                                    label="Name"




                                >
                                    {viewData.name}
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item
                                    label="Date of birth"


                                >
                                    {moment(viewData.dob).format('DD/MM/YYYY')}
                                </Form.Item>
                            </Col>
                        </Row> {/* tow column row end */}
                        <Row> {/* tow column row start */}
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item
                                    label="Education"



                                >
                                    {viewData.qualification + ', ' + viewData.higher_study}
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item
                                    label="Manai"


                                >
                                    {viewData.manai}
                                </Form.Item>
                            </Col>
                        </Row> {/* tow column row end */}
                        <Row> {/* tow column row start */}
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item
                                    label="Paid Date"
                                    name="paid_date"

                                    rules={[
                                        {

                                            required: true,

                                            message: 'Select Paid Date'
                                        },
                                    ]}
                                >
                                    <Space direction="vertical">

                                        <DatePicker onChange={onChangePaidDate} format='DD/MM/YYYY'
                                            defaultValue={moment()}
                                            disabledDate={disabledDate}
                                            allowClear={false}
                                        //dateRender={(currentDate,today)=>{}}
                                        />

                                    </Space>
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item
                                    label="Payment Method"
                                    name="payment_mode"
                                    rules={[{ required: true, message: 'Select payment method' }]}
                                >
                                    <Select placeholder="Select Payment Method">
                                        {collectionOptions('payment-methods')}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row> {/* tow column row end */}
                        <Row> {/* tow column row start */}
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item
                                    label="Bank Name"
                                    name="bank_name"
                                    rules={[{ required: true, message: 'select Bank' }]}
                                >
                                    <Select placeholder="Select Bank Name">
                                        {collectionOptions('bank-names')}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>

                                <Form.Item
                                    label="Membership Plan"
                                // name="membership_plan"
                                // rules={[{ required: true, message: 'Enter Amount' }]}
                                >
                                    <Input.Group compact>
                                        <Form.Item
                                            // label="Amount"
                                            name="membership_plan"
                                            rules={[{ required: true, message: 'Select Plan' }]}
                                        >
                                            <Select placeholder="Select Plan" style={{ width: '120px' }} onChange={(value) => {
                                                let d = membershipPlans.find((plan) => plan.plan_name === value)
                                                addForm.setFieldsValue({
                                                    // membership_plan:d.plan_name,
                                                    amount: d.amount,
                                                })
                                            }}>
                                                {membershipPlans.map(item => <option value={item.plan_name}>{item.plan_name}</option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            //  label="Amount"
                                            name="amount"
                                        // rules={[{ required: true, message: 'Enter Amount' }]}
                                        >
                                            <Input disabled />
                                        </Form.Item>

                                    </Input.Group>
                                </Form.Item>

                            </Col>
                        </Row> {/* tow column row end */}
                        <Row> {/* tow column row start */}
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item
                                    label="Cheque/DD/NEFT/Notes"
                                    name="payment_note"

                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ padding: '0px 20px 0px 20px' }}>
                                <Form.Item

                                    name="activate"

                                >
                                    <Checkbox onChange={(e) => {
                                        setIsActivate(e.target.checked);
                                    }}>Activate/Approve</Checkbox>
                                </Form.Item>

                            </Col>
                        </Row> {/* tow column row end */}


                        <Form.Item wrapperCol={{ offset: 13, span: 24 }}>
                            <Button size="large" type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>

                    </Form>)} 



                </Spin>


            </div>

        </>
    );
};

export default MakePayment;