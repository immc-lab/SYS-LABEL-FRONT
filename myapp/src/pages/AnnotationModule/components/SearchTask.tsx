import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import styles from './SearchTask.css'


const SearchTask: React.FC = ({handleSearch,afterReset}) => {

  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);

  //实现任务ID查询表格
  const [taskID, setTaskID] = useState('');
  //实现任务名称查询表格
  const [taskName, setTaskName] = useState('');
  //实现任务状态的切换
  const [taskState, setTaskState] = useState('');

  const handleSearchTaskName = (text) => {
    console.log('我是handleSearchTaskName里的',text)
    // handleSearch([text,inputValue]);
    handleSearch([text,taskID,taskState]);
    // setSearchText(text);
    setTaskName(text);

  };

  const handleSearchTaskID = (text) => {
    console.log('我是handleSearchTaskID里的',text)
    handleSearch([taskName,text,taskState]);
    // setInputValue(text);
    setTaskID(text);
  };

  const onStateChange = (value: string) => {
    let text='';
    switch (value) {   //这里value接收的就是<option></option>里的value属性值
      case 'all':
        text = '全部';
        break;
      case 'creating':
        text = '创建中';
        break;
      case 'identifying':
        text = '识别中';
        break;
      case 'toBeAllocatedTeam':
        text = '待分配团队';
        break;
      case 'inProgress':
        text = '进行中';
        break;
      case 'underAcceptance':
        text = '验收中';
        break;
      case 'internalRejection':
        text = '内部驳回';
        break;
      case 'internalPassage':
        text = '内部通过';
        break;
      case 'externalPassage':
        text = '外部通过';
        break;
      case 'toBeAllocatedPerson':
        text = '待分配人员';
        break;
      default: text='全部';
  };
  console.log('我是任务状态切换的value',text)
  //如果为全部，则直接传空字符串，因为如果是全部，要显示在name和id指定的情况下所有state的全部数据
  if (text === '全部'){
    handleSearch([taskName,taskID,'']);
    //更新state
    setTaskState('');
  }else{
    handleSearch([taskName,taskID,text]);
    setTaskState(text)
  }
  }
  const onFinish = (values: any) => {
    console.log(values);
  };

  //实现清空输入框
  const onReset = () => {
    console.log('我是重置',formRef.current?.getFieldsValue()); //可以获取重置之前的各个输入框的值
    formRef.current?.resetFields();
    //执行TeamTaskList传过来的函数，该函数作用是在清空后重新渲染页面
    afterReset();
  };

  //多选框<Option></Option>
  const { Option } = Select;

  return (
    <>
  <Row wrap={false}  className={styles.searchTask}>
    <Form
      // {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      layout='inline'
      className={styles.searchTaskLayout}
      form={form}
    >
    <Col flex="270px">
      <Form.Item name="TaskName" label="任务名称" className={styles.descriptionFont}>
        <Input placeholder='请输入任务名称' value={taskName} onChange={(e) => handleSearchTaskName(e.target.value)}/>
      </Form.Item>
    </Col>
    <Col flex="270px">
      <Form.Item name="TaskID" label="任务ID" className={styles.descriptionFont}>
        <Input placeholder='请输入任务ID'  value={taskID} onChange={(e) => handleSearchTaskID(e.target.value)}/>
      </Form.Item>
    </Col>
    <Col flex="270px">
      <Form.Item name="TaskState" label="任务状态" className={styles.descriptionFont}>
        <Select
          onChange={onStateChange}
          allowClear
          defaultValue='全部'
        >
          <Option value="all">全部</Option>
          <Option value="creating">创建中</Option>
          <Option value="identifying">识别中</Option>
          <Option value="toBeAllocatedTeam">待分配团队</Option>
          <Option value="inProgress">进行中</Option>
          <Option value="underAcceptance">验收中</Option>
          <Option value="internalRejection">内部驳回</Option>
          <Option value="internalPassage">内部通过</Option>
          <Option value="externalPassage">外部通过</Option>
          <Option value="toBeAllocatedPerson">待分配人员</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col flex="auto">

      <Form.Item>
       <Button type="primary" htmlType="submit" className={styles.searchButton} onClick={()=>{}}>
          查询
        </Button>
        <Button htmlType="button" onClick={onReset}>
          重置
        </Button>
      </Form.Item>
    </Col>
    </Form>
  </Row>

  {/* <TeamTaskList searchText={searchText}></TeamTaskList> */}
  </>
  );
};

export default SearchTask;
