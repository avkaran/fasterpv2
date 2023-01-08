import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, message, Space, Input } from "antd";
import { MyButton } from "../../../../../../comp";
import dayjs from 'dayjs';
import {
    Breadcrumb,
    Layout,
    Card,
    Form,
    DatePicker,
    Select,
    Modal,
    Button, Tag,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import PsContext from "../../../../../../context";
import {
    PaginatedTable,
    FormItem,
    DeleteButton,
} from "../../../../../../comp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch, faClose
} from "@fortawesome/free-solid-svg-icons";
import { capitalizeFirst } from "../../../../../../utils";
import AddEditDist from "./addEditDist";
import ViewBusinessName from './viewDist';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
const Dist = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(true);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('District');
    const [searchForm] = Form.useForm();
    const [refreshTable, setRefreshTable] = useState(0);
    const [country, setCountry] = useState('India');
    const [districtLoading, setDistrictLoading] = useState(false)
    const [districts, setDistricts] = useState([]);
    const [addeditFormBranch] = Form.useForm();

    const filterColumns = useRef([
        " country='India'",
        " state='Tamil Nadu'",
    ]);
    useEffect(() => {
        searchForm.setFieldsValue({country:'India',state:'Tamil Nadu'})
    }, []);

    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_num',
            key: 'row_num',

        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',

        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',

        },
        {
            title: 'District',
            dataIndex: 'district_name',
            key: 'district_name',

        },

        {
            title: 'Actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
                <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1) }}
                    title={heading}
                    table="districts"
                    dataItem={{ id: item.id, country: item.country, state: item.state, district_name: item.district_name }}
                />
            </Space>,
        },
    ]
    const onAddClick = () => {
        setCurAction("add");

        if (isModal)
            setVisibleModal(true);

    }
    const onEditClick = (item) => {
        setViewOrEditData(item);
        setCurAction("edit");

        if (isModal)
            setVisibleModal(true);

    }
    const onViewClick = (item) => {
        setViewOrEditData(item);
        setCurAction("view");
        if (isModal)
            setVisibleModal(true);
    }
    const onFinishSearch = (values) => {
        var filter_clauses = [];

        if (values.district_name) filter_clauses.push(" district_name like '%" + values.district_name + "%'");
        if (values.state)
            filter_clauses.push(" state='" + values.state + "'");
        if (values.country)
            filter_clauses.push(" country='" + values.country + "'");

        filterColumns.current = filter_clauses;
        setRefreshTable((prev) => prev + 1);
    };

   
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
                        <span>{heading + "s"}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Branches</Breadcrumb.Item>
                </Breadcrumb>
                {
                    isModal && (<Modal
                        visible={visibleModal}
                        zIndex={999}
                        footer={null}
                        closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                        centered={false}
                        closable={true}
                        width={600}
                        onCancel={() => { setVisibleModal(false) }}
                        title={capitalizeFirst(curAction) + " " + heading}
                    >
                        {curAction === "view" && (<ViewBusinessName viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditDist onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditDist editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List Branches</Button>}>

                        {curAction === "view" && (<ViewBusinessName viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditDist onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditDist editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title="Transcation">
                    <Form
                        name="basic"
                        form={searchForm}
                        labelAlign="left"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinishSearch}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className="gutter-row" xs={24} xl={12}>
                                <Row>
                                    <Col className="gutter-row" xs={24} xl={12}>
                                        <FormItem
                                            label="Country"
                                            name='country'
                                            rules={[{ required: true, message: 'Please Enter Branch Country' }]}
                                        >

                                            <CountryDropdown
                                                className="ant-input"
                                                defaultValue={country}
                                                onChange={(val) => setCountry(val)} />
                                        </FormItem>
                                       
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col className='gutter-row' xs={24} xl={12}>

                                        <FormItem
                                            label="State"
                                            name='state'
                                            rules={[{ required: true, message: 'Please Enter  State' }]}
                                        >
                                            <RegionDropdown
                                                country={country}
                                                className="ant-input"

                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col className='gutter-row' xs={24} xl={12}>
                                        <FormItem
                                            label="District"
                                            name='district_name'
                                        //  rules={[{ required: true, message: 'Please Enter To District Name' }]}
                                        >
                                            <Input placeholder="District" />
                                        </FormItem></Col>
                                </Row>
                                <Row>
                                </Row>

                            </Col>
                            <Col className="gutter-row" xs={24} xl={12}>
                                <Row style={{ marginTop: '0%', marginLeft: '9%' }}>
                                    <MyButton style={{ marginTop: '6%' }}
                                        type="primary" htmlType="submit">
                                        <FontAwesomeIcon icon={faSearch} /> Search
                                    </MyButton>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                    <Card title={heading + " List"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>


                        <PaginatedTable
                            columns={tableColumns}
                            refresh={refreshTable}
                            countQuery={"select count(*) as count from districts where status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)}
                            listQuery={"select *,@rownum:=@rownum+1 as row_num from districts CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)}
                            itemsPerPage={20}
                        />

                    </Card>
                </Card>
            </Content>

        </>
    );
}
export default Dist;
