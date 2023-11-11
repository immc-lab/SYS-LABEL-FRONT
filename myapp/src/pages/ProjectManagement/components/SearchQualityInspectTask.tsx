import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import styles from './SearchQualityInspectTask.css';

const  SearchQualityInspectTask: React.FC = ({handleSearch,afterReset}) => {

  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);

  //实现项目编号查询表格
  const [projectID, setProjectID] = useState('');
  //实现项目名称查询表格
  const [projectName, setProjectName] = useState('');
  //实现项目状态的切换
  const [projectState, setProjectState] = useState('');
  //实现项目状态的切换
  const [projectType, setProjectType] = useState('');
  //实现创建人查询表格
  const [creator, setCreator] = useState('');

  const handleSearchProjectName = (text: string) => {
    console.log('我是handleSearchProjectName里的',text)
    // handleSearch([text,inputValue]);
    handleSearch([text,projectID,projectState]);
    // setSearchText(text);
    setProjectName(text);

  };

  const handleSearchProjectID = (text: string) => {
    console.log('我是handleSearchProjectID里的',text)
    handleSearch([projectName,text,projectState]);
    // setInputValue(text);
    setProjectID(text);
  };

  const handleSearchCreator = (text: string) => {
    console.log('我是handleSearchCreator里的',text)
    handleSearch([projectName,projectID,text]);
    // setInputValue(text);
    setCreator(text);
  };

  // const onProjectStateChange = (value: string) => {
  //   let text='';
  //   switch (value) {   //这里value接收的就是<option></option>里的value属性值
  //     case 'all':
  //       text = '全部';
  //       break;
  //     case 'notStarted':
  //       text = '未启动';
  //       break;
  //     case 'inProgress':
  //       text = '进行中';
  //       break;
  //     case 'complete':
  //       text = '完成';
  //       break;
  //     case 'delay':
  //       text = '延期';
  //       break;
  //     case 'delayComplete':
  //       text = '延期完成';
  //       break;
  //     default: text='全部';
  // };
  //   console.log('我是项目状态切换的value',text)
  //   //如果为全部，则直接传空字符串，因为如果是全部，要显示在name和id指定的情况下所有state的全部数据
  //   if (text === '全部'){
  //     handleSearch([projectName,projectID,'']);
  //     //更新state
  //     setProjectState('');
  //   }else{
  //     handleSearch([projectName,projectID,text]);
  //     setProjectState(text)
  //   }
  // }

  // const onProjectTypeChange = (value: string) => {
  //   let text='';
  //   switch (value) {   //这里value接收的就是<option></option>里的value属性值
  //     case 'all':
  //       text = '全部';
  //       break;
  //     case 'inAnnotations':
  //       text = '标注中';
  //       break;
  //     case 'unclaimed':
  //       text = '未领取';
  //       break;
  //     case 'submitted':
  //       text = '已提交';
  //       break;
  //     default: text='全部';
  // };
  //   console.log('我是任务状态切换的value',text)
  //   //如果为全部，则直接传空字符串，因为如果是全部，要显示在name和id指定的情况下所有state的全部数据
  //   if (text === '全部'){
  //     handleSearch([audioName,audioID,'']);
  //     //更新state
  //     setTaskState('');
  //   }else{
  //     handleSearch([audioName,audioID,text]);
  //     setTaskState(text)
  //   }
  // }

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

  // //多选框<Option></Option>
  const { Option } = Select;
  // //处理分配人员对话框里的多选框
  // const options: SelectProps['options'] = [];
  // //构造数据
  // for (let i = 10; i < 36; i++) {
  //     options.push({
  //       label: i.toString(36) + i,
  //       value: i.toString(36) + i,
  //     });
  // }



  return (
    <>
  <Row wrap={false}>
    <Form
      // {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      layout='inline'
      className={styles.searchTaskLayout}
      form={form}
    >
    <Col flex="280px">
      <Form.Item name="projectName" label="项目名称" className={styles.descriptionFont} style={{marginBottom:'20px'}}>
        <Input placeholder='请输入项目名称'  value={projectName} onChange={(e) => handleSearchProjectName(e.target.value)}/>
      </Form.Item>
    </Col>
    <Col flex="280px">
      <Form.Item name="projectID" label="项目编号" className={styles.descriptionFont}>
        <Input placeholder='请输入编号' value={projectID} onChange={(e) => handleSearchProjectID(e.target.value)}/>
      </Form.Item>
    </Col>

    <Col flex="280px">
      <Form.Item name="creator" label="创建人" className={styles.descriptionFont}>
        <Input placeholder='请输入创建人' value={creator} onChange={(e) => handleSearchCreator(e.target.value)}/>
      </Form.Item>
    </Col>

    <Col flex="280px">
      <Form.Item name="state" label="项目状态" className={styles.descriptionFont}>
      <Select
          // onChange={onStateChange}
          allowClear
          defaultValue='全部'
        >
          <Option value="all">全部</Option>
          <Option value="notStarted">未启动</Option>
          <Option value="inProgress">进行中</Option>
          <Option value="complete">完成</Option>
          <Option value="delay">延期</Option>
          <Option value="delayComplete">延期完成</Option>
        </Select>

      </Form.Item>
    </Col>

    <Col flex="280px">
      <Form.Item name="projectType" label="项目类型" className={styles.descriptionFont}>
      <Select
          // onChange={onStateChange}
          allowClear
          defaultValue='全部'
        >
          <Option value="all">全部</Option>
          <Option value="formal">正式</Option>
          <Option value="testing">测试</Option>
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

export default SearchQualityInspectTask;
