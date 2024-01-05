import { outLogin,updateRolesMessage} from '@/services/ant-design-pro/api';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel} from '@umijs/max';
import { Flex} from 'antd';
import { Spin,Modal,message as customMessage} from 'antd';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback,useState,useEffect} from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import './index.css';
import { Item } from 'rc-menu';
import { set } from 'lodash';
import { dataflowProvider } from '@/.umi/plugin-initialState/runtime';
export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.name}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await outLogin();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    // 判断是否需要进行重定向
    if (window.location.pathname !== '/user/login' && !redirect) { //如果当前页面的路径不是/user/login且没有提供redirect参数
      history.replace({ // 使用 history.replace() 方法替换当前页面
        pathname: '/user/login', // 设置新的路径为 /user/login
        search: stringify({ // 将 redirect 参数添加到查询字符串中
          redirect: pathname + search,
        }),
      });
    }
  };
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });
  const { initialState, setInitialState } = useModel('@@initialState');
  const [dialogVisible, setDialogVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState("");
  const [firstLine, setFirstLine] = useState<string[]>([]);
  const [secondLine, setSecondLine] = useState<string[]>([]);
  const [belongTeam, setBelongTeam] = useState([]);
  const [manageTeam, setManageTeam] = useState([]);
  const [select, setSelect] = useState("");
  


  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        history.push(`/account/${key}`);
      }
      if(key === 'roles'){
        setDialogVisible(true)
      }
    },
    [setInitialState],
    
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'roles',
            icon: <UserOutlined />,
            label: '切换角色和团队',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },

  ];

  const handelOk = ()=>{
    //更新角色
    console.log("点击确定！")
    const message = getTeamKeyAndRole(select,activeIndex)
    const newCurrentUser = {
      ...currentUser,
      currentRole:message.role,
      currentTeam:message.teamKey
    }
    console.log("当前用户角色：",message)
    setInitialState((s) => ({ ...s, currentUser: newCurrentUser }));
    //把信息保存到后台
    const body = {
      currentTeam:message.teamKey,
      currentRole:message.role,
      roleType:select+"-"+activeIndex,
      userKey:currentUser.userKey,
    }
    updateRolesMessage(body).then(data =>{
      if(data.status === '0'){
        customMessage.success("操作成功！")
        setDialogVisible(false)
      }else{
        customMessage.error("操作失败！请稍候重试！")
      }

    })
    

  }
  const modalCancel = ()=>{
    setDialogVisible(false)

  }

  interface RoleMessage {
    name: string;
    src: string;
    click:string;
  }

  const getImageSrc = (i: number): RoleMessage => {
    let roleMessage: RoleMessage = { name: "未知角色", src: "icons/default.png",click:"icons/超级管理员-1.png" };
  
    const role = currentUser.roles?.split(",")[i];
    switch (role) {
      case '0':
        roleMessage.name = "超级管理员";
        roleMessage.src = "icons/超级管理员.png";
        roleMessage.click = "icons/超级管理员-1.png"

        break;
      case '1':
        roleMessage.name = "项目主管";
        roleMessage.src = "icons/项目主管.png";
        roleMessage.click = "icons/项目主管-1.png"
        break;
      case '2':
        roleMessage.name = "团队管理员";
        roleMessage.src = "icons/团队管理员.png";
        roleMessage.click = "icons/团队管理员-1.png"
        break;
      case '3':
        roleMessage.name = "作业员";
        roleMessage.src = "icons/作业员.png";
        roleMessage.click = "icons/作业员-1.png"
        break;
      default:
        // 处理其他角色情况
        break;
    }
    console.log("看下roleMessage",roleMessage)
    return roleMessage;
  }

  useEffect(() => {
    init();
  }, []);

  function handleRoleClick(select,index) {
    setActiveIndex(String(index));
    setSelect(select)
    console.log("点击切换角色。。。。",select,index)

  }

  const init = ()=>{
    const firstLine = currentUser.roles?.split(',').filter(item=> item === "1" || item === "0")
    const secondLine = currentUser.roles?.split(',').filter(item=> item === "2" || item === "3")
    //重新指定角色结构
    const manageTeam = [];
    currentUser.managerTeamItems?.map(item => {
      let conut = 1;
      let managerTeamItem: {
        teamName?: string;
        teamKey?: string;
        conut?: number;
      } = {};

      const filteredItems = currentUser.belongTeamItems?.filter(item1 => item.teamKey === item1.teamKey);
      if (filteredItems && filteredItems.length > 0) {
        conut = 2;
      }
      managerTeamItem = {
        teamName: item.teamName,
        teamKey: item.teamKey,
        conut: conut,
      };

  manageTeam.push(managerTeamItem);
});
    //筛选出所属的团队但不是此团队的管理员
    const belongTeam = currentUser.belongTeamItems?.filter(item => !manageTeam.some(item1 => item1.teamKey === item.teamKey));
    
    if(firstLine){
      setFirstLine(firstLine)
    }
    if(secondLine){
     setSecondLine(secondLine)
    }
    setBelongTeam(belongTeam)
    setManageTeam(manageTeam)
    //初始化角色信息
    let roleType = currentUser.roleType
    if(roleType){
      setActiveIndex(roleType.split("-")[1])
      setSelect(roleType.split("-")[0])
    }
  }

  function getTeamKeyAndRole(index,select){
    console.log("getTeamKeyAndRole进入方法",index,select)
    let teamKey
    let role
    switch(index){
      case "1":
        role = firstLine[select]
        break
      case "2":
        teamKey = manageTeam[select.split("")[0]].teamKey
        role = String(Number(select.split("")[1])+2)
        break
      case "3":
        teamKey = belongTeam[select].teamKey
        role = "3"
    } 
    return{teamKey:teamKey,role:role}  
  }


  return (
    <div>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <div>
        <Modal
          title="请选择角色和团队"
          open={dialogVisible}
          onOk={handelOk} 
          onCancel={modalCancel}
        >

          {/* //判断用户角色 */}

         <div>
          
          <div>
          <Flex>
            {Array.from({ length: firstLine.length }).map((_, i) => (
              <div
                className={`roles_contain ${activeIndex === String(i) && select === "1"? 'active' : ''}`}
                key={i}
                onClick={() => handleRoleClick("1",i)}
              >
                <div>
                  <img className="roles_contain_image" src={activeIndex === String(i)&&select === "1"?getImageSrc(i).click:getImageSrc(i).src} alt="Role" />
                </div>
                <div style={{color:activeIndex === String(i)&&select === "1"?"white":"black"}}>{getImageSrc(i).name}</div>
              </div>
            ))}
         </Flex>
         {/* 管理的团队 */}
          </div>
          {Array.from({ length:manageTeam.length}).map((_, k) => (
              <div
                className="manager_roles_contain"
                key={k}
              >
                    
                      <div className='manager_roles_contain_item_father'>
                        <div className='team_name'>
                          {manageTeam[k].teamName}
                        </div>
                        <Flex>
                        {Array.from({length : manageTeam[k].conut}).map((_, i) => (
                          <div
                            className={`manager_roles_contain_item ${activeIndex === String(k)+String(i) && select === "2" ? 'active' : ''}`}
                            key={String(i)+String(k)}
                            onClick={() => handleRoleClick("2",String(k)+String(i))}
                          >
                            
                              <span>
                                <img className="manager_roles_contain_image" src={activeIndex === String(k)+String(i) && select === "2"?getImageSrc(i+1).click:getImageSrc(i+1).src} alt="Role" />
                              </span>
                              <span style={{color:activeIndex === String(k)+String(i) && select === "2"?"white":"black"}}>{getImageSrc(i+1).name}</span>
                          </div>
                          
                        ))}
                        </Flex>
                      </div>
                    
               
              </div>
            ))}

            {/* 所属于的团队 */}
            <Flex>
            {Array.from({ length: belongTeam.length }).map((_, i) => (
              <div
                className="manager_roles_contain"
                key={i}
              >
                <div className='manager_roles_contain_item_father'>
                  <div className='team_name'>
                   {belongTeam[i].teamName}
                  </div>
                    <div
                      className={`manager_roles_contain_item ${activeIndex === String(i) && select === "3"? 'active' : ''}`}
                      key={i}
                      onClick={() => handleRoleClick("3",i)}
                    >
                      <div>
                        <img className="manager_roles_contain_image" src={activeIndex === String(i)&&select === "3"?getImageSrc(2).click:getImageSrc(2).src} alt="Role" />
                      </div>
                      <div style={{color:activeIndex === String(i)&&select === "3"?"white":"black"}}>{getImageSrc(2).name}</div>
                    </div>
                </div>
              </div>
            ))}
         </Flex>


         </div>

        </Modal>
      </div>
    </div>
    
  );
};
