import React, { createContext, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import styles from './SearchProjectTaskDetailList.css'


const SearchProjectTaskDetailList: React.FC = ({handleSearch,afterReset}) => {

  const [form] = Form.useForm();
  const formRef = React.useRef<FormInstance>(null);

  //实现音频ID查询表格
  const [audioID, setAudioID] = useState('');
  //实现音频名称查询表格
  const [audioName, setAudioName] = useState('');
  //实现音频任务状态的切换
  const [audioState, setAudioState] = useState('');
  //实现音频标注员查询表格
  const [audioAnnotator, setAudioAnnotator] = useState('');
  //实现音频质检员查询表格
  const [audioQualityInspector, setAudioQualityInspector] = useState('');
  //实现音频验收员查询表格
  const [audioInspector, setAudioInspector] = useState('');

  //实现根据音频名字查询表格
  const handleSearchAudioName = (text) => {
    console.log('我是handleSearchAudioName里的',text)
    // handleSearch([text,inputValue]);
    handleSearch([text,audioID,audioState,audioAnnotator,audioQualityInspector]);
    // setSearchText(text);
    setAudioName(text);

  };
  //实现根据音频编号查询表格
  const handleSearchAudioID = (text) => {
    console.log('我是handleSearchAudioID里的',text)
    handleSearch([audioName,text,audioState,audioAnnotator,audioQualityInspector]);
    // setInputValue(text);
    setAudioID(text);
  };
  //处理音频状态发生变换
  const onAudioStateChange = (value: string) => {
    let text='';
    switch (value) {   //这里value接收的就是<option></option>里的value属性值
      case 'all':
        text = '全部';
        break;
      case 'unclaimed':
        text = '未领取';
        break;
      case 'inAnnotations':
        text = '标注中';
        break;
      case 'annotationCompleted':
        text = '标注完成';
        break;
      case 'inQualityInspection':
        text = '质检中';
        break;
      case 'qualityInspectionPassed':
        text = '质检通过';
        break;
      case 'qualityInspectionFailed':
        text = '质检不通过';
        break;
      case 'notInternallyAccepted':
        text = '未内部验收';
        break;
      case 'underInternalAcceptance':
        text = '内部验收中';
        break;
      case 'internalAcceptancePassed':
        text = '内部验收通过';
        break;
      case 'internalAcceptanceFailed':
        text = '内部验收不通过';
        break;
      case 'internalAcceptanceFailed_underMarking':
        text = '内部验收不通过-标注中';
        break;
      case 'internalAcceptanceFailed_annotationCompleted':
        text = '内部验收不通过-标注完成';
        break;
      case 'internalAcceptanceFailed_inQualityInspection':
        text = '内部验收不通过-质检中';
        break;
      case 'internalAcceptanceFailed_qualityInspectionPassed':
        text = '内部验收不通过-质检通过';
        break;
      case 'internalAcceptanceFailed_qualityInspectionFailed':
        text = '内部验收不通过-质检不通过';
        break;
      default: text='全部';
    };
    console.log('我是音频任务状态切换的value',text)
    //如果为全部，则直接传空字符串，因为如果是全部，要显示在name和id指定的情况下所有state的全部数据
    if (text === '全部'){
      handleSearch([audioName,audioID,'',audioAnnotator,audioQualityInspector]);
      //更新state
      setAudioState('');
    }else{
      handleSearch([audioName,audioID,text,audioAnnotator,audioQualityInspector]);
      setAudioState(text);
    }
 }
 //处理标注员发生变换
 const onAnnotatorChange = (value: string) => {

 };
 //处理质检员发生变换
 const onQualityInspectorChange = (value: string) => {

 };
 //处理音频验收员发生变换
 const onAudioInspectorChange = (value: string) => {

 };

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
  const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' };
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
    >

   <Col flex="300px" style={{marginRight:0,marginBottom:15}}>
      <Form.Item name="audioName" label="音频名称" className={styles.descriptionFont}>
        <Input placeholder='请输入音频名称' value={audioName} onChange={(e) => handleSearchAudioName(e.target.value)}/>
      </Form.Item>
    </Col>
    <Col flex="300px" style={{marginRight:0,marginBottom:15}}>
      <Form.Item name="audioID" label="音频编号" className={styles.descriptionFont}>
        <Input placeholder='请输入音频编号'  value={audioID} onChange={(e) => handleSearchAudioID(e.target.value)}/>
      </Form.Item>
    </Col>
    <Col flex="300px" style={{marginRight:0,marginBottom:15}}>
      <Form.Item name="audioState" label="音频状态" className={styles.descriptionFont}>
        <Select
          onChange={onAudioStateChange}
          allowClear
          defaultValue='全部'
        >
          <Option value="all">全部</Option>
          <Option value="unclaimed">未领取</Option>
          <Option value="inAnnotations">标注中</Option>
          <Option value="annotationCompleted">标注完成</Option>
          <Option value="inQualityInspection">质检中</Option>
          <Option value="qualityInspectionPassed">质检通过</Option>
          <Option value="qualityInspectionFailed">质检不通过</Option>
          <Option value="notInternallyAccepted">未内部验收</Option>
          <Option value="underInternalAcceptance">内部验收中</Option>
          <Option value="internalAcceptancePassed">内部验收通过</Option>
          <Option value="internalAcceptanceFailed">内部验收不通过</Option>
          <Option value="internalAcceptanceFailed_underMarking">内部验收不通过-标注中</Option>
          <Option value="internalAcceptanceFailed_annotationCompleted">内部验收不通过-标注完成</Option>
          <Option value="internalAcceptanceFailed_inQualityInspection">内部验收不通过-质检中</Option>
          <Option value="internalAcceptanceFailed_qualityInspectionPassed">内部验收不通过-质检通过</Option>
          <Option value="internalAcceptanceFailed_qualityInspectionFailed">内部验收不通过-质检不通过</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col flex="300px" style={{marginRight:0,marginBottom:15}}>
      <Form.Item name="annotator" label="标注员" className={styles.descriptionFont}>
        <Select
          onChange={onAnnotatorChange}
          allowClear
          defaultValue='全部'
        >
          <Option value="all">test1</Option>
          <Option value="creating">test2</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col flex="300px" style={{marginRight:0,marginBottom:15}}>
      <Form.Item name="qualityInspector" label="质检员" className={styles.descriptionFont}>
        <Select
          onChange={onQualityInspectorChange}
          allowClear
          defaultValue='全部'
        >
          <Option value="all">test1</Option>
          <Option value="creating">test2</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col flex="300px" style={{marginRight:72,marginBottom:15}}>
      <Form.Item name="audioInspector" label="验收员" className={styles.descriptionFont}>
        <Select
          onChange={onAudioInspectorChange}
          allowClear
          defaultValue='全部'
        >
          <Option value="all">test1</Option>
          <Option value="creating">test2</Option>
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


  </>
  );
};

export default SearchProjectTaskDetailList;
