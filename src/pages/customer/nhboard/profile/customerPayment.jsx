
import React, { useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import { MyButton } from '../../../../comp'
import { Select } from 'antd';
import { Modal, Form, Button, Input, Spin,Row,Col } from 'antd';
import PsContext from '../../../../context';
import { green } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faMobile } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'

const CustomerPayment = (props) => {
    const navigate = useNavigate();
    const context = useContext(PsContext);
    const { Option } = Select;
    const { isUnpaid, dataItem, ...other } = props;
    const [paymentForm] = Form.useForm();
    const [visibleModal, setvisibleModal] = useState(false);
    const [membershipPlans, setMembershipPlans] = useState([]);
    const [loader, setLoader] = useState(false);
    const [paymentTemplate, setPaymentTemplate] = useState(null);
    const [activateMemberTemplate, setActivateMemberTemplate] = useState(null);
    const [adminUsers,setAdminUsers]=useState(null);
    useEffect(() => {
        loadData();
        if (isUnpaid)
            setvisibleModal(true);
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onPaymentSubmit = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value)
                processedValues[key] = value;

        });
        processedValues['payment_status'] = 'waiting';
        var reqData = {
            query_type: 'update',
            table: 'members',
            where: { id: dataItem.id },
            values: processedValues
        };

        context.psGlobal.apiRequest(reqData,"prod").then((res) => {
            sentPaymentConfirmationSms();

            var user = context.customerUser;
            user.payment_status = 'waiting';
            context.updateCustomerUser(user);

            message.success("Payment Details sent to Admin");
            setLoader(false);
            //navigate('/profile');
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })

    }
    const sentPaymentConfirmationSms = () => {
        var smsData = {
            template_id: paymentTemplate.template_id, //query_type=insert | update | delete | query
            unicode: paymentTemplate.is_unicode,
            messages: [
                {
                    mobile_no: context.customerUser.mobile_no,
                    message: paymentTemplate.template.replace("{Name}", context.customerUser.name)
                }
            ]
        };
        context.psGlobal.sendSms(smsData).then((res) => {
            
        }).catch(err => {
            message.error(err);
        })


        context.psGlobal.shortenUrl('https://24stardoctors.com/manage//activate-member/' + context.psGlobal.encrypt(context.customerUser.id.toString())).then((tinyUrl) => {
            var messages=[];
            adminUsers.forEach(item=>{
                messages.push(
                    {
                        mobile_no:item.mobile_no, //admin mobile number
                        message: activateMemberTemplate.template.replace("{Name}", context.customerUser.name).replace("{Link}", tinyUrl)
                    }
                )
            })
            smsData = {
                template_id: activateMemberTemplate.template_id, //query_type=insert | update | delete | query
                unicode: activateMemberTemplate.is_unicode,
                messages: messages
            };
            context.psGlobal.sendSms(smsData).then((res) => {
              
            }).catch(err => {
                message.error(err);
            })

        }).catch(err => {
            message.error(err);

        })

    }
    const loadData = () => {

        //setLoader(true);
        var reqData = [{
            query_type: 'query',
            query: "select *  from membership_plans",
        },
        {
            query_type: 'query',
            query: "select * from sms_templates where template_for='payment-confirmation' and status='1'",

        },
        {
            query_type: 'query',
            query: "select * from sms_templates where template_for='activate-member' and status='1'",

        },
        {
            query_type: 'query',
            query: "select mobile_no from vi_users where role='admin' and status='1'",

        }
        ];
        context.psGlobal.apiRequest(reqData, "prod").then((res) => {
            setMembershipPlans(res[0]);
            setPaymentTemplate(res[1][0]);
            setActivateMemberTemplate(res[2][0]);
            setAdminUsers(res[3])
        }).catch(() => {
            message.error("Error");
            // setLoader(false);
        })
    }
    const onPlanChange = (value) => {
        let d = membershipPlans.find((plan) => plan.plan_name === value)
        paymentForm.setFieldsValue({
            amount: d.amount,
        })
    }
   
    return (
        <>
            <Modal
                visible={visibleModal && paymentTemplate && activateMemberTemplate && adminUsers}
                // zIndex={10000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                onCancel={() => { setvisibleModal(false); }}
                // footer={null}
                // onCancel={() => { setVisibleOtpModal(false) }}
                title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faMobile} /> &nbsp; Pay Now</span>}
                {...other}
            >
                <div>
                    <Spin spinning={loader}>

                       {
                        context.customerUser.payment_status==='unpaid' && (<Form
                            name="basic"
                            form={paymentForm}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            onFinish={onPaymentSubmit}
                            autoComplete="off"
                        >

                            <Form.Item key="1"
                                label="Membership Plan"
                            // name="membership_plan"
                            // rules={[{ required: true, message: 'Enter Amount' }]}
                            >
                                <Input.Group compact>
                                    <Form.Item key="1a"
                                        // label="Amount"
                                        name="membership_plan"
                                        rules={[{ required: true, message: 'Select Plan' }]}
                                    >
                                        <Select placeholder="Select Plan" style={{ width: '120px' }} onSelect={onPlanChange}>
                                            {membershipPlans.map(item => <Option key={item.plan_name} value={item.plan_name}>{item.plan_name}</Option>)}
                                        </Select>

                                    </Form.Item>
                                    <Form.Item key="1b"
                                        //  label="Amount"
                                        name="amount"
                                    // rules={[{ required: true, message: 'Enter Amount' }]}
                                    >
                                        <Input disabled />
                                    </Form.Item>

                                </Input.Group>
                            </Form.Item>
                            <Form.Item
                                label="Payment Mode"
                                name="payment_mode"
                                rules={[{ required: true, message: 'Please Enter Payment Mode' }]}
                            >

                                <Select
                                    showSearch
                                    placeholder="Payment Mode"

                                    optionFilterProp="children"
                                    //onChange={paymentModeOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'payment-methods')}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Payment Note"
                                name="payment_note"
                                rules={[{ required: true, message: 'Please Enter Payment Note' }]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                            <Form.Item key="2" wrapperCol={{ offset: 8, span: 20 }}>
                                <Button size="large" type="primary" htmlType="submit" style={{}}>
                                    Pay Now
                                </Button>
                            </Form.Item>
                        </Form>)
                       } 
                       {
                        context.customerUser.payment_status==='waiting' && (
                            <Row>
                                Thanks for yor payment we will approve your profile soon. <br/> <Button type="primary" onClick={()=>{
                                     context.customerLogout();	
                                }}>Relogin</Button>
                            </Row>
                        )
                       }
                       </Spin>
                </div>

            </Modal>
        </>
    );

}
export default CustomerPayment;