import React, { useEffect } from 'react';
import { Form } from 'antd';
import { cyan } from '@ant-design/colors';
const FormViewItem = (props) => {
    // eslint-disable-next-line no-unused-vars
    const { label,colon, ...other } = props;
    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Item
            //label={<span style={{fontWeight:'bold'}}>{label}</span>}
            label={label}
            colon={false}
          //  name={name}
           // rules={rules}
            {...other}
        >
            {typeof props.children === 'string' || typeof props.children === 'number'?<span style={{ color: cyan[6], fontWeight: 'bold' }}>{colon===undefined?':':colon?':':''} {props.children}</span>:<>{colon===undefined?':':colon?':':''} {props.children}</>}
        </Form.Item>
    );
}
export {
    FormViewItem,
} 