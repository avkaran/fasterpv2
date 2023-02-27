import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space, Button } from 'antd';
import { Card } from 'antd';
import { Form, Input, Select, Menu, Tag, Typography, Drawer,Modal } from 'antd';
import { Layout, Spin } from 'antd';
import PsContext from '../../../../../context';
import { FormItem, MyButton } from '../../../../../comp';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch,faClose } from '@fortawesome/free-solid-svg-icons';
import Table from 'react-bootstrap/Table';
import { Button as MButton } from 'antd-mobile'
import dataTypeConstraints from '../../../../../models/dataTypeConstraints';
import { getAllTables } from '../models/devTools';
import { MyCodeBlock } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
const PhpApiCoder = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const {userId, projectId,...other}  = props;
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);

    const [viewData, setviewData] = useState(null);

    const [menuItems, setMenuItems] = useState([]);
    const [menuItemsView, setMenuItemsView] = useState([]);
    const [tables, setTables] = useState([]);
    const [selTableName, setSelTableName] = useState(null);
    const [visibleCodeModal, setVisibleCodeModal] = useState(false);
    const [outputCode, setOutputCode] = useState('');
    const [moduleName,setModuleName]=useState('Module');
    useEffect(() => {
        loadViewData(projectId);
    }, []);
    const loadViewData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from projects where status=1 and id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setviewData(res[0]);
            LoadTables(res[0])
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const LoadTables = (project) => {
        setLoader(true)
        getAllTables(project).then(res => {
            setTables(res.tables);
            setMenuItems(res.menus);
            setMenuItemsView(res.menus);
            setLoader(false)
        }).catch(err => {
            message.error(err)
            setLoader(false)
        });


    }

    const onSearchTables = (e) => {
        let filteredMenus = menuItems.filter(item => item.label.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1);
        setMenuItemsView(filteredMenus);

    }
   
    const getTableColumns = (selTable) => {
        var tRows = [];
        var tableObject = tables.find(item => item.tableName === selTable);
        if (tableObject) {
            tableObject.columns.forEach((column, index) => {
                var tRow = <tr>
                    <td>{index + 1}</td>
                    <td>{column.columnName}</td>
                    <td>{column.columnType}</td>
                    <td><Tag color={column.isNullable ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{column.isNullable ? 'Yes' : 'No'}</Tag></td>
                    <td>{column.columnDefault}</td>
                    <td>{column.description}</td>
                  
                </tr>;
                tRows.push(tRow)
            })

        }
        return tRows;
    }
    const getTableObject = (selTable) => {
        var tableObject = tables.find(item => item.tableName === selTable);
        return tableObject && tableObject.tableObject;
    }
    
   const onCodeClick=(selTable)=>{
    var tableObject = tables.find(item => item.tableName === selTable);
    var controllerTemplate=`<?php
    namespace yourNameSpace;
    use App\TheYak\Controller;
    class {pageName}Controller extends Controller {
        public function __construct() {
            
            parent::__construct();
        }
        public function xpostAdd(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostSave();
        }
        public function xpostUpdate(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostUpdate();
        }
        public function xpostList(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostList();
        }
         public function xpostTotalRecords(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostTotalRecords();
        }
        public function xpostDelete(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostDelete();
        }
    }`;
    var modalTemplate=`<?php
    namespace App\Models\WebsiteCMS;
    use App\TheYak\Model;
    use Rakit\Validation\Validator;
    class {pageName}Model extends Model
    {
        public function __construct()
        {
            parent::__construct();
            $this->api(true);
        }
        public function xpostAdd()
        {
            try {
    
                $post = $_REQUEST;
                $validator = new Validator;
                $validation = $validator->make($post, [
                    'type'        	  	=>	'required',
                    'title'				=>	'required',
                ]);
    
                $validation->validate();
                if ($validation->fails()) $this->jsonOutput(['status' =>  0, 'message' =>  $validation->errors()->all()]);
    
                $pdata = array(
                    'idate'				        =>	$this->dateTime(),
                    'type'						=>	$this->request->get('type'),
                    'category'					=>	$this->request->get('category'),
                    'title'						=>	$this->request->get('title'),
                    'add_by'					=>	$this->token->id,
                    'ip'						=>	$this->request->getClientIp(),
                );
                if ($this->request->get('content'))
                    $pdata['content'] = $this->request->get('content');
                if ($this->request->get('content_html'))
                    $pdata['content_html'] = $this->request->get('content_html');
                if ($this->request->get('feature_image')) {
    
                    //store in cdn and delete file in cms_tmp
    
                    $filePath = $this->request->get('feature_image');
                    $fileNameOnly = str_replace('public/cms_tmp/', '', $filePath);
                    $aws_file_path = $_ENV['UPLOAD_PATH'] . 'website_cms_img/' . $fileNameOnly;
                    $this->space->putObject([
                        'Bucket' => $_ENV['AWS_BUCKET_NAME'],
                        'Key'    => $aws_file_path,
                        'Body'   => fopen($filePath, 'rb'),
                        'ACL'    => 'private',
                        'Metadata'   => array(
                            'x-amz-meta-created-key' => 'createByCMS_Program'
                        )
                    ]);
                    // to remove the uploaded profile photo from our server
                    unlink($filePath);
                    $pdata['feature_image'] = $fileNameOnly;
                }
    
                if ($this->request->get('active_from_date'))
                    $pdata['active_from_date'] = $this->request->get('active_from_date');
                if ($this->request->get('active_to_date'))
                    $pdata['active_to_date'] = $this->request->get('active_to_date');
                if ($this->request->get('seo_slug'))
                    $pdata['seo_slug'] = $this->request->get('seo_slug');
                if ($this->request->get('seo_meta_title'))
                    $pdata['seo_meta_title'] = $this->request->get('seo_meta_title');
                if ($this->request->get('seo_meta_description'))
                    $pdata['seo_meta_description'] = $this->request->get('seo_meta_description');
                if ($this->request->get('seo_meta_keywords'))
                    $pdata['seo_meta_keywords'] = $this->request->get('seo_meta_keywords');
                if ($this->request->get('content'))
                    $pdata['seo_tags'] = $this->request->get('seo_tags');
    
    
                $this->db->table($this->tables['v2_contents'])->insert($pdata);
                $insId = $this->db->insertId();
    
                if (!$insId) throw new \Exception('Error on Insert');
    
                $this->jsonOutput([
                    'status'		=>	'1',
                    'message'		=>	'Saved',
                    'data'			=>	$insId
                ]);
            } catch (\Exception $ex) {
                $this->jsonOutput(['status' => '0', 'message' => $ex->getMessage()]);
            }
        }
    
    
        public function xpostList()
        {
            try {
                $post = $_REQUEST;
                $validator = new Validator;
                $validation = $validator->make($post, [
                    'type'        	  	=>	'required',
                ]);
                $validation->validate();
                if ($validation->fails()) $this->jsonOutput(['status' =>  0, 'message' =>  $validation->errors()->all()]);
    
                $query = "select c.*,cc.category_name,cc.image_ratio from {$this->tables['v2_content_categories']} cc,{$this->tables['v2_contents']} c where c.status=1 AND c.category=cc.id AND c.type='{$this->request->get('type')}'";
    
                if ($this->request->get('id')) $query .= " AND c.id='{$this->request->get('id')}'";
                if ($this->request->get('category')) $query .= " AND c.category='{$this->request->get('category')}'";
    
                $query .= "  ORDER BY idate desc";
    
                if ($this->request->get('length'))
                    $query .= " LIMIT {$this->request->get('start')},{$this->request->get('length')}";
    
                $sql = $this->db->query($query)->fetchAll();
    
                if (sizeof($sql) < 1) throw new \Exception('No data');
    
                $this->jsonOutput([
                    'status'		=>	'1',
                    'message'		=>	'Success',
                    'data'			=>	$sql,
                ]);
            } catch (\Exception $ex) {
                $this->jsonOutput(['status' => '0', 'message' => $ex->getMessage()]);
            }
        }
        public function xpostTotalRecords()
        {
            try {
                $post = $_REQUEST;
                $validator = new Validator;
                $validation = $validator->make($post, [
                    'type'        	  	=>	'required',
                ]);
                $validation->validate();
                if ($validation->fails()) $this->jsonOutput(['status' =>  0, 'message' =>  $validation->errors()->all()]);
    
                $query = "select count(*) as count from {$this->tables['v2_content_categories']} cc,{$this->tables['v2_contents']} c where c.status=1 AND c.category=cc.id AND c.type='{$this->request->get('type')}'";
    
                if ($this->request->get('id')) $query .= " AND c.id='{$this->request->get('id')}'";
                if ($this->request->get('category')) $query .= " AND c.category='{$this->request->get('category')}'";
    
                $sql = $this->db->query($query)->fetchAll();
    
                if (sizeof($sql) < 1) throw new \Exception('No data');
    
                $this->jsonOutput([
                    'status'		=>	'1',
                    'message'		=>	'Success',
                    'data'			=>	$sql[0]->count,
                ]);
            } catch (\Exception $ex) {
                $this->jsonOutput(['status' => '0', 'message' => $ex->getMessage()]);
            }
        }
        public function xpostDelete()
        {
            try {
    
                $post = $_REQUEST;
                $validator = new Validator;
                $validation = $validator->make($post, [
                    'id'        	  	=>	'required',
                ]);
    
                $validation->validate();
                if ($validation->fails()) $this->jsonOutput(['status' =>  0, 'message' =>  $validation->errors()->all()]);
    
                $up = $this->db->table($this->tables['v2_contents'])->where([
                    'id'				=>	$this->request->get('id'),
                    // 'company_id'		=>	$this->token->master_id,
                ])->update([
                    'status'			=>	'0',
                ]);
    
                if (!$up) throw new \Exception('Error on Update');
    
                $this->jsonOutput([
                    'status'		=>	'1',
                    'message'		=>	'Updated',
                    'data'			=>	[]
                ]);
            } catch (\Exception $ex) {
                $this->jsonOutput(['status' => '0', 'message' => $ex->getMessage()]);
            }
        }
    
        public function xpostUpdate()
        {
            try {
    
                $post = $_REQUEST;
                $validator = new Validator;
                $validation = $validator->make($post, [
                    'id' 			       	  	=>	'required',
                    'title' 			       	=>	'required',
                ]);
    
                $validation->validate();
                if ($validation->fails()) $this->jsonOutput(['status' =>  0, 'message' =>  $validation->errors()->all()]);
    
                /* $sql = $this->db->table($this->tables['subjects'])->where([
                    'status'					=>	'1',
                    'subject_code'					=>	$this->request->get('subject_code'),
                ])->notWhere('id', $this->request->get('id'))->get();
                if ($sql) throw new \Exception('subjects already exist');
     */
                $pdata = array(
    
                    //'type'						=>	$this->request->get('type'),
                    //'category'					=>	$this->request->get('category'),
                    'title'						=>	$this->request->get('title'),
                );
                if ($this->request->get('content'))
                    $pdata['content'] = $this->request->get('content');
                if ($this->request->get('content_html'))
                    $pdata['content_html'] = $this->request->get('content_html');
                if ($this->request->get('feature_image')) {
    
                    $filePath = $this->request->get('feature_image');
                    $fileNameOnly = str_replace('public/cms_tmp/', '', $filePath);
                    $aws_file_path = $_ENV['UPLOAD_PATH'] . 'website_cms_img/' . $fileNameOnly;
                    $this->space->putObject([
                        'Bucket' => $_ENV['AWS_BUCKET_NAME'],
                        'Key'    => $aws_file_path,
                        'Body'   => fopen($filePath, 'rb'),
                        'ACL'    => 'private',
                        'Metadata'   => array(
                            'x-amz-meta-created-key' => 'createByCMS_Program'
                        )
                    ]);
                    // to remove the uploaded profile photo from our server
                    unlink($filePath);
                    $pdata['feature_image'] = $fileNameOnly;
                }
    
                if ($this->request->get('active_from_date'))
                    $pdata['active_from_date'] = $this->request->get('active_from_date');
                if ($this->request->get('active_to_date'))
                    $pdata['active_to_date'] = $this->request->get('active_to_date');
                if ($this->request->get('seo_slug'))
                    $pdata['seo_slug'] = $this->request->get('seo_slug');
                if ($this->request->get('seo_meta_title'))
                    $pdata['seo_meta_title'] = $this->request->get('seo_meta_title');
                if ($this->request->get('seo_meta_description'))
                    $pdata['seo_meta_description'] = $this->request->get('seo_meta_description');
                if ($this->request->get('seo_meta_keywords'))
                    $pdata['seo_meta_keywords'] = $this->request->get('seo_meta_keywords');
                if ($this->request->get('seo_tags'))
                    $pdata['seo_tags'] = $this->request->get('seo_tags');
                if ($this->request->get('content_status'))
                    $pdata['content_status'] = $this->request->get('content_status');
                $upRowCount = $this->db->table($this->tables['v2_contents'])->where([
                    'id'						=>	$this->request->get('id'),
                ])->update($pdata);
    
                if (!$upRowCount) throw new \Exception('Error on Update');
    
                $this->jsonOutput([
                    'status'		=>	'1',
                    'message'		=>	'Updated',
                    'data'			=>	[]
                ]);
            } catch (\Exception $ex) {
                $this->jsonOutput(['status' => '0', 'message' => $ex->getMessage()]);
            }
        }
          
    }`;
    controllerTemplate=controllerTemplate.replace("{pageName}",capitalizeFirst(moduleName).replace(" ",""));
   
    setOutputCode(template);
    setVisibleCodeModal(true);
    console.log('test',tableObject)
   }
    return (
        <>
            <Spin spinning={loader} >
                {
                    viewData && (<>
                            <Row gutter={16}>

                            <Col className="gutter-row" span={6}>
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


                                >
                                    <Input
                                        placeholder="input search text" onChange={onSearchTables}
                                        suffix={<FontAwesomeIcon icon={faSearch} />}
                                    />
                                </Card>
                                <Menu
                                    mode="inline"
                                    theme="light"
                                    onClick={e => setSelTableName(e.key)}
                                    // defaultSelectedKeys={[selCollection]}
                                    style={{
                                        width: '100%',
                                        border: '1px solid',
                                        borderColor: cyan[2],
                                        borderTop: '0',
                                    }}
                                    items={menuItemsView}
                                />
                            </Col>

                            <Col className='gutter-row' span={18}>
                                <Card
                                    title={<>
                                        <Row>
                                            <Col> {selTableName}
                                            </Col>
                                            <Col>({getTableObject(selTableName)})</Col>
                                        </Row>
                                    </>}
                                extra={<Button type="primary" onClick={()=>onCodeClick(selTableName)}>Code</Button>}    
                                
                                >
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Column Name</th>
                                                <th>Data Type</th>
                                                <th>is NULL?</th>
                                                <th>Default</th>
                                                <th>Contraint</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                getTableColumns(selTableName)
                                            }


                                        </tbody>
                                    </Table>
                                </Card>
                            </Col>
                        </Row>
                    </>)
                }

            </Spin>
            <Modal
                open={visibleCodeModal}
                zIndex={10000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={true}
                closable={true}
                //style={{ marginTop: '20px' }}
                width={1000}
                // footer={null}
                onCancel={() => { setVisibleCodeModal(false) }}
                title="Code Generator"
            >
                <MyCodeBlock
                    customStyle={{ height: '500px', overflow: 'auto' }}
                    text={outputCode}
                    language="jsx"
                />
            </Modal>
        </>
    );

}
export default PhpApiCoder;