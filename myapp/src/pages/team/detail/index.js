import React, { Component } from 'react';
import{getAllUserByTeamKey} from '../service/api'
import { Tabs,Table,Tag,Input} from 'antd';
require("./index.css") 



class  TeamDetail extends Component {



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
      ],
      teamMessage:[],
      userList:[],
      userCount:0,
      ready:false,
      searchValue:null,
    }
 

    componentDidMount() {
    const searchParams = new URLSearchParams(window.location.search);
    const teamMessage = JSON.parse(searchParams.get("message"))
    console.log(teamMessage)
    this.setState({
      teamMessage: teamMessage,
    },()=>{
      this.init()
    })
  }
  componentWillUnmount() {

  }

  init = ()=>{
    const bodys = {
      teamKey:this.state.teamMessage.teamKey
    }
    let userList = []
    getAllUserByTeamKey(bodys).then(data =>{
      if(data.status === '0'){
        userList = data.data
        this.setState({
           userList:data.data,
           userCount:data.data.length,
           copyUserList:data.data,
           ready:true
        })
      }
    })
    return userList
  }

  search = ()=>{
    const{searchValue,copyUserList} = this.state
    let newUserList = []
    //如果为空
    if(searchValue === null || searchValue === undefined || searchValue === ''){
      console.log("进入searchValue === null ")
        newUserList = this.init()
        console.log(newUserList)
    }else{
      newUserList =  copyUserList.filter(item => {
            return (item.manageTeamName.includes(searchValue) || 
                    item.userAccount.includes(searchValue))||  
                    item.rolesName.includes(searchValue) || 
                    item.name.includes(searchValue)||
                    item.state.includes("禁用".includes(searchValue)? "0" : "正常".includes(searchValue)? "1":"999")
        })
    }

    this.setState({
        userList:newUserList
    })
  }

  handelSearchChange = (value)=>{
    this.setState({
      searchValue:value
    })
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

  render(){
    const { Search } = Input;
    return(
      <div>
        {this.state.ready?
        <div style={{ flex: 1 }}>
          <h2 style={{ fontWeight: 'bolder' }}>团队详情</h2>
          <div style={{ height: '50px', width: '100%', backgroundColor: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginLeft: '20px' }}>团队ID：{this.state.teamMessage.id}</span>
            <span style={{ marginLeft: '20px' }}>团队名称：{this.state.teamMessage.teamName}</span>
          </div>
          <div style={{marginTop:"40px", backgroundColor:"white",height:"600px",display:'flex',borderRadius: '10px'}}>
            <div style={{marginTop:"20px",marginLeft:"20px" ,backgroundColor:"white",width: "100%"}}>
            <Tabs defaultActiveKey="1"  type="card"
            items={[
              {
                key: '1',
                label: '团队信息',
                children: <div>
                            <div style={{marginLeft:'70px'}}>
                              
                              <div className='messageItem'>
                                团队ID：{this.state.teamMessage.id}
                              </div>
                              <br></br>
                              <div className='messageItem'>
                                团队名称：{this.state.teamMessage.teamName}
                              </div>
                              <br></br>
                              <div className='messageItem'>
                                团队管理员：{this.state.teamMessage.managerName}
                              </div>
                              <br></br>
                              <div className='messageItem'>
                                创建人：{this.state.teamMessage.creator}
                              </div>
                              <br></br>
                              <div className='messageItem'>
                                团队人数：{this.state.userCount}
                              </div>
                              <br></br>
                              <div className='messageItem'>
                                团队介绍：{this.state.teamMessage.teamMessage}
                              </div>
                              <br></br>

                            
                            </div>
                          </div>
              },
              {
                key: '2',
                label: '团队人员',
                children: <div>
                             <div style={{display:"flex",marginBottom:"10px"}}>
                              <div style={{marginLeft:'auto'}}>
                                <Search
                                    placeholder="输入账号、角色、状态查找"
                                    onSearch={()=>this.search()}
                                    onChange={(e)=>this.handelSearchChange(e.target.value)}
                                    style={{
                                    width: 250,
                                    marginLeft:"auto"
                                }}
                                ></Search>
                                </div>
                            </div>
                             <Table
                              bordered
                              dataSource={this.state.userList}
                              columns={this.state.colums}
                              pagination={{
                                pageSize: 5, 
                              }}
                             >
                             </Table>

                          </div>
              },
            ]}/>
            </div>
          </div>
          </div>:null}
    </div>
    )
  }

}
export default TeamDetail;
