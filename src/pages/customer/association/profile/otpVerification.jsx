
import React, { useState, useEffect, useContext, useRef } from 'react';
import { message, Spin } from 'antd';
import { MyButton } from '../../../../comp'
import { Modal, Form, Button, InputNumber, Row, Col,Space } from 'antd';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faMobile } from '@fortawesome/free-solid-svg-icons'
import PsContext from '../../../../context';
import { MyOTPInput } from '../../../../comp';
import { ViewItem } from '../../../../comp';
const OtpVerification = (props) => {
    const { isOtpVerified, dataItem } = props;
    const context = useContext(PsContext);
    const [visibleModal, setvisibleModal] = useState(false);
    const currentOTP = useRef(null);
    const [loading, setLoading] = useState(false);
    const [otpTemplate, setOtpTemplate] = useState(null);
    const [showOTPInput,setShowOTPInput]=useState(false)
    useEffect(() => {
        if (!isOtpVerified) {

            setvisibleModal(true);
            loadCustomerOTP();

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadCustomerOTP = () => {
        var reqData = [{
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select mobile_otp from members where id='" + context.customerUser.id + "' and status='1'"
        },
        {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from sms_templates where template_for='otp' and status='1'"
        }];
        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {
            // currentOTP.current = res[0][0].mobile_otp;
            setOtpTemplate(res[1][0]);
        }).catch(err => {
            message.error(err);

        })
    }
    const onOTPGiven = (otp) => {
        setLoading(true);
        if (parseInt(currentOTP.current) === parseInt(otp)) {
            var reqData = {
                query_type: 'update',
                table: 'members',
                where: { id: context.customerUser.id },
                values: { is_otp_verified: '1' }

            };

            context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {
                var user = context.customerUser;
                user.is_otp_verified = '1';
                context.updateCustomerUser(user);
                setvisibleModal(false);
                setLoading(false);

            }).catch(err => {
                message.error(err);
                setLoading(false);
            })
        }
        else {
            message.error("Wrong OTP");
            setLoading(false);
        }


    }
    const onResendClick = () => {
        var otp = Math.floor(1000 + Math.random() * 1000);

        var smsData = {
            template_id: otpTemplate.template_id, //query_type=insert | update | delete | query
            unicode: otpTemplate.is_unicode,
            messages: [
                {
                    mobile_no: context.customerUser.mobile_no,
                    message: otpTemplate.template.replace("{Name}", context.customerUser.name).replace("{OTP}", otp)
                }
            ]
        };
        context.psGlobal.sendSms(smsData).then((res) => {
            currentOTP.current = otp;
            setShowOTPInput(true)
            // console.log('otp when resend'+ currentOTP.current)
        }).catch(err => {
            message.error(err);
        })
    }
    return (
        <>
            <Modal
                visible={visibleModal && otpTemplate}
                zIndex={10000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                onCancel={() => { setvisibleModal(false); }}
                // footer={null}
                //   onCancel={() => { setVisibleOtpModal(false) }}
                title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faMobile} /> &nbsp;OTP Verification?</span>}
            >
                <Spin spinning={loading}>




                    <Row gutter={16} style={{ marginTop: '10px' }}>
                        <Col className='gutter-row' xs={24} xl={8}>Mobile Number</Col>
                        <Col className='gutter-row' xs={24} xl={16} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{dataItem.mobile_no}</span>
                        </Col>
                    </Row>
                    {
                        !showOTPInput && (<Row gutter={16} style={{ marginTop: '10px', fontSize: '15px', color: cyan[7] }}>
                        <Col xs={24} xl={24}>
                            <Space><MyButton type="primary" onClick={onResendClick}>Sent OTP</MyButton><MyButton type="outlned" onClick={()=>setvisibleModal(false)}>Skip </MyButton></Space>
                        </Col>
                    </Row>)
                    }
                    

                    {
                        showOTPInput && (<><Row gutter={16} style={{ marginTop: '10px', fontSize: '15px', color: cyan[7] }}>
                            <Col xs={24} xl={24}>
                                Enter the OTP
                            </Col>
                        </Row><Row gutter={16}>
                                <Col xs={24} xl={24} noStyle><MyOTPInput OTPLength={4} onResendClick={onResendClick} onOTPChange={onOTPGiven} /></Col>
                            </Row></>)
                    }



                </Spin>
            </Modal>
        </>
    );

}
export default OtpVerification;
