import React, { useState, useContext } from 'react';
import { Row, Col, Modal, Space, Avatar, Image, message } from 'antd';
import { red, yellow, cyan, grey } from '@ant-design/colors';
import PsContext from '../context'
import { MyButton } from './formComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';

const DeleteButton = (props) => {
    const context = useContext(PsContext);
    // eslint-disable-next-line no-unused-vars
    const { type, size, shape, color, title, dataItem, table, onFinish, avatar, ...other } = props;
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false)
    const handleDeleteMember = (id) => {
        setDeleteLoading(true);
        var form = new FormData();
        var reqData = {
            query_type: 'update',
            //query: '',
            table: table,
            where: { id: id },
            values: { status: 0 }

        };

        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        // form.append('mode',"dev");

        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                if (onFinish) onFinish(id);
                setDeleteLoading(false);
                setVisibleDeleteModal(false)
                message.success(title+' Deleted')

            }
            else {
                message.error(res['data'].message || 'Error');
                setDeleteLoading(false);
            }

        });
    }

    return (
        <>
            <MyButton type={type} size={size} shape={shape} color={color} onClick={() => {
                setVisibleDeleteModal(true)
            }}><FontAwesomeIcon icon={faTrash} /> {props.children}</MyButton>
            <Modal
                visible={visibleDeleteModal}
                zIndex={10000}
                footer={<Space><MyButton color={yellow[2]} borderColor={grey.primary} onClick={() => setVisibleDeleteModal(false)}>Cancel</MyButton>
                    <MyButton color={red[1]} borderColor={red.primary} loading={deleteLoading} onClick={() => handleDeleteMember(dataItem.id)}>Delete</MyButton></Space>}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleDeleteModal(false) }}
                title={<span style={{ color: red[4] }} ><FontAwesomeIcon icon={faUserTimes} /> &nbsp;Delete {title}?</span>}
            >
                <h5>Are you Sure to Delete below {title}?</h5>
                {avatar && (<Row gutter={16}>
                    <Col className='gutter-row' xs={24} xl={6}>
                        <Avatar size={100}
                            shape="circle"
                            src={<Image
                                width={100}
                                src={avatar}
                                preview={false}
                                fallback={context.noImg} />
                            }
                        />
                    </Col>
                    <Col className='gutter-row' xs={24} xl={18}>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={6}>{context.psGlobal.capitalizeFirst(Object.keys(dataItem)[1].replace("_", " "))}</Col>
                            <Col className='gutter-row' xs={24} xl={18} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{dataItem[Object.keys(dataItem)[1]]}</span></Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={6}>{context.psGlobal.capitalizeFirst(Object.keys(dataItem)[2].replace("_", " "))}</Col>
                            <Col className='gutter-row' xs={24} xl={18} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{dataItem[Object.keys(dataItem)[2]]}</span></Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={6}>{context.psGlobal.capitalizeFirst(Object.keys(dataItem)[3].replace("_", " "))}</Col>
                            <Col className='gutter-row' xs={24} xl={18} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{dataItem[Object.keys(dataItem)[3]]}</span></Col>
                        </Row>
                    </Col>
                </Row>)}
                {!avatar && (<><Row gutter={16}>
                    <Col className='gutter-row' xs={24} xl={6}>{context.psGlobal.capitalizeFirst(Object.keys(dataItem)[1].replace("_", " "))}</Col>
                    <Col className='gutter-row' xs={24} xl={18} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{dataItem[Object.keys(dataItem)[1]]}</span></Col>
                </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={6}>{context.psGlobal.capitalizeFirst(Object.keys(dataItem)[2].replace("_", " "))}</Col>
                        <Col className='gutter-row' xs={24} xl={18} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{dataItem[Object.keys(dataItem)[2]]}</span></Col>
                    </Row>

                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={6}>{context.psGlobal.capitalizeFirst(Object.keys(dataItem)[3].replace("_", " "))}</Col>
                        <Col className='gutter-row' xs={24} xl={18} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{ dataItem[Object.keys(dataItem)[3]]}</span></Col>
                    </Row>
                </>)}
            </Modal></>
    );
}
export {
    DeleteButton,
} 