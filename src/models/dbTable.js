import dataTypeConstraints from "./dataTypeConstraints";
class DbTable {
   constructor(tableName, tableObject) {
      this.tableName = tableName;
      this.tableObject = tableObject;
      this.columns = [];
   }
   addColumn(columnObject) {
      this.columns.push(columnObject);
   }
}
class TableColumn {
   constructor(tableName, columnName) {
      this.tableName = tableName;
      this.columnName = columnName;
      this.inputConstraint = null;
   }
   parseColumn(columnData) {

      if (columnData && Object.keys(columnData).length > 0) {
         this.columnType = columnData.COLUMN_TYPE;
         // this.columnType=columnObject.COLUMN_TYPE;
         this.numericPrecision = columnData.DATETIME_PRECISION;
         this.isNullable = columnData.IS_NULLABLE === "NO" ? false : true;
         this.description = columnData.COLUMN_COMMENT;
         this.orderNo = columnData.ORDINAL_POSITION;
         if (this.description && this.description != '' && this.description.includes(",")) {
            var desElements = this.description.split(",");
            this.dataType = desElements[0];
            this.constraint = desElements[1];
            this.isPrimryKey = false;
            this.isPrimryKey2 = false;
            this.isAutoCode = false;
            this.isForeignKey = false;
            this.isForeignKey2 = false;
            this.isCollections = false;

            if (this.constraint === "None") {
               this.isPrimryKey = false;
               this.isPrimryKey2 = false;
               this.isAutoCode = false;
               this.isForeignKey = false;

               this.isCollections = false;
               this.constraintString = null;
            }
            else {
               if (this.constraint === "PrimaryKey")
                  this.isPrimryKey = true;
               else if (this.constraint === "PrimaryKey2")
                  this.isPrimryKey2 = true;
               else if (this.constraint === "AutoCode") {
                  this.isPrimryKey = true;
                  this.isAutoCode = true;
                  this.constraintString = desElements[2];

               }
               else if (this.constraint === "ForeignKey") {
                  this.isForeignKey = true;
                  this.constraintString = desElements[2];
               }
               else if (this.constraint === "ForeignKey2") {
                  this.isForeignKey2 = true;
                  this.constraintString = desElements[2];
               }
               else if (this.constraint === "Collections") {
                  this.isCollections = true;
                  this.constraintString = desElements[2];
               }
            }
         }


         //update template Name.
         var tmp = dataTypeConstraints.find((item) => item.dataType === this.dataType)
         if (tmp)
            this.inputConstraint = tmp;
         else {
            this.inputConstraint = {
               dataType: "",
               possibleConstraints: "",
               defaultConstraint: "",
               template: ``,
               functions: ``,
            }
         }
      }
   }
}
export {
   DbTable,
   TableColumn
}