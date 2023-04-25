import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, Modal } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { ImageUpload, FormItem, MyButton, MyTable, DeleteButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { Button as MButton } from 'antd-mobile'
import { getTemplateFunctionNames } from '../models/templateFunctions';
import AddEditTemplateVariable from './templateVariables/addEditTemplateVariable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
const EditTemplateRenderFunction = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormTemplates] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [editId, setEditId] = useState(null);
    const [heading] = useState('Template');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
    const [selRenderFunction, setSelRenderFunction] = useState(null)
    const [variablesLoading, setVariablesLoading] = useState(false)
    const [variableEditData, setVariableEditData] = useState(null)
    const [variablesDataList, setVariablesDataList] = useState([])
    const [visibleModal, setVisibleModal] = useState(false)
    const tableColumnsVariables = [
        {
            title: 'S.No',
            // dataIndex: 'row_num',
            //  key: 'row_num',
            render: (item, object, index) => <strong>{index + 1}</strong>,
        },
        {
            title: 'Variable Name',
            dataIndex: 'input_variable_name',
            key: 'input_variable_name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Input Type',
            dataIndex: 'input_type',
            key: 'input_type',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Manage',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); loadVariables() }}
                    title="Template Variable"
                    table="template_variables"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, input_variable_name: item.input_variable_name, input_type: item.input_type, info: 'Delete Variable' }}
                //avatar={context.baseUrl + item.template_image}
                />


            </Space>
        }

    ]
    useEffect(() => {

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
            /*  addeditFormTemplates.setFieldsValue(
                 { templates: { active_status: '1' } }
             ) */
        }

    }, [editIdOrObject]);

    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from templates  where status=1 and id=" + id
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
        loadVariables(mydata.id)
       setSelRenderFunction(mydata.render_function)
        //setEditorValue(mydata.description);
    }
    const onRenderFunctionChange = (value) => {
        setSelRenderFunction(value);
        Modal.confirm({
            // icon: <ExclamationCircleOutlined />,
            content: <>Change Render Function to : {value}, Proceed?</>,
            onOk() {
                var form = new FormData();
                form.append('id', editData.id);
                form.append('render_function', value);
                context.psGlobal.apiRequest('admin/templates/update-template', context.adminUser(userId).mode, form).then((res) => {
                    setLoader(false);
                    message.success('Render Function Updated');
                }).catch(err => {
                    message.error(err);
                    setLoader(false);
                })
            },
            onCancel() {
                //console.log('Cancel');
            },
        })

    }
    const loadVariables = (template_id = null) => {
        setVariablesLoading(true)
        var reqData = {
            query_type: 'query',
            query: "SELECT * from template_variables  where status=1 and template_id=" + (template_id?template_id:editIdOrObject.id)
        };
        console.log('req',reqData)
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setVariablesDataList(res)
            setVariablesLoading(false)
        }).catch(err => {
            message.error(err);
            setVariablesLoading(false)

        })
    }
    const onAddClick = () => {
        setCurAction("add");

        setVisibleModal(true);
    }
    const onEditClick = (item) => {
        setVisibleModal(true)
        setVariableEditData(item);
        setCurAction("edit");
    }
    const addEditComponents = () => {
        if (curAction === "add")
            return <AddEditTemplateVariable formItemLayout="one-column" onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId}  templateId={editIdOrObject.id}/>
        else if (curAction === "edit")
            return <AddEditTemplateVariable formItemLayout="one-column" editIdOrObject={variableEditData} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else return <></>
    }
    const onAddEditListClick = () => {
        setCurAction("list");
        setVisibleModal(false);

    }
    const onAddEditSaveFinish = () => {
        setCurAction("list");
        setVisibleModal(false);
        loadVariables()

    }
    return (
        <>

            <Spin spinning={loader} >
                {
                    editData && (
                        <>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={3}>
                                    Render Function
                                </Col>
                                <Col className='gutter-row' xs={24} xl={4}>
                                    <Select
                                        showSearch
                                        placeholder="Template Category"
                                        style={{ width: '200px' }}  
                                        value={selRenderFunction}
                                        optionFilterProp="children"
                                        onChange={onRenderFunctionChange}
                                    // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {
                                            getTemplateFunctionNames.map(item => {
                                                return <Select.Option value={item.function_name}>{item.function_name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={24}>
                                    <Card title="Variables" extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Variable</MyButton>}>

                                        <MyTable
                                            columns={tableColumnsVariables}
                                            dataSource={variablesDataList}
                                            loading={variablesLoading}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )
                }

            </Spin>

            <Modal
                open={visibleModal}
                zIndex={1002}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                width={600}
                onCancel={() => { setVisibleModal(false) }}
                title={capitalizeFirst(curAction) + " " + heading}
            >
                {addEditComponents()}
            </Modal>

        </>
    );

}
export default EditTemplateRenderFunction;