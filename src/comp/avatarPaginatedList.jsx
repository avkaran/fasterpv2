import React, { useState, useContext, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { message, Card, Spin, Checkbox, Row, Col, Pagination,Space } from 'antd';
import { cyan } from '@ant-design/colors';
import PsContext from '../context'
import axios from 'axios';
const AvatarPaginatedList = forwardRef((props, ref) => {
    const context = useContext(PsContext);
    const { countQuery, listQuery, renderItem, recordsPerRequestOrPage, encryptFields, refresh, userId, listHeading, isCheckboxList, onCheckedChange, onPageChange, ...other } = props;
    const [data, setData] = useState([]);
    const [ids, setIds] = useState([]);
    const [checkStatus, setCheckStatus] = useState([]);
    const currentTotalRecords = useRef(0);
    const [initLoading, setInitLoading] = useState(false);
    const [checkedList, setCheckedList] = useState([]);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        resetResult();
        loadData(1, recordsPerRequestOrPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    useImperativeHandle(ref, () => ({
        getTotalRecords,
        getData,
        getSelected,
        recordCount: 50,

    }));
    //sample usage in parent
    //{InfiniteListRef.current && InfiniteListRef.current.getTotalRecords()}
    const getTotalRecords = () => {
        return currentTotalRecords.current;
    }
    const getSelected = () => {
        return checkedList;
    }
    const getData = () => {
        return data;
    }
    const loadData = (page, pageSize) => {

        setInitLoading(true);
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: listQuery.replace("{rowNumberVar}", ((page - 1) * pageSize).toString()) + " LIMIT " + ((page - 1) * pageSize) + "," + pageSize,
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}
            encrypt: encryptFields

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        form.append('mode', 'dev');
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                setData(res['data'].data);
                //ids in a separate state for checkbox purpose
                var currentIds = [];
                res['data'].data.forEach(item => { currentIds.push(item.id) });
                // console.log('ids', currentIds)
                setIds(currentIds);
                //  setCheckStatus(currentIds)
                setInitLoading(false);
                onPageChange(page, res['data'].data)

            }
            else {

                setInitLoading(false);

            }

        });

    };

    const resetResult = () => {

        setInitLoading(true);
        //reset records
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: countQuery,
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        // form.append('mode',"dev")
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                currentTotalRecords.current = res['data'].data[0].count;
                setInitLoading(false);
            }
            else {
                message.error("Error");
                setInitLoading(false);
            }

        });

    }
    const onCheckChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < ids.length);
        setCheckAll(list.length === ids.length);
        onCheckedChange(list, data);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? ids : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        if (e.target.checked)
            onCheckedChange(ids, data);
        else
            onCheckedChange([], data);
    };
    return (
        <><Spin spinning={initLoading}>
            <Card
                bodyStyle={{ padding: "12px", fontWeight: 'bold', fontSize: '18px', color: cyan[7] }}
                style={{
                    margin: "0px",
                    border: '1px solid #d9d9d9',
                    borderRadius: '2px',

                    //borderRadius: "20px",
                }}


            >
                {isCheckboxList && (<Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} />)}


                &nbsp;
                {listHeading} ({currentTotalRecords.current})

                {/*  <MyButton style={{ float: 'right' }} href={"#" + props.match.params.userId + "/admin/members/add-member"}> <i class="fa-solid fa-plus pe-2"></i> Add</MyButton> */}
            </Card>
            {
                isCheckboxList && (<Checkbox.Group value={checkedList} onChange={onCheckChange} style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {
                            data.map((item, index) => {

                                return (<Row style={{ background: '#fff' }} ><Col style={{ padding: '5px 5px 5px 5px', textAlign: "center" }} span={1}><Checkbox key={item.id} value={item.id} noStyle /></Col><Col span={23}>{renderItem(item, parseInt(item.row_number) - 1)}</Col></Row>)

                            })
                        }
                    </Space>
                </Checkbox.Group>)
            }
            {
                !isCheckboxList && (
                    <>{
                        data.map((item, index) => {

                            return renderItem(item, parseInt(item.row_number) - 1)
                        })
                    }
                    </>)
            }

            <Row style={{ background: '#e6fffb', padding: '5px 10px 10px 5px' }}>
                <Pagination
                    hideOnSinglePage={true}
                    total={currentTotalRecords.current}
                    showSizeChanger
                    showQuickJumper
                    //showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    showTotal={(total, range) => ` ${total} items`}
                    defaultPageSize={recordsPerRequestOrPage}
                    defaultCurrent={1}
                    onChange={(page, pageSize) => { loadData(page, pageSize) }}
                />
            </Row>
        </Spin></>
    );
})
export {
    AvatarPaginatedList,
} 