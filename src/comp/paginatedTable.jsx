import React, { useState, useEffect, useRef,useContext } from 'react';
import './comStyle.css'
import { Table, Pagination, Row } from 'antd';
import { apiRequest } from '../models/core';
import PsContext from "../context"

const PaginatedTable = (props) => {
    const context = useContext(PsContext);
    const { columns, countQuery, listQuery, itemsPerPage,refresh,userId,...other } = props;
    const [data, setData] = useState([]);
    const currentTotalRecords = useRef(0);
    const [pageLoading, setPageLoading] = useState(false);
    const resetResult = () => {
        setPageLoading(true);
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: countQuery
        };
        apiRequest(reqData, "prod").then((res) => {
            currentTotalRecords.current = res[0].count;
            setPageLoading(false);
        }).catch(err => {

            setPageLoading(false);
        })

    }
    const loadData = (page, pageSize) => {
        setPageLoading(true);
        var reqData = {
            query_type: 'query',
            query: listQuery.replace("{rowNumberVar}", ((page - 1) * pageSize).toString()) + " LIMIT " + ((page - 1) * pageSize) + "," + pageSize
        };
        apiRequest(reqData, "dev").then((res) => {
            setData(res);
            setPageLoading(false);
        }).catch(err => {

            setPageLoading(false);
        })

    };
    useEffect(() => {
        resetResult();
        loadData(1, itemsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    return (
        <><Table
            {...other}
            bordered
            loading={pageLoading}
            pagination={false}
            columns={columns}
            dataSource={data}
        />
            <Row style={{background: '#e6fffb',padding:'5px 10px 10px 5px'}}>
                <Pagination
                    hideOnSinglePage={true}
                    total={currentTotalRecords.current}
                    showSizeChanger
                    showQuickJumper
                    //showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    showTotal={(total, range) => ` ${total} items`}
                    defaultPageSize={itemsPerPage}
                    defaultCurrent={1}
                    onChange={(page, pageSize) => { loadData(page, pageSize) }}
                />
            </Row>
        </>
    );
}
export {
    PaginatedTable,
} 