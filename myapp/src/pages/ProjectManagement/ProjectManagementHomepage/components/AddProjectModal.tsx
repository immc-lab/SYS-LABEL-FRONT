import { Button, DatePicker, Form, Input, Modal, Radio, Select, Space, message } from 'antd';
import React, { useState } from 'react';

const AddProjectModal = () =>{

    //处理对话框弹出
    const [open, setOpen] = useState(false);
    //确定按钮的动画显示
    const [confirmLoading, setConfirmLoading] = useState(false);
    //处理表单
    const [form] = Form.useForm();
    //处理起止时间选择器
    const { RangePicker } = DatePicker;
    //处理下拉框
    const { Option } = Select;
    //全局提示信息
    const [messageApi, contextHolder] = message.useMessage();
    //接收目标数值输入框的值
    const [targetValue, setTargetValue] = useState('');

    //处理新建项目按钮弹出框
    const showAddProjectModal = () => {
      form.resetFields();
      setOpen(true);
    };
    //点击立即创建回调
    // const handleAddProjectOk = () => {
    //   //获取每个表单项的提交信息，
    //   const errors = form.getFieldsError();
    //   for (const error of errors) {
    //     // 在这里处理每个错误对象
    //     console.log(error);
    //   }
    //       setConfirmLoading(true);
    //       setTimeout(() => {
    //         setOpen(false);
    //         setConfirmLoading(false);
    //       }, 2000);
    //       console.log('我是表单的值',form.getFieldValue('password'),form.getFieldsValue(),  form.getFieldsError());
    // };

    //提交成功后进行处理
    const onAddProjectFinish = (values: any) => {
      console.log('Received values of form: ', values);
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
        messageApi.success('创建成功');
      }, 1500);
    };
    //提交失败后进行处理
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    //点击取消创建回调
    const handleAddProjectCancel = () => {
      console.log('Clicked cancel button');
      form.resetFields();
      setOpen(false);
    };
  
    //计算目标数值换算成秒
    const handleTargetValue = (e) => {
       let totalSeconds = parseFloat(e.target.value)*3600
       setTargetValue(totalSeconds.toString());
    }



  return (
    <>
    {contextHolder}
    <Button type='primary' style={{marginBottom:'10px'}} onClick={showAddProjectModal}>新建项目</Button>
     <Modal
        title="新建项目"
        open={open}
        // onOk={handleAddProjectOk}
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
            onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="projectName"
          label="项目名称"
          rules={[
            {
              required: true,
              message: '请输入项目名称',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="projectID"
          label="项目编号"
          rules={[
            {
              required: true,
              message: '请输入项目编号',
            },
          ]}
          // hasFeedback
        >
            <Input />
        </Form.Item>

        <Form.Item
          name="startingAndEndingTime"
          label="起止时间"
          rules={[
            {
              required: true,
              message: '请选择项目起止时间'
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
              message: '请选择项目类型',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="formal">正式</Radio>
            <Radio value="testing">测试</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="projectArea"
          label="项目地区"
          rules={[{ required: true, message: '请选择项目地区' }]}
        >
          <Select placeholder="请选择项目地区">
            <Option value="beiJing">北京</Option>
            <Option value="changChun">长春</Option>
            <Option value="neiMengGu">内蒙古</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="participatingAssistant"
          label="参与助理"
          style={{marginLeft: '10px'}}
        >
          <Select placeholder="请选择参与助理">
            <Option value="admin1">admin1</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="measurementIndicators"
          label="衡量指标"
          rules={[{ required: true, message: '衡量指标尚未填写' }]}
        >
          <Select placeholder="请填写衡量指标">
            <Option value="totalAudioDuration">音频总时长</Option>
            <Option value="effectiveTotalAudioDuration">有效音频总时长</Option>
            <Option value="DrawParagraphDuration">画段时长</Option>
            <Option value="effectiveDrawParagraphDuration">有效画段总时长</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="targetValue"
          label="目标数值"
          rules={[{ required: true, message: '目标数值尚未填写' }]}
        >
          <Input placeholder='请填写目标数值' value={targetValue} onChange={handleTargetValue} addonAfter={`小时 =${targetValue} 秒`}/>
        </Form.Item>
        <Space style={{marginLeft:'370px', marginTop:'10px'}}>
            <Form.Item style={{marginRight:'20px'}}>
                <Button type="primary" danger onClick={handleAddProjectCancel}>
                  取消创建
                </Button>
            </Form.Item>
            <Form.Item style={{marginRight:'40px'}}>
                <Button type="primary" htmlType="submit" loading={confirmLoading}>
                  立即创建
                </Button>
            </Form.Item>
        </Space>
      </Form>
    </Modal>
    </>
  );
}

export default AddProjectModal;
