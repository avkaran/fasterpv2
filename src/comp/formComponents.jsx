import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { cyan } from '@ant-design/colors';
import './style.css'
const MyButton = (props) => {
    const [newType, setNewType] = useState("primary");
    const [newShape, setNewShape] = useState("square");
    const [newStyle, setNewStyle] = useState({});
    const { type, shape, style,color, borderColor, ...other } = props;
    useEffect(() => {
        var mystyle = {};
        if (!props.type || props.type === "primary") {
            let myColor = cyan[7];
            if (props.color) myColor = props.color;

            setNewType("primary");
            mystyle.background = myColor;
            mystyle.color = props.borderColor ? props.borderColor : cyan[1];
            mystyle.borderColor = props.borderColor ? props.borderColor : cyan[7];
        }
        else if (props.type === "outlined") {
            let myColor = cyan[7];
            if (props.color) myColor = props.color;
            setNewType("ghost")

            mystyle.color = myColor;
            mystyle.borderColor = props.borderColor ? props.borderColor : cyan[7];
        }
        else
            setNewType(props.type)


        if (!props.shape || props.shape === "square") {
            mystyle.borderRadius = '4px';
            setNewShape("square");
        }
        else if (props.shape === "round") {
            mystyle.borderRadius = '25px';
            setNewShape("square");
        }
        else if (props.shape === "circle") {
            setNewShape("circle");
        }
        if (props.style) {
            Object.entries(props.style).forEach(([key, value]) => {
                if (mystyle.hasOwnProperty(key))
                    delete mystyle[key];
                else
                    mystyle[key] = value;
            });
        }
        setNewStyle(mystyle)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Button
            type={newType}
            style={newStyle}
            shape={newShape}
            {...other}
        >

            <span> {props.children}</span>
        </Button>
    );
}
export {
    MyButton,
} 