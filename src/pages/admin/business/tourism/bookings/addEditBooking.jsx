import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { Button as MButton } from 'antd-mobile'
import dayjs from 'dayjs'
//import esES from 'antd/lib/locale-provider/es_ES';
const AddEditBooking = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormHotels] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Booking');
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [editorValue, setEditorValue] = useState('');

    useEffect(() => {

        if (editIdOrObject) {
            if (typeof editIdOrObject === 'object') {
                setCurAction("edit");
                setEditId(editIdOrObject.id);
                setEditData(editIdOrObject);
                setEditValues(editIdOrObject);

            } else {
                setCurAction("edit");
                setEditId(editIdOrObject)
                loadEditData(editIdOrObject);
            }


        } else {
            setCurAction("add");
            addeditFormHotels.setFieldsValue(
                { hotels: { active_status: '1' } }
            )
        }

    }, [editIdOrObject]);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from bookings  where status=1 and id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setEditData(res[0]);
            setEditValues(res[0]);

            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const setEditValues = (mydata) => {
        addeditFormHotels.setFieldsValue({
            bookings: {
                date: dayjs(mydata.date),
                passport_image: mydata.passport_image,
                no_of_adults: mydata.no_of_adults,

                no_of_child: mydata.no_of_child,

                no_of_infant: mydata.no_of_infant,

                passport_no: mydata.passport_no,

                passport_expiry_date: dayjs(mydata.passport_expiry_date),

                passport_image: mydata.passport_image,

                total_cost: mydata.total_cost,

                booking_status: mydata.booking_status,

                descripiton: mydata.descripiton,
            }
        });
        //setEditorValue(mydata.description);
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.bookings).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if(processedValues['date'])
            processedValues['date']=dayjs(processedValues['date']).format("YYYY-MM-DD")
            if(processedValues['passport_expiry_date'])
            processedValues['passport_expiry_date']=dayjs(processedValues['passport_expiry_date']).format("YYYY-MM-DD")
        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })

        if (curAction === "add") {
            context.psGlobal.apiRequest('admin/booking/add-booking', context.adminUser(userId).mode, form).then((res) => {
                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            form.append('id', editData.id);
            if (processedValues['passport_image'] !== editData.passport_image) {
                if (editData.passport_image)
                    form.append('old_passport_image', editData.passport_image);
            }
            else {
                form.delete('passport_image');
            }
            
           

            context.psGlobal.apiRequest('admin/bookings/update-booking', context.adminUser(userId).mode, form).then((res) => {
                setLoader(false);
                message.success(heading + ' Saved Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        }


    };
    const handleEditorChange = (content) => {
        setEditorValue(content);
        addeditFormHotels.setFieldsValue({
            hotels: { description: content }
        })
        setEditorValue(content);
    }
    const passportExpiryDateOnChange = (date) => {
        /* addeditFormHotels.setFieldsValue({
            bookings: { passport_expiry_date: dayjs(date).format('YYYY-MM-DD') }
        }) */
    }
    const dateOnChange = (date) => {
        console.log('test',dayjs(date).format('YYYY-MM-DD'))
      /*   addeditFormHotels.setFieldsValue({
            bookings: { date: dayjs(date).format('YYYY-MM-DD') }
        }) */
    }
    return (
        <>

            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addeditFormHotels}
                        labelAlign="left"
                        labelCol={{ span: formItemLayout === 'two-column' || formItemLayout === 'one-column' ? 8 : 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="Date"
                                    name={['bookings', 'date']}
                                    rules={[{ required: true, message: 'Please Enter date' }]}
                                >

                                   
                                        <DatePicker
                                            onChange={dateOnChange}
                                            format='DD/MM/YYYY'
                                           // locale={esES}

                                            //disabledDate={dateDisabled}
                                            allowClear={false}
                                        />
                                    
                                </FormItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="No Of Adults"
                                    name={['bookings', 'no_of_adults']}
                                    rules={[{ required: true, message: 'Please Enter Adults' }]}
                                >
                                    <InputNumber placeholder="No Of Adults" type="number" style={{ width: '100%' }} />
                                </FormItem>



                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="No Of Child"
                                    name={['bookings', 'no_of_child']}
                                    rules={[{ required: true, message: 'Please Enter Child' }]}
                                >
                                    <InputNumber placeholder="No Of Child" type="number" style={{ width: '100%' }} />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="No Of Infant"
                                    name={['bookings', 'no_of_infant']}
                                    rules={[{ required: true, message: 'Please Enter Infants' }]}
                                >
                                    <InputNumber placeholder="No Of Infant" type="number" style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="Passport No"
                                    name={['bookings', 'passport_no']}

                                >
                                    <Input placeholder="Passport No" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="Passport Expiry Date"
                                    name={['bookings', 'passport_expiry_date']}
                                // rules={[{ required: true, message: 'Please Enter Expiry Date' }]}
                                >

                                   
                                        <DatePicker
                                            onChange={passportExpiryDateOnChange}
                                            format='MM/YYYY'
                                            picker="month"
                                           // locale={esES}

                                            //disabledDate={passportExpiryDateDisabled}
                                            allowClear={false}
                                        />
                                    
                                </FormItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Passport Image"
                                    name={['bookings', 'passport_image']}
                                    //rules={[{ required: true, message: 'Please Enter Passport Image' }]}
                                >

                                    <ImageUpload
                                        cropRatio="4/3"
                                        defaultImage={editData && editData.passport_image ? '/cloud-file/' + encodeURIComponent(encodeURIComponent(editData.passport_image)) : null}
                                        storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                        onFinish={(fileName) => { addeditFormHotels.setFieldsValue({ bookings: { passport_image: fileName } }) }}
                                    />
                                </FormItem>

                            </Col>


                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Status"
                                    name={['bookings', 'booking_status']}
                                    rules={[{ required: true, message: 'Please Enter Active Status' }]}
                                >
                                    <Radio.Group optionType="default" >
                                        <Radio.Button value="waiting">Waiting</Radio.Button>
                                        <Radio.Button value="approved">Approved</Radio.Button>
                                        <Radio.Button value="cancelled">Cancelled</Radio.Button>
                                    </Radio.Group>
                                </FormItem>
                            </Col>


                        </Row>


                        <FormItem wrapperCol={context.isMobile ? null : { offset: 8, span: 24 }}
                        >
                            {
                                !context.isMobile && (
                                    <Space>
                                        <MyButton size="large" type="outlined" style={{}} onClick={onListClick}>
                                            Cancel
                                        </MyButton>
                                        <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                            {curAction === "edit" ? "Update" : "Submit"}
                                        </MyButton>
                                    </Space>

                                )
                            }
                            {
                                context.isMobile && (<Row gutter={2}>
                                    <Col span={12}>
                                        <MButton block color='primary' size='small' fill='outline' onClick={onListClick}>
                                            Cancel
                                        </MButton>
                                    </Col>
                                    <Col span={12}>
                                        <MButton block type='submit' color='primary' size='small'>
                                            {curAction === "edit" ? "Update" : "Submit"}
                                        </MButton>
                                    </Col>
                                </Row>)
                            }

                        </FormItem>


                    </Form>)
                }

            </Spin>



        </>
    );

}
export default AddEditBooking;