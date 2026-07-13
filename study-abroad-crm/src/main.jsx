import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell, BookOpen, Check, ChevronDown, CircleHelp, ClipboardCheck,
  FileText, GraduationCap, LayoutDashboard, Menu, MoreHorizontal,
  Plus, Search, SlidersHorizontal, SquareCheckBig, UserPlus,
  Users, X, ArrowUpRight, Building2, Send, Star, Eye, MessageSquare, Upload,
  WalletCards, PenLine, ShieldCheck, Clock3, CheckCircle2, LayoutList,
  ArrowRight, RefreshCw, CircleDollarSign, UserRound, BriefcaseBusiness,
  CalendarDays, Paperclip, CloudUpload, Download, Grid2X2, Table2,
  ExternalLink, ListFilter, File, PawPrint, Bone
} from 'lucide-react';

const stages = [
  { id: 'prep', label: '准备材料', color: '#3984d7' },
  { id: 'submitted', label: '已递交', color: '#258db3' },
  { id: 'review', label: '审核中', color: '#e4a334' },
  { id: 'offer', label: '已录取', color: '#1c9a7b' }
];

const initialApplications = [
  { id: 1, stage: 'prep', name: '李想', school: '多伦多大学', program: 'MSc Management', intake: '2025年秋季', owner: '张晓彤', progress: 60, email: 'lixiang@email.com', phone: '138****6621', priority: true },
  { id: 2, stage: 'prep', name: '王雨桐', school: '曼彻斯特大学', program: 'MSc Marketing', intake: '2025年秋季', owner: '李卓', progress: 75 },
  { id: 3, stage: 'prep', name: '陈子涵', school: '悉尼大学', program: 'Master of IT', intake: '2026年春季', owner: '叶雯', progress: 40 },
  { id: 4, stage: 'prep', name: '刘昊然', school: '新南威尔士大学', program: 'MSc Engineering', intake: '2025年秋季', owner: '张晓彤', progress: 55 },
  { id: 5, stage: 'submitted', name: '赵晨曦', school: '香港大学', program: 'MSc Economics', intake: '2025年秋季', owner: '叶雯', progress: 100 },
  { id: 6, stage: 'submitted', name: '孙一航', school: '伦敦国王学院', program: 'MSc Data Science', intake: '2025年秋季', owner: '张晓彤', progress: 100 },
  { id: 7, stage: 'submitted', name: '周子墨', school: '墨尔本大学', program: 'Master of IT', intake: '2026年春季', owner: '李卓', progress: 100 },
  { id: 8, stage: 'review', name: '胡景行', school: '帝国理工学院', program: 'MSc EEE', intake: '2025年秋季', owner: '李卓', progress: 100 },
  { id: 9, stage: 'review', name: '林心如', school: '卡内基梅隆大学', program: 'MSc CS', intake: '2025年秋季', owner: '叶雯', progress: 100 },
  { id: 10, stage: 'review', name: '高子轩', school: '加州大学圣地亚哥分校', program: 'MSc CS', intake: '2025年秋季', owner: '张晓彤', progress: 100 },
  { id: 11, stage: 'offer', name: '徐子涵', school: '伦敦政治经济学院', program: 'MSc Finance', intake: '2025年秋季', owner: '李卓', progress: 100 },
  { id: 12, stage: 'offer', name: '黄天宇', school: '新加坡国立大学', program: 'MSc Computer Eng', intake: '2025年秋季', owner: '张晓彤', progress: 100 },
  { id: 13, stage: 'offer', name: '蒋文博', school: '不列颠哥伦比亚大学', program: 'MSc Vantage', intake: '2026年春季', owner: '叶雯', progress: 100 }
];

const initialTasks = [
  { id: 1, time: '09:30', title: '跟进推荐信提交', detail: '孙一航 · KCL MSc Data Science', level: '高' },
  { id: 2, time: '10:00', title: '签证材料检查', detail: '刘昊然 · UNSW MSc Engineering', level: '中' },
  { id: 3, time: '11:00', title: '更新申请状态', detail: '陈子涵 · 悉尼大学 Master of IT', level: '中' },
  { id: 4, time: '14:00', title: '电话沟通', detail: '李想 · 多伦多大学', level: '中' },
  { id: 5, time: '15:30', title: '文书初稿反馈', detail: '王雨桐 · 曼彻斯特大学', level: '中' },
  { id: 6, time: '16:30', title: '录取确认跟进', detail: '徐子涵 · LSE MSc Finance', level: '高' }
];

const documents = [
  ['护照', true], ['简历 (CV)', true], ['成绩单 (中英文)', true],
  ['语言成绩', true], ['推荐信 1', true], ['存款证明', false],
  ['推荐信 2', false, '待提交'], ['作品集 (如适用)', false],
  ['个人陈述 (PS)', false, '待审核'], ['其他补充材料', false]
];

const nav = [
  [LayoutDashboard, '工作台'], [Users, '学生'], [Search, '选导'], [ClipboardCheck, '申请'],
  [GraduationCap, '院校库'], [FileText, '文书'], [ShieldCheck, '签证'],
  [WalletCards, '收款'], [SquareCheckBig, '任务']
];

const students = [
  {id:1,name:'林知夏',initial:'林',target:'英国 · AI / HCI 博士',service:'博士申请全流程',stage:'选导中',progress:38,count:6,manager:'张晓彤',comms:'李卓',select:'叶雯',writing:'王老师',visa:'待分配',due:'今日 16:30',payment:'已付 50%',invite:'LINXIA2026'},
  {id:2,name:'周子墨',initial:'周',target:'美国 · 计算机视觉博士',service:'博士申请全流程',stage:'学生确认',progress:52,count:4,manager:'叶雯',comms:'李卓',select:'叶雯',writing:'王老师',visa:'待分配',due:'明日 10:00',payment:'已付清',invite:'ZIMO2026'},
  {id:3,name:'陈一诺',initial:'陈',target:'澳洲 · 商科研究型硕士',service:'研究型硕士申请',stage:'等待套磁',progress:66,count:8,manager:'李卓',comms:'张晓彤',select:'李卓',writing:'赵老师',visa:'签证准备',due:'周五 15:00',payment:'已付 80%',invite:'YINUO2026'},
  {id:4,name:'王雨桐',initial:'王',target:'英国 · 市场营销硕士',service:'硕士申请全流程',stage:'文书初稿',progress:72,count:3,manager:'张晓彤',comms:'张晓彤',select:'未分配',writing:'赵老师',visa:'待分配',due:'周五 18:00',payment:'已付清',invite:'YUTONG2026'},
  {id:5,name:'徐子涵',initial:'徐',target:'英国 · 金融硕士',service:'硕士申请全流程',stage:'录取确认',progress:89,count:2,manager:'李卓',comms:'李卓',select:'李卓',writing:'王老师',visa:'签证材料',due:'下周一',payment:'已付清',invite:'ZIHAN2026'}
];

const timeline = [
  {icon:CheckCircle2,color:'green',title:'林知夏确认了 2 位导师',detail:'学生反馈 · 优先套磁',time:'12 分钟前'},
  {icon:PenLine,color:'blue',title:'王雨桐的个人陈述已提交初稿',detail:'文书老师 · 待审核',time:'42 分钟前'},
  {icon:MessageSquare,color:'amber',title:'收到 Dr. Michael Chen 的回复',detail:'周子墨 · 需要补充研究计划',time:'1 小时前'},
  {icon:WalletCards,color:'gray',title:'陈一诺完成第二期付款',detail:'收款 · ¥12,000',time:'昨天 17:20'}
];

const moduleRows = {
  '文书': [
    ['林知夏','研究计划 · AI / HCI','王老师','待学生确认','今天 16:30','orange'],
    ['王雨桐','个人陈述 · MSc Marketing','赵老师','初稿审核','今天 18:00','blue'],
    ['周子墨','Research Proposal · CV','王老师','学生补充中','明日 10:00','orange'],
    ['陈一诺','动机信 · MRes Business','赵老师','已定稿','已完成','green']
  ],
  '签证': [
    ['徐子涵','英国学生签证','李老师','材料检查','下周一','orange'],
    ['陈一诺','澳洲 500 学生签证','李老师','等待 CoE','周五','blue'],
    ['王雨桐','英国学生签证','待分配','未开始','-','gray']
  ],
  '收款': [
    ['林知夏','博士申请全流程','¥36,000 / ¥18,000','分期 2 / 3','2026-07-15','orange'],
    ['陈一诺','研究型硕士申请','¥28,000 / ¥22,400','已付 80%','已完成','green'],
    ['周子墨','博士申请全流程','¥42,000 / ¥42,000','已付清','已完成','green']
  ],
  '任务': [
    ['跟进推荐信提交','孙一航 · KCL MSc Data Science','张晓彤','未完成','今天 09:30','red'],
    ['签证材料检查','刘昊然 · UNSW Engineering','李卓','未完成','今天 10:00','orange'],
    ['文书初稿反馈','王雨桐 · Manchester Marketing','赵老师','进行中','今天 15:30','blue'],
    ['录取确认跟进','徐子涵 · LSE MSc Finance','李卓','已完成','昨天','green']
  ]
};

function DashboardView({setActive}) {
  return <section className="dashboard-view">
    <div className="page-head dashboard-head"><div><h1>工作台</h1><p>张晓彤，今天有 6 项任务需要关注</p></div><button className="primary" onClick={()=>setActive('学生')}><UserPlus size={16}/>新建服务项目</button></div>
    <div className="dashboard-stats"><div><small>服务中学生</small><strong>28</strong><span className="up">↑ 12%</span></div><div><small>待处理任务</small><strong>12</strong><span className="warn">4 项逾期</span></div><div><small>本月回款</small><strong>¥168,000</strong><span className="up">↑ 8.4%</span></div><div><small>申请录取率</small><strong>45.7%</strong><span>近 90 天</span></div></div>
    <div className="dashboard-grid"><section className="work-panel attention"><div className="panel-title"><div><h2>需要你关注</h2><p>按截止时间和业务影响排序</p></div><button onClick={()=>setActive('任务')}>查看全部 <ArrowRight size={14}/></button></div><div className="attention-list"><button><span className="attention-time red">今天<br/><b>09:30</b></span><span><strong>跟进推荐信提交</strong><small>孙一航 · KCL MSc Data Science</small></span><em>高</em><ArrowRight size={15}/></button><button><span className="attention-time orange">今天<br/><b>16:30</b></span><span><strong>林知夏确认导师反馈</strong><small>选导 · 2 位候选待转套磁</small></span><em>中</em><ArrowRight size={15}/></button><button><span className="attention-time orange">明日<br/><b>10:00</b></span><span><strong>签证材料检查</strong><small>刘昊然 · UNSW Engineering</small></span><em>中</em><ArrowRight size={15}/></button></div></section><section className="work-panel activity"><div className="panel-title"><div><h2>团队动态</h2><p>最近发生的业务事件</p></div><button>时间线 <ArrowRight size={14}/></button></div><div className="activity-list">{timeline.map((item,i)=><div className="activity-item" key={i}><span className={`activity-icon ${item.color}`}><item.icon size={14}/></span><span><strong>{item.title}</strong><small>{item.detail}</small></span><time>{item.time}</time></div>)}</div></section></div>
    <section className="work-panel student-overview"><div className="panel-title"><div><h2>我的学生</h2><p>当前服务项目的推进状态</p></div><button onClick={()=>setActive('学生')}>查看学生 <ArrowRight size={14}/></button></div><div className="mini-table"><div className="mini-table-head"><span>学生</span><span>服务项目</span><span>当前阶段</span><span>整体进度</span><span>下一截止</span></div>{students.slice(0,4).map(s=><button key={s.id} onClick={()=>setActive('学生')}><span className="person-cell"><i>{s.initial}</i><b>{s.name}<small>{s.target}</small></b></span><span>{s.service}</span><span><em className="status-tag">{s.stage}</em></span><span className="progress-cell"><i><b style={{width:`${s.progress}%`}}></b></i>{s.progress}%</span><span>{s.due}</span></button>)}</div></section>
  </section>;
}

function StudentsView({setActive, onNewStudent, onNotify, studentRecords}) {
  const [selected,setSelected]=useState(1); const [search,setSearch]=useState(''); const [stageFilter,setStageFilter]=useState('全部阶段');
  const current=studentRecords.find(s=>s.id===selected) || studentRecords[0]; const rows=studentRecords.filter(s=>`${s.name} ${s.target}`.includes(search) && (stageFilter==='全部阶段' || s.stage===stageFilter));
  const stageOptions=['全部阶段',...new Set(studentRecords.map(s=>s.stage))];
  useEffect(()=>{ if(rows.length && !rows.some(s=>s.id===selected)) setSelected(rows[0].id); },[search,stageFilter,selected]);
  return <section className="students-view"><div className="page-head"><div><h1>学生与服务项目</h1><p>以服务项目为主线，统一管理学生、老师和交付进度</p></div><button className="primary" onClick={onNewStudent}><UserPlus size={16}/>新建学生</button></div><div className="student-layout"><aside className="student-list-panel"><label className="inline-search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索学生"/></label><div className="list-filter"><span>{stageFilter==='全部阶段'&&!search?'全部学生':'筛选结果'} <b>{rows.length}</b></span><label className="list-filter-control"><SlidersHorizontal size={14}/><select value={stageFilter} onChange={e=>setStageFilter(e.target.value)} aria-label="按阶段筛选学生">{stageOptions.map(option=><option key={option}>{option}</option>)}</select></label></div>{rows.length ? rows.map(s=><button className={`student-row ${selected===s.id?'active':''}`} key={s.id} onClick={()=>setSelected(s.id)} aria-pressed={selected===s.id}><i>{s.initial}</i><span><strong>{s.name}</strong><small>{s.target}</small></span><em>{s.stage}</em></button>) : <div className="student-list-empty"><Search size={18}/><span>没有符合条件的学生</span></div>}</aside><section className="student-detail"><div className="student-detail-head"><div className="profile-block"><span className="student-avatar large">{current.initial}</span><div><h2>{current.name}</h2><p>{current.target} · {current.service}</p><span className="invite-code">邀请码 {current.invite}</span></div></div><div className="detail-actions"><button onClick={()=>onNotify(`已复制 ${current.name} 的学生邀请链接`)}><Send size={14}/>发送邀请</button><button className="primary" onClick={()=>setActive('选导')}><Search size={14}/>进入选导</button></div></div><div className="case-progress"><div className="progress-title"><span>服务项目整体进度</span><strong>{current.progress}%</strong></div><div className="wide-progress"><i style={{width:`${current.progress}%`}}></i></div><div className="case-stages"><span className="complete">咨询确认</span><span className="complete">选导</span><span className={current.progress>55?'complete':''}>文书</span><span className={current.progress>80?'complete':''}>申请</span><span>签证</span></div></div><div className="detail-columns"><section><div className="section-heading"><h3>老师分工</h3><button onClick={()=>onNotify('已打开老师分工编辑入口')}><Plus size={14}/>添加老师</button></div><div className="assignment-list">{[['管理老师',current.manager,'项目负责人'],['沟通老师',current.comms,'学生沟通'],['选导老师',current.select,'导师推荐'],['文书老师',current.writing,'文书交付'],['签证老师',current.visa,'签证流程']].map(([role,name,desc])=><div key={role}><span className="role-avatar">{name==='待分配'?'?':name.slice(-1)}</span><span><strong>{role}</strong><small>{desc}</small></span><b>{name}</b><button onClick={()=>onNotify(`${role}更换入口已准备`)}>更换</button></div>)}</div></section><section><div className="section-heading"><h3>服务摘要</h3><button onClick={()=>onNotify('服务摘要编辑入口已准备')}>编辑</button></div><div className="summary-grid"><div><small>下一截止</small><b>{current.due}</b></div><div><small>收款状态</small><b>{current.payment}</b></div><div><small>导师候选</small><b>{current.count} 位</b></div><div><small>学生入口</small><b>已生成</b></div></div><div className="student-note-box"><MessageSquare size={15}/><span>最近沟通：学生希望优先考虑英国院校，研究方向偏向 HCI。</span></div></section></div><FileUploadPanel caseId={`student-${current.id}`} uploadedBy="老师 · 张晓彤" title="服务项目共享文件"/></section></div></section>;
}

function ModuleView({module,setActive}) {
  const data=moduleRows[module] || moduleRows['任务'];
  const meta={文书:['文书交付','集中处理版本、批注和定稿节点',PenLine,'4 个项目待处理'],签证:['签证流程','追踪材料、预约和递交状态',ShieldCheck,'2 个项目待跟进'],收款:['轻量收款','服务套餐、分期和退款状态',WalletCards,'1 笔款项待确认'],任务:['任务中心','跨角色统一管理截止时间和交接',SquareCheckBig,'12 项待办']}[module];
  const ModuleIcon=meta[2];
  return <section className="module-view"><div className="page-head"><div><h1>{meta[0]}</h1><p>{meta[1]}</p></div><div className="module-actions"><button><SlidersHorizontal size={15}/>筛选</button><button className="primary"><Plus size={15}/>新建{module==='任务'?'任务':module==='收款'?'收款记录':module==='签证'?'签证事项':'文书任务'}</button></div></div><div className="module-summary"><div className="module-icon"><ModuleIcon size={20}/></div><div><small>当前工作量</small><strong>{meta[3]}</strong></div><div><small>本周完成</small><strong className="green-text">8</strong></div><div><small>平均处理时长</small><strong>2.4 天</strong></div><div className="module-link" onClick={()=>setActive('工作台')}>返回工作台 <ArrowRight size={15}/></div></div><div className="module-board"><div className="module-tabs"><button className="active">全部</button><button>待处理</button><button>进行中</button><button>已完成</button><label><Search size={14}/><input placeholder="搜索学生、项目..."/></label></div><div className="module-table"><div className="module-table-head"><span>{module==='任务'?'任务':'学生 / 服务项目'}</span><span>{module==='任务'?'关联对象':module==='收款'?'金额':'交付内容'}</span><span>负责人</span><span>当前状态</span><span>截止时间</span><span></span></div>{data.map((r,i)=><div className="module-row" key={i}><span className="person-cell"><i>{r[0][0]}</i><b>{r[0]}<small>{module==='任务'?r[1]:students.find(s=>s.name===r[0])?.target || r[1]}</small></b></span><span>{r[1]}</span><span>{r[2]}</span><span><em className={`pill ${r[5]}`}>{r[3]}</em></span><span>{r[4]}</span><button className="row-more"><MoreHorizontal size={16}/></button></div>)}</div></div></section>;
}

function Brand({portal=false, compact=false}) {
  return <div className={`brand ${portal?'portal-brand':''} ${compact?'compact':''}`}><span className="brand-mark"><img src="/brand-qingxue-dog.png" alt="乐意轻学博士柴犬"/></span><span className="brand-copy"><strong className="brand-name">乐意轻学</strong>{portal&&<small>学生服务中心</small>}{!compact&&!portal&&<small>留学申请 CRM</small>}</span><span className="brand-paw" aria-hidden="true"><PawPrint size={13}/></span></div>;
}

const SESSION_KEY='qingxue-crm-session';
const DEMO_STUDENT={id:1,name:'林知夏',target:'英国 · AI / HCI 博士',invite:'LINXIA2026'};

function readSession() {
  if(typeof window==='undefined')return null;
  try { const raw=window.localStorage.getItem(SESSION_KEY); return raw?JSON.parse(raw):null; } catch { return null; }
}

function LoginScreen({onLogin}) {
  const [role,setRole]=useState('teacher'); const [account,setAccount]=useState('张晓彤'); const [password,setPassword]=useState('123456'); const [studentName,setStudentName]=useState(DEMO_STUDENT.name); const [invite,setInvite]=useState(DEMO_STUDENT.invite); const [error,setError]=useState('');
  const submit=event=>{event.preventDefault();setError('');if(role==='teacher'){if(!account.trim()||password.length<6){setError('请输入老师账号和至少 6 位密码');return;}if(!['张晓彤','zhangxiaotong'].includes(account.trim())||password!=='123456'){setError('演示账号：张晓彤，密码：123456');return;}onLogin({role:'teacher',name:'张晓彤',title:'资深顾问'});return;}if(studentName.trim()!==DEMO_STUDENT.name||invite.trim().toUpperCase()!==DEMO_STUDENT.invite){setError('请检查学生姓名和服务项目邀请码');return;}onLogin({role:'student',name:DEMO_STUDENT.name,title:'申请人',studentId:DEMO_STUDENT.id,target:DEMO_STUDENT.target,invite:DEMO_STUDENT.invite});};
  return <main className="login-shell"><section className="login-story"><Brand/><div className="login-dog-card"><img src="/brand-qingxue-dog.png" alt="乐意轻学博士柴犬"/><span><PawPrint size={15}/> 申请路上，每一步都有老师陪你</span><Bone size={20} aria-hidden="true"/></div><div className="login-story-copy"><small>留学申请协作空间</small><h1>把学生、老师和申请进度放在同一条线上。</h1><p>选导、文书、申请、签证和共享材料，都围绕服务项目持续同步。</p></div></section><section className="login-panel"><div className="login-card"><div className="login-card-head"><span className="login-kicker">欢迎回到轻学教育</span><h2>{role==='teacher'?'进入老师工作台':'进入学生服务中心'}</h2><p>{role==='teacher'?'查看负责学生、导师推荐和协作任务。':'打开专属服务项目，查看推荐并反馈意向。'}</p></div><div className="login-role-switch" role="tablist" aria-label="选择登录身份"><button type="button" className={role==='teacher'?'active':''} role="tab" aria-selected={role==='teacher'} onClick={()=>{setRole('teacher');setError('')}}><ShieldCheck size={16}/>老师登录</button><button type="button" className={role==='student'?'active':''} role="tab" aria-selected={role==='student'} onClick={()=>{setRole('student');setError('')}}><GraduationCap size={16}/>学生入口</button></div><form className="login-form" onSubmit={submit}>{role==='teacher'?<><label>老师账号<input value={account} onChange={event=>setAccount(event.target.value)} autoComplete="username" placeholder="请输入姓名或账号"/></label><label>登录密码<input type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="current-password" placeholder="请输入密码"/></label></>:<><label>学生姓名<input value={studentName} onChange={event=>setStudentName(event.target.value)} autoComplete="name" placeholder="请输入姓名"/></label><label>服务项目邀请码<input value={invite} onChange={event=>setInvite(event.target.value.toUpperCase())} autoCapitalize="characters" placeholder="例如 LINXIA2026"/></label></>}{error&&<p className="login-error" role="alert"><CircleHelp size={14}/>{error}</p>}<button className="primary login-submit" type="submit">{role==='teacher'?'进入老师工作台':'进入我的服务项目'}<ArrowRight size={16}/></button></form><div className="login-meta"><span><CheckCircle2 size={14}/> 当前为演示环境</span><small>{role==='teacher'?'老师账号由机构管理员分配':'学生使用服务项目邀请码进入'}</small></div></div></section></main>;
}

