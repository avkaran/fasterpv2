import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space, Descriptions } from 'antd';
import { Button, Card } from 'antd';
import { Form,Table, Input, Select, InputNumber, Radio, Checkbox, Tag, Typography } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton, FormViewItem } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
const ViewJewelProduct = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [viewData, setviewData] = useState(null);
    const [heading] = useState('Package');
    const { viewIdOrObject, onListClick, userId, formItemLayout, ...other } = props;
    const [viewId, setViewId] = useState(null);

    const [orderedItems, setOrderedItems] = useState([])
    const { Title } = Typography;
    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
        },
        {
            title: 'Unit Price',
            key: 'price',
            render: (text, record) => (
                <span>₹ {record.offer_price > 0 ? record.offer_price : record.selling_price}</span>
            ),
            align: 'right',
        },
        {
            title: 'Total Price',
            key: 'total_price',
            render: (text, record) => (
                <span>₹ {(record.offer_price > 0 ? record.offer_price : record.selling_price) * record.quantity}</span>
            ),
            align: 'right',
        },
    ];
    useEffect(() => {
        if (typeof viewIdOrObject === 'object') { // this one not used
            setViewId(viewIdOrObject.id);
            setviewData(viewIdOrObject);

        } else {
            setViewId(viewIdOrObject)
            loadViewData(viewIdOrObject);
        }

    }, [viewIdOrObject]);
    const totalAmount = orderedItems.reduce((sum, item) => {
        const price = item.offer_price > 0 ? item.offer_price : item.selling_price;
        return sum + price * item.quantity;
    }, 0);
    const loadViewData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from orders where status=1 and id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setviewData(res[0]);

            //get order items details
            var reqDataItems = {
                query_type: 'query',
                query: "select * from order_items where  order_id=" + id
            };
            context.psGlobal.apiRequest(reqDataItems, context.adminUser(userId).mode).then((resItems) => {

                setOrderedItems(resItems);
                console.log('test', orderedItems, res[0])
                setLoader(false);
            })




        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    return (
        <>
            <Spin spinning={loader} >
                {
                    viewData && (<>
                        <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
                            <Card bordered={false} style={{ marginBottom: 24 }}>
                                <Title level={3} style={{ marginBottom: 16 }}>Customer Details</Title>
                                <Descriptions bordered column={2}>
                                    <Descriptions.Item label="Order ID">{viewData.order_id}</Descriptions.Item>
                                    <Descriptions.Item label="Order Date">{viewData.order_date}</Descriptions.Item>
                                    <Descriptions.Item label="First Name">{viewData.first_name}</Descriptions.Item>
                                    <Descriptions.Item label="Last Name">{viewData.last_name}</Descriptions.Item>
                                    <Descriptions.Item label="Mobile">{viewData.mobile}</Descriptions.Item>
                                    <Descriptions.Item label="Address">{viewData.address}</Descriptions.Item>
                                    <Descriptions.Item label="Order Status">{viewData.order_status}</Descriptions.Item>
                                </Descriptions>
                            </Card>

                            <Card bordered={false}>
                                <Title level={3} style={{ marginBottom: 16 }}>Ordered Items</Title>
                                <Table
                                    columns={columns}
                                    dataSource={orderedItems}
                                    pagination={false}
                                    rowKey="id"
                                    summary={() => (
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell colSpan={3} align="right">
                                                <b>Total</b>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell align="right">
                                                <b>₹ {totalAmount}</b>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    )}
                                />
                            </Card>
                        </div>
                    </>)
                }

            </Spin>
        </>
    );

}
export default ViewJewelProduct;