import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image,Menu,Tag } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable,PaginatedTable } from '../../../../comp'
import { green, yellow, grey,cyan } from '@ant-design/colors';
import { FormViewItem } from '../../../../comp';
import moment from 'moment'
const MyBookings = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [refreshTable, setRefreshTable] = useState(0);
    const [selBookingType,setSelBookingType]=useState('tour')
    useEffect(() => {
        var mItems=[];
        mItems.push({ label: 'Tours', key: 'tour' })
        mItems.push({ label: 'Hotels', key: 'hotel' })
        setMenuItems(mItems)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);    
    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_num',
            key: 'row_num',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: selBookingType==='tour'?'Package Name':'Hotel',
            dataIndex: 'name',
            key: 'name',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Travel Date',
           // dataIndex: 'location',
            key: 'date',
            render: (item) => <>{moment(item.data).format("DD/MM/YYYY")}</>,
        },
        {
            title: 'Travelers',
           // dataIndex: 'location',
            key: 'no_of_adults',
            render: (item) => <>Adults:{item.no_of_adults}, Child:{item.no_of_child}, Infants:{item.no_of_infant} </>,
        },
        {
            title: 'Total Cost',
           // dataIndex: 'location',
            key: 'total_cost',
            render: (item) => <>{item.booking_status !== 'waiting'?item.total_cost:'Not Defined'}</>,
        },
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'booking_status',
            render: (item) => <Tag color={item.booking_status === 'approved' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.booking_status}</Tag>,
        },
       /*  {
            title: 'Manage',
            //dataIndex: 'COLUMN_COMMENT',
            //key: 'booking_status',
            render: (item) => <><MyButton type="outlined">Details</MyButton></>,
        }, */


    ]
    const onNavigationClick=(e)=>{
        setSelBookingType(e.key)
        setRefreshTable(prev=>prev+1)
    }
    return (
        <>

            <Row gutter={12}>
                <Col xs={24} xl={5}>
                <Card
                                    bodyStyle={{
                                        padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7],
                                        border: '1px solid',
                                        borderBottom: '0',
                                        borderColor: cyan[2]
                                    }}
                                    style={{
                                        margin: "0px",
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '2px',

                                        //borderRadius: "20px",
                                    }}


                                >Navigation</Card>
                                <Menu
                                    mode="inline"
                                    theme="light"
                                    onClick={onNavigationClick}
                                    defaultSelectedKeys={[selBookingType]}
                                    style={{
                                        width: '100%',
                                        border: '1px solid',
                                        borderColor: cyan[2],
                                        borderTop: '0',
                                    }}
                                    items={menuItems}
                                />

                </Col>
                <Col xs={24} xl={19}>
                    {
                        selBookingType==='tour' && (<>
                         <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from bookings b,tour_packages p where b.room_or_tour_id=p.id and b.status=1 and b.booking_type='"+selBookingType+"' and  b.user_id=" + context.customerUser.id}
                                listQuery={"select b.*,p.package_name as name,@rownum:=@rownum+1 as row_num from bookings b,tour_packages p CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where b.room_or_tour_id=p.id and b.status=1 and b.booking_type='"+selBookingType+"' and  b.user_id=" + context.customerUser.id}
                                itemsPerPage={20}
                            />
                        </>)
                    }
                      {
                        selBookingType==='hotel' && (<>
                         <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from bookings b,hotel_rooms p where b.room_or_tour_id=p.id and b.status=1 and b.booking_type='"+selBookingType+"' and  b.user_id=" + context.customerUser.id}
                                listQuery={"select b.*,CONCAT(p.room_type,'-',h.hotel_name) as name,@rownum:=@rownum+1 as row_num from bookings b,hotel_rooms p,hotels h CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where b.room_or_tour_id=p.id and p.hotel_id=h.id and b.status=1 and b.booking_type='"+selBookingType+"' and  b.user_id=" + context.customerUser.id}
                                itemsPerPage={20}
                            />
                        </>)
                    }
               
                </Col>
            </Row>
        </>
    );

}
export default MyBookings;