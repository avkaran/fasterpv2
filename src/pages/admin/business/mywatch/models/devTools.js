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
const getReactCode = (allTableObjects, selColumns) => {
    var FormItemsCode = '';
    var FormViewItemsCode = '';
    let cnt = 0;
    selColumns.forEach(selColumn => {
        // console.log('test2',selColumn.split(".")[0])
        var curTable = allTableObjects.find(item => item.tableName === selColumn.split(".")[0])
        var column = curTable.columns.find(item => item.columnName === selColumn.split(".")[1])
        var template = '';
        var columnText = capitalizeFirst(column.columnName.replaceAll("_", " "));
        var columnVar = capitalizeFirst(column.columnName.replaceAll("_", " ")).replaceAll(" ", "");
        columnVar = columnVar.charAt(0).toLowerCase() + columnVar.slice(1);
        if (column.column.inputConstraint.template)
            template = column.inputConstraint.template;
        template = template.replace("defaultValue={defaultValue}", "");
        template = template.replace("{placeHolder}", columnText);
        template = template.replaceAll("{nameVar}", columnVar);
        template = template.replace("{OptionCollection}", `{context.psGlobal.collectionOptions(context.psGlobal.collectionData, '` + column.column.constraintString + `')}`)
        let fItemTemplate = FormItemTemplate;
        fItemTemplate = fItemTemplate.replace("{label}", columnText).replace("{name}", "{['" + column.tableName + "','" + column.columnName + "']}").replace("{placeHolder}", columnText);
        fItemTemplate = fItemTemplate.replace("{inputRules}", `rules={[{ required: true, message: 'Please Enter ` + columnText + `' }]}`);

    })
}
export {
    getAllTables,
    getReactCode
}