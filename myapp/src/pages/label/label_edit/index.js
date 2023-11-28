import React, { Component } from 'react';
import {Tabs,Button,message} from 'antd';
import EditWaveLeft from './label_edit_left'
import EditWaveRight from './label_edit_right';
import {saveOrSubmitAudioData,getSavedEditData,getMainMode} from "../service/api"
require("./index.css") 



class EditWave extends Component {
  constructor(props) {
    super(props);
    this.tabRef = [];
    this.rightRef = null;
    this.state = {
      areaSize:1,
      areaModel:[],
      globalModel:[],
      array:new Array,
      saved:false,
      saveData:[],
      ready:false,
      currentEditKey:"123456788",
      area:null,
    }
  }
 

  componentDidMount() {
    //请求模板数据
    getMainMode().then(data =>{
      if(data.status === '0'){
        console.log("看下模板model........")
        console.log(data)
        this.setState({
          area:data.data.area,
          areaModel:data.data.areaData,
          globalModel:data.data.globalData
        })
      }
    })

    //请求保存的数据,key先mock一下
    this.getSavedEditDatas(this.state.currentEditKey)
  }



  setSaveData = ()=>{
    const {globalModel} = this.state
    const saveData = []
    globalModel.map(item =>{
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
      return saveData
  }
      
      


  getSavedEditDatas = (key)=>{
    getSavedEditData({key:key}).then(data =>{
      let size
      let saveData
      let saved
      console.log("看下区域大小",data.data)
      if(data.status === "0"){
        if(data.data === null){
          saveData = []
          size = 1
        }else{
          saveData = data.data
          size = data.data.areaSaveData.length
          saved = true
        }
        
        this.setState({
          saveData:saveData,
          areaSize:size,
          saved:saved,
          array:new Array(size),
          ready:true
        })
      }
    })
  }

  saveOrSubmit = (type)=>{
    let areaPass = true 
    let globalPass = true
    let timePass = true
    const Datas = []
    const filterTabRef = this.tabRef.filter(item => item !== null);
   //校验必输
    const areaPromises =  filterTabRef.flatMap(item =>{
      return item.tabRefs.map(tab=>{
        if (tab.current !== null){
          return tab.current.validateFields().catch(error => {
            areaPass = false;
          });
        }
      })
    })

    const timePromiss = filterTabRef.map(item =>{
      if(item.timeRef.current !== null){
        return item.timeRef.current.validateFields().catch(error => {
          timePass = false;
        })
        }
    })

    const globalPromiss = this.rightRef.tabRefs.map(item =>{
      if (item.current !== null){
        return item.current.validateFields().catch(error => {
          globalPass = false;
        });
      }
    })

    Promise.all([...areaPromises,...globalPromiss,...timePromiss]).then(()=>{
      if(areaPass&&globalPass&&timePass){
        filterTabRef.map(item=>{
          const saveDataItem = {
            id:item.state.id,
            startTime:item.state.preTimeRange[0],
            endTime:item.state.preTimeRange[1],
            saveData:item.state.saveData,
          }
          Datas.push(saveDataItem)
        })
        const resBody = {
          //从链接中获取key
          key:this.state.currentEditKey,
          areaSaveData: Datas,
          globalSaveData: this.rightRef.state.saveData
        }
    
        console.log("看下resBody")
        console.log(resBody)
    
        saveOrSubmitAudioData(resBody).then(data=>{
          if(data.status === "0"){
            message.success(type === "submit"? "提交成功！" : "保存成功！")
          }else{
            message.error("提交失败，请稍候重试！")
          }
        })
      }
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


  componentWillUnmount() {
    
  }

  render(){
    return(
      <>
      {this.state.ready?
      <div>
        {this.state.area === "area"?
          <div style={{display:"inline-block",backgroundColor:"white",width:"50%",border:"2px solid #eaeaea"}}>
          <Tabs
            tabPosition='bottom'
            defaultActiveKey="1"
            type="card"
            size={this.state.areaSize}
            items={this.state.array.fill(null).map((_, i) => {
              const id = String(i + 1)
              let targetData
              let timeRange
              let saved = true
              console.log("看看啊",this.state.saveData)
              try{
                targetData = this.state.saveData.areaSaveData.filter(item => item.id === id)[0]
                timeRange = [targetData.startTime,targetData.endTime]
              }catch(error){
                targetData = {saveData:this.setSaveData()}
                timeRange = []
                saved = false
              }
              console.log("看下timeRnge")
              console.log(timeRange)
              return {
                label: `${id}`,
                key: id,
                children: <EditWaveLeft 
                            saved = {saved} //注意看这里控制是否显示保存的数据，还是新建一个全新的数据结构| 增加区域时候 要为false
                            id = {id}
                            ref = {(ref) => this.tabRef[parseInt(id)] = ref}
                            saveData = {targetData.saveData}
                            timeRange = {timeRange}
                            model = {this.state.areaModel}
                           />  
              };
            })}
          />
          </div>:null}
          <div style={{display:"inline-block",  float:"right",backgroundColor:"white", width:"50%", height:"470px",border:"2px solid #eaeaea", borderLeft:"none",marginTop:"12px"}}>
            <div className='areaTextRight'>
            <EditWaveRight
                saved = {this.state.saved}
                ref = {(ref) => this.rightRef = ref}
                saveData = {this.state.saveData.globalSaveData}
                model = {this.state.globalModel}
             />
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
      </div>:null}
      </>
    )
  }

}
export default EditWave;
