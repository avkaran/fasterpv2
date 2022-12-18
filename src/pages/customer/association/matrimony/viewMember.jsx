import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, message, Image, Avatar } from 'antd';
import { ImageUpload, MyButton } from '../../../../comp'
import { Spin, Card } from 'antd';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { Form, Input, Select, InputNumber } from 'antd';
import PsContext from '../../../../context';
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { heightList } from '../../../../models/core'
import { ViewItem } from '../../../../comp';
import { red, yellow, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import ViewProfile from './viewProfile';
const ViewMember = (props) => {
    const navigate = useNavigate();
    const { Option } = Select;
    const context = useContext(PsContext);
    const [loader, setLoader] = useState(true);
    const [viewData, setViewData] = useState(null);
    const [editForm] = Form.useForm();
    const { TextArea } = Input;
    const [country, setCountry] = useState('');
    const [IsMatrimonyMember, setIsMatrimonyMember] = useState(false);
    useEffect(() => {
        setLoader(true);
        //   var id=props.memberId;
        loadData(props.match.params.memberId);
    }, []);
    const loadData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select *,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age from members where id='" + id + "'"
        };
        context.psGlobal.apiRequest(reqData, "prod").then((res, error) => {
            let mydata = res[0];
            setViewData(mydata)
            setLoader(false);
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
    const getHeight = (cm) => {
        let d = heightList.find((item) => item.cm == cm);
        return d && d.label;
    }
    return (
        <><div class="main-content right-chat-active" >

            <div style={{ paddingTop: '20px' }} >
                <Spin spinning={loader}> {viewData && (<><ViewProfile memberData={viewData} showBackButton={false} onBack={() => {
                    //setIsViewProfile(false);
                }} /></>)}</Spin>
            </div></div>
        </>
    );

}
export default ViewMember;