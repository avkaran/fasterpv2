import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import { FormViewItem } from '../../../../comp';
import moment from 'moment'
import FormItem from 'antd/es/form/FormItem';
import { addToCart,getCart } from '../../../../models/cart';
const ViewTour = (props) => {
    const context = useContext(PsContext);
    const [addeditFormBooking] = Form.useForm();
    const navigate = useNavigate();
    const [viewData, setViewData] = useState(null);
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        loadViewData();
        addeditFormBooking.setFieldsValue({
            bookings: { no_of_adults: 1 }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadViewData = () => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from products where status=1 and id=" + props.productId
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res) => {
            setViewData(res[0]);
            setLoader(false);
        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const passportExpiryDateOnChange = (date) => {
        addeditFormBooking.setFieldsValue({
            bookings: { passport_expiry_date: dayjs(date).format('YYYY-MM-DD') }
        })
    }
    const dateOnChange = (date) => {
        addeditFormBooking.setFieldsValue({
            bookings: { date: dayjs(date).format('YYYY-MM-DD') }
        })
    }
    const addeditFormBookingOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.bookings).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })
        form.append('user_id', context.customerUser.id)
        form.append('booking_type', 'tour')
        form.append('room_or_tour_id', props.tourId)
        form.append('total_cost', viewData.price)

        context.psGlobal.apiRequest('admin/bookings/add-booking', "prod", form).then((res) => {


            setLoader(false);
            message.success('Booking Made Successfully.');
            props.onSaveFinish();

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })

    };
    return (
        <>

            <Card title={viewData ? viewData.product_name : '-'} extra={<MyButton type="outlined" href="/#/public/products">All Products</MyButton>}>

                <Spin spinning={loader}>
                    {
                        viewData && (<>

                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Image src={context.baseUrl + '/cloud-file/' + encodeURIComponent(encodeURIComponent(viewData.product_image))} />
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={24}>
                                            <span style={{ color: '#1976bc', fontSize: '24px', fontWeight: 'bold' }}>{viewData.product_name}</span>
                                        </Col>
                                    </Row>
                                    <Row gutter={16} style={{ marginTop: '5px' }}>

                                        <Col className='gutter-row' xs={24} xl={24}>
                                            Price <span style={{ color: '#1976bc', fontSize: '14px', fontWeight: 'bold' }}>: {"Dhs. " + viewData.selling_price.toString()}</span>
                                        </Col>

                                    </Row>
                                    {
                                        !props.isLogggedIn && (<>
                                            <Form
                                                name="basic"
                                                form={addeditFormBooking}
                                                labelAlign="left"
                                                labelCol={{ span: 8 }}
                                                wrapperCol={{ span: 20 }}
                                                initialValues={{ remember: true }}
                                                onFinish={addeditFormBookingOnFinish}
                                                autoComplete="off"
                                            >
                                                <Row style={{ marginTop: '10px' }}>
                                                   
                                                    <Col className='gutter-row' xs={24} xl={24}>
                                                       
                                                    </Col>




                                                  
                                                </Row>


                                                <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                                                    <Space>
                                                        
                                                        <MyButton  size="large" type="outlined" onClick={()=>{
                                                            addToCart(viewData);
                                                            console.log('cart',getCart())
                                                            message.success("Added to Cart")
                                                        }}>
                                                           Add to Cart
                                                        </MyButton>
                                                        <MyButton size="large" type="primary" href="#/public/cart">
                                                          View Cart
                                                        </MyButton>
                                                    </Space>

                                                </FormItem>

                                            </Form>
                                        </>)
                                    }
                                   


                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: '5px' }}>
                                <Col className='gutter-row' xs={24} xl={24}>
                                    <div dangerouslySetInnerHTML={{ __html: viewData.product_description }}></div>
                                </Col>
                            </Row>



                        </>)
                    }

                </Spin>
            </Card>

        </>
    );

}
export default ViewTour;