import {Button, Card, Col, Modal, Pagination, Row, Space, Table, Upload, message} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect } from 'react';
import { useState } from 'react';
import SearchProjectTaskDetailList from './components/SearchProjectTaskDetailList';
import styles from './index.css';
import { PageContainer } from '@ant-design/pro-layout';
import { history, useLocation} from '@umijs/max';
import { type } from './../../../../types/index.d';
import { InboxOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from "@/services/swagger/pet";
import { getAudioData } from "../service/api";
import { request } from '@umijs/max';
import pako from 'pako';
import base64 from 'base-64';
import { Link, Route, Routes } from 'react-router-dom';
// import { useLocation } from 'umi';


interface DataType {
  key: number;
  audioName: string;
  audioID: number;
  originalDuration: number;
  targetDuration: number;
  annotator: string;
  markUsedTime: string;
  qualityInspector: string;
  qualityInspectionUsedTime: string;
  state: string;
  internalInspector: string;
  acceptanceUsedTime: string;
}


// const data: DataType[] = [];
// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     audioName: `Edward King ${i}`,
//     audioID: i,
//     state:'未领取',
//     originalDuration: 10,
//     targetDuration: 10,
//     annotator: 'test1',
//     markUsedTime: '2分20秒',
//     qualityInspector: '团管理1',
//     qualityInspectionUsedTime: '2分20秒',
//     internalInspector: '',
//     acceptanceUsedTime: '0秒',
//   });
// }


//默认每页初始显示的条数
const EveryPageData = 10

const ProjectTaskDetail: React.FC = () => {

  //控制新建任务对话框弹出
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  //处理表格选中项
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  //currentData是显示到页面的实时数据，而curentSearchData是基于searchText实时搜素出来的总的数据，注意区分
  //也就是说curentSearchData是包含currentData的，curentSearchData存储总的查询出来的数据，currentData是从curentSearchData挑出来数据进行渲染

  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  // const {search} = location.state;
  console.log("我是ProjectTaskDetailList接收到的missionKey:",location.state.missionKey);
  window.sessionStorage.setItem('missionKey', location.state.missionKey);
  console.log("我是ProjectTaskDetailList接收到的projectKey:", window.sessionStorage.getItem('projectID'));
  //接收传过来的searchText参数，只要输入框一变，就立马执行setCurrentData()
  // const [newsearchText, setNewsearchText] = useState('');
 // console.log('我是currentData的length',currentData.length)
 //加载音频列表
 const [data, setData] = useState([]);
  
//  useEffect(() => {
//       if (location.state && location.state.key) {
//          console.log("我是ProjectTaskDetailList接收到的missionKey:",location.state.missionKey);
//          window.sessionStorage.setItem('missionKey', location.state.missionKey);
//       }
//     }, [location.state]);
 useEffect(() => {
    const fetchData = async () => {
      const response = await request('/api/label/core/getAudioByMissionKey', {
          method: 'POST',
          data: {'missionKey': window.sessionStorage.getItem('missionKey')}
          // data: {'projectKey': projectID}
      })
      if (response.data !== null){
        setData(response.data);
        console.log("成功获取音频列表数据：", response.data);
      }
    };
    fetchData();
}, []);
//初始显示数据,10是初始显示的每页的条数，默认为EveryPageData
const initalDataIndex = Math.min(EveryPageData, data.length);
const [currentData, setCurrentData] = React.useState(data.slice(0,initalDataIndex));
const [currentSearchData, setCurrentSearchData] = React.useState(data.slice(0,data.length));

// 监听data的变化，更新currentData
useEffect(() => {
    // const initalDataIndex = Math.min(EveryPageData, data.length);
    setCurrentData(data.slice(0, initalDataIndex));
    setCurrentSearchData(data);
}, [data]);


  //处理表格选中项
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys); //返回的是数组，数组里是表格中选中的那一行的下标Array [ 0, 1 .....]
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const onSelect = (record, selected, selectedRows, nativeEvent) => {
    console.log("我是选择的项onselect:",record, selected, selectedRows, nativeEvent); //能获取选中的项的信息，选多个也能获得多个
 }
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
    onSelect:onSelect,
  };


   //实现分页函数
   function handlePageChange(page,pageSize) {
     // 根据用户点击的页码更新当前页码，并重新渲染数据列表和 Pagination 组件
     // 用于存储当前页的数据

     // 计算当前页码对应的数据范围

     const startIndex = (page - 1) * pageSize;
    //  const endIndex = Math.min(startIndex + pageSize, currentData.length);
     const endIndex = Math.min(startIndex + pageSize, currentSearchData.length);
     let newSelectedRowKeys = [];
     // 从数据源中获取当前页的数据
    //  newSelectedRowKeys = currentData.slice(startIndex, endIndex);
    //  setCurrentData(newSelectedRowKeys)
    newSelectedRowKeys = currentSearchData.slice(startIndex,endIndex);
    setCurrentData(newSelectedRowKeys);
    console.log('我是handlePageChange里的page和pageSize和currentData和currentSearchData',page,pageSize,currentSearchData.length,currentSearchData.length)
   }

   //实现输入框查询
   const handleSearch = (searchText: string) => {
    const filtered = data.filter((item) =>
        // if (item.taskName !=='' && item.taskName !==''){
        //   item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
        // }
        // item.taskName.includes(searchText[0])
        item.audioName.includes(searchText[0]) && item.audioID.toString().includes(searchText[1]) && item.state.includes(searchText[2])
        // item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
      );
      // item.taskName.includes(searchText) || item.age.toString().includes(text)

    console.log('我正在搜索',searchText);

    //必须在这里先算一下initalDataIndex
    const initalDataIndex = Math.min(EveryPageData, filtered.length);
    console.log('我是处理实时查询里的currentSearchData',currentSearchData,filtered);
    setCurrentData(filtered.slice(0,initalDataIndex)); //这一句是为了显示基于searchText实时搜索时显示到页面的那部分数据。
    // 用filtered，用currentSearchData好像没用
    setCurrentSearchData(filtered); //这句是为了更新基于当前的serachText所搜索到的总的数据，和上边的数据不一样，这个是总数据。
    console.log('我是处理实时查询里的currentSearchData',currentSearchData,filtered)
  };

  //实现点击重置按钮，就把原来的数据重新渲染回来
  const afterReset = () => {
    //为防止出错，先按这样的逻辑写，直接强行全部回归原始数据
    const initalDataIndex = Math.min(EveryPageData, data.length);

    setCurrentData(data.slice(0,initalDataIndex));
    setCurrentSearchData(data);
  }


  // //导出记录
  // const exportExeclData = () => {
  //   request('/api/label/core/exportExcelData', {
  //     method: 'POST',
  //     data: {
  //        "projectKey": window.sessionStorage.getItem('projectID'),
  //        "missionKey": window.sessionStorage.getItem('missionKey')
  //     },
  //   }).then(response => {
  //     // if (response.status ==='0') {
  //     //   messageApi.success('修改成功');
  //     // }
  //     console.log("我是导出的数据：",response.data);

  //       // 转换base64字符串为Blob对象
  //       const byteCharacters = atob(response.data);
  //       const byteArrays = [];
  //       for (let offset = 0; offset < byteCharacters.length; offset += 512) {
  //         const slice = byteCharacters.slice(offset, offset + 512);
  //         const byteNumbers = new Array(slice.length);
  //         for (let i = 0; i < slice.length; i++) {
  //           byteNumbers[i] = slice.charCodeAt(i);
  //         }
  //         const byteArray = new Uint8Array(byteNumbers);
  //         byteArrays.push(byteArray);
  //       }
  //       const blob = new Blob(byteArrays, { type: 'application/zip' });

  //       // 创建一个Blob URL
  //       const url = window.URL.createObjectURL(blob);

  //       // 创建一个隐藏的<a>元素并模拟点击
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = '压缩包.zip';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);

  //     // return response.json();
  //   }).catch(error => {
  //     // 在这里处理错误情况
  //     messageApi.error("出错了");
  //     console.error('There was a problem with the fetch operation:', error);
  //   });
  // }

  //移动到这个位置是因为要实现分配人员按钮功能的实现，如果在上边的话，分配人员的onClick就识别不了任何函数了
  const columns: ColumnsType<DataType> = [
      {
        title: '编号',
        dataIndex: 'id',
        render: (text: string,record) => (
          <>
              <Link to={{ pathname: '/label',
              search: `?${new URLSearchParams({ message: JSON.stringify({audioKey:record.audioKey,modelKey:record.modelKey,url:record.url})}).toString()}`}}>{text}</Link>
          </>

        ),
        align: 'center',
      },
      {
        title: '音频名称',
        dataIndex: 'audioName',
        render: (text: string) => (
                      <a>{text}</a>
                ),
        align: 'center',
      },
      {
        title: '音频编号',
        dataIndex: 'audioKey',
        render: (text: string) => (
                      <a>{text}</a>
                ),
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'state',
        align: 'center',
      },
      {
        title: '标注员',
        dataIndex: 'belongUserName',
        align: 'center',
      },
      {
        title: '质检员',
        dataIndex: 'belongCheckerKey',
        align: 'center',
      },

      // {
      //   title: '内部验收员',
      //   dataIndex: 'internalInspector',
      //   align: 'center',
      // },
      // {
      //   title: '验收已用时',
      //   dataIndex: 'acceptanceUsedTime',
      //   align: 'center',
      // },
  ];



