import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { withRouter, useNavigate } from 'react-router-dom';
import avg from '../../../../assets/images/avatar.jpg';
import PsContext from '../../../../context';
import { Form, Input, Select, InputNumber, message, Space } from 'antd';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNewspaper } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp';
import { Spin, Card } from 'antd';
const ExpressInterest = (props) => {
    const context = useContext(PsContext);
    const [interestSentData, setInterestSentData] = useState([]);
    const [interestReceivedData,setInterestReceivedData]=useState([]);

    const navigate = useNavigate();
    useEffect(() => {
       
        loadData();
    }, []);
    const loadData = () => {
        var reqData = [
            {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select m.name,m.id,i.expressed_date from express_interests i,members m where i.status='1' and m.status=1 and m.member_id=i.expressed_member_id and i.member_auto_id='" + context.customerUser.id + "' order by expressed_date desc"
            },
            {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select m.name,m.id,i.expressed_date from express_interests i,members m where i.status='1' and m.status=1 and m.member_id=i.member_id and i.expressed_member_id='" + context.customerUser.member_id + "' order by expressed_date desc"
            }
        ];

        context.psGlobal.apiRequest(reqData, "dev").then((res, error) => {
           setInterestSentData(res[0]);
           setInterestReceivedData(res[1]);
           console.log('res',res)

        }).catch(err => {
            message.error(err);
            //setLoader(false);
        })
    }
    const tableColumns=[
        {
            title: 'S.No',
            //dataIndex: 'title',
            key: 'sno',
            render: (item, object, index) => <strong>{index + 1}</strong>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            //render: (item) => <strong>{item}</strong>,
        },
        
        {
            title: 'Date',
           // dataIndex: 'name',
          //  key: 'name',
            render: (item) => <strong>{moment(item.expressed_date).format('DD/MM/YYYY hh:mm A')}</strong>,
        },
        {
            title: 'Action',
            // dataIndex: 'Document',
           // key: 'couse_image',
            render: (item) => <MyButton type="primary" href={"#/0/customer/view-member/" +item.id}>View</MyButton>,
        },
    ]
    return (
        <>
            <div class="main-content right-chat-active" >
                <div  style={{ paddingTop: context.isMobile?'50px':'20px' }}>
                    <Card title={"Express Interest " + context.psGlobal.capitalizeFirst(props.match.params.type)}>
                    {
                        props.match.params.type==="sent" && ( <MyTable columns={tableColumns} dataSource={interestSentData} />)
                        
                    }
                      {
                        props.match.params.type==="received" && ( <MyTable columns={tableColumns} dataSource={interestReceivedData} />)
                        
                    }
                    </Card>
                </div>



            </div>
        </>
    );
};

export default ExpressInterest;