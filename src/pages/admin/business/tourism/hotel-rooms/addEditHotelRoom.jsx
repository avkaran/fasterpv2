import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { Button as MButton } from 'antd-mobile'
const AddEditTourPackage = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormTourPackages] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Hotel Room');
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [editorValue, setEditorValue] = useState('');
    const [hotels,setHotels]=useState([]);
    useEffect(() => {
        loadHotels()
    }, []);
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
            addeditFormTourPackages.setFieldsValue(
                { hotel_rooms: { availablity: '1' } }
            )
        }

    }, [editIdOrObject]);
    const loadHotels = () => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT id,hotel_name from hotels where status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setHotels(res);
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from hotel_rooms where status=1 and id=" + id
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
        addeditFormTourPackages.setFieldsValue({

            hotel_rooms: {

                hotel_id: mydata.hotel_id,

                room_type: mydata.room_type,

                features: mydata.features,
                room_image: mydata.room_image,

                price: mydata.price,
                description: mydata.description,
                features: mydata.features ? mydata.features.split(",") : [],
                availablity: mydata.availablity.toString(),


            }
        });
        setEditorValue(mydata.description);
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.hotel_rooms).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (processedValues['features'])
            processedValues['features'] = processedValues['features'].join(",");



        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })

        if (curAction === "add") {
            context.psGlobal.apiRequest('admin/hotel/add-hotel-room', context.adminUser(userId).mode, form).then((res) => {
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
            if (processedValues['room_image'] !== editData.room_image) {
                if (editData.room_image)
                    form.append('old_room_image', editData.room_image);
            }
            else {
                form.delete('room_image');
            }
            context.psGlobal.apiRequest('admin/hotel/update-hotel-room', context.adminUser(userId).mode, form).then((res) => {
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
        addeditFormTourPackages.setFieldsValue({
            hotel_rooms: { description: content }
        })
        setEditorValue(content);
    }
    return (
        <>

            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addeditFormTourPackages}
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
                                    label="Hotel Id"
                                    name={['hotel_rooms', 'hotel_id']}
                                    rules={[{ required: true, message: 'Please Enter Hotel' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Hotel"

                                        optionFilterProp="children"
                                        //onChange={hotelIdOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {
                                            hotels.map(item=>{
                                                return <Select.Option value={item.id}>{item.hotel_name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>

                            </Col>
                            
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="Room Type"
                                    name={['hotel_rooms', 'room_type']}
                                    rules={[{ required: true, message: 'Please Enter Room Type' }]}
                                >
                                    <Input placeholder="Room Type" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="features"
                                    name={['hotel_rooms', 'features']}
                                    rules={[{ required: true, message: 'Please Enter Features' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Features"

                                        mode="multiple"
                                        optionLabelProp="label"
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'hotel-features')}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Room Image"
                                    name={['hotel_rooms', 'room_image']}
                                    rules={[{ required: true, message: 'Please Enter Package Image' }]}
                                >

                                    <ImageUpload
                                        cropRatio="4/3"
                                        defaultImage={editData && editData.room_image ? '/cloud-file/' + encodeURIComponent(encodeURIComponent(editData.room_image)) : null}
                                        storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                        onFinish={(fileName) => { addeditFormTourPackages.setFieldsValue({ hotel_rooms: { room_image: fileName } }) }}
                                    />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Price"
                                    name={['hotel_rooms', 'price']}
                                    rules={[{ required: true, message: 'Please Enter Price' }]}
                                >
                                    <InputNumber placeholder="Price" type="number" />
                                </FormItem>


                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Availablity"
                                    name={['hotel_rooms', 'availablity']}
                                    rules={[{ required: true, message: 'Please Enter Availablity' }]}
                                >
                                    <Radio.Group defaultValue="1" optionType="default" >
                                        <Radio.Button value="1">Available</Radio.Button>
                                        <Radio.Button value="0">Not Available</Radio.Button>
                                    </Radio.Group>
                                </FormItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="Description"
                                    labelCol={{ span: 24, offset: 0 }}
                                    name={['hotel_rooms', 'description']}
                                    rules={[{ required: true, message: 'Please Enter Description' }]}
                                >
                                    <div className="editor-wrapper">
                                        <Editor

                                            init={{
                                                height: '500',
                                                auto_focus: false,
                                                menubar: false,
                                                statusbar: false,
                                                plugins: 'hr lists table textcolor code link image',
                                                toolbar: 'bold italic forecolor link image| alignleft aligncenter alignright | hr bullist numlist table | subscript superscript | removeformat code',

                                                // allow custom url in link? nah just disabled useless dropdown..
                                                anchor_top: false,
                                                anchor_bottom: false,
                                                draggable_modal: true,
                                                table_default_attributes: {
                                                    border: '0',
                                                },
                                            }}
                                            // initialValue={viewData.content_html}
                                            value={editorValue}


                                            onEditorChange={handleEditorChange}
                                        // onChange={handleEditorChange}
                                        />
                                    </div>
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
export default AddEditTourPackage;