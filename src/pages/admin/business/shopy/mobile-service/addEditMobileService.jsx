import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space, AutoComplete } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox,Image } from 'antd';
import { Breadcrumb, Layout, Spin, DatePicker } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { Button as MButton } from 'antd-mobile'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import dayjs from 'dayjs'
import esES from 'antd/lib/locale-provider/es_ES';
const AddEditMobileService = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormMobileServices] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [complaintTypes, setComplaintTypes] = useState([]);
    const [deviceLocations, setDeviceLocations] = useState([]);
    const [userCompanies, setUserCompanies] = useState([]);
    const [heading] = useState('Mobile Service');
    const [deviceBrands, setDeviceBrands] = useState([])
    const [deviceModels, setDeviceModals] = useState([]);
    const [selUserData, setSelUserData] = useState(null)
    const { onListClick, onSaveFinish, userId, formItemLayout, ...other } = props;
    useEffect(() => {
        loadComplaintTypes()
        loadDeviceLocations()
        loadDeviceBrands()
        loadUserCompanies()
        addeditFormMobileServices.setFieldsValue({
            service_bookings: { received_date: dayjs() }
        })
    }, []);

    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.service_bookings).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        Object.entries(values.users).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        Object.entries(values.user_transactions).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (processedValues['complaints'])
            processedValues['complaints'] = processedValues['complaints'].join(",");
        processedValues['received_date'] = dayjs(values.service_bookings.received_date).format("YYYY-MM-DD HH:mm:ss")

        if(selUserData){
            processedValues['user_id']=selUserData.id
        }



        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })
        context.psGlobal.apiRequest('admin/mservices/quick-add-service-booking', context.adminUser(userId).mode, form).then((res) => {
            setLoader(false);
            message.success(heading + ' Added Successfullly');
            onSaveFinish();
            //navigate('/' + userId + '/admin/courses');
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    };
    const loadComplaintTypes = () => {

        var reqData = {
            query_type: 'query',
            query: "SELECT id,complaint from service_complaint_types where status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setComplaintTypes(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const loadDeviceLocations = () => {

        var reqData = {
            query_type: 'query',
            query: "SELECT id,location from device_locations where status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setDeviceLocations(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const loadUserCompanies = () => {

        var reqData = {
            query_type: 'query',
            query: "SELECT id,company_name from user_companies where status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setUserCompanies(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const loadDeviceBrands = () => {

        var reqData = {
            query_type: 'query',
            query: "SELECT distinct(brand) from service_bookings where status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setDeviceBrands(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const loadDeviceModels = (brand) => {
        var reqData = {
            query_type: 'query',
            query: `SELECT distinct(model_number) from service_bookings where brand='${brand}' and status=1`
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setDeviceModals(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const onPhoneChange = (phone) => {
        if (phone && phone.length > 11) {
            var reqData = {
                query_type: 'query',
                query: `SELECT id,user_id,mobile_no,first_name,id_proof from users where status=1 and mobile_no='${phone}'`
            };
            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
                if (res && res.length > 0) {
                    setSelUserData(res[0]);
                    console.log('user', res)
                    addeditFormMobileServices.setFieldsValue({ users: { first_name: res[0].first_name } })
                }else {
                    setSelUserData(null)
                    addeditFormMobileServices.setFieldsValue({ users: { first_name: '' } })
                }
            }).catch(err => {
                message.error(err);
            })
        } else{
            setSelUserData(null)
            addeditFormMobileServices.setFieldsValue({ users: { first_name: '' } })
        } 
    }
    return (
        <>

            <Spin spinning={loader} >

                <Form
                    name="basic"
                    form={addeditFormMobileServices}
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
                                label="Received Date"
                                name={['service_bookings', 'received_date']}
                                rules={[{ required: true, message: 'Please Enter Received Date' }]}
                            >


                                <DatePicker //onChange={receivedDateOnChange} 
                                    format='DD/MM/YYYY'
                                    //  defaltValue={dayjs()}
                                    locale={esES}

                                    //disabledDate={receivedDateDisabled}
                                    allowClear={false}
                                />

                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Device Location"
                                name={['service_bookings', 'device_location']}
                                rules={[{ required: true, message: 'Please Enter Device Location' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Location"

                                    optionFilterProp="children"
                                    //onChange={hotelIdOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {
                                        deviceLocations.map(item => {
                                            return <Select.Option value={item.id}>{item.location}</Select.Option>
                                        })
                                    }
                                </Select>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Mobile No"
                                name={['users', 'mobile_no']}
                                rules={[{ required: true, message: 'Please Enter Mobile No' }]}
                            >

                                <PhoneInput
                                    country={'in'}

                                    onChange={onPhoneChange}
                                />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="First Name"
                                name={['users', 'first_name']}
                                rules={[{ required: true, message: 'Please Enter First Name' }]}
                            >
                                <Input placeholder="First Name" />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Brand"
                                name={['service_bookings', 'brand']}
                                rules={[{ required: true, message: 'Please Enter Brand' }]}
                            >
                                <AutoComplete
                                    style={{
                                        width: 200,
                                    }}
                                    options={deviceBrands.map(item => { return { value: item.brand } })}
                                    onChange={(value) => loadDeviceModels(value)}

                                    placeholder="Brand"
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />

                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Model Number"
                                name={['service_bookings', 'model_number']}
                                rules={[{ required: true, message: 'Please Enter Model Number' }]}
                            >
                                <AutoComplete
                                    style={{
                                        width: 200,
                                    }}
                                    options={deviceModels.map(item => { return { value: item.model_number } })}

                                    placeholder="Model Number"
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="IMEI No"
                                name={['service_bookings', 'imei_no']}
                                rules={[{ required: true, message: 'Please Enter Imei No' }]}
                            >
                                <Input placeholder="Imei No" />
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Complaints"
                                name={['service_bookings', 'complaints']}
                                rules={[{ required: true, message: 'Please Enter Complaints' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Complaints"

                                    mode="multiple"
                                    optionFilterProp="children"
                                    //onChange={hotelIdOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}

                                >
                                    {
                                        complaintTypes.map(item => {
                                            return <Select.Option value={item.id}>{item.complaint}</Select.Option>
                                        })
                                    }
                                </Select>

                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Complaint Description"
                                name={['service_bookings', 'complaint_description']}
                                //rules={[{ required: true, message: 'Please Enter Complaint Description' }]}
                            >
                                <Input.TextArea rows={3} />
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Id Proof"
                                name={['users', 'id_proof']}
                            // rules={[{ required: true, message: 'Please Enter Package Image' }]}
                            >
                                {
                                    !selUserData && ( <ImageUpload
                                        // cropRatio="4/3"
                                         // defaultImage={editData && editData.room_image ? '/cloud-file/' + encodeURIComponent(encodeURIComponent(editData.room_image)) : null}
                                         storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                         onFinish={(fileName) => { addeditFormMobileServices.setFieldsValue({ users: { id_proof: fileName } }) }}
                                     />)
                                }
                                {
                                    selUserData && (<Image src={selUserData && selUserData.id_proof ? context.baseUrl+'/cloud-file/' + encodeURIComponent(encodeURIComponent(selUserData.id_proof)) : null} width={200}/>)
                                }

                               
                            </FormItem>

                        </Col>




                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Invoice Amount"
                                name={['user_transactions', 'debit']}

                                
                                rules={[{ required: true, message: 'Please Enter Invoice' }]}
                            >
                                <InputNumber placeholder="Debit" type="number" style={{ width: '100%' }}/>
                            </FormItem>

                        </Col>

                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Advance Paid"
                                name={['user_transactions', 'credit']}
                               
                               
                                rules={[
                                    { required: true, message: 'Please Enter Advance' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (parseInt(getFieldValue(['user_transactions', 'debit'])) >= parseInt(value)) {
                                                return Promise.resolve();
                                            }

                                            return Promise.reject(
                                                new Error(
                                                    "Advance Higher than Invoice Amount"
                                                )
                                            );
                                        },
                                    }),

                                ]}
                            >
                                <InputNumber placeholder="Credit" type="number" style={{ width: '100%' }} defaultValue="0"/>
                            </FormItem>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                            <FormItem
                                label="Outsourced Company"
                                name={['service_bookings', 'outsourced_company']}
                            //  rules={[{ required: true, message: 'Please Enter Outsourced Company' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Outsource Company"
                                    allowClear={true}

                                    optionFilterProp="children"
                                    //onChange={hotelIdOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >
                                    {
                                        userCompanies.map(item => {
                                            return <Select.Option value={item.id}>{item.company_name}</Select.Option>
                                        })
                                    }
                                </Select>

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
                                        Submit
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
                                        Submit
                                    </MButton>
                                </Col>
                            </Row>)
                        }

                    </FormItem>


                </Form>

            </Spin>



        </>
    );

}
export default AddEditMobileService;