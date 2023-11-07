import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { useRef, useState } from 'react';
import styles from './JoinTeam.css'
import JoinTeamModal from './JoinTeamModal';

interface DataType {
  key: string;
  name: string;
  userID: number;
  account: string;
  role: string;
  state: string;
  inviter: string;
  joinTime: string;
  deleteUser: React.ComponentType;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    userID: 32,
    account:'balabala',
    role: '团队管理员',
    state: '已激活',
    inviter: '',
    joinTime: '2023-10.07 23:45:10',
    deleteUser: <Button type="link">移除团队</Button>
  },
  {
    key: '2',
    name: 'John Brown',
    userID: 32,
    account:'balabala',
    role: '团队管理员',
    state: '已激活',
    inviter: '',
    joinTime: '2023-10.07 23:45:10',
    deleteUser: <Button type="link">移除团队</Button>
  },
  {
    key: '3',
    name: 'John Brown',
    userID: 32,
    account:'balabala',
    role: '团队管理员',
    state: '已激活',
    inviter: '',
    joinTime: '2023-10.07 23:45:10',
    deleteUser: <Button type="link">移除团队</Button>
  },
  {
    key: '4',
    name: 'John Brown',
    userID: 32,
    account:'balabala',
    role: '团队管理员',
    state: '已激活',
    inviter: '',
    joinTime: '2023-10.07 23:45:10',
    deleteUser: <Button type="link">移除团队</Button>
  },
];

const JoinTeam: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,//函数接受一个可选的参数param，其类型为FilterConfirmProps，并且没有返回值（void）。
    dataIndex: DataIndex,
  ) => {
    confirm();//confirm()函数进行搜索确认操作通常用于在用户执行搜索操作之前弹出一个确认对话框，以确认用户是否确实要执行搜索操作。
    console.log('我是selectedkeys',selectedKeys)//一个字符串数组，表示用户选择的搜索关键字，即用户输入的值
    setSearchText(selectedKeys[0]); //第一个搜索关键字(用户输入的值)设置为搜索文本。
    setSearchedColumn(dataIndex); //将当前搜索的数据索引设置为已搜索的列
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            // onClick={() => {
            //   confirm({ closeDropdown: false });
            //   setSearchText((selectedKeys as string[])[0]);
            //   setSearchedColumn(dataIndex);
            // }}
            //上边是原版的，下边是改进，即点击后恢复表格原始状态
            onClick={() =>{
              clearFilters && handleReset(clearFilters)
              handleSearch([], confirm,dataIndex)
            }
            }
          >
            Return
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => //检查record[dataIndex]是否包含value，并返回一个布尔值。在比较之前，将它们都转换为小写字符串。
      record[dataIndex]//record是一个数组或对象，它包含了需要检查的数据。根据代码中的索引dataIndex，我们可以访问record中特定位置的值进行比较。
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) { //用于处理下拉菜单打开状态的变化。当菜单打开时，通过setTimeout延迟100毫秒后选择输入框中的文本
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
    // 根据searchedColumn和dataIndex的值来决定是渲染高亮后的文本还是原始文本。如果searchedColumn等于dataIndex，
    // 则使用Highlighter组件对text进行高亮处理，设置高亮背景色为橙色（#ffc069）和内边距为0。如果searchedColumn不等于dataIndex，
    // 则直接返回原始文本。
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
     {
      title: '用户ID',
      dataIndex: 'userID',
      key: 'userID',
      width: '11%',
      ...getColumnSearchProps('userID'),
      sorter: (a, b) => a.userID - b.userID ,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '13%',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      width: '13%',
      ...getColumnSearchProps('account'),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: '13%',
      ...getColumnSearchProps('role'),
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: '11%',
      ...getColumnSearchProps('state'),
    },
    {
      title: '邀请人',
      dataIndex: 'inviter',
      key: 'inviter',
      width: '11%',
      ...getColumnSearchProps('inviter'),
    },
    {
      title: '加入时间',
      dataIndex: 'joinTime',
      key: 'joinTime',
      width: '15%',
      ...getColumnSearchProps('joinTime'),
    },
    {
      title: '操作',
      dataIndex: 'deleteUser',
      key: 'deleteUser',
      ...getColumnSearchProps('deleteUser'),
    },
  ];

  //处理邀请入团按钮操作
  const handleJoinTeamButton = () =>{

  }
  return <>
    
    <JoinTeamModal></JoinTeamModal>
    <Table columns={columns} dataSource={data}/>
    </>;
};

export default JoinTeam;
