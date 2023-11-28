import React, { Component } from 'react';
import {Table,Radio,Checkbox,Input,TimePicker, Button, Form} from 'antd'
const { TextArea } = Input;
import PubSub, { countSubscriptions } from 'pubsub-js'
import moment from 'moment'
require("./index.css") 


 
class EditWaveLeft extends Component {
    
    constructor(props) {
        super(props);
        //保存必输
        this.tabRefs = [];
        this.timeRef = React.createRef()
      }
state = {
    update:false,
    ready:false,
    columns : [
        {
            title: '局域标注',
            dataIndex: 'modelName',
            width:"25%",
            key:"name",
            render:(text,record)=>{
                let content = null
                let child = record.isChildren
                const ref = React.createRef();
                this.tabRefs.push(ref);
                switch(record.typeValue){
                    case "Text": 
                    
                        content = 
                                <div>
                                <Form initialValues={{[record.textValue]:this.getDefaultValue(record)[0]}}
                                       ref = {ref}>
                                    <Form.Item
                                        label = {record.textValue}
                                        name = {record.textValue}
                                        style={{ marginBottom: 0 }} // 去除表单项底部的间距
                                        rules={[{ 
                                                required: record.isNecessary? true:false, 
                                                message: '请输入'+ record.textValue
                                                }]}

                                    >
                                        <TextArea
                                            showCount maxLength={200}
                                            style={{marginLeft:"20px",width:"50%"}}
                                            onChange={(e)=>{child? 
                                                this.handleChildRadioChange(e,record):
                                                this.handleFatherRadioChange(e,record)}}
                                        />
                                    </Form.Item>
                                </Form>
                                </div>
                                
                            
                        break
                    case "Radio":
                        content = 
                                <Form ref={ref}  initialValues={{[record.textValue]:this.getDefaultValue(record)[0]}}>
                                    <Form.Item
                                        label = {record.textValue}
                                        name = {record.textValue}
                                        style={{ marginBottom: 0 }} // 去除表单项底部的间距
                                        rules={[{ 
                                                required: record.isNecessary? true:false, 
                                                message: '请输入'+ record.textValue
                                                }]}
                                    >
                                        {/* {record.textValue+":"} */}
                                        <Radio.Group 
                                            // defaultValue={this.getDefaultValue(record)[0]}
                                            options={record.tabOptions}
                                            style={{marginLeft:"20px"}}
                                            onChange={(e)=>{child? 
                                                            this.handleChildRadioChange(e,record):
                                                            this.handleFatherRadioChange(e,record)}}/>
                                    </Form.Item>
                                </Form>
                                    
                        break
                    case "Checkbox": 
                        const CheckboxGroup = Checkbox.Group;
                        content =
                               <Form ref={ref} initialValues={{[record.textValue]:this.getDefaultValue(record)}}>
                                   <Form.Item
                                    label = {record.textValue}
                                    name = {record.textValue}
                                    style={{ marginBottom: 0 }} // 去除表单项底部的间距
                                    rules={[{ 
                                            required:record.isNecessary? true:false,
                                            message: '请输入'+ record.textValue
                                            }]}
                                   >
                                {/* {record.textValue+":"}   */}
                                    <CheckboxGroup
                                    options={record.tabOptions}
                                    style={{marginLeft:"20px"}}
                                    onChange={(checkedValues)=>{child? 
                                        this.handleChildRadioChange(checkedValues,record):
                                        this.handleFatherRadioChange(checkedValues,record)}}
                                    />
                                    </Form.Item>
                                </Form>
                            
                        break

                    case "Time":
                        content = 
                                <Form ref={this.timeRef} initialValues={{[record.textValue]:this.getTime()}} style={{display:'flex'}}>
                                    <Form.Item
                                        label = {record.textValue}
                                        name = {record.textValue}
                                        style={{ marginBottom: 0 }} // 去除表单项底部的间距
                                        rules={[{ 
                                                required:record.isNecessary? true:false,
                                                message: '请输入'+ record.textValue
                                                }]}
                                    >
                                    <TimePicker.RangePicker
                                        // value = {this.getTime()}
                                        format={"mm:ss"}
                                        style={{marginLeft:"20px"}}
                                        onChange={(value)=>{this.saveTimePicker(value)}}
                                    /> 
                                    </Form.Item>
                                    <Button type="primary"style={{marginLeft:"10px"}} onClick={()=>{this.getTimeAuto(record)}}>
                                        <span>
                                            自动获取
                                        </span>
                                    </Button>
                                </Form>
                                  
                        break
                }
                return(content)
            }

        },
    ],
    ready:false,
    dataSource:[],
    disPlayData:[],
    saveData:[],
    timeRange:[],
    preTimeRange:[],
    handelTimeFill:false,
    setTimeAutoFill:false,
    currentTimeRange:[],
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


//保存修改的时间

saveTimePicker = (value)=>{
    console.log("看下时间",value)
    let startTime
    let endTime
    let preTimeRange
    if(value!==null){
         startTime = value[0].format('mm:ss')
         endTime = value[1].format('mm:ss')
         preTimeRange = [startTime,endTime]
    }else{
        preTimeRange = []
    }
    
    this.setState({
        preTimeRange:preTimeRange,
        handelTimeFill:true,
    })

}

//自动获取时间
getTimeAuto = (record)=>{
    const {timeRange} = this.state
    console.log("看下timeRange",timeRange)
    this.setState({
        setTimeAutoFill:true,
        preTimeRange:timeRange,
        handelTimeFill:false,
    },()=>{
        const time = this.getTime()
        const body = {
            [record.textValue]:time
        }
        this.timeRef.current.setFieldsValue(body)
    })
}

getTime = ()=>{
    const{preTimeRange,setTimeAutoFill,handelTimeFill} = this.state
    if(setTimeAutoFill || handelTimeFill){
        if(preTimeRange.length<=0){
            return []
        }
        const startTime = moment(preTimeRange[0],"mm:ss");
        const endTime = moment(preTimeRange[1],"mm:ss");
        const newTimeRange = [startTime,endTime]
        return newTimeRange
    }else{
       return[]
    }
    
}





init = ()=>{ 
  let {saveData,saved,model,timeRange} = this.props
  console.log("看下saved.........",saved)
  console.log("看下saveData",saveData)
  let setTimeAutoFill = true
  if((timeRange[0] === undefined && timeRange[1] === undefined)|| (timeRange[0] === null&& timeRange[1] === null)){
    timeRange = []
    setTimeAutoFill = false
  }
  let disPlayData = []
  //保存过数据直接赋值
  if(saved){
    //创建display
    model.map(item =>{
      const value = saveData.filter(saveDataItem => saveDataItem.id === item.id)[0].value
      const children = item.children.filter(item => value.includes(item.linkValue[0]))
      const newData = {
          key:item.key,
          id:item.id,
          isChildren:false,
          textValue:item.textValue,
          typeValue:item.typeValue,
          tabOptions:item.tabOptions,
          isNecessary:item.isNecessary,
          children:children
      }
      disPlayData.push(newData)
  })
  }else{
  //创建dispaly
    saveData = []
    model.map(item =>{
      const newData = {
          key:item.key,
          id:item.id,
          isChildren:false,
          textValue:item.textValue,
          typeValue:item.typeValue,
          isNecessary:item.isNecessary,
          tabOptions:item.tabOptions,
      }
      disPlayData.push(newData)
  })

  //创建saveData
    model.map(item =>{
      const children = []
      item.children.map(item =>{
          const newChild = {
              id:item.id,
              type:item.typeValue,
              label:item.textValue,
              linkValue:item.linkValue,
              isNecessary:item.isNecessary,
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
          isNecessary:item.isNecessary,
          children:children,
          value:[],
      }
      saveData.push(newData)
  })


  }

  //disPlayData去除children为空的数据
  const newDisPlayData2 = this.removeEmptyChildren(disPlayData)

  //加入时间选择器
  const newDisPalyData = [{typeValue:"Time",textValue:"时间范围",isNecessary:true},...newDisPlayData2]
  this.setState({
    preTimeRange:timeRange,
    setTimeAutoFill:setTimeAutoFill,
    dataSource:model,
    disPlayData:newDisPalyData,
    saveData:saveData,
    id:this.props.id,
    ready:true,
  })
  console.log("看下newDisPalyData",newDisPalyData)

  console.log(newDisPalyData)

}


getDefaultValue = (record)=>{
    console.log("看下record....",record)
    const {saveData} = this.state
    console.log("看下saveDatahaha",saveData)
    //问题出现在saveData上
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
    const newSortedDisPlayData = this.removeEmptyChildren(sortedDisPlayData)

    this.setState({
        disPlayData:newSortedDisPlayData,
    })


}

//去除空children属性
removeEmptyChildren(objList) {
    return objList.map(obj => {
      if (obj.children === null || obj.children === undefined || obj.children.length <= 0) {
        const { children, ...rest } = obj;
        return { ...rest };
      }
      return obj;
    });
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
        const sortedNewChildren = newChildren.sort((a, b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]));
        targetData = {
          ...targetData,
          children: [...sortedNewChildren],
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

    //保持顺序
    const sortedDataSource = newDataSource.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    this.setState({
        saveData:sortedDataSource,
    });
  };
 

  componentDidMount() {
    //订阅事件范围事件
    PubSub.subscribe('getTime', (msg, data) => {
       
        this.setState({
            timeRange:data
        })
        console.log("监听器接受到",this.state.timeRange)
      });
     
    this.init()
  }


  componentWillUnmount() {
    
  }

  render(){
    return(
        <div>
            {this.state.ready?
            <div>
                <Form>
                    <Table
                        columns={this.state.columns}
                        expandable = {{defaultExpandAllRows:true,expandRowByClick:false}}
                        dataSource={this.state.disPlayData}
                        virtual={true}
                        scroll = {{x:1000,y:400}}
                        pagination = {false}
                        >
                        
                    </Table>
                </Form>
            </div>
            :null}
        </div>
        
    )
  }

}
export default EditWaveLeft;

