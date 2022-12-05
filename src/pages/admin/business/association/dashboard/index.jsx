import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import toast from 'react-hot-toast';
import PsContext from '../../../../../context'
import axios from 'axios';
import StatCard from './statcard'
import {
    Card,
    Col,
    Row,
    Spin,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../../comp'
import { message, Space, Modal,Image } from 'antd';
import { green, yellow, grey } from '@ant-design/colors';
const Dashboard = (props) => {
    const context = useContext(PsContext);
    const [approveLoading, setApproveLoading] = useState(false);
    const [visibleArticleModal, setVisibleArticleModal] = useState(false)
    const [loader, setLoader] = useState(false);
    const [countData, setCountData] = useState([]);
    const [articleData, setArticleData] = useState([])
    const [viewArticle, setViewArticle] = useState({});
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

    }, []);

    const loadArticles = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from contents where status='1' and content_status='draft' and type='article' order by created_date desc"
        };

        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res, error) => {

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
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        });

    };
    const ApproveArticle=()=>{
        setApproveLoading(true);
        var reqData = { 
            query_type: 'update',
            table:'contents',
            where:{id:viewArticle.id},
            values:{content_status:'published'}

        };
       
        context.psGlobal.apiRequest(reqData,context.adminUser(props.match.params.userId).mode).then((res,error)=>{
            loadArticles();
            message.success('Article Approved and published');
            setApproveLoading(false);
            setVisibleArticleModal(false);
           
        }).catch(err => {
            message.error(err);
          
            setApproveLoading(false);
        })
        
    }
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
    return (
        <>
            <Card title="Dashboard">


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
            <Card title="Waiting Articles">
                <MyTable columns={tableColumns} dataSource={articleData}></MyTable>
            </Card>
            <Modal
                visible={visibleArticleModal}
                zIndex={10000}
                footer={<Space><MyButton color={yellow[2]} borderColor={grey.primary} onClick={() => setVisibleArticleModal(false)}>Cancel</MyButton>
                    <MyButton color={green[1]} borderColor={green.primary} loading={approveLoading} onClick={ApproveArticle}>Approve</MyButton></Space>}
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
                        {viewArticle.feature_image && (<Image src={context.baseUrl+viewArticle.feature_image} />)}
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} xl={24}>
                    <div dangerouslySetInnerHTML={{ __html: viewArticle.content_html }}></div>
                    </Col>
                </Row>
            </Modal></>
    );
};

export default Dashboard;
