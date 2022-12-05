import React, { useEffect } from 'react';
import { Form } from 'antd';
import { cyan } from '@ant-design/colors';
const FormViewItem = (props) => {
    // eslint-disable-next-line no-unused-vars
    const { label, ...other } = props;
    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Item
            //label={<span style={{fontWeight:'bold'}}>{label}</span>}
            label={label}
          //  name={name}
           // rules={rules}
            {...other}
        >
            {typeof props.children === 'string'?<span style={{ color: cyan[6], fontWeight: 'bold' }}>: {props.children}</span>:props.children}
        </Form.Item>
    );
}
export {
    FormViewItem,
} 