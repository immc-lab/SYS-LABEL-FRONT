import { Button, Col, Row, Modal, message } from "antd";
import React, { useState } from "react";
import styles from './OperateDetailTableButton.css'
import { history} from '@umijs/max';

const OperateDetailTableButton = () =>{
  //控制批量通过对话框的弹出
  const [isBatchPassModalOpen, setIsBatchPassModalOpen] = useState(false);
  //控制批量不通过对话框的弹出
  const [isBatchNoPassModalOpen, setIsBatchNoPassModalOpen] = useState(false);
  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();
  //得到分配人员按钮已选中的选项，目前利用这个实现了选完后再次打开对话框的时候能够清空上次所选的
  // const [selectedAnnotatorOptions, setSelectedAnnotatorOptions] = useState([]);
  //得到分配人员按钮已选中的选项，目前利用这个实现了选完后再次打开对话框的时候能够清空上次所选的
  // const [selectedQualityInspectorOptions, setSelectedQualityInspectorOptions] = useState([]);
  //接收表格中被选中的行的id值
  const [selectedRowIDs, setSelectedRowIDs] = useState([]);

  //处理任务设置按钮
  const showBatchPassModal = () => {
    //接收过来的选中行的数组不为空
    if (selectedRowKeys !== undefined && selectedRowKeys.length > 0){
      setIsBatchPassModalOpen(true);
      //每次打开对话框必须要重新获取，为保证selectedRowIDs.length正常，否则出现逻辑错误
      const selectedIDArray = selectedRowKeys.map(item => item.audioID);
      setSelectedRowIDs(selectedIDArray);
      console.log('我接收到的选中行的数组：',selectedRowKeys);
    }else{
      messageApi.open({
        type: 'warning',
        content: '请先选中要处理的音频',
      });
    }
  };
  const handleBatchPassOk = () => {
    setIsBatchPassModalOpen(false);
    messageApi.open({
      type: 'success',
      content: '音频已通过',
      className: 'custom-class',
      style: {
        marginTop: '10vh',
      },
    });
   //清空已选的ID
   setSelectedRowIDs([]);
   //清空已选项样式
   handleClearSelection();
  };
  const handleBatchPassCancel = () => {
    setIsBatchPassModalOpen(false);
  };
  // //处理任务设置里的选项
  // const onChange = (e: RadioChangeEvent) => {
  //   console.log('radio checked', e.target.value);
  //   setValue(e.target.value);
  // };

  //处理批量不通过按钮
  const showBatchNoPassModal = () => {
    //接收过来的选中行的数组不为空
    if (selectedRowKeys !== undefined && selectedRowKeys.length > 0){
      setIsBatchNoPassModalOpen(true);
      //每次打开对话框必须要重新获取，为保证selectedRowIDs.length正常，否则出现逻辑错误
      const selectedIDArray = selectedRowKeys.map(item => item.audioID);
      setSelectedRowIDs(selectedIDArray);
      console.log('我接收到的选中行的数组：',selectedRowKeys);
    }else{
      messageApi.open({
        type: 'warning',
        content: '请先选中要处理的音频',
      });
    }
  };
  const handleBatchNoPassOk = () => {
    setIsBatchNoPassModalOpen(false);
    messageApi.open({
      type: 'error',
      content: '已拒绝音频通过',
      className: 'custom-class',
      style: {
        marginTop: '10vh',
      },
    });
    //清空已选的ID
    setSelectedRowIDs([]);
    //清空已选项样式
    handleClearSelection();
  };
  const handleBatchNoPassCancel = () => {
    setIsBatchNoPassModalOpen(false);
  };
  // //处理分配人员按钮里的多选框选中后的数据
  // const handleSelectedAnnotatorChange = (value: string[]) => {
  //     setSelectedAnnotatorOptions(value);
  //     console.log('我是选中的数据selectedAnnotatorOptions：',selectedAnnotatorOptions);//注意这里selectedOptions慢半拍，比value少一个
  //     console.log(`selected ${value}`);//这里输出的是value实时的
  // };
  // const handleSelectedQualityChange= (value: string[]) => {
  //     setSelectedQualityInspectorOptions(value);
  //     console.log('我是选中的数据selectedQualityOptions：',selectedQualityInspectorOptions);//注意这里selectedOptions慢半拍，比value少一个
  //     console.log(`selected ${value}`);//这里输出的value是实时的
  // };

  //处理分配人员对话框里的多选框
  // const options: SelectProps['options'] = [];
  // //构造数据
  // for (let i = 10; i < 36; i++) {
  //   options.push({
  //     label: i.toString(36) + i,
  //     value: i.toString(36) + i,
  //   });
  // }
  // 处理选中后的数据
  // const handleChange = (value: string[]) => {
  //   console.log(`selected ${value}`);
  // };

  //跳转到批量操作记录
  const goBatchOperationRecords = () => {
     history.push('./batchOperationRecords');
  }


  return <>
     {contextHolder}{/*这个是全局提示，只需写这一个就够了，它会根据 messageApi.open()方法自动更新，写在任何位置都行*/}
     <Row wrap={false} className={styles.RowStyle} style={{overflow: 'hidden'}}>
        <Col span={8}>
            <Button type="primary" onClick={showBatchPassModal} size='middle' className={styles.batchPassButton}>
                批量通过
            </Button>
            <Modal title="批量通过" open={isBatchPassModalOpen} onOk={handleBatchPassOk} onCancel={handleBatchPassCancel}>
              <div className={styles.passTaskFont}>
                 确定通过这{selectedRowIDs.length}项音频吗？
              </div>
            </Modal>

            <Button type="primary" danger size='middle' onClick={showBatchNoPassModal}>
                批量不通过
            </Button>
            <Modal title="批量不通过" open={isBatchNoPassModalOpen} onOk={handleBatchNoPassOk} onCancel={handleBatchNoPassCancel}>
              <div className={styles.passTaskFont}>
                 确定拒绝通过这{selectedRowIDs.length}项音频吗？
              </div>
            </Modal>
        </Col>
        <Col span={8} style={{marginLeft:'710px'}}>
            <Button onClick={goBatchOperationRecords} size='middle' type="primary">
                批量操作记录
            </Button>
        </Col>
     </Row>
  </>
}


export default OperateDetailTableButton;



