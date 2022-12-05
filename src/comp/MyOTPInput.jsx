import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { blue, cyan } from '@ant-design/colors';
import OTPInput, { ResendOTP } from "otp-input-react";

const MyOTPInput = (props) => {
    const [OTP, setOTP] = useState("");

    // eslint-disable-next-line no-unused-vars
    const { onResendClick, onOTPChange, OTPLength, ...other } = props;
    const renderButton = (buttonProps) => {
        return <Button type='primary' {...buttonProps} style={{ background: cyan[7] }}>Resend OTP</Button>;
    };
    const renderTime = (remainingTime) => {
        return <span>{remainingTime} seconds remaining</span>;
    };
    useEffect(() => {
        if (OTP.toString().length === 4)
            onOTPChange(OTP)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [OTP]);
    return (
        <>
            <OTPInput
                inputStyles={{
                    width: '3rem',
                    height: '3rem',
                    margin: '20px 1rem',
                    fontSize: '1rem',
                    borderRadius: 4,
                    border: '2px solid rgba(0,0,0,0.3)',
                }}
                value={OTP}
                onChange={setOTP} autoFocus OTPLength={OTPLength} otpType="number" disabled={false} />
            <ResendOTP onResendClick={onResendClick} maxTime={30}
                renderButton={renderButton} renderTime={renderTime} />
        </>
    );
}
export {
    MyOTPInput,
} 