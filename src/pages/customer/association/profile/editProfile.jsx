import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import PsContext from '../../../../context';
import moment from 'moment';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { heightList } from '../../../../models/core'
const EditProfile = (props) => {
    const { Option } = Select;
    const context = useContext(PsContext);
    const [loader, setLoader] = useState(true);
    const [viewData, setViewData] = useState({});
    const [editForm] = Form.useForm();
    const { TextArea } = Input;
    const [country, setCountry] = useState('');
    const [IsMatrimonyMember, setIsMatrimonyMember] = useState(false);
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from members where id='" + context.customerUser.id + "'"
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {

            let mydata = res[0];
            setViewData(mydata)
            //use only required fields
            editForm.setFieldsValue({
                name: mydata.name,
                gender: mydata.gender,
                member_type: mydata.member_type,
                manai: mydata.manai,
                marital_status: mydata.marital_status,
                medical_registration_no: mydata.medical_registration_no,
                qualification: mydata.qualification,
                higher_study: mydata.higher_study,
                specification: mydata.specification,
                service: mydata.service,
                prefered_zone: mydata.prefered_zone,
                work_details: mydata.work_details,
                about_member: mydata.about_member,
                country: mydata.country,
                state: mydata.state,
                city: mydata.city,
                mobile_no: mydata.mobile_no,
                whatsapp_no: mydata.whatsapp_no,
                email: mydata.email,
                address: mydata.address,
                aadhaar_no: mydata.aadhaar_no,
                is_auto_approve_articles: mydata.is_auto_approve_articles,
                is_matrimony_member: mydata.is_matrimony_member,
                dob: mydata.dob,
                height: mydata.height,
                weight: mydata.weight,
                horoscope: mydata.horoscope,


            });
            setIsMatrimonyMember(parseInt(mydata.is_matrimony_member) === 1);
            var d = moment(mydata.dob, 'YYYY-MM-DD')
            if (d instanceof Date) {
                editForm.setFieldsValue({ dob: mydata.dob })
            }
            setLoader(false);



        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const onChangeDob = (date) => {

        editForm.setFieldsValue({
            dob: moment(date).format('YYYY-MM-DD')
        })

    };
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().subtract(18, "years");
    };
    const onFinish = (values) => {

        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value)
                processedValues[key] = value;

        });
        processedValues['is_profile_updated'] = '1';

        var reqData = {
            query_type: 'update',
            table: 'members',
            where: { id: viewData.id },
            values: processedValues

        };
        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {
            if (res) {

                var user = context.customerUser;
                user.is_matrimony_member = processedValues['is_matrimony_member'];
                user.is_profile_updated = 1
                context.updateCustomerUser(user);
                message.success('Profile Updated');
                setLoader(false);
            }
            else {
                message.error(error);
                setLoader(false);
            }

        })
    };
    const getWeightList = () => {

        let options = [];
        for (var index = 35; index <= 70; index++) {
            options.push(<Option key={index} value={index}>{index} Kg</Option>)
        }
        return options;
    };
    return (
        <>
            <div class="main-content right-chat-active" >
                <div  style={{ paddingTop: context.isMobile?'50px':'20px' }}>





                    <Card title="My Profile" >

                        <Spin spinning={loader} >
                            {viewData && Object.keys(viewData).length > 0 && (
                                <><Form
                                    name="basic"
                                    form={editForm}
                                    labelAlign="left"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 20 }}
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                    autoComplete="off"
                                >
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Name"
                                                name='name'


                                                rules={[{ required: true, message: 'Name is required' }]}
                                            >
                                                <Input placeholder="Name" />
                                            </Form.Item>
                                            <Form.Item
                                                label="Marital Status"
                                                name="marital_status"
                                                rules={[{ required: true, message: 'Select Marital Status' }]}
                                            >
                                                <Select placeholder="Select Marital Status">
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'marital-status')}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                label="Member Type"
                                                name='member_type'
                                                rules={[{ required: true, message: 'Please Enter Member Type' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Member Type"

                                                    optionFilterProp="children"
                                                    //onChange={memberTypeOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'member-types')}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Photo"
                                                name='photo'


                                            // rules={[{ required: true, message: 'Feature Image is required' }]}
                                            >
                                                <Space>
                                                    <ImageUpload
                                                        name="photo"
                                                        defaultImage={viewData.photo}
                                                        storeFileName={viewData.photo ? viewData.photo : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                                                        onFinish={(fileName) => editForm.setFieldsValue({ photo: fileName })}
                                                    /></Space>
                                            </Form.Item>
                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={7}>
                                            <Form.Item
                                                label="Birth Date"
                                                name="dob"
                                                // labelCol={{ span: 8 }}
                                                wrapperCol={{ offset: 6, span: 12 }}
                                                // value={selDate}
                                                rules={[{
                                                    // type: 'object',
                                                    required: true,
                                                    message: 'Please input Birth date',
                                                    whitespace: true,
                                                }]}
                                            >
                                                <Space direction="vertical">

                                                    <DatePicker onChange={onChangeDob} format='DD/MM/YYYY'
                                                        defaultValue={viewData && moment(viewData.dob, 'YYYY-MM-DD')}

                                                        disabledDate={disabledDate}
                                                        allowClear={false}
                                                    //dateRender={(currentDate,today)=>{}}
                                                    />

                                                </Space>
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={5}>
                                            <Form.Item
                                                label="Gender"
                                                name="gender"
                                                //labelCol={{ span: 8 }}
                                                // wrapperCol={{ offset: 6, span: 6 }}
                                                rules={[{ required: true, message: 'Gender required' }]}
                                            >
                                                <Select placeholder="Select Gender" >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Qualification"
                                                name="qualification"
                                                rules={[{ required: true, message: 'Qualification required' }]}
                                            >
                                                <Select placeholder="Select Qualification">
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'qualification')}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16}> {/* tow column row start */}

                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Specification"
                                                name="specification"
                                                rules={[{ required: true, message: 'Specification required' }]}
                                            >
                                                <Select placeholder="Select Specification">
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'specification')}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Higher Studies if any"
                                                name="higher_study"
                                            //rules={[{ required: true }]}
                                            >
                                                <Select placeholder="Select Higher Studies">
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'higher-studies')}
                                                </Select>
                                            </Form.Item>

                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Manai"
                                                name="manai"
                                                rules={[{ required: true, message: 'Please Select manai' }]}
                                            >
                                                <Select placeholder="Select Manai">
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'manai')}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Service"
                                                name="service"
                                                rules={[{ required: true, message: 'Please Select Service' }]}
                                            >
                                                <Select placeholder="Select Service">
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'service')}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Medical Reg. No."
                                                name="medical_registration_no"
                                                rules={[{ required: true, message: 'Enter Medical Registration No' }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Prefered Zone"
                                                name="prefered_zone"
                                                rules={[{ required: true, message: 'Please input Medical registration number' }]}
                                            >
                                                <Select placeholder="Select Zone">
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'zones')}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Working Details"
                                                name="work_details"

                                            >
                                                <TextArea rows={3} />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Write About yourself"
                                                name="about_member"

                                            >
                                                <TextArea rows={3} />
                                            </Form.Item>

                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>


                                            <Form.Item
                                                label="Country"
                                                name="country"
                                                rules={[{ required: true, message: 'Please Select Country' }]}
                                            >
                                                <CountryDropdown
                                                    className="ant-input"
                                                    value={country}
                                                    onChange={(val) => setCountry(val)} />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="State"
                                                name="state"

                                                rules={[{ required: true, message: 'Please select region/state' }]}
                                            >
                                                <RegionDropdown
                                                    country={country}
                                                    className="ant-input"
                                                // value={viewData.state}

                                                //onChange={(val) => this.selectRegion(val)} 
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="City"
                                                name="city"
                                                rules={[{ required: true, message: 'Enter City' }]}

                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Mobile No"
                                                name="mobile_no"
                                                rules={[{ required: true, message: 'Please input mobile no' }]}

                                            >
                                                <PhoneInput
                                                    country={'in'}
                                                //value={this.state.phone}
                                                // onChange={phone => this.setState({ phone })}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16} style={{ backgroundColor: 'cyan-1' }}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Email"
                                                name="email"
                                                rules={[{
                                                    type: 'email',
                                                    message: 'The input is not valid E-mail!',
                                                }]}

                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Whatsapp No"
                                                name="whatsapp_no"
                                            //  rules={[{ required: true, message: 'Please input whatsapp No' }]}

                                            >
                                                <PhoneInput
                                                    country={'in'}
                                                // value={this.state.phone}
                                                // onChange={phone => this.setState({ phone })}
                                                />

                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Address"
                                                name="address"
                                                rules={[{ required: true, message: 'Enter Address' }]}
                                            >
                                                <TextArea rows={4} />
                                            </Form.Item>
                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16} style={{ backgroundColor: 'cyan-1' }}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                //label="Auto Approve Articles"
                                                name="is_matrimony_member"
                                            >

                                                <Checkbox onChange={(e) => {
                                                    setIsMatrimonyMember(e.target.checked);
                                                    if (e.target.checked) {

                                                        editForm.setFieldsValue({
                                                            is_matrimony_member: 1
                                                        })
                                                    } else {
                                                        editForm.setFieldsValue({
                                                            is_matrimony_member: 0
                                                        })
                                                    }
                                                }} defaultChecked={parseInt(context.customerUser.is_matrimony_member) === 1}> Is Matrimony Member</Checkbox>

                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Aadhaar No."
                                                name="aadhaar_no"
                                            // rules={[{ required: true, message: 'Please input aadhaar no.' }]}

                                            >
                                                <InputNumber placeholder="Aadhaar Number" style={{ width: '120px' }} />
                                            </Form.Item>
                                        </Col>
                                    </Row> {/* tow column row end */}

                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Height"
                                                name="height"
                                                rules={[{ required: true, message: 'Please Enter Height' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Height"

                                                    optionFilterProp="children"
                                                    //onChange={heightOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {heightList.map(item => <Option key={item.cm} value={item.cm}>{item.label}</Option>)}

                                                </Select>
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Weight"
                                                name="weight"
                                                rules={[{ required: true, message: 'Please Enter Weight' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Weight"

                                                    optionFilterProp="children"
                                                    //onChange={weightOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {getWeightList()}
                                                </Select>
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Horoscope"
                                                name="horoscope"
                                            //  rules={[{ required: true, message: 'Please Enter Horoscope' }]}
                                            >

                                                <ImageUpload
                                                    name="horoscope"
                                                    defaultImage={viewData.horoscope}
                                                    storeFileName={viewData.horoscope ? viewData.horoscope : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                                                    onFinish={(fileName) => editForm.setFieldsValue({ horoscope: fileName })}
                                                />
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>


                                        </Col>
                                    </Row>
                                    <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                        <Button size="large" type="primary" htmlType="submit" style={{}}>
                                            Update
                                        </Button>
                                    </Form.Item>
                                </Form></>
                            )}
                        </Spin>
                    </Card>


                </div>


            </div>

        </>
    );

}
export default EditProfile;
