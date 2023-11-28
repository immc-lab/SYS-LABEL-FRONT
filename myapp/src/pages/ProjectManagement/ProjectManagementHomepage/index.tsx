import {Button, Card, Pagination, Space, Table, message, Modal, Form, Input, DatePicker, Select, Radio, Row, Col} from 'antd';
import type { ColumnsType } from 'antd/es/table';
// import type { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect } from 'react';
import { useState } from 'react';
import SearchProjectTask from './components/SearchProjectTask';
import styles from './components/SearchProjectTask.css';
import { PageContainer } from '@ant-design/pro-layout';
import { history, useNavigate} from '@umijs/max';
import AddProjectModal from './components/AddProjectModal';
import { request } from '@umijs/max';
import { useModel } from '@umijs/max';
import moment from 'moment';
import EditProjectModal from './components/EditProjectModal';
import { render } from '@testing-library/react';




interface DataType {
  key: string;
  projectName: string;
  projectID: string;
  projectProgress: string;
  startTime: string;
  endTime: string;
  projectType: string;
  state: string;
  allocatedTotalNumber: number;
  inspectionPassNumber: number;
  internalAcceptancePassNumber: number;
  externalAcceptancePassNumber: number;
  creator: string;
}


// let data2: DataType[] = [];
// for (let i = 0; i < 46; i++) {
//   data2.push({
//     key: i.toString(),
//     projectName: `Edward King ${i}`,
//     projectID: i.toString(),
//     state:'延期',
//     projectProgress: `${i}%`,
//     startTime: '2023-10-06 10:00',
//     endTime: '2023-10.07 10:00',
//     projectType: '测试',
//     allocatedTotalNumber: 100,
//     inspectionPassNumber: 0,
//     internalAcceptancePassNumber: 10,
//     externalAcceptancePassNumber: 10,
//     creator: '司豆豆',
//   });
// }


//默认每页初始显示的条数
const EveryPageData = 10

const ProjectMangementHompage: React.FC = () => {
  //获取当前用户信息
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  console.log("我是当前登录用户：",currentUser);
    //currentUser: Object{access: "Admin", address: null, name: "司豆豆"...................}
  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();


  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await request('/api/project/core/getProjectList', {
          method: 'POST',
      })
      if (response.data !== null){
        setData(response.data);
        console.log("成功获取数据：", response.data);
      }
    };
    fetchData();
  }, []);


  // console.log("我是data!!!!",data)
  //初始显示数据,10是初始显示的每页的条数，默认为EveryPageData
  const initalDataIndex = Math.min(EveryPageData, data.length);

  //currentData是显示到页面的实时数据，而curentSearchData是基于searchText实时搜素出来的总的数据，注意区分
  //也就是说curentSearchData是包含currentData的，curentSearchData存储总的查询出来的数据，currentData是从curentSearchData挑出来数据进行渲染
  // console.log("data.slice(0,initalDataIndex)",data.slice(0,initalDataIndex))
  const [currentData, setCurrentData] = React.useState(data.slice(0,initalDataIndex));
  // console.log('我是crrentDat',currentData)
  const [currentSearchData, setCurrentSearchData] = React.useState(data.slice(0,data.length));

   // 监听data的变化，更新currentData
  useEffect(() => {
      // const initalDataIndex = Math.min(EveryPageData, data.length);
      setCurrentData(data.slice(0, initalDataIndex));
      setCurrentSearchData(data);
  }, [data]);



  // //处理对话框弹出
  // const [open, setOpen] = useState(false);
  // //确定按钮的动画显示
  // const [confirmLoading, setConfirmLoading] = useState(false);
  // //处理表单
  // const [form] = Form.useForm();
  // //处理起止时间选择器
  // const { RangePicker } = DatePicker;
  // //处理下拉框
  // const { Option } = Select;
  //接收传过来的searchText参数，只要输入框一变，就立马执行setCurrentData()
  // const [newsearchText, setNewsearchText] = useState('');
 // console.log('我是currentData的length',currentData.length)
 //得到项目列表

