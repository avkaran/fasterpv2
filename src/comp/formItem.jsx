import React, { useEffect } from 'react';
import { Form } from 'antd';
const FormItem = (props) => {
    // eslint-disable-next-line no-unused-vars
    const { label, name, rules,valuePropName, ...other } = props;
    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Item
            //label={<span style={{fontWeight:'bold'}}>{label}</span>}
            label={label}
            name={name}
            
            rules={rules}
            {...other}
        >
            {props.children}
        </Form.Item>
    );
}
export {
    FormItem,
} 