import {Button, Card, Pagination, Space, Table, message} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect } from 'react';
import { useState } from 'react';
import SearchProjectTaskList from './components/SearchProjectTaskList';
import styles from './index.css';
import { PageContainer } from '@ant-design/pro-layout';
import { history, request, useLocation, useModel, useNavigate} from '@umijs/max';
import OperateProjectTaskListButton from './components/OperateProjectTaskListButton';



interface DataType {
  key: number;
  taskName: string;
  taskID: number;
  assignTeam: string;
  state: string;
  taskNumber: number;
  markedNumber: number;
  // markUsedTime: string;
  qualityInspectionPassesNumber: number;
  // qualityInspectionUsedTime: string;
  creator: string;
  model: string;
}


// const data: DataType[] = [];
// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     taskName: `Edward King ${i}`,
//     taskID: i,
//     state:'未领取',
//     assignTeam: 'test',
//     taskNumber: 10,
//     markedNumber: 10,
//     // markUsedTime: '3分10秒',
//     qualityInspectionPassesNumber: 10,
//     // qualityInspectionUsedTime: '3分10秒',
//     creator: '团管理1',
//     model: 'ss',
//   });
// }

 

//默认每页初始显示的条数
const EveryPageData = 10

const ProjectTaskList: React.FC = () => {
   //接收参数
   const location = useLocation();
    // console.log("我是ProjectTaskList接收过来的项目编号:",location.state.key);

    const [projectID, setProjectID] = useState('');

  //使用浏览器的sessionStorage或者localStorage来存储projectID。这样，即使location.state变为了null，也可以从存储中获取projectID
  useEffect(() => {
    if (location.state && location.state.key) {
      setProjectID(prevProjectID => {
        const newProjectID = location.state.key;
        window.sessionStorage.setItem('projectID', newProjectID);
        return newProjectID;
      });
    }
  }, [location.state]);
  useEffect(() => {
    const storedProjectID = window.sessionStorage.getItem('projectID'); // 从 sessionStorage 中获取 projectID
    if (storedProjectID) {
      setProjectID(storedProjectID);
    }else{
      console.log('projectTaskList项目编号为空');
    }
  }, []);


  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await request('/api/project/core/getMissionListByProjectKey', {
          method: 'POST',
          data: {'projectKey': window.sessionStorage.getItem('projectID')}
          // data: {'projectKey': projectID}
      })
      if (response.data !== null){
        setData(response.data);
        console.log("成功获取项目任务列表数据：", response.data);
      }
    };
    fetchData();
  }, []);


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

  // 监听data的变化，更新currentData
  useEffect(() => {
    // const initalDataIndex = Math.min(EveryPageData, data.length);
    setCurrentData(data.slice(0, initalDataIndex));
}, [data]);

  //全局提示信息
  const [messageApi, contextHolder] = message.useMessage();

  //获取当前用户
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  console.log("我是当前登录用户：",currentUser);



  //获取上个页面传递过来的参数
//   const location = useLocation();
//   console.log("我是search:",location);
// console.log("我跳回来了");

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
        item.taskName.includes(searchText[0]) && item.taskID.toString().includes(searchText[1]) && item.creator.includes(searchText[2])
        && item.state.includes(searchText[3])
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

  const navigator = useNavigate();
  //跳转到项目任务详情页面
  const goProjectTaskDetailListPage = () => {
    //  history.push({pathname: './projectTaskList/projectTaskDetailList',search: 'sdfs'});
    navigator('/projectManagement/homePage/projectTaskList/projectTaskDetailList',{
       state: {
         //需要传的参数
         projectID: 'sds',
       }
    });
  }

  //移动到这个位置是因为要实现分配人员按钮功能的实现，如果在上边的话，分配人员的onClick就识别不了任何函数了
  const columns: ColumnsType<DataType> = [
      {
        title: '任务编号',
        dataIndex: 'key',
        render: (text: string) => (
          <a onClick={goProjectTaskDetailListPage}>{text}</a>
        ),
        align: 'center',
      },
      {
        title: '任务名称',
        dataIndex: 'missionName',
        render: (text: string) => (
          <a onClick={goProjectTaskDetailListPage}>{text}</a>
        ),
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
      },
      {
        title: '分配团队',
        dataIndex: 'teamName',
        align: 'center',
      },
      {
        title: '模板',
        dataIndex: 'modelName',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'state',
        align: 'center',
      },
      {
        title: '任务条数',
        dataIndex: 'total',
        align: 'center',
      },
      {
        title: '已标注条数',
        dataIndex: 'markedNumber',
        align: 'center',
      },
      // {
      //   title: '标注已用时',
      //   dataIndex: 'markUsedTime',
      //   align: 'center',
      // },
      {
        title: '质检通过条数',
        dataIndex: 'qualityInspectionPassesNumber',
        align: 'center',
      },
      // {
      //   title: '质检已用时',
      //   dataIndex: 'qualityInspectionUsedTime',
      //   align: 'center',
      // },
      {
        title: '创建人',
        dataIndex: ' creator',
        align: 'center',
        render: () => <span>{currentUser.name}</span>, // 设置默认值为当前用户
      },
      {
        title: '操作',
        dataIndex: 'operate',
        align: 'center',
        width: 230,
        render: () => (
          <>
            <Space>
              <a >编辑任务</a>
              <a >收回数据</a>
              <a >验收详情</a>
            </Space>
          </>

        ),
      },

  ];



return (
  <>
  <PageContainer>
    {contextHolder}{/*全局提示信息 */}
    <OperateProjectTaskListButton selectedRowKeys={selectedRowsObjects} handleClearSelection={handleClearSelection} projectID={window.sessionStorage.getItem('projectID')}></OperateProjectTaskListButton>
    <Card>
      <SearchProjectTaskList handleSearch={handleSearch} afterReset={afterReset}></SearchProjectTaskList>

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

export default ProjectTaskList;
