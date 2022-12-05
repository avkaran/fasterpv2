import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import moment from 'moment';
import StatCard from './statcard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey, cyan } from '@ant-design/colors';
import axios from 'axios';
const CustomerDashboard = (props) => {
    const { Option } = Select;
    const context = useContext(PsContext);
    const [visibleArticleModal, setVisibleArticleModal] = useState(false)
    const [loader, setLoader] = useState(false);
    const [countData, setCountData] = useState([]);
    const [articleData, setArticleData] = useState([])
    const [viewArticle, setViewArticle] = useState({});
    const [matrimonyOptionLoading,setMatrimonyOptionLoading]=useState(false);
    const theme = {
        primaryColor: '#007bff',
        infoColor: '#1890ff',
        successColor: '#52c41a',
        processingColor: '#1890ff',
        errorColor: '#f5222d',
        highlightColor: '#f5222d',
        warningColor: '#faad14',
        normalColor: '#d9d9d9',
        backgroundColor: '#f7f7f9',
        darkColor: 'rgb(51, 51, 51)',
        textColor: 'rgba(0, 0, 0, .65)',
        textColorSecondary: 'rgba(0, 0, 0, .45)',

    }
    useEffect(() => {
        loadMemberCounts();
        loadArticles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadArticles = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from contents where status='1' and content_status='published' and type='article' order by created_date desc limit 30"
        };

        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {

            setArticleData(res);
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const loadMemberCounts = () => {

        setLoader(true);

        axios.post('v1/admin/member-counts').then(res => {
            if (res['data'].status === '1') {
                setCountData(res['data'].data);
            }
            else {
                message.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };
    const getCount = (status) => {

        if (countData) {

            let d = countData.find((item) => item.member_status === status);

            return d && parseInt(d.count);
        }
        else
            return ''

    }
    const tableColumns = [
        {
            title: 'S.No',
            // dataIndex: 'title',
            // key: 's_no',
            render: (item, object, index) => <strong>{(index + 1)}</strong>,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Article',
            //dataIndex: 'title',
            // key: 'title',
            render: (item) => <span>{item.content_html.replace(/<[^>]*>?/gm, '').substring(0, 100)}</span>,
        },
        {
            title: 'Action',
            //dataIndex: 'title',
            // key: 'title',
            render: (item) => <span><MyButton type="outlined" size="small" shape="circle"><FontAwesomeIcon icon={faEye} onClick={() => { setViewArticle(item); setVisibleArticleModal(true); }} /></MyButton></span>,
        },
    ]
    const ChangeMatrimonyOption = (selOption) => {
        setMatrimonyOptionLoading(true)
        //update in the profile
        var reqData = { 
            query_type: 'update', //query_type=insert | update | delete | query
            table:'members',
            where:{id:context.customerUser.id},
            values:{is_matrimony_member:selOption}
        };
        context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res,error)=>{
            var user = context.customerUser;
            user.is_matrimony_member = selOption;
            context.updateCustomerUser(user);
            message.success(selOption===1?"You Joined in Matrimony":'You Removed from Matrimony');
            setTimeout(() => {
                setMatrimonyOptionLoading(false)
                window.location.reload();
              }, 1000);
            ;
           
        }).catch(err => {
            message.error(err);
            setMatrimonyOptionLoading(false)
        })

       
    }
    return (
        <>
            <div class="main-content right-chat-active" >
                <div style={{ paddingTop: context.isMobile?'50px':'20px' }}>
                    <Card title="Dashboard" >

                        <Spin spinning={loader} >
                            <Row gutter={16}>
                                <Col xs={24} sm={12} md={6}>
                                    <StatCard

                                        title="All Members"
                                        value={getCount('all_members')}
                                        icon={<FontAwesomeIcon icon={faUser} />}
                                        color={theme.primaryColor}
                                        link={'/' + props.match.params.userId + '/admin/members'}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <StatCard

                                        title="Waiting for Approval"
                                        value={getCount('waiting')}
                                        icon={<FontAwesomeIcon icon={faUserTimes} />}
                                        color={theme.errorColor}
                                        link={'/' + props.match.params.userId + '/admin/members/filter/waiting'}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <StatCard

                                        title="Active Members"
                                        value={getCount('active')}
                                        icon={<FontAwesomeIcon icon={faUserCheck} />}
                                        color={theme.successColor}
                                        link={'/' + props.match.params.userId + '/admin/members/filter/active'}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <StatCard

                                        title="New Members(Today)"
                                        value={getCount('today_created')}
                                        icon={<FontAwesomeIcon icon={faUserClock} />}
                                        color={theme.processingColor}
                                        link={'/' + props.match.params.userId + '/admin/members/filter/today'}
                                    />
                                </Col>
                            </Row>
                        </Spin>
                    </Card>
                    <Row gutter={16} style={{ paddingLeft: '25px', paddingRight: '10px' }}>
                        <Col className='gutter-row' xs={24} xl={10} >
                            <table style={{ width: '100%' }}>
                                <tr>
                                    <td colspan="2" style={{ color: cyan[7], fontWeight: 'bold' }}> Our Subscription Bank Account</td>

                                </tr>
                                <tr>
                                    <td>Bank Name</td>
                                    <td>: Kodak Mahindra Bank</td>
                                </tr>
                                <tr>
                                    <td>A/c No</td>
                                    <td>: 7245179522</td>
                                </tr>
                                <tr>
                                    <td>Account Holder </td>
                                    <td>: 24 STAR DOCTORS WELFARE ASSOCIATION</td>
                                </tr>
                                <tr>
                                    <td>Branch</td>
                                    <td>: MADURAI - BIBIKULAM</td>
                                </tr>
                                <tr>
                                    <td>MICR Code </td>
                                    <td>: 625485002</td>
                                </tr>
                                <tr>
                                    <td>IFSC Code</td>
                                    <td>: KKBK0000511</td>
                                </tr>

                            </table>

                        </Col>
                        <Col className='gutter-row' xs={24} xl={14}>
                            <Card loading={matrimonyOptionLoading} title={parseInt(context.customerUser.is_matrimony_member) === 1 ? 'You are matrimony Member' : 'Join in Matrimony'}>
                                {
                                    parseInt(context.customerUser.is_matrimony_member) === 1 ? 'Your profile will shown in matrimony' : 'Join in Matrimony & then only your profile will shown in matrimony'
                                }
                                {
                                    parseInt(context.customerUser.is_matrimony_member) === 1 ? <MyButton type="primary" onClick={() => ChangeMatrimonyOption(0)}>I am Married, Remove from matrimony.</MyButton> : <MyButton type="primary" onClick={() => ChangeMatrimonyOption(1)}>Join Now</MyButton>
                                }

                            </Card>

                        </Col>
                    </Row>

                    <Card title="Recent Articles">
                        <MyTable columns={tableColumns} dataSource={articleData}></MyTable>
                    </Card>


                </div>


            </div>
            <Modal
                visible={visibleArticleModal}
                zIndex={10000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                // width={600}
                // footer={null}
                onCancel={() => { setVisibleArticleModal(false) }}
                title={<span style={{ color: green[4] }} >View Article</span>}
            >
                <Row>
                    <Col xs={24} xl={24}>
                        {viewArticle.title}
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} xl={24}>
                        {viewArticle.feature_image && (<Image src={context.baseUrl + viewArticle.feature_image} />)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} xl={24}>
                        <div dangerouslySetInnerHTML={{ __html: viewArticle.content_html }}></div>
                    </Col>
                </Row>
            </Modal>
        </>
    );

}
export default CustomerDashboard;