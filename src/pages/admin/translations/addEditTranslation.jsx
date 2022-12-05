import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../comp';
import { capitalizeFirst } from '../../../utils';
const AddEditTranslation = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Translation');
    const { editIdOrObject, onListClick, onSaveFinish, userId,lang, ...other } = props;
    const [editId, setEditId] = useState(null);
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
            // addForm.setFieldsValue({ category: 'Plan', package_for: 'Customer(Online)', package_status: 'Active' })
        }

    }, []);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from packages where status=1 and id=" + id
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
      
        addForm.setFieldsValue({
           translations:{phrase_primary_id:mydata.phrase_primary_id,translation:mydata.translation}
        })
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.translations).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value.trim();
            }
        });
        processedValues['source_type']='phrase';
        processedValues['language']=lang;


        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'translations',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            var reqDataUpdate = {
                query_type: 'update',
                table: 'translations',
                where: { id: editId },
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
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
    return (
        <>

            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addForm}
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <FormItem
                            label="Phrase Primary_id"
                            name={['translations', 'phrase_primary_id']}
                            rules={[{ required: true, message: 'Please Enter Phrase Primary_id' }]}
                        >
                            <Input placeholder='Phrase' maxLength={100}/>
                        </FormItem>

                        <FormItem
                            label="Translation"
                            name={['translations', 'translation']}
                            rules={[{ required: true, message: 'Please Enter Translation' }]}
                        >
                            <Input.TextArea placeholder='Translation' />
                        </FormItem>

                        <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                            <Space>
                                <Button size="large" type="outlined" style={{}} onClick={onListClick}>
                                    Cancel
                                </Button>
                                <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                    {curAction === "edit" ? "Save" : "Submit"}
                                </MyButton>
                            </Space>

                        </FormItem>

                    </Form>)
                }

            </Spin>



        </>
    );

}
export default AddEditTranslation;