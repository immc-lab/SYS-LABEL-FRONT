import React, { createContext, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import styles from './SearchTask.css'
import TeamTaskList from './TeamTaskList';


const SearchTaskDetail: React.FC = ({handleSearch,afterReset}) => {

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


  //实现根据音频名字查询表哥哥
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
    >
    <Col flex="300px" style={{marginRight:80,marginBottom:15}}>
      <Form.Item name="AudioName" label="音频名称" className={styles.descriptionFont}>
        <Input placeholder='请输入音频名称' value={audioName} onChange={(e) => handleSearchAudioName(e.target.value)}/>
      </Form.Item>
    </Col>
    <Col flex="300px" style={{marginRight:80,marginBottom:15}}>
      <Form.Item name="AudioID" label="音频编号" className={styles.descriptionFont}>
        <Input placeholder='请输入音频编号'  value={audioID} onChange={(e) => handleSearchAudioID(e.target.value)}/>
      </Form.Item>
    </Col>
    <Col flex="300px" style={{marginRight:80,marginBottom:15}}>
      <Form.Item name="AudioState" label="音频状态" className={styles.descriptionFont}>
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
    <Col flex="300px" style={{marginRight:80,marginBottom:15}}>
      <Form.Item name="AudioState" label="标注员" className={styles.descriptionFont}>
        <Select
          onChange={onAnnotatorChange}
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
    <Col flex="300px" style={{marginRight:72,marginBottom:15}}>
      <Form.Item name="AudioState" label="质检员" className={styles.descriptionFont}>
        <Select
          onChange={onQualityInspectorChange}
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

export default SearchTaskDetail;