//实现编辑项目
//控制什么时候弹出对话框
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//获取要修改的这一行的id
const [editingId, setEditingId] = useState(null);
//获取即将要修改的这一行的原始数据
const [editingRecord, setEditingRecord] = useState(null);
//决定什么时候editingRecord清空，否则两次点击同一行不会弹出对话框（设置的是只要editingRecord发生变化就弹出对话框）
const [isClearEditingRecord, setIsClearEditingRecord] = useState(false);
//监听isClearEditingRecord，如果isClearEditingRecord变为true，则清空editingRecord
useEffect(()=>{
  if (isClearEditingRecord ===true) {
      setEditingRecord(null);
  }
},[isClearEditingRecord])
//点击编辑按钮后，将要编辑的数据id和这一行的值记录下来
const handleEdit = (record) => {
  if (record !==null) {
    setEditingId(record.projectID);
    setEditingRecord(record);
    console.log("编辑这一行：",record);
    //打开编辑对话框的时候不需要清空
    setIsClearEditingRecord(false);
    setIsEditModalOpen(true);
  }else{
    messageApi.error("数据有误！！！");
  }

};
//handleUpdate传给EditProjectModal组件，由EditProjectModal组件里的Form提交的values赋值给这里的updatedData
const handleUpdate = (updatedData) => {
  // 向后端发送更新请求
  const startTime = moment(updatedData.startingAndEndingTime[0]).format('YYYY-MM-DD HH:mm:ss').toString();
  const endTime = moment(updatedData.startingAndEndingTime[1]).format('YYYY-MM-DD HH:mm:ss').toString();
  console.log(startTime,endTime); // 输出：2023-11-14 19:30:49
  const reqJsonObject = {
      "projectName": updatedData.projectName,
      "startTime": startTime,
      "endTime": endTime,
      "projectType": updatedData.projectType,
      "projectArea": updatedData.projectArea,
  }
  console.log("修改后的值：",JSON.stringify(reqJsonObject));
  request('/api/project/core/editProjectData', {
    method: 'POST',
    data: reqJsonObject,
  }).then(response => {
    if (response.status ==='0') {
      messageApi.success('修改成功');
    }
    // return response.json();
  }).catch(error => {
    // 在这里处理错误情况
    messageApi.error("出错了");
    console.error('There was a problem with the fetch operation:', error);
  });
  // 更新表格数据
  const newData = data.map(item => {
    console.log("itemID,updatedDataID",item.Key,editingId);
    if (item.Key === editingId) {

      return updatedData;
    }
    return item;
  });
  setData(newData);
  //结束编辑状态
  setEditingId(null);
  setEditingRecord(null);
};


   //实现分页函数
  function handlePageChange(page,pageSize) {
     // 根据用户点击的页码更新当前页码，并重新渲染数据列表和 Pagination 组件
     // 用于存储当前页的数据

     // 计算当前页码对应的数据范围

     const startIndex = (page - 1) * pageSize;
    //  const endIndex = Math.min(startIndex + pageSize, currentData.length);
     const endIndex = Math.min(startIndex + pageSize, currentSearchData.length);
     let newSelectedRowKeys = [];
     // 从数据源中获取当前页的数据
    //  newSelectedRowKeys = currentData.slice(startIndex, endIndex);
    //  setCurrentData(newSelectedRowKeys)
    newSelectedRowKeys = currentSearchData.slice(startIndex,endIndex);
    setCurrentData(newSelectedRowKeys);
    console.log('我是handlePageChange里的page和pageSize和currentData和currentSearchData',page,pageSize,currentSearchData.length,currentSearchData.length)
  }

   //实现输入框查询
  const handleSearch = (searchText: string) => {
    console.log('wo')
    const filtered = data.filter((item) =>(
        // if (item.taskName !=='' && item.taskName !==''){
        //   item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
        // }
        // item.taskName.includes(searchText[0])
       //  console.log("我是creator:",item)
       // item.projectName.includes(searchText[0]) && item.Key.toString().includes(searchText[1]) && item.creator.includes(searchText[2])
       item.projectName.includes(searchText[0])
        // item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
    ));
      // item.taskName.includes(searchText) || item.age.toString().includes(text)

    console.log('我正在搜索',searchText);

    //必须在这里先算一下initalDataIndex
    const initalDataIndex = Math.min(EveryPageData, filtered.length);
    console.log('我是处理实时查询里的currentSearchData',currentSearchData,filtered);
    setCurrentData(filtered.slice(0,initalDataIndex)); //这一句是为了显示基于searchText实时搜索时显示到页面的那部分数据。
    // 用filtered，用currentSearchData好像没用
    setCurrentSearchData(filtered); //这句是为了更新基于当前的serachText所搜索到的总的数据，和上边的数据不一样，这个是总数据。
    console.log('我是处理实时查询里的currentSearchData',currentSearchData,filtered)
  };

  //实现点击重置按钮，就把原来的数据重新渲染回来
  const afterReset = () => {
    //为防止出错，先按这样的逻辑写，直接强行全部回归原始数据
    const initalDataIndex = Math.min(EveryPageData, data.length);
    setCurrentData(data.slice(0,initalDataIndex));
    setCurrentSearchData(data);
  }

  //跳转到项目任务列表页面
  const navigator = useNavigate();
  const goProjectTaskListPage = (key: string) => {
    console.log("项目首页里选中的项目编号为：",key)
    //  history.push('./homePage/projectTaskList');
    navigator('/projectManagement/homePage/projectTaskList',{
      state: {
        //需要传的参数
        key: key,
      }
   });
  }

  //处理删除项目任务
  const handleDeleteProject = (key: string) => {
    request('/api/project/core/deleteProjectData', {
      method: 'POST',
      data: {"key":key},
    }).then(response => {
      if (response.status ==='0') {
        messageApi.success('删除成功');
        // 更新表格数据
        const newData = data.map(item => {
          if (item.projectID === key) {
      return item;
          }

       });
  setData(newData);
        setData(response.data);
      }
      // return response.json();
    }).catch(error => {
      // 在这里处理错误情况
      messageApi.error("出错了！！！")
      console.error('There was a problem with the fetch operation:', error);
    });
  }

  //处理编辑项目
  // const handleEditProject = (key: string) => {
  //   request('/api/project/core/editProjectData', {
  //     method: 'POST',
  //     data: {"key":key},
  //   }).then(response => {
  //     if (response.status ==='0') {
  //       messageApi.success('修改成功');
  //       setData(response.data);
  //     }
  //     // return response.json();
  //   }).catch(error => {
  //     // 在这里处理错误情况
  //     messageApi.error("出错了！！！")
  //     console.error('There was a problem with the fetch operation:', error);
  //   });
  // }
  // 处理新建项目按钮弹出框
  // const showAddProjectModal = () => {
  //   setOpen(true);
  // };

  // const handleAddProjectOk = () => {
  //       setConfirmLoading(true);
  //       setTimeout(() => {
  //         setOpen(false);
  //         setConfirmLoading(false);
  //       }, 1000);
  //       console.log('我是表单的值',form.getFieldValue('password'),form.getFieldsValue());
  // };

  // const handleAddProjectCancel = () => {
  //   console.log('Clicked cancel button');
  //   form.resetFields();
  //   setOpen(false);
  // };

  // //新建项目表单处理
  // const onAddProjectFinish = (values: any) => {
  //   console.log('Received values of form: ', values);
  // };


  //移动到这个位置是因为要实现分配人员按钮功能的实现，如果在上边的话，分配人员的onClick就识别不了任何函数了
  const columns: ColumnsType<DataType> = [
      {
        title: '项目名称',
        dataIndex: 'projectName',
        render: (text: string,record) => (
          <a onClick={()=> goProjectTaskListPage(record.key)}>{text}</a>
        ),
        align: 'center',
      },
      {
        title: '进度',
        dataIndex: 'projectProgress',
        align: 'center',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        align: 'center',
        width: 140,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        align: 'center',
        width: 130,
      },
      {
        title: '状态',
        dataIndex: 'state',
        align: 'center',
      },
      {
        title: '项目类型',
        dataIndex: 'projectType',
        align: 'center',
      },
      {
        title: '分配总条数',
        dataIndex: 'allocatedTotalNumber',
        align: 'center',
      },
      {
        title: '质检通过条数',
        dataIndex: 'inspectionPassNumber',
        align: 'center',
      },

      {
        title: '创建人',
        dataIndex: 'creator',
        align: 'center',
        render: () => <span>{currentUser.name}</span>, // 设置默认值为当前用户
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 180,
        render: (_,record) => (
          <>
            <Space>
              {/* <a onClick={goProjectTaskDetailPage}>新建任务</a> */}
              <a onClick={() => handleEdit(record)}>编辑</a>
              <a >统计</a>
              <a >导出</a>
              <a style={{color:'red'}} onClick={() => handleDeleteProject(record.projectID)}>删除</a>
            </Space>
          </>
        ),
      },

  ];



