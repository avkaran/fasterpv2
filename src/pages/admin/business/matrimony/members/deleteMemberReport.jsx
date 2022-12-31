import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin, DatePicker } from 'antd';
import { Space, Select, Tabs, Collapse, Input, Button, Card, Tag } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Form } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { PaginatedTable, FormItem } from '../../../../../comp';
import ViewMember from './viewMember';
import { green, red, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs'


const DeleteMemberReport = (props) => {
  const context = useContext(PsContext);
  const { userId } = useParams();
  const { Panel } = Collapse;
  const [searchForm] = Form.useForm();
  const { Option } = Select;
  const [searchByIdForm] = Form.useForm();
  const { Content } = Layout;
  const [refreshTable, setRefreshTable] = useState(0);
  const [viewOrEditData, setViewOrEditData] = useState(null);
  const [curAction, setCurAction] = useState('list');
  const [searchActiveKeys, setSearchActiveKeys] = useState([]);
  const [refreshMemberList, setRefreshMemberList] = useState(0);
  const filterColumns = useRef(null);

  const restoreMember = (itemId) => {
    var reqDataUpdate =
    {
      query_type: 'update',
      table: 'members',
      where: { id: itemId },
      values: { status: 1 }
    }
    context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
      message.success('Updated Successfullly');
      setCurAction("list")
      setRefreshTable(prev => prev + 1);
    }).catch(err => {
      message.error(err);
    })

  }
  const tableColumns = [
    {
      title: 'S.No',
      dataIndex: 'row_number',
      key: 'row_number',
    },
    {
      title: 'Member Id',
      dataIndex: 'member_id',
      key: 'member_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mobile No',
      dataIndex: 'mobile_no',
      key: 'mobile_no',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (item) => <Space>
        {/* <MyButton type="outlined" size="small" shape="circle" onClick={() => onViewClick(item)}
        ><i class="fa-solid fa-eye"></i></MyButton> */}

        <MyButton type="outlined" size="small" shape="square" onClick={() => restoreMember(item.id)}
        >Restore</MyButton>
      </Space>,
    },
  ]

  const onViewClick = (item) => {
    console.log(item);
    setViewOrEditData(item);
    setCurAction('view');
  }

  const onFinishSearch = (values) => {
    console.log(values);
    var filter_clauses = [];
    if (values.member_id) 
      filter_clauses.push(" (m.member_id ='" + values.member_id + "' or m.mobile_no = '"+values.member_id+"' or m.name = '"+values.member_id+"')");
      filterColumns.current = filter_clauses;
    setRefreshTable(pre => pre + 1)
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
          <Breadcrumb.Item>
            <span>Manage Members</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>List Members</Breadcrumb.Item>
        </Breadcrumb>
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
            <Col className='gutter-row' xs={24} xl={20}>
              <Form.Item
                label="Member Id/Name/Mobile No"
                name="member_id"
              >
                <Input placeholder="Member Id / Name / Mobile No" />
              </Form.Item>
            </Col>
            <Col className='gutter-row' xs={24} xl={4}>
              <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                <Button size="large" type="primary" htmlType="submit" style={{}}>
                  <FontAwesomeIcon icon={faSearch} /> &nbsp; Search
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {
          curAction == 'view' && viewOrEditData && (<Card title="View Member" extra={<MyButton onClick={() => setCurAction('list')}>Back</MyButton>}>
            <ViewMember viewIdOrObject={viewOrEditData} onListClick={() => setCurAction('list')} userId={userId} />
          </Card>)
        }

        {curAction === "list" && (<PaginatedTable
          columns={tableColumns}
          refresh={refreshTable}
          countQuery={"select count(*) AS count from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp,education_courses ec,castes cs   where m.status=0 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id and m.id=mp.member_auto_id and ec.id=m.educational_qualification and cs.id=m.caste" + context.psGlobal.getWhereClause(filterColumns.current, false) + " "  }

          listQuery={"select m.*,row_number() OVER (ORDER BY created_date desc) as row_number,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age,COALESCE((SELECT package_price FROM orders where member_auto_id=m.id  and order_status='Paid' and is_current_plan=1 limit 1),0) as paid_amount,ec.course_name,cs.caste_name,f.father_status,f.father_occupation,f.mother_status,f.mother_occupation,f.brothers,f.brothers_married,f.sisters,f.sisters_married,f.family_type,f.dowry_jewels,f.dowry_property,f.dowry_cash,hb.eating_habits,hb.drinking_habits,hb.smoking_habits,hr.star,hr.patham,hr.raasi,hr.laknam,hr.birth_time,hr.birth_place,hr.dhosam_type,hr.jadhagam_type,hr.raasi_chart,hr.amsam_chart,hr.dasa,hr.dasa_year,hr.dasa_month,hr.dasa_days,p.height,p.weight,p.body_type,p.complexion,p.physical_status,p.physical_status_description,mp.prefered_eating_habits,mp.prefered_smoking_habits,mp.prefered_drinking_habits,mp.prefered_martial_status,CONCAT(mp.age_from,',',mp.age_to) as pref_age,CONCAT(mp.height_from,',',mp.height_to) as pref_height,CONCAT(mp.weight_from,',',mp.weight_to) as pref_weight,mp.prefered_physical_status,mp.prefered_mother_tongue,mp.prefered_religion,mp.prefered_caste,mp.prefered_education,mp.prefered_job_type,mp.prefered_job,mp.prefered_country,mp.prefered_state,mp.prefered_district,CONCAT(mp.income_from,',',mp.income_to) as pref_income,mp.expectation_notes from members m,member_family_details f,member_habits hb,member_horoscope hr,member_physical_attributes p,member_partner_preference mp,education_courses ec,castes cs  CROSS JOIN (SELECT @rownum:={rowNumberVar}) crsj  where m.status=0 and m.member_status='Active' and m.id=f.member_auto_id and m.id=hb.member_auto_id and m.id=hr.member_auto_id and m.id=p.member_auto_id  and m.id=mp.member_auto_id and ec.id=m.educational_qualification and cs.id=m.caste "+ context.psGlobal.getWhereClause(filterColumns.current, false) + "  order by created_date desc"}

          encryptFields={['mobile_no', 'mobile_alt_no_1', 'mobile_alt_no_2', 'whatsapp_no']}
          itemsPerPage={50}

        />)
        }


      </Content>
    </>
  );

}
export default DeleteMemberReport;