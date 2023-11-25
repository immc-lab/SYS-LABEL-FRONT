import React, { Component } from 'react';
import { Table,Select, Button,Checkbox,Input,Form,Modal, message,Row, Col} from 'antd';
require("./index.css") 




class Modal_Detail_Global extends Component {

  constructor(props) {
    super(props);
    this.tabRefs = [];
  }
  state = {
    ready:false,
    expendRow:[],
    currentKey:"",
    editTab:[],
    typeOptions:[
      { value: 'Radio', label: '单选框  平铺' },
      { value: 'Text', label: '文本框' },
      { value: 'Checkbox', label: '复选框' },
    ],
    columns: [
      {
        title: '全局标签',
        dataIndex: 'type',
        key: 'type',
        width:"35%",
        render: (text, record) => {
          let width = "50%"
          let marginLeft = "0px"
          const isChildren = record.isChildren
          if(isChildren){
            width = "25%"
            marginLeft = "5px"
          }
          return (
              <div> 
                {
                 isChildren? 
                 <span style={{display:"inline"}}>
                    关联选项：<Select mode="multiple" onChange = {(value)=>this.handleLinkChange(record.id,value)} defaultValue={record.linkValue} options={record.linkOptions} style={{width:"25%",marginLeft:"5px"}}></Select>
                 </span>
                 :null
                 }
                 <span style={{display:"inline", marginLeft:"30px"}}>
                    类型：<Select  onChange = {(value)=>this.handleTypeChange(record.id,value)} defaultValue={record.typeValue} options={this.state.typeOptions} style={{width:width,marginLeft:marginLeft}}></Select>
                 </span>
              </div>
          )
        }
      },
      {
        title: '',
        dataIndex: 'title',
        key: 'title',
        width:"15%",
        render: (text, record) => {
          const ref = React.createRef();
          this.tabRefs.push(ref);
          return (
            <div style={{marginTop:"25px"}}>
              <Form initialValues={{title:record.textValue}}
                    ref={ref}
                     >
                <Form.Item
                  label="题目："
                  name="title"
                  rules={[{ required: true, message: '请输入题目' }]}
                >
                  <Input  onChange = {(e)=>this.handelTextChange(e,record.id)} defaultValue="title" style={{width:"100%",marginLeft:"10px"}}></Input>
                </Form.Item>
              </Form>

               {/* 题目： */}
            </div>
          )
        }
      },
      {
        title: '',
        dataIndex: 'tab',
        key: 'tab',
        width:"15%",
        render: (text, record) => {
          return (
            <div>
              {record.typeValue === "Text"? 
                null: 
                <div>
                  <Row align="middle">
                    <Col >选项:</Col>
                    <Col style={{marginLeft:"15px",width:"70%"}}>
                      {this.state.editTab.includes(record.id)? 
                      <Input onBlur={()=>this.HandeditTabOrOnBlur(record.id)} style={{width:"100%"}} placeholder={"例如:01,02,03,...."} onChange={(e) =>this.setTab(record.id,e)}></Input>
                      :<Select  defaultValue = {record.tabValue}  mode="multiple" options={record.tabOptions} style={{width:"100%"}}></Select>
                      }
                  </Col>
                  </Row>
                </div>
              }    
            </div>
          )
        }
      },
      {
        title: '',
        dataIndex: 'button',
        key: 'button',
        width:"25%",
        render: (text, record) => {
          return (
            <div>
              <Checkbox defaultChecked={record.isNecessary} onChange={(e)=>this.handelCheckBoxChange(e,record.id)}>必填</Checkbox>
              {record.typeValue === "Text"? 
                null:
                <div style={{display:"inline-block"}}>
                  {record.unAdd?
                    null:<Button onClick = {()=>this.addChildren(record.id,record.key)}>添加关联项</Button>
                  }     
                  <Button onClick = {()=>this.HandeditTabOrOnBlur(record.id)} style={{marginLeft:"10px"}}>自定义选项</Button>
                </div>
              }
              <Button  type="text" danger style={{marginLeft:"10px"}} onClick={()=>this.handleDelet(record.id)}>删除</Button>
            
            </div>
            
          )
        }
      },
    ],

        
      dataSource :[
        {
          key:"1",
          id:"1",
          //是否可以添加关联项
          unAdd:false,
          isChildren:false,
          isNecessary:false,
          textValue:"标注文本",
          typeValue:"Text",
          tabValue:["01","02"],
          
          tabOptions:[],
          children:[]
        },
      ]
  }


//初始化数据
  init = ()=>{

  }

