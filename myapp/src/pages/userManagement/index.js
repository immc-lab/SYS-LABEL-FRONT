import React, { Component } from 'react';
import {Table,Button,Input, message,Modal,Spin,Tag,Search,Checkbox, Form,Select} from 'antd'
import {saveNewUser,getAllUser,disableAccountByKey} from './service/api'
import { Item } from 'rc-menu';
require("./index.css") 
var CryptoJS = require('crypto-js');




class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
      }

    state = {
        colums:[
            {
                title: '用户ID',
                dataIndex: 'id',
                key:"id",
                align: 'center',
    
            },

            {
                title: '姓名',
                dataIndex: 'name',
                key:"name",
                align: 'center',
               
    
            },
            {
                title: '账号',
                dataIndex: 'userAccount',
                key:"userAccount",
                align: 'center',
               
    
            },
            {
                title: '角色',
                dataIndex: 'rolesName',
                key:"rolesName",
                align: 'center',
                render:(text,record)=>{
                    let rolesNameList = []
                    if(record.rolesName !== null && record.rolesName !== undefined &&record.rolesName !== ''){
                        rolesNameList = record.rolesName.split(",")
                    }
                    return(
                        <div>
                            
                            {rolesNameList.map(item =>{
                                return(
                                    <Tag color= {this.getColor(item)}>{item}</Tag>
                                )
                            })}
                        </div>
                    )

                }
            },
            {
                title: '加入团队',
                dataIndex: 'belongTeamName',
                key:"belongTeamName",
                align: 'center',
                render:(text,record)=>{
                    let belongTeamNameList = []
                    if(record.belongTeamName !== null && record.belongTeamName !== undefined &&record.belongTeamName !== ''){
                        belongTeamNameList = record.belongTeamName.split(",")
                    }
                    return(
                        <div>
                            
                            {belongTeamNameList.map(item =>{
                                return(
                                    <Tag color= 'blue'>{item}</Tag>
                                )
                            })}
                        </div>
                    )

                }
            },

            {
                title: '状态',
                dataIndex: 'state',
                key:"state",
                align: 'center',
                render:(text,record)=>{
                    return(
                        <div>
                            <Tag
                                color={record.state === '1'? "green":"red"}
                            >
                            {record.state === '1'? "正常":"禁用"}
                            </Tag>  
                        </div>
                    )
                }

            },

            {
                title: '创建时间',
                dataIndex: 'createTime',
                key:"createTime",
                align: 'center',
            },
            {
                title: '最近一次登录',
                dataIndex: 'lastLoginTime',
                key:"lastLoginTime",
                align: 'center',
            },
            {
                title: '最近一次登录IP',
                dataIndex: 'ip',
                key:"ip",
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
                            {record.roles.includes("0")?null:
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
                                    danger
                                    type= 'text'
                                    onClick={()=>this.disableAccountByKey(record)}
                                >
                                {record.state === '1'? "禁用":"解除禁用"}                                  
                                </Button>
                            </span>
                            </div>}
                        </div>
                        
                    )
                }

            },
        ],

        checkboxOptions:[
            {label: '项目主管',value: '1'},
            {label: '团队管理员',value: '2'},
            {label: '质检员',value: '3'},
            {label: '标注员',value: '4'},
        ],

        dataSource :[{}],
        isModalOpen : false,
        checkedValues:[],
        tab:[],
        selsctOptions:[ {label: '团队1',value: '1'},
                        {label: '团队2',value: '2'},
                        {label: '团队3',value: '3'},
                        {label: '团队4',value: '4'},],
        belongTeam:[],
        manageTeam:[],
        belongTeamName:[], 
        manageTeamName:[],
        rolesName:[],
        type:"insert",
        currentEditRowKey:null,
        ready:false,
        seed:null,
        copyDataSource:[]
    }
 
  componentDidMount() {

    // 获取所有用户信息
    this.init()
    // 获取团队信息
  }


  componentWillUnmount() {


  }

