import React, { Component } from 'react';
import Modal_Detail_Area from "./model_detile_area/index"
import Modal_Detail_Global from "./model_detile_global/index"
import {Button, Input, Radio,message,Spin} from 'antd'
import {SaveModelData,getModelByKey} from "../service/api"
import {Router, withRouter} from 'react-router-dom';


require("./index.css") 



class Model extends Component {
  
  state = {
    ready:false,
    globalData:[],
    areaData:[],
    key:"",
    modelName:"",
    type:"",
    radioValue:"area",
    dataSource :[]
  }

  save = ()=>{
    const {type,modelName,key,radioValue} = this.state
    const data = {
      key:key,
      type:type,
      name:modelName,
      area:radioValue,
      globalData:this.globalRef.state.dataSource,
      areaData :this.areaRef.state.dataSource
    }
    console.log("提交时看下dataSorce")
    console.log(this.globalRef.state.dataSource)
    console.log("发送数据")
    console.log(data)
    this.updataModel(data)
  }


  updataModel(data){
    SaveModelData(data).then(data =>{
      if (data.status === '0'){
        message.success("保存成功！")
      }else{
        message.error("系统忙！请稍候重试！")
      }
    })



  }

  handelNameChange = (e)=>{
    this.setState({
      modelName:e.target.value
    })
     
  }

  handleChange = (e)=>{
    this.setState({
      radioValue:e.target.value
    })
     
    
  }
 
  componentDidMount() { 
    console.log(window.location)
    const searchParams = new URLSearchParams(window.location.search);
    const type = String(searchParams.get("type"))
    if(type !== null && type !== undefined){
      if(type === "add"){
        this.setState({
          type:type,
          ready:true
        })
      }
      if(type === "update"){
        const key = searchParams.get('key')
        this.getModelByKey({key:key})
        this.setState({
          key:key,
          type:type
        })
      }
    }
  }
//根据id获取模板
  getModelByKey = (data)=>{
    getModelByKey(data).then(data =>{
      console.log(".....................")
      console.log(data)
      if(data.status === '0'){
        this.setState({
          modelName:data.data.name,
          radioValue:data.data.area,
          globalData:data.data.globalData,
          areaData:data.data.areaData,
          ready:true
        })
      }
    })
  }
  componentWillUnmount() {
  }

  render(){
    return(
        <div>
          {this.state.ready?
          <div>
            <h2 style={{fontWeight:"bolder"}}>模型管理</h2>
            <div style={{ marginTop:"20px",marginBottom:"20px"}}>
            <span>
                模板名称：
                <Input placeholder='请输入模板名称' value={this.state.modelName} style={{width:"200px"}} onChange={(e)=>this.handelNameChange(e)}></Input>
              </span>
              <span style={{marginLeft:"40px"}}>
                音频类型：
                <Radio.Group value={this.state.radioValue} onChange={(e)=>this.handleChange(e)}>
                  <Radio value={"area"}>划分区域</Radio>
                  <Radio value={"noArea"}>不划分区域</Radio>
                </Radio.Group>
              </span>
            </div>
            <hr style={{backgroundColor:"#eaeaea"}}></hr>
            <div>
              <Modal_Detail_Global ref={(ref)=>this.globalRef = ref} globalData = {this.state.globalData}></Modal_Detail_Global>
            </div>

            <div style={{marginTop:"20px", display: this.state.radioValue === "area"? "block":"none" }}>
              <Modal_Detail_Area ref={(ref)=>this.areaRef = ref} areaData = {this.state.areaData}></Modal_Detail_Area>
            </div>

            <div style={{marginTop:"40px"}}>
              <Button type="primary"  onClick={() => this.save()}>保存</Button>
            </div>
            </div>
            
            :<Spin></Spin>}
          
        </div>
    )
  }

}
export default Model;
