import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Row, Col, Form, Input, List, Typography, message } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import { FormViewItem } from '../../../../comp';
import moment from 'moment'
import FormItem from 'antd/es/form/FormItem';
import { addToCart, getCart, clearCart } from '../../../../models/cart';
const Cart = (props) => {
    const context = useContext(PsContext);
    const [addeditFormBooking] = Form.useForm();

    const [loader, setLoader] = useState(false)
    const [form] = Form.useForm();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const cart = getCart();
        setCartItems(cart);

        let total = 0;
        cart.forEach(item => {
            const price = item.offer_price > 0 ? item.offer_price : item.selling_price;
            total += price * (item.quantity || 1);
        });
        setTotalPrice(total);
    }, []);
    const onFinish = (values) => {
        if (cartItems.length==0)
        {
            message.error("No Items in cart");
            return;
        }
        console.log('Customer Data:', values);
        setLoader(true)
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        processedValues['order_date'] = dayjs().format("YYYY-MM-DD")

        var reqDataInsert = {
            query_type: 'insert',
            table: 'orders',
            values: processedValues

        };
        context.psGlobal.apiRequest(reqDataInsert, "prod").then((res) => {

          
            // console.log('test',res)
            var orderId = res;
            var reqDataUpdate = {
                query_type: 'update',
                table: 'orders',
                where: { id: orderId },
                values: { order_id: 'ORD-' + orderId }

            };
            context.psGlobal.apiRequest(reqDataUpdate, "prod").then((resUpdate) => {
                orderItemsUpdate(cartItems, orderId).then(res => {
                    message.success('Enquiry sent successfully!');
                    clearCart();
                    setCartItems([]);
                    setTotalPrice(0);
                    form.resetFields();
                    setLoader(false)
                })


            })
            // 

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })




    };
    const orderItemsUpdate = async (cart, orderId) => {

        for (const item of cart) {

            var processedValues = {
                order_id: orderId,
                product_id: item.id,
                product_name: item.product_name,
                quantity: item.quantity,
                selling_price: item.selling_price,
                offer_price: item.offer_price,
            };

            var reqDataInsert = {
                query_type: 'insert',
                table: 'order_items',
                values: processedValues

            };

            await context.psGlobal.apiRequest(reqDataInsert, "dev")
        }
    }


    return (
        <>
            <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
                <Row gutter={24}>
                    {/* Left side: Customer Form */}
                    <Col xs={24} md={12}>
                        <Spin spinning={loader}>


                            <Card title="Customer Information" bordered={false} style={{ borderRadius: '12px' }}>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        label="First Name"
                                        name="first_name"
                                        rules={[{ required: true, message: 'Please enter your first name' }]}
                                    >
                                        <Input placeholder="Enter your first name" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Last Name"
                                        name="last_name"

                                    >
                                        <Input placeholder="Enter your last name" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Address"
                                        name="address"
                                        rules={[{ required: true, message: 'Please enter address' }]}

                                    >
                                        <Input.TextArea rows={3} placeholder="Address" />
                                    </Form.Item>
                                    <Form.Item
                                        label="Mobile Number"
                                        name="mobile"
                                        rules={[{ required: true, message: 'Please enter your mobile number' }]}
                                    >
                                        <Input placeholder="Enter your mobile number" />
                                    </Form.Item>

                                    <Button type="primary" htmlType="submit" block>
                                        Send Enquiry
                                    </Button>
                                </Form>
                            </Card>
                        </Spin>
                    </Col>

                    {/* Right side: Cart Items */}
                    <Col xs={24} md={12}>
                        <Card title="Your Cart" bordered={false} style={{ borderRadius: '12px' }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={cartItems}
                                renderItem={item => {
                                    const price = item.offer_price > 0 ? item.offer_price : item.selling_price;
                                    return (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={<span>{item.product_name}</span>}
                                                description={
                                                    <>
                                                        Price: Dhs. {price} × {item.quantity || 1}
                                                    </>
                                                }
                                            />
                                            <div>Dhs. {price * (item.quantity || 1)}</div>
                                        </List.Item>
                                    )
                                }}
                            />
                            <div style={{ marginTop: '20px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
                                Total: Dhs. {totalPrice}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>


        </>
    );

}
export default Cart;