import React,{} from 'react';
import { CopyBlock,atomOneLight } from "react-code-blocks";
import {cyan } from '@ant-design/colors';
const MyCodeBlock = (props) => {
   
    const { language, text, ...other } = props;
    return (
        <div style={{border:'1px solid',borderColor:cyan[7]}}>
        <CopyBlock
        language={language}
        text={text}
        codeBlock
       // wrapLines
        theme={atomOneLight}
        {...other}
        showLineNumbers={false}
      /></div>
    );
}
export {
    MyCodeBlock,
} 