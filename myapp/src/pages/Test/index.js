import React, { Component } from 'react';
import {getMainMode} from './api'
import {Table,Radio,Checkbox,Input} from 'antd'
import { Item } from 'rc-menu';
import { getOpenCount } from 'rc-util/lib/PortalWrapper';
import useToken from 'antd/es/theme/useToken';
const { TextArea } = Input;
require("./index.css") 


 
class Text extends Component {
state = {
    update:false,
    ready:false,
    columns : [
        {
            title: '选项',
            dataIndex: 'modelName',
            width:"25%",
            key:"name",
            render:(text,record)=>{
                let content = null
                let child = record.isChildren
                switch(record.typeValue){
                    case "Text": 
                        content = 
                            <>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                {record.textValue+":"}
                                <TextArea
                                    showCount maxLength={200}
                                    defaultValue={this.getDefaultValue(record)[0]}
                                    style={{marginLeft:"20px",width:"50%"}}
                                    onChange={(e)=>{child? 
                                        this.handleChildRadioChange(e,record):
                                        this.handleFatherRadioChange(e,record)}}
                                />
                                </div>
                            </>
                            
                        break
                    case "Radio":
                        content = <>
                                    {record.textValue+":"}
                                    <Radio.Group 
                                        defaultValue={this.getDefaultValue(record)[0]}
                                        options={record.tabOptions}
                                        style={{marginLeft:"20px"}}
                                        onChange={(e)=>{child? 
                                                        this.handleChildRadioChange(e,record):
                                                        this.handleFatherRadioChange(e,record)}}/>
                                </>
                                    
                        break
                    case "Checkbox": 
                        const CheckboxGroup = Checkbox.Group;
                        content =<>
                                {record.textValue+":"}  
                                <CheckboxGroup
                                defaultValue={this.getDefaultValue(record)}
                                options={record.tabOptions}
                                style={{marginLeft:"20px"}}
                                onChange={(checkedValues)=>{child? 
                                    this.handleChildRadioChange(checkedValues,record):
                                    this.handleFatherRadioChange(checkedValues,record)}}
                                />
                            </> 
                        break
                }
                return(content)
            }

        },
    ],
    globalData:[],
    areaData:[],
    dataSource:[],
    disPlayData:[]
}



handleTextChange = (e,record)=>{
    const{saveData} = this.state



}

transLaterCheckboxTab(list){
    const newList = []
    list.map(item =>{
        newList.push(item.value)
    })
    console.log("看下newList")
    console.log(newList)
    return newList
}


init = ()=>{
    const saveData = []
    const {dataSource} = this.state //模板数据
    //获取保存的数据，如果没有则重新生成并保存,如果有需要放初始值进 disPalyData 用于初始化数据

    
    //获取模板
    getMainMode().then(data =>{
        let disPlayData = []
        let saveData = []
        //用于显示
        data.data.globalData.map(item =>{
            // 如果保存过加入保存过的children
            // const children = []
            // saveData.filter(saveDataItem => saveDataItem.id === item.id)[0].value


            const newData = {
                key:item.key,
                id:item.id,
                isChildren:false,
                textValue:item.textValue,
                typeValue:item.typeValue,
                tabOptions:item.tabOptions

            }
            disPlayData.push(newData)
        })

        //用于保存数据
        data.data.globalData.map(item =>{
            const children = []
            item.children.map(item =>{
                const newChild = {
                    id:item.id,
                    type:item.typeValue,
                    label:item.textValue,
                    linkValue:item.linkValue,
                    value:[],
                }
                children.push(newChild)
            })
            const newData = {
                key:item.key,
                id:item.id,
                label:item.textValue,
                type:item.typeValue,
                tabOptions:item.tabOptions,
                selectChildId:null,
                children:children,
                value:[],
            }
            saveData.push(newData)
        })

        this.setState({
            saveData:saveData,
            dataSource:data.data.globalData,
            disPlayData:disPlayData,
            ready:true
        })
    })

}


getDefaultValue = (record)=>{
    const {saveData} = this.state
    if(record.isChildren){
        const targetData = saveData.filter(item => item.id === record.id.split("-")[0])[0]
        const linkValue = record.linkValue[0]
        const index = targetData.value.indexOf(linkValue)
        //用于处理复选框  value有多个值，拿最后操作的哪个值
        const length = targetData.value.length
        const fatherValue = targetData.value[index]
        const childData =  targetData.children.filter(item => item.linkValue[0] === fatherValue)
        if(childData.length<=0){
            return []
        }else{
            return childData[0].value
        }
    }else{
        const targetData = saveData.filter(item => item.id === record.id)[0]
        return targetData.value
    }
}


handleFatherRadioChange = (e,record)=>{
    const {disPlayData,dataSource} = this.state
    console.log('调用父组件')
    //保存选中的值，进行child替换
    let value
    const{saveData}  = this.state
    if(record.typeValue === 'Checkbox'){
        value = e
        this.setAttribute(record.id,{value:e},saveData,false)
    }else{
        value = e.target.value
        this.setAttribute(record.id,{value:[e.target.value]},saveData,false)
    }
   
    console.log(saveData)
    //去除child
   
    const children = dataSource.filter(item => item.id === record.id)[0].children
    const child = children.filter(item => value.includes(item.linkValue[0]))
    if(child === null || child === undefined){
        const displayFatherData = disPlayData.filter(item => item.id === record.id)[0]
        const otherDisPalyData = disPlayData.filter(item => item.id !== record.id)
        const newDispalyFatherData = {}
        for(let key in displayFatherData){
            if(key!=='children'){
                newDispalyFatherData[key] = displayFatherData[key]
            }
        }
        const newDisPaly = [
            ...otherDisPalyData,
            newDispalyFatherData
        ]
        this.setState({
            disPlayData:newDisPaly
        })
        return
    }
    const targetData = disPlayData.filter(item=> item.id === record.id)[0]
    const otherData = disPlayData.filter(item => item.id !== record.id)
    const newChildren = [...child]
    console.log("看下child")
    console.log(child)
    const newTargetData = {
        ...targetData,
        children:newChildren
    }

    const newDisPlayData = [
        ...otherData,
        newTargetData
    ]
    const sortedDisPlayData = newDisPlayData.sort((a, b) => parseInt(a.id) - parseInt(b.id))

    this.setState({
        disPlayData:sortedDisPlayData,
    })


}

handleChildRadioChange = (e, record) => {
    console.log("看下id");
    console.log(record.id);
    const { saveData } = this.state;
    if(record.typeValue === 'Checkbox'){
        this.setAttribute(record.id, {value: e}, saveData, false)

    }else{
        this.setAttribute(record.id, {value: [e.target.value]}, saveData, false)
    }
    
    console.log("看下saveData")
    console.log(this.state.saveData)
  };

changeChildById = (id)=>{

}



setAttribute = (id, key, dataSource,isDelete) => {
    let isFatherDelet = false
    const parts = id.split("-");
    const fatherId = parts[0];
    const sonId = parts[1] || "";
    let targetData = dataSource.filter((item) => item.id === fatherId)[0];
    let otherData = dataSource.filter((item) => item.id !== fatherId);
    if (sonId !== "") {
      let targetSonData = targetData.children.filter((item) => item.id === id)[0];
      let otherSonData = targetData.children.filter((item) => item.id !== id);
      if(isDelete){
        const newChildren = [...otherSonData]
        targetData = {
          ...targetData,
         children: [...newChildren],
        }

      }else{
        targetSonData = {
          ...targetSonData,
          ...key,
        };
        const newChildren = [...otherSonData, targetSonData];
        //排序
        targetData = {
          ...targetData,
          children: [...newChildren],
        };
     }
    } else {  
        if(isDelete){
          isFatherDelet = true
        }else{
          targetData = {
            ...targetData,
            ...key,
          };
      }
      
    }
    let newDataSource
    if(isFatherDelet){
       newDataSource = [...otherData];
    }else{
       newDataSource = [...otherData, targetData];
    }
    
    this.setState({
        saveData:newDataSource,

    });
  };
 

  componentDidMount() {
    this.init()
    
  }


  componentWillUnmount() {
    
  }

  render(){
    return(
        <div>
            {this.state.ready?
            <Table
                columns={this.state.columns}
                dataSource={this.state.disPlayData}>
            </Table>
            :null}
        </div>
    )
  }

}
export default Text;
