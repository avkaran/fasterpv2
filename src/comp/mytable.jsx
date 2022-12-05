import React,{} from 'react';
import './comStyle.css'
import { Table } from 'antd';
const MyTable = (props) => {
   
    const { columns, dataSource, ...other } = props;
    return (
        <Table
                {...other}
                bordered pagination={false} columns={columns} dataSource={dataSource}
            />
    );
}
export {
    MyTable,
} 