import React, { Component } from 'react';
import {Table,Button,Input, message,Modal,Spin,Tag,Search,Checkbox, Form,Select} from 'antd'
import{getAllTeam,saveOrUpdateTeam,getAllManager} from './service/api'
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
require("./index.css") 



class Team extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }


  state = {
    colums:[
        {
            title: '团队ID',
            dataIndex: 'id',
            key:"id",
            align: 'center',

        },

        {
            title: '团队名称',
            dataIndex: 'teamName',
            key:"teamName",
            align: 'center',
        },
        {
            title: '团队管理员',
            dataIndex: 'managerName',
            key:"managerName",
            align: 'center',
           

        },
      
        {
            title: '创建人',
            dataIndex: 'creator',
            key:"creator",
            align: 'center',
        },

        {
            title: '创建时间',
            dataIndex: 'createTime',
            key:"createTime",
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'opt',
            key:"opt",
            width:"15%",
            render:(text,record)=>{
                return(
                    <div>
                        <div>
                        <span>
                            <Button
                                type= 'text'
                                onClick={()=>{this.handelEdit(record)}}
                            >
                                <span>
                                    <span style={{color:"blue"}}>
                                        编辑
                                    </span>

                                </span>                          
                            </Button>
                        </span>

                        <span>
                        <Button
                          type= 'text'
                          onClick={()=>this.disableAccountByKey(record)}
                        >
                          <span style={{color:"blue"}}>
                               查看  
                          </span>
                         
                        </Button>
                        </span>
                        </div>
                    </div>
                    
                )
            }

        },
    ],

    dataSource:[{}],
    isModalOpen:false,
    type:"insert",
    managerOptions:[{label:"haha",value:"111"}],
    currentUser:null,
    copyDataSource:[],
    ready1:false,
    ready2:false,
    seed:null,
  }
 

  componentDidMount() {
    this.init()
    const{currentUser} = this.props
    this.setState({
      currentUser:currentUser
    })
  }


  componentWillUnmount() {
    
  }



  init = ()=>{
    let dataSource = []
    //获取所有管理员
    getAllManager().then(data =>{
      if(data.status === '0'){
        const managerOptions = []
        data.data.map(item=>{
          const opt = {
            label:item.userAccount,
            value:item.userKey
          }
          managerOptions.push(opt)
        })
        this.setState({
          managerOptions:managerOptions,
          ready1:true,
        })
      }
    })

    //获取所有团队
    getAllTeam().then(data =>{
      if(data.status === '0'){
        dataSource = data.data
        this.setState({
          dataSource:dataSource,
          copyDataSource:dataSource,
          ready2:true,
        })
      }


    })

    return dataSource

  }

  search = ()=>{
    const{seed,copyDataSource}  =this.state
    let newDataSource = []
    if(seed === null || seed === undefined || seed === ''){
      newDataSource = this.init()
    }else{
      newDataSource =  copyDataSource.filter(item => {
          return (item.teamName.includes(seed) || 
                  item.managerName.includes(seed))||  
                  item.creator.includes(seed)         
      })
    }

    this.setState({
      dataSource:newDataSource
  })

  }

  handelEdit = (record)=>{
    console.log(record)
    const values ={
      teamName:record.teamName,
      managerKey:record.managerKey === "" ? []:record.managerKey.split(","),
      teamMessage:record.teamMessage,
    }
    this.setState({
      isModalOpen:true,
      type:"uopdate",
    },()=>{
      this.formRef.current.setFieldsValue(values)
    })

  }




  handleOk = (type)=>{
    this.formRef.current.validateFields().then(
      ()=>{
        const managerName = []
        this.formRef.current.getFieldsValue().managerKey.map(Item =>{
            const label = this.state.managerOptions.filter(op => op.value === Item)[0].label
            managerName.push(label)
        })
        const bodys = {
           ...this.formRef.current.getFieldsValue(),
           type:type,
           managerName:managerName,
           creator:this.state.currentUser.userAccount
        }
        console.log("看下发送的信息")
        console.log(bodys)
        

        saveOrUpdateTeam(bodys).then(data =>{
          if(data.status == '0'){
            message.success("操作成功")
            this.init()
            this.setState({
              isModalOpen:false
            })
          }else{
            message.error(data.message)
          }
        })
        

      }
    )



  }

  handleCancel = ()=>{
    this.setState({
      isModalOpen:false,
    })

  }

  handelSelectChange = (obj)=>{
    this.setState({
      ...obj
    })

  }


  saveNewTeam = ()=>{
    this.setState({
      isModalOpen:true,
      type:"insert",
    },()=>{
      this.formRef.current.resetFields()
    })
  }




  render(){
    const { Search } = Input;
    const { TextArea } = Input;
    return(
        <div>
          {this.state.ready1&&this.state.ready2 ?
          <div>
          <h2 style={{fontWeight:"bolder"}}>团队管理</h2>
            <div style={{marginTop:"40px",display: 'flex'}}>
                <span>
                    <Button
                        type="primary"  
                        onClick={()=>{this.saveNewTeam()}}
                    >
                    新建团队
                    </Button>
                </span>
                <span style={{marginLeft:"auto"}}>
                    <Search
                        placeholder="输入账号、角色、状态查找"
                        onSearch={()=>this.search()}
                        onChange={(e)=>this.handelSelectChange({seed:e.target.value})}
                        style={{
                        width: 250,
                        marginLeft:"auto"
                    }}
                    ></Search>
                </span>
               
            </div>
          <div>
            <Table
              bordered
              dataSource={this.state.dataSource}
              columns = {this.state.colums}
            >
            </Table>


            <Modal
            title={this.state.type === 'insert'? "新建团队":"更新团队"} open={this.state.isModalOpen} onOk={()=>this.handleOk(this.state.type)} onCancel={()=>{this.handleCancel()}}>
                <div>
                    <Form 
                        ref={this.formRef}>
                        <Form.Item
                            label="团队名称："
                            name="teamName"
                            rules={[
                                {
                                required: true,
                                message: '请输入团队名称',
                                },
                            ]}
                        >
                               <Input style={{width:"80%"}}/>
                            
                        </Form.Item>


                        <Form.Item
                            label="管理员："
                            name="managerKey"
                            rules={[
                                {
                                required: false,
                                message: '请选择管理员',
                                },
                            ]}
                        >
                                <Select
                                    style={{width:"80%"}}
                                    mode="multiple"
                                    // defaultValue={this.state.manageTeam}
                                    allowClear
                                    options={this.state.managerOptions}
                                    // onChange={(value,options) => this.handelSelectChange({manageTeam:value,manageTeamName:options.map(opt => opt.label)})}
                                ></Select>
                            
                        </Form.Item>


                        <Form.Item
                           label="团队简介："
                           name="teamMessage"
                        >

                          <TextArea
                            rows={4} placeholder="填入团队简介" maxLength={200}
                          >
                          </TextArea>
                        </Form.Item>
                    </Form>
                </div>
             </Modal>

          </div>
          </div>:null}

        </div>
    )
  }

}
export default function(props) {
  const { initialState } = useModel('@@initialState');
  return <Team currentUser={initialState.currentUser} {...props} />;
}

