import {Button, Card, Pagination, Table, message} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import React from 'react';
import { useState } from 'react';
import SearchQualityInspectTask from './SearchQualityInspectTask';
import styles from './SearchQualityInspectTask.css';
import { PageContainer } from '@ant-design/pro-layout';
import { history} from '@umijs/max';
import OperateDetailTableButton from './OperateDetailTableButton';


interface DataType {
  key: number;
  audioName: string;
  audioID: number;
  originalDuration: number;
  targetDuration: number;
  annotator: string;
  state: string;
}


const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    audioName: `Edward King ${i}`,
    audioID: i,
    state:'未领取',
    originalDuration: 10,
    targetDuration: 10,
    annotator: '团管理1',
  });
}


//默认每页初始显示的条数
const EveryPageData = 10

const QualityInspectTaskDetail: React.FC = () => {
  //处理表格选中项的下标
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  //处理表格中选中的项
  const [selectedRowsObjects, setSelectedRowsObjects] = useState<React.Key[]>([]);
  //初始显示数据,10是初始显示的每页的条数，默认为EveryPageData
  const initalDataIndex = Math.min(EveryPageData, data.length);
  //currentData是显示到页面的实时数据，而curentSearchData是基于searchText实时搜素出来的总的数据，注意区分
  //也就是说curentSearchData是包含currentData的，curentSearchData存储总的查询出来的数据，currentData是从curentSearchData挑出来数据进行渲染
  const [currentData, setCurrentData] = React.useState(data.slice(0,initalDataIndex));
  const [currentSearchData, setCurrentSearchData] = React.useState(data.slice(0,data.length));
  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();


  //接收传过来的searchText参数，只要输入框一变，就立马执行setCurrentData()
  // const [newsearchText, setNewsearchText] = useState('');
 // console.log('我是currentData的length',currentData.length)

  //处理表格选中项
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys); //注意这个数组里边是下标，不是对象
    console.log('selectedRowKeys changed: ', newSelectedRowKeys); //返回的是数组，数组里是表格中选中的那一行的下标Array [ 0, 1 .....]
  };
   /*
    record：返回的是最后一个选中的对象
        Object { key: 2, audioName: "Edward King 2", audioID: 2, state: "未领取", originalDuration: 10,
        targetDuration: 10, annotator: "团管理1" }
    selectd: 选中后返回true
    selectedRows: 返回数组里边是被选中的所有的对象
        Array [ {…}, {…} ]
​          0: Object { key: 0, audioName: "Edward King 0", audioID: 0, … }
​          1: Object { key: 1, audioName: "Edward King 1", audioID: 1, … }
          length: 2
          <prototype>: Array []
    nativvEvent:
  */
  const onSelect = (record, selected, selectedRows, nativeEvent) => {
    setSelectedRowsObjects(selectedRows); //用于传递给OperateDetailTableButton.tsx
    console.log("我是选择的项onselect:",record, selected, selectedRows, nativeEvent);
  }

//处理全选和取消全选后回调
/*
      selected: 当前是否全选，返回布尔值。
      selectedRows:当前选中的所有行，输出数组，里边是对象，如果清空，则返回空数组。
      changeRows: 当前发生变化的数组，比如一页10个，先手动选择前两行，然后点全选，则返回本页的后8个对象数组，而不是10个。
*/
function onSelectAll(selected, selectedRows, changeRows) {
  setSelectedRowsObjects(selectedRows);
  console.log('全选所有',selected, selectedRows, changeRows)
}
// function onSelectNone(){
//   console.log("全选所有被清空了");
// }
  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    // selections: [
    //   Table.SELECTION_ALL,  点击全选所有，onSelctAll函数并没有执行，不知道怎么回事
    //   Table.SELECTION_NONE, 这个正常，即点击清空所有时，onSelectNone执行了
    // ],
    onSelect:onSelect,
    onSelectAll:onSelectAll,
    // onSelectNone:onSelectNone,
  };
  //手动控制清空已选的选项，本函数传递到OperateDetailButton.tsx里进行手动控制
  const handleClearSelection = () => {
    rowSelection.onChange([]); //功能正常，报错不知为什么
    setSelectedRowKeys([]);
    setSelectedRowsObjects([]);
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

  //跳转到质检详情页面
  const goQualityInspectDetailPage = () => {
     history.push('./qualityInspectPage');
  }

  //移动到这个位置是因为要实现分配人员按钮功能的实现，如果在上边的话，分配人员的onClick就识别不了任何函数了
  const columns: ColumnsType<DataType> = [
      {
        title: '音频编号',
        dataIndex: 'audioID',
        render: (text: string) => (
          <a onClick={goQualityInspectDetailPage}>{text}</a>
        ),
        align: 'center',
      },
      {
        title: '音频名称',
        dataIndex: 'audioName',
        render: (text: string) => (
          <a onClick={goQualityInspectDetailPage}>{text}</a>
        ),
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'state',
        align: 'center',
      },
      {
        title: '原始时长(秒)',
        dataIndex: 'originalDuration',
        align: 'center',
      },
      {
        title: '目标时长(秒)',
        dataIndex: 'targetDuration',
        align: 'center',
      },
      {
        title: '标注员',
        dataIndex: 'annotator',
        align: 'center',
      },

  ];



return (
  <>
  <PageContainer>
  {contextHolder}{/*全局提示信息 */}
  <OperateDetailTableButton selectedRowKeys={selectedRowsObjects} handleClearSelection={handleClearSelection}></OperateDetailTableButton>
  <Card>
    <SearchQualityInspectTask handleSearch={handleSearch} afterReset={afterReset}></SearchQualityInspectTask>

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

export default QualityInspectTaskDetail;
