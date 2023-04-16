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
const ViewTour = (props) => {
    const context = useContext(PsContext);
    const [addeditFormBooking] = Form.useForm();
    const navigate = useNavigate();
    const [viewData, setViewData] = useState(null);
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        loadViewData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadViewData = () => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from tour_packages where status=1 and id=" + props.tourId
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res) => {
            setViewData(res[0]);
            setLoader(false);
        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const passportExpiryDateOnChange=(date)=>{
        addeditFormBooking.setFieldsValue({
            bookings: { passport_expiry_date: dayjs(date).format('YYYY-MM-DD') }
        })
    }
    const dateOnChange=(date)=>{
        addeditFormBooking.setFieldsValue({
            bookings: { date: dayjs(date).format('YYYY-MM-DD') }
        })
    }
    const addeditFormBookingOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.users).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })
        
        form.append('room_or_tour_id',props.tourId)

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

            <Card title={viewData ? viewData.package_name : '-'} extra={<MyButton type="outlined" href="/#/0/customer/mytours">All Tours</MyButton>}>

                <Spin spinning={loader}>
                    {
                        viewData && (<>

                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Image src={context.baseUrl + '/cloud-file/' + encodeURIComponent(encodeURIComponent(viewData.package_image))} />
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>

                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={24}>
                                            <span style={{ color: '#1976bc', fontSize: '24px', fontWeight: 'bold' }}>{viewData.package_name}</span>
                                        </Col>
                                    </Row>
                                    <Row gutter={16} style={{ marginTop: '5px' }}>

                                        <Col className='gutter-row' xs={24} xl={24}>
                                            Price <span style={{ color: '#1976bc', fontSize: '14px', fontWeight: 'bold' }}>: {"$" + viewData.price.toString() + "/Traveller"}</span>
                                        </Col>

                                    </Row>
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


                                                <FormItem
                                                    label="Date"
                                                    name={['bookings', 'date']}
                                                    rules={[{ required: true, message: 'Please Enter date' }]}
                                                >

                                                    <Space direction="vertical">
                                                        <DatePicker
                                                            onChange={dateOnChange} 
                                                            format='DD/MM/YYYY'

                                                            //disabledDate={dateDisabled}
                                                            allowClear={false}
                                                        />
                                                    </Space>
                                                </FormItem>

                                            </Col>

                                            <Col className='gutter-row' xs={24} xl={24}>
                                                <Form.Item
                                                    label="No Of Adults"
                                                // name="membership_plan"
                                                // rules={[{ required: true, message: 'Enter Amount' }]}
                                                >
                                                    <Input.Group>
                                                        <Space>
                                                            <Form.Item
                                                                // label="No Of Adults"

                                                                name={['bookings', 'no_of_adults']}
                                                            // rules={[{ required: true, message: 'Please Enter no of adults' }]}

                                                            >
                                                                <InputNumber placeholder="No Of Adults" type="number"
                                                                    defaultValue={1}
                                                                    style={{ width: '50px' }} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label=" Child"


                                                                name={['bookings', 'no_of_child']}
                                                            // rules={[{ required: true, message: 'Please Enter no of child' }]}

                                                            >
                                                                &nbsp;<InputNumber placeholder="No Of Child" type="number"
                                                                    defaultValue={0}
                                                                    style={{ width: '50px' }} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                label=" Infants"
                                                                name={['bookings', 'no_of_infant']}
                                                            // rules={[{ required: true, message: 'Please Enter no of infants' }]}

                                                            >
                                                                &nbsp;<InputNumber placeholder="No Of Infant" type="number"
                                                                    defaultValue={0}
                                                                    style={{ width: '50px' }} />
                                                            </Form.Item>
                                                        </Space>
                                                    </Input.Group>
                                                </Form.Item>
                                            </Col>



                                            <Col className='gutter-row' xs={24} xl={24}>

                                                <FormItem
                                                    label="Passport No"
                                                    name={['bookings', 'passport_no']}

                                                >
                                                    <Input placeholder="Passport No" />
                                                </FormItem>

                                            </Col>

                                            <Col className='gutter-row' xs={24} xl={24}>

                                                <FormItem
                                                    label="Passport Expiry Date"
                                                    name={['bookings', 'passport_expiry_date']}
                                                // rules={[{ required: true, message: 'Please Enter Expiry Date' }]}
                                                >

                                                    <Space direction="vertical">
                                                        <DatePicker
                                                            onChange={passportExpiryDateOnChange} 
                                                            format='MM/YYYY'
                                                            picker="month"

                                                            //disabledDate={passportExpiryDateDisabled}
                                                            allowClear={true}
                                                        />
                                                    </Space>
                                                </FormItem>

                                            </Col>

                                            <Col className='gutter-row' xs={24} xl={24}>

                                                <FormItem
                                                    label="Passport Image"
                                                    name={['bookings', 'passport_image']}

                                                >

                                                    <ImageUpload


                                                        storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                                        onFinish={(fileName) => { addeditFormBooking.setFieldsValue({ bookings: { passport_image: fileName } }) }}
                                                    />
                                                </FormItem>

                                            </Col>

                                            <Col className='gutter-row' xs={24} xl={24}>

                                                <FormItem
                                                    label="Descripiton"
                                                    name={['bookings', 'descripiton']}

                                                >
                                                    <Input.TextArea rows={3} />
                                                </FormItem>

                                            </Col>
                                        </Row>


                                        <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                                            <Space>
                                                <Button size="large" type="outlined" onClick={() => addeditFormBooking.resetFields()}>
                                                    Reset
                                                </Button>
                                                <MyButton size="large" type="primary" htmlType="submit">
                                                    Book Now
                                                </MyButton>
                                            </Space>

                                        </FormItem>

                                    </Form>

                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: '5px' }}>
                                <Col className='gutter-row' xs={24} xl={24}>
                                    <div dangerouslySetInnerHTML={{ __html: viewData.description }}></div>
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