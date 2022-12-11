
import React, { useState, useEffect, useContext, useRef } from 'react';
import { message, Spin } from 'antd';
import { MyButton } from '../../../../comp'
import { Modal, Form, Button, InputNumber, Row, Col, Space, Input } from 'antd';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faMobile } from '@fortawesome/free-solid-svg-icons'
import PsContext from '../../../../context';
import Countdown from 'react-countdown';
import { apiRequest, sendEmail } from "../../../../models/core";
import moment from 'moment'
const CustomerForgetPassword = (props) => {
    const { visible, onClose, ...other } = props;
    const context = useContext(PsContext);
    const [visibleModal, setvisibleModal] = useState(false);
    const currentOTP = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isEmailSend, setIsEmailSend] = useState(false);
    const clockRef = useRef();
    useEffect(() => {
        setvisibleModal(visible);
    }, [visible]);

    const onFinishForgetPassword = (values) => {
        setLoading(true)
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select id,email,first_name,last_name from users where email='" + values.email.trim() + "'"
        };
        apiRequest(reqData, "prod").then((res) => {
            if (res.length > 0) {
                var emailData = {
                    subject: '[Reset Password] Reset password for your account', //query_type=insert | update | delete | query
                    msg_body: `<h1>You raised reset password. if not, ignore this email</h1><br/>
                        If Yes,Click the below link to reset your WTMU account password
                        <br/>Reset Link : `+ 'https://worldtamilmusicuniversity.com/apps//member-reset-password?q=' + context.psGlobal.encrypt(moment().add(1, 'hours').unix().toString()+"$"+res[0].id.toString()),
                    to_emails: [res[0].email]
                };
                sendEmail(emailData).then((resInner) => {
                    if (resInner) {
                        setIsEmailSend(true);
                        //setSendEmailLoading(false);
                        message.success("Password Reset Link Send to Email")
                        setLoading(false);
                        clockRef.current.start();
                    }
                    else {
                        message.error("Error on Sending Email, Try Some time later.");
                        setLoading(false);
                    }


                }).catch(err => {
                    message.error(err);
                    setLoading(false);
                })
            }
            else {
                setLoading(false);
                message.error("User Not found with email id")
            }
        }).catch(err => {
            message.error(err);
            setLoading(false);
        })
    }
    return (
        <>
            <Modal
                visible={visibleModal}
                zIndex={10000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                onCancel={() => { setvisibleModal(false); onClose(); }}
                // footer={null}
                //   onCancel={() => { setVisibleOtpModal(false) }}
                title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faMobile} /> &nbsp;Send Password reset link.</span>}
            >
                <Spin spinning={loading}>
                    <Form
                        name="basic"
                        //   form={loginForm}
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinishForgetPassword}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please Enter Email Id' }]}
                        >
                            <Input placeholder="Email Id" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                            {
                                isEmailSend && (<Countdown date={Date.now() + 120000}
                                ref={clockRef}>
                                    <Button size="large" type="primary" htmlType="submit" style={{ background: '#286b2e' }}>
                                        Send Reset Link
                                    </Button>
                                </Countdown>)
                            }
                            {
                                !isEmailSend && (<Button size="large" type="primary" htmlType="submit" style={{ background: '#286b2e' }}>
                                    Send Reset Link
                                </Button>)
                            }

                        </Form.Item>
                    </Form>

                </Spin>
            </Modal>
        </>
    );

}
export default CustomerForgetPassword;