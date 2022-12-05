import React, { useState, useEffect } from 'react';
import { Row, Col, Spin } from 'antd';
import { Card, Menu } from 'antd';
import { cyan } from '@ant-design/colors';
import { Breadcrumb, Layout, Typography, Divider } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { MyCodeBlock } from '../comp'
import ResponsiveLayout from '../pages/admin/layout'
const Docs = (props) => {
    //const navigate = useNavigate();
    const { Content } = Layout;
    const [selDoc, setSelDoc] = useState('');
    const [loader, setLoader] = useState(false);
    const menuItems = [
        { label: 'Global Variables', key: 'global_variables', },
        { label: 'Global Functions', key: 'global_functions', },
        { label: 'Mysql CRUD', key: 'mysql_crud', },
        { label: 'My Button', key: 'mybutton', },
        { label: 'Image Upload', key: 'image_upload', },
        { label: 'Delete Button', key: 'delete_button', },
        { label: 'Icons', key: 'icons', },
        { label: 'Import Components', key: 'imports', },
        { label: 'Blank page', key: 'blank_page', },
        { label: 'Add Page', key: 'add_page', },
        { label: 'Edit Page', key: 'edit_page', },
        { label: 'View Page', key: 'view_page', },
        { label: 'TableList', key: 'table_lsit', },
        { label: 'AvatarList', key: 'avatarList', },
    ]
    const docContents = [
        {
            key: 'global_variables',
            title: 'How to Declare & Usage',
            language: 'jsx',
            description: 'Global Variables are processed in the context provider, you have to import and declare context as below',
            blockQuote: 'import path should be your relative path.',
            sourceCode: `
            import PsContext from '../../../context'; //path should your relative path
            const CustomPage= () => {
                const context = useContext(PsContext);
                return (
                    <>
                    {context.psGlobal.baseUrl}                    }
                    </>
                );
            
            }
            export default CustomPage;`
        },
        {
            key: 'global_variables',
            title: 'Basic Variables',
            language: 'jsx',
            blockQuote: '',
            description: 'basic variables for pages',
            sourceCode: `
            context.baseUrl   //base url for uploaded images and api path
            context.adminLogged  //is admin user adminLogged returns 'yes' | 'no'
            context.noImg   //fallback image for no image or failure image
            `
        },
        {
            key: 'global_variables',
            title: 'Collection Data',
            language: 'jsx',
            blockQuote: '',
            description: 'Collections Data/Add New Details Data',
            sourceCode: `
            context.psGlobal.collectionData   //Array of collection data. returns array of data
            `
        },
        {
            key: 'global_variables',
            title: 'Collection Data Return Data',
            language: 'html',
            blockQuote: '',
            description: 'Returns data will be below format',
            sourceCode: `
            id   | name          | collections        | last_updated
            ----------------------------------------------------
            1    | gender        | Male,Female,Other  | 2022-07-19 09:38:40   
            2    | qualifications| B.A,M.A,BSc        | 2022-07-19 09:38:40     
            ----------------------------------------------------
            `
        },
        {
            key: 'global_variables',
            title: 'Collection Options',
            language: 'jsx',
            blockQuote: '',
            description: 'how to use collection options in Form Select',
            sourceCode: ` 
            <Select placeholder="Gender">
            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
            </Select>`
        },
        {
            key: 'global_functions',
            title: 'Basic Usage',
            language: 'jsx',
            blockQuote: 'for asynch functions use then to confirm the promise',
            description: 'basic usage of global functions',
            sourceCode: ` 
            //as useall declare context
            context.psGlobal.encrypt(arg1,arg2..)
            // here encrypt function is called.
            `
        },
        {
            key: 'global_functions',
            title: 'getWhereClause',
            language: 'jsx',
            blockQuote: '',
            description: 'Generate whereclass for mysql',
            sourceCode: ` 
            //function structure
            const getWhereClause = (filterColumns, withWhere = false) => {
            }
            //usage
            let filterColumns = { status: '1',payment_status:'paid' };
            context.psGlobal.getWhereClause(filterColumns, false)
            
            `
        },
        {
            key: 'global_functions',
            title: 'Encrypt / Decrypt',
            language: 'jsx',
            blockQuote: '',
            description: 'Encrypt the given string or decrypt the encrypted string',
            sourceCode: ` 
            //encrypt function structure
            const encrypt = (textToEncrypt) => {
            }
            //encrypt function structure
            const decrypt = (encryptedMessage) => {
            }
            
            `
        },
        {
            key: 'global_functions',
            title: 'apiRequest',
            language: 'jsx',
            blockQuote: 'api call and get return data',
            description: 'Function structure of api request.',
            sourceCode: ` 
            //reqData = url string | object 
            //postForm=FormData
            //mode=prod | dev
            const apiRequest = async (reqData, mode,postForm=false) => {
            }
            `
        },
        {
            key: 'global_functions',
            title: 'apiRequest with Various Argument Format',
            language: 'jsx',
            blockQuote: '',
            description: 'requesting with various arguments,such as string and object and formdata',
            sourceCode: ` 
            // url string request
            context.psGlobal.apiRequest('v1/admin/member-counts', context.adminUser(props.match.params.userId).mode).then((res, error) => {
            //your code
            }).catch(err => {
                message.error(err);
               // setRegisterLoader(false);
            })

            // url string and form data
            var form = new FormData();
            form.append('file_data', data64)
            form.append('file_name', file.name)
            form.append('store_file_name', storeFileName)
            context.psGlobal.apiRequest('v1/admin/upload-image, context.adminUser(props.match.params.userId).mode,form).then((res, error) => {
              

            }).catch(err => {
                message.error(err);
               
            })
            `
        },
        {
            key: 'mysql_crud',
            title: 'Database Access and CRUD (Create, Read, Update, Delete) ',
            language: 'jsx',
            blockQuote: 'all are made using api call first parameter as object.',
            description: 'Basic Usage',
            sourceCode: ` 
            //if single query reqdata should be
            var reqData = { 
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select * from courses"
            };
            //if array of queries reqdata should be
            var reqData = [
                { 
                query_type: 'query', 
                query: "select * from courses"
                },
                { 
                    query_type: 'query', 
                    query: "select * from jobs";
                },
            ]

            context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res,error)=>{
                
               
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
            `
        },
        {
            key: 'mysql_crud',
            title: 'Insert Operation',
            language: 'jsx',
            blockQuote: '',
            description: 'Insert Data to mysql',
            sourceCode: ` 
            var reqData = { 
                query_type: 'insert',
                table:'users',
                where:{id:'1'},
                values:{name:'senthil',age:'13'}
    
            };
           
            context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res,error)=>{
                
               
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
            `
        },
        {
            key: 'mysql_crud',
            title: 'Update Operation',
            language: 'jsx',
            blockQuote: '',
            description: 'Update Data to mysql',
            sourceCode: ` 
            var reqData = { 
                query_type: 'update',
                table:'users',
                where:{id:'1'},
                values:{name:'senthil',age:'13'}
    
            };
           
            context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res,error)=>{
             
               
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
            `
        },
        {
            key: 'mysql_crud',
            title: 'Delete Operation',
            language: 'jsx',
            blockQuote: '',
            description: 'Delete Data to mysql',
            sourceCode: ` 
            var reqData = { 
                query_type: 'delete',
                table:'delete',
                where:{id:'1'},
            };
           
            context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res,error)=>{
                
               
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
            `
        },
        {
            key: 'mysql_crud',
            title: 'Select Operation',
            language: 'jsx',
            blockQuote: '',
            description: 'Select query to mysql',
            sourceCode: ` 
            var reqData = { 
                query_type: 'query',
                query: "select * from courses where status=1",
            };
           
            context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res,error)=>{
               
               
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
            `
        },
        {
            key: 'mybutton',
            title: 'MyButton Component',
            language: 'jsx',
            blockQuote: 'antd button inherited you can use any other antd button props also',
            description: 'Styled Button with specific props',
            sourceCode: ` 
           //import button as
            import {MyButton} from '../../../../../comp'
           //filled buttons
           <MyButton type="primary" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small"> text</MyButton>
          
           //outlined buttons
           <MyButton type="outlined" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small"> text</MyButton>

           //colors can be imported from
           import { green, blue, red, cyan, grey,gold,yellow } from '@ant-design/colors';
            `
        },
        {
            key: 'mybutton',
            title: 'MyButton Props',
            language: 'jsx',
            blockQuote: '',
            description: 'My Button Properties',
            sourceCode: ` 
            
           //type, =primary | outlined
           //shape,= square | circle | round
            `
        },
        {
            key: 'image_upload',
            title: 'Image Upload',
            language: 'jsx',
            blockQuote: 'single image upload only, can be used for add/edit pages.',
            description: 'Modified Image Upload',
            sourceCode: ` 
            //import
            import { ImageUpload } from '../../../comp'
           //for add page
           <ImageUpload
                name="photo"
                storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                onFinish={(fileName) =>{your code}}
            >
           //for edit page
           <ImageUpload
                name="photo"
                defaultImage={viewData.photo}
                storeFileName={viewData.photo ? viewData.photo : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                onFinish={(fileName) => addForm.setFieldsValue({ photo: fileName })}
            />
            `
        },
        {
            key: 'delete_button',
            title: 'Delete Button',
            language: 'jsx',
            blockQuote: 'ever fast delete code/ just change the status=0',
            description: 'Just insert button only and mention table and id field other things will be done by the component.',
            sourceCode: ` 
            //import
            import { DeleteButton } from '../../../comp'
            <DeleteButton  
                type="outlined" size="large" shape="circle" color={red[7]}  onFinish={() =>resetResult()}
                title="Member"
                table="members"
                //id must,+ give first three colums to display
                dataItem={{id:item.id,name : item.name,qualification:item.qualification,age:item.age}}
                avatar={context.baseUrl + item.photo}
            />
            `
        },
        {
            key: 'icons',
            title: 'Usage of Icons',
            language: 'jsx',
            blockQuote: 'Fontawesome icons',
            description: 'free solid,regular icons used',
            sourceCode: ` 
            //import
            import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
            import { faFilter } from '@fortawesome/free-solid-svg-icons'
            import { faIndianRupeeSign, faUser, faMobileAlt } from '@fortawesome/free-solid-svg-icons'
            import { faCircleUser } from '@fortawesome/free-regular-svg-icons'
            //usage
            <FontAwesomeIcon icon={faFilter} />Filter</MyButton>
            //icon only button usage
            <MyButton type="outlined" size="large" shape="circle" href="" ><FontAwesomeIcon icon={faFilter} /></MyButton>
            `
        },
        {
            key: 'imports',
            title: 'context import',
            language: 'jsx',
            blockQuote: '',
            description: 'usage of context',
            sourceCode: ` 
            import PsContext from '../../../context';
            const context = useContext(PsContext);
            `
        },
        {
            key: 'blank_page',
            title: 'Sample Blank Page',
            language: 'jsx',
            blockQuote: '',
            description: 'Sample Blank Page.',
            sourceCode: ` 
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import {MyButton} from '../../../../../comp'
import { Breadcrumb, Layout, Spin,Card } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
const BlankPage = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [viewData, setViewData] = useState({});
    const [data, setData] = useState([]);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 24px',
                    margin: 0

                }}
            >
                <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <span>page 1</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>page 2</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="Blank Page" extra={<MyButton href="" ><i className="fa-solid fa-list pe-2" ></i>right button</MyButton>}>

                    <Spin spinning={loader} >
                        {viewData && Object.keys(viewData).length > 0 && (
                            <></>
                        )}
                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default BlankPage;
            `
        },
        {
            key: 'add_page',
            title: 'Sample Add Page',
            language: 'jsx',
            blockQuote: '',
            description: 'Sample Add Page.',
            sourceCode: ` 
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
const AddPage = () => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    useEffect(() => {

    }, []);
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });

        var reqData = {
            query_type: 'insert',
            table: 'users',
            values: processedValues

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res) => {
          
                var createdId = res['data'].data;

                var reqDataInner = {
                    query_type: 'update',
                    table: 'users',
                    where: { id: createdId },
                    values: { user_id: 'TM' + createdId.padStart(5, '0') }

                };
                context.psGlobal.apiRequest(reqDataInner, context.adminUser(props.match.params.userId).mode).then((resInner, errorInner) => {
                    if (resInner) {
                        setLoader(false);
                        message.success('Added Successfully');
                        navigate('/'+props.match.params.userId+'/admin/users')
                    }
                    else {
                        message.error(errorInner);
                        setLoader(false);
                    }

                })

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    };
    return (
        <>

            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 24px',
                    margin: 0

                }}
            >
                <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <span>Manage Users</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Add User</Breadcrumb.Item>
                </Breadcrumb>
                <Card title="Add User" extra={<Button href="#admin/users" ><i className="fa-solid fa-list pe-2" ></i>List Users</Button>}>

                    <Spin spinning={loader} >
                        <Form
                            name="basic"
                            form={addForm}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >

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
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: true, message: 'Please input password' }]}

                                    >
                                        <Input.Password placeholder="input password" />
                                    </Form.Item>
                                </Col>
                            </Row> {/* tow column row end */}
                            <Row gutter={16}> {/* tow column row start */}
                                <Col className='gutter-row' xs={24} xl={12}>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={12}>

                                </Col>
                            </Row> {/* tow column row end */}



                            <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                <Button size="large" type="primary" htmlType="submit" style={{}}>
                                    Submit
                                </Button>
                            </Form.Item>

                        </Form>
                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default AddPage;
            `
        },
        {
            key: 'edit_page',
            title: 'Sample Edit Page',
            language: 'jsx',
            blockQuote: '',
            description: 'Sample Edit Page.',
            sourceCode: ` 
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import moment from 'moment';
import PsContext from '../../../context';
const EditPage = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [editForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [userId] = useState(props.match.params.userId)
    const [viewData, setViewData] = useState({});
    useEffect(() => {
        loadData(userId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = (id) => {
        setLoader(true);
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from users where id='" + id + "'",
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res, error) => {
         
                let mydata = res['data'].data[0];
                setViewData(mydata)
                //use only required fields
                editForm.setFieldsValue({
                    title: mydata.title,
                    gender: mydata.gender,
                    first_name: mydata.first_name,
                    last_name: mydata.last_name,
                    photo: mydata.photo

                });
                var d = moment(viewData.dob, 'YYYY-MM-DD')
                if (d instanceof Date) {
                    editForm.setFieldsValue({ dob: mydata.dob })
                }
                setLoader(false);
           
          

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    };
    const onFinish = (values) => {

        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        var reqData = { //if array of queries pass [] outside
            query_type: 'update',
            table: 'users',
            where: { id: viewData.id },
            values: processedValues

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res, error) => {
          
                setLoader(false);
                message.success('User Data Saved Successfully');
                navigate('/'+props.match.params.userId+'/admin/users')
           
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
        
    };
    return (
        <>
            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 24px',
                    margin: 0

                }}
            >
                <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <span>Manage Users</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Edit User</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="Edit User" extra={<Button href="#admin/users" ><i className="fa-solid fa-list pe-2" ></i>List Users</Button>}>

                    <Spin spinning={loader} >
                        {

                            viewData && Object.keys(viewData).length > 0 && (
                                <Form
                                    name="basic"
                                    form={editForm}
                                    labelAlign="left"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 20 }}
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                    autoComplete="off"
                                >
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
                                            <Form.Item
                                                label="Password"
                                                name="password"
                                                rules={[{ required: true, message: 'Please input password' }]}

                                            >
                                                <Input.Password placeholder="input password" />
                                            </Form.Item>
                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Row gutter={16}> {/* tow column row start */}
                                        <Col className='gutter-row' xs={24} xl={12}>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                        </Col>
                                    </Row> {/* tow column row end */}
                                    <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                        <Button size="large" type="primary" htmlType="submit" style={{}}>
                                            Save
                                        </Button>
                                    </Form.Item>

                                </Form>
                            )
                        }

                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default EditPage;
            `
        },
    ]
    useEffect(() => {


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onCollectionNameClick = (e) => {
        setLoader(true);
        setSelDoc(e.key)
        setLoader(false);
    }
    const getTitle = () => {
        let d = menuItems.find((item) => item.key === selDoc);
        return d && d.label;
    }
    return (
        <>

<ResponsiveLayout
         
         userId={props.match.params.userId}
         customHeader={null}
         bottomMenues={null}
         breadcrumbs={[
            {name:'Developer Tools',link:null},
            {name:'Documentation',link:null},
        ]}
        >
                <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <UserOutlined />
                        <span>Developer Tools</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Documentation</Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        <Card
                            bodyStyle={{
                                padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7],
                                border: '1px solid',
                                borderBottom: '0',
                                borderColor: cyan[2],

                            }}
                            style={{
                                margin: "0px",
                                border: '1px solid #d9d9d9',
                                borderRadius: '2px',


                                //borderRadius: "20px",
                            }}


                        >Documentation</Card>
                        <Menu
                            mode="inline"
                            theme="light"
                            onClick={onCollectionNameClick}
                            style={{
                                width: '100%',
                                border: '1px solid',
                                borderColor: cyan[2],
                                borderTop: '0',
                            }}
                            items={menuItems}
                        />
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <Spin spinning={loader}>
                            <Card title={getTitle()}>
                                {docContents.filter((item) => item.key === selDoc).map((item) => {
                                    return <>
                                        <Divider orientation="left">{item.title}</Divider>
                                        <Typography.Paragraph>{item.description}</Typography.Paragraph>
                                        {item.blockQuote && item.blockQuote !== '' && (<Typography.Paragraph><blockquote style={{ borderLeft: '2px solid #13c2c2' }}>{item.blockQuote}</blockquote></Typography.Paragraph>)}
                                        <MyCodeBlock
                                            text={item.sourceCode}
                                            language={item.language}
                                        />

                                    </>
                                })}


                            </Card>
                        </Spin>

                    </Col>
                </Row>

            </ResponsiveLayout>
        </>
    );

}
export default Docs;