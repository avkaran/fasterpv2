
import React, { useState, useEffect, useContext, useRef } from 'react';
import { message, Spin } from 'antd';
import { MyButton } from '../../../../comp'
import { Modal, Form, Button, InputNumber, Row, Col, Space } from 'antd';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faMobile } from '@fortawesome/free-solid-svg-icons'
import PsContext from '../../../../context';
import { MyOTPInput } from '../../../../comp';
import { ViewItem } from '../../../../comp';
import { resetServerContext } from 'react-beautiful-dnd';
import Countdown from 'react-countdown';
const EmailVerification = (props) => {
    const { isEmailVerified, dataItem } = props;
    const context = useContext(PsContext);
    const [visibleModal, setvisibleModal] = useState(false);
    const currentOTP = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isEmailSend, setIsEmailSend] = useState(false);
    const [sendEmailLoading,setSendEmailLoading]=useState(false);
    useEffect(() => {
       
        if (!isEmailVerified) {

            setvisibleModal(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onResendClick = () => {
        // var otp = Math.floor(1000 + Math.random() * 1000);
        setSendEmailLoading(true);
        var emailData = {
            subject: '[Activate] your WTMU account created please activate now', //query_type=insert | update | delete | query
            msg_body: `<h1>Your WTMU Account Created Successfully</h1><br/>
            Click the below link to Activate the account
            <br/>Activate Link : `+ 'https://worldtamilmusicuniversity.com/apps/#/member-verify-email?q='+ context.psGlobal.encrypt(context.customerUser.id.toString()),
            to_emails: [context.customerUser.email]
        };
        context.psGlobal.sendEmail(emailData).then((res) => {
            if(res){
            setIsEmailSend(true);
            setSendEmailLoading(false);
            }
            else{
                message.error("Error on Sending Email, Try Some time later.")
            }
           
            //  currentOTP.current = otp;
            //  setShowOTPInput(true)
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
                closable={false}
                style={{ marginTop: '20px' }}
                width={600}
                //onCancel={() => { setvisibleModal(false); }}
                // footer={null}
                //   onCancel={() => { setVisibleOtpModal(false) }}
                title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faMobile} /> &nbsp;Email Verification?</span>}
            >
                <Spin spinning={loading}>




                    <Row gutter={16} style={{ marginTop: '10px' }}>
                        <Col className='gutter-row' xs={24} xl={8}>Your Email</Col>
                        <Col className='gutter-row' xs={24} xl={16} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{dataItem.email}</span>
                        </Col>
                    </Row>
                    {
                        !isEmailSend && (<Row gutter={16} style={{ marginTop: '10px', fontSize: '15px', color: cyan[7] }}>
                            <Col xs={24} xl={24}>
                                <Space><MyButton type="primary" loading={sendEmailLoading} onClick={onResendClick}>Send Activation Link</MyButton>
                                {/* <MyButton type="outlned" onClick={() => setvisibleModal(false)}>Skip </MyButton> */}
                                </Space>
                            </Col>
                        </Row>)
                    }


                    {
                        isEmailSend && (<><Row gutter={16} style={{ marginTop: '10px', fontSize: '15px', color: cyan[7] }}>
                            <Col xs={24} xl={24}>
                                Verify Your Email
                            </Col>
                        </Row>
                            <Row gutter={16}>
                                <Col xs={24} xl={24} >
                                Check your Email Inbox/Spam. and click the activation Link. if email not received, click resent.
                                <br/>
                                <Countdown date={Date.now() + 120000}>
                                <MyButton type="primary" loading={sendEmailLoading} onClick={onResendClick}>Resend Activation Link</MyButton>
                                </Countdown>
                                </Col>
                            </Row></>)
                    }



                </Spin>
            </Modal>
        </>
    );

}
export default EmailVerification;