  addChildren = (id,key)=>{
    const{dataSource,expendRow} = this.state
    let targetData = dataSource.filter(item =>item.id === id)[0]
    const childrenLength = targetData.children.length
    const children = targetData.children
    const newData = {
      isNecessary:false,
      textValue:"",
      typeValue:"",
      isChildren:true,
      unAdd:true,
      tabValue:["01","02"],
      id: id+"-"+String(childrenLength+1),
      key:id+"-"+String(childrenLength+1),
      tabOptions:[],
      linkValue:[],
      linkOptions:targetData.tabOptions
    }
    children.push(newData)
    this.setAttribute(id,{children:children},dataSource)
    expendRow.push(key)
    this.setState({
      expendRow:[...expendRow]
    })
    console.log("看下this.state.expendRow")
    console.log(this.state.expendRow)
    
  }


  handleLinkChange = (id,value)=>{
    const{dataSource} = this.state
    this.setAttribute(id, {linkValue:value},dataSource,false)
  }

  handleTypeChange = (id,value)=>{
    const{dataSource} = this.state
    this.setAttribute(id, {typeValue:value},dataSource,false)
  }

  handelTextChange = (e,id)=>{
    const{dataSource} = this.state
    this.setAttribute(id,{textValue:e.target.value},dataSource,false)
  }

  handelCheckBoxChange = (e,id) =>{
    const {dataSource} = this.state
    this.setAttribute(id,{isNecessary:e.target.checked},dataSource,false)
  }


  HandeditTabOrOnBlur = (id)=>{
    const {editTab} = this.state
    if(editTab.includes(id)){
      editTab.pop(id)
      this.setState({
        editTab:editTab
      })

    }else{
    editTab.push(id)
    this.setState({
      editTab:editTab
    })
   }
  }

  setTab = (id,e)=>{
    console.log("这里是id")
    console.log(id)
    const {dataSource} = this.state
    const value = e.target.value
    const tabArray =  value.split(",")
    const tabOptions = []
    for(let i = 0;i<tabArray.length;i++){
      const item = {value:tabArray[i],label:tabArray[i]}
      tabOptions.push(item)
    }
    this.setAttribute(id,{tabOptions:tabOptions,tabValue:tabArray},dataSource,false)
    console.log("这里是修改后的")
    console.log(dataSource)
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
        const sortedNewChildren = newChildren.sort((a, b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]));
        //排序
        targetData = {
          ...targetData,
          children: [...sortedNewChildren],
        };
     }
    } else {  
        if(isDelete){
          isFatherDelet = true
        }else{

          console.log("进入else");

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
    
    const sortedDataSource = newDataSource.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    this.setState({
      dataSource: sortedDataSource,
    });
  };
  

  addLabel = ()=>{
    const{dataSource} = this.state
    const length = dataSource.length
    const id = String(length+1)
    const newData = {
        isNecessary:false,
        key:id,
        id:id,
        textValue:"",
        typeValue:"Radio",
        tabValue:["01","02"],
        linkOptions:[],
        tabOptions:[],
        typeOptions:[
          { value: 'Radio', label: '单选框  平铺' },
          { value: 'Text', label: '文本框' },
          { value: 'Checkbox', label: '复选框' },
        ],
        children:[]
    }
     dataSource.push(newData)

    this.setState({
      dataSource:[...dataSource]
    })
    console.log("这里是dataSource")
    console.log(this.state.dataSource)
  }

  handleExpand = (expanded, record)=>{
    const {expendRow} = this.state
    console.log(expanded)
    if(!expanded){
      this.setState({
        expendRow:[...expendRow.filter(item =>item !== record.key)]
      })
    }else{
      expendRow.push(record.key)
      this.setState({
        expandedRow:[...expendRow]
      })
    }

  }
  //  点击删除按钮触发

  handleDelet = (id)=>{
    const{dataSource} = this.state
    //添加确认弹框
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条数据吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.setAttribute(id,{},dataSource,true)
        message.success("删除成功！")
      }

    })
  }
  componentDidMount() {
    const {globalData} = this.props
    const expendRow = []
    globalData.map(item=>{
      expendRow.push(item.key)
    })
    this.setState({
      dataSource:globalData,
      ready:true,
      expendRow:expendRow
    })
  }


  componentWillUnmount() {
    const { waveSurfer } = this.state;
    if (waveSurfer && waveSurfer.isReady) {
      waveSurfer.destroy();
    }
  }

  render(){
    return(
      <div>
        {this.state.ready?
        <div className='tableContent'>
          <Table
            expandable={{
            expandedRowKeys:this.state.expendRow,
            onExpand: (expanded, record) =>this.handleExpand(expanded, record),
          }}
            indentSize={50}
            dataSource={this.state.dataSource}
            columns={this.state.columns}
          ></Table>
          <div>
            <Button type='primary' style={{width:"100%", backgroundColor:""}} onClick={() =>{this.addLabel()}}>+ 新增全局标签</Button>
          </div>
        </div>
        :null}
      </div>
    )
  }

}
export default  Modal_Detail_Global;
