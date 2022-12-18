import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose, faHeart, faCircleArrowRight, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey, red } from '@ant-design/colors';
import ViewMember from '../search/viewMember';
import SearchListComponent from '../search/searchListComponent';
const ExpressInterestProfiles = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [curAction, setCurAction] = useState('list');
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [refreshMemberList, setRefreshMemberList] = useState(0);
    //  const [sendBy,setSendBy] = useState(props.match.params.sendBy)
    const { sendBy } = useParams()
    const filterColumns = useRef(null);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // setSendBy(props.match.params.sendBy)
        var filter_clauses = [];
        filter_clauses.push(" m.gender<>'" + context.customerUser.gender + "'");
        if (sendBy === "other")
            filter_clauses.push(" m.id in(select member_auto_id from member_actions where action='express-interest' and to_member_auto_id='" + context.customerUser.id + "')");
        else
            filter_clauses.push(" m.id in(select to_member_auto_id from member_actions where action='express-interest' and member_auto_id='" + context.customerUser.id + "')");

        filterColumns.current = filter_clauses;
        setRefreshMemberList(prev => prev + 1);

    }, [sendBy]);
    const onViewClick = (item) => {
        setViewOrEditData(item);
        setCurAction("view")

    }
    const onSendInterestClick = (item) => {

        setViewOrEditData(item);
        setCurAction("view")

    }
    return (
        <><div>
            <div className="container">
                <div className="row" style={{ margin: '2px 2px 2px 2px' }}>

                    <div className="col-md-1" style={{ background: '#fff', paddingTop: '10px', paddingBottom: '10px', color: green[7] }}>

                        {sendBy === "me" && (<><FontAwesomeIcon icon={faHeart} /> <FontAwesomeIcon icon={faCircleArrowRight} /></>)}
                        {sendBy === "other" && (<><FontAwesomeIcon icon={faHeart} /> <FontAwesomeIcon icon={faCircleArrowLeft} /></>)}

                    </div>
                    <div className="col-md-11" style={{ background: '#fff', paddingTop: '10px', paddingBottom: '10px' }}>

                        {sendBy === "me" && (<>Express Interest has been sent to following Members</>)}
                        {sendBy === "other" && (<>Express Interest Received from following Members</>)}

                    </div>

                </div>
            </div>
        </div>
            {
                curAction === "view" && (<>
                    <div className="container">
                        <div className="row">

                            <Card title="View Member" extra={<MyButton onClick={() => setCurAction("list")}>Back</MyButton>}>
                                <ViewMember viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} />
                            </Card>

                        </div>
                    </div>
                </>)
            }
            <div style={{ display: (curAction === "list") ? 'block' : 'none' }}>
                {
                    filterColumns.current && (<SearchListComponent
                        onViewClick={onViewClick}
                        onSendInterestClick={onSendInterestClick}
                        filterColumnsRef={filterColumns.current}
                        refreshComponent={refreshMemberList}

                    />)
                }
            </div>
        </>
    );

}
export default ExpressInterestProfiles;