import {Card, Pagination, Table, message} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import React from 'react';
import { useState } from 'react';
import SearchAnnotationAudioTask from './SearchAnnotationAudioTask';
import styles from './AnnotationDetail.css';
import { PageContainer } from '@ant-design/pro-layout';
import { history} from '@umijs/max';


interface DataType {
  key: number;
  audioName: string;
  audioID: number;
  originalDuration: number;
  targetDuration: number;
  qualityInspector: string;
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
    qualityInspector: '团管理1',
  });
}


//默认每页初始显示的条数
const EveryPageData = 10

const Annotationdetail: React.FC = () => {
  //处理表格选中项
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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

  //跳转到标注页面
  const goAnnotationPage = () => {
     history.push('./annotationPage')
  }

  //移动到这个位置是因为要实现分配人员按钮功能的实现，如果在上边的话，分配人员的onClick就识别不了任何函数了
  const columns: ColumnsType<DataType> = [
      {
        title: '音频编号',
        dataIndex: 'audioID',
        render: (text: string) => (
                      <a onClick={goAnnotationPage}>{text}</a>
                ),
        align: 'center',
      },
      {
        title: '音频名称',
        dataIndex: 'audioName',
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
        title: '质检员',
        dataIndex: 'qualityInspector',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        render: () => (
          <>
          {/* <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultBg: '#F07775',
                  defaultColor: 'white',
                  defaultBorderColor: 'white',
                },
              },
            }}
          >
            <Button onClick={showAllocationModal} size='middle' className={styles.OperateButton}>
              分配人员
            </Button>
          </ConfigProvider> */}
        </>
      ),
    },
  ];



return (
  <>
  <PageContainer>
  {contextHolder}{/*全局提示信息 */}

  <Card>
    <SearchAnnotationAudioTask handleSearch={handleSearch} afterReset={afterReset}></SearchAnnotationAudioTask>

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

export default Annotationdetail;
