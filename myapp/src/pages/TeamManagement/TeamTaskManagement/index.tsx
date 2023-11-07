import { PageContainer } from '@ant-design/pro-layout';
import React from "react";
import TeamTaskList from "./components/TeamTaskList";
import { Button, ConfigProvider, Tabs, message} from 'antd';
import { useEffect, useRef, useState } from 'react';
import TaskDetail from "./components/TaskDetail";
import { Input } from 'antd';
import { size } from "lodash";
import { type } from './../../../../types/index.d';
import TaskStatistics from './components/TaskStatistics';

interface DataType {
  key: number;
  taskName: string;
  taskID: number;
  taskNumber: number;
  state: string;
  markedNumber: number;
  qualityPass: number;
  innerPass: number;
}


const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    taskName: `Edward King ${i}`,
    taskID: i,
    taskNumber: 10,
    state:'进行中',
    markedNumber: 50,
    qualityPass: 48,
    innerPass: 10,
  });
}

 //处理Tabs标签
    type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
    // const defaultPanes = new Array(1).fill(null).map((_, index) => {
    //   const id = String(index + 1);
    //   return { label: `Tab ${id}`, children: <TeamTaskList></TeamTaskList>, key: id, closable: false };
    // });
    const defaultPanes = [{label: '团队任务管理', children: <TeamTaskList data={data}></TeamTaskList>, key: '1', closable: false }]

    const TeamTaskManagement = () =>{

      const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
      const [items, setItems] = useState(defaultPanes);
      const newTabIndex = useRef(0);
      //处理搜索任务详情的输入框
      const [searchTaskDetailValue, setSearchTaskDetailValue] = useState('');
      //处理作业统计的输入框
      const [searchTaskStatisticsValue, setSearchTaskStatisticsValue] = useState('');
      //处理搜索框为空时的全局提示
      const [messageApi, contextHolder] = message.useMessage();

      const onChange = (key: string) => {
        setActiveKey(key);
      };

      const add = (type: string,inputValue: string) => {
        console.log('我已经拿到输入框的值，接下来进行进一步操作：',inputValue);
        const newActiveKey = `newTab${newTabIndex.current++}`;
        //搜索框为空不能显示页面
        if (inputValue !==''){
          if (type==='taskDetail'){
              setItems([...items, { label: '任务详情', children: <TaskDetail></TaskDetail>, key: newActiveKey}]);
          }else{
              setItems([...items, { label: '作业统计', children: <TaskStatistics></TaskStatistics>, key: newActiveKey}]);
          }
          setActiveKey(newActiveKey);
        }else{
          //否则弹出全局提示
          messageApi.open({
            type: 'warning',
            content: '请输入任务名称/任务ID',
          });
        }
      };

      const remove = (targetKey: TargetKey) => {
        const targetIndex = items.findIndex((pane) => pane.key === targetKey);
        const newPanes = items.filter((pane) => pane.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
          const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
          setActiveKey(key);
        }
        setItems(newPanes);
      };

      const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
        if (action === 'add') {
          add('taskDetail',searchTaskDetailValue);
        } else {
          remove(targetKey);
        }
      };

      //处理任务详情搜索框的内容
      const handleSearchTaskDetailChange = (e) => {
        setSearchTaskDetailValue(e.target.value);
      };
      const handleSearchTaskDetailButton = () =>{
        add('taskDetail',searchTaskDetailValue);
        console.log('我是正在搜索的值：',searchTaskDetailValue); //获取的是实时的输入值，没问题
        setSearchTaskDetailValue('');
      }

      //处理作业统计搜索框内容
      const handleSearchTaskStatisticsChange = (e) => {
        setSearchTaskStatisticsValue(e.target.value);
      };
      const handleSearchTaskStatisticsButton = () =>{
        add('taskStatistics',searchTaskStatisticsValue);
        console.log('我是正在搜索的值：',searchTaskStatisticsValue); //获取的是实时的输入值，没问题
        setSearchTaskStatisticsValue('');
      }


    return (
    <PageContainer>
      {contextHolder}
      <ConfigProvider
          theme={{
            components: {
              Tabs: {
                cardBg:'#42B983',          //未选中的背景框
                itemSelectedColor:'black', //选中后的文本颜色
                itemColor:'white',         //未选中的文本颜色
                itemHoverColor:'black',    //箭头指向Tab时文本颜色
              },
            },
          }}
      >
      <div style={{overflow: 'hidden'}}>
        <div style={{ marginBottom: 16 }}>
          <Input placeholder="请输入任务名称/任务ID" style={{width:250}} size="middle"
          value={searchTaskDetailValue} onChange={handleSearchTaskDetailChange}/>
          <Button onClick={handleSearchTaskDetailButton} type="primary" size="middle"  style={{marginLeft:10}}>查看任务详情</Button>

          <Input placeholder="请输入任务名称/任务ID" style={{width:250,marginLeft:20}} size="middle"
          value={searchTaskStatisticsValue} onChange={handleSearchTaskStatisticsChange}/>
          <Button onClick={handleSearchTaskStatisticsButton} type="primary" size="middle"  style={{marginLeft:10}}>查看作业统计</Button>
        </div>
        <Tabs
          hideAdd
          onChange={onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={onEdit}
          items={items}
          tabBarGutter={5}
          size='small'

        />

      </div>
      </ConfigProvider>
      {/* <TaskDetail></TaskDetail> */}
      {/* <Test></Test>
      <TeamTaskList></TeamTaskList> */}
    </PageContainer>
    // return <><TeamTaskList></TeamTaskList></>
    )
}


export default TeamTaskManagement;
