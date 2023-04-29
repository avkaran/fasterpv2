import React, { useState, useEffect, useContext } from 'react';
import Handlebars from 'handlebars';
const getTemplateInputTypes = [
    'value',
    'content',
    'array',
    'table-columns',
    'table-data-or-objects-array',
    'project',
    'database-query'
]
const mustacheRender = (inputData, templateItem) => {
    const compiledTemplate = Handlebars.compile(templateItem.template);
    const output = compiledTemplate(inputData);
    return output;
}
const textContentToArray = (inputContent, templateItem) => {
    // console.log(inputContent)
    var input = inputContent['textContent'] //get content
    input = input.replace(/^\s*[\r\n]/gm, ""); //remove empty lines
    //verify is it json then return
    try {
        let parsedData = JSON.parse(input);
        if(Array.isArray(parsedData)){
            console.log('test',parsedData)
            return parsedData;
        }
       // console.log("The given data is in JSON format.");
    } catch (error) {
      //  console.log("The given data is not in JSON format.");
    }

    // Check for li tags
    if (input.includes("<li>")) {
        let items = input.match(/<li>(.*?)<\/li>/g).map(item => item.replace(/<\/?li>/g, ""));
        return items;
    }
    if (input.includes("<option>")) {
        let items = input.match(/<option>(.*?)<\/option>/g).map(item => item.replace(/<\/?option>/g, ""));
        return items;
    }

    // Check for comma-separated values
    if (input.includes(",")) {
        let items = input.split(",").map(item => item.trim());
        return items;
    }

    // Check for table structure with column headings
    let lines = input.split(/[\r\n]+/);
    if (lines.length > 1 && lines[0].match(/\t/)) {
        let headers = lines[0].split("\t").map(header => header.trim());
        let rows = lines.slice(1).map(line => {
            let cells = line.split("\t").map(cell => cell.trim());
            let obj = {};
            headers.forEach((header, index) => obj[header] = cells[index]);
            return obj;
        });
        return rows;
    }

    // Check for words separated by newlines
    let words = input.split(/[\r\n]+/);
    if (words.length > 1) {
        words = words.map(word => word.trim());
        return words
    }

    // If input format cannot be determined, return null
    return [];
}
const projectDatabaseQueries = (inputContent, templateItem) => {
    return []
}
const projectQueryBuilder = (inputContent, templateItem) => {
    return 'select * from ....';
}
const getTemplateFunctionNames = [
    { function_name: 'mustacheRender()', function: mustacheRender, description: '' },
    { function_name: 'ReactFormGenerate()', function: '', description: '' },
    { function_name: 'textContentToArray()', function: textContentToArray, description: 'Converts comma separated,newline separated,plain text table,' },
    { function_name: 'projectDatabaseQueries()', function: projectDatabaseQueries, description: 'Executes Database Queries on given project' },
    { function_name: 'projectQueryBuilder()', function: projectQueryBuilder, description: 'Generate Queries based on given inputs, and combining tables' },
]
export {
    getTemplateFunctionNames,
    getTemplateInputTypes,
}