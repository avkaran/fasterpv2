import React, { useState, useEffect, useContext } from 'react';
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
import { faUserCheck, faUser, faUserTimes, faUserClock, faEye, faCheck, faClose } from '@fortawesome/free-solid-svg-icons'
import { MyButton, MyTable } from '../../../../comp'
import { green, yellow, grey } from '@ant-design/colors';
import { FormViewItem } from '../../../../comp';
import moment from 'moment'
import Tours from './tours';
const HomeTourSearch = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
    const {phrase}=useParams()
    const [curAction, setCurAction] = useState('view');
    const [searchData,setSearchData]=useState(null)
    useEffect(() => {
        var phraseSplit = phrase.split(",");
        setSearchData(
            {
                travel_date:phraseSplit[0],
                price_from:phraseSplit[1],
                price_to:phraseSplit[2],
            }
        )
        //console.log(phraseSplit)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
          {
            searchData && (<Tours isLoggedView={false} searchData={searchData}/>)
          }
            
           
        </>
    );

}
export default HomeTourSearch;