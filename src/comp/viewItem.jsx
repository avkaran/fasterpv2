import React, { useState,useEffect } from 'react';
import { Row, Col } from 'antd';
import { cyan } from '@ant-design/colors';
const ViewItem = (props) => {
   
    // eslint-disable-next-line no-unused-vars
    const { label, value, labelCol, wrapperCol, ...other } = props;
    const [labelColumnSize, setLabelColumnSize] = useState(12);
    const [wrapperColumnSize, setWrapperColumnSize] = useState(24)
    useEffect(() => {
        if (labelCol)
            setLabelColumnSize(labelCol);
        if (wrapperCol)
            setWrapperColumnSize(wrapperCol);

        console.log(labelCol,wrapperCol)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Row gutter={16} style={{marginTop:'8px'}}>
                <Col className='gutter-row' xs={24} xl={labelColumnSize}>{label}</Col>
                <Col className='gutter-row' xs={24} xl={wrapperColumnSize} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{value}</span></Col>
            </Row>
        </>
    );
}
export {
    ViewItem,
} 