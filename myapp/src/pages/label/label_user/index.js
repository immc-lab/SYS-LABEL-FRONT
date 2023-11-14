import React, { Component} from 'react';
import { Table } from 'antd';
import { Input, Badge,Modal,message} from 'antd';
import { Button} from 'antd';
import {getLabelAudioData,getLabelAudioDataByKey,getSavedEditData} from '../service/api'
import PubSub from 'pubsub-js'
import { Base64 } from 'js-base64';
import  EditWave from '../label_edit'
require("./index.css")
const { TextArea } = Input;
class HandelWave extends Component {
 
  state = {
    //判断EditWave是否是第一次创建
    isFirstMount : true,
    //或取当前key值
    currentEditKey:null,
    //保存 编辑的内容
    editDatas:[],
    allCurrentEditContent:[],
    //当前选择的行编辑信息
    currentEditContent:null,
    tableDisplay:true,
    editWaveDisplay:false,
    isShowRemarkTable:false,
    showRemarkTable:[],
    remarkTableKey:[],
    remarkTable:[],
    total:null,
    pages:null,
    pageProperty:{
      page:1,
      limit:500,
    },
    currentAudioFile: "",
    columnPlayStatus: [],
    columnStates: [],
    loadingStatus: [],
    saveEditData: [],
    columns: [
      {
        title: '播放',
        dataIndex: 'actionPlay',
        key: 'actionPlay',
        render: (text, record) => {
          return (
              <Button onClick={() =>{
                this.getMusicResourceAndPlay(record.key)
              }} style={{color :"red"}}>Play</Button>
          )
        }
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },

      
      {
        title: '语音格式',
        dataIndex: 'format',
        key: 'format',
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text, record) => <Badge status={this.getColumnState(record.key)} text={this.getColumnStateText(record.key)} />,
      },
      {
        title: '语音翻译',
        dataIndex: 'translation',
        render: (text, record) => (
          <TextArea value={this.getTextAreaValues(record.key)} rows={1} placeholder="输入音频文字翻译" maxLength={50} onChange={e => this.handleInputChange(e, record.key)} />
        ),
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record) => (<div><Button
          style={{ width: "80px" }}
          type="primary"
          onClick={() => this.setRemark(record.key)}>
          {this.getRemark(record.key)? "标记" : "取消标记"}
        </Button>
          
        <Button
        // loading={this.remarkTable(record.key)}
        style={{ width: "80px",marginLeft:"20px", textAlign:"center"}}
        type="primary"
        onClick={() => this.tableDisplay(record.key)}>
        编辑
        </Button>
        </div>
        )
      },
    ],
    dataSource: []
  }
  //初始化表格数据
  initData = ()=>{
    const{pageProperty,dataSource,pages,total} = this.state
    getLabelAudioData({...pageProperty})
      .then(data =>{
        if(data.status != '0'){
          message.error("初始化数据失败！请稍候重试")
        }else{
          console.log(data)
          this.setState({
            dataSource:[...dataSource,...(data.data.labelDataList)],
            pages:data.data.pages,
            total:data.data.total
          })
        }
        console.log(dataSource)
      })
      .catch(error=>{
        console.log(error)
        message.error("初始化数据失败！请稍候重试")
      })
    
  }


  //进入编辑状态

  intoEditPage  = ()=>{


    
  }
//保存被标记行数据
  setRemark = (key)=>{
    const {remarkTableKey} = this.state
    console.log(remarkTableKey.includes(key))
    if(remarkTableKey.includes(key)){
      const filetData = remarkTableKey.filter((char)=> char !== key
      )
      console.log("这里是fileData")
      console.log(filetData)
      this.setState({
        remarkTableKey:[...filetData]
      })
    }else{
      this.setState({
        remarkTableKey:[...remarkTableKey,key]
      })
    }
  }

  getRemark = (key)=>{
    const{remarkTableKey} = this.state
    if(remarkTableKey.includes(key)){
      return false
    }else{
      return true
    }
  }

  getRemarkTable = ()=>{
    const{remarkTableKey,dataSource,isShowRemarkTable} = this.state
    console.log(isShowRemarkTable)
    if(isShowRemarkTable === true){
      console.log("进入if")
      this.setState({
        isShowRemarkTable:false,
      })
      console.log(isShowRemarkTable)
    }else{
      const filteData =  dataSource.filter(item => remarkTableKey.includes(item.key))
      this.setState({
      isShowRemarkTable:true,
      remarkTable:[...filteData]
    })
    }
  }

  getTextAreaValues(key){
    const {saveEditData} = this.state
    const targetData = this.getColumn(key,saveEditData)
    if(targetData!==null){
      return targetData.translation
    }else{
      return ""
    }
  }


  getMusicResourceAndPlay = (key)=> {
    console.log(key)
    let currentAudioBlob
    const req = {
      key:key
    }
    getLabelAudioDataByKey({...req}).then(data =>{
      currentAudioBlob = this.base64ToBlob(data.data)
      //通知父组件
      PubSub.publish("currentPlayAudioBlob",{currentAudioBlob:currentAudioBlob})
      this.setState({
        currentAudiokey: key
      })
    })
    .catch(error=>{
    })
    this.setColumnPlayStatu(key,true)
  }

  base64ToBlob(base654_String){
    const binaryString = Base64.atob(base654_String); 
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes.buffer], {type: 'audio/mpeg'});
    return blob
  }


  componentDidMount() {
    this.initData()
  }

  getColumn(key, target) {
    const targetData = target.filter(item => item.key === key)
    if(targetData.length>=1){
      return targetData[0]
    }else{
      return null
    }
    
  }

  getColumnPlayStatu = (key) => {
    const { columnPlayStatus } = this.state
    const tragetData = this.getColumn(key, columnPlayStatus)
    if (tragetData === null) {
      return false;
    } else {
      return tragetData.playing
    }
  }

  setColumnPlayStatu = (key,playing) =>{
    const { columnPlayStatus } = this.state
    onsole.log(columnPlayStatus)
    const targetData = this.getColumn(key,columnPlayStatus)
    if(targetData!==null){
      const otherData = this.getOtherColumn(key,columnPlayStatus)
      const newData = {
        key:key,
        isplaying:playing
      }
      this.setState({
        columnPlayStatus:[...otherData,newData]
      })
    }else{
      console.log("进入 else")
      const newData = {
        key:key,
        isplaying:playing
      }
      this.setState({
        columnPlayStatus:[...columnPlayStatus,newData]
      })
    }
  }

  getOtherColumn(key,target){
     return target.filter(item => item.key !== key)
  }



  setColumnPlayStatu = (key, playStatu) => {
    const { columnPlayStatus } = this.state
    const targetData = this.getColumn(key, columnPlayStatus)
    if (targetData === null) {
      const newData = {
        key: key,
        playing: playStatu
      }
      this.setState({
        columnPlayStatus: [...columnPlayStatus, newData]
      })
    } else {
      targetData.playing = playStatu
    }
  }

  //获取任务执行状态
  getColumnState = (key) => {
    const { columnStates } = this.state
    const targetData = this.getColumn(key,columnStates)
    if (targetData === null) {
      return "default"
    } else {
      return targetData.state
    }
  }
  //获取任务执行状态描述

  getColumnStateText = (key) => {
    const { columnStates } = this.state
    const targetData = this.getColumn(key,columnStates)
    if (targetData === null) {
      return "未完成"
    } else {
      return targetData[0].stateText
    }
  }

  //设置任务执行状态
  setColumnState = (key, state) => {
    const { columnStates } = this.state
    let stateText = "处理中"
    switch (state) {
      case ("error"):
        stateText = "提交失败"
        break;
      case ("success"):
        stateText = "已提交"
        break;
      case ("processing"):
        stateText = "进行中"
        break;
    }
    const targetData = this.getColumn(key,columnStates)

    if (targetData === null) {
      const newData = {
        key: key,
        state: state,
        stateText: stateText
      }
      this.setState({
        loadingStatus: [...loadingStatus, newData]
      })
    } else {
      targetData.state = state
      targetData.stateText = stateText
    }

  }

  handleInputChange = (e, key) => {
    const { saveEditData, dataSource } = this.state
    const otherDatas = saveEditData.filter(data => (
      data.key !== key
    ));
    const newData = {
      key: key,
      translation: e.target.value
    }
    this.setState({
      saveEditData: [...otherDatas, newData]
    })
    console.log(saveEditData)

  }

  saveEditData = (targetData)=>{
    const{editDatas,currentEditKey} = this.state
    const otherData = editDatas.filter(item => item.key !== currentEditKey)
    this.setState({
      editDatas:[...otherData,targetData]
    })
    console.log("已经收到此信息")
    console.log(this.state.editDatas)
  }

  tableDisplay = (key)=>{
    const{editDatas} = this.state
    const targetData = editDatas.filter(item => item.key === key)
    this.setState({
      currentEditKey:key,
      currentEditContent:targetData[0]
    })
    const{tableDisplay,editWaveDisplay} = this.state
    if(tableDisplay){
      this.setState({
        tableDisplay:false,
        editWaveDisplay:true
        })
    }else{
      this.setState({
        tableDisplay:true,
        editWaveDisplay:false
        })
    }
  }


  setFirstMounted  = (state)=>{
    this.setState({
      isFirstMount:state
    })
  }


  render() { 
    return (
      
      <div>
        {/* {(this.state.tableDisplay)?
          <div  style={{display:this.state.tableDisplay?"block":"none"}}>
            <Table dataSource={this.state.isShowRemarkTable? this.state.remarkTable:this.state.dataSource} pagination={{ pageSize: 2, total:this.state.total}} columns={this.state.columns} />
            <Button onClick={() =>this.allsubmit()}>提交</Button>
            <Button style = {{marginLeft:"20px"}}>完成</Button>
            <Button style = {{marginLeft:"20px"}} onClick={() =>this.getRemarkTable()}>{this.state.isShowRemarkTable? "显示全部内容":"显示标记内容"}</Button>
          </div>
        : null} */}

        {/* {this.state.editWaveDisplay? */}
        <div>
            <EditWave ref={(ref)=>this.editWaveRef = ref} 
                      currentEditKey ={this.state.currentEditKey}
                      currentEditContent = {this.state.currentEditContent} 
                      goBack = {this.tableDisplay}
                      isFirstMount = {this.state.isFirstMount}
                      saveEditData = {this.saveEditData}
                      setFirstMounted = {this.setFirstMounted}>
            </EditWave>
        </div>
          {/* // : null} */}
      </div>
    );
  }

}
export default HandelWave;
