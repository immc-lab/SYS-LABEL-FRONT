import {Button, Card, Pagination, Space, Table, message, Modal, Form, Input, DatePicker, Select, Radio, Row, Col} from 'antd';
import type { ColumnsType } from 'antd/es/table';
// import type { TableRowSelection } from 'antd/es/table/interface';
import React from 'react';
import { useState } from 'react';
import SearchProjectTask from './components/SearchProjectTask';
import styles from './components/SearchProjectTask.css';
import { PageContainer } from '@ant-design/pro-layout';
import { history} from '@umijs/max';
import AddProjectModal from './components/AddProjectModal';


interface DataType {
  key: number;
  projectName: string;
  projectID: number;
  projectProgress: string;
  startingAndEndingTime: string;
  projectType: string;
  state: string;
  allocatedTotalNumber: number;
  inspectionPassNumber: number;
  internalAcceptancePassNumber: number;
  externalAcceptancePassNumber: number;
  creator: string;
}


const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    projectName: `Edward King ${i}`,
    projectID: i,
    state:'延期',
    projectProgress: `${i}%`,
    startingAndEndingTime: '2023-10-06 10:00 ~ 2023-10.07 10:00',
    projectType: '测试',
    allocatedTotalNumber: 100,
    inspectionPassNumber: 0,
    internalAcceptancePassNumber: 10,
    externalAcceptancePassNumber: 10,
    creator: 'admin1',
  });
}


//默认每页初始显示的条数
const EveryPageData = 10

const ProjectMangementHompage: React.FC = () => {

  //初始显示数据,10是初始显示的每页的条数，默认为EveryPageData
  const initalDataIndex = Math.min(EveryPageData, data.length);
  //currentData是显示到页面的实时数据，而curentSearchData是基于searchText实时搜素出来的总的数据，注意区分
  //也就是说curentSearchData是包含currentData的，curentSearchData存储总的查询出来的数据，currentData是从curentSearchData挑出来数据进行渲染
  const [currentData, setCurrentData] = React.useState(data.slice(0,initalDataIndex));
  const [currentSearchData, setCurrentSearchData] = React.useState(data.slice(0,data.length));
  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();
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
    const filtered = data.filter((item) =>
        // if (item.taskName !=='' && item.taskName !==''){
        //   item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
        // }
        // item.taskName.includes(searchText[0])
        item.projectName.includes(searchText[0]) && item.projectID.toString().includes(searchText[1]) && item.creator.includes(searchText[2])
        // item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
      );
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
  const goProjectTaskDetailPage = () => {
     history.push('./homePage/projectTaskList');
  }

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
        render: (text: string) => (
          <a onClick={ goProjectTaskDetailPage}>{text}</a>
        ),
        align: 'center',
      },
      {
        title: '项目编号',
        dataIndex: 'projectID',
        align: 'center',
      },
      {
        title: '进度',
        dataIndex: 'projectProgress',
        align: 'center',
      },
      {
        title: '项目起止时间',
        dataIndex: 'startingAndEndingTime',
        align: 'center',
        width: 160,
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
        title: '内部验收通过条数',
        dataIndex: 'internalAcceptancePassNumber',
        align: 'center',
      },
      {
        title: '外部验收通过条数',
        dataIndex: 'externalAcceptancePassNumber',
        align: 'center',
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 250,
        render: () => (
          <>
            <Space>
              <a onClick={goProjectTaskDetailPage}>新建任务</a>
              <a >编辑</a>
              <a >统计</a>
              <a >导出</a>
              <a style={{color:'red'}}>删除</a>
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
    {/* <Button type='primary' style={{marginBottom:'10px'}} onClick={showAddProjectModal}>新建项目</Button> */}
    {/* <Modal
        title="新建项目"
        open={open}
        onOk={handleAddProjectOk}
        confirmLoading={confirmLoading}
        onCancel={handleAddProjectCancel}
        width={700}
        footer={[]} //取消默认按钮
      >
        <br></br>
         <Form
            form={form}
            // name="register"
            onFinish={onAddProjectFinish}
            style={{ maxWidth: 600, marginLeft: '40px', marginRight: '40px'}}
            scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
            <Input />
        </Form.Item>

        <Form.Item
          name="range-time-picker"
          label="起止时间"
          rules={[
            {
              required: true,
            },
          ]}>
             <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>

        <Form.Item
        name="projectType"
        label="项目类型"
        rules={[
          {
            required: true,
          },
        ]}
        >
          <Radio.Group>
            <Radio value="a">item 1</Radio>
            <Radio value="b">item 2</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select gender!' }]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          style={{marginLeft: '10px'}}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select gender!' }]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select gender!' }]}
        >
          <Input defaultValue="Combine input and button"  addonAfter={'小时 = 秒'}/>
        </Form.Item>
              <Space style={{marginLeft:'370px', marginTop:'10px'}}>
                <Form.Item style={{marginRight:'20px'}}>
                    <Button type="primary" danger onClick={handleAddProjectCancel}>
                      取消创建
                    </Button>
                </Form.Item>
                <Form.Item style={{marginRight:'40px'}}>
                    <Button type="primary" htmlType="submit" onClick={handleAddProjectOk}>
                      立即创建
                    </Button>
                </Form.Item>
              </Space>

      </Form>
    </Modal> */}
    <AddProjectModal></AddProjectModal>
    <Table
      // rowSelection={rowSelection}
      columns={columns}
      dataSource={currentData}
      pagination={false} //是否显示表格自带分页器
      scroll={{  y: 400 }} //
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