//初始化数据
  init = ()=>{
    let dataSource = []
    //获取所有用户信息
    getAllUser().then(data =>{
        if(data.status === '0'){
            dataSource = data.data
            this.setState({
                dataSource:dataSource,
                copyDataSource:dataSource,
                ready:true
            })
        }else{
            message.error("系统忙，请稍候重试！")
        }
    })

    //获取所有团队列表
   return dataSource

  }


  getColor = (name)=>{
    let color = 'blue'
    switch(name){
        case '标注员':
            color = "blue"
            break
        case '团队管理员':
            color = 'magenta'
            break
        case '项目主管':
            color = 'volcano'
            break
        case '质检员' :
            color = 'lime'
            break
        
        case '超级管理员':
            color = 'gold'
            break
    }
    return color
  }

  disableAccountByKey = (record)=>{
    const bodys = {
        state:record.state === '0'? '1':'0',
        userKey:record.userKey,
    }
    disableAccountByKey(bodys).then(data=>{

        if(data.status === '0'){
            message.success("操作成功！")
            this.init()
        }else{
            message.error(data.message)
        }
    }
        )


  }



  handelEdit = (record)=>{
    console.log("看下record")
    console.log(record)
   const values = {
    username:record.name,
    account:record.userAccount,
    roles:record.roles.split(",")
   }
    this.setState({
        isModalOpen:true,
        type:"update",
        manageTeam:record.manageTeamKey === "" ? []:record.belongTeamKey.split(","),
        belongTeam:record.belongTeamKey === "" ? []:record.belongTeamKey.split(","),
        checkedValues:record.roles.split(","),
        currentEditRowKey:record.userKey

    },()=>{
        this.formRef.current.setFieldsValue(values)
    })
  }

  handleOk = (type)=>{
    this.formRef.current.validateFields().then(
        ()=>{
            const rolesName = []
            this.state.checkedValues.map(Item =>{
                const label = this.state.checkboxOptions.filter(op => op.value === Item)[0].label
                rolesName.push(label)
            })
            console.log("看下表单！！")
            console.log(this.formRef.current.getFieldsValue())
            let password = this.formRef.current.getFieldsValue().password
            if(password === ''|| password === null || password === undefined){
                password = ""
            }else{
                password = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex)
            }

            const bodys = {
                ...this.formRef.current.getFieldsValue(),
                password: password,
                manageTeam:this.state.manageTeam,
                belongTeam:this.state.belongTeam,
                belongTeamName:this.state.belongTeamName,
                manageTeamName:this.state.manageTeamName,
                rolesName:rolesName,
                type:type,
                user_key:this.state.currentEditRowKey,
            }

            console.log("发送信息了！")
            console.log(bodys)
            saveNewUser(bodys).then(data =>{
                if (data.status === '0'){
                     this.setState({
                       isModalOpen:false
                    })
                    message.success(this.state.type === 'insert'?"创建成功":"更新成功")
                    this.init()
                }else{
                    message.error(data.message)
                }
            })
        }
        
    )
    //刷新数据
  }

  handleCancel = ()=>{
    this.setState({
        isModalOpen:false

    })

  }


  handelCheckboxChange = (checkedValues)=>{
    console.log(checkedValues)
    const {checkboxOptions}  = this.state
    // const rolesName = []
    // checkedValues.map(Item =>{
    //     const label = checkboxOptions.filter(op => op.value === Item)[0].label
    //     rolesName.push(label)
    // })
    console.log("看下rolesName")
    //如果没有选中标注员和团队管理员则清空列表
    if(!checkedValues.includes("2")){
        this.setState({
            manageTeam:[],
            manageTeamName:[],
        })
    }

    if(!checkedValues.includes("4")){
        this.setState({
            belongTeam:[],
            belongTeamName:[],
        })
    }

    this.setState({
        checkedValues:checkedValues,
        // rolesName:rolesName,
    })

  }


  handelSelectChange =(obj)=>{
    const {belongTeam,manageTeam,belongTeamName,manageTeamName} = this.state
    this.setState({
        ...obj
    })
    console.log("看下保存的名字")
    console.log(belongTeam)
    console.log(manageTeam)
  }

  saveNewUser = ()=>{
    this.setState({
        isModalOpen:true,
        manageTeam:[],
        belongTeam:[],
        checkedValues:[],
        type:"insert",
    },()=>{
        this.formRef.current.resetFields()
    })
  }

  search = ()=>{
    const{dataSource,seed,copyDataSource} = this.state
    console.log("看下搜索内容")
    console.log(seed)
    let newDataSource = []
    //如果为空
    if(seed === null || seed === undefined || seed === ''){
        newDataSource = this.init()
    }else{
        newDataSource =  copyDataSource.filter(item => {
            return (item.manageTeamName.includes(seed) || 
                    item.userAccount.includes(seed))||  
                    item.rolesName.includes(seed) || 
                    item.name.includes(seed)||
                    item.state.includes("禁用".includes(seed)? "0" : "正常".includes(seed)? "1":"999")
        })
    }

    this.setState({
        dataSource:newDataSource
    })
  }

  render(){
    const { Search } = Input;
   
    return(
        <div>
            {this.state.ready?
            <div>
            <h2 style={{fontWeight:"bolder"}}>用户管理</h2>
            <div style={{marginTop:"40px",display: 'flex'}}>
                <span>
                    <Button
                        type="primary"
                        onClick={()=>{this.saveNewUser()}}
                    >
                    新建用户
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
            <Table
                dataSource={this.state.dataSource}
                columns={this.state.colums}
                bordered
                
                >
            </Table>


            <Modal
            title={this.state.type === 'insert'? "新建用户":"更新用户"} open={this.state.isModalOpen} onOk={()=>this.handleOk(this.state.type)} onCancel={()=>{this.handleCancel()}}>
                <div>
                    <Form 
                        ref={this.formRef}>
                        <Form.Item
                            
                            label="姓名："
                            name="username"
                            rules={[
                                {
                                required: true,
                                message: '请输入姓名',
                                },
                            ]}
                        >
                               <Input style={{width:"80%"}}/>
                            
                        </Form.Item>


                        <Form.Item
                            label="账号："
                            name="account"
                            rules={[
                                {
                                required: true,
                                message: '请输入账号',
                                },
                            ]}
                        >
                               <Input style={{width:"80%"}}/>
                            
                        </Form.Item>



                        <Form.Item
                            label= {this.state.type === 'insert'? "密码":"重置密码"}
                            name="password"
                            rules={[
                                {
                                    required: this.state.type === 'insert'? true:false,
                                    message: '请输入密码'
                                },
                                {
                                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
                                    message: '密码必须为8-16位字母和数字组合',
                                },
                            ]}
                        >
                               <Input style={{width:"80%"}}/>
                        </Form.Item>


                        <Form.Item
                            label="角色："
                            name="roles"
                            rules={[
                                {
                                required: true,
                                message: '请选择角色',
                                },
                            ]}
                            >
                            <Checkbox.Group
                                value={this.state.checkedValues}
                                options={this.state.checkboxOptions}
                                onChange={(checkedValues)=>this.handelCheckboxChange(checkedValues)}
                            ></Checkbox.Group>
                        </Form.Item>

                    </Form>
                  

                   {this.state.checkedValues.includes("2")?
                    <div style={{width:"80%",marginLeft:"50px",marginTop:"10px"}}>
                        选择管理团队：
                        <Select
                        style={{width:"50%"}}
                        mode="multiple"
                        defaultValue={this.state.manageTeam}
                        allowClear
                        options={this.state.selsctOptions}
                        onChange={(value,options) => this.handelSelectChange({manageTeam:value,manageTeamName:options.map(opt => opt.label)})}
                        ></Select>
                    </div>:null
                   }

                   {this.state.checkedValues.includes("4")?
                    <div style={{width:"80%",marginLeft:"50px",marginTop:"10px"}}>
                       选择加入团队：
                        <Select
                        style={{width:"50%"}}
                        mode="multiple"
                        allowClear
                        defaultValue={this.state.belongTeam}
                        options={this.state.selsctOptions}
                        onChange={(value,options) => this.handelSelectChange({belongTeam:value,belongTeamName:options.map(opt => opt.label)})}
                        ></Select>
                    </div>:null
                   }
                </div>
             </Modal>

             </div> :null}
        </div>
    )
  }

}

export default UserManagement;
