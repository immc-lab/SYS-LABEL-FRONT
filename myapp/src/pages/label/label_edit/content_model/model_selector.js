import {TextArea,Radio,Checkbox} from 'antd';
import React, { Component } from 'react';



export default function SelectFuntion(type,obj) {

    let targetContent

    switch (type){
        case "Text":
            targetContent = <div>
                                <TextArea value="labelText" rows={1} placeholder="请输入音频信息" maxLength={50} style={{width:"80%"}} onChange={(e)=>{obj.saveText(e)}}></TextArea>
                            </div> 
            break;
        case "Radio":
            targetContent = <div>
                                <Radio.Group value="talk" style={{marginLeft:"4%"}}  onChange = {(e)=>obj.saveTalk(e)}>
                                    {new Array(obj.state.size).fill(null).map((_,i)=>{
                                        const value = i
                                        return(
                                        <Radio key = {value} value={value}>{obj.state.takes[i]}</Radio>
                                        )
                                    })}
                                </Radio.Group>
                            </div> 
            break;
        case "Checkbox":
            targetContent = <div>
                                <Checkbox.Group/>
                            </div>
            break;

    }

    return targetContent
}




    








