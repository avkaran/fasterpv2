import React, { useState, useEffect, useContext } from 'react';
import { Button, Checkbox, Form, Input, Space, Spin, Select, DatePicker, Row, Col, message } from 'antd';
import { useNavigate,useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { CardFixedTop, momentDate } from '../../../../../utils';
import { listCollections } from '../../../../../models/core'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Steps } from 'antd';
import PsContext from '../../../../../context';
const MakePayment = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
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
            paid_date: dayjs().format('YYYY-MM-DD')
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
    const loadViewData = ($id) => {

        setViewData([]);
        setLoader(true);

        axios.post('v1/admin/view-member/' + $id).then(res => {
            if (res['data'].status === '1') {
                setViewData(res['data'].data);
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };
    const onFinish = (values) => {
        setLoader(true);
        var form = new FormData();
        Object.entries(values).forEach(([key, value], index) => {
            // 👇️ name Tom 0, country Chile 1
            console.log(key, value, index);
            if (key === 'paid_date')
                form.append('paid_date', selDate)
            else if (key === 'activate')
                if (isActivate) form.append('member_status', 'active')
                else form.append('member_status', 'waiting')
            else
                form.append(key, value)
        });


        axios.post('v1/admin/update-payment/' + memberId, form).then(res => {
            if (res['data'].status === '1') {
                toast.success(res['data'].message || 'Success');
                navigate('/' + userId + '/admin/members')
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onChangePaidDate = (date) => {
        addForm.setFieldsValue({
            paid_date: dayjs(date).format('YYYY-MM-DD')
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
        return current && current > dayjs();
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
                    <Form
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
                                    {momentDate(viewData.dob, 'DD/MM/YYYY')}
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
                                            defaultValue={dayjs()}
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
                                    name="payment_method"
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

                    </Form>



                </Spin>


            </div>

        </>
    );
};

export default MakePayment;