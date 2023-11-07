import React, { Component } from 'react';
import Modal_Detail_Area from "./model_detile_area/index"
import Modal_Detail_Global from "./model_detile_global/index"
import {Button, Radio,message} from 'antd'
import {SaveModelData} from "../service/api"
import {Router, withRouter} from 'react-router-dom';

require("./index.css") 



class Model extends Component {
  state = {
    radioValue:"area",
    dataSource :[]
  }

  save = ()=>{
    const data = {
      globalData:this.globalRef.state.dataSource,
      areaData :  this.globalRef.state.dataSource
    }

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

//根据id获取模板
  getModel = ()=>{

  }





  handleChange = (e)=>{
    this.setState({
      radioValue:e.target.value
    })
     
    
  }
 
  componentDidMount() {
    console.log(window.location)
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.get('type'))
    // console.log(searchParams)
    // const type = searchParams.get('type'); // 获取 id 参数值
    // console.log(type)
  }


  componentWillUnmount() {
  }

  render(){
    return(
        <div>
          <h2 style={{fontWeight:"bolder"}}>模型管理</h2>
          <div style={{marginTop:"20px"}}>
            音频类型：
          </div>
          <div style={{ marginTop:"20px",marginBottom:"20px"}}>
          <Radio.Group value={this.state.radioValue} onChange={(e)=>this.handleChange(e)}>
            <Radio value={"area"}>划分区域</Radio>
            <Radio value={"noArea"}>不划分区域</Radio>
         </Radio.Group>
          </div>
          <hr style={{backgroundColor:"#eaeaea"}}></hr>
          <div>
            <Modal_Detail_Global ref={(ref)=>this.globalRef = ref}></Modal_Detail_Global>
          </div>

          <div style={{marginTop:"20px", display: this.state.radioValue === "area"? "block":"none" }}>
            <Modal_Detail_Area ref={(ref)=>this.areaRef = ref}></Modal_Detail_Area>
          </div>

          <div style={{marginTop:"40px"}}>
            <Button type="primary"  onClick={() => this.save()}>保存</Button>
          </div>
          
        </div>
    )
  }

}
export default Model;
