import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import './index.css';


const ActionIcons = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    };
  });

  return (
    <>
    {/*使用了 Emotion 的 useEmotionCss 钩子函数来生成 CSS 样式。
    它返回一个包含三个图标（支付宝、淘宝、微博）的 React 元素，每个图标都应用了相同的 CSS 样式 */}
      <AlipayCircleOutlined key="AlipayCircleOutlined" className={langClassName} />
      <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={langClassName} />
      <WeiboCircleOutlined key="WeiboCircleOutlined" className={langClassName} />
    </>
  );
};

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  //API.LoginResult = { status?: string | undefined;  type?: string | undefined;  currentAuthority?: string | undefined; }
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  //
  const [type, setType] = useState<string>('account');
  //使用React和Redux的useModel钩子来获取名为@@initialState的状态,用于获取和设置状态
  //initalState:Object { fetchUserInfo: fetchUserInfo(), settings: {…}, currentUser: {…} }
  const { initialState, setInitialState } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();

  const fetchUserInfo = async () => {
    /*
    'initialState?.fetchUserInfo?' 这是一个可选链运算符（Optional Chaining）的例子，
    如果 'initialState' 或 'fetchUserInfo'有一个或两个都为null或undefined，则整个表达式将返回undefined。
    如果这两个值都存在，那么将继续执行后面的 '()'，那就是执行initialState.fetchUserInfo()，即调用 'fetchUserInfo' 方法
    可选链操作符（?.），如果initialState或fetchUserInfo不存在，则会返回undefined，不会抛出错误。
    */
  const userInfo = await initialState?.fetchUserInfo?.(); //fetchUserInfo()方法如果请求成功会返回msg.data，否则返回undefined

    if (userInfo) {
      //flushSync函数：当需要确保某个state的变更优先同步到DOM时，才应使用flushSync。因为 flushSync 会强制同步所有挂起的更新
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // login()成功的话会返回：API.LoginResult={status?: string;  type?: string;  currentAuthority?: string;}
      //失败：我是msg: Object { status: "error", type: "account", currentAuthority: "guest" }
      //成功：我是msg: Object { status: "ok", type: "account", currentAuthority: "admin" }
      const msg = await login({ ...values, type });

      if (msg.status === '0') {
        /*
        根据当前的语言环境，获取登录成功的消息，并将其赋值给defaultLoginSuccessMessage常量。如果找到了对应的本地化文本，
        则使用该文本；否则，使用默认消息'登录成功！'
        */
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();  //如果成功，就代表执行了setInitialState((s) => ({...s,currentUser: userInfo,}));
        //从当前页面的URL中获取名为"redirect"的参数值，并将其作为新页面的URL。如果该参数不存在，则默认跳转到根目录（'/'）。
        const urlParams = new URL(window.location.href).searchParams;  //使用window.location.href获取当前页面的完整URL(字符串形式)
        console.log('我是urlParams:',urlParams.get('redirect') || '/'); //登陆成功后：URLSearchParams { redirect → "/welcome" }
        history.push('/');
        return;
      }else{
          message.error(msg.message)
      }
      console.log(msg);
      //更新登录状态：API.LoginResult={status?: string;  type?: string;  currentAuthority?: string;}
      setUserLoginState(msg);
    } catch (error) {      // 如果失败去设置用户错误信息
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className='login_contain'>
      <div style={{width:"50%"}}>
        <img src='/image/login_left.1e369287.png' alt="Image" style={{float:'left',width:"70%"}} />
      </div>
    <div className={containerClassName} style={{display:'inline-block',width:"50%"}}>
         
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
           {Settings.title}
        </title>
      </Helmet>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm 
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/icons/icon-headLogo.jpeg" />}
          title="语音标注平台"
          subTitle={intl.formatMessage({ id: '欢迎使用语音标注平台' })}
          initialValues={{
            autoLogin: false,
          }}
          actions={[
            // <FormattedMessage
            //   key="loginWith"
            //   id="pages.login.loginWith"
            //   defaultMessage="其他登录方式"
            // />,
            // <ActionIcons key="icons" />,
          ]}
          onFinish={async (values) => {
            console.log('我是values:',values); //我是values: Object { username: "admin", password: "ant.design", autoLogin: false }
            await handleSubmit(values as API.LoginParams); //values 被赋予了新的类型别名 API.LoginParams。
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                }),
              },
              // {
              //   key: 'mobile',
              //   label: intl.formatMessage({
              //     id: 'pages.login.phoneLogin.tab',
              //     defaultMessage: '手机号登录',
              //   }),
              // },
            ]}
          />

          {status !== '0' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="account"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (!result) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            {/* <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a> */}
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
    </div>
  );
};

export default Login;
