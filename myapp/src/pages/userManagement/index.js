import React, { Component } from 'react';
import {Table,Button,Input, message,Modal,Spin,Tag,Search,Checkbox, Form,Select} from 'antd'
import {saveNewUser,getAllUser} from './service/api'
import { Item } from 'rc-menu';
require("./index.css") 
var CryptoJS = require('crypto-js');




class UserManagement extends Component {
    formRef = React.createRef();

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
            },
            {
                title: '加入团队',
                dataIndex: 'belongTeamName',
                key:"belongTeamName",
                align: 'center',

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
                render:()=>{
                    return(
                        <div>
                            <span>
                                <Button
                                    type= 'text'
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
                                >
                                禁用                                   
                                </Button>
                            </span>
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
    }
 
    // var CryptoJS = require('crypto-js');

    // // 用户输入的密码
    // var password = '用户输入的密码';
    
    // // 对密码进行 SHA-256 加密
    // var hash = CryptoJS.SHA256(password);
    
    // // 将加密后的密码转换为字符串
    // var hashInString = hash.toString(CryptoJS.enc.Hex);
    
    // // 打印加密后的密码
    // console.log(hashInString);
  componentDidMount() {

    // 获取所有用户信息
    this.init()
    // 获取团队信息
  }


  componentWillUnmount() {


  }

//初始化数据
  init = ()=>{
    //获取所有用户信息
    getAllUser().then(data =>{
        if(data.status === '0'){
            console.log(data)
            this.setState({
                dataSource:data.data 
            })
        }else{
            message.error("系统忙，请稍候重试！")
        }
    })

    //获取所有团队列表


  }

  handleOk = (type)=>{
    this.formRef.current.validateFields().then(
        ()=>{
            const bodys = {
                ...this.formRef.current.getFieldsValue(),
                password: CryptoJS.SHA256(this.formRef.current.getFieldsValue().password).toString(CryptoJS.enc.Hex),
                manageTeam:this.state.manageTeam,
                belongTeam:this.state.belongTeam,
                belongTeamName:this.state.belongTeamName,
                manageTeamName:this.state.manageTeamName,
                rolesName:this.state.rolesName,
                type:type,
            }

            console.log("发送信息了！")
            console.log(bodys)
            saveNewUser(bodys).then(data =>{
                if (data.status === '0'){
                     this.setState({
                       isModalOpen:false
                    })
                    message.success('创建成功！')
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
    const rolesName = []
    checkedValues.map(Item =>{
        const label = checkboxOptions.filter(op => op.value === Item)[0].label
        rolesName.push(label)
    })
    this.setState({
        checkedValues:checkedValues,
        rolesName:rolesName,
    })

  }


  handelSelectChange =(obj)=>{
    const {belongTeam,mangeTeam,belongTeamName,manageTeamName} = this.state
    this.setState({
        ...obj
    })
    console.log("看下保存的名字")
    console.log(belongTeamName)
    console.log(manageTeamName)
  }

  saveNewUser = ()=>{
    this.setState({
        isModalOpen:true
    })
  }

  render(){
    const { Search } = Input;
   
    return(
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
                        placeholder="输入名称查找"
                        onSearch={()=>this.search()}
                        style={{
                        width: 200,
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
            title="新建用户" open={this.state.isModalOpen} onOk={()=>this.handleOk("insert")} onCancel={()=>{this.handleCancel()}}>
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
                            label="密码："
                            name="password"
                            rules={[
                                {
                                    required: true,
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
                        allowClear
                        options={this.state.selsctOptions}
                        onChange={(value,options) => this.handelSelectChange({manageTeam:value,manageTeamName:options.map(opt => opt.label)})}
                        ></Select>
                    </div>:null
                   }

                   {this.state.checkedValues.includes("4")?
                    <div style={{width:"80%",marginLeft:"50px",marginTop:"10px"}}>
                       选择标注员团队：
                        <Select
                        style={{width:"50%"}}
                        mode="multiple"
                        allowClear
                        options={this.state.selsctOptions}
                        onChange={(value,options) => this.handelSelectChange({belongTeam:value,belongTeamName:options.map(opt => opt.label)})}
                        ></Select>
                    </div>:null
                   }
                </div>
             </Modal>

        </div>
    )
  }

}

export default UserManagement;
