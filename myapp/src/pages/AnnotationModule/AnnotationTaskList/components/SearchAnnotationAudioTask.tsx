import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import styles from './SearchAnnotationAudioTask.css'


const SearchAnnotationAudioTask: React.FC = ({handleSearch,afterReset}) => {

  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);

  //实现任务ID查询表格
  const [audioID, setAudioID] = useState('');
  //实现任务名称查询表格
  const [audioName, setAudioName] = useState('');
  //实现任务状态的切换
  const [taskState, setTaskState] = useState('');

  const handleSearchAudioName = (text: string) => {
    console.log('我是handleSearchTaskName里的',text)
    // handleSearch([text,inputValue]);
    handleSearch([text,audioID,taskState]);
    // setSearchText(text);
    setAudioName(text);

  };

  const handleSearchAudioID = (text: string) => {
    console.log('我是handleSearchTaskID里的',text)
    handleSearch([audioName,text,taskState]);
    // setInputValue(text);
    setAudioID(text);
  };

  const onStateChange = (value: string) => {
    let text='';
    switch (value) {   //这里value接收的就是<option></option>里的value属性值
      case 'all':
        text = '全部';
        break;
      case 'inAnnotations':
        text = '标注中';
        break;
      case 'unclaimed':
        text = '未领取';
        break;
      case 'submitted':
        text = '已提交';
        break;
      default: text='全部';
  };
  console.log('我是任务状态切换的value',text)
  //如果为全部，则直接传空字符串，因为如果是全部，要显示在name和id指定的情况下所有state的全部数据
  if (text === '全部'){
    handleSearch([audioName,audioID,'']);
    //更新state
    setTaskState('');
  }else{
    handleSearch([audioName,audioID,text]);
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
      <Form.Item name="audioID" label="音频编号" className={styles.descriptionFont}>
        <Input placeholder='请输入任务ID'  value={audioID} onChange={(e) => handleSearchAudioID(e.target.value)}/>
      </Form.Item>
    </Col>
    <Col flex="270px">
      <Form.Item name="audioName" label="音频名称" className={styles.descriptionFont}>
        <Input placeholder='请输入任务名称' value={audioName} onChange={(e) => handleSearchAudioName(e.target.value)}/>
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
          <Option value="inAnnotations">标注中</Option>
          <Option value="unclaimed">未领取</Option>
          <Option value="submitted">已分配</Option>
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

export default SearchAnnotationAudioTask;
