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
    const [heading] = useState('Tour Package');
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
            addeditFormTourPackages.setFieldsValue(
                { tour_packages: { active_status: '1' } }
            )
        }

    }, [editIdOrObject]);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from tour-packages where status=1 and id=" + id
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

            tour_packages: {
                package_name: mydata.package_name,

                package_image: mydata.package_image,

                description: mydata.description,

                active_status: mydata.active_status.toString(),

                categories: mydata.categories ? mydata.categories.split(",") : [],

                price: mydata.price,
            }
        });
        setEditorValue(mydata.description);
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.tour_packages).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        if (processedValues['categories'])
            processedValues['categories'] = processedValues['categories'].join(",");



        var form = new FormData();
        Object.entries(processedValues).forEach(([key, value], index) => {
            form.append(key, value)
        })

        if (curAction === "add") {
            context.psGlobal.apiRequest('admin/tour-packages/save', context.adminUser(userId).mode, form).then((res) => {
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
            if (processedValues['package_image'] !== editData.package_image) {
                if (editData.package_image)
                    form.append('old_package_image', editData.package_image);
            }
            else {
                form.delete('package_image');
            }
            context.psGlobal.apiRequest('admin/tour-packages/update', context.adminUser(userId).mode, form).then((res) => {
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
            tour_packages: { description: content }
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
                                    label="Package Name"
                                    name={['tour_packages', 'package_name']}
                                    rules={[{ required: true, message: 'Please Enter Package Name' }]}
                                >
                                    <Input placeholder="Package Name" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Categories"
                                    name={['tour_packages', 'categories']}
                                    rules={[{ required: true, message: 'Please Enter Categories' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Categories"

                                        mode="multiple"
                                        optionLabelProp="label"
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'tour-package-categories')}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Package Image"
                                    name={['tour_packages', 'package_image']}
                                    rules={[{ required: true, message: 'Please Enter Package Image' }]}
                                >

                                    <ImageUpload
                                        cropRatio="4/3"
                                        defaultImage={editData && editData.package_image ? '/cloud-file/' + encodeURIComponent(encodeURIComponent(editData.package_image)) : null}
                                        storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                        onFinish={(fileName) => { addeditFormTourPackages.setFieldsValue({ tour_packages: { package_image: fileName } }) }}
                                    />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Price"
                                    name={['tour_packages', 'price']}
                                    rules={[{ required: true, message: 'Please Enter Price' }]}
                                >
                                    <InputNumber placeholder="Price" type="number" />
                                </FormItem>


                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Active Status"
                                    name={['tour_packages', 'active_status']}
                                    rules={[{ required: true, message: 'Please Enter Active Status' }]}
                                >
                                    <Radio.Group defaultValue="1" optionType="default" >
                                        <Radio.Button value="1">Active</Radio.Button>
                                        <Radio.Button value="0">Inactive</Radio.Button>
                                    </Radio.Group>
                                </FormItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>
                                <FormItem
                                    label="Description"
                                    labelCol={{ span: 24, offset: 0 }}
                                    name={['tour_packages', 'description']}
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