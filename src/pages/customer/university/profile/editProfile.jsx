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
const EditProfile = (props) => {
    const context = useContext(PsContext);
    const [loader, setLoader] = useState(true);
    const [viewData, setViewData] = useState({});
    const [editForm] = Form.useForm();
    const { TextArea } = Input;
    const [country, setCountry] = useState('');
    const [selEligibility, setSelEligibility] = useState('');

    useEffect(() => {
        loadData();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from users where id='" + context.customerUser.id + "'"
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {

            let mydata = res[0];
            setViewData(mydata);
            setCountry(mydata.country);
            //use only required fields
            editForm.setFieldsValue({
                title: mydata.title,
                first_name: mydata.first_name,
                last_name: mydata.last_name,
                dob: mydata.dob,
                gender: mydata.gender,
                mobile_no: mydata.mobile_no,
                email: mydata.email,
                country: mydata.country,
                state: mydata.state,
                address: mydata.address,
                photo: mydata.photo,
                bachelor_degree: mydata.bachelor_degree,
                master_degree: mydata.master_degree,
                doctorate: mydata.doctorate,
                diploma: mydata.diploma,
                tamil_reading: mydata.tamil_reading,
                tamil_writing: mydata.tamil_writing,
                tamil_speaking: mydata.tamil_speaking,
                tamil_isai: mydata.tamil_isai,
                eligibility: viewData.eligibility,
            });
            if (viewData.eligibility)
                setSelEligibility(viewData.eligibility.split(","))
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
    const dobOnChange = (date) => {

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
        processedValues['eligibility'] = selEligibility;
        var reqData = {
            query_type: 'update',
            table: 'users',
            where: { id: viewData.id },
            values: processedValues

        };
        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {
            if (res) {
                message.success('Profile Updated');
                setLoader(false);
            }
            else {
                message.error(error);
                setLoader(false);
            }

        })
    };
    const getCheckBoxes = () => {
        let m = context.psGlobal.collectionData.find(item => item.name === 'eligiblity')
        if (m) {
            let cData = m.collections.split(",")

            return cData.map(item => <><Checkbox value={item}>{item}</Checkbox><br /></>)
        }
    }
    const onCheckoxChange = (checkedValues) => {
        setSelEligibility(checkedValues.join(","));
    }
    const initialOptions = {
        "client-id": "AWTpMX60JnCBzqC8A8pLIm82I57sTWXpol4DWaHOT0CMJAULa9qA9mGAY1NuZpBGemfYOqpTuc4I_icx",
        currency: "USD",
        intent: "capture",
        "data-client-token": "EN26nKWBb1zjb6yudwVOfQVPVAXJkfoNfYePx3v9tdh27QYKkiq798DAZC9sWQ5mu-hEU9gBJTxY5880",
    };
    return (
        <>
            <div class="main-content right-chat-active">
                <div style={{ paddingTop: '20px' }}>
                    
                    <Card title="My Profile">

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
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Title"
                                                name="title"
                                                rules={[{ required: true, message: 'Please Enter Title' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Title"

                                                    optionFilterProp="children"
                                                    //onChange={titleOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'name-title')}
                                                </Select>
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Gender"
                                                name="gender"
                                                rules={[{ required: true, message: 'Please Enter Gender' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Gender"

                                                    optionFilterProp="children"
                                                    //onChange={genderOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                                                </Select>
                                            </Form.Item>


                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="First Name"
                                                name="first_name"
                                                rules={[{ required: true, message: 'Please Enter First Name' }]}
                                            >
                                                <Input placeholder="First Name" />
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Dob"
                                                name="dob"
                                                rules={[{ required: true, message: 'Please Enter Dob' }]}
                                            >

                                                <Space direction="vertical">
                                                    <DatePicker onChange={dobOnChange} format='DD/MM/YYYY'
                                                        defaultValue={viewData && moment(viewData.dob, 'YYYY-MM-DD')}
                                                        disabledDate={disabledDate}
                                                        allowClear={false}
                                                    />
                                                </Space>
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Last Name"
                                                name="last_name"
                                                rules={[{ required: true, message: 'Please Enter Last Name' }]}
                                            >
                                                <Input placeholder="Last Name" />
                                            </Form.Item>


                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Mobile No"
                                                name="mobile_no"
                                                rules={[{ required: true, message: 'Please Enter Mobile No' }]}
                                            >

                                                <PhoneInput
                                                    country={'in'}

                                                //onChange={phone => {}}
                                                />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Email"
                                                name="email"
                                                rules={[{ required: true, message: 'Please Enter Email' }]}
                                            >
                                                <Input placeholder="Email" />
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Country"
                                                name="country"
                                                rules={[{ required: true, message: 'Please Enter Country' }]}
                                            >

                                                <CountryDropdown
                                                    className="ant-input"
                                                    value={country}
                                                    onChange={(val) => setCountry(val)} />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="State"
                                                name="state"
                                                rules={[{ required: true, message: 'Please Enter State' }]}
                                            >

                                                <RegionDropdown
                                                    country={country}
                                                    className="ant-input"
                                                // value={viewData.state}

                                                //onChange={(val) => this.selectRegion(val)} 
                                                />
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Address"
                                                name="address"
                                                rules={[{ required: true, message: 'Please Enter Address' }]}
                                            >
                                                <Input.TextArea rows={3} />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>
                                            <Form.Item
                                                label="Bachelor Degree"
                                                name="bachelor_degree"
                                            // rules={[{ required: true, message: 'Please Enter Bachelor Degree' }]}
                                            >
                                                <Input placeholder="Bachelor Degree" />
                                            </Form.Item>


                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>


                                            <Form.Item
                                                label="Photo"
                                                name="photo"
                                                rules={[{ required: true, message: 'Please Enter Photo' }]}
                                            >

                                                <ImageUpload

                                                    defaultImage={viewData.photo ? viewData.photo : null}
                                                    storeFileName={viewData.photo ? viewData.photo : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                                                    onFinish={(fileName) => editForm.setFieldsValue({ photo: fileName })}
                                                />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Master Degree"
                                                name="master_degree"
                                            // rules={[{ required: true, message: 'Please Enter Master Degree' }]}
                                            >
                                                <Input placeholder="Master Degree" />
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Doctorate"
                                                name="doctorate"
                                            // rules={[{ required: true, message: 'Please Enter Doctorate' }]}
                                            >
                                                <Input placeholder="Doctorate" />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Diploma"
                                                name="diploma"
                                            // rules={[{ required: true, message: 'Please Enter Diploma' }]}
                                            >
                                                <Input placeholder="Diploma" />
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Tamil Reading"
                                                name="tamil_reading"
                                                rules={[{ required: true, message: 'Please Enter Tamil Reading' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Tamil Reading"

                                                    optionFilterProp="children"
                                                    //onChange={tamilReadingOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'eligiblity-level')}
                                                </Select>
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Tamil Writing"
                                                name="tamil_writing"
                                                rules={[{ required: true, message: 'Please Enter Tamil Writing' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Tamil Writing"

                                                    optionFilterProp="children"
                                                    //onChange={tamilWritingOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'eligiblity-level')}
                                                </Select>
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Tamil Speaking"
                                                name="tamil_speaking"
                                                rules={[{ required: true, message: 'Please Enter Tamil Speaking' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Tamil Speaking"

                                                    optionFilterProp="children"
                                                    //onChange={tamilSpeakingOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'eligiblity-level')}
                                                </Select>
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Tamil Isai"
                                                name="tamil_isai"
                                                rules={[{ required: true, message: 'Please Enter Tamil Isai' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Tamil Isai"

                                                    optionFilterProp="children"
                                                    //onChange={tamilIsaiOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'eligiblity-level')}
                                                </Select>
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>



                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Form.Item
                                            label="Eligibility/ Tamil Proficiency"
                                            //name="eligibility"
                                            rules={[{ required: true, message: 'Please Enter Eligibility' }]}
                                        >
                                            <Checkbox.Group onChange={onCheckoxChange}
                                                defaultValue={viewData.eligibility ? viewData.eligibility.split(",") : []}
                                            >

                                                {getCheckBoxes()}
                                            </Checkbox.Group>

                                        </Form.Item>

                                    </Row>


                                    <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                        <Button size="large" type="primary" htmlType="submit" style={{}}>
                                            Save
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