function StudentPortalLegacy({onExit, onNotify}) {
  const [tab,setTab]=useState('总览'); const [feedback,setFeedback]=useState({}); const [note,setNote]=useState(''); const [portalMentors,setPortalMentors]=useState(mentors);
  useEffect(()=>{fetch('/api/vika/sync').then(response=>response.json()).then(data=>{if(data.mentors?.length)setPortalMentors(data.mentors)}).catch(()=>{});},[]);
  const choose=(mentor,choice)=>{setFeedback({...feedback,[mentor.id]:choice});onNotify(`已记录 ${mentor.name} 的${choice==='first'?'优先套磁':choice==='second'?'第二批':'不考虑'}选择`)};
  return <div className="portal-shell"><header className="portal-header"><Brand portal/><button onClick={onExit}>退出学生端 <X size={15}/></button></header><main className="portal-main"><div className="portal-welcome"><div><span className="portal-kicker">林知夏的服务项目</span><h1>你好，林知夏</h1><p>张晓彤和团队正在陪你完成英国 AI / HCI 博士申请。</p></div><span className="portal-progress"><b>38%</b><small>整体进度</small></span></div><nav className="portal-tabs">{['总览','导师推荐','文书材料','申请进度','签证'].map(x=><button className={tab===x?'active':''} key={x} onClick={()=>setTab(x)}>{x}</button>)}</nav>{tab==='导师推荐'?<div className="portal-section"><div className="portal-section-title"><div><h2>导师推荐方案</h2><p>请在 7 月 15 日前完成第一轮反馈</p></div><span>{Object.keys(feedback).length ? `${Object.keys(feedback).length} 位已反馈` : '2 位待确认'}</span></div><div className="portal-mentor-grid">{portalMentors.slice(0,2).map((m,i)=>{const ranking=mentorRankings(m); return <article key={m.id}><div className="portal-card-head"><span>推荐 {i+1}</span><b>{m.fit}% 匹配</b></div><h3>{m.name}</h3><p>{m.school} · {m.dept}</p><div className="student-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(m, 'Location')}</span><span>{m.dept}</span></div><small>研究方向</small><strong>{m.topic}</strong><MentorLinks mentor={m}/><div className="portal-reason"><small>老师的推荐理由</small><p>{m.reason}</p></div><div className="portal-choice"><button className={feedback[m.id]==='first'?'chosen':''} onClick={()=>choose(m,'first')}><Star size={14}/>优先套磁</button><button className={feedback[m.id]==='second'?'chosen':''} onClick={()=>choose(m,'second')}>第二批</button><button className={feedback[m.id]==='no'?'not':''} onClick={()=>choose(m,'no')}>不考虑</button></div></article>})}</div><div className="portal-feedback"><MessageSquare size={16}/><input value={note} onChange={event=>setNote(event.target.value)} placeholder="告诉老师你的选择理由或疑问..."/><button className="primary" onClick={()=>{if(!note.trim()){onNotify('请先填写反馈内容');return;}onNotify('反馈已提交给选导老师');setNote('')}}>提交反馈</button></div></div>:<PortalOverview tab={tab}/>}<FileUploadPanel caseId="student-1" uploadedBy="学生 · 林知夏" title="我的材料与共享文件"/></main></div>;
}

function StudentPortalLegacy2({onExit, onNotify}) {
  const [tab,setTab]=useState('总览');
  const [feedback,setFeedback]=useState({});
  const [note,setNote]=useState('');
  const [portalMentors,setPortalMentors]=useState(mentors);
  const [portalFilter,setPortalFilter]=useState('all');
  const [portalSort,setPortalSort]=useState('fit');
  const [detailsOpen,setDetailsOpen]=useState({});
  useEffect(()=>{fetch('/api/vika/sync').then(response=>response.json()).then(data=>{if(data.mentors?.length)setPortalMentors(data.mentors)}).catch(()=>{});},[]);
  const choose=(mentor,choice)=>{setFeedback(current=>({...current,[mentor.id]:choice}));onNotify(`已记录 ${mentor.name} 的${choice==='first'?'优先套磁':choice==='second'?'第二批':'不考虑'}选择`)};
  const recommended=portalMentors.slice(0,4);
  const feedbackCount=Object.keys(feedback).length;
  const visibleMentors=[...recommended].filter(mentor=>portalFilter==='all'||(portalFilter==='pending'&&!feedback[mentor.id])||(portalFilter==='chosen'&&feedback[mentor.id])).sort((a,b)=>portalSort==='school'?a.school.localeCompare(b.school):b.fit-a.fit);
  return <div className="portal-shell"><header className="portal-header"><Brand portal/><button onClick={onExit}>退出学生端 <X size={15}/></button></header><main className="portal-main"><div className="portal-welcome"><div><span className="portal-kicker">林知夏的服务项目</span><h1>你好，林知夏</h1><p>张晓彤和团队正在陪你完成英国 AI / HCI 博士申请。</p></div><span className="portal-progress"><b>38%</b><small>整体进度</small></span></div><div className="portal-next-step"><div><span>当前下一步</span><strong>完成导师推荐反馈</strong><small>反馈后，选导老师会为你生成套磁计划。</small></div><div className="portal-next-progress"><b>{feedbackCount}/{recommended.length}</b><span>导师已反馈</span><i><em style={{width:`${recommended.length?feedbackCount/recommended.length*100:0}%`}}></em></i></div></div><nav className="portal-tabs">{['总览','导师推荐','文书材料','申请进度','签证'].map(x=><button className={tab===x?'active':''} aria-current={tab===x?'page':undefined} key={x} onClick={()=>setTab(x)}>{x}</button>)}</nav>{tab==='导师推荐'?<div className="portal-section"><div className="portal-section-title"><div><h2>导师推荐方案</h2><p>先看关键事实，再告诉老师你的优先顺序。</p></div><span>{feedbackCount ? `${feedbackCount} 位已反馈` : `${recommended.length} 位待确认`}</span></div><div className="portal-list-tools"><div className="portal-filter-tabs"><button className={portalFilter==='all'?'active':''} onClick={()=>setPortalFilter('all')}>全部推荐</button><button className={portalFilter==='pending'?'active':''} onClick={()=>setPortalFilter('pending')}>待反馈</button><button className={portalFilter==='chosen'?'active':''} onClick={()=>setPortalFilter('chosen')}>已反馈</button></div><label><SlidersHorizontal size={14}/><select value={portalSort} onChange={event=>setPortalSort(event.target.value)}><option value="fit">按匹配度</option><option value="school">按学校</option></select></label></div><div className="portal-mentor-grid">{visibleMentors.map((m,i)=>{const ranking=mentorRankings(m); const open=detailsOpen[m.id]; return <article key={m.id}><div className="portal-card-head"><span>推荐 {i+1}</span><b>{m.fit}% 匹配</b></div><h3>{m.name}</h3><p>{m.school} · {m.dept}</p><div className="student-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(m, 'Location')}</span><span>{m.dept}</span></div><small>研究方向</small><strong>{m.topic}</strong><MentorLinks mentor={m}/><button className="portal-details-toggle" onClick={()=>setDetailsOpen(state=>({...state,[m.id]:!state[m.id]}))}>{open?'收起关键申请信息':'查看关键申请信息'} <ChevronDown size={13} className={open?'rotated':''}/></button>{open&&<div className="portal-details-grid"><span><small>招生窗口</small><b>{m.open}</b></span><span><small>申请关注</small><b>{m.dept}</b></span><span><small>地点</small><b>{mentorField(m,'Location')}</b></span></div>}<div className="portal-reason"><small>老师的推荐理由</small><p>{m.reason}</p></div><div className="portal-choice"><button className={feedback[m.id]==='first'?'chosen':''} onClick={()=>choose(m,'first')}><Star size={14}/>优先套磁</button><button className={feedback[m.id]==='second'?'chosen':''} onClick={()=>choose(m,'second')}>第二批</button><button className={feedback[m.id]==='no'?'not':''} onClick={()=>choose(m,'no')}>不考虑</button></div>{feedback[m.id]&&<div className="portal-choice-state"><CheckCircle2 size={13}/>已记录：{feedback[m.id]==='first'?'优先套磁':feedback[m.id]==='second'?'第二批':'不考虑'}</div>}</article>})}</div>{!visibleMentors.length&&<div className="portal-empty-filter">这个筛选下暂时没有导师</div>}<div className="portal-feedback"><MessageSquare size={16}/><input value={note} onChange={event=>setNote(event.target.value)} placeholder="告诉老师你的选择理由或疑问..."/><button className="primary" onClick={()=>{if(!note.trim()){onNotify('请先填写反馈内容');return;}onNotify('反馈已提交给选导老师');setNote('')}}>提交留言</button><button className="portal-submit-feedback" onClick={()=>{if(!feedbackCount){onNotify('请先选择至少一位导师');return;}onNotify(`已提交 ${feedbackCount} 位导师反馈`)}}><Check size={14}/>提交全部反馈</button></div></div>:<PortalOverview tab={tab}/>}<FileUploadPanel caseId="student-1" uploadedBy="学生 · 林知夏" title="我的材料与共享文件"/></main></div>;
}

function persistCaseState(caseId, patch, actor) {
  return fetch('/api/case-state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseId, patch, actor })
  }).then(response => response.json().then(data => {
    if (!response.ok) throw new Error(data.error || '状态同步失败');
    return data;
  }));
}

function StudentPortal({onExit, onNotify, preview=false, student=DEMO_STUDENT}) {
  const studentId=student.id||DEMO_STUDENT.id;
  const caseId=`student-${studentId}`;
  const [tab,setTab]=useState('总览');
  const [feedback,setFeedback]=useState({});
  const [feedbackNotes,setFeedbackNotes]=useState({});
  const [studentNote,setStudentNote]=useState('');
  const [portalMentors,setPortalMentors]=useState(mentors);
  const studentName=student.name||DEMO_STUDENT.name;
  const studentTarget=student.target||DEMO_STUDENT.target;
  useEffect(()=>{fetch(`/api/case-state?caseId=${encodeURIComponent(caseId)}`).then(response=>response.json()).then(data=>{setFeedback(data.state?.feedback||{});setFeedbackNotes(data.state?.feedbackNotes||{});setStudentNote(data.state?.studentNote||'');}).catch(()=>{});},[caseId]);
  useEffect(()=>{fetch('/api/vika/sync').then(response=>response.json()).then(data=>{if(data.mentors?.length)setPortalMentors(data.mentors)}).catch(()=>{});},[]);
  const recommended=portalMentors.slice(0,4);
  const syncPatch=patch=>persistCaseState(caseId,patch,preview?'老师预览':'学生').catch(()=>onNotify('状态暂时未同步，请稍后重试'));
  const recordFeedback=(mentor,choice)=>{setFeedback(current=>({...current,[mentor.id]:choice}));void syncPatch({feedback:{[mentor.id]:choice}});onNotify(`已记录 ${mentor.name} 的${feedbackMeta(choice)?.label||'反馈'}`);};
  const submitMentorFeedback=(mentorId,value)=>{const mentor=recommended.find(item=>item.id===mentorId);setFeedbackNotes(current=>({...current,[mentorId]:value}));void syncPatch({feedbackNotes:{[mentorId]:value}});onNotify(`已保存 ${mentor?.name||'导师'} 的具体反馈`);};
  const submitStudentNote=value=>{setStudentNote(value);void syncPatch({studentNote:value});onNotify('反馈已提交给选导老师');};
  const feedbackCount=recommended.filter(mentor=>feedback[mentor.id]||feedbackNotes[mentor.id]?.trim()).length;
  return <div className="portal-shell"><header className="portal-header"><Brand portal/>{preview&&<span className="portal-session-mark"><Eye size={13}/>老师预览</span>}<button onClick={onExit}>{preview?'返回老师端':'退出学生端'} <X size={15}/></button></header><main className="portal-main"><div className="portal-welcome"><div><span className="portal-kicker">{studentName}的服务项目</span><h1>你好，{studentName}</h1><p>老师已经把导师事实、推荐依据和反馈入口整理在一起。</p></div><span className="portal-progress"><b>38%</b><small>整体进度</small></span></div><div className="portal-next-step"><div><span>当前下一步</span><strong>完成导师推荐反馈</strong><small>你的完整反馈会同步回选导老师工作台。</small></div><div className="portal-next-progress"><b>{feedbackCount}/{recommended.length}</b><span>导师已反馈</span><i><em style={{width:`${recommended.length?feedbackCount/recommended.length*100:0}%`}}></em></i></div></div><nav className="portal-tabs">{['总览','导师推荐','文书材料','申请进度','签证'].map(x=><button className={tab===x?'active':''} aria-current={tab===x?'page':undefined} key={x} onClick={()=>setTab(x)}>{x}{x==='导师推荐'&&<b className="portal-tab-count">{feedbackCount}/{recommended.length}</b>}</button>)}</nav>{tab==='导师推荐'?<StudentMentorView student={{name:studentName,target:studentTarget}} mentors={recommended} sent={true} onNotify={onNotify} feedback={feedback} onFeedback={recordFeedback} feedbackNotes={feedbackNotes} onFeedbackNote={submitMentorFeedback} studentNote={studentNote} onStudentNoteSubmit={submitStudentNote}/>:<PortalOverview tab={tab}/>}<FileUploadPanel caseId={caseId} uploadedBy={`学生 · ${studentName}`} title="我的材料与共享文件"/></main></div>;
}

function PortalOverview({tab}) {
  const rows={总览:[['选导反馈','2 位导师待确认','今天 16:30','orange'],['个人陈述','等待你确认初稿','明日 10:00','blue'],['研究计划','老师正在修改','-','green']],文书材料:[['个人陈述','初稿待确认','明日 10:00','blue'],['研究计划','老师正在修改','-','green']],申请进度:[['University of Cambridge','导师确认阶段','2026 Fall','orange'],['Imperial College London','导师确认阶段','2026 Fall','orange']],签证:[['签证准备','尚未开始','申请录取后','gray']]}[tab] || [];
  return <div className="portal-section"><div className="portal-section-title"><div><h2>{tab==='总览'?'当前待办':tab}</h2><p>{tab==='总览'?'完成这些事项，老师才能继续推进你的申请。':'你的服务项目进度和待办事项。'}</p></div></div><div className="portal-progress-list">{rows.map((r,i)=><div key={i}><span className={`portal-dot ${r[3]}`}></span><span><strong>{r[0]}</strong><small>{r[1]}</small></span><b>{r[2]}</b><ArrowRight size={15}/></div>)}</div></div>;
}

function VikaGridLegacy({mentors, fields, selected, toggle, filterText, setFilterText, filterField, setFilterField}) {
  const fieldRows = fields.length ? fields : Object.keys(mentors[0]?.rawFields || {}).map(name => ({name, type:'Text'}));
  const visible = mentors.filter(mentor => {
    const raw = mentor.rawFields || {};
    const all = fieldRows.map(field => formatFieldValue(raw[field.name])).join(' ').toLowerCase();
    const selectedValue = filterField === '__all' ? all : formatFieldValue(raw[filterField]).toLowerCase();
    return (!filterText || selectedValue.includes(filterText.toLowerCase()));
  });
  return <div className="vika-grid-view"><div className="vika-grid-toolbar"><div className="grid-source"><Table2 size={15}/><strong>Vika 多维表格视图</strong><span>{fieldRows.length} 个字段 · {visible.length}/{mentors.length} 条</span></div><label className="grid-search"><Search size={14}/><input value={filterText} onChange={e=>setFilterText(e.target.value)} placeholder="搜索字段值..."/></label><select value={filterField} onChange={e=>setFilterField(e.target.value)}><option value="__all">全部字段</option>{fieldRows.map(field=><option key={field.name} value={field.name}>{field.name}</option>)}</select></div><div className="vika-table-scroll"><table className="vika-table"><thead><tr><th className="pin-col">方案</th>{fieldRows.map(field=><th key={field.name} title={`${field.name} · ${field.type}`}>{field.name}</th>)}</tr></thead><tbody>{visible.map(mentor=><tr className={selected.includes(mentor.id)?'selected-row':''} key={mentor.id}><td className="pin-col"><button className={selected.includes(mentor.id)?'grid-select selected':'grid-select'} onClick={()=>toggle(mentor.id)}>{selected.includes(mentor.id)?<Check size={13}/>:<Plus size={13}/>}<span>{selected.includes(mentor.id)?'已选':'选入'}</span></button></td>{fieldRows.map(field=><td key={field.name} title={formatFieldValue(mentor.rawFields?.[field.name])}>{formatFieldValue(mentor.rawFields?.[field.name])}</td>)}</tr>)}</tbody></table></div>{!visible.length&&<div className="grid-empty"><ListFilter size={20}/><p>没有符合筛选条件的导师记录</p></div>}</div>;
}

function VikaGrid({mentors, fields, selected, toggle, filterText, setFilterText, filterField, setFilterField}) {
  const fieldRows=Array.from(new Map((fields.length?fields:Object.keys(mentors[0]?.rawFields||{}).map(name=>({name,type:'Text'}))).map(field=>[field.name,field])).values());
  const [hiddenFields,setHiddenFields]=useState([]); const [showFields,setShowFields]=useState(false); const [sortField,setSortField]=useState('__fit'); const [sortAsc,setSortAsc]=useState(false); const [selectedOnly,setSelectedOnly]=useState(false);
  const visibleFields=fieldRows.filter(field=>!hiddenFields.includes(field.name));
  const visible=mentors.filter(mentor=>{const raw=mentor.rawFields||{};const all=fieldRows.map(field=>formatFieldValue(raw[field.name])).join(' ').toLowerCase();const selectedValue=filterField==='__all'?all:formatFieldValue(raw[filterField]).toLowerCase();return(!filterText||selectedValue.includes(filterText.toLowerCase()))&&(!selectedOnly||selected.includes(mentor.id));}).sort((a,b)=>{const value=mentor=>sortField==='__fit'?mentor.fit:formatFieldValue(mentor.rawFields?.[sortField]);const left=value(a);const right=value(b);const result=typeof left==='number'&&typeof right==='number'?left-right:String(left).localeCompare(String(right),'zh-CN');return sortAsc?result:-result;});
  return <div className="vika-grid-view"><div className="vika-grid-toolbar"><div className="grid-source"><Table2 size={15}/><strong>Vika 多维表格视图</strong><span>{fieldRows.length} 个字段 · {visible.length}/{mentors.length} 条</span></div><label className="grid-search"><Search size={14}/><input value={filterText} onChange={e=>setFilterText(e.target.value)} placeholder="搜索字段值..."/></label><select value={filterField} onChange={e=>setFilterField(e.target.value)} aria-label="搜索字段"><option value="__all">全部字段</option>{fieldRows.map(field=><option key={field.name} value={field.name}>{field.name}</option>)}</select><select value={sortField} onChange={e=>setSortField(e.target.value)} aria-label="表格排序"><option value="__fit">匹配度</option>{fieldRows.map(field=><option key={field.name} value={field.name}>{field.name}</option>)}</select><button className={`grid-tool-button ${sortAsc?'ascending':''}`} onClick={()=>setSortAsc(value=>!value)} title="切换排序方向"><ArrowRight size={14}/>排序</button><button className={`grid-tool-button ${selectedOnly?'active':''}`} onClick={()=>setSelectedOnly(value=>!value)}><Check size={13}/>只看已选</button><button className={`grid-tool-button ${showFields?'active':''}`} onClick={()=>setShowFields(value=>!value)}><ListFilter size={13}/>字段 {visibleFields.length}/{fieldRows.length}</button></div>{showFields&&<div className="grid-field-picker"><strong>显示字段</strong><span>全部字段仍保留，可按工作习惯收起列</span><div>{fieldRows.map(field=><label key={field.name}><input type="checkbox" checked={!hiddenFields.includes(field.name)} onChange={()=>setHiddenFields(current=>current.includes(field.name)?current.filter(name=>name!==field.name):[...current,field.name])}/>{field.name}</label>)}</div></div>}<div className="vika-table-scroll"><table className="vika-table"><thead><tr><th className="pin-col">方案</th>{visibleFields.map(field=><th key={field.name} title={`${field.name} · ${field.type}`}>{field.name}</th>)}</tr></thead><tbody>{visible.map(mentor=><tr className={selected.includes(mentor.id)?'selected-row':''} key={mentor.id}><td className="pin-col"><button className={selected.includes(mentor.id)?'grid-select selected':'grid-select'} onClick={()=>toggle(mentor.id)}>{selected.includes(mentor.id)?<Check size={13}/>:<Plus size={13}/>}<span>{selected.includes(mentor.id)?'已选':'选入'}</span></button></td>{visibleFields.map(field=><td key={field.name} title={formatFieldValue(mentor.rawFields?.[field.name])}>{formatFieldValue(mentor.rawFields?.[field.name])}</td>)}</tr>)}</tbody></table></div>{!visible.length&&<div className="grid-empty"><ListFilter size={20}/><p>没有符合筛选条件的导师记录</p></div>}</div>;
}

const demoMentorNotes={
  1:'助理教授；青少年网络霸凌与心理健康、学校社会工作、青少年自杀预防、社交媒体；建议多看看呢～',
  2:'研究主题和学生的医学影像经历有衔接，建议重点确认博士名额、奖学金与国际生申请要求。',
  3:'方向匹配度不错，但论文和方法训练要求较高，可以作为冲刺候选。',
  4:'项目经历相关，建议先确认招生窗口、导师经费和是否接受跨专业申请。'
};

const mentors = [
  { id: 1, name:'Prof. Sarah Thompson', school:'University of Cambridge', dept:'Engineering', topic:'Human-Centred AI · HCI', fit:96, open:'2026 Fall', reason:'研究方向与学生的可解释 AI 项目高度吻合，近三年持续招收国际博士生。', tags:['强匹配','可套磁'], rawFields:{'导师':'Prof. Sarah Thompson','Location':'United Kingdom','学校名字':'University of Cambridge','QS排名':'5','美国USNEWS排名':'8','Department':'Engineering','导师主页':'https://www.eng.cam.ac.uk/','博士申请信息':'https://www.postgraduate.study.cam.ac.uk/','其他导师信息':'https://www.cam.ac.uk/','招生窗口':'2026 Fall','导师备注':demoMentorNotes[1],'选导意向（点击选择）':'优先套磁','你的反馈（具体原因）':'本身对于青少年网络暴力和心理健康问题就比较感兴趣。'} },
  { id: 2, name:'Dr. Michael Chen', school:'Imperial College London', dept:'Computing', topic:'Machine Learning · Healthcare', fit:91, open:'Rolling', reason:'学生的医学影像实习可直接衔接课题组项目，建议强调跨学科经历。', tags:['强匹配','有经费'], rawFields:{'导师':'Dr. Michael Chen','Location':'United Kingdom','学校名字':'Imperial College London','QS排名':'2','美国USNEWS排名':'13','Department':'Computing','导师主页':'https://www.imperial.ac.uk/computing/','博士申请信息':'https://www.imperial.ac.uk/study/pg/apply/','其他导师信息':'https://www.imperial.ac.uk/','招生窗口':'Rolling','导师备注':demoMentorNotes[2],'选导意向（点击选择）':'第二批套磁','你的反馈（具体原因）':'希望进一步了解课题组近期项目和奖学金情况。'} },
  { id: 3, name:'Prof. Emily Watson', school:'University College London', dept:'Computer Science', topic:'Responsible AI · NLP', fit:87, open:'2026 Fall', reason:'方向匹配，但论文要求较高，可作为冲刺候选并先发简短意向邮件。', tags:['冲刺'], rawFields:{'导师':'Prof. Emily Watson','Location':'United Kingdom','学校名字':'University College London','QS排名':'9','美国USNEWS排名':'22','Department':'Computer Science','导师主页':'https://www.ucl.ac.uk/computer-science/','博士申请信息':'https://www.ucl.ac.uk/prospective-students/graduate/','其他导师信息':'https://www.ucl.ac.uk/','招生窗口':'2026 Fall','导师备注':demoMentorNotes[3],'选导意向（点击选择）':'第三批套磁','你的反馈（具体原因）':'方向感兴趣，但希望先确认论文和方法训练要求。'} },
  { id: 4, name:'Dr. James Miller', school:'University of Edinburgh', dept:'Informatics', topic:'AI Safety · Agents', fit:84, open:'2026 Spring', reason:'项目经历相关，招生窗口较早，需要本周确认名额与奖学金情况。', tags:['需确认名额'], rawFields:{'导师':'Dr. James Miller','Location':'United Kingdom','学校名字':'University of Edinburgh','QS排名':'27','美国USNEWS排名':'22','Department':'Informatics','导师主页':'https://informatics.ed.ac.uk/','博士申请信息':'https://www.ed.ac.uk/studying/postgraduate','其他导师信息':'https://www.ed.ac.uk/','招生窗口':'2026 Spring','导师备注':demoMentorNotes[4],'选导意向（点击选择）':'完全不考虑','你的反馈（具体原因）':'当前申请窗口和研究主题暂时不够匹配。'} }
];

const caseStudents = [
  {id:1,name:'林知夏',target:'英国 · AI / HCI 博士',owner:'顾问 张晓彤',count:6,stage:'导师初筛'},
  {id:2,name:'周子墨',target:'美国 · 计算机视觉博士',owner:'顾问 叶雯',count:4,stage:'学生确认'},
  {id:3,name:'陈一诺',target:'澳洲 · 商科研究型硕士',owner:'顾问 李卓',count:8,stage:'等待套磁'}
];

const VIKA_SHARE_URL = 'https://vika.cn/share/shrEMzJp7r1ptqTepgYYM/dstiK28rZa2GsEm7BR/viwtwGOy6pNXn';

const mentorViewOptions = [
  { id: 'cards', label: '候选卡片', description: '看匹配建议', Icon: Grid2X2 },
  { id: 'table', label: '全字段表格', description: '像多维表格一样筛选', Icon: Table2 },
  { id: 'board', label: '反馈看板', description: '按学生意向推进', Icon: LayoutList },
  { id: 'links', label: '链接中心', description: '集中打开申请资料', Icon: ExternalLink }
];

function formatFieldValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(item => formatFieldValue(item)).join('、');
  if (value && typeof value === 'object') return value.text || value.title || JSON.stringify(value);
  return value == null || value === '' ? '—' : String(value);
}

function mentorField(mentor, fieldName) {
  return formatFieldValue(mentor.rawFields?.[fieldName]);
}

function mentorRankings(mentor) {
  return {
    qs: mentor.ranking?.qs || mentorField(mentor, 'QS排名'),
    usnews: mentor.ranking?.usnews || mentorField(mentor, '美国USNEWS排名')
  };
}

function mentorLinks(mentor) {
  const source = mentor.source || {};
  const raw = mentor.rawFields || {};
  const toUrl = value => {
    const url = formatFieldValue(value).trim();
    return url.startsWith('http://') || url.startsWith('https://') ? url : '';
  };
  return [
    ['导师主页', toUrl(source.homepage || raw['导师主页'])],
    ['博士申请信息', toUrl(source.phdInfo || raw['博士申请信息'])],
    ['其他导师链接', toUrl(source.otherInfo || raw['其他导师信息'])]
  ];
}

function MentorLinks({mentor}) {
  return <div className="mentor-links" aria-label="导师相关链接">{mentorLinks(mentor).map(([label, url]) => url ? <a key={label} href={url} target="_blank" rel="noreferrer" title={url}><ExternalLink size={12}/>{label}</a> : <span className="link-missing" key={label}><ExternalLink size={12}/>{label}未提供</span>)}</div>;
}

const feedbackOptions=[
  {id:'first',label:'第一批套磁',short:'第一批',tone:'first'},
  {id:'second',label:'第二批套磁',short:'第二批',tone:'second'},
  {id:'third',label:'第三批套磁',short:'第三批',tone:'third'},
  {id:'no',label:'完全不考虑',short:'不考虑',tone:'no'}
];

const mentorNotesSeed={
  1:'助理教授；青少年网络霸凌与心理健康、学校社会工作、青少年自杀预防、社交媒体；建议多看看呢～',
  2:'研究主题和学生的医学影像经历有衔接，建议重点确认博士名额、奖学金与国际生申请要求。',
  3:'方向匹配度不错，但论文和方法训练要求较高，可以作为冲刺候选。',
  4:'项目经历相关，建议先确认招生窗口、导师经费和是否接受跨专业申请。'
};

function feedbackMeta(value) {
  return feedbackOptions.find(option=>option.id===value) || null;
}

function mentorRecommendationNote(mentor, notes={}) {
  const raw=mentor.rawFields||{}; const source=mentor.source||{};
  return notes[mentor.id] ?? source.teacherNote ?? source.recommendationNote ?? raw['老师备注'] ?? raw['导师备注'] ?? raw['推荐备注'] ?? raw['给学生的备注'] ?? mentorNotesSeed[mentor.id] ?? mentor.reason ?? '';
}

function MentorNoteEditor({mentor,note,onChange}) {
  const [draft,setDraft]=useState(note||'');
  useEffect(()=>setDraft(note||''),[note]);
  const dirty=draft!==note;
  return <details className="mentor-note-editor" open={Boolean(note)}><summary><span><PenLine size={12}/>给学生的推荐备注 <Bone size={11} aria-hidden="true"/> <b>学生可见</b></span><p>{note||'点击补充推荐依据，避免只留下一个截断单元格。'}</p></summary><textarea value={draft} onChange={event=>setDraft(event.target.value)} placeholder="例如：助理教授；青少年网络霸凌与心理健康、学校社会工作……" aria-label={`${mentor.name} 的学生可见推荐备注`}/><div className="mentor-note-actions"><span>{dirty?'尚未同步':'已同步'}</span>{dirty&&<button type="button" className="note-save-button" onClick={()=>onChange(draft)}><Check size={12}/>保存并同步</button>}</div></details>;
}

function MentorNoteReadonly({note}) {
  return <div className="mentor-note-readonly"><div><PawPrint size={12} aria-hidden="true"/><PenLine size={12}/><span>老师给你的推荐备注</span><b>已推送</b></div><p>{note||'老师暂未补充备注。'}</p></div>;
}

function MentorFeedbackComposer({mentor,value,onSave}) {
  const [draft,setDraft]=useState(value||'');
  useEffect(()=>setDraft(value||''),[value]);
  const dirty=draft.trim()!==(value||'').trim();
  return <div className="mentor-feedback-box"><div className="mentor-feedback-box-head"><span><MessageSquare size={13}/>给这位导师的具体反馈</span>{value?<b>已保存</b>:<small>可选，但建议填写</small>}</div><textarea value={draft} onChange={event=>setDraft(event.target.value)} placeholder="写下你选择或暂不考虑这位导师的具体原因..." aria-label={`${mentor.name} 的具体反馈`}/><div className="mentor-feedback-box-actions"><small>{dirty?'修改尚未保存':value?'老师会根据这条反馈制定下一步策略':'具体原因会帮助老师更准确地安排套磁顺序'}</small>{dirty&&<button type="button" onClick={()=>onSave(mentor.id,draft.trim())}><Check size={12}/>保存此位导师反馈</button>}</div></div>;
}

function FileUploadPanel({caseId, uploadedBy, title='共享文件'}) {
  const [files,setFiles]=useState([]); const [uploading,setUploading]=useState(false); const [error,setError]=useState('');
  const loadFiles=()=>fetch(`/api/files?caseId=${encodeURIComponent(caseId)}`).then(response=>response.json()).then(data=>setFiles(data.files||[])).catch(()=>setError('文件列表暂时无法读取'));
  useEffect(()=>{loadFiles();},[caseId]);
  const upload=event=>{const file=event.target.files?.[0]; if(!file)return; setUploading(true); setError(''); const body=new FormData(); body.append('file',file); body.append('caseId',caseId); body.append('uploadedBy',uploadedBy); fetch('/api/files',{method:'POST',body}).then(async response=>{const data=await response.json(); if(!response.ok)throw new Error(data.error||'上传失败'); await loadFiles();}).catch(err=>setError(err.message)).finally(()=>{setUploading(false);event.target.value='';});};
  return <section className="file-panel"><div className="section-heading"><h3><Paperclip size={14}/> {title}</h3><label className="upload-button"><CloudUpload size={14}/>{uploading?'上传中...':'上传文件'}<input type="file" onChange={upload} disabled={uploading}/></label></div>{error&&<p className="file-error">{error}</p>}{files.length?<div className="file-list">{files.map(file=><div key={file.id}><span className="file-icon"><File size={14}/></span><span><strong>{file.name}</strong><small>{file.uploadedBy} · {new Date(file.uploadedAt).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</small></span><a href={`/api/files/${file.id}/download`} title="下载文件"><Download size={14}/></a></div>)}</div>:<div className="file-empty"><Paperclip size={18}/><span>还没有文件，学生和老师上传后会在这里同步显示</span></div>}</section>;
}

function MentorWorkspaceLegacy({onNotify}) {
  const [studentId,setStudentId]=useState(1); const [selected,setSelected]=useState([1,2]); const [preview,setPreview]=useState(false); const [sent,setSent]=useState(false); const [synced,setSynced]=useState(false); const [displayMode,setDisplayMode]=useState('crm'); const [filterText,setFilterText]=useState(''); const [filterField,setFilterField]=useState('__all'); const [vika,setVika]=useState({status:'loading',mentors:[],fields:[],total:0,syncedAt:''});
  const loadVika=()=>fetch('/api/vika/sync').then(response => response.json()).then(data => { if (data.mentors) setVika({status:'ready',mentors:data.mentors,fields:data.fields||[],total:data.total,syncedAt:data.syncedAt}); else setVika({status:'error',mentors:[],fields:[],total:0,error:data.error}); }).catch(error => setVika({status:'error',mentors:[],fields:[],total:0,error:error.message}));
  useEffect(() => { loadVika(); const timer=setInterval(loadVika,5*60*1000); return ()=>clearInterval(timer); }, []);
  const student=caseStudents.find(s=>s.id===studentId);
  const activeMentors = vika.mentors.length ? vika.mentors : mentors;
  const filteredMentors = activeMentors.filter(mentor => { const raw=mentor.rawFields||{}; const values=Object.values(raw).map(formatFieldValue).concat([mentor.name, mentor.school, mentor.dept, mentor.topic, mentor.reason, mentor.open]).join(' ').toLowerCase(); return !filterText || (filterField==='__all'?values:formatFieldValue(raw[filterField]).toLowerCase()).includes(filterText.toLowerCase()); });
  const toggle=id=>setSelected(ids=>{const next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]; const mentor=activeMentors.find(item=>item.id===id); if(mentor) onNotify(next.includes(id)?`已将 ${mentor.name} 加入推荐方案`:`已从推荐方案移除 ${mentor.name}`); return next;});
  return <div className="mentor-workspace">
    <div className="mentor-top"><div><h1>选导工作台</h1><p>从导师库筛选候选，形成推荐方案并发送给学生确认 <span className={`sync-state ${vika.status}`}>{vika.status==='ready'?`Vika 已连接 · ${vika.total} 条 · ${vika.fields.length} 字段`:vika.status==='error'?'Vika 暂不可用':'正在读取 Vika'}</span></p></div><div className="view-toggle"><button className={!preview?'active':''} onClick={()=>setPreview(false)}><BookOpen size={15}/>老师工作台</button><button className={preview?'active':''} onClick={()=>setPreview(true)}><Eye size={15}/>学生页面</button>{!preview&&<><button className={displayMode==='crm'?'active':''} onClick={()=>setDisplayMode('crm')}><Grid2X2 size={15}/>CRM视图</button><button className={displayMode==='table'?'active':''} onClick={()=>setDisplayMode('table')}><Table2 size={15}/>Vika多维表</button></>}</div></div>
    {preview ? <StudentMentorView student={student} mentors={filteredMentors.filter(m=>selected.includes(m.id))} sent={sent} onNotify={onNotify}/> : <div className="mentor-layout">
      <aside className="student-queue"><div className="queue-title"><strong>选导学生</strong><span>{caseStudents.length}</span></div>{caseStudents.map(s=><button className={studentId===s.id?'active':''} key={s.id} onClick={()=>setStudentId(s.id)}><span className="student-avatar">{s.name[0]}</span><span><b>{s.name}</b><small>{s.target}</small><em>{s.stage}</em></span><strong>{s.count}</strong></button>)}</aside>
      <section className="mentor-main"><div className="case-head"><div><span className="student-avatar large">{student.name[0]}</span><div><h2>{student.name}</h2><p>{student.target} · {student.owner}</p></div></div><div className="case-actions"><button onClick={()=>{setSynced(true);loadVika()}}><RefreshCw size={15}/>{synced?`已同步 ${vika.total || 20} 条`:'从 Vika 同步'}</button><a className="vika-link" href={VIKA_SHARE_URL} target="_blank" rel="noreferrer"><ExternalLink size={14}/>打开 Vika</a><button className="primary" onClick={()=>{setSent(true);setPreview(true)}}><Send size={15}/>发送给学生 ({selected.length})</button></div></div>
        <div className="workflow-steps"><span className="done"><Check size={12}/>需求确认</span><i></i><span className="current">2　导师初筛</span><i></i><span>3　学生确认</span><i></i><span>4　套磁跟进</span></div>
        {displayMode==='table'?<VikaGrid mentors={filteredMentors} fields={vika.fields||[]} selected={selected} toggle={toggle} filterText={filterText} setFilterText={setFilterText} filterField={filterField} setFilterField={setFilterField}/>:<><div className="mentor-toolbar"><label><Search size={16}/><input value={filterText} onChange={e=>setFilterText(e.target.value)} placeholder="搜索导师、院校或研究方向"/></label><button><SlidersHorizontal size={15}/>英国 · AI</button><button>匹配度排序 <ChevronDown size={14}/></button></div><div className="mentor-table-head"><span>导师与研究方向</span><span>招生信息</span><span>匹配建议</span><span>操作</span></div><div className="mentor-list">{filteredMentors.slice(0,12).map(m=>{const ranking=mentorRankings(m); return <article className={selected.includes(m.id)?'chosen':''} key={m.id}><div className="mentor-person"><span className="mentor-avatar">{m.name.split(' ').slice(-1)[0][0]}</span><div><h3>{m.name}<ArrowUpRight size={13}/></h3><p><Building2 size={12}/>{m.school}</p><small>{m.dept} · {m.topic}</small><div className="mentor-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(m, 'Location')}</span><span>{m.dept}</span></div></div></div><div className="mentor-intake"><b>{m.open}</b><small>招生/状态</small><strong>{m.fit}% 匹配</strong></div><div className="mentor-reason"><p>{m.reason}</p><div>{m.tags.map(t=><span key={t}>{t}</span>)}</div><MentorLinks mentor={m}/></div><button className={selected.includes(m.id)?'select-mentor selected':'select-mentor'} onClick={()=>toggle(m.id)}>{selected.includes(m.id)?<><Check size={14}/>已选入方案</>:<><Plus size={14}/>加入方案</>}</button></article>})}</div></>}
      </section>
    </div>}
  </div>
}

function MentorBoardView({mentors,selected,toggle}) {
  const columns=[
    {id:'priority',label:'优先套磁',hint:'学生优先反馈',tone:'priority'},
    {id:'second',label:'第二批',hint:'待第一轮完成后推进',tone:'second'},
    {id:'third',label:'第三批',hint:'保留排序，后续推进',tone:'third'},
    {id:'pending',label:'待反馈',hint:'等待学生选择',tone:'pending'},
    {id:'no',label:'不考虑',hint:'保留记录，不进入方案',tone:'muted'}
  ];
  const statusOf=mentor=>{const raw=mentor.rawFields||{};const value=Object.entries(raw).find(([key])=>/意向|反馈|选择/.test(key))?.[1];const text=formatFieldValue(value);if(/不考虑|拒绝/.test(text))return'no';if(/第三批/.test(text))return'third';if(/第二批/.test(text))return'second';if(/优先|第一批/.test(text))return'priority';return selected.includes(mentor.id)?'priority':'pending';};
  return <div className="mentor-board">{columns.map(column=>{const rows=mentors.filter(mentor=>statusOf(mentor)===column.id);return <section className={`mentor-board-column ${column.tone}`} key={column.id}><header><div><strong>{column.label}</strong><small>{column.hint}</small></div><b>{rows.length}</b></header><div className="mentor-board-list">{rows.map(mentor=>{const ranking=mentorRankings(mentor);return <article key={mentor.id}><div className="board-card-head"><span className="mentor-avatar">{mentor.name.split(' ').slice(-1)[0][0]}</span><div><strong>{mentor.name}</strong><small>{mentor.school}</small></div></div><p>{mentor.dept} · {mentor.topic}</p><div className="mentor-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(mentor,'Location')}</span></div><MentorLinks mentor={mentor}/><button className={selected.includes(mentor.id)?'board-action selected':'board-action'} onClick={()=>toggle(mentor.id)}>{selected.includes(mentor.id)?<><Check size={13}/>已在方案</>:<><Plus size={13}/>加入方案</>}</button></article>})}</div>{!rows.length&&<div className="board-empty">暂无导师</div>}</section>})}</div>;
}

function MentorLinkView({mentors,selected,toggle}) {
  return <div className="mentor-link-view"><div className="link-view-head"><div><h3>导师链接中心</h3><p>把导师主页、博士申请信息和其他导师链接集中在一张可扫描清单里。</p></div><span>{mentors.length} 位候选</span></div><div className="link-view-table"><div className="link-view-row link-view-header"><span>导师 / 学校</span><span>排名与地点</span><span>链接</span><span>方案</span></div>{mentors.map(mentor=>{const ranking=mentorRankings(mentor);return <div className="link-view-row" key={mentor.id}><span className="link-person"><i>{mentor.name.split(' ').slice(-1)[0][0]}</i><b>{mentor.name}<small>{mentor.school} · {mentor.dept}</small></b></span><span className="link-facts"><b>QS {ranking.qs}</b><b>US {ranking.usnews}</b><small>{mentorField(mentor,'Location')}</small></span><span className="link-actions">{mentorLinks(mentor).map(([label,url])=>url?<a href={url} target="_blank" rel="noreferrer" key={label}><ExternalLink size={12}/>{label}</a>:<span className="link-missing" key={label}>{label}未提供</span>)}</span><button className={selected.includes(mentor.id)?'link-select selected':'link-select'} onClick={()=>toggle(mentor.id)}>{selected.includes(mentor.id)?<><Check size={13}/>已选</>:<><Plus size={13}/>选入</>}</button></div>})}</div></div>;
}

function MentorWorkspaceBase({onNotify}) {
  const [studentId,setStudentId]=useState(1); const [selected,setSelected]=useState([1,2]); const [preview,setPreview]=useState(false); const [sent,setSent]=useState(false); const [synced,setSynced]=useState(false); const [displayMode,setDisplayMode]=useState('cards'); const [filterText,setFilterText]=useState(''); const [filterField,setFilterField]=useState('__all'); const [quickFilter,setQuickFilter]=useState('all'); const [sortMode,setSortMode]=useState('fit'); const [vika,setVika]=useState({status:'loading',mentors:[],fields:[],total:0,syncedAt:''});
  const loadVika=()=>fetch('/api/vika/sync').then(response=>response.json()).then(data=>{if(data.mentors)setVika({status:'ready',mentors:data.mentors,fields:data.fields||[],total:data.total,syncedAt:data.syncedAt});else setVika({status:'error',mentors:[],fields:[],total:0,error:data.error});}).catch(error=>setVika({status:'error',mentors:[],fields:[],total:0,error:error.message}));
  useEffect(()=>{loadVika();const timer=setInterval(loadVika,5*60*1000);return()=>clearInterval(timer);},[]);
  const student=caseStudents.find(s=>s.id===studentId); const activeMentors=vika.mentors.length?vika.mentors:mentors;
  const filteredMentors=activeMentors.filter(mentor=>{const raw=mentor.rawFields||{};const values=Object.values(raw).map(formatFieldValue).concat([mentor.name,mentor.school,mentor.dept,mentor.topic,mentor.reason,mentor.open]).join(' ').toLowerCase();const textMatch=!filterText||(filterField==='__all'?values:formatFieldValue(raw[filterField]).toLowerCase()).includes(filterText.toLowerCase());const links=mentorLinks(mentor).some(([,url])=>url);const quickMatch=quickFilter==='all'||(quickFilter==='selected'&&selected.includes(mentor.id))||(quickFilter==='links'&&links)||(quickFilter==='ranking'&&mentorRankings(mentor).qs!=='—');return textMatch&&quickMatch;}).sort((a,b)=>sortMode==='school'?a.school.localeCompare(b.school):sortMode==='open'?String(a.open).localeCompare(String(b.open),'zh-CN'):b.fit-a.fit);
  const toggle=id=>setSelected(ids=>{const next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id];const mentor=activeMentors.find(item=>item.id===id);if(mentor)onNotify(next.includes(id)?`已将 ${mentor.name} 加入推荐方案`:`已从推荐方案移除 ${mentor.name}`);return next;});
  return <div className="mentor-workspace"><div className="mentor-top"><div><h1>选导工作台</h1><p>从导师库筛选候选，形成推荐方案并发送给学生确认 <span className={`sync-state ${vika.status}`}>{vika.status==='ready'?`Vika 已连接 · ${vika.total} 条 · ${vika.fields.length} 字段`:vika.status==='error'?'Vika 暂不可用':'正在读取 Vika'}</span></p></div><div className="view-toggle"><button className={!preview?'active':''} onClick={()=>setPreview(false)}><BookOpen size={15}/>老师工作台</button><button className={preview?'active':''} onClick={()=>setPreview(true)}><Eye size={15}/>学生页面</button></div></div>{preview?<StudentMentorView student={student} mentors={filteredMentors.filter(m=>selected.includes(m.id))} sent={sent} onNotify={onNotify}/>:<div className="mentor-layout"><aside className="student-queue"><div className="queue-title"><strong>选导学生</strong><span>{caseStudents.length}</span></div>{caseStudents.map(s=><button className={studentId===s.id?'active':''} key={s.id} onClick={()=>setStudentId(s.id)}><span className="student-avatar">{s.name[0]}</span><span><b>{s.name}</b><small>{s.target}</small><em>{s.stage}</em></span><strong>{s.count}</strong></button>)}</aside><section className="mentor-main"><div className="case-head"><div><span className="student-avatar large">{student.name[0]}</span><div><h2>{student.name}</h2><p>{student.target} · {student.owner}</p></div></div><div className="case-actions"><button onClick={()=>{setSynced(true);loadVika()}}><RefreshCw size={15}/>{synced?`已同步 ${vika.total||20} 条`:'从 Vika 同步'}</button><a className="vika-link" href={VIKA_SHARE_URL} target="_blank" rel="noreferrer"><ExternalLink size={14}/>打开 Vika</a><button className="primary" onClick={()=>{setSent(true);setPreview(true)}}><Send size={15}/>发送给学生 ({selected.length})</button></div></div><div className="workflow-steps"><span className="done"><Check size={12}/>需求确认</span><i></i><span className="current">2　导师初筛</span><i></i><span>3　学生确认</span><i></i><span>4　套磁跟进</span></div><div className="mentor-viewbar"><div className="mentor-view-tabs"><span>多视图</span>{mentorViewOptions.map(({id,label,description,Icon})=><button key={id} className={displayMode===id?'active':''} onClick={()=>setDisplayMode(id)} title={description}><Icon size={15}/><span>{label}</span>{id==='table'&&<b>{vika.fields.length||Object.keys(activeMentors[0]?.rawFields||{}).length}</b>}</button>)}</div><div className="mentor-view-controls"><label className="mentor-global-search"><Search size={15}/><input value={filterText} onChange={e=>setFilterText(e.target.value)} placeholder="搜索导师、学校、方向或任意 Vika 字段"/></label><select value={quickFilter} onChange={e=>setQuickFilter(e.target.value)} aria-label="快速筛选"><option value="all">全部候选</option><option value="selected">已选入方案</option><option value="links">有主页链接</option><option value="ranking">有排名信息</option></select><select value={sortMode} onChange={e=>setSortMode(e.target.value)} aria-label="排序"><option value="fit">匹配度优先</option><option value="school">学校排序</option><option value="open">招生窗口</option></select></div></div>{displayMode==='table'?<VikaGrid mentors={filteredMentors} fields={vika.fields||[]} selected={selected} toggle={toggle} filterText={filterText} setFilterText={setFilterText} filterField={filterField} setFilterField={setFilterField}/>:displayMode==='board'?<MentorBoardView mentors={filteredMentors} selected={selected} toggle={toggle}/>:displayMode==='links'?<MentorLinkView mentors={filteredMentors} selected={selected} toggle={toggle}/>:<><div className="mentor-toolbar"><span className="mentor-result-count">当前显示 {filteredMentors.length} 位导师</span><button><SlidersHorizontal size={15}/>英国 · AI</button><button>匹配度排序 <ChevronDown size={14}/></button></div><div className="mentor-table-head"><span>导师与研究方向</span><span>招生信息</span><span>匹配建议</span><span>操作</span></div><div className="mentor-list">{filteredMentors.slice(0,20).map(m=>{const ranking=mentorRankings(m);return <article className={selected.includes(m.id)?'chosen':''} key={m.id}><div className="mentor-person"><span className="mentor-avatar">{m.name.split(' ').slice(-1)[0][0]}</span><div><h3>{m.name}<ArrowUpRight size={13}/></h3><p><Building2 size={12}/>{m.school}</p><small>{m.dept} · {m.topic}</small><div className="mentor-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(m,'Location')}</span><span>{m.dept}</span></div></div></div><div className="mentor-intake"><b>{m.open}</b><small>招生/状态</small><strong>{m.fit}% 匹配</strong></div><div className="mentor-reason"><p>{m.reason}</p><div>{m.tags.map(t=><span key={t}>{t}</span>)}</div><MentorLinks mentor={m}/></div><button className={selected.includes(m.id)?'select-mentor selected':'select-mentor'} onClick={()=>toggle(m.id)}>{selected.includes(m.id)?<><Check size={14}/>已选入方案</>:<><Plus size={14}/>加入方案</>}</button></article>})}</div>{!filteredMentors.length&&<div className="grid-empty"><ListFilter size={20}/><p>没有符合筛选条件的导师记录</p></div>}</>}</section></div>}</div>;
}

function MentorCard({mentor,selected,toggle,note,onNoteChange,feedback,feedbackNote}) {
  const ranking=mentorRankings(mentor); const meta=feedbackMeta(feedback);
  return <article className={selected?'chosen':''}><div className="mentor-person"><span className="mentor-avatar">{mentor.name.split(' ').slice(-1)[0][0]}</span><div><h3>{mentor.name}<ArrowUpRight size={13}/></h3><p><Building2 size={12}/>{mentor.school}</p><small>{mentor.dept} · {mentor.topic}</small><div className="mentor-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(mentor,'Location')}</span><span>{mentor.dept}</span></div></div></div><div className="mentor-intake"><b>{mentor.open}</b><small>招生/状态</small><strong>{mentor.fit}% 匹配</strong></div><div className="mentor-reason"><p>{mentor.reason}</p><div>{(mentor.tags||[]).map(t=><span key={t}>{t}</span>)}</div><MentorLinks mentor={mentor}/><MentorNoteEditor mentor={mentor} note={note} onChange={onNoteChange}/>{meta&&<div className={`student-feedback-tag ${meta.tone}`}><CheckCircle2 size={12}/>学生反馈：{meta.label}</div>}{feedbackNote&&<div className="student-feedback-note"><MessageSquare size={13}/><div><b>学生具体反馈</b><p>{feedbackNote}</p></div></div>}</div><button className={selected?'select-mentor selected':'select-mentor'} onClick={()=>toggle(mentor.id)}>{selected?<><Check size={14}/>已选入方案</>:<><Plus size={14}/>加入方案</>}</button></article>;
}

function MentorWorkspace({onNotify}) {
  const [studentId,setStudentId]=useState(1); const [selected,setSelected]=useState([1,2]); const [preview,setPreview]=useState(false); const [sent,setSent]=useState(false); const [synced,setSynced]=useState(false); const [displayMode,setDisplayMode]=useState('cards'); const [filterText,setFilterText]=useState(''); const [filterField,setFilterField]=useState('__all'); const [quickFilter,setQuickFilter]=useState('all'); const [sortMode,setSortMode]=useState('fit'); const [mentorNotes,setMentorNotes]=useState(mentorNotesSeed); const [studentFeedback,setStudentFeedback]=useState({}); const [studentFeedbackNotes,setStudentFeedbackNotes]=useState({}); const [studentNote,setStudentNote]=useState(''); const [vika,setVika]=useState({status:'loading',mentors:[],fields:[],total:0,syncedAt:''});
  const loadVika=()=>fetch('/api/vika/sync').then(response=>response.json()).then(data=>{if(data.mentors)setVika({status:'ready',mentors:data.mentors,fields:data.fields||[],total:data.total,syncedAt:data.syncedAt});else setVika({status:'error',mentors:[],fields:[],total:0,error:data.error});}).catch(error=>setVika({status:'error',mentors:[],fields:[],total:0,error:error.message}));
  useEffect(()=>{loadVika();const timer=setInterval(loadVika,5*60*1000);return()=>clearInterval(timer);},[]);
  const student=caseStudents.find(s=>s.id===studentId); const caseId=`student-${studentId}`; const activeMentors=vika.mentors.length?vika.mentors:mentors;
  const loadCaseState=()=>fetch(`/api/case-state?caseId=${encodeURIComponent(caseId)}`).then(response=>response.json()).then(data=>{const state=data.state||{};setMentorNotes(current=>({...current,...(state.notes||{})}));setStudentFeedback(state.feedback||{});setStudentFeedbackNotes(state.feedbackNotes||{});setStudentNote(state.studentNote||'');if(Array.isArray(state.selectedMentorIds))setSelected(state.selectedMentorIds);setSent(Boolean(state.sent));}).catch(()=>{});
  useEffect(()=>{loadCaseState();const timer=setInterval(loadCaseState,5000);return()=>clearInterval(timer);},[caseId]);
  const syncPatch=patch=>persistCaseState(caseId,patch,'选导老师').catch(()=>onNotify('状态暂时未同步，请稍后重试'));
  const filteredMentors=activeMentors.filter(mentor=>{const raw=mentor.rawFields||{};const values=Object.values(raw).map(formatFieldValue).concat([mentor.name,mentor.school,mentor.dept,mentor.topic,mentor.reason,mentor.open,mentorRecommendationNote(mentor,mentorNotes)]).join(' ').toLowerCase();const textMatch=!filterText||(filterField==='__all'?values:formatFieldValue(raw[filterField]).toLowerCase()).includes(filterText.toLowerCase());const links=mentorLinks(mentor).some(([,url])=>url);const quickMatch=quickFilter==='all'||(quickFilter==='selected'&&selected.includes(mentor.id))||(quickFilter==='links'&&links)||(quickFilter==='ranking'&&mentorRankings(mentor).qs!=='—');return textMatch&&quickMatch;}).sort((a,b)=>sortMode==='school'?a.school.localeCompare(b.school):sortMode==='open'?String(a.open).localeCompare(String(b.open),'zh-CN'):b.fit-a.fit);
  const toggle=id=>setSelected(ids=>{const next=ids.includes(id)?ids.filter(x=>x!==id):[...ids,id];const mentor=activeMentors.find(item=>item.id===id);void syncPatch({selectedMentorIds:next});if(mentor)onNotify(next.includes(id)?`已将 ${mentor.name} 加入推荐方案`:`已从推荐方案移除 ${mentor.name}`);return next;});
  const recordFeedback=(mentor,choice)=>{setStudentFeedback(current=>({...current,[mentor.id]:choice}));void syncPatch({feedback:{[mentor.id]:choice}});onNotify(`已记录 ${mentor.name} 的${feedbackMeta(choice)?.label||'反馈'}`);};
  const updateMentorNote=(mentorId,value)=>{setMentorNotes(current=>({...current,[mentorId]:value}));void syncPatch({notes:{[mentorId]:value}});onNotify('推荐备注已保存并同步给学生');};
  const submitStudentNote=value=>{setStudentNote(value);void syncPatch({studentNote:value});onNotify('反馈已提交给选导老师');};
  const submitMentorFeedback=(mentorId,value)=>{const mentor=activeMentors.find(item=>item.id===mentorId);setStudentFeedbackNotes(current=>({...current,[mentorId]:value}));void syncPatch({feedbackNotes:{[mentorId]:value}});onNotify(mentor?`已收到 ${mentor.name} 的具体反馈`:'导师具体反馈已同步');};
  return <div className="mentor-workspace"><div className="mentor-top"><div><h1>选导工作台</h1><p>从导师库筛选候选，形成推荐方案并发送给学生确认 <span className={`sync-state ${vika.status}`}>{vika.status==='ready'?`Vika 已连接 · ${vika.total} 条 · ${vika.fields.length} 字段`:vika.status==='error'?'Vika 暂不可用':'正在读取 Vika'}</span></p><span className="workspace-greeting"><img src="/brand-qingxue-dog.png" alt="" aria-hidden="true"/><PawPrint size={12} aria-hidden="true"/> 今天也帮同学找到合适的导师 <Bone size={11} aria-hidden="true"/></span></div><div className="view-toggle"><button className={!preview?'active':''} onClick={()=>setPreview(false)}><BookOpen size={15}/>老师工作台</button><button className={preview?'active':''} onClick={()=>setPreview(true)}><Eye size={15}/>学生页面</button></div></div>{preview?<StudentMentorView student={student} mentors={filteredMentors.filter(m=>selected.includes(m.id))} sent={sent} onNotify={onNotify} notes={mentorNotes} feedback={studentFeedback} feedbackNotes={studentFeedbackNotes} onFeedback={recordFeedback} onFeedbackNote={submitMentorFeedback} studentNote={studentNote} onStudentNoteSubmit={submitStudentNote}/>:<div className="mentor-layout"><aside className="student-queue"><div className="queue-title"><strong>选导学生</strong><span>{caseStudents.length}</span></div>{caseStudents.map(s=><button className={studentId===s.id?'active':''} key={s.id} onClick={()=>setStudentId(s.id)}><span className="student-avatar">{s.name[0]}</span><span><b>{s.name}</b><small>{s.target}</small><em>{s.stage}</em></span><strong>{s.count}</strong></button>)}</aside><section className="mentor-main"><div className="case-head"><div><span className="student-avatar large">{student.name[0]}</span><div><h2>{student.name}</h2><p>{student.target} · {student.owner}</p></div></div><div className="case-actions"><button onClick={()=>{setSynced(true);loadVika()}}><RefreshCw size={15}/>{synced?`已同步 ${vika.total||20} 条`:'从 Vika 同步'}</button><a className="vika-link" href={VIKA_SHARE_URL} target="_blank" rel="noreferrer"><ExternalLink size={14}/>打开 Vika</a><button className="primary" onClick={()=>{setSent(true);void syncPatch({sent:true});setPreview(true)}}><Send size={15}/>发送给学生 ({selected.length})</button></div></div><div className="workflow-steps"><span className="done"><Check size={12}/>需求确认</span><i></i><span className="current">2　导师初筛</span><i></i><span>3　学生确认</span><i></i><span>4　套磁跟进</span></div><div className="mentor-viewbar"><div className="mentor-view-tabs"><span>多视图</span>{mentorViewOptions.map(({id,label,description,Icon})=><button key={id} className={displayMode===id?'active':''} onClick={()=>setDisplayMode(id)} title={description}><Icon size={15}/><span>{label}</span>{id==='table'&&<b>{vika.fields.length||Object.keys(activeMentors[0]?.rawFields||{}).length}</b>}</button>)}</div><div className="mentor-view-controls"><label className="mentor-global-search"><Search size={15}/><input value={filterText} onChange={e=>setFilterText(e.target.value)} placeholder="搜索导师、学校、方向或任意 Vika 字段"/></label><select value={quickFilter} onChange={e=>setQuickFilter(e.target.value)} aria-label="快速筛选"><option value="all">全部候选</option><option value="selected">已选入方案</option><option value="links">有主页链接</option><option value="ranking">有排名信息</option></select><select value={sortMode} onChange={e=>setSortMode(e.target.value)} aria-label="排序"><option value="fit">匹配度优先</option><option value="school">学校排序</option><option value="open">招生窗口</option></select></div></div>{displayMode==='table'?<VikaGrid mentors={filteredMentors} fields={vika.fields||[]} selected={selected} toggle={toggle} filterText={filterText} setFilterText={setFilterText} filterField={filterField} setFilterField={setFilterField}/>:displayMode==='board'?<MentorBoardView mentors={filteredMentors} selected={selected} toggle={toggle}/>:displayMode==='links'?<MentorLinkView mentors={filteredMentors} selected={selected} toggle={toggle}/>:<><div className="mentor-toolbar"><span className="mentor-result-count">当前显示 {filteredMentors.length} 位导师 · 已选 {selected.length} 位</span><button><SlidersHorizontal size={15}/>英国 · AI</button><button>匹配度排序 <ChevronDown size={14}/></button></div>{studentNote&&<div className="teacher-student-note"><MessageSquare size={14}/><span><b>学生最新反馈</b>{studentNote}</span></div>}<div className="mentor-table-head"><span>导师与研究方向</span><span>招生信息</span><span>推荐备注 / 学生反馈</span><span>操作</span></div><div className="mentor-list">{filteredMentors.slice(0,20).map(mentor=><MentorCard key={mentor.id} mentor={mentor} selected={selected.includes(mentor.id)} toggle={toggle} note={mentorRecommendationNote(mentor,mentorNotes)} onNoteChange={value=>updateMentorNote(mentor.id,value)} feedback={studentFeedback[mentor.id]} feedbackNote={studentFeedbackNotes[mentor.id]}/>)}</div>{!filteredMentors.length&&<div className="grid-empty"><ListFilter size={20}/><p>没有符合筛选条件的导师记录</p></div>}</>}</section></div>}</div>;
}

function StudentMentorViewLegacy({student,mentors,sent,onNotify}) {
  const [feedback,setFeedback]=useState({}); const [note,setNote]=useState('');
  return <section className="student-preview"><div className="student-preview-head"><div><span className="student-avatar large">{student.name[0]}</span><div><small>你好，{student.name}</small><h2>你的导师推荐方案</h2><p>选导老师已根据研究方向与背景完成首轮筛选，请查看并反馈意向。</p></div></div><span className="share-state">{sent?'已发送给学生':'预览模式'}</span></div>
    {mentors.length?<div className="student-mentor-grid">{mentors.map((m,index)=>{const ranking=mentorRankings(m); return <article key={m.id}><div className="student-card-top"><span>推荐 {index+1}</span><strong>{m.fit}% 匹配</strong></div><h3>{m.name}</h3><p className="school-name">{m.school} · {m.dept}</p><div className="student-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(m, 'Location')}</span><span>{m.dept}</span></div><div className="research-area"><small>研究方向</small><b>{m.topic}</b></div><MentorLinks mentor={m}/><div className="why"><small>推荐理由</small><p>{m.reason}</p></div><div className="student-actions three"><button className={feedback[m.id]==='first'?'liked':''} onClick={()=>{setFeedback({...feedback,[m.id]:'first'});onNotify(`已标记 ${m.name} 为优先套磁`)}}><Star size={14}/>优先套磁</button><button className={feedback[m.id]==='second'?'liked':''} onClick={()=>{setFeedback({...feedback,[m.id]:'second'});onNotify(`已标记 ${m.name} 为第二批`)}}>第二批</button><button className={feedback[m.id]==='no'?'rejected':''} onClick={()=>{setFeedback({...feedback,[m.id]:'no'});onNotify(`已标记 ${m.name} 为不考虑`)}}>不考虑</button></div></article>})}</div>:<div className="student-preview-empty"><Search size={20}/><strong>还没有加入推荐方案的导师</strong><span>返回老师工作台，选入导师后再发送给学生。</span></div>}
    <div className="student-note"><MessageSquare size={18}/><input value={note} onChange={event=>setNote(event.target.value)} placeholder="对推荐方案还有哪些想法？给选导老师留言..."/><button className="primary" onClick={()=>{if(!note.trim()){onNotify('请先填写反馈内容');return;} onNotify('反馈已提交给选导老师');setNote('')}}>提交反馈</button></div>
  </section>
}

function StudentMentorView({student,mentors,sent,onNotify,notes={},feedback={},onFeedback,feedbackNotes={},onFeedbackNote,studentNote='',onStudentNoteSubmit}) {
  const [note,setNote]=useState(studentNote); const [celebration,setCelebration]=useState(null);
  useEffect(()=>setNote(studentNote||''),[studentNote]);
  const handleFeedback=(mentor,choice)=>{const tone=feedbackMeta(choice)?.tone||'first';const stamp=Date.now();setCelebration({mentorId:mentor.id,tone,stamp});window.setTimeout(()=>setCelebration(current=>current?.stamp===stamp?null:current),850);if(onFeedback)onFeedback(mentor,choice);else onNotify(`已标记 ${mentor.name} 为${feedbackMeta(choice)?.label||'反馈'}`);}; const feedbackCount=mentors.filter(mentor=>feedback[mentor.id]||feedbackNotes[mentor.id]?.trim()).length; const isComplete=Boolean(mentors.length&&feedbackCount===mentors.length);
  const [studentFilters,setStudentFilters]=useState({query:'',location:'all',direction:'all',ranking:'all',open:'all',sort:'fit',status:'all'});
  const locations=Array.from(new Set(mentors.map(mentor=>mentorField(mentor,'Location')).filter(value=>value&&value!=='—')));
  const directions=Array.from(new Set(mentors.flatMap(mentor=>[mentor.dept,mentor.topic]).filter(Boolean)));
  const openings=Array.from(new Set(mentors.map(mentor=>mentor.open).filter(Boolean)));
  const rankNumber=value=>{const match=String(value??'').match(/\d+/);return match?Number(match[0]):Number.MAX_SAFE_INTEGER;};
  const rankMatches=(mentor,ranking)=>{const qs=rankNumber(ranking.qs);const usnews=rankNumber(ranking.usnews);switch(studentFilters.ranking){case'qs10':return qs<=10;case'qs30':return qs<=30;case'us10':return usnews<=10;case'us30':return usnews<=30;case'either30':return qs<=30||usnews<=30;default:return true;}};
  const visibleMentors=mentors.filter(mentor=>{const ranking=mentorRankings(mentor);const feedbackDone=Boolean(feedback[mentor.id]||feedbackNotes[mentor.id]?.trim());const rawValues=Object.values(mentor.rawFields||{}).map(formatFieldValue).join(' ');const haystack=[mentor.name,mentor.school,mentor.dept,mentor.topic,mentor.open,mentorField(mentor,'Location'),rawValues].join(' ').toLowerCase();return(!studentFilters.query||haystack.includes(studentFilters.query.toLowerCase()))&&(studentFilters.location==='all'||mentorField(mentor,'Location')===studentFilters.location)&&(studentFilters.direction==='all'||mentor.dept===studentFilters.direction||mentor.topic===studentFilters.direction)&&(studentFilters.open==='all'||mentor.open===studentFilters.open)&&(studentFilters.status==='all'||(studentFilters.status==='pending'&&!feedbackDone)||(studentFilters.status==='done'&&feedbackDone))&&rankMatches(mentor,ranking);}).sort((left,right)=>{switch(studentFilters.sort){case'qs':return rankNumber(mentorRankings(left).qs)-rankNumber(mentorRankings(right).qs);case'usnews':return rankNumber(mentorRankings(left).usnews)-rankNumber(mentorRankings(right).usnews);case'school':return left.school.localeCompare(right.school,'en');default:return right.fit-left.fit;}});
  const activeFilterCount=[studentFilters.query,studentFilters.location!=='all',studentFilters.direction!=='all',studentFilters.ranking!=='all',studentFilters.open!=='all',studentFilters.status!=='all'].filter(Boolean).length;
  const clearStudentFilters=()=>setStudentFilters(current=>({...current,query:'',location:'all',direction:'all',ranking:'all',open:'all',status:'all'}));
  /*
  return <section className="student-preview"><div className="student-preview-head"><div><span className="student-avatar large">{student.name[0]}</span><div><small>你好，{student.name}</small><h2>你的导师推荐方案</h2><p>老师已经把推荐依据整理成卡片，请按优先级反馈，完整意见会同步给老师。</p></div></div><span className="share-state">{sent?'已发送给学生':'预览模式'}</span></div><div className="student-preview-progress"><div><strong>{feedbackCount}/{mentors.length}</strong><span>位导师已反馈</span></div><i><em style={{width:`${mentors.length?feedbackCount/mentors.length*100:0}%`}}></em></div>{mentors.length?<div className="student-mentor-grid">{mentors.map((m,index)=>{const ranking=mentorRankings(m);const selectedFeedback=feedbackMeta(feedback[m.id]);return <article key={m.id}><div className="student-card-top"><span>推荐 {index+1}</span><strong>{m.fit}% 匹配</strong></div><h3>{m.name}</h3><p className="school-name">{m.school} · {m.dept}</p><div className="student-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(m,'Location')}</span><span>{m.dept}</span></div><div className="research-area"><small>研究方向</small><b>{m.topic}</b></div><MentorLinks mentor={m}/><MentorNoteReadonly note={mentorRecommendationNote(m,notes)}/><div className="student-actions four">{feedbackOptions.map(option=><button key={option.id} className={selectedFeedback?.id===option.id?`feedback-selected ${option.tone}`:''} onClick={()=>handleFeedback(m,option.id)}>{option.id==='first'&&<Star size={14}/>} {option.short}</button>)}</div>{selectedFeedback&&<div className={`student-feedback-tag ${selectedFeedback.tone}`}><CheckCircle2 size={12}/>已选择：{selectedFeedback.label}</div>}</article>})}</div>:<div className="student-preview-empty"><Search size={20}/><strong>还没有加入推荐方案的导师</strong><span>返回老师工作台，选入导师后再发送给学生。</span></div>}<div className="student-note"><MessageSquare size={18}/><input value={note} onChange={event=>setNote(event.target.value)} placeholder="对推荐方案还有哪些想法？给选导老师留言..."/><button className="primary" onClick={()=>{if(!note.trim()){onNotify('请先填写反馈内容');return;}onNotify('反馈已提交给选导老师');setNote('')}}>提交留言</button></div></section>;
  */
  return <section className="student-preview">
    <div className="student-preview-head"><div><span className="student-avatar large">{student.name[0]}</span><div><small>你好，{student.name}</small><h2>你的导师推荐方案</h2><p>老师已经把推荐依据整理成卡片，请按优先级反馈，完整意见会同步给老师。</p></div></div><span className="student-preview-pet" aria-hidden="true"><PawPrint size={15}/><Bone size={13}/></span><span className="share-state">{sent?'已发送给学生':'预览模式'}</span></div>
    <div className={isComplete?'student-preview-progress complete':'student-preview-progress'}><div><strong>{feedbackCount}/{mentors.length}</strong><span>位导师已完成反馈</span></div><i><em style={{width:(mentors.length?feedbackCount/mentors.length*100:0)+'%'}}></em></i>{isComplete&&<span className="feedback-complete-copy"><CheckCircle2 size={11}/>全部完成</span>}</div><div className="student-filter-panel"><div className="student-filter-head"><div><span className="student-filter-kicker"><SlidersHorizontal size={14}/>多维筛选</span><strong>按你的关注点查找导师</strong></div><span className="student-filter-result">{visibleMentors.length}/{mentors.length} 位</span></div><div className="student-feedback-filters" role="group" aria-label="按反馈状态筛选"><span><CheckCircle2 size={12}/>反馈状态</span><button type="button" className={studentFilters.status==='all'?'active':''} aria-pressed={studentFilters.status==='all'} onClick={()=>setStudentFilters(current=>({...current,status:'all'}))}>全部 <b>{mentors.length}</b></button><button type="button" className={studentFilters.status==='pending'?'active':''} aria-pressed={studentFilters.status==='pending'} onClick={()=>setStudentFilters(current=>({...current,status:'pending'}))}>待反馈 <b>{mentors.length-feedbackCount}</b></button><button type="button" className={studentFilters.status==='done'?'active':''} aria-pressed={studentFilters.status==='done'} onClick={()=>setStudentFilters(current=>({...current,status:'done'}))}>已反馈 <b>{feedbackCount}</b></button></div><div className="student-filter-grid"><label className="student-filter-search"><Search size={14}/><input aria-label="搜索推荐导师" value={studentFilters.query} onChange={event=>setStudentFilters(current=>({...current,query:event.target.value}))} placeholder="搜索导师、学校、方向..."/></label><label><span>国家 / 地区</span><select aria-label="按国家或地区筛选" value={studentFilters.location} onChange={event=>setStudentFilters(current=>({...current,location:event.target.value}))}><option value="all">全部地区</option>{locations.map(location=><option key={location} value={location}>{location}</option>)}</select></label><label><span>研究方向</span><select aria-label="按研究方向筛选" value={studentFilters.direction} onChange={event=>setStudentFilters(current=>({...current,direction:event.target.value}))}><option value="all">全部方向</option>{directions.map(direction=><option key={direction} value={direction}>{direction}</option>)}</select></label><label><span>排名条件</span><select aria-label="按排名筛选" value={studentFilters.ranking} onChange={event=>setStudentFilters(current=>({...current,ranking:event.target.value}))}><option value="all">不限排名</option><option value="qs10">QS 前 10</option><option value="qs30">QS 前 30</option><option value="us10">US News 前 10</option><option value="us30">US News 前 30</option><option value="either30">QS / US News 前 30</option></select></label><label><span>招生窗口</span><select aria-label="按招生窗口筛选" value={studentFilters.open} onChange={event=>setStudentFilters(current=>({...current,open:event.target.value}))}><option value="all">全部窗口</option>{openings.map(opening=><option key={opening} value={opening}>{opening}</option>)}</select></label><label><span>排序方式</span><select aria-label="学生端导师排序" value={studentFilters.sort} onChange={event=>setStudentFilters(current=>({...current,sort:event.target.value}))}><option value="fit">匹配度优先</option><option value="qs">QS 排名优先</option><option value="usnews">US News 优先</option><option value="school">学校名称</option></select></label></div>{activeFilterCount>0&&<div className="student-filter-summary"><span><CheckCircle2 size={13}/>已应用 {activeFilterCount} 个筛选条件</span><button type="button" onClick={clearStudentFilters}><X size={13}/>清除条件</button></div>}</div>
    {visibleMentors.length ? <div className="student-mentor-grid">{visibleMentors.map((m,index)=>{const ranking=mentorRankings(m);const selectedFeedback=feedbackMeta(feedback[m.id]);const isCelebrating=celebration?.mentorId===m.id;return <article className={`${selectedFeedback?'feedback-settled ':''}${isCelebrating?'feedback-celebrating':''}`} key={m.id}>{isCelebrating&&<span className={`feedback-burst ${celebration.tone}`} aria-hidden="true"><i className="spark spark-one"></i><i className="spark spark-two"></i><i className="spark spark-three"></i><PawPrint className="burst-paw" size={18}/><Star className="burst-star" size={18}/><Bone className="burst-bone" size={16}/></span>}<div className="student-card-top"><span>推荐 {index+1}</span><div className="student-card-top-meta"><strong>{m.fit}% 匹配</strong><em className={selectedFeedback||feedbackNotes[m.id]?'done':'pending'}>{selectedFeedback||feedbackNotes[m.id]?<><CheckCircle2 size={11}/>已反馈</>:<><MessageSquare size={11}/>待反馈</>}</em></div></div><h3>{m.name}</h3><p className="school-name">{m.school} · {m.dept}</p><div className="student-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(m,'Location')}</span><span>招生 {m.open||'待确认'}</span><span>{m.dept}</span></div><div className="research-area"><small>研究方向</small><b>{m.topic}</b></div><MentorLinks mentor={m}/><MentorNoteReadonly note={mentorRecommendationNote(m,notes)}/><div className="student-actions four">{feedbackOptions.map(option=><button key={option.id} aria-pressed={selectedFeedback?.id===option.id} className={selectedFeedback?.id===option.id?`feedback-selected ${option.tone}`:''} onClick={()=>handleFeedback(m,option.id)}>{option.id==='first'&&<Star size={14}/>} {option.short}</button>)}</div>{selectedFeedback&&<div className={`student-feedback-tag ${selectedFeedback.tone}`}><CheckCircle2 size={12}/>已完成反馈：{selectedFeedback.label}</div>}<MentorFeedbackComposer mentor={m} value={feedbackNotes[m.id]||''} onSave={onFeedbackNote||(()=>{})}/></article>})}</div> : <div className="student-preview-empty"><Search size={20}/><strong>{mentors.length?'没有符合条件的导师':'还没有加入推荐方案的导师'}</strong><span>{mentors.length?'试试清除一个筛选条件，或换一个研究方向。':'返回老师工作台，选入导师后再发送给学生。'}</span></div>}
    <div className="student-note"><MessageSquare size={18}/><input value={note} onChange={event=>setNote(event.target.value)} placeholder="对推荐方案还有哪些想法？给选导老师留言..."/><button className="primary" onClick={()=>{if(!note.trim()){onNotify('请先填写反馈内容');return;}if(onStudentNoteSubmit)onStudentNoteSubmit(note.trim());else onNotify('反馈已提交给选导老师');setNote('')}}>提交留言</button></div>
  </section>;
}

function Sidebar({ active, setActive }) {
  return <aside className="sidebar">
    <Brand/>
    <nav>{nav.map(([Icon, label]) => <button key={label} className={active === label ? 'active' : ''} onClick={() => setActive(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
    <button className="collapse"><Menu size={18}/><span>收起</span></button>
  </aside>;
}

function MobileNav({active, setActive, onClose}) {
  return <div className="mobile-nav-backdrop" onMouseDown={onClose}><aside className="mobile-nav-drawer" onMouseDown={event=>event.stopPropagation()}><div className="mobile-nav-head"><Brand compact/><button className="icon-btn" onClick={onClose} aria-label="关闭导航"><X size={20}/></button></div><nav>{nav.map(([Icon, label])=><button key={label} className={active===label?'active':''} onClick={()=>{setActive(label);onClose();}}><Icon size={18}/><span>{label}</span></button>)}</nav></aside></div>;
}

function Topbar({ query, setQuery, onStudentView, onMenu, onNotify, session }) {
  return <header className="topbar">
    <button className="icon-btn mobile-menu" aria-label="打开导航" onClick={onMenu}><Menu size={19}/></button>
    <div className="mobile-brand"><Brand compact/></div>
    <label className="search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索学生、申请、院校、任务..."/><kbd>⌘ K</kbd></label>
    <div className="top-actions"><button className="portal-switch" onClick={onStudentView}><Eye size={15}/>学生预览</button><button className="icon-btn" aria-label="新建" onClick={()=>onNotify('新建快捷入口已准备')}><Plus size={20}/></button><button className="icon-btn bell" aria-label="通知" onClick={()=>onNotify('暂无新的高优先级通知')}><Bell size={19}/><i>6</i></button><button className="icon-btn" aria-label="帮助" onClick={()=>onNotify('帮助中心即将开放')}><CircleHelp size={19}/></button><span className="avatar">{session?.name?.slice(0,1)||'张'}</span><div className="profile"><strong>{session?.name||'张晓彤'}</strong><small>{session?.title||'资深顾问'}</small></div><ChevronDown size={16}/></div>
  </header>;
}

function Toast({message}) {
  return message ? <div className="toast" role="status"><CheckCircle2 size={16}/><span>{message}</span></div> : null;
}

function ApplicationCard({ app, selected, onClick, onMove }) {
  const stageIndex = stages.findIndex(s => s.id === app.stage);
  return <article className={`application-card ${selected ? 'selected' : ''}`} onClick={onClick}>
    <div className="card-head"><strong>{app.name}</strong><span className="owner">{app.owner.slice(-1)}</span></div>
    <p>{app.school} · {app.program}</p>
    <div className="card-foot"><span>{app.intake}</span>{app.stage === 'offer' && <em>已确定</em>}</div>
    <div className="card-actions">
      {stageIndex > 0 && <button title="移至上一阶段" onClick={e => {e.stopPropagation(); onMove(app.id, stages[stageIndex - 1].id)}}>‹</button>}
      {stageIndex < stages.length - 1 && <button title="推进至下一阶段" onClick={e => {e.stopPropagation(); onMove(app.id, stages[stageIndex + 1].id)}}>›</button>}
    </div>
  </article>;
}

function Pipeline({ apps, selectedId, setSelectedId, onMove }) {
  return <div className="pipeline">
    {stages.map(stage => {
      const rows = apps.filter(a => a.stage === stage.id);
      return <section className="stage" key={stage.id}>
        <div className="stage-head"><span className="dot" style={{background: stage.color}}></span><strong>{stage.label}</strong><span>{rows.length}</span><MoreHorizontal size={17}/></div>
        <div className="stage-list">{rows.map(app => <ApplicationCard key={app.id} app={app} selected={app.id === selectedId} onClick={() => setSelectedId(app.id)} onMove={onMove}/>)}</div>
        <button className="add-link"><Plus size={16}/>新增申请</button>
      </section>;
    })}
  </div>;
}

function DetailPanel({ app, onClose }) {
  if (!app) return null;
  return <section className="detail-panel">
    <div className="student-summary">
      <div className="detail-title"><strong>{app.name}</strong>{app.priority && <span>重点学生</span>}</div>
      <p>学生ID：S2504178　|　{app.phone || '136****2188'}　|　{app.email || `${app.name}@email.com`}</p>
      <div className="student-fields"><div><small>申请院校</small><b>{app.school}</b></div><div><small>申请专业</small><b>{app.program}</b></div><div><small>入学季</small><b>{app.intake}</b></div><div><small>负责顾问</small><b>{app.owner}</b></div></div>
    </div>
    <div className="document-summary">
      <div className="doc-heading"><span>材料清单进度（6/10）</span><b>{app.progress}%</b></div>
      <div className="progress"><i style={{width: `${app.progress}%`}}></i></div>
      <div className="doc-grid">{documents.map(([name, done, status]) => <div className="doc-item" key={name}><span className={done ? 'doc-check done' : 'doc-check'}>{done && <Check size={11}/>}</span><span>{name}</span><em>{done ? '已完成' : status || '未开始'}</em></div>)}</div>
    </div>
    <button className="close-detail icon-btn" onClick={onClose} aria-label="关闭详情"><X size={18}/></button>
  </section>;
}

function TaskRail({ tasks, setTasks }) {
  const [tab, setTab] = useState('todo');
  const visible = tasks.filter(t => tab === 'done' ? t.done : !t.done);
  return <aside className="task-rail">
    <div className="rail-title"><h2>今日任务</h2><button>更多</button></div>
    <div className="task-tabs"><button className={tab === 'todo' ? 'active' : ''} onClick={() => setTab('todo')}>待办 ({tasks.filter(t => !t.done).length})</button><button className={tab === 'done' ? 'active' : ''} onClick={() => setTab('done')}>已完成 ({tasks.filter(t => t.done).length})</button></div>
    <div className="task-list">{visible.length ? visible.map(task => <button className="task-row" key={task.id} onClick={() => setTasks(items => items.map(t => t.id === task.id ? {...t, done: !t.done} : t))}>
      <span className={`task-time ${task.level === '高' ? 'urgent' : ''}`}>{task.time}</span><span className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span><span className={`level ${task.level}`}>{task.level}</span>
    </button>) : <div className="empty"><Check size={24}/><p>今天的任务都完成了</p></div>}</div>
    <button className="new-task"><Plus size={16}/>新建任务</button>
  </aside>;
}

function NewStudentModal({ onClose, onCreate }) {
  const [name, setName] = useState(''); const [school, setSchool] = useState('');
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal" onMouseDown={e => e.stopPropagation()} onSubmit={e => {e.preventDefault(); if(name && school) onCreate(name, school)}}>
    <div className="modal-head"><h2>新建学生</h2><button type="button" className="icon-btn" onClick={onClose}><X size={18}/></button></div>
    <label>学生姓名<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="请输入姓名"/></label>
    <label>意向院校<input value={school} onChange={e => setSchool(e.target.value)} placeholder="例如：伦敦大学学院"/></label>
    <label>入学季<select><option>2025年秋季</option><option>2026年春季</option><option>2026年秋季</option></select></label>
    <div className="modal-actions"><button type="button" onClick={onClose}>取消</button><button className="primary" type="submit">创建学生</button></div>
  </form></div>;
}

export function App() {
  const [active, setActive] = useState('选导'); const [query, setQuery] = useState('');
  const [intake, setIntake] = useState('全部入学季'); const [applications, setApplications] = useState(initialApplications);
  const [selectedId, setSelectedId] = useState(1); const [tasks, setTasks] = useState(initialTasks); const [modal, setModal] = useState(false); const [modalContext,setModalContext]=useState('application'); const [studentRecords,setStudentRecords]=useState(students); const [session,setSession]=useState(readSession); const [portalMode,setPortalMode] = useState(null); const [mobileMenu, setMobileMenu] = useState(false); const [toast,setToast]=useState('');
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),2800);return()=>clearTimeout(timer)},[toast]);
  const filtered = useMemo(() => applications.filter(a => (intake === '全部入学季' || a.intake === intake) && [a.name,a.school,a.program].join(' ').toLowerCase().includes(query.toLowerCase())), [applications, intake, query]);
  const selected = applications.find(a => a.id === selectedId);
  const move = (id, stage) => setApplications(items => items.map(a => a.id === id ? {...a, stage} : a));
  const create = (name, school) => { if(modalContext==='student'){const record={id:Date.now(),name,initial:name.slice(0,1),target:`待确认 · ${school}`,service:'留学申请全流程',stage:'选导中',progress:5,count:0,manager:'张晓彤',comms:'待分配',select:'待分配',writing:'待分配',visa:'待分配',due:'待确认',payment:'待收款',invite:`QX${Date.now().toString().slice(-6)}`};setStudentRecords(records=>[record,...records]);setActive('学生');notify(`${name} 已创建，已进入学生服务列表`);}else{const app = {id: Date.now(), stage:'prep', name, school, program:'待确认专业', intake:'2025年秋季', owner:'张晓彤', progress:10}; setApplications([app, ...applications]); setSelectedId(app.id);notify(`${name} 的申请项目已创建`);} setModal(false); };
  const notify = message => setToast(message);
  const handleLogin = next => { setSession(next); setPortalMode(null); try { window.localStorage.setItem(SESSION_KEY, JSON.stringify(next)); } catch {} };
  const logout = () => { setSession(null); setPortalMode(null); try { window.localStorage.removeItem(SESSION_KEY); } catch {} };
  if (!session) return <LoginScreen onLogin={handleLogin}/>;
  const studentProfile = session.role === 'student' ? {id:session.studentId||DEMO_STUDENT.id,name:session.name,target:session.target||DEMO_STUDENT.target,invite:session.invite||DEMO_STUDENT.invite} : DEMO_STUDENT;
  if (session.role === 'student') return <><StudentPortal student={studentProfile} onExit={logout} onNotify={notify}/><Toast message={toast}/></>;
  if (portalMode === 'teacher-preview') return <><StudentPortal preview student={studentProfile} onExit={()=>setPortalMode(null)} onNotify={notify}/><Toast message={toast}/></>;
  const navigate = label => { setActive(label); setMobileMenu(false); };
  const content = active === '工作台' ? <DashboardView setActive={navigate}/> : active === '学生' ? <StudentsView setActive={navigate} studentRecords={studentRecords} onNewStudent={()=>{setModalContext('student');setModal(true)}} onNotify={notify}/> : active === '选导' ? <MentorWorkspace onNotify={notify}/> : active === '申请' ? <main><section className="main-content"><div className="page-head"><div><h1>申请工作台</h1><p>跟进院校申请进度，及时处理关键节点</p></div><div className="head-actions"><label className="select-wrap"><select value={intake} onChange={e => setIntake(e.target.value)}><option>全部入学季</option><option>2025年秋季</option><option>2026年春季</option></select><ChevronDown size={15}/></label><button className="filter-btn"><SlidersHorizontal size={16}/>筛选</button><button className="primary" onClick={() => {setModalContext('application');setModal(true)}}><UserPlus size={17}/>新建学生</button></div></div><div className="metrics"><div><small>总申请数</small><strong>{applications.length}</strong></div>{stages.map(s => <div key={s.id}><small><i style={{background:s.color}}></i>{s.label}</small><strong>{applications.filter(a => a.stage === s.id).length}</strong><span>{Math.round(applications.filter(a => a.stage === s.id).length / applications.length * 100)}%</span></div>)}<div><small>录取率</small><strong>45.7%</strong></div></div><Pipeline apps={filtered} selectedId={selectedId} setSelectedId={setSelectedId} onMove={move}/><DetailPanel app={selected} onClose={() => setSelectedId(null)}/></section><TaskRail tasks={tasks} setTasks={setTasks}/></main> : ['文书','签证','收款','任务'].includes(active) ? <ModuleView module={active} setActive={navigate}/> : <ModuleView module="任务" setActive={navigate}/>;
  return <div className="app-shell"><Sidebar active={active} setActive={navigate}/><div className="workspace"><Topbar query={query} setQuery={setQuery} session={session} onStudentView={()=>setPortalMode('teacher-preview')} onMenu={()=>setMobileMenu(true)} onNotify={notify}/>{content}</div>{mobileMenu&&<MobileNav active={active} setActive={navigate} onClose={()=>setMobileMenu(false)}/>} {modal && <NewStudentModal onClose={() => setModal(false)} onCreate={create}/>}<Toast message={toast}/></div>;
}