return (
  <>
  <PageContainer>
  {contextHolder}{/*全局提示信息 */}

  <Card>
    <SearchProjectTaskDetailList handleSearch={handleSearch} afterReset={afterReset}></SearchProjectTaskDetailList>
    {/* <Row>
      <Col flex="1 1 200px"></Col>
      <Col flex="0 1 100px">
        <Space>
          <Button type="primary">导出任务信息</Button>
          <Button type="primary" onClick={exportExeclData}>导出记录</Button>
        </Space>
      </Col>
    </Row> */}

    {/* <Modal title="新建任务" open={isAddTaskModalOpen} onOk={handleAddTaskOk} onCancel={handleAddTaskCancel}>
              <Dragger {...props} directory fileList={fileList}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击这里开始上传音频</p>
                <p className="ant-upload-hint">
                     支持单次或批量上传
                </p>
              </Dragger>
    </Modal> */}

    <Table
    rowSelection={rowSelection}
    columns={columns}
    dataSource={currentData}
    pagination={false} //是否显示表格自带分页器
    scroll={{  y: 400 }} //
    />

    <Pagination
    total={currentSearchData.length}
    showSizeChanger
    showQuickJumper
    showTotal={(total) => `共计 ${total} 条数据`}
    onChange={handlePageChange}
    defaultPageSize={EveryPageData}
    className={styles.pagination}
    />
  </Card>
  </PageContainer>
  </>
  )
};

export default ProjectTaskDetail;
