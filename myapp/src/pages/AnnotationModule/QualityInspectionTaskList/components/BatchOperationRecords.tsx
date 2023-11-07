import {Button, Card, Pagination, Table, message} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';
import { useState } from 'react';
import styles from './SearchQualityInspectTask.css';
import { PageContainer } from '@ant-design/pro-layout';




interface DataType {
  key: number;
  operationTime: string;
  operationType: string;
  operationID: number;
  operationAudioNumber: number;
  successNumber: number;
  failureNumber: number;
  operationState: string;
}


const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    operationTime: '2023-10-23 10:23:55',
    operationID: i,
    operationType:'批量通过',
    operationState: '操作成功',
    operationAudioNumber: 10,
    successNumber: 10,
    failureNumber: 0,
  });
}


//默认每页初始显示的条数
const EveryPageData = 10

const BatchOperationRecords: React.FC = () => {

  //初始显示数据,10是初始显示的每页的条数，默认为EveryPageData
  const initalDataIndex = Math.min(EveryPageData, data.length);
  //currentData是显示到页面的实时数据，而curentSearchData是基于searchText实时搜素出来的总的数据，注意区分
  //也就是说curentSearchData是包含currentData的，curentSearchData存储总的查询出来的数据，currentData是从curentSearchData挑出来数据进行渲染
  const [currentData, setCurrentData] = React.useState(data.slice(0,initalDataIndex));
  // const [currentSearchData, setCurrentSearchData] = React.useState(data.slice(0,data.length));



   //实现分页函数
   function handlePageChange(page,pageSize) {
     // 根据用户点击的页码更新当前页码，并重新渲染数据列表和 Pagination 组件
     // 用于存储当前页的数据

     // 计算当前页码对应的数据范围
     const startIndex = (page - 1) * pageSize;
    //  const endIndex = Math.min(startIndex + pageSize, currentData.length);
     const endIndex = Math.min(startIndex + pageSize, data.length);
     let newSelectedRowKeys = [];
     // 从数据源中获取当前页的数据
    //  newSelectedRowKeys = currentData.slice(startIndex, endIndex);
    //  setCurrentData(newSelectedRowKeys)
    newSelectedRowKeys = data.slice(startIndex,endIndex);
    setCurrentData(newSelectedRowKeys);
    // console.log('我是handlePageChange里的page和pageSize和currentData和currentSearchData',page,pageSize,currentData.length,currentData.length)
   }

  //实现输入框查询
  //  const handleSearch = (searchText: string) => {
  //   const filtered = data.filter((item) =>
  //       // if (item.taskName !=='' && item.taskName !==''){
  //       //   item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
  //       // }
  //       // item.taskName.includes(searchText[0])
  //       item.audioName.includes(searchText[0]) && item.audioID.toString().includes(searchText[1]) && item.state.includes(searchText[2])
  //       // item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1])
  //     );
  //     // item.taskName.includes(searchText) || item.age.toString().includes(text)

  //   console.log('我正在搜索',searchText);

  //   //必须在这里先算一下initalDataIndex
  //   const initalDataIndex = Math.min(EveryPageData, filtered.length);
  //   console.log('我是处理实时查询里的currentSearchData',currentSearchData,filtered);
  //   setCurrentData(filtered.slice(0,initalDataIndex)); //这一句是为了显示基于searchText实时搜索时显示到页面的那部分数据。
  //   // 用filtered，用currentSearchData好像没用
  //   setCurrentSearchData(filtered); //这句是为了更新基于当前的serachText所搜索到的总的数据，和上边的数据不一样，这个是总数据。
  //   console.log('我是处理实时查询里的currentSearchData',currentSearchData,filtered)
  // };

  // //实现点击重置按钮，就把原来的数据重新渲染回来
  // const afterReset = () => {
  //   //为防止出错，先按这样的逻辑写，直接强行全部回归原始数据
  //   const initalDataIndex = Math.min(EveryPageData, data.length);

  //   setCurrentData(data.slice(0,initalDataIndex));
  //   setCurrentSearchData(data);
  // }


  const columns: ColumnsType<DataType> = [
      {
        title: '操作时间',
        dataIndex: 'operationTime',
        align: 'center',
      },
      {
        title: '操作状态',
        dataIndex: 'operationState',
        align: 'center',
      },
      {
        title: '操作类型',
        dataIndex: 'operationType',
        align: 'center',
      },
      {
        title: '操作音频条数',
        dataIndex: 'operationAudioNumber',
        align: 'center',
      },
      {
        title: '成功条数',
        dataIndex: 'successNumber',
        align: 'center',
      },
      {
        title: '失败条数',
        dataIndex: 'failureNumber',
        align: 'center',
      },

  ];



return (
  <>
  <PageContainer>

  {/* <OperateDetailTableButton selectedRowKeys={selectedRowsObjects} handleClearSelection={handleClearSelection}></OperateDetailTableButton> */}
  <Card>
    {/* <SearchQualityInspectTask handleSearch={handleSearch} afterReset={afterReset}></SearchQualityInspectTask> */}
    <Table
    columns={columns}
    dataSource={currentData}
    pagination={false} //是否显示表格自带分页器
    scroll={{  y: 400 }} //
    />

    <Pagination
    total={data.length}
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

export default BatchOperationRecords;
