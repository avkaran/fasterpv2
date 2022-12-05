import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { Button, Card, Checkbox, Upload, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { baseUrl } from '../../../../../utils';
import { HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { listCollections } from '../../../../../models/core'
import moment from 'moment';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import bcrypt from 'bcryptjs'
import { Steps } from 'antd';
import PsContext from '../../../../../context';
import { MyTable } from '../../../../../comp';

const MemberCounts = (props) => {
    const context = useContext(PsContext);
    const { Step } = Steps;
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const { Option } = Select;
    const { TextArea } = Input;
    const [loader, setLoader] = useState(false);
    const [countData, setCountData] = useState([])

    useEffect(() => {
        LoadData();

    }, []);
    const LoadData = () => {
        var reqData = [
            {
                query_type: 'query',
                query: "select count(*) as count from members where gender='Male' and status='1'  "
            },
            {
                query_type: 'query',
                query: "select count(*) as count from members where gender='Female' and status='1'"
            },
            {
                query_type: 'query',
                query: "select count(*) as count from members where gender='Male' and status='1'  and member_status='active'"
            },
            {
                query_type: 'query',
                query: "select count(*) as count from members where gender='Female' and status='1' and member_status='active'"
            },
            {
                query_type: 'query',
                query: "select count(*) as count from members where gender='Male' and status='1' and member_status='active' and manai='8'"
            },
            {
                query_type: 'query',
                query: "select count(*) as count from members where gender='Female' and status='1' and member_status='active' and manai='8'"
            },
             {
                query_type: 'query',
                query: "select count(*) as count from members where gender='Male' and status='1' and member_status='active' and manai='16'"
            },
            {
                query_type: 'query',
                query: "select count(*) as count from members where gender='Female' and status='1' and member_status='active' and manai='16'"
            } 
            ,
            {
                query_type: 'query',
                query: "select marital_status,count(*) as count from members where gender='Male' and status='1' and member_status='active' group by marital_status"
            }
        ]

        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res, error) => {
            var cData=[];
            cData.push({
                particular : "All Members",
                male:res[0][0].count,
                female:res[1][0].count,
                total:parseInt(res[0][0].count)+parseInt(res[1][0].count)
            })
            cData.push({
                particular : "Active Members",
                male:res[2][0].count,
                female:res[3][0].count,
                total:parseInt(res[2][0].count)+parseInt(res[3][0].count)
            })
            cData.push({
                particular : "Manai 8",
                male:res[4][0].count,
                female:res[5][0].count,
                total:parseInt(res[4][0].count)+parseInt(res[5][0].count)
            })
            cData.push({
                particular : "Manai 16",
                male:res[6][0].count,
                female:res[7][0].count,
                total:parseInt(res[6][0].count)+parseInt(res[7][0].count)
            }) 
           console.log('res',res[8]);
            setCountData(cData);

        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const tableColumns = [
        {
            title: 'S.No',
            //dataIndex: 'title',
            key: 'sno',
            render: (item, object, index) => <strong>{index + 1}</strong>,
        },
        {
            title: 'Particular',
            dataIndex: 'particular',
            key: 'particular',
            //render: (item) => <strong>{item}</strong>,
        },

        {
            title: 'Male',
            dataIndex: 'male',
            key: 'male',
            //render: (item) => <strong>{moment(item.expressed_date).format('DD/MM/YYYY hh:mm A')}</strong>,
        },
        {
            title: 'Female',
            dataIndex: 'female',
            key: 'female',
            //render: (item) => <strong>{moment(item.expressed_date).format('DD/MM/YYYY hh:mm A')}</strong>,
        }
        ,
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            //render: (item) => <strong>{moment(item.expressed_date).format('DD/MM/YYYY hh:mm A')}</strong>,
        },
    ]
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
                        <span>Manage Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Member Counts</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="Member Counts">
                    <Spin spinning={loader} >
                        <MyTable columns={tableColumns} dataSource={countData}></MyTable>
                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default MemberCounts;