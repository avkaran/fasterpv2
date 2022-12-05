import axios from 'axios';
import React, { useState, useEffect,useContext } from 'react';
import toast from 'react-hot-toast';
import {
    AutoComplete,
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Menu,
    Row,
    Timeline,
    Space
} from 'antd';
import { MailOutlined,EditOutlined,CheckCircleOutlined } from '@ant-design/icons';
import MockActivity from '../../../../../mock/activity'
import MockContacts from '../../../../../mock/contacts';
import profileImage from '../../../../../assets/images/avatar.jpg';
import background from '../../../../../assets/images/background2.jpg'
import PsContext from '../../../../../context';
const NewViewMember = (props) => {
    const context = useContext(PsContext);
    const FormItem = Form.Item;
    const AutoCompleteOption = AutoComplete.Option;

    const [viewData, setViewData] = useState([]);
    const [memberId] = useState(props.match.params.memberId)
    useEffect(() => {
        loadData(memberId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = (id) => {
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select *,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age from members where id='" + id + "'",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {
                console.log('results');
                console.log(res['data'].data[0])
                setViewData(res['data'].data[0])
               
            }
            else {
                toast.error(res['data'].message || 'Error');
            }

        });

    };
    const DescriptionItem = ({ title, content }) => (
        <div className="text-muted mb-2">
            <p
                className="text-body mr-3"
                css={`
        display: inline-block;
      `}
            >
                {title}:
            </p>
            <small>{content}</small>
        </div>
    );

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 }
        }
    };

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0
            },
            sm: {
                span: 16,
                offset: 8
            }
        }
    };

    const [activeTab, setActiveTab] = useState('1');
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);

    const handleWebsiteChange = value => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(
                domain => `${value}${domain}`
            );
        }
        setAutoCompleteResult(autoCompleteResult);
    };

    const websiteOptions = autoCompleteResult.map(website => (
        <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));


    return (
        <>
            <Card title="View Member" >
                <div>
                    <Card
                        headStyle={{
                            backgroundImage: `url(${background})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center'
                        }}
                        bodyStyle={{ padding: 0 }}
                        className="mb-4 overflow-hidden w-100"
                        title={
                            <Row type="flex" align="middle">
                                <Avatar size={74} src={profileImage} />
                                <div className="px-4 text-light">
                                    <h5 className="my-0 text-white">
                                        <b> karan</b>
                                    </h5>
                                    <small className="my-0 text-white">
                                        34 Yrs, &nbsp; Married, &nbsp;  B.E
                                    </small>
                                </div>

                            </Row>
                        }
                        extra={
                            <Row type="flex" align="middle" className="p-4">
                                <Space>
                                    <Button type="dashed" icon={<MailOutlined/>} ghost>Message</Button>
                                    <Button type="dashed" icon={<EditOutlined  />} ghost>Edit</Button>
                                    <Button type="dashed" icon={<CheckCircleOutlined  />} ghost>Activate/Pay</Button>
                                </Space>
                            </Row>
                        }
                    >
                        <Menu
                            onClick={tab => {
                                if (activeTab !== tab.key) setActiveTab(tab.key);
                            }}
                            selectedKeys={[activeTab]}
                            mode="horizontal"
                            className="border-bottom-0"
                        >
                            <Menu.Item key="1">Activity</Menu.Item>
                            <Menu.Item key="2">About me</Menu.Item>
                            <Menu.Item key="3">Friends</Menu.Item>
                            <Menu.Item key="4">Account & profile</Menu.Item>
                        </Menu>
                    </Card>

                    <Row type="flex" gutter={16}>
                        <Col
                            xl={8}
                            lg={12}
                            md={24}
                            sm={24}
                            xs={24}
                            order={2}
                        >
                            <Card bodyStyle={{ padding: 0 }} className="mb-4">
                                <Divider orientation="left">
                                    <small>Stats</small>
                                </Divider>

                                <Row
                                    className="text-center w-100 px-4"
                                    type="flex"
                                    align="middle"
                                    justify="space-between"
                                >
                                    <Col span={8}>
                                        <h2 className="m-0">
                                            <b>55</b>
                                        </h2>
                                        <small>Posts</small>
                                    </Col>
                                    <Col span={8}>
                                        <h2 className="m-0">
                                            <b>569</b>
                                        </h2>
                                        <small>Views</small>
                                    </Col>
                                    <Col span={8}>
                                        <h2 className="m-0">
                                            <b>67</b>
                                        </h2>
                                        <small>Comments</small>
                                    </Col>
                                </Row>

                                <Divider />
                                <div className="px-4 pb-4">
                                    <p className="text-uppercase mb-4">
                                        <strong>About Me</strong>
                                    </p>
                                    <p>
                                        Maecenas sed diam eget risus varius blandit sit amet non magna.
                                        Curabitur blandit tempus porttitor. Vestibulum id ligula porta
                                        felis euismod semper.
                                    </p>
                                </div>
                                <Divider />
                                <div className="px-4 pb-4">
                                    <p className="text-uppercase mb-4">
                                        <strong>Working Details</strong>
                                    </p>
                                    <p>
                                        Maecenas sed diam eget risus varius blandit sit amet non magna.
                                        Curabitur blandit tempus porttitor. Vestibulum id ligula porta
                                        felis euismod semper.
                                    </p>
                                </div>
                            </Card>
                        </Col>

                        <Col
                            xl={16}
                            lg={12}
                            md={24}
                            sm={24}
                            xs={24}
                            order={1}
                        >
                            {activeTab === '1' && (
                                <Card>
                                    <Timeline className="p-3">
                                        {MockActivity.map((item, index) => (
                                            <Timeline.Item key={index} dot={item.avatar && item.avatar}>
                                                <div className="ml-4">
                                                    <span
                                                        css={`
                          display: block;
                        `}
                                                    >
                                                        {item.title}
                                                    </span>
                                                    <small>{item.subtitle}</small>
                                                    <p>{item.body}</p>
                                                </div>
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                </Card>
                            )}

                            {activeTab === '2' && (
                                <Card bodyStyle={{ padding: 0 }}>
                                    <div className="p-4">
                                        <Row>
                                            <Col span={12}>
                                                <DescriptionItem title="Full Name" content="Lily" />
                                            </Col>
                                            <Col span={12}>
                                                <DescriptionItem
                                                    title="Account"
                                                    content="AntDesign@example.com"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <DescriptionItem title="City" content="HangZhou" />
                                            </Col>
                                            <Col span={12}>
                                                <DescriptionItem title="Country" content="China🇨🇳" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <DescriptionItem
                                                    title="Birthday"
                                                    content="February 2,1900"
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <DescriptionItem title="Website" content="-" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <DescriptionItem
                                                    title="Message"
                                                    content="Make things as simple as possible but no simpler."
                                                />
                                            </Col>
                                        </Row>
                                    </div>

                                    <Divider orientation="left">
                                        <small>Company</small>
                                    </Divider>

                                    <div className="p-4">
                                        <Row>
                                            <Col span={12}>
                                                <DescriptionItem title="Position" content="Programmer" />
                                            </Col>
                                            <Col span={12}>
                                                <DescriptionItem
                                                    title="Responsibilities"
                                                    content="Coding"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <DescriptionItem title="Department" content="AFX" />
                                            </Col>
                                            <Col span={12}>
                                                <DescriptionItem title="Supervisor" content={"content"} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <DescriptionItem
                                                    title="Skills"
                                                    content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
                                                />
                                            </Col>
                                        </Row>
                                    </div>

                                    <Divider orientation="left">
                                        <small>Contacts</small>
                                    </Divider>

                                    <div className="p-4">
                                        <Row>
                                            <Col span={12}>
                                                <DescriptionItem
                                                    title="Email"
                                                    content="AntDesign@example.com"
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <DescriptionItem
                                                    title="Phone Number"
                                                    content="+86 181 0000 0000"
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <DescriptionItem
                                                    title="Github"
                                                    content={
                                                        <a href="http://github.com/ant-design/ant-design/">
                                                            github.com/ant-design/ant-design/
                                                        </a>
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            )}

                            {activeTab === '3' && (
                                <Card>
                                    <Row>
                                        {MockContacts.map((contact, index) => (
                                            <Col xs={24} sm={12} lg={12} xl={8} key={index}>
                                                <Row type="flex" align="middle" className="w-100 mb-4">
                                                    {contact.avatar}
                                                    <span className="ml-4">
                                                        <span
                                                            css={`
                            display: block;
                          `}
                                                        >
                                                            {contact.name}
                                                        </span>
                                                        <small className="text-muted">
                                                            <span>{contact.status}</span>
                                                        </small>
                                                    </span>
                                                </Row>
                                            </Col>
                                        ))}
                                    </Row>
                                </Card>
                            )}

                            {activeTab === '4' && (
                                <Card>
                                    <Form>
                                        <FormItem {...formItemLayout} label="First name">

                                            <Input />
                                        </FormItem>

                                        <FormItem {...formItemLayout} label="Last name">


                                            <Input />
                                        </FormItem>

                                        <FormItem {...formItemLayout} label="E-mail">


                                            <Input />
                                        </FormItem>

                                        <FormItem {...formItemLayout} label="Phone Number">


                                            <Input
                                                // addonBefore={prefixSelector}
                                                style={{ width: '100%' }}
                                            />

                                        </FormItem>

                                        <FormItem {...formItemLayout} label="Company name">
                                            <Input />
                                        </FormItem>

                                        <FormItem {...formItemLayout} label="Website">

                                            <AutoComplete
                                                dataSource={websiteOptions}
                                                onChange={handleWebsiteChange}
                                                placeholder="website"
                                            >
                                                <Input />
                                            </AutoComplete>

                                        </FormItem>

                                        <Divider />

                                        <FormItem {...formItemLayout} label="Address line">
                                            <Input />
                                        </FormItem>

                                        <FormItem {...formItemLayout} label="Address line cont">
                                            <Input />
                                        </FormItem>

                                        <FormItem {...formItemLayout} label="City">
                                            <Input />
                                        </FormItem>

                                        <FormItem {...formItemLayout} label="State/Province">
                                            <Input />
                                        </FormItem>

                                        <FormItem {...formItemLayout} label="Postal code">
                                            <Input />
                                        </FormItem>

                                        <FormItem {...formItemLayout} label="Country">
                                            <Input />
                                        </FormItem>

                                        <FormItem {...tailFormItemLayout}>
                                            <Button type="primary" htmlType="submit">
                                                Save information
                                            </Button>
                                        </FormItem>
                                    </Form>
                                </Card>
                            )}
                        </Col>
                    </Row>
                </div>
            </Card>


        </>
    );
}
export default NewViewMember;