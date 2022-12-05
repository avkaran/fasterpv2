import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate, withRouter, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { ImageUpload } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber, Modal, Image } from 'antd';
import PsContext from '../../../../context';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose, faHeart, faCircleArrowRight, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey, red } from '@ant-design/colors';
import ViewMember from '../search/viewMember';
import SearchListComponent from '../search/searchListComponent';
const MyMatches = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const [curAction, setCurAction] = useState('list');
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [refreshMemberList, setRefreshMemberList] = useState(0);
    const [sendBy,setSendBy] = useState(props.match.params.sendBy)
    const filterColumns = useRef(null);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
       
        var filter_clauses = [];
        filter_clauses.push(" m.gender<>'" + context.customerUser.gender + "'");
        
        filter_clauses.push(" m.caste=(select caste from members where id='"+context.customerUser.id+"')");
        filterColumns.current = filter_clauses;
        setRefreshMemberList(prev => prev + 1);

    }, []);
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
                <div className="row" style={{margin: '2px 2px 2px 2px'}}>
                    
                        <div className="col-md-1" style={{ background: '#fff',paddingTop:'10px',paddingBottom:'10px',color:green[7] }}>

                            <FontAwesomeIcon icon={faHeart}/>

                        </div>
                        <div className="col-md-11" style={{ background: '#fff',paddingTop:'10px',paddingBottom:'10px' }}>

                          My Matches

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
export default MyMatches;