import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams,Link } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Upload, Collapse, DatePicker } from 'antd';
import { Form, Input, Select } from 'antd';
import { Breadcrumb, Layout, Spin, Space } from 'antd';
import { capitalizeFirst } from '../../../utils'
import { baseUrl } from '../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { contentTypes } from '../../../utils/data';
import { Editor } from '@tinymce/tinymce-react';
import PsContext from '../../../context'
import dayjs from 'dayjs';
import ImgCrop from 'antd-img-crop';
import ResponsiveLayout from '../layout'
const AddContent = (props) => {
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const { Option } = Select;
    const { Panel } = Collapse;
    const context = useContext(PsContext);
const {userId,content_type:contentType}=useParams();
    const { TextArea } = Input;
  
    const [categoryData, setCategoryData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [imageRatio, setImageRatio] = useState(null);


    useEffect(() => {
        loadCategories();
    }, []);
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    const loadCategories = () => {
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select id,category_name,image_ratio from content_categories where content_type='" + contentType + "' ORDER BY category_name",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            setLoader(false);
            setCategoryData(res)

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const handleEditorChange = (e) => {
        addForm.setFieldsValue({
            content_html: { html: e.target.getContent() }
        })


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
    const UploadFile = (file) => {
        console.log(file)
        getBase64(file, (data64) => {
            var form = new FormData();
            form.append('file_data', data64)
            form.append('file_name', file.name)
            var fileName = 'public/uploads/' + new Date().valueOf() + '.jpg';
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
        if (uploadedFileName !== '') processedValues['feature_image'] = uploadedFileName;
        processedValues['type'] = contentType;
        processedValues['content_status'] = 'draft';
       // processedValues['add_by'] = context.adminUser.username;

        if (processedValues['seo_meta_keywords'])
            processedValues['seo_meta_keywords'] = values['seo_meta_keywords'].join(",");

        if (processedValues['seo_tags'])
            processedValues['seo_tags'] = values['seo_tags'].join(",");

        var form = new FormData();
		Object.entries(processedValues).forEach(([key, value], index) => {
			form.append(key, value)
		})
        axios.post('admin/contents/save', form).then(res => {
            if (res['data'].status === '1') {
                message.success(res['data'].message || 'Success');
                //console.log(res['data'].data);
                setLoader(false);
                navigate("/" + userId + '/admin/contents/' + contentType + '/list')
            }
            else {
                message.error(res['data'].message || 'Error');
                setLoader(false);
            }

        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
        //console.log(categoryData,value);
        if (selCategory) {
            if (selCategory.image_ratio === "any")
                setImageRatio("any");
            else {
                let splitRatio = selCategory.image_ratio.split(":");
                setImageRatio(splitRatio[0] + "/" + splitRatio[1])
            }

        }

    }
    const uploadComponent = (<Upload
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
    </Upload>);
    return (
        <>

            <ResponsiveLayout

                userId={userId}
                customHeader={null}
                bottomMenues={null}
                breadcrumbs={[
                    { name: capitalizeFirst(contentType.replace("-", " ")) + ' List', link: null },
                    { name: 'Add ' + capitalizeFirst(contentType.replace("-", " ")), link: null },
                ]}
            >

                <Card title={"Add " + capitalizeFirst(contentType.replace("-", " "))} extra={<Link to={"/" + userId + "/admin/contents/" + contentType + "/list"}><Button><i className="fa-solid fa-list pe-2" ></i>List {capitalizeFirst(contentType.replace("-", " "))}</Button></Link>}>
                    <Spin spinning={loader} >
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

                                            optionFilterProp="children"
                                            //onChange={courseStatusOnChange}
                                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            onChange={onCategoryChange}
                                        >
                                            {categoryData.map((d) => <Option key={d.id}>{d.category_name}</Option>)}
                                        </Select>

                                    </Form.Item>)}
                                    <Form.Item
                                        label="Title"
                                        name="title"
                                        rules={[{ required: true }]}
                                    >
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
                                                        allowClear={false}
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
                                                        allowClear={false}
                                                    />
                                                </Space>

                                            </Form.Item>
                                        </Input.Group>
                                    </Form.Item>


                                </Col>
                                <Col className='gutter-row' span={12}>
                                    {(contentType !== contentTypes.ANNOUNCEMENT) && (<Form.Item
                                        label="Feature Image"
                                        name='feature_image'


                                    // rules={[{ required: true, message: 'Feature Image is required' }]}
                                    >
                                        {
                                            imageRatio && imageRatio !== "any" && (<ImgCrop grid rotate aspect={parseInt(imageRatio.split("/")[0]) / parseInt(imageRatio.split("/")[1])}>
                                                <Upload
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



                                        onChange={handleEditorChange}
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

                        </Form>
                    </Spin>
                </Card>

            </ResponsiveLayout>

        </>
    );

}
export default AddContent;