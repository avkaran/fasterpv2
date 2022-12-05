import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input } from 'antd';
import { Breadcrumb, Layout, Spin, Radio, Divider } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Select, InputNumber } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload } from '../../../../../comp';
import { capitalizeFirst, currentInstance, businesses } from '../../../../../utils'
import { languages } from '../../../../../models/core';

const EditCourse = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [editForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [courseId] = useState(props.match.params.courseId)
    const [viewData, setViewData] = useState({});
    const [lang, setLang] = useState(null);
    const [curLanguages, setCurLanguages] = useState(null);
    const [langData, setLangData] = useState(null);
    const [lColumns] = useState(['course_name','duration', 'description']);
    const [editorValue, setEditorValue] = useState('');
    useEffect(() => {
        loadData(courseId);
        if (businesses[currentInstance.index].multilingual) {
            setLang("en");
            var langs = languages.filter(item => businesses[currentInstance.index].multilingual.indexOf(item.id) > -1);
            setCurLanguages(langs);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = (id) => {
        setLoader(true);
        var reqData = [{ //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from courses where id='" + id + "'",
        },
        { //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from translations where  status=1 and source_type='table' and table_name='courses' and phrase_primary_id='" + id + "'",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        }];
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            let mydata = res[0][0];
            setViewData(mydata)
            //use only required fields
            editForm.setFieldsValue({
                course_code: mydata.course_code,
                course_name: mydata.course_name,
                duration: mydata.duration,
                default_fee: mydata.default_fee,
                course_status: mydata.course_status,
                description: mydata.description,
                course_image: mydata.course_image,
            });
            setEditorValue(mydata.description);

            //load langdata
            if (businesses[currentInstance.index].multilingual) {
                var allLangData = [];
                var langs = languages.filter(item => businesses[currentInstance.index].multilingual.indexOf(item.id) > -1 && item.id !== "en");

                var enData = {};
                lColumns.forEach(column => {
                    enData[column] = mydata[column];
                })
                allLangData.push({ lang: "en", data: enData });
                langs.forEach(lang => {
                    var lngData = {};

                    lColumns.forEach(column => {
                        var trData = res[1].find(obj => obj.language === lang.id && obj.column_name === column);

                        lngData[column] = trData ? trData.translation : null;
                    })
                    if (lngData['seo_meta_keywords'])
                        lngData['seo_meta_keywords'] = lngData['seo_meta_keywords'].split(",");
                    if (lngData['seo_tags'])
                        lngData['seo_tags'] = lngData['seo_tags'].split(",")
                    allLangData.push({ lang: lang.id, data: lngData });
                })

                setLangData(allLangData);

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

        var reqData =[];
        if (!lang || (lang && lang === "en")) {
            reqData.push( { //if array of queries pass [] outside
                query_type: 'update',
                table: 'courses',
                where: { id: viewData.id },
                values: processedValues
    
            });
        }
        else {
            reqData.push({ //if array of queries pass [] outside
                query_type: 'delete',
                // query: "select * from members where id='" + id + "'",
                table: 'translations',
                where: { source_type: 'table', table_name: 'courses', phrase_primary_id: courseId }
            });
            var curallLangData = langData;
            var langIndex = curallLangData.findIndex(item => item.lang = lang)
            lColumns.forEach(column => {

                if (values[column]) {
                    var column_value = values[column];
                    reqData.push({ //if array of queries pass [] outside
                        query_type: 'insert',
                        // query: "select * from members where id='" + id + "'",
                        table: 'translations',
                        values: { source_type: 'table', phrase_primary_id: courseId, table_name: 'courses', column_name: column, language: lang, translation: column_value },


                    });
                }
            })

            setLangData(curallLangData);

        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {

            setLoader(false);
            message.success('Course Updated Successfully');
            navigate('/' + userId + '/admin/courses')

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })

    };
    const handleEditorChange = (content) => {
        editForm.setFieldsValue({
            description: content
        })
        setEditorValue(content);
    }
    const onLanguageChange = (e) => {
        setLang(e.target.value);
        var selLangData = langData.find(item => item.lang === e.target.value);


        if (selLangData) {
            // console.log('sel2',selLangData,selLangData.data.content_html);
            setEditorValue(selLangData.data.description ? selLangData.data.description : '')
            editForm.setFieldsValue(selLangData.data);
            

        }

    }
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
                        <span>Manage Courses</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Edit Course</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="Edit Course" extra={<Button href={"#/"+userId+"/admin/courses"} ><i className="fa-solid fa-list pe-2" ></i>List Courses</Button>}>

                    <Spin spinning={loader} >
                        {

                            viewData && Object.keys(viewData).length > 0 && (<>
                                {
                                    lang && curLanguages && (<><Row>
                                        <Col xl={2}>Language</Col>
                                        <Col>
                                            <Radio.Group defaultValue="en" buttonStyle="solid" onChange={onLanguageChange}>
                                                {curLanguages.map(item => {
                                                    return (<Radio.Button value={item.id}>{item.name}</Radio.Button>)
                                                })}

                                            </Radio.Group>
                                        </Col>
                                    </Row><Divider /></>)

                                }
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
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Course Code"
                                                name="course_code"
                                                rules={[{ required: true, message: 'Please Enter Course Code' }]}
                                            >
                                                <Input  disabled={lang && lang !== "en"}
                                                placeholder="Course Code" />
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Course Name"
                                                name="course_name"
                                                rules={[{ required: true, message: 'Please Enter Course Name' }]}
                                            >
                                                <Input placeholder="Course Name" />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Duration"
                                                name="duration"
                                                rules={[{ required: true, message: 'Please Enter Duration' }]}
                                            >
                                                <Input placeholder="Duration" />
                                            </Form.Item>

                                        </Col>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Default Fee"
                                                name="default_fee"
                                                rules={[{ required: true, message: 'Please Enter Default Fee' }]}
                                            >
                                                <InputNumber  disabled={lang && lang !== "en"} placeholder="Default Fee" type="number" style={{ width: '100%' }} />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Course Status"
                                                name="course_status"
                                                rules={[{ required: true, message: 'Please Enter Course Status' }]}
                                            >

                                                <Select
                                                    showSearch
                                                    placeholder="Course Status"
                                                    disabled={lang && lang !== "en"}

                                                    optionFilterProp="children"
                                                    //onChange={courseStatusOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'course-status')}
                                                </Select>
                                            </Form.Item>

                                        </Col>

                                        <Col className='gutter-row' xs={24} xl={12}>

                                            <Form.Item
                                                label="Course Image"
                                                name="course_image"
                                                rules={[{ required: true, message: 'Please Choose Course Image' }]}
                                            >

                                                <ImageUpload
                                                    name="course_image"
                                                    cropRatio="5/3"
                                                    defaultImage={viewData.course_image ? viewData.course_image : null}
                                                    storeFileName={viewData.course_image ? viewData.course_image : 'public/uploads/' + new Date().valueOf() + '.jpg'}
                                                    onFinish={(fileName) => {
                                                        editForm.setFieldsValue({
                                                            course_image: fileName
                                                        })
                                                    }}
                                                />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Form.Item
                                        wrapperCol={{ offset: 0, span: 24 }}
                                        label="Course Description"
                                        name='description'
                                        labelCol={{ span: 24, offset: 0 }}
                                        style={{ marginTop: '0px' }}


                                        rules={[{
                                            // type: 'object',
                                            required: true,
                                            message: 'Description is required'
                                        }]}
                                    ><div className="editor-wrapper">
                                            <Editor
                                                //initialValue={viewData.description}
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

                                                value={editorValue}

                                                onEditorChange={handleEditorChange}
                                            />
                                        </div> </Form.Item>
                                    <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                        <Button size="large" type="primary" htmlType="submit" style={{}}>
                                            Save
                                        </Button>
                                    </Form.Item>

                                </Form>
                            </>)
                        }

                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default EditCourse;