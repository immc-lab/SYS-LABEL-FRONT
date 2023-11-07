import { Button, Col, Row, Modal, message } from "antd";
import React, { useState } from "react";
import styles from './OperateTableButton.css'
import type { RadioChangeEvent } from 'antd';
import { Input, Radio, Space } from 'antd';
import { Select} from 'antd';
import type { SelectProps } from 'antd';

const OperateTableButton = ({selectedRowKeys, handleClearSelection}) =>{
  //控制任务设置对话框的弹出
  const [isTaskSettingModalOpen, setIsTaskSettingModalOpen] = useState(false);
  //控制批量分配人员对话框的弹出
  const [isBatchAllocationModalOpen, setIsBatchAllocationModalOpen] = useState(false);
  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();
  //任务设置里的选项
  const [value, setValue] = useState(2);
  //得到分配人员按钮已选中的选项，目前利用这个实现了选完后再次打开对话框的时候能够清空上次所选的
  const [selectedAnnotatorOptions, setSelectedAnnotatorOptions] = useState([]);
  //得到分配人员按钮已选中的选项，目前利用这个实现了选完后再次打开对话框的时候能够清空上次所选的
  const [selectedQualityInspectorOptions, setSelectedQualityInspectorOptions] = useState([]);

  //处理任务设置按钮
  const showTaskSettingModal = () => {
    setIsTaskSettingModalOpen(true);
  };
  const handleTaskSettingOk = () => {
    setIsTaskSettingModalOpen(false);
    messageApi.open({
      type: 'success',
      content: '设置成功',
      className: 'custom-class',
      style: {
        marginTop: '10vh',
      },
    });
  };
  const handleTaskSettingCancel = () => {
    setIsTaskSettingModalOpen(false);
  };
  //处理任务设置里的选项
  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  //处理批量分配人员按钮
  const showBatchAllocationModal = () => {
    //接收过来的选中行的数组不为空
    if (selectedRowKeys !== undefined && selectedRowKeys.length > 0){
      setIsBatchAllocationModalOpen(true);
      console.log('我接收到的选中行的数组：',selectedRowKeys);
    }else{
      messageApi.open({
        type: 'warning',
        content: '请先选中任务',
      });
    }
  };
  const handleBatchAllocationOk = () => {
    setIsBatchAllocationModalOpen(false);
    messageApi.open({
      type: 'success',
      content: '设置成功',
      className: 'custom-class',
      style: {
        marginTop: '10vh',
      },
    });
    setSelectedAnnotatorOptions([]);
    setSelectedQualityInspectorOptions([]);
    //设置成功后清空已选的选项
    handleClearSelection();
  };
  const handleBatchAllocationCancel = () => {
    setIsBatchAllocationModalOpen(false);
    setSelectedAnnotatorOptions([]);
    setSelectedQualityInspectorOptions([]);
  };
  //处理分配人员按钮里的多选框选中后的数据
  const handleSelectedAnnotatorChange = (value: string[]) => {
      setSelectedAnnotatorOptions(value);
      console.log('我是选中的数据selectedAnnotatorOptions：',selectedAnnotatorOptions);//注意这里selectedOptions慢半拍，比value少一个
      console.log(`selected ${value}`);//这里输出的是value实时的
  };
  const handleSelectedQualityChange= (value: string[]) => {
      setSelectedQualityInspectorOptions(value);
      console.log('我是选中的数据selectedQualityOptions：',selectedQualityInspectorOptions);//注意这里selectedOptions慢半拍，比value少一个
      console.log(`selected ${value}`);//这里输出的value是实时的
  };

  //处理分配人员对话框里的多选框
  const options: SelectProps['options'] = [];
  //构造数据
  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }
  // 处理选中后的数据
  // const handleChange = (value: string[]) => {
  //   console.log(`selected ${value}`);
  // };


  return <>
     {contextHolder}{/*这个是全局提示，只需写这一个就够了，它会根据 messageApi.open()方法自动更新，写在任何位置都行*/}
     <Row wrap={false} className={styles.RowStyle}>
        <Col span={8}>
            <Button type="primary" onClick={showTaskSettingModal} size='middle' className={styles.TaskSettingButton}>
                任务设置
            </Button>
            <Modal title="任务设置" open={isTaskSettingModalOpen} onOk={handleTaskSettingOk} onCancel={handleTaskSettingCancel}>
              <div className={styles.rejectWaysFont}>驳回方式：</div>
              <div className={styles.rejectRadios}>
              <Radio.Group onChange={onChange} value={value} >

                <Space direction="vertical">
                  <Radio value={1}>驳回标注(不合格数据均需再次标注)</Radio>
                  <Radio value={2}>驳回质检(质检通过达到比例即可再次提交验收)</Radio>
                </Space>
              </Radio.Group>
              </div>
              </Modal>
            <Button type="primary" size='middle' onClick={showBatchAllocationModal}>
                批量分配人员
            </Button>
            <Modal title="分配人员" open={isBatchAllocationModalOpen} onOk={handleBatchAllocationOk} onCancel={handleBatchAllocationCancel}>
             <Space style={{ width: '100%',marginBottom:30,marginTop:20,marginLeft:30 }} direction="vertical">
                <div style={{marginBottom:5}}>标注员：</div>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '80%', marginBottom:15}}
                  placeholder="请选择标注员"
                  value={selectedAnnotatorOptions}
                  options={options}
                  onChange={handleSelectedAnnotatorChange}
                />
                <div style={{marginBottom:5}}>质检员：</div>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '80%' }}
                  placeholder="请选择质检员"
                  onChange={handleSelectedQualityChange}
                  options={options}
                  value={selectedQualityInspectorOptions}
                />
              </Space>
            </Modal>
        </Col>
        <Col span={8} offset={13}>
            <Button onClick={() => handleButtonClick(record)} size='middle' type="primary">
                导出人效统计信息
            </Button>
        </Col>
     </Row>
  </>
}


export default OperateTableButton;



