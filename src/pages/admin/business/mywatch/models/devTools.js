import { apiRequest } from "../../../../../models/core";
import { DbTable, TableColumn } from "../../../../../models/dbTable";
import { capitalizeFirst } from "../../../../../utils";
import { FormItemTemplate, FormTemplate, AddEditModuleTemplate, viewModuleTemplate } from '../../../../../devTools/codeTemplates'
const getAllTables = async (project) => {
    const form = new FormData();
    return new Promise((resolve, reject) => {
        var reqData = [
            {
                query_type: 'query',
                query: "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE table_schema='" + project.database_name + "'",
            },
            {
                query_type: 'query',
                query: "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='" + project.database_name + "' order by TABLE_NAME,ORDINAL_POSITION",
            },
        ];
        var form = new FormData();
        form.append('api_password', project.api_password)
        form.append('database_name', project.database_name)
        form.append('database_username', project.database_username)
        form.append('database_password', project.database_password)
        form.append('queries', JSON.stringify(reqData));
        apiRequest(project.api_url, "prod", form).then(res => {


            var reqDataInner = [
                {
                    query_type: 'query',
                    query: 'select * from project_tables where project_id=' + project.id,

                },
                {
                    query_type: 'query',
                    query: 'select * from project_table_columns where project_id=' + project.id,

                }
            ];
            apiRequest(reqDataInner, "prod").then((resInner) => {

                let tNames = [];
                let tMenus = [];
                res[0].forEach((item) => {
                    let tname = item['TABLE_NAME'];
                    let tColumns = res[1].filter((col) => col.TABLE_NAME === tname)
                    //local table info
                    let LocalTableData = resInner[0].find(LTable => LTable.table_name === tname);

                    var table = new DbTable(tname, LocalTableData ? LocalTableData.table_object : 'N/A');
                    tColumns.forEach(obj => {
                        var column = new TableColumn(tname, obj.COLUMN_NAME);
                        var curObj = obj;
                        var localColumnData = resInner[1].find(LColumn => LColumn.table_name === tname && LColumn.column_name === obj.COLUMN_NAME);
                        if (localColumnData)
                            curObj.COLUMN_COMMENT = localColumnData.description;



                        column.parseColumn(curObj);
                        table.addColumn(column);
                    })
                    tNames.push(table);
                    tMenus.push({ label: tname, key: tname, });


                })


                resolve({
                    tables: tNames,
                    menus: tMenus
                })


            }).catch(err => {
                reject(err)
            });;




        }).catch(err => {
            reject(err)
        });;

    });
}
const generateEditQuery = (selColumns) => {
    var errors = [];
    var tables = [];
    var primaryTable = { table: '', objectName: '' };
    if (selColumns.length > 0) {
        primaryTable.table = selColumns[0].tableName;
        primaryTable.objectName = selColumns[0].objectName;
    }


    var uniqueTables = [...new Set(selColumns.map(item => item.tableName + "." + item.objectName))];
    uniqueTables.forEach(item => {
        var tableSplit = item.split(".");
        if (tableSplit[1]) {
            var columns = selColumns.filter(column => column.tableName === tableSplit[0]);
            tables.push({
                tableName: tableSplit[0],
                objectName: tableSplit[1],
                columns: columns
            })
        }
        else
            errors.push("Table :" + tableSplit[0] + " has no object name in comment");

    })
    var fromClauses = [];
    tables.forEach(table => {
        fromClauses.push(table.tableName + " " + table.objectName)
    })
    var selectQueryColumns = [];
    selColumns.forEach(col => {
        selectQueryColumns.push(col.objectName + "." + col.columnName)
    })
    var selectQueryFromTables = [];
    tables.forEach(table => {
        selectQueryFromTables.push(table.tableName + " " + table.objectName)
    })
    if (errors.length > 0)
        //   setErrorList([...errorList,...errors])

        var finalQuery = `"SELECT ` + selectQueryColumns.join(",") + ` from ` + selectQueryFromTables.join(",") + ` where ` + primaryTable.objectName + `.status=1 and ` + primaryTable.objectName + `.id="+id`
    return finalQuery;

}
const getEditValues = (selColumns, formVar) => {
    var tables = [];
    var uniqueTables = [...new Set(selColumns.map(item => item.tableName))];
    uniqueTables.forEach(item => {
        var columns = selColumns.filter(column => column.tableName === item);
        tables.push({
            tableName: item,
            columns: columns
        })
    })
    console.log('test', uniqueTables, selColumns)
    var resultStr = ``;
    tables.forEach(table => {
        var tmpStr = ``;

        table.columns.forEach(col => {
            tmpStr = tmpStr + `
            `+ col.columnName + `:mydata.` + col.columnName + `,
            `;
        })
        resultStr = resultStr + `
        `+ table.tableName + `:{` + tmpStr + `}`
    })

    return formVar + `.setFieldsValue({
    `+ resultStr + `
    });`;
}
const getReactCode = (allTableObjects, selColumns, moduleType, moduleName = 'test') => {
    var FormItemsCode = '';
    var FormViewItemsCode = '';
    let cnt = 0;
    var selColumnObjects = [];
    selColumns.forEach(selColumn => {
        // console.log('test2',selColumn.split(".")[0])
        var curTable = allTableObjects.find(item => item.tableName === selColumn.split(".")[0])
        var column = curTable.columns.find(item => item.columnName === selColumn.split(".")[1])
        selColumnObjects.push(column);
        var template = '';
        var columnText = capitalizeFirst(column.columnName.replaceAll("_", " "));
        var columnVar = capitalizeFirst(column.columnName.replaceAll("_", " ")).replaceAll(" ", "");
        columnVar = columnVar.charAt(0).toLowerCase() + columnVar.slice(1);

        if (column.inputConstraint.template)
            template = column.inputConstraint.template;
        template = template.replace("defaultValue={defaultValue}", "");
        template = template.replace("{placeHolder}", columnText);
        template = template.replaceAll("{nameVar}", columnVar);
        template = template.replace("{OptionCollection}", `{context.psGlobal.collectionOptions(context.psGlobal.collectionData, '` + column.constraintString + `')}`)
        let fItemTemplate = FormItemTemplate;
        fItemTemplate = fItemTemplate.replace("{label}", columnText).replace("{name}", "{['" + column.tableName + "','" + column.columnName + "']}").replace("{placeHolder}", columnText);
        fItemTemplate = fItemTemplate.replace("{inputRules}", `rules={[{ required: true, message: 'Please Enter ` + columnText + `' }]}`);

        var isTwoColumnForm = true;
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
            var fiFinalView = `<FormViewItem label="` + columnText + `">{viewData.` + column.columnName + `}</FormViewItem>`;
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
        else {
            FormItemsCode = FormItemsCode + fItemTemplate.replace("{inputTemplate}", template);
            FormViewItemsCode = FormViewItemsCode + `
            <FormViewItem label="`+ columnText + `">{viewData.` + column.columnName + `}</FormViewItem>`;
        }

        cnt = cnt + 1;
    })

    var formVar = moduleType.replace("-", "") + "Form" + moduleName.replace(" ", "");
    var formCode = FormTemplate.replaceAll("{formVar}", formVar).replace("{formItems}", FormItemsCode);

    var pageCode = '';
    if (moduleType === "add-edit") {
        pageCode = AddEditModuleTemplate.replaceAll("{pageName}", "AddEdit" + capitalizeFirst(moduleName).replace(" ", ""));
        pageCode = pageCode.replaceAll("{formVar}", formVar);
        var primaryTable = "";
        if (selColumnObjects.length > 0)
            primaryTable = selColumnObjects[0].tableName;

        pageCode = pageCode.replaceAll("{primaryTable}", primaryTable);
        pageCode = pageCode.replace("{editQuery}", generateEditQuery(selColumnObjects));
        pageCode = pageCode.replace("{setEditFieldsValues}", getEditValues(selColumnObjects, formVar));
        pageCode = pageCode.replace("{form}", formCode)

    } else if (moduleType === "view") {
        pageCode = viewModuleTemplate.replaceAll("{pageName}", "View" + capitalizeFirst(moduleName));
        pageCode = pageCode.replace("{viewQuery}", generateEditQuery(selColumnObjects));
        // pageCode=pageCode.replace("{setEditFieldsValues}",getEditValues(selColumns,formVar));
        pageCode = pageCode.replace("{viewItems}", FormViewItemsCode)
    }

    // generateEditQuery(selColumns);
    return (pageCode)
}
const getPHPApiModalFunctionCode = (functionType, tableObject, functionSuffixName = '') => {
    var resultStr = '';
    if (functionType === 'add') {
        var addValidationItemsCode = '';
        var addPdoItemsCode = '';
        var addPdoIfItemsCode = '';
        tableObject.columns.forEach(column => {
            if (!column.isNullable && column.columnName != 'id' && !column.columnDefault) {
                addValidationItemsCode = addValidationItemsCode + `
                '${column.columnName}' =>	'required',`;
                addPdoItemsCode = addPdoItemsCode + `
                 '${column.columnName}' =>	$this->request->get('${column.columnName}'),
                `;
            } else {
                //use other items in the if condition.
                if (column.columnName != 'id') {
                    addPdoIfItemsCode = addPdoIfItemsCode + `
                    if ($this->request->get('${column.columnName}'))
                        $pdata['${column.columnName}'] = $this->request->get('${column.columnName}');`;
                }
            }
        })
        var addModelCode = `
        public function xpostAdd`+ capitalizeFirst(functionSuffixName).replaceAll(' ', '') + `()
        {
            try {
    
                $post = $_REQUEST;
                $validator = new Validator;
                $validation = $validator->make($post, [
                    ${addValidationItemsCode}
                ]);
    
                $validation->validate();
                if ($validation->fails()) $this->jsonOutput(['status' =>  0, 'message' =>  $validation->errors()->all()]);
    
                $pdata = array(
                    ${addPdoItemsCode}
                );
                ${addPdoIfItemsCode}
                $this->db->table('${tableObject.tableName}')->insert($pdata);
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
        }`;
        resultStr = addModelCode;
    } else if (functionType === 'update') {

        var updatePdoIfItemsCode = '';
        tableObject.columns.forEach(column => {

            //use other items in the if condition.
            if (column.columnName != 'id') {
                updatePdoIfItemsCode = updatePdoIfItemsCode + `
                        if ($this->request->get('${column.columnName}'))
                            $pdata['${column.columnName}'] = $this->request->get('${column.columnName}');`;
            }

        })
        var updateModalCode = `
            public function xpostUpdate`+ capitalizeFirst(functionSuffixName).replaceAll(' ', '') + `()
            {
                try {
        
                    $post = $_REQUEST;
                    $validator = new Validator;
                    $validation = $validator->make($post, [
                        'id' 			       	  	=>	'required',
                    ]);
        
                    $validation->validate();
                    if ($validation->fails()) $this->jsonOutput(['status' =>  0, 'message' =>  $validation->errors()->all()]);
        
                    $pdata = array();
                    ${updatePdoIfItemsCode}
                    $upRowCount = $this->db->table('${tableObject.tableName}')->where([
                        'id'						=>	$this->request->get('id'),
                    ])->update($pdata);
        
                    if (!$upRowCount) throw new \Exception('No Changes made to update');
        
                    $this->jsonOutput([
                        'status'		=>	'1',
                        'message'		=>	'Updated',
                        'data'			=>	$this->request->get('id')
                    ]);
                } catch (\Exception $ex) {
                    $this->jsonOutput(['status' => '0', 'message' => $ex->getMessage()]);
                }
            }`;
        resultStr = updateModalCode;

    } else if (functionType === 'total-records') {

        var tableObjectForQuery = 'a';
        if (tableObject.tableObject && tableObject.tableObject !== 'N/A')
            tableObjectForQuery = tableObject.tableObject;
        var ifWhereClauseItemsCode = '';
        tableObject.columns.forEach(column => {

            //use other items in the if condition.
            if (column.columnName != 'id') {
                ifWhereClauseItemsCode = ifWhereClauseItemsCode + `
                        if ($this->request->get('${column.columnName}'))
                        $query .= " AND ${tableObjectForQuery}.${column.columnName}='{$this->request->get('${column.columnName}')}'";`;
            }

        })
        var totalRecordsModalCode = `
            public function xpostTotalRecords`+ capitalizeFirst(functionSuffixName).replaceAll(' ', '') + `()
            {
                try {
                    $post = $_REQUEST;
                    $validator = new Validator;
                    /*
                    $validation = $validator->make($post, [
                       
                    ]);
                    $validation->validate();
                    if ($validation->fails()) $this->jsonOutput(['status' =>  0, 'message' =>  $validation->errors()->all()]);
                    */
        
                    $query = "select count(*) as count from ${tableObject.tableName} ${tableObjectForQuery} where ${tableObjectForQuery}.status=1 ";
        
                    ${ifWhereClauseItemsCode}
        
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
            }`;
        resultStr = updateModalCode;

    } else if (functionType === 'list') {

        let tableObjectForQuery = 'a';
        if (tableObject.tableObject && tableObject.tableObject !== 'N/A')
            tableObjectForQuery = tableObject.tableObject;
        let ifWhereClauseItemsCode = '';
        tableObject.columns.forEach(column => {

            //use other items in the if condition.
            if (column.columnName != 'id') {
                ifWhereClauseItemsCode = ifWhereClauseItemsCode + `
                        if ($this->request->get('${column.columnName}'))
                        $query .= " AND ${tableObjectForQuery}.${column.columnName}='{$this->request->get('${column.columnName}')}'";`;
            }

        })
        var listModalCode = `
            public function xpostList`+ capitalizeFirst(functionSuffixName).replaceAll(' ', '') + `()
            {
                try {
                    $post = $_REQUEST;
                    $validator = new Validator;
                    /*
                    $validation = $validator->make($post, [
                        'type'        	  	=>	'required',
                    ]);
                    $validation->validate();
                    if ($validation->fails()) $this->jsonOutput(['status' =>  0, 'message' =>  $validation->errors()->all()]);
                    */
        
                    $query = "select ${tableObjectForQuery}.* from ${tableObject.tableName} ${tableObjectForQuery} where ${tableObjectForQuery}.status=1";
        
                    ${ifWhereClauseItemsCode}

                    

                    if ($this->request->get('order_by_array') && is_array( json_decode($this->request->get('order_by_array')) )){
                        $orderbyClauses=array();
                        $orderByArray=json_decode($this->request->get('order_by_array'));
                        foreach($orderByArray as  $item){
                            $orderbyClauses[]=$item->field.' '.$item->order_by;
                        }
                        $query .= "  ORDER BY ". implode($orderbyClauses,',');
                    }
                    
                    
        
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
            }`;
        resultStr = listModalCode;

    }
    return resultStr;

}
export {
    getAllTables,
    getReactCode,
    getPHPApiModalFunctionCode,
}