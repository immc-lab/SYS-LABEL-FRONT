import React, { Component } from 'react';
import Modal_Detail_Area from "./model_detile_area/index"
import Modal_Detail_Global from "./model_detile_global/index"
import {Button, Input, Radio,message,Spin, Table, Form} from 'antd'
import {SaveModelData,getModelByKey} from "../service/api"
import {Router, withRouter} from 'react-router-dom';


require("./index.css") 



class Model extends Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
  }
  
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

  

  save = () => {
    let areaPass = true;
    let globalPass = true;
    let modelNamePass = true;
    const modelNamePromises = this.tableRef.current.validateFields().catch(error =>{
      modelNamePass = false;
    });
    const areaPromises = this.areaRef.tabRefs.map(item => {
      if (item.current !== null) {
        return item.current.validateFields().catch(error => {
          areaPass = false;
        });
      }
    });
  
    const globalPromises = this.globalRef.tabRefs.map(item => {
      if (item.current !== null) {
        return item.current.validateFields().catch(error => {
          globalPass = false;
        });
      }
    });
  
    Promise.all([...areaPromises, ...globalPromises,modelNamePromises])
      .then(() => {
        if (areaPass && globalPass && modelNamePass) {
          const { type, modelName, key, radioValue } = this.state;
          const data = {
            key: key,
            type: type,
            name: modelName,
            area: radioValue,
            globalData: this.globalRef.state.dataSource,
            areaData: this.areaRef.state.dataSource
          };
          this.updataModel(data);
        }
      });
  };
  


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
    const modelName = this.state.modelName
    return(
        <div>
          {this.state.ready?
          <div>
            <h2 style={{fontWeight:"bolder"}}>模型管理</h2>
            <div style={{ marginTop:"20px",marginBottom:"20px"}}>
             <span>
                <Form initialValues={{modelName:modelName}} ref={this.tableRef}>
                  <Form.Item
                    label="模板名称"
                    name="modelName"
                    rules={[{ required: true, message: '请输入模板名称'}]}
                    >
                      
                    <Input placeholder='请输入模板名称' value='modelName' style={{width:"200px"}} onChange={(e)=>this.handelNameChange(e)}></Input>
                  </Form.Item>
                </Form>
              </span>
              <span style={{marginLeft:"10px"}}>
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
