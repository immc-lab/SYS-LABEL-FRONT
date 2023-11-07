import React, { Component } from 'react';
import {Tabs,Button,message} from 'antd';
import EditWaveLeft from './label_edit_left'
import {saveOrSubmitAudioData,getSavedEditData} from "../service/api"
require("./index.css") 



class EditWave extends Component {
  constructor(props) {
    super(props);
    this.tabRef = [];
    this.state = {
      areaSize:1,
      dataSource :[],
      array:new Array,
      currentEditContent:null,
    }
  }
 

  componentDidMount() {
    console.log("看这里有没有被销毁")
    console.log(this.isFirstMounted)
    console.log("看下 props")
    console.log(this.props)
    //首次挂载请求后台保存的数据
    if(this.props.isFirstMount){
      this.getSavedEditDatas(this.props.currentEditKey)
      this.props.setFirstMounted(false)
      
    }else{
      const editData = this.props.currentEditContent || {editData:[]}
      const size = editData.editData.length >= 1?  editData.editData.length : 1
      this.setState({
        currentEditContent:editData,
        areaSize:size,
        array:new Array(size)
      })
    }
  }


  getSavedEditDatas = (key)=>{
    getSavedEditData({key:key}).then(data =>{
      let content
      if(data.status === "0"){
        if(data.data.length<=0){
          content = {editData:[]}
        }else{
          content = {
            editData:data.data
          }
        }
        const size = content.editData.length>=1? content.editData.length:1
        this.setState({
          currentEditContent:content,
          areaSize:size,
          array:new Array(size)
        })
      }
    })
  }

  goBackAndSave = ()=>{
    const Datas = []
    this.tabRef.map(item=>{
       Datas.push(item.state.content)
    })
    const editDatas = {
      key:this.props.currentEditKey,
      editData:Datas
    }
    console.log(editDatas)
    this.props.saveEditData(editDatas)
    this.props.goBack()
    

  }

  saveOrSubmit = (type)=>{
    const Datas = []
    this.tabRef.map(item=>{
       Datas.push(item.state.content)
    })
    const resBody = {
      key:this.props.currentEditKey,
      type:type,
      text:"",
      commitList:Datas
    }
    saveOrSubmitAudioData(resBody).then(data=>{
      if(data.status === "0"){
        message.success(type === "submit"? "提交成功！" : "保存成功！")
      }else{
        message.error("提交失败，请稍候重试！")
      }
    }).catch(error=>{
      message.error("系统正忙请稍候重试！")
    })

    
  }

  addArea = ()=>{
    const{areaSize} = this.state
    this.setState({
      areaSize:areaSize+1,
      array:new Array(areaSize+1)
    })
    console.log(this.state.areaSize)

  }

  removeArea = ()=>{
    const{areaSize} = this.state
    if(areaSize<=1){
      message.warning("至少保留一个区域！")
      return
    }
    this.setState({
      areaSize:areaSize-1,
      array:new Array(areaSize-1)
    })
   
  }

  getArrayData = ()=>{
     console.log(this.tabRef[1])

  }

  componentWillUnmount() {
    
  }

  render(){
    return(
      <div style={{backgroundColor:"white"}}>
          <div style={{display:"inline-block", backgroundColor:"white",width:"50%",border:"2px solid #eaeaea",borderTop:"none"}}>
          <Tabs
            tabPosition="left"
            defaultActiveKey="1"
            type="card"
            size={this.state.areaSize}
            items={this.state.array.fill(null).map((_, i) => {
              const id = String(i + 1)
              const targetData = this.state.currentEditContent.editData.filter(item => item.id === id)[0] || {}
              console.log("下面是接收的targetData")
              console.log(targetData)
              return {
                label: `${id}`,
                key: id,
                children: <EditWaveLeft 
                           id = {id}
                           ref = {(ref) => this.tabRef[parseInt(id)] = ref}
                           preContent = {targetData}
                           model = "jajajaj"/>  
              };
            })}
          />
          </div>
          <div style={{display:"inline-block",  float:"right",backgroundColor:"white", width:"50%", height:"452px",border:"2px solid #eaeaea", borderLeft:"none",borderTop:"none"}}>
            <div className='areaTextRight' style={{marginTop:"1%", textAlign:"center"}}>
              <strong>全局标注</strong>
              <hr style={{border:"1px solid #eaeaea", marginLeft:"5%",marginRight:"5%", marginTop:"1.7%"}}></hr>
            </div>
          </div>

          <div style={{height:"50px",display:"flex",textAlign:"center", alignItems: "center", borderBottom:"2px solid #eaeaea"}}>
            <span style={{marginLeft:"20px"}}>
              <Button  onClick={()=>this.addArea()}>增加区域</Button>
            </span>

            <span style={{marginLeft:"20px"}}>
              <Button  onClick={()=>this.removeArea()}>移除区域</Button>
            </span>
            <div style={{marginLeft:"auto"}}>
            <span>
            <Button type='primary' onClick={()=>this.saveOrSubmit("submit")}>提交</Button>
            </span>
            <span>
              <Button style={{marginLeft:"20px"}} onClick={()=>this.saveOrSubmit("save")}>保存</Button>
            </span>
            <span style={{marginLeft:"20px",marginRight:"20px"}}>
              <Button  onClick={()=>this.goBackAndSave()}>返回</Button>
            </span>
            </div>
          </div>
      </div>
    )
  }

}
export default EditWave;