return (
  <>
  <PageContainer>
  {contextHolder}{/*全局提示信息 */}
  <Card>
    <SearchProjectTask handleSearch={handleSearch} afterReset={afterReset}></SearchProjectTask>
    {/* {editingId === record.projectID ? (
                     isEditModalOpen && <EditProjectModal editingRecord={editingRecord} onUpdate={handleUpdate} />
               ) : (
               <a onClick={() => handleEdit(record)}>编辑</a>
    )} */}
    {isEditModalOpen && <EditProjectModal editingRecord={editingRecord} onUpdate={handleUpdate} setIsClearEditingRecord={setIsClearEditingRecord}/>}
    <AddProjectModal></AddProjectModal>
    <Table
      // rowSelection={rowSelection}
      columns={columns}
      dataSource={currentData} //不能是currentSearchData，因为dataSource是在当前页显示所有的数据，给它多少就显示多少，调整pageSize没有用
      pagination={false} //是否显示表格自带分页器
      scroll={{  y: 400 }} //滑动表格
    />

    <Pagination
      total={currentSearchData.length}
      showSizeChanger
      showQuickJumper
      showTotal={(total) => `共计 ${total} 条数据`}
      onChange={handlePageChange}
      defaultPageSize={EveryPageData}
      className={styles.pagination}
    />
  </Card>
  </PageContainer>
  </>
  )
};

export default ProjectMangementHompage;
