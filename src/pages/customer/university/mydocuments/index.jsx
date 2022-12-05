import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PsContext from '../../../../context';
import { message, Space, Tag, Image, Card, Spin, Form, Modal,Input } from 'antd';
import { MyTable, DeleteButton, MyButton,ImageUpload } from '../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
const MyDocuments = (props) => {
    const context = useContext(PsContext);
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [visibleAddModal, setVisibleAddModal] = useState(false);
    const [addLoader, setAddLoader] = useState(false);
    const [addForm] = Form.useForm();
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = () => {
        setLoader(true);
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from user_documents where status='1' and  user_id='" + context.customerUser.id + "'"
        }
            ;
        context.psGlobal.apiRequest(reqData, context.customerUser.mode).then((res, error) => {
            setData(res);

        }).catch(err => {
            message.error(err);
            //setLoader(false);
        })
        setLoader(false);
    }
    const tableColumns = [
        {
            title: 'S.No',
            //dataIndex: 'title',
            key: 'sno',
            render: (item, object, index) => <strong>{index + 1}</strong>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Document',
            // dataIndex: 'Document',
            key: 'couse_image',
            render: (item) => <Image width={200} src={context.baseUrl+ item.filename} />,
        },
        /*  {
             title: 'Actions',
             // dataIndex: 'actions',
             key: 'actions',
             render: (item) => <Space>
                 <MyButton type="outlined" size="small" shape="circle" href={"#admin/courses/view/" + item.id} ><i class="fa-solid fa-eye"></i></MyButton>
                 <MyButton type="outlined" size="small" shape="circle" color={blue[7]} href={"#admin/courses/edit/" + item.id}><i class="fa-solid fa-pencil"></i></MyButton>
                  <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => loadData()}
                     title="Document"
                     table="user_documents"
                     //id must,+ give first three colums to display
                     dataItem={{ id: item.id, course_name: item.course_name, duration: item.duration, default_fee: item.default_fee }}
                     avatar={context.baseUrl + item.course_image}
                 /> 
 
             </Space>,
         }, */
    ]
    const onAddFormFinish = (values) => {
        setAddLoader(true);

        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        processedValues['user_id'] = context.customerUser.id;
        var reqData = {
            query_type: 'insert',
            table: 'user_documents',
            values: processedValues

        }
        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res) => {

            loadData();
            setVisibleAddModal(false);
            message.success('Added Successfully');

        }).catch(err => {
            message.error(err);

        })


        setAddLoader(false);
    }
    return (
        <>
            <div class="main-content bg-white right-chat-active">

                <div class="middle-sidebar-bottom">
                    <div class="middle-sidebar-left">
                        <div class="row">


                            <Card title="My Documents" extra={<MyButton type="outlined" onClick={() => { setVisibleAddModal(true) }}><FontAwesomeIcon icon={faPlus} />Upload New Document</MyButton>}>
                                <Spin spinning={loader}>
                                    <MyTable columns={tableColumns} dataSource={data} />
                                </Spin>
                            </Card>



                        </div>
                    </div>

                </div>
            </div>
            <Modal
                visible={visibleAddModal}
                zIndex={1000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleAddModal(false) }}
                title={<span style={{ color: cyan[6] }} ><FontAwesomeIcon icon={faPlus} /> &nbsp; Upload Document </span>}
            >
                <Form
                    name="basic"
                    form={addForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                    initialValues={{ remember: true }}
                    onFinish={onAddFormFinish}
                    autoComplete="off"
                >


                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please Enter Title' }]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>

                    <Form.Item
                        label="Filename"
                        name="filename"
                        rules={[{ required: true, message: 'Please Enter Filename' }]}
                    >

                        <ImageUpload
                            name="filename"
                           // defaultImage={defaultValue}
                            storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                            onFinish={(fileName)=>addForm.setFieldsValue({filename:fileName})}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 15 }}>
                        <MyButton size="large" type="primary" htmlType="submit" loading={addLoader}>
                            Submit
                        </MyButton>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default MyDocuments;