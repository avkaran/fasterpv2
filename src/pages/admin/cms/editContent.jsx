import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams,Link } from 'react-router-dom';
import { Row, Col, message, AutoComplete } from 'antd';
import { Button, Card, Upload, Image, Space, Collapse, DatePicker, Radio } from 'antd';
import { Form, Input, Select } from 'antd';
import { Breadcrumb, Layout, Spin, Divider } from 'antd';
import { capitalizeFirst, currentInstance, businesses } from '../../../utils'
import { baseUrl } from '../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { contentTypes } from '../../../utils/data';
import { Editor } from '@tinymce/tinymce-react';
import PsContext from '../../../context'
import dayjs from 'dayjs';
import ImgCrop from 'antd-img-crop';
import { languages } from '../../../models/core';
import ResponsiveLayout from '../layout'
const EditContent = (props) => {
    const context = useContext(PsContext);
const {userId,content_type:contentType,id:contentId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const { Option } = Select;
    const { Panel } = Collapse;
    const { TextArea } = Input;
    const [categoryData, setCategoryData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [viewData, setViewData] = useState([]);
    const [imageRatio, setImageRatio] = useState(null);
    const [lang, setLang] = useState(null);
    const [curLanguages, setCurLanguages] = useState(null);
    const [langData, setLangData] = useState(null);
    const [editorValue, setEditorValue] = useState('');
    const [lColumns] = useState(['title', 'content', 'content_html', 'seo_slug', 'seo_meta_title', 'seo_meta_description', 'seo_meta_keywords', 'seo_tags']);
    const [autoCompleteData, setAutoCompleteData] = useState([])
    useEffect(() => {
        loadCategories();
        loadData(contentId);
        //getTranslieration("karan");
        if (businesses[currentInstance.index].multilingual) {
            setLang("en");
            var langs = languages.filter(item => businesses[currentInstance.index].multilingual.indexOf(item.id) > -1);
            setCurLanguages(langs);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = (id) => {
        setLoader(true);
        var form = new FormData();
        var reqData = [{ //if array of queries pass [] outside
            query_type: 'query',
            query: "select c.*,cc.category_name,cc.image_ratio from contents c, content_categories cc where cc.id=c.category AND c.id='" + id + "'",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        },
        { //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from translations where  status=1 and source_type='table' and table_name='contents' and phrase_primary_id='" + id + "'",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        },
        ];
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {
                let mydata = res['data'].data[0][0];

                setViewData(mydata);
                if (mydata.image_ratio === "any")
                    setImageRatio("any");
                else {
                    let splitRatio = mydata.image_ratio.split(":");
                    setImageRatio(splitRatio[0] + "/" + splitRatio[1])
                }
                // setSelDate(mydata.dob)
                // if(mydata.feature_image) setImageUrl(baseUrl+mydata.feature_image);
                //message.success(mydata.category);
                if (mydata.seo_meta_keywords)
                    mydata.seo_meta_keywords = mydata.seo_meta_keywords.split(",");
                if (mydata.seo_tags)
                    mydata.seo_tags = mydata.seo_tags.split(",");
                addForm.setFieldsValue(mydata);
                addForm.setFieldsValue({

                    content_html: { html: mydata.content_html },

                });
                setEditorValue(mydata.content_html);


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
                            var trData = res['data'].data[1].find(obj => obj.language === lang.id && obj.column_name === column);

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
            }
            else {
                message.error(res['data'].message || 'Error');
            }

        });

    };
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const loadCategories = () => {
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select id,category_name from content_categories where content_type='" + contentType + "' ORDER BY category_name",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {

            setCategoryData(res)

        }).catch(err => {
            message.error(err);

        })
    }
    const handleEditorChange = (content) => {
        setEditorValue(content);
        addForm.setFieldsValue({
            content_html: { html: content }
        })
        setEditorValue(content);
    }
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }

        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        UploadFile(file);
        return isJpgOrPng && isLt2M;
    };
    const handleFileChange = (info) => {
        if (info.file.status === 'uploading') {
            setImgLoading(true);
            return;
        }
        /* if (info.file.status === 'done') {
            // Get this url from response in real world.
            message.success('done')
            getBase64(info.file.originFileObj, (url) => {
                setImgLoading(false);
                setImageUrl(url);
            });
        } */
    };
    const getTranslieration = async (text) => {
        return new Promise((resolve, reject) => {
            fetch("https://inputtools.google.com/request?itc=ta-t-i0-und&text=" + text + "&num=10&cp=1&cs=0&ie=utf-8&oe=utf-8").then((response) => response.json()).then(data => {
                if (data[0] === "SUCCESS")
                    resolve(data[1][0][1]);

            }).catch((error) => {
                reject("Google Api Error")
            });
        });

    }
    const UploadFile = (file) => {

        getBase64(file, (data64) => {
            var form = new FormData();
            form.append('file_data', data64)
            form.append('file_name', file.name)

            var  fileName = 'public/uploads/' + new Date().valueOf() + '.jpg';
            form.append('store_file_name', fileName)
            setUploadedFileName(fileName)

            axios.post('v1/admin/upload-image', form).then(res => {
                if (res['data'].status === '1') {
                    setImgLoading(false);
                    setImageUrl(baseUrl + fileName);
                }
                else {
                    message.error(res['data'].message || 'Error');
                }

            });

        });


    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value], index) => {
            if (value) {
                if (key === "content_html")
                    processedValues[key] = value.html;
                else
                    processedValues[key] = value;

            }

        });
        //add photo if

        if (uploadedFileName !== '')
			processedValues['feature_image'] = uploadedFileName;
		else
			delete processedValues['feature_image'];

        if (processedValues['seo_meta_keywords'])
            processedValues['seo_meta_keywords'] = values['seo_meta_keywords'].join(",");

        if (processedValues['seo_tags'])
            processedValues['seo_tags'] = values['seo_tags'].join(",");


       /*
        var reqData = [];
        if (!lang || (lang && lang === "en")) {
            reqData.push({ //if array of queries pass [] outside
                query_type: 'update',
                // query: "select * from members where id='" + id + "'",
                table: 'contents',
                where: { id: contentId },
                values: processedValues

            });
        }
        else {
            reqData.push({ //if array of queries pass [] outside
                query_type: 'delete',
                // query: "select * from members where id='" + id + "'",
                table: 'translations',
                where: { source_type: 'table', table_name: 'contents', phrase_primary_id: contentId }
            });
            var curallLangData = langData;
            var langIndex = curallLangData.findIndex(item => item.lang = lang)
            lColumns.forEach(column => {

                if (values[column]) {
                    var column_value = values[column];
                    if (column === "content_html")
                        column_value = values[column].html;
                    curallLangData[langIndex].data[column] = column_value;
                    if (column === 'seo_meta_keywords')
                        column_value = values[column].join(",");

                    if (column === 'seo_tags')
                        column_value = values[column].join(",");



                    reqData.push({ //if array of queries pass [] outside
                        query_type: 'insert',
                        // query: "select * from members where id='" + id + "'",
                        table: 'translations',
                        values: { source_type: 'table', phrase_primary_id: contentId, table_name: 'contents', column_name: column, language: lang, translation: column_value },


                    });
                }
            })

            setLangData(curallLangData);

        }

        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)));
        form.append('mode', "dev")
        */
        if(processedValues['feature_image']){
            if(viewData.feature_image)
            processedValues['old_feature_image']=viewData.feature_image;
        }
        var form = new FormData();
        form.append('id', contentId);
		Object.entries(processedValues).forEach(([key, value], index) => {
			form.append(key, value)
		})
       
        axios.post('admin/contents/update', form).then(res => {
            if (res['data'].status === '1') {
                message.success(res['data'].message || "Updated");


                setLoader(false);
                //navigate('/' + userId + '/admin/contents/' + contentType + "/list")
            }
            else {
                message.error(res['data'].message || 'Error');
                setLoader(false);
            }

        });
    };

    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };

    const uploadButton = (
        <div>
            {imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    const activeFrom_dateOnChange = (date) => {

        addForm.setFieldsValue({
            active_from_date: dayjs(date).format('YYYY-MM-DD')
        })
    };
    const activeTo_dateOnChange = (date) => {

        addForm.setFieldsValue({
            active_to_date: dayjs(date).format('YYYY-MM-DD')
        })
    };
    const onCategoryChange = (value) => {
        let selCategory = categoryData.find(item => parseInt(item.id) === parseInt(value));

        if (selCategory) {
            if (selCategory.image_ratio === "any")
                setImageRatio("any");
            else {
                let splitRatio = selCategory.image_ratio.split(":");
                setImageRatio(splitRatio[0] + "/" + splitRatio[1])
            }

        }

    }
    const onLanguageChange = (e) => {
        setLang(e.target.value);
        var selLangData = langData.find(item => item.lang === e.target.value);


        if (selLangData) {
            // console.log('sel2',selLangData,selLangData.data.content_html);
            setEditorValue(selLangData.data.content_html ? selLangData.data.content_html : '')
            addForm.setFieldsValue(selLangData.data);
            addForm.setFieldsValue({
                content_html: { html: selLangData.data.content_html }
            })

        }



    }
    const handleAutoCompleteSearch = (value) => {
        if (value) {
            var words = value.split(" ");
            getTranslieration(words.pop()).then(res => {
                setAutoCompleteData(res);
            })

        }


    }
    return (
        <>

            <ResponsiveLayout

                userId={userId}
                customHeader={null}
                bottomMenues={null}
                breadcrumbs={[
                    { name: capitalizeFirst(contentType.replace("-", " ")) + " List", link: "#/" + userId + "/admin/contents" },
                    { name: 'Edit' + capitalizeFirst(contentType.replace("-", " ")), link: null },
                ]}
            >
                <Card title={"Edit " + capitalizeFirst(contentType.replace("-", " "))} extra={<Link to={"/" + userId + "/admin/contents/" + contentType + "/list"}><Button><i className="fa-solid fa-list pe-2" ></i>List {capitalizeFirst(contentType.replace("-", " "))}</Button></Link>}>
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
                                    form={addForm}
                                    labelAlign="left"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 20 }}
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >
                                    <Row gutter={16}>
                                        <Col className='gutter-row' span={12}>
                                            {(contentType !== contentTypes.ANNOUNCEMENT) && (<Form.Item
                                                label="category"
                                                name='category'


                                                rules={[{ required: true, message: 'Category is required' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Category"
                                                    disabled={lang && lang !== "en"}
                                                    optionFilterProp="children"
                                                    onChange={onCategoryChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    {categoryData.map((d) => <Option key={d.id}>{d.category_name}</Option>)}
                                                </Select>
                                            </Form.Item>)}
                                            <Form.Item
                                                label="Title"
                                                name="title"
                                                rules={[{ required: true }]}
                                            >
                                                {/*  <AutoComplete
                                                    className="search-dropdown"
                                                    dataSource={autoCompleteData}
                                                   // backfill={true}
                                                   // style={{ width: '100%' }}
                                                   // defaultActiveFirstOption={false}
                                                   // onSelect={this.onSelect}
                                                    onSearch={handleAutoCompleteSearch}
                                                    onChange={(value)=>{}}
                                                // filterOption={(inputValue, option) =>
                                                //   option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                                // }
                                                ></AutoComplete> */}
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                label="Active Date"
                                            // name="membership_plan"
                                            // rules={[{ required: true, message: 'Enter Amount' }]}
                                            >
                                                <Input.Group compact>
                                                    <Form.Item
                                                        // label="Active From_date"
                                                        name="active_from_date"
                                                        rules={[{ required: true, message: 'From Date' }]}
                                                    >
                                                        <Space direction="vertical">
                                                            From <DatePicker onChange={activeFrom_dateOnChange} format='DD/MM/YYYY'

                                                                //disabledDate={activeFrom_dateDisabled}
                                                                disabled={lang && lang !== "en"}
                                                                allowClear={false}
                                                                defaultValue={viewData && dayjs(viewData.active_from_date, 'YYYY-MM-DD')}
                                                            />
                                                        </Space>
                                                    </Form.Item>
                                                    <Form.Item
                                                        // label="Active To_date"
                                                        name="active_to_date"
                                                        rules={[{ required: true, message: 'To Date' }]}
                                                    >

                                                        <Space direction="vertical">
                                                            To   <DatePicker onChange={activeTo_dateOnChange} format='DD/MM/YYYY'

                                                                //disabledDate={activeTo_dateDisabled}
                                                                disabled={lang && lang !== "en"}
                                                                allowClear={false}
                                                                defaultValue={viewData && dayjs(viewData.active_to_date, 'YYYY-MM-DD')}
                                                            />
                                                        </Space>

                                                    </Form.Item>
                                                </Input.Group>
                                            </Form.Item>
                                        </Col>
                                        <Col className='gutter-row' span={12}>
                                            {(contentType !== contentTypes.ANNOUNCEMENT) && (


                                                <Form.Item
                                                    label="Feature Image"
                                                    name='feature_image'


                                                // rules={[{ required: true, message: 'Feature Image is required' }]}
                                                ><Space>
                                                        {viewData.feature_image && (<Image height={100} src={baseUrl  +'/cloud-file/'+ encodeURIComponent(encodeURIComponent(viewData.feature_image))} ></Image>)}
                                                        {
                                                            imageRatio && imageRatio !== "any" && (<ImgCrop grid rotate aspect={parseInt(imageRatio.split("/")[0]) / parseInt(imageRatio.split("/")[1])}><Upload
                                                                name="avatar"
                                                                listType="picture-card"
                                                                className="avatar-uploader"
                                                                showUploadList={false}
                                                                // action="http://localhost/24mtc/api//v1/admin/upload-image"
                                                                action={(file) => {
                                                                    //  UploadFile(file)

                                                                }}
                                                                beforeUpload={beforeUpload}
                                                                onChange={handleFileChange}
                                                            >
                                                                {imageUrl ? (
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt="avatar"
                                                                        style={{
                                                                            width: '100%',
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    uploadButton
                                                                )}
                                                            </Upload></ImgCrop>)
                                                        }
                                                        {
                                                            imageRatio && imageRatio === "any" && (<Upload
                                                                name="avatar"
                                                                listType="picture-card"
                                                                className="avatar-uploader"
                                                                showUploadList={false}
                                                                // action="http://localhost/24mtc/api//v1/admin/upload-image"
                                                                action={(file) => {
                                                                    //  UploadFile(file)

                                                                }}
                                                                beforeUpload={beforeUpload}
                                                                onChange={handleFileChange}
                                                            >
                                                                {imageUrl ? (
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt="avatar"
                                                                        style={{
                                                                            width: '100%',
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    uploadButton
                                                                )}
                                                            </Upload>)
                                                        }
                                                    </Space>

                                                </Form.Item>)}
                                        </Col>
                                    </Row>
                                    {(contentType === contentTypes.SLIDER || contentType === contentTypes.GALLERY) && (<Form.Item
                                        wrapperCol={{ offset: 0, span: 24 }}
                                        label="Content"
                                        name='content'
                                        labelCol={{ span: 24, offset: 0 }}
                                        style={{ marginTop: '0px' }}


                                        rules={[{ required: true, message: 'Content is required' }]}
                                    >
                                        <TextArea rows={5} maxLength={24} />
                                    </Form.Item>)}


                                    {(contentType !== contentTypes.SLIDER && contentType !== contentTypes.GALLERY) && (<Form.Item
                                        wrapperCol={{ offset: 0, span: 24 }}
                                        label="Content"
                                        name='content_html'
                                        labelCol={{ span: 24, offset: 0 }}
                                        style={{ marginTop: '0px' }}


                                        rules={[{
                                            type: 'object',
                                            required: true,
                                            message: 'Content is required'
                                        }]}
                                    ><div className="editor-wrapper">
                                            <Editor
      apiKey='aqgwg5nhsm57d07rdlff1bu6lj1aej23f41cyg7txuzc527u'
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
                                        </div> </Form.Item>)}



                                    {(contentType === contentTypes.ARTICLE || contentType === contentTypes.PAGE || contentType === contentTypes.EVENT) && (<Collapse accordion ghost>
                                        <Panel header="SEO Info" key="1">
                                            <Form.Item
                                                wrapperCol={{ offset: 0, span: 24 }}

                                                label="Slug/Url"
                                                name='seo_slug'
                                                labelCol={{ span: 4, offset: 0 }}
                                            //  style={{ marginTop: '0px' }}


                                            //rules={[{ required: true, message: 'Name is required' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Row gutter={16}>
                                                <Col className='gutter-row' span={12}>
                                                    <Form.Item
                                                        label="Meta Title"
                                                        name='seo_meta_title'



                                                    >
                                                        <TextArea />
                                                    </Form.Item>

                                                </Col>
                                                <Col className='gutter-row' span={12}>
                                                    <Form.Item
                                                        label="Meta Description"
                                                        name='seo_meta_description'



                                                    >
                                                        <TextArea />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col className='gutter-row' span={12}>
                                                    <Form.Item
                                                        label="Meta Keywords"
                                                        name='seo_meta_keywords'



                                                    >
                                                        <Select
                                                            mode="tags"
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                            //onChange={handleChange}
                                                            tokenSeparators={[',']}
                                                        >

                                                        </Select>
                                                    </Form.Item>

                                                </Col>
                                                <Col className='gutter-row' span={12}>
                                                    <Form.Item
                                                        label="SEO Tags"
                                                        name='seo_tags'



                                                    >
                                                        <Select
                                                            mode="tags"
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                            //onChange={handleChange}
                                                            tokenSeparators={[',']}
                                                        >
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Panel>

                                    </Collapse>)}

                                    <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Form.Item>

                                </Form></>)
                        }

                    </Spin>
                </Card>

            </ResponsiveLayout>

        </>
    );

}
export default EditContent;