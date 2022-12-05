
import React, { useState, useEffect, useContext, useRef } from 'react';
import { message, Spin } from 'antd';
import { MyButton } from '../../../../comp'
import { Modal, Form, Button, InputNumber, Row, Col, Input } from 'antd';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faMobile } from '@fortawesome/free-solid-svg-icons'
import PsContext from '../../../../context';
import { MyOTPInput } from '../../../../comp';
import { ViewItem } from '../../../../comp';
const OTPLogin = (props) => {
    const { show, onCancel,onLoginSuccess } = props;
    const context = useContext(PsContext);
    const [visibleModal, setvisibleModal] = useState(false);
    const currentOTP = useRef(null);
    const [loading, setLoading] = useState(false);
    const [otpTemplate, setOtpTemplate] = useState(null);
    const [currentPhone, setCurrentPhone] = useState(null);
    const [cusPassword, setCusPassword] = useState(null);
    useEffect(() => {
        loadTemplate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        setvisibleModal(show);
        loadTemplate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);
    const loadTemplate = () => {
        var reqData = [
            {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select * from sms_templates where template_for='login-otp' and status='1'"
            }];
        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {

            setOtpTemplate(res[0][0]);
        }).catch(err => {
            message.error(err);

        })
    }
    const onSendOTPClick = () => {

        var mNo = currentPhone;
        if (mNo.length <= 10)
            mNo = "91" + currentPhone;

        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from hospital_members where status='1' and mobile='" + mNo + "'"
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {
            if (res[0]) {
                setCusPassword(res[0].password);
                onResendClick(res[0].name);
            }
            else
                message.error("Member Not Found")
        }).catch(err => {
            message.error(err);

        })
    }
    const onOTPGiven = (otp) => {
        setLoading(true);
        if (parseInt(currentOTP.current) === parseInt(otp)) {
            onLoginSuccess(currentPhone,context.psGlobal.decrypt(cusPassword));
        }
        else {
            message.error("Wrong OTP");
            setLoading(false);
        }


    }
    const onResendClick = (name) => {
        var mNo = currentPhone;
        if (mNo.length <= 10)
            mNo = "91" + currentPhone;

        var otp = Math.floor(1000 + Math.random() * 1000);

        var smsData = {
            template_id: otpTemplate.template_id, //query_type=insert | update | delete | query
            unicode: otpTemplate.is_unicode,
            messages: [
                {
                    mobile_no: mNo,
                    message: otpTemplate.template.replace("{Name}", name).replace("{OTP}", otp)
                }
            ]
        };
        context.psGlobal.sendSms(smsData).then((res) => {
            currentOTP.current = otp;
            // console.log('otp when resend'+ currentOTP.current)
        }).catch(err => {
            message.error(err);
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
                // onCancel={() => { setvisibleModal(false); }}
                // footer={null}
                onCancel={onCancel}
                title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faMobile} /> &nbsp;OTP Login</span>}
            >
                <Spin spinning={loading}>



                    <Row gutter={16}>
                        <Col xs={24} xl={9}>
                            Mobile No
                        </Col>
                        <Col xs={24} xl={9}>
                            <Input placeholder="Mobile Number" onChange={(e) => { setCurrentPhone(e.target.value); setCusPassword(null); }} />
                        </Col>
                        <Col xs={24} xl={4}>
                            <MyButton type="outlined" onClick={onSendOTPClick}> Sent OTP</MyButton>
                        </Col>
                    </Row>

                    {cusPassword && (
                        <><Row gutter={16} style={{ marginTop: '10px', fontSize: '15px', color: cyan[7] }}>
                            <Col xs={24} xl={24}>
                                Enter the OTP
                            </Col>
                        </Row>
                            <Row gutter={16}>
                                <Col xs={24} xl={24} noStyle>
                                    <MyOTPInput OTPLength={4} onResendClick={onResendClick} onOTPChange={onOTPGiven} />
                                </Col>
                            </Row></>)}
                </Spin>
            </Modal>
        </>
    );

}
export default OTPLogin;
