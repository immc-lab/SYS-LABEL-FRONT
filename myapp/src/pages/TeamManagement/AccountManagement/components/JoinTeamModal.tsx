import React, { useRef, useState } from 'react';
import { Button, InputNumber, Modal, Space } from 'antd';
import { Form, Input, Select, message} from 'antd';

function addDays(toDate,days) {
  let newDate = new Date(toDate.getTime() + days * 24 * 60 * 60 * 1000);
  const options = {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
   second: '2-digit',
 };
 return newDate.toLocaleString('zh-CN', options);
}

const JoinTeamModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //控制是否生成链接
  const [isCreateLink, setIsCreateLink] = useState(false);
  //控制生成链接的输入框
  const [linkValue, setLinkValue] = useState('');
  //获得实时改变的邀请人数
  const [inviteNumber, setInviteNumber] = useState(1);
  //获得实时改变的有效期
  const [validityTime, setValidtyTime] = useState(7);
  //获得的相加后的时间，实现时间的变换
  const [afterAddDate, setAfterAddDate] = useState(addDays(new Date(),validityTime));
  //全局提示，生成链接成功后全局提示生成成功
  const [messageApi, contextHolder] = message.useMessage();

  const { Option } = Select;

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };


  const [form] = Form.useForm();

  const onRoleChange = (value: string) => {
    //这里的value是<Option value="operator">里的value
    if (value === 'operator'){
       //只要选中operator就代表能生成链接了
       setIsCreateLink(true);
    }else{
      //只要没选中，则不符合生成链接的条件，则不能生成链接
       setIsCreateLink(false);
      //别忘了要把链接输入框置为空，否则输入框就一直显示上次生成的链接而无法消失
       setLinkValue('');
    }
    // switch (value) {
    //   case 'male':
    //     form.setFieldsValue({ note: 'Hi, man!' });
    //     break;
    //   case 'female':
    //     form.setFieldsValue({ note: 'Hi, lady!' });
    //     break;
    //   case 'other':
    //     form.setFieldsValue({ note: 'Hi there!' });
    //     break;
    //   default:
    // }
  };


  //设置生成链接的内容和弹出的说明
  const [showMessage, setShowMessage] = useState('');
  const handleSubmit = () => {
    // 提交成功，则能生成链接
    if (isCreateLink === true){
      setLinkValue('生成链接：。。。。。');
      //实现实时改变弹出的说明，即每秒点击生成按钮，秒数会变。如果没有这句，则只有validityTime改变时时间才会变
      setAfterAddDate(addDays(new Date(),validityTime))
      console.log('我是date',afterAddDate);
      setShowMessage(`成员可通过链接加入，有效期为${validityTime}天，链接失效时间${afterAddDate}`);// 设置要显示的文字内容
      //全局提示设置，生成链接成功后进行提示
      messageApi.open({
        type: 'success',
        content: '链接已生成',
      });
    }else{
      setLinkValue('');
    }
  }

  const initialValues = { //这个是初始值，这样rules里的required: true这个功能就不会出现明明输入框有值却还提示请输入值的情况
    //适用于自定义的输入框
    inviteNumber: inviteNumber,
    validityTime: validityTime,
  };

  //处理邀请人数发生变化
  const handleInviteNumber = (value)=>{
     setInviteNumber(value);
  }
  //处理有效期发生变化
  const handleValidityTime = (value)=>{
    //注意更新afterAddDate要在这里进行，也即当点击生成链接按钮时，就更新并显示
    //更新日期，再加之前，应该先初始化为当前时间再重新加天数，否则就一直进行累加了
    const chineseDateString = addDays(new Date(),value);
    setAfterAddDate(chineseDateString);
    // console.log('有效期',validityTime);
    // console.log('我是有效期里的value',value)
    //如果把这个写到开头，则不会实时把输入框的值更新到validtyTime里，value是实时的输入框的值
    setValidtyTime(value);
 }

 const onFinish = (values: any) => {
  console.log('我是提交完毕后的',values);
 };

 //重置对话框里的表单内容，重置就相当于关闭这个对话框，那么一切都要重新赋初始值
 const onReset = () => {
  form.resetFields();
  //重置后应该选完必选项才能生成链接
  setIsCreateLink(false);
  //别忘了要把链接输入框置为空，否则输入框就一直显示上次生成的链接而无法消失
  setLinkValue('');
  //弹出的内容也清理掉
  setShowMessage('');
  //把邀请人数重新置为1
  setInviteNumber(1);
  //把有效期重新置为7
  setValidtyTime(7);
 };

 //开启对话框
 const showModal = () => {
  //打开对话框
  setIsModalOpen(true);
 };

 const handleOk = () => {
  //关闭后进行重置
  onReset();
  //关闭对话框
  setIsModalOpen(false);
  //关闭后将AfterAddDate归为初始
  setAfterAddDate(addDays(new Date(),validityTime));
 };

 const handleCancel = () => {
  //关闭后进行重置
  onReset();
  //关闭对话框
  setIsModalOpen(false);
  //关闭后将AfterAddDate归为初始
  setAfterAddDate(addDays(new Date(),validityTime));
 };


  return (
    <>
      <Button type="primary" onClick={showModal}>
        邀请入团
      </Button>
      <Modal title="邀请入团" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true} focusTriggerAfterClose={false}>
          <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600, marginRight:100 }}
          preserve={false}
          initialValues={initialValues}
          >
            <Form.Item name="inviteNumber" label="邀请人数" rules={[{ required: true, type:'number'}]} style={{marginRight:-40 }}>
                <InputNumber min={1} defaultValue={1} onChange={handleInviteNumber}/> 人
            </Form.Item>
            <Form.Item name="validityTime" label="有效期" rules={[{ required: true, type:'number'}]} style={{marginRight:-40 }}>
                <InputNumber min={1} value={validityTime} onChange={handleValidityTime}/> 天
            </Form.Item>
            <Form.Item name="role" label="角色" rules={[{ required: true }]} style={{marginRight:-40 }}>
              <Select
                placeholder="请选择角色"
                onChange={onRoleChange}
                allowClear
                value=''
              >
                <Option value="operator">作业员</Option>
              </Select>
            </Form.Item>
            {/* <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
            >
              {({ getFieldValue }) =>
                getFieldValue('role') === 'operator' ? (
                  <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                ) : null
              }
            </Form.Item> */}
            {/* <Form.Item {...tailLayout}>
              <Space.Compact style={{ width: '100%' }}>
                <Input value={linkValue} maxLength={500}/>
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>生成链接</Button>
              </Space.Compact>
                {showMessage && <div>{showMessage}</div>}
            </Form.Item> */}
            <Space.Compact style={{ width: '75%', marginLeft:100}}>
                <Input value={linkValue}/>
                {contextHolder} {/*生成全局提示，不写这个没反应 */}
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>生成链接</Button>
              </Space.Compact>
                {showMessage && <div style={{marginLeft:60, marginTop:10,width:'100%'}}>{showMessage}</div>}
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="button" onClick={onReset} style={{marginLeft:80, marginTop:10}}>
                Reset
              </Button>
            </Form.Item>
        </Form>
      </Modal>
    </>
  );
};


export default JoinTeamModal;


