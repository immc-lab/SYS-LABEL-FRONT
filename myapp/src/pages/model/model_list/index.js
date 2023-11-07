import React, { Component } from 'react';
import {Table,Button,Input, message} from 'antd'
import {getAllModel}from '../service/api'
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
            key:"name"

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
                        <Button>查看</Button>
                        <Button style={{marginLeft:"10px"}}>编辑</Button>
                        <Button danger style={{marginLeft:"10px"}}>删除</Button>
                    </div>
                )

            }

        },
        
    ],
     dataSource :[
        
     ]
 }
 

  componentDidMount() {
    
  }


  componentWillUnmount() {
  }

  init = ()=>{
    getAllModel().then(data =>{
        if(data.status === '0'){
            this.state({
                dataSource:[...data.data]
            })
        }else{
            message.error(data.message)
        }
    })
  }

  addModel = ()=>{
    const type = "add"
    return(
        <Link
        to = {{
            pathname:"/model/detail",
            search :`?type = ${type}`
        }}>
        </Link>
    )
    
  }

  search = ()=>{

  }

  render(){
    const { Search } = Input;
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
                columns={this.state.columns}
                dataSource={this.state.dataSource}>
            </Table>

            <div>
                <Button type="primary">
                    <Link 
                        type="primary"
                        to = {{
                            pathname:"/model/detail",
                            search :`?type="add"`
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
