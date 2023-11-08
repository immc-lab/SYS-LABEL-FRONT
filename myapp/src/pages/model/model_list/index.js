import React, { Component } from 'react';
import {Table,Button,Input, message,Modal,Spin,Tag} from 'antd'
import {getAllModel,deleteModelByKey,applyByKey}from '../service/api'
import { Link, Route, Routes } from 'react-router-dom';

require("./index.css") 



class ModelList extends Component {



 state = {
     globaData:{},
     areaData:{},
     columns : [
        {
            title: '模板名称',
            dataIndex: 'modelName',
            width:"25%",
            key:"name",
            render:(text,record)=>{
                const key = record.key
                return(
                <div  style={{display: 'flex'}}>
                    <Link 
                    to = {{
                        pathname:"/model/detail",
                        search :`?type=update&key=${key}`
                    }}>
                        {record.modelName}
                    </Link>

                    {record.main === "1"?
                    <Tag
                    style={{marginLeft:"auto"}}
                    color="green">
                    使用中
                    </Tag> :null
                    }
                </div>

                )
            }

        },

        {
            title: '创建时间',
            dataIndex: 'createTime',
            key:"createTime",
            width:"25%",
  
        },

        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key:"name",
            width:"25%",
  
        },

        { 
            title: '操作',
            dataIndex: 'opt',
            key:"opt",
            width:"25%",
            render: (text,record) =>{
                return(
                    <div>
                        <Button type="primary" onClick={()=>{this.apply(record.key)}}>应用</Button>
                        <Button danger style={{marginLeft:"10px"}} onClick={()=>{this.handelDelete(record.key)}}>删除</Button>
                    </div>
                )
            }
        },
        
    ],
     dataSource :[
        
     ]
 }

  apply = (key)=>{
    applyByKey({key:key}).then(data =>{
        if(data.status === '0'){
            message.success("应用成功！")
            this.init()
        }else{
            message.error(data.message)
        }
    })


  }
 

  componentDidMount() {
    //初始化数据
    this.init()
    
  }


  componentWillUnmount() {
  }




  init = ()=>{
    getAllModel().then(data =>{
        if(data.status === '0'){
            this.setState({
                dataSource:[...data.data]
            })
        }else{
            message.error(data.message)
        }
    })
  }

  handelDelete = (key)=>{
    Modal.confirm({
        title: '确认删除',
        content: '确定要删除这个模板吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
            deleteModelByKey({key:key}).then(data =>{
                if(data.status === '0'){
                    message.success("删除成功！")
                    this.init()
                }else{
                    message.error(data.message)
                }
            })
        },
        onCancel:()=>{
            return
        }
  
      })

  }


  search = ()=>{

  }

  render(){
    const { Search } = Input;
    const add = "add"
    return(
        <div>
            <h2 style={{fontWeight:"bolder"}}>模板列表</h2>
            <div style={{marginTop:"40px"}}>
                <Search
                placeholder="输入名称查找"
                onSearch={()=>this.search()}
                style={{
                width: 200,
                marginLeft:"auto"
                }}
                
                ></Search>
             </div>
            <Table
                bordered
                columns={this.state.columns}
                dataSource={this.state.dataSource}>
            </Table>

            <div>
                <Button type="primary">
                    <Link 
                        type="primary"
                        to = {{
                            pathname:"/model/detail",
                            search :`?type=${add}`
                        }}
                    >
                    +新增模板
                    </Link>
                 </Button>
            </div>
        </div>
        
    )
  }

}
export default ModelList;
