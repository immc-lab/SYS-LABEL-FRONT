import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import styles from './SearchQualityInspectTask.css';

const  SearchQualityInspectTask: React.FC = ({handleSearch,afterReset}) => {

  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);

  //实现任务ID查询表格
  const [audioID, setAudioID] = useState('');
  //实现任务名称查询表格
  const [audioName, setAudioName] = useState('');
  //实现任务状态的切换
  const [taskState, setTaskState] = useState('');
  //实现标注员名称查询表格
  // const [annotator, setAnnotator] = useState('');

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

  const handleAnntatorChange = (value: string) =>{
    let text='';
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
    console.log('我是value',value)
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

//构造标注员多选框数据
const data = [
  { name: 'sss' },
  { name: 'aa' },
  { name: 'ss' },
  { name: 'sss' },
  { name: 'aa' },
  { name: 'ss' },
];

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
    <Col flex="250px">
      <Form.Item name="audioID" label="音频编号" className={styles.descriptionFont}>
        <Input placeholder='请输入任务ID'  value={audioID} onChange={(e) => handleSearchAudioID(e.target.value)}/>
      </Form.Item>
    </Col>
    <Col flex="250px">
      <Form.Item name="audioName" label="音频名称" className={styles.descriptionFont}>
        <Input placeholder='请输入任务名称' value={audioName} onChange={(e) => handleSearchAudioName(e.target.value)}/>
      </Form.Item>
    </Col>

    <Col flex="250px">
      <Form.Item name="TaskState" label="状态" className={styles.descriptionFont}>
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

    <Col flex="250px">
      <Form.Item name="anntator" label="标注员" className={styles.descriptionFont}>
        <Select onChange={handleAnntatorChange} allowClear placeholder="请选择标注员">
        <Option key='all' value='all'>全部</Option>
          {(data || []).map((item) => (
              <Option key={item.name} value={item.name}>
              {item.name}
              </Option>
          ))}
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
