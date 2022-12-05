import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Modal, Tree, List } from 'antd';
import { MyButton } from '../../comp'
import { Breadcrumb, Layout, Spin, Card, Checkbox, Select, Input } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../context';
import { currentInstance, businesses } from '../../utils';
import { cyan } from '@ant-design/colors';
import { MyCodeBlock } from '../../comp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { TableColumn } from '../../models/dbTable';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ListManager } from "react-beautiful-dnd-grid";
import { FormItemTemplate,FormTemplate,AddEditModuleTemplate,viewModuleTemplate } from '../codeTemplates'
import ResponsiveLayout from '../../pages/admin/layout'
const Coder = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [dbName] = useState(businesses[currentInstance.index].dbName);
    const [treeData, setTreeData] = useState([]);
    const [tables, setTables] = useState([]);
    const [isTwoColumnForm, setIsTwoColumnForm] = useState(false);
    const [selectedFields, setSelectedFields] = useState([]);
    const [outputCode, setOutputCode] = useState('');
    const [visibleCodeModal, setVisibleCodeModal] = useState(false);
    const [moduleName,setModuleName]=useState('Module');
    const [moduleType,setModuleType]=useState('add-edit');
    const [errorList,setErrorList]=useState([]);
    useEffect(() => {
        LoadTables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const LoadTables = () => {
        var reqData = [
            {
                query_type: 'query',
                query: "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE table_schema='" + dbName + "'",
            },
            {
                query_type: 'query',
                query: "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='" + dbName + "'",
            },
        ];

        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res, error) => {
            if (res) {

                let tNames = [];
                let treeItems = [];


                res[0].forEach((item) => {


                    let tname = item['TABLE_NAME'];
                    let tColumns = res[1].filter((col) => col.TABLE_NAME === tname)
                    let table = {
                        label: item['TABLE_NAME'], key: item['TABLE_NAME'], tableName: item['TABLE_NAME'],
                        tableComment: item['TABLE_COMMENT'],
                        columns: tColumns,
                    }
                    tNames.push(table);
                    var treeChildren = [];
                    tColumns.forEach(column => {
                        treeChildren.push({ title: column.COLUMN_NAME, key: tname + "." + column.COLUMN_NAME })

                    })
                    treeItems.push({ title: tname, key: tname, children: treeChildren })

                })

                setTreeData(treeItems);
                setTables(tNames);
            }
            else {
                message.error(error);

            }

        })
    }
    const onCheckTree = (CheckedKeys, e) => {
        var selItems = [];
        CheckedKeys.forEach(item => {
            if (item.includes("."))
                selItems.push({ key: item })
        })
        setSelectedFields(selItems);
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }
        setSelectedFields(reorder(selectedFields, result.source.index, result.destination.index))

    }
    const onDragGridEnd = (sourceIndex, destinationIndex) => {

        if (!sourceIndex) {
            return;
        }

        if (destinationIndex === sourceIndex) {
            return;
        }
        setSelectedFields(reorder(selectedFields, sourceIndex, destinationIndex))


    }
    const generateEditQuery=(selColumns)=>{
        var errors=[];
        var tables=[];
        var primaryTable={table:'',objectName:''};
        if(selColumns.length>0){
            primaryTable.table=selColumns[0].tableName;
            primaryTable.objectName=selColumns[0].objectName;
        }
        
        
        var uniqueTables = [...new Set(selColumns.map(item => item.tableName+"."+item.objectName))];
        uniqueTables.forEach(item=>{
            var tableSplit=item.split(".");
            if(tableSplit[1]){
                var columns=selColumns.filter(column=>column.tableName===tableSplit[0]);
                tables.push({
                    tableName:tableSplit[0],
                    objectName:tableSplit[1],
                    columns:columns
                })
            }
            else    
                errors.push("Table :" + tableSplit[0] +" has no object name in comment");

        })
        var fromClauses=[];
        tables.forEach(table=>{
           fromClauses.push(table.tableName+" "+ table.objectName)
        })
        var selectQueryColumns=[];
        selColumns.forEach(col=>{
            selectQueryColumns.push(col.objectName+"."+col.columnName)
        })
        var selectQueryFromTables=[];
        tables.forEach(table=>{
            selectQueryFromTables.push(table.tableName+" "+ table.objectName)
        })
        if(errors.length>0)
        setErrorList([...errorList,...errors])

        var finalQuery=`"SELECT ` + selectQueryColumns.join(",") + ` from ` + selectQueryFromTables.join(",") + ` where `+ primaryTable.objectName+`.status=1 and ` + primaryTable.objectName+`.id="+id`
        return finalQuery;

    }
    const getEditValues=(selColumns,formVar)=>{
        var tables=[];
        var uniqueTables = [...new Set(selColumns.map(item => item.tableName))];
        uniqueTables.forEach(item=>{
                var columns=selColumns.filter(column=>column.tableName===item);
                tables.push({
                    tableName:item,
                    columns:columns
                })
        })
        var resultStr=``;
        tables.forEach(table=>{
            var tmpStr=``;
            
            table.columns.forEach(col=>{
                tmpStr=tmpStr+`
                `+col.columnName+`:mydata.`+col.columnName+`,
                `;
            })
            resultStr=resultStr+`
            `+table.tableName+`:{`+tmpStr+`}`
         })
         
        return formVar+`.setFieldsValue({
        `+resultStr+`
        });`;
    }
    const onGenerateCodeClick = () => {
        var selColumns = [];
        var currentSelectedFiels = selectedFields;
        currentSelectedFiels.forEach(field => {
            var fullColumn = field.key.split(".");
            var currentTable = tables.find(table => table.tableName === fullColumn[0]);
            var currentColumn = currentTable.columns.find(column => column.COLUMN_NAME === fullColumn[1]);
            var columnObject = new TableColumn(fullColumn[0], fullColumn[1]);
            columnObject.parseColumn(currentColumn);
            selColumns.push({ tableName: currentTable.tableName, objectName: currentTable.tableComment, columnName: fullColumn[1], column: columnObject });
        })
        var FormItemsCode = '';
        var FormViewItemsCode='';
        let cnt = 0;
        selColumns.forEach(column => {
            var template = '';
            var columnText = context.psGlobal.capitalizeFirst(column.columnName.replaceAll("_", " "));
            var columnVar = context.psGlobal.capitalizeFirst(column.columnName.replaceAll("_", " ")).replaceAll(" ", "");
            columnVar = columnVar.charAt(0).toLowerCase() + columnVar.slice(1);
            console.log(column.column.inputConstraint.template)
            if (column.column.inputConstraint.template)
                template = column.column.inputConstraint.template;
            template = template.replace("defaultValue={defaultValue}", "");
            template = template.replace("{placeHolder}", columnText);
            template = template.replace("{nameVar}", columnVar).replace("{nameVar}", columnVar).replace("{nameVar}", columnVar).replace("{nameVar}", columnVar);
            template = template.replace("{OptionCollection}", `{context.psGlobal.collectionOptions(context.psGlobal.collectionData, '` + column.column.constraintString + `')}`)
            let fItemTemplate = FormItemTemplate;
            fItemTemplate = fItemTemplate.replace("{label}", columnText).replace("{name}", "{['" + column.tableName + "','" + column.columnName + "']}").replace("{placeHolder}", columnText);
            fItemTemplate = fItemTemplate.replace("{inputRules}", `rules={[{ required: true, message: 'Please Enter ` + columnText + `' }]}`);

            if (isTwoColumnForm) {

                var fiFinal = fItemTemplate.replace("{inputTemplate}", template);
                if (cnt % 2 === 0) {
                   // fiFinal = `<Row gutter={16}>`;
                    fiFinal = ` <Col className='gutter-row' xs={24} xl={12}>
                                        `+ fiFinal + `
                                        </Col>
                                        `;
                }
                else {
                    fiFinal = `<Col className='gutter-row' xs={24} xl={12}>
                                        `+ fiFinal + `
                                        </Col>
                                        `;
                }

              //  if (cnt % 2 === 1)
                   // fiFinal = fiFinal + `</Row>`;
                FormItemsCode = FormItemsCode + fiFinal;
                //for view item
                var fiFinalView = `<FormViewItem label="`+columnText+`">{viewData.`+column.columnName+`}</FormViewItem>`;
                if (cnt % 2 === 0) {
                   // fiFinalView = `<Row gutter={16}>`;
                    fiFinalView = `<Col className='gutter-row' xs={24} xl={12}>
                                        `+ fiFinalView + `
                                        </Col>
                                        `;
                }
                else {
                    fiFinalView = `<Col className='gutter-row' xs={24} xl={12}>
                                        `+ fiFinalView + `
                                        </Col>
                                        `;
                }

               // if (cnt % 2 === 1)
               // fiFinalView = fiFinalView + `</Row>`;

                    FormViewItemsCode = FormViewItemsCode + fiFinalView;
            }
            else{
                FormItemsCode = FormItemsCode + fItemTemplate.replace("{inputTemplate}", template);
                FormViewItemsCode = FormViewItemsCode + `
                <FormViewItem label="`+columnText+`">{viewData.`+column.columnName+`}</FormViewItem>`;
            }

            cnt = cnt + 1;

        })
         var formVar=moduleType.replace("-","")+"Form"+ moduleName.replace(" ","");
         var formCode=FormTemplate.replaceAll("{formVar}",formVar).replace("{formItems}",FormItemsCode);

         var pageCode='';
         if(moduleType==="add-edit"){
            pageCode=AddEditModuleTemplate.replaceAll("{pageName}","AddEdit"+ context.psGlobal.capitalizeFirst(moduleName).replace(" ",""));
            pageCode=pageCode.replaceAll("{formVar}",formVar);
            var primaryTable="";
            if(selColumns.length>0)
               primaryTable=selColumns[0].tableName;
   
            pageCode=pageCode.replaceAll("{primaryTable}",primaryTable);
            pageCode=pageCode.replace("{editQuery}",generateEditQuery(selColumns));
            pageCode=pageCode.replace("{setEditFieldsValues}",getEditValues(selColumns,formVar));
            pageCode=pageCode.replace("{form}",formCode)

         }else if(moduleType==="view"){
            pageCode=viewModuleTemplate.replaceAll("{pageName}","View"+ context.psGlobal.capitalizeFirst(moduleName));
            pageCode=pageCode.replace("{viewQuery}",generateEditQuery(selColumns));
           // pageCode=pageCode.replace("{setEditFieldsValues}",getEditValues(selColumns,formVar));
            pageCode=pageCode.replace("{viewItems}",FormViewItemsCode)
         }
        
        // generateEditQuery(selColumns);
         setOutputCode(pageCode)
        //console.log('sel',selColumns)
        setVisibleCodeModal(true);
    }

    return (
        <>
            <ResponsiveLayout
         
         userId={props.match.params.userId}
         customHeader={null}
         bottomMenues={null}
         breadcrumbs={[
            {name:'Developer Tools',link:null},
            {name:'Coder',link:null},
        ]}
        >
               
                <Spin spinning={loader} >


                    <Card title="Coder">
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={6} style={{ marginBottom: '15px' }}>
                                <Select
                                    showSearch
                                    placeholder="Module Type"
                                    style={{ width: "200px" }}
                                    value={moduleType}
                                    onChange={(value)=>setModuleType(value)}
                                    optionFilterProp="children"
                                    //onChange={memberCreated_forOnChange}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                >

                                    <Select.Option value="add-edit">Add/Edit</Select.Option>
                                    <Select.Option value="add">Add</Select.Option>
                                    <Select.Option value="edit">Edit</Select.Option>
                                    <Select.Option value="view">View</Select.Option>
                                    <Select.Option value="list">List</Select.Option>
                                </Select>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={6}>
                                <Checkbox onChange={e => setIsTwoColumnForm(e.target.checked)}>is Two Column?</Checkbox>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={6}>
                                <Input placeholder="Module Name" value={moduleName} onChange={(e)=>setModuleName(e.target.value)}/>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={6}>
                                <MyButton type="primary" onClick={onGenerateCodeClick}>Generate Code</MyButton>
                            </Col>
                           
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={8}>
                                <Card title="Select Fields">
                                    <Tree
                                        checkable
                                        //  defaultExpandedKeys={['0-0-0', '0-0-1']}
                                        // defaultSelectedKeys={['0-0-0', '0-0-1']}
                                        // defaultCheckedKeys={['0-0-0', '0-0-1']}
                                        //   onSelect={onSelect}
                                        onCheck={onCheckTree}
                                        treeData={treeData}
                                    />
                                </Card>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={16}>
                                <Card title="Selected Fields">

                                    {
                                        !isTwoColumnForm && (<div
                                            style={{
                                                background: "#ddd",
                                                padding: 20
                                            }}
                                        >
                                            <DragDropContext onDragEnd={onDragEnd}>
                                                <Droppable droppableId="list">
                                                    {provided => (
                                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                                            <List

                                                                bordered
                                                                rowKey="key"
                                                                dataSource={selectedFields}
                                                                size="small"
                                                                renderItem={(item, index) => (
                                                                    <Draggable draggableId={`draggable-${index}`} index={index}>
                                                                        {(provided) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                            >
                                                                                <List.Item style={{ background: cyan[4], border: '1px solid blue' }}>{item.key}</List.Item>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                )}
                                                            />
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>

                                        </div>)
                                    }
                                    {
                                        isTwoColumnForm && (<ListManager
                                            items={selectedFields}
                                            direction="horizontal"
                                            maxItems={2}
                                            render={item => <div style={{ display: 'flex', background: cyan[4], border: '1px solid blue', width: '300px', height: '50px', verticalAlign: 'center', padding: '5px 5px 5px 5px' }}>{item.key}</div>}
                                            onDragEnd={onDragGridEnd}
                                        />)
                                    }
                                </Card>
                            </Col>
                        </Row>



                    </Card>
                </Spin>
            </ResponsiveLayout>
            <Modal
                visible={visibleCodeModal}
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
export default Coder;