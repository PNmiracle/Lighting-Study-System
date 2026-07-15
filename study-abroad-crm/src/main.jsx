import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell, BookOpen, Check, ChevronDown, CircleHelp, ClipboardCheck,
  FileText, GraduationCap, LayoutDashboard, Menu, MoreHorizontal,
  Plus, Search, SlidersHorizontal, SquareCheckBig, UserPlus,
  Users, X, ArrowUpRight, Building2, Send, Star, Eye, MessageSquare, Upload,
  WalletCards, PenLine, ShieldCheck, Clock3, CheckCircle2, LayoutList,
  ArrowRight, RefreshCw, CircleDollarSign, UserRound, BriefcaseBusiness,
  CalendarDays, Paperclip, CloudUpload, Download, Grid2X2, Table2, ChevronLeft, ChevronRight,
  ExternalLink, ListFilter, File, PawPrint, Bone, Languages, Trash2,
  MapPin, GitCompareArrows, Mail, Globe2, Settings2, Database
} from 'lucide-react';
import { additionalApplications, additionalStudents, additionalTasks, schoolCatalog, serviceItems as initialServiceItems, staffDirectory } from './demo-data.js';
import { apiRequest } from './client/api.js';

const stages = [
  { id: 'prep', label: '准备材料', color: '#ff9d3f' },
  { id: 'submitted', label: '已递交', color: '#d96b42' },
  { id: 'review', label: '审核中', color: '#ffd568' },
  { id: 'offer', label: '已录取', color: '#b8423d' }
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
  { id: 13, stage: 'offer', name: '蒋文博', school: '不列颠哥伦比亚大学', program: 'MSc Vantage', intake: '2026年春季', owner: '叶雯', progress: 100 },
  ...additionalApplications
];

const initialTasks = [
  { id: 1, time: '09:30', title: '跟进推荐信提交', detail: '孙一航 · KCL MSc Data Science', level: '高' },
  { id: 2, time: '10:00', title: '签证材料检查', detail: '刘昊然 · UNSW MSc Engineering', level: '中' },
  { id: 3, time: '11:00', title: '更新申请状态', detail: '陈子涵 · 悉尼大学 Master of IT', level: '中' },
  { id: 4, time: '14:00', title: '电话沟通', detail: '李想 · 多伦多大学', level: '中' },
  { id: 5, time: '15:30', title: '文书初稿反馈', detail: '王雨桐 · 曼彻斯特大学', level: '中' },
  { id: 6, time: '16:30', title: '录取确认跟进', detail: '徐子涵 · LSE MSc Finance', level: '高' },
  ...additionalTasks
];

const documents = [
  ['护照', true], ['简历 (CV)', true], ['成绩单 (中英文)', true],
  ['语言成绩', true], ['推荐信 1', true], ['存款证明', false],
  ['推荐信 2', false, '待提交'], ['作品集 (如适用)', false],
  ['个人陈述 (PS)', false, '待审核'], ['其他补充材料', false]
];

const nav = [
  [LayoutDashboard, '工作台'], [Users, '学生'], [UserRound, '老师团队'], [Search, '选导'], [BriefcaseBusiness, '博士工具'], [ClipboardCheck, '申请'],
  [GraduationCap, '院校库'], [FileText, '文书'], [ShieldCheck, '签证'],
  [WalletCards, '收款'], [SquareCheckBig, '任务']
];

const students = [
  {id:1,name:'林知夏',initial:'林',target:'英国 · AI / HCI 博士',service:'博士申请全流程',stage:'选导中',progress:38,count:6,manager:'张晓彤',comms:'李卓',select:'叶雯',writing:'王老师',visa:'待分配',due:'今日 16:30',payment:'已付 50%',invite:'LINXIA2026'},
  {id:2,name:'周子墨',initial:'周',target:'美国 · 计算机视觉博士',service:'博士申请全流程',stage:'学生确认',progress:52,count:4,manager:'叶雯',comms:'李卓',select:'叶雯',writing:'王老师',visa:'待分配',due:'明日 10:00',payment:'已付清',invite:'ZIMO2026'},
  {id:3,name:'陈一诺',initial:'陈',target:'澳洲 · 商科研究型硕士',service:'研究型硕士申请',stage:'等待套磁',progress:66,count:8,manager:'李卓',comms:'张晓彤',select:'李卓',writing:'赵老师',visa:'签证准备',due:'周五 15:00',payment:'已付 80%',invite:'YINUO2026'},
  {id:4,name:'王雨桐',initial:'王',target:'英国 · 市场营销硕士',service:'硕士申请全流程',stage:'文书初稿',progress:72,count:3,manager:'张晓彤',comms:'张晓彤',select:'未分配',writing:'赵老师',visa:'待分配',due:'周五 18:00',payment:'已付清',invite:'YUTONG2026'},
  {id:5,name:'徐子涵',initial:'徐',target:'英国 · 金融硕士',service:'硕士申请全流程',stage:'录取确认',progress:89,count:2,manager:'李卓',comms:'李卓',select:'李卓',writing:'王老师',visa:'签证材料',due:'下周一',payment:'已付清',invite:'ZIHAN2026'},
  ...additionalStudents,
  {id:16,name:'俞哲轩',initial:'俞',target:'全球 · 青少年心理健康博士',service:'博士申请全流程',stage:'导师初筛',progress:28,count:121,manager:'张晓彤',comms:'李卓',select:'叶雯',writing:'王老师',visa:'待分配',due:'本周完成选导定稿',payment:'待确认',invite:'YUZHEXUAN2027',mentorSource:'yuzhexuan',mentorShareUrl:'https://vika.cn/share/shrTzS4oK9drnKBRsf0r8/dstZnUUzHafFYQXoZT/viwtwGOy6pNXn'}
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

function DashboardView({setActive, students: studentRecords, applications, tasks}) {
  const pendingTasks=tasks.filter(task=>!task.done);
  const overdueTasks=tasks.filter(taskIsOverdue);
  const offerCount=applications.filter(application=>application.stage==='offer').length;
  const offerRate=applications.length?Math.round(offerCount/applications.length*100):0;
  const attentionTasks=pendingTasks.slice(0,3);
  return <section className="dashboard-view">
    <div className="page-head dashboard-head"><div><h1>工作台</h1><p>张晓彤，今天有 {pendingTasks.length} 项任务需要关注</p></div><button className="primary" onClick={()=>setActive('学生')}><UserPlus size={16}/>新建服务项目</button></div>
    <div className="dashboard-stats"><div><small>服务中学生</small><strong>{studentRecords.length}</strong><span>实时数据</span></div><div><small>待处理任务</small><strong>{pendingTasks.length}</strong><span className="warn">{overdueTasks.length} 项已逾期</span></div><div><small>申请项目</small><strong>{applications.length}</strong><span>{offerCount} 项已录取</span></div><div><small>申请录取率</small><strong>{offerRate}%</strong><span>全部申请</span></div></div>
    <div className="dashboard-grid"><section className="work-panel attention"><div className="panel-title"><div><h2>需要你关注</h2><p>按任务列表顺序展示</p></div><button onClick={()=>setActive('任务')}>查看全部 <ArrowRight size={14}/></button></div><div className="attention-list">{attentionTasks.length?attentionTasks.map(task=><button key={task.id} onClick={()=>setActive('任务')}><span className={`attention-time ${task.level==='高'?'red':'orange'}`}>{task.time.includes(' ')?<>{task.time.split(' ')[0]}<br/><b>{task.time.split(' ').slice(1).join(' ')}</b></>:<><b>{task.time}</b></>}</span><span><strong>{task.title}</strong><small>{task.detail||'未关联学生或申请'}</small></span><em>{task.level}</em><ArrowRight size={15}/></button>):<div className="dashboard-empty"><CheckCircle2 size={20}/><span>当前没有待处理任务</span></div>}</div></section><section className="work-panel activity"><div className="panel-title"><div><h2>团队动态</h2><p>最近发生的业务事件</p></div><button>时间线 <ArrowRight size={14}/></button></div><div className="activity-list">{timeline.map((item,i)=><div className="activity-item" key={i}><span className={`activity-icon ${item.color}`}><item.icon size={14}/></span><span><strong>{item.title}</strong><small>{item.detail}</small></span><time>{item.time}</time></div>)}</div></section></div>
    <section className="work-panel student-overview"><div className="panel-title"><div><h2>我的学生</h2><p>当前服务项目的推进状态</p></div><button onClick={()=>setActive('学生')}>查看学生 <ArrowRight size={14}/></button></div><div className="mini-table"><div className="mini-table-head"><span>学生</span><span>服务项目</span><span>当前阶段</span><span>整体进度</span><span>下一截止</span></div>{studentRecords.length?studentRecords.slice(0,4).map(s=><button key={s.id} onClick={()=>setActive('学生')}><span className="person-cell"><i>{s.initial}</i><b>{s.name}<small>{s.target}</small></b></span><span>{s.service}</span><span><em className="status-tag">{s.stage}</em></span><span className="progress-cell"><i><b style={{width:`${s.progress}%`}}></b></i>{s.progress}%</span><span>{s.due}</span></button>):<div className="dashboard-empty"><Users size={20}/><span>还没有学生服务项目</span></div>}</div></section>
  </section>;
}

function StudentsView({setActive, onNewStudent, onEditStudent, onNotify, studentRecords}) {
  const [selected,setSelected]=useState(1); const [search,setSearch]=useState(''); const [stageFilter,setStageFilter]=useState('全部阶段');
  const current=studentRecords.find(s=>s.id===selected) || studentRecords[0]; const rows=studentRecords.filter(s=>`${s.name} ${s.target}`.includes(search) && (stageFilter==='全部阶段' || s.stage===stageFilter));
  const stageOptions=['全部阶段',...new Set(studentRecords.map(s=>s.stage))];
  useEffect(()=>{ if(rows.length && !rows.some(s=>s.id===selected)) setSelected(rows[0].id); },[search,stageFilter,selected]);
  return <section className="students-view"><div className="page-head"><div><h1>学生与服务项目</h1><p>以服务项目为主线，统一管理学生、老师和交付进度</p></div><button className="primary" onClick={onNewStudent}><UserPlus size={16}/>新建学生</button></div><div className="student-layout"><aside className="student-list-panel"><label className="inline-search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索学生"/></label><div className="list-filter"><span>{stageFilter==='全部阶段'&&!search?'全部学生':'筛选结果'} <b>{rows.length}</b></span><label className="list-filter-control"><SlidersHorizontal size={14}/><select value={stageFilter} onChange={e=>setStageFilter(e.target.value)} aria-label="按阶段筛选学生">{stageOptions.map(option=><option key={option}>{option}</option>)}</select></label></div>{rows.length ? rows.map(s=><button className={`student-row ${selected===s.id?'active':''}`} key={s.id} onClick={()=>setSelected(s.id)} aria-pressed={selected===s.id}><i>{s.initial}</i><span><strong>{s.name}</strong><small>{s.target}</small></span><em>{s.stage}</em></button>) : <div className="student-list-empty"><Search size={18}/><span>没有符合条件的学生</span></div>}</aside><section className="student-detail"><div className="student-detail-head"><div className="profile-block"><span className="student-avatar large">{current.initial}</span><div><h2>{current.name}</h2><p>{current.target} · {current.service}</p><span className="invite-code">邀请码 {current.invite}</span></div></div><div className="detail-actions"><button onClick={()=>onNotify(`已复制 ${current.name} 的学生邀请链接`)}><Send size={14}/>发送邀请</button><button onClick={()=>onEditStudent(current)}><PenLine size={14}/>编辑档案</button><button className="primary" onClick={()=>setActive('选导')}><Search size={14}/>进入选导</button></div></div><div className="case-progress"><div className="progress-title"><span>服务项目整体进度</span><strong>{current.progress}%</strong></div><div className="wide-progress"><i style={{width:`${current.progress}%`}}></i></div><div className="case-stages"><span className="complete">咨询确认</span><span className="complete">选导</span><span className={current.progress>55?'complete':''}>文书</span><span className={current.progress>80?'complete':''}>申请</span><span>签证</span></div></div><div className="detail-columns"><section><div className="section-heading"><h3>老师分工</h3><button onClick={()=>onEditStudent(current)}><Plus size={14}/>添加老师</button></div><div className="assignment-list">{[['管理老师',current.manager,'项目负责人'],['沟通老师',current.comms,'学生沟通'],['选导老师',current.select,'导师推荐'],['文书老师',current.writing,'文书交付'],['签证老师',current.visa,'签证流程']].map(([role,name,desc])=><div key={role}><span className="role-avatar">{name==='待分配'?'?':name.slice(-1)}</span><span><strong>{role}</strong><small>{desc}</small></span><b>{name}</b><button onClick={()=>onEditStudent(current)}>更换</button></div>)}</div></section><section><div className="section-heading"><h3>服务摘要</h3><button onClick={()=>onEditStudent(current)}>编辑</button></div><div className="summary-grid"><div><small>下一截止</small><b>{current.due}</b></div><div><small>收款状态</small><b>{current.payment}</b></div><div><small>导师候选</small><b>{current.count} 位</b></div><div><small>学生入口</small><b>已生成</b></div></div><div className="student-note-box"><MessageSquare size={15}/><span>最近沟通：学生希望优先考虑英国院校，研究方向偏向 HCI。</span></div></section></div><FileUploadPanel caseId={`student-${current.id}`} uploadedBy="老师 · 张晓彤" title="服务项目共享文件"/></section></div></section>;
}

function ModuleView({module,items,onNew,onEdit,onDelete,setActive}) {
  const [filter,setFilter]=useState('all');
  const [search,setSearch]=useState('');
  const [ownerFilter,setOwnerFilter]=useState('全部负责人');
  const data=items.filter(item=>item.module===module);
  const meta={文书:['文书交付','集中处理版本、批注和定稿节点',PenLine,'4 个项目待处理'],签证:['签证流程','追踪材料、预约和递交状态',ShieldCheck,'2 个项目待跟进'],收款:['轻量收款','服务套餐、分期和退款状态',WalletCards,'1 笔款项待确认'],任务:['任务中心','跨角色统一管理截止时间和交接',SquareCheckBig,'12 项待办']}[module];
  const ModuleIcon=meta[2];
  const complete=item=>/已完成|已付清|已定稿/.test(item.status)||item.due==='已完成';
  const owners=['全部负责人',...new Set(data.map(item=>item.owner))];
  const visible=data.filter(item=>(filter==='all'||(filter==='done'?complete(item):!complete(item)))&&(ownerFilter==='全部负责人'||item.owner===ownerFilter)&&`${item.student} ${item.subject} ${item.owner} ${item.status} ${item.amount}`.toLowerCase().includes(search.toLowerCase()));
  const completed=data.filter(complete).length;
  const high=data.filter(item=>item.priority==='高'&&!complete(item)).length;
  return <section className="module-view"><div className="page-head"><div><h1>{meta[0]}</h1><p>{meta[1]}</p></div><div className="module-actions"><button className="primary" onClick={()=>onNew(module)}><Plus size={15}/>新建{module==='收款'?'收款记录':module==='签证'?'签证事项':'文书任务'}</button></div></div><div className="module-summary"><div className="module-icon"><ModuleIcon size={20}/></div><div><small>当前事项</small><strong>{data.length}</strong></div><div><small>已完成</small><strong>{completed}</strong></div><div><small>高优先级</small><strong>{high}</strong></div><div><small>参与老师</small><strong>{new Set(data.map(item=>item.owner).filter(owner=>owner!=='待分配')).size}</strong></div><div className="module-link" onClick={()=>setActive('工作台')}>返回工作台 <ArrowRight size={15}/></div></div><div className="module-board"><div className="module-tabs service-module-tabs"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>全部 {data.length}</button><button className={filter==='pending'?'active':''} onClick={()=>setFilter('pending')}>待处理 {data.length-completed}</button><button className={filter==='done'?'active':''} onClick={()=>setFilter('done')}>已完成 {completed}</button><label className="service-owner-filter"><UserRound size={14}/><select value={ownerFilter} onChange={event=>setOwnerFilter(event.target.value)} aria-label="按负责人筛选业务事项">{owners.map(owner=><option key={owner}>{owner}</option>)}</select></label><label><Search size={14}/><input value={search} onChange={event=>setSearch(event.target.value)} placeholder="搜索学生、项目..."/></label></div><div className="module-table service-module-table"><div className="module-table-head"><span>学生 / 服务项目</span><span>{module==='收款'?'金额':'交付内容'}</span><span>负责人</span><span>当前状态</span><span>截止时间</span><span>操作</span></div>{visible.length?visible.map(item=><article className="module-row service-module-row" key={item.id}><span className="person-cell"><i>{item.student[0]}</i><b>{item.student}<small>{item.subject}</small></b></span><span className="service-subject">{module==='收款'?item.amount:item.subject}</span><span>{item.owner}</span><span><em className={`pill priority-${item.priority}`}>{item.status}</em></span><span>{item.due}</span><span className="service-row-actions"><button onClick={()=>onEdit(item)} title="编辑事项" aria-label={`编辑 ${item.student} ${item.subject}`}><PenLine size={15}/></button><button className="danger" onClick={()=>onDelete(item)} title="删除事项" aria-label={`删除 ${item.student} ${item.subject}`}><Trash2 size={15}/></button></span></article>):<div className="service-module-empty"><ClipboardCheck size={25}/><strong>没有符合条件的业务事项</strong><span>调整筛选条件或新建一条记录</span></div>}</div></div></section>;
}

function Brand({portal=false, compact=false}) {
  return <div className={`brand ${portal?'portal-brand':''} ${compact?'compact':''}`}><span className="brand-mark"><img src="/brand-qingxue-dog.png" alt="乐意轻学博士柴犬"/></span><span className="brand-copy"><strong className="brand-name">乐意轻学</strong>{portal&&<small>学生服务中心</small>}{!compact&&!portal&&<small>留学申请 CRM</small>}</span><span className="brand-paw" aria-hidden="true"><PawPrint size={13}/></span></div>;
}

const SESSION_KEY='qingxue-crm-session';
const LANGUAGE_KEY='qingxue-crm-language';
const DEMO_STUDENT={id:1,name:'林知夏',target:'英国 · AI / HCI 博士',invite:'LINXIA2026'};
const YUZHEXUAN_STUDENT={id:16,name:'俞哲轩',target:'全球 · 青少年心理健康博士',invite:'YUZHEXUAN2027'};
const STUDENT_LOGINS=[DEMO_STUDENT,YUZHEXUAN_STUDENT];

const zhToEnCopy={
  '乐意轻学':'Qingxue',
  '留学申请 CRM':'Study Abroad CRM',
  '学生服务中心':'Student Service Center',
  '申请路上，每一步都有老师陪你':'Guided support for every application step',
  '留学申请协作空间':'Study Abroad Collaboration Hub',
  '为学生的全力以赴':'Backing every student who gives their all',
  '随时撑腰':'Always by your side',
  '选导、文书、申请、签证和共享材料，都围绕服务项目持续同步。':'Mentor matching, writing, applications, visas, and shared files all sync around each service case.',
  '欢迎回到轻学教育':'Welcome Back',
  '进入老师工作台':'Teacher Workspace',
  '进入学生服务中心':'Student Service Center',
  '查看负责学生、导师推荐和协作任务。':'Review assigned students, mentor recommendations, and team tasks.',
  '打开专属服务项目，查看推荐并反馈意向。':'Open your service case, review recommendations, and send feedback.',
  '老师登录':'Teacher Login',
  '学生入口':'Student Portal',
  '老师账号':'Teacher Account',
  '登录密码':'Password',
  '学生姓名':'Student Name',
  '服务项目邀请码':'Service Invite Code',
  '进入老师工作台':'Enter Teacher Workspace',
  '进入我的服务项目':'Enter My Service Case',
  '当前为演示环境':'Demo environment',
  '老师账号由机构管理员分配':'Teacher accounts are assigned by admins',
  '学生使用服务项目邀请码进入':'Students enter with a service invite code',
  '工作台':'Dashboard',
  '学生':'Students',
  '老师团队':'Team',
  '选导':'Mentor Match',
  '博士工具':'PhD Tools',
  '申请':'Applications',
  '院校库':'School Library',
  '选校资料中心':'School Research Center',
  '集中查看院校排名、项目方向、申请截止和团队在办项目。':'Review rankings, program areas, deadlines, and active team applications in one place.',
  '新建申请':'New Application',
  '收录院校':'Schools',
  '项目方向':'Program Areas',
  '已收藏':'Favorites',
  '个人选校清单':'Personal Shortlist',
  '在办申请':'Active Applications',
  '查看申请':'View Applications',
  '搜索院校、城市、项目方向':'Search schools, cities, or programs',
  '全部地区':'All Regions',
  '全部学位':'All Degrees',
  '硕士':'Master',
  '博士':'PhD',
  '排名优先':'Sort by Ranking',
  '在办项目优先':'Sort by Active Cases',
  '院校名称':'School Name',
  '仅看收藏':'Favorites Only',
  '卡片视图':'Card View',
  '列表视图':'List View',
  '院校对比':'School Comparison',
  '清空对比':'Clear Comparison',
  '院校':'School',
  'QS 排名':'QS Ranking',
  '地区':'Region',
  '学位':'Degree',
  '学费参考':'Tuition Estimate',
  '申请截止':'Application Deadline',
  '加入对比':'Compare',
  '已加入对比':'Added to Compare',
  '院校官网':'School Website',
  '发起申请':'Start Application',
  '在办':'Active',
  '操作':'Actions',
  '没有找到符合条件的院校':'No matching schools found',
  '清除筛选条件':'Clear Filters',
  '新建申请项目':'New Application',
  '创建申请':'Create Application',
  '新增院校':'Add School',
  '编辑院校':'Edit School',
  '编辑院校档案':'Edit School Profile',
  '维护院校排名、项目和申请信息':'Maintain school rankings, programs, and application information',
  '院校信息':'School Information',
  '院校中文名':'Chinese Name',
  '院校英文名':'English Name',
  '国家 / 地区':'Country / Region',
  '城市':'City',
  '项目与排名':'Programs and Ranking',
  '学位类型':'Degree Types',
  '入学季':'Intake',
  '申请信息':'Application Information',
  '院校标签':'School Tags',
  '使用顿号或逗号分隔多个方向':'Separate multiple areas with commas',
  '删除档案':'Delete Profile',
  '保存修改':'Save Changes',
  '确认新增':'Add Record',
  '文书':'Writing',
  '签证':'Visa',
  '收款':'Payments',
  '任务':'Tasks',
  '团队工作台':'Team Workspace',
  '查看每位老师的负责学生、申请项目与待办任务，及时平衡团队工作量。':'Review each teacher’s students, applications, and pending tasks to keep workloads balanced.',
  '团队成员':'Team Members',
  '服务中学生':'Active Students',
  '待处理任务':'Pending Tasks',
  '可继续分配':'Available Capacity',
  '全部角色':'All Roles',
  '项目管理':'Case Management',
  '沟通协作':'Communication',
  '选导服务':'Mentor Matching',
  '文书服务':'Writing',
  '签证服务':'Visa',
  '搜索姓名、职位或擅长方向':'Search name, role, or specialty',
  '按工作量排序':'Sort by Workload',
  '按姓名排序':'Sort by Name',
  '负责学生':'Students',
  '申请项目':'Applications',
  '待办任务':'To-dos',
  '工作量适中':'Balanced',
  '接近满载':'Near Capacity',
  '当前满载':'At Capacity',
  '当前职责':'Current Assignments',
  '负责的学生':'Assigned Students',
  '负责的申请':'Owned Applications',
  '未完成任务':'Incomplete Tasks',
  '前往任务中心':'Open Task Center',
  '暂无负责学生':'No assigned students',
  '暂无负责申请':'No owned applications',
  '暂无待办任务':'No pending tasks',
  '没有找到匹配的老师':'No matching teachers',
  '新增老师':'Add Teacher',
  '编辑老师档案':'Edit Teacher Profile',
  '维护老师的角色与擅长方向':'Maintain the teacher role and specialties',
  '基本信息':'Basic Information',
  '老师姓名':'Teacher Name',
  '岗位角色':'Role',
  '擅长方向':'Specialty',
  '团队排序':'Team Sorting',
  '工作量':'Workload',
  '沟通':'Communication',
  '当前事项':'Current Items',
  '参与老师':'Teachers Involved',
  '全部负责人':'All Owners',
  '按负责人筛选业务事项':'Filter Service Items by Owner',
  '没有符合条件的业务事项':'No matching service items',
  '调整筛选条件或新建一条记录':'Adjust filters or create a record',
  '编辑事项':'Edit Item',
  '删除事项':'Delete Item',
  '记录负责人、当前状态和下一截止时间':'Track the owner, current status, and next deadline',
  '版本与交付管理':'Version and Delivery Management',
  '材料与递交流程':'Materials and Submission Process',
  '合同与分期记录':'Contracts and Installments',
  '关联学生':'Related Student',
  '文书内容':'Writing Deliverable',
  '签证事项':'Visa Item',
  '服务套餐':'Service Package',
  '合同 / 到账金额':'Contract / Received Amount',
  '创建事项':'Create Item',
  '编辑档案':'Edit Profile',
  '编辑学生档案':'Edit Student Profile',
  '新建学生档案':'New Student Profile',
  '统一维护服务进度、老师分工和交付信息':'Maintain service progress, teacher assignments, and delivery details in one place',
  '学生与服务':'Student and Service',
  '目标方向':'Target Direction',
  '服务项目':'Service Program',
  '进度与交付':'Progress and Delivery',
  '整体进度':'Overall Progress',
  '整体进度数值':'Overall Progress Value',
  '整体进度滑块':'Overall Progress Slider',
  '导师候选数':'Mentor Candidates',
  '服务项目邀请码':'Service Invite Code',
  '删除学生':'Delete Student',
  '学生预览':'Student Preview',
  '新建':'Create',
  '通知':'Notifications',
  '帮助':'Help',
  '总览':'Overview',
  '导师推荐':'Mentors',
  '文书材料':'Documents',
  '面试准备':'Interview Prep',
  '申请进度':'Application Progress',
  '退出学生端':'Exit Student Portal',
  '返回老师端':'Back to Teacher View',
  '老师预览':'Teacher Preview',
  '整体进度':'Overall Progress',
  '当前下一步':'Next Step',
  '完成导师推荐反馈':'Finish mentor recommendation feedback',
  '你的完整反馈会同步回选导老师工作台。':'Your full feedback will sync back to the mentor matching workspace.',
  '导师已反馈':'Mentors Reviewed',
  '当前待办':'Current To-dos',
  '完成这些事项，老师才能继续推进你的申请。':'Complete these items so your team can keep moving.',
  '你的服务项目进度和待办事项。':'Your service progress and pending tasks.',
  '博士申请材料清单':'PhD Application Materials',
  'PhDHub 的材料管理思路，先看状态，再上传对应文件。':'A PhDHub-style checklist: review status, then upload the right files.',
  '完成':'Complete',
  '已上传':'Uploaded',
  '待老师审核':'Teacher Review',
  '待补充':'To Add',
  '未开始':'Not Started',
  '博士面试准备舱':'PhD Interview Prep Studio',
  '把每一次面试准备，变成可复用的答案资产':'Turn each interview prep session into reusable answer assets',
  '从 PhDHub 的题库和复盘流程开始，先写下自己的版本，再和老师一起打磨。':'Start with PhDHub-style questions and review flow, draft your version, then refine with your teacher.',
  '题目已准备':'Questions Prepared',
  '导师主页已阅读':'Supervisor homepage reviewed',
  'Research Proposal 已上传':'Research Proposal uploaded',
  '模拟面试待完成':'Mock interview pending',
  '保存并同步':'Save and Sync',
  '提醒老师查看准备进度':'Remind teacher to review prep progress',
  '我的材料与共享文件':'My Materials and Shared Files',
  '共享文件':'Shared Files',
  '上传文件':'Upload File',
  '上传中...':'Uploading...',
  '还没有文件，学生和老师上传后会在这里同步显示':'No files yet. Student and teacher uploads will appear here.',
  'PhDHub 能力中心':'PhDHub Capability Center',
  '博士申请工具':'PhD Application Tools',
  '把导师库、套磁推进、邮件模板和面试准备放进同一个服务项目。':'Bring mentor library, outreach progress, email templates, and interview prep into one service case.',
  '当前服务项目':'Current Service Case',
  '套磁看板':'Outreach Board',
  '邮件模板':'Email Templates',
  '导师库':'Mentor Library',
  '套磁推进会同步到学生服务项目':'Outreach progress syncs to the student service case',
  '先记录阶段，再把每封邮件和下一步动作留在 CRM。':'Record the stage first, then keep every email and next action in the CRM.',
  '待发送':'Draft',
  '已发送':'Sent',
  '已回复':'Replied',
  '面试中':'Interviewing',
  '确认材料与主题':'Confirm materials and topic',
  '等待导师查看':'Waiting for supervisor review',
  '记录下一步动作':'Record the next action',
  '准备面试与跟进':'Prepare interviews and follow-up',
  '这一列还没有导师':'No mentors in this column yet',
  '主页':'Homepage',
  '邮件模板中心':'Email Template Center',
  '保留变量占位符，老师复制后按学生和导师事实修改。':'Keep variable placeholders; teachers can copy and tailor them to the student and mentor.',
  '4 组模板':'4 Templates',
  '位导师资料':' mentors',
  '封待发邮件':' draft emails',
  '条辅导备注':' coaching notes',
  '组面试题库':' question sets',
  '字':' chars',
  '面试准备已同步给老师':'Interview prep synced to teacher',
  '博士工具状态暂时未同步，请稍后重试':'PhD tool status did not sync. Please try again later.',
  '面试辅导备注已同步':'Interview coaching note synced',
  '状态暂时未同步，请稍后重试':'Status did not sync. Please try again later.',
  '反馈已提交给选导老师':'Feedback submitted to the mentor matching teacher',
  '已提醒老师查看你的面试准备':'Teacher has been reminded to review your interview prep',
  '选导工作台':'Mentor Matching Workspace',
  '连接 Vika 导师库，生成可给学生确认的推荐方案':'Connect the Vika mentor database and create recommendation plans students can confirm.',
  '发送给学生':'Send to Student',
  '学生预览':'Student Preview',
  '候选卡片':'Candidate Cards',
  '全字段表格':'Full Field Table',
  '反馈看板':'Feedback Board',
  '链接中心':'Link Center',
  '看匹配建议':'Review fit suggestions',
  '像多维表格一样筛选':'Filter like a multidimensional table',
  '按学生意向推进':'Move forward by student preference',
  '集中打开申请资料':'Open application resources in one place',
  '首次套磁':'First Outreach',
  '礼貌跟进':'Polite Follow-up',
  '积极回复后':'After Positive Reply',
  '面试确认':'Interview Confirmation',
  '邮件主题':'Subject',
  '邮件正文':'Body',
  '复制正文':'Copy Body',
  '已复制':'Copied',
  '面试准备舱':'Interview Prep Studio',
  '老师可以针对学生和具体导师写辅导意见，学生端会看到自己的准备进度。':'Teachers can write guidance for each student and mentor; students see their prep progress.',
  '老师辅导记录会同步进服务项目':'Teacher coaching notes sync into the service case',
  '保存辅导备注':'Save Coaching Note',
  '导师库与申请资料':'Mentor Library and Application Info',
  'PhDHub 的教授库、排名、研究方向和申请链接已接到 CRM 导师主数据。':'PhDHub professor data, rankings, research areas, and application links are connected to CRM mentor data.',
  '导师 / 学校':'Mentor / School',
  '研究方向':'Research Area',
  '排名与地点':'Rankings and Location',
  '资料链接':'Resource Links',
  '导师主页':'Mentor Homepage',
  '博士申请信息':'PhD Application Info',
  '其他导师链接':'Other Mentor Links',
  '其他导师信息':'Other Mentor Info',
  '没有找到导师':'No mentors found',
  '学生与服务项目':'Students and Service Cases',
  '以服务项目为主线，统一管理学生、老师和交付进度':'Manage students, teachers, and delivery progress through service cases.',
  '新建学生':'New Student',
  '全部学生':'All Students',
  '筛选结果':'Filtered Results',
  '老师分工':'Teacher Assignments',
  '服务摘要':'Service Summary',
  '服务项目整体进度':'Service Case Progress',
  '服务项目共享文件':'Service Case Shared Files',
  '申请工作台':'Application Workspace',
  '跟进院校申请进度，及时处理关键节点':'Track school applications and handle key milestones.',
  '全部入学季':'All Intakes',
  '2025年秋季':'Fall 2025',
  '2026年春季':'Spring 2026',
  '筛选':'Filter',
  '总申请数':'Total Applications',
  '录取率':'Offer Rate',
  '今日任务':'Today’s Tasks',
  '更多':'More',
  '已完成':'Done',
  '待办':'To-do',
  '新建任务':'New Task',
  '今天的任务都完成了':'All tasks are done today',
  '任务中心':'Task Center',
  '集中管理学生跟进、申请节点和团队交接':'Manage student follow-ups, application milestones, and team handoffs in one place.',
  '待处理':'Pending',
  '需要继续跟进':'Needs follow-up',
  '高优先级':'High Priority',
  '优先安排时间':'Schedule first',
  '已逾期':'Overdue',
  '逾期':'Overdue',
  '需要优先处理':'Needs immediate attention',
  '可随时恢复':'Can be restored',
  '返回工作台':'Back to Dashboard',
  '全部':'All',
  '搜索任务或关联对象':'Search tasks or related records',
  '状态':'Status',
  '关联对象':'Related Record',
  '时间':'Time',
  '优先级':'Priority',
  '操作':'Actions',
  '完成任务':'Complete Task',
  '恢复任务':'Restore Task',
  '删除任务':'Delete Task',
  '编辑任务':'Edit Task',
  '更新负责人、截止时间和任务信息':'Update the owner, due time, and task details.',
  '保存修改':'Save Changes',
  '负责人':'Owner',
  '全部负责人':'All Owners',
  '按负责人筛选':'Filter by owner',
  '未关联对象':'No related record',
  '未关联学生或申请':'No related student or application',
  '任务标题':'Task Title',
  '例如：确认推荐信提交进度':'Example: Confirm recommendation submission',
  '日期':'Date',
  '低':'Low',
  '中':'Medium',
  '高':'High',
  '创建任务':'Create Task',
  '安排一个清晰、可跟进的业务事项':'Schedule a clear and trackable action item.',
  '不关联学生或申请':'Do not link a student or application',
  '新建任务后会显示在这里':'New tasks will appear here.',
  '当前没有待办任务':'No pending tasks',
  '当前没有逾期任务':'No overdue tasks',
  '还没有已完成任务':'No completed tasks yet',
  '没有匹配的任务':'No matching tasks',
  '换个关键词试试':'Try another keyword.',
  '取消':'Cancel',
  '创建学生':'Create Student',
  '意向院校':'Target School',
  '入学季':'Intake',
  '关闭详情':'Close Details',
  '第一批套磁':'First Outreach Batch',
  '第二批套磁':'Second Batch',
  '第三批套磁':'Third Batch',
  '完全不考虑':'Not Interested',
  '第一批':'First Batch',
  '第二批':'Second Batch',
  '第三批':'Third Batch',
  '不考虑':'Not Interested',
  '已反馈':'Reviewed',
  '待反馈':'Pending',
  '提交留言':'Submit Message',
  '提交全部反馈':'Submit All Feedback',
  '搜索学生、申请、院校、任务...':'Search students, applications, schools, tasks...',
  '搜索学生':'Search students',
  '搜索导师、学校、方向...':'Search mentors, schools, topics...',
  '请输入姓名':'Enter name',
  '例如：伦敦大学学院':'Example: University College London',
  '请输入老师账号和至少 6 位密码':'Enter teacher account and a password with at least 6 characters',
  '演示账号：张晓彤，密码：123456':'Demo account: 张晓彤, password: 123456',
  '请检查学生姓名和服务项目邀请码':'Check the student name and service invite code'
};

const enToZhCopy=Object.fromEntries(Object.entries(zhToEnCopy).map(([zh,en])=>[en,zh]));

function dynamicLanguageCopy(text, lang) {
  const zh=lang==='en';
  const rules=zh?[
    [/^(.+)的服务项目$/, (_,name)=>`${name}'s Service Case`],
    [/^你好，(.+)$/, (_,name)=>`Hi, ${name}`],
    [/^邀请码 (.+)$/, (_,code)=>`Invite Code ${code}`],
    [/^(\d+)位导师资料$/, (_,n)=>`${n} mentors`],
    [/^(\d+)封待发邮件$/, (_,n)=>`${n} draft emails`],
    [/^(\d+)条辅导备注$/, (_,n)=>`${n} coaching notes`],
    [/^(\d+)组面试题库$/, (_,n)=>`${n} question sets`],
    [/^推荐 (\d+)$/, (_,n)=>`Recommendation ${n}`],
    [/^(\d+) 位已反馈$/, (_,n)=>`${n} reviewed`],
    [/^(\d+) 位待确认$/, (_,n)=>`${n} pending`],
    [/^待办 \((\d+)\)$/, (_,n)=>`To-do (${n})`],
    [/^已完成 \((\d+)\)$/, (_,n)=>`Done (${n})`],
    [/^待办 (\d+)$/, (_,n)=>`To-do ${n}`],
    [/^已完成 (\d+)$/, (_,n)=>`Done ${n}`],
    [/^逾期 (\d+)$/, (_,n)=>`Overdue ${n}`],
    [/^全部 (\d+)$/, (_,n)=>`All ${n}`],
    [/^(\d+) 项已逾期$/, (_,n)=>`${n} overdue`],
    [/^今天 (.+)$/, (_,time)=>`Today ${time}`],
    [/^明天 (.+)$/, (_,time)=>`Tomorrow ${time}`],
    [/^(.+) × (.+)$/, (_,a,b)=>`${a} x ${b}`]
  ]:[
    [/^(.+)'s Service Case$/, (_,name)=>`${name}的服务项目`],
    [/^Hi, (.+)$/, (_,name)=>`你好，${name}`],
    [/^Invite Code (.+)$/, (_,code)=>`邀请码 ${code}`],
    [/^(\d+) mentors$/, (_,n)=>`${n}位导师资料`],
    [/^(\d+) draft emails$/, (_,n)=>`${n}封待发邮件`],
    [/^(\d+) coaching notes$/, (_,n)=>`${n}条辅导备注`],
    [/^(\d+) question sets$/, (_,n)=>`${n}组面试题库`],
    [/^Recommendation (\d+)$/, (_,n)=>`推荐 ${n}`],
    [/^(\d+) reviewed$/, (_,n)=>`${n} 位已反馈`],
    [/^(\d+) pending$/, (_,n)=>`${n} 位待确认`],
    [/^To-do \((\d+)\)$/, (_,n)=>`待办 (${n})`],
    [/^Done \((\d+)\)$/, (_,n)=>`已完成 (${n})`],
    [/^To-do (\d+)$/, (_,n)=>`待办 ${n}`],
    [/^Done (\d+)$/, (_,n)=>`已完成 ${n}`],
    [/^Overdue (\d+)$/, (_,n)=>`逾期 ${n}`],
    [/^All (\d+)$/, (_,n)=>`全部 ${n}`],
    [/^(\d+) overdue$/, (_,n)=>`${n} 项已逾期`],
    [/^Today (.+)$/, (_,time)=>`今天 ${time}`],
    [/^Tomorrow (.+)$/, (_,time)=>`明天 ${time}`],
    [/^(.+) x (.+)$/, (_,a,b)=>`${a} × ${b}`]
  ];
  for (const [pattern, replace] of rules) {
    if (pattern.test(text)) return text.replace(pattern, replace);
  }
  return null;
}

function translateCopy(text, lang) {
  if (!text?.trim()) return text;
  const leading=text.match(/^\s*/)?.[0]||'';
  const trailing=text.match(/\s*$/)?.[0]||'';
  const core=text.trim();
  const table=lang==='en'?zhToEnCopy:enToZhCopy;
  const translated=table[core]||dynamicLanguageCopy(core,lang);
  return translated ? `${leading}${translated}${trailing}` : text;
}

function shouldSkipLanguageNode(node) {
  const parent=node.parentElement;
  if (!parent) return true;
  return Boolean(parent.closest('script,style,noscript,textarea,.language-switch'));
}

function applyLanguage(root, lang) {
  if (!root) return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:node=>shouldSkipLanguageNode(node)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  const textNodes=[];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node=>{const nextValue=translateCopy(node.nodeValue,lang);if(nextValue!==node.nodeValue)node.nodeValue=nextValue;});
  root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(element=>{
    ['placeholder','title','aria-label'].forEach(attribute=>{
      const value=element.getAttribute(attribute);
      if (!value) return;
      const nextValue=translateCopy(value,lang);
      if(nextValue!==value)element.setAttribute(attribute,nextValue);
    });
  });
}

function LanguageLayer({inline=false}) {
  const [lang,setLang]=useState(()=>{if(typeof window==='undefined')return'zh';try{return window.localStorage.getItem(LANGUAGE_KEY)||'zh';}catch{return'zh';}});
  useEffect(()=>{
    if (typeof document==='undefined') return undefined;
    document.documentElement.lang=lang==='en'?'en':'zh-CN';
    try { window.localStorage.setItem(LANGUAGE_KEY,lang); } catch {}
    let translating=false;
    const run=()=>{translating=true;applyLanguage(document.body,lang);translating=false;};
    window.requestAnimationFrame(run);
    const observer=new MutationObserver(records=>{
      if (translating) return;
      translating=true;
      records.forEach(record=>{
        if (record.type==='characterData') applyLanguage(record.target.parentElement,lang);
        record.addedNodes.forEach(node=>{
          if (node.nodeType===Node.TEXT_NODE) applyLanguage(node.parentElement,lang);
          if (node.nodeType===Node.ELEMENT_NODE) applyLanguage(node,lang);
        });
      });
      translating=false;
    });
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    return()=>observer.disconnect();
  },[lang]);
  return <button type="button" className={`language-switch${inline?' inline':''}`} onClick={()=>setLang(current=>current==='zh'?'en':'zh')} aria-label={lang==='zh'?'Switch to English':'切换到中文'} title={lang==='zh'?'Switch to English':'切换到中文'}><Languages size={14}/><span>{lang==='zh'?'EN':'中'}</span></button>;
}

function readSession() {
  if(typeof window==='undefined')return null;
  try { const raw=window.localStorage.getItem(SESSION_KEY); return raw?JSON.parse(raw):null; } catch { return null; }
}

function LoginScreen({onLogin}) {
  const [role,setRole]=useState('teacher'); const [account,setAccount]=useState('张晓彤'); const [password,setPassword]=useState('123456'); const [studentName,setStudentName]=useState(DEMO_STUDENT.name); const [invite,setInvite]=useState(DEMO_STUDENT.invite); const [error,setError]=useState('');
  const submit=event=>{event.preventDefault();setError('');if(role==='teacher'){if(!account.trim()||password.length<6){setError('请输入老师账号和至少 6 位密码');return;}if(!['张晓彤','zhangxiaotong'].includes(account.trim())||password!=='123456'){setError('演示账号：张晓彤，密码：123456');return;}onLogin({role:'teacher',name:'张晓彤',title:'资深顾问'});return;}const matched=STUDENT_LOGINS.find(item=>item.name===studentName.trim()&&item.invite===invite.trim().toUpperCase());if(!matched){setError('请检查学生姓名和服务项目邀请码');return;}onLogin({role:'student',name:matched.name,title:'申请人',studentId:matched.id,target:matched.target,invite:matched.invite});};
  return <main className="login-shell"><section className="login-story"><Brand/><div className="login-dog-card"><img src="/brand-qingxue-dog.png" alt="乐意轻学博士柴犬"/><span><PawPrint size={15}/> 申请路上，每一步都有老师陪你</span><Bone size={20} aria-hidden="true"/></div><div className="login-story-copy"><small>留学申请协作空间</small><h1>为学生的全力以赴<br/>随时撑腰</h1><p>选导、文书、申请、签证和共享材料，都围绕服务项目持续同步。</p></div></section><section className="login-panel"><div className="login-card"><div className="login-card-head"><span className="login-kicker">欢迎回到轻学教育</span><h2>{role==='teacher'?'进入老师工作台':'进入学生服务中心'}</h2><p>{role==='teacher'?'查看负责学生、导师推荐和协作任务。':'打开专属服务项目，查看推荐并反馈意向。'}</p></div><div className="login-role-switch" role="tablist" aria-label="选择登录身份"><button type="button" className={role==='teacher'?'active':''} role="tab" aria-selected={role==='teacher'} onClick={()=>{setRole('teacher');setError('')}}><ShieldCheck size={16}/>老师登录</button><button type="button" className={role==='student'?'active':''} role="tab" aria-selected={role==='student'} onClick={()=>{setRole('student');setError('')}}><GraduationCap size={16}/>学生入口</button></div><form className="login-form" onSubmit={submit}>{role==='teacher'?<><label>老师账号<input value={account} onChange={event=>setAccount(event.target.value)} autoComplete="username" placeholder="请输入姓名或账号"/></label><label>登录密码<input type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="current-password" placeholder="请输入密码"/></label></>:<><label>学生姓名<input value={studentName} onChange={event=>setStudentName(event.target.value)} autoComplete="name" placeholder="请输入姓名"/></label><label>服务项目邀请码<input value={invite} onChange={event=>setInvite(event.target.value.toUpperCase())} autoCapitalize="characters" placeholder="例如 LINXIA2026"/></label></>}{error&&<p className="login-error" role="alert"><CircleHelp size={14}/>{error}</p>}<button className="primary login-submit" type="submit">{role==='teacher'?'进入老师工作台':'进入我的服务项目'}<ArrowRight size={16}/></button></form><div className="login-meta"><span><CheckCircle2 size={14}/> 当前为演示环境</span><small>{role==='teacher'?'老师账号由机构管理员分配':'学生使用服务项目邀请码进入'}</small></div></div></section></main>;
}

function StudentPortalLegacy({onExit, onNotify}) {
  const [tab,setTab]=useState('总览'); const [feedback,setFeedback]=useState({}); const [note,setNote]=useState(''); const [portalMentors,setPortalMentors]=useState(mentors);
  useEffect(()=>{apiRequest(`/api/vika/sync?studentId=${encodeURIComponent(studentId)}`).then(data=>{if(data.mentors?.length)setPortalMentors(data.mentors)}).catch(()=>{});},[studentId]);
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
  useEffect(()=>{apiRequest('/api/vika/sync').then(data=>{if(data.mentors?.length)setPortalMentors(data.mentors)}).catch(()=>{});},[]);
  const choose=(mentor,choice)=>{setFeedback(current=>({...current,[mentor.id]:choice}));onNotify(`已记录 ${mentor.name} 的${choice==='first'?'优先套磁':choice==='second'?'第二批':'不考虑'}选择`)};
  const recommended=portalMentors.slice(0,4);
  const feedbackCount=Object.keys(feedback).length;
  const visibleMentors=[...recommended].filter(mentor=>portalFilter==='all'||(portalFilter==='pending'&&!feedback[mentor.id])||(portalFilter==='chosen'&&feedback[mentor.id])).sort((a,b)=>portalSort==='school'?a.school.localeCompare(b.school):b.fit-a.fit);
  return <div className="portal-shell"><header className="portal-header"><Brand portal/><button onClick={onExit}>退出学生端 <X size={15}/></button></header><main className="portal-main"><div className="portal-welcome"><div><span className="portal-kicker">林知夏的服务项目</span><h1>你好，林知夏</h1><p>张晓彤和团队正在陪你完成英国 AI / HCI 博士申请。</p></div><span className="portal-progress"><b>38%</b><small>整体进度</small></span></div><div className="portal-next-step"><div><span>当前下一步</span><strong>完成导师推荐反馈</strong><small>反馈后，选导老师会为你生成套磁计划。</small></div><div className="portal-next-progress"><b>{feedbackCount}/{recommended.length}</b><span>导师已反馈</span><i><em style={{width:`${recommended.length?feedbackCount/recommended.length*100:0}%`}}></em></i></div></div><nav className="portal-tabs">{['总览','导师推荐','文书材料','申请进度','签证'].map(x=><button className={tab===x?'active':''} aria-current={tab===x?'page':undefined} key={x} onClick={()=>setTab(x)}>{x}</button>)}</nav>{tab==='导师推荐'?<div className="portal-section"><div className="portal-section-title"><div><h2>导师推荐方案</h2><p>先看关键事实，再告诉老师你的优先顺序。</p></div><span>{feedbackCount ? `${feedbackCount} 位已反馈` : `${recommended.length} 位待确认`}</span></div><div className="portal-list-tools"><div className="portal-filter-tabs"><button className={portalFilter==='all'?'active':''} onClick={()=>setPortalFilter('all')}>全部推荐</button><button className={portalFilter==='pending'?'active':''} onClick={()=>setPortalFilter('pending')}>待反馈</button><button className={portalFilter==='chosen'?'active':''} onClick={()=>setPortalFilter('chosen')}>已反馈</button></div><label><SlidersHorizontal size={14}/><select value={portalSort} onChange={event=>setPortalSort(event.target.value)}><option value="fit">按匹配度</option><option value="school">按学校</option></select></label></div><div className="portal-mentor-grid">{visibleMentors.map((m,i)=>{const ranking=mentorRankings(m); const open=detailsOpen[m.id]; return <article key={m.id}><div className="portal-card-head"><span>推荐 {i+1}</span><b>{m.fit}% 匹配</b></div><h3>{m.name}</h3><p>{m.school} · {m.dept}</p><div className="student-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(m, 'Location')}</span><span>{m.dept}</span></div><small>研究方向</small><strong>{m.topic}</strong><MentorLinks mentor={m}/><button className="portal-details-toggle" onClick={()=>setDetailsOpen(state=>({...state,[m.id]:!state[m.id]}))}>{open?'收起关键申请信息':'查看关键申请信息'} <ChevronDown size={13} className={open?'rotated':''}/></button>{open&&<div className="portal-details-grid"><span><small>招生窗口</small><b>{m.open}</b></span><span><small>申请关注</small><b>{m.dept}</b></span><span><small>地点</small><b>{mentorField(m,'Location')}</b></span></div>}<div className="portal-reason"><small>老师的推荐理由</small><p>{m.reason}</p></div><div className="portal-choice"><button className={feedback[m.id]==='first'?'chosen':''} onClick={()=>choose(m,'first')}><Star size={14}/>优先套磁</button><button className={feedback[m.id]==='second'?'chosen':''} onClick={()=>choose(m,'second')}>第二批</button><button className={feedback[m.id]==='no'?'not':''} onClick={()=>choose(m,'no')}>不考虑</button></div>{feedback[m.id]&&<div className="portal-choice-state"><CheckCircle2 size={13}/>已记录：{feedback[m.id]==='first'?'优先套磁':feedback[m.id]==='second'?'第二批':'不考虑'}</div>}</article>})}</div>{!visibleMentors.length&&<div className="portal-empty-filter">这个筛选下暂时没有导师</div>}<div className="portal-feedback"><MessageSquare size={16}/><input value={note} onChange={event=>setNote(event.target.value)} placeholder="告诉老师你的选择理由或疑问..."/><button className="primary" onClick={()=>{if(!note.trim()){onNotify('请先填写反馈内容');return;}onNotify('反馈已提交给选导老师');setNote('')}}>提交留言</button><button className="portal-submit-feedback" onClick={()=>{if(!feedbackCount){onNotify('请先选择至少一位导师');return;}onNotify(`已提交 ${feedbackCount} 位导师反馈`)}}><Check size={14}/>提交全部反馈</button></div></div>:<PortalOverview tab={tab}/>}<FileUploadPanel caseId="student-1" uploadedBy="学生 · 林知夏" title="我的材料与共享文件"/></main></div>;
}

function persistCaseState(caseId, patch, actor) {
  return apiRequest('/api/case-state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseId, patch, actor })
  });
}

function mutateCrmData(method, payload) {
  return apiRequest('/api/crm', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

function StudentPortal({onExit, onNotify, preview=false, student=DEMO_STUDENT}) {
  const studentId=student.id||DEMO_STUDENT.id;
  const caseId=`student-${studentId}`;
  const [tab,setTab]=useState('总览');
  const [feedback,setFeedback]=useState({});
  const [feedbackNotes,setFeedbackNotes]=useState({});
  const [interviewNotes,setInterviewNotes]=useState({});
  const [studentNote,setStudentNote]=useState('');
  const [portalMentors,setPortalMentors]=useState(mentors);
  const [phdHubTab,setPhdHubTab]=useState('dashboard');
  const studentName=student.name||DEMO_STUDENT.name;
  const studentTarget=student.target||DEMO_STUDENT.target;
  useEffect(()=>{apiRequest(`/api/case-state?caseId=${encodeURIComponent(caseId)}`).then(data=>{setFeedback(data.state?.feedback||{});setFeedbackNotes(data.state?.feedbackNotes||{});setInterviewNotes(data.state?.interviewNotes||{});setStudentNote(data.state?.studentNote||'');}).catch(()=>{});},[caseId]);
  useEffect(()=>{apiRequest(`/api/vika/sync?studentId=${encodeURIComponent(studentId)}`).then(data=>{if(data.mentors?.length)setPortalMentors(data.mentors)}).catch(()=>{});},[studentId]);
  const recommended=portalMentors.slice(0,4);
  const syncPatch=patch=>persistCaseState(caseId,patch,preview?'老师预览':'学生').catch(()=>onNotify('状态暂时未同步，请稍后重试'));
  const recordFeedback=(mentor,choice)=>{setFeedback(current=>({...current,[mentor.id]:choice}));void syncPatch({feedback:{[mentor.id]:choice}});onNotify(`已记录 ${mentor.name} 的${feedbackMeta(choice)?.label||'反馈'}`);};
  const submitMentorFeedback=(mentorId,value)=>{const mentor=recommended.find(item=>item.id===mentorId);setFeedbackNotes(current=>({...current,[mentorId]:value}));void syncPatch({feedbackNotes:{[mentorId]:value}});onNotify(`已保存 ${mentor?.name||'导师'} 的具体反馈`);};
  const submitStudentNote=value=>{setStudentNote(value);void syncPatch({studentNote:value});onNotify('反馈已提交给选导老师');};
  const saveInterviewNote=(questionId,value)=>{setInterviewNotes(current=>({...current,[questionId]:value}));void syncPatch({interviewNotes:{[questionId]:value}});onNotify('面试准备已同步给老师');};
  const feedbackCount=recommended.filter(mentor=>feedback[mentor.id]||feedbackNotes[mentor.id]?.trim()).length;
  return <div className="portal-shell"><header className="portal-header"><Brand portal/><div className="portal-header-actions">{preview&&<span className="portal-session-mark"><Eye size={13}/>老师预览</span>}<button onClick={onExit}>{preview?'返回老师端':'退出学生端'} <X size={15}/></button><LanguageLayer inline/></div></header><main className="portal-main"><div className="portal-welcome"><div><span className="portal-kicker">{studentName}的服务项目</span><h1>你好，{studentName}</h1><p>老师已经把导师事实、推荐依据和反馈入口整理在一起。</p></div><span className="portal-progress"><b>38%</b><small>整体进度</small></span></div><div className="portal-next-step"><div><span>当前下一步</span><strong>完成导师推荐反馈</strong><small>你的完整反馈会同步回选导老师工作台。</small></div><div className="portal-next-progress"><b>{feedbackCount}/{recommended.length}</b><span>导师已反馈</span><i><em style={{width:`${recommended.length?feedbackCount/recommended.length*100:0}%`}}></em></i></div></div><nav className="portal-tabs">{['总览','导师推荐','文书材料','面试准备','申请进度','签证','PhDHub工具'].map(x=><button className={tab===x?'active':''} aria-current={tab===x?'page':undefined} key={x} onClick={()=>setTab(x)}>{x}{x==='导师推荐'&&<b className="portal-tab-count">{feedbackCount}/{recommended.length}</b>}</button>)}</nav>{tab==='导师推荐'?<StudentMentorView student={{name:studentName,target:studentTarget}} mentors={recommended} sent={true} onNotify={onNotify} feedback={feedback} onFeedback={recordFeedback} feedbackNotes={feedbackNotes} onFeedbackNote={submitMentorFeedback} studentNote={studentNote} onStudentNoteSubmit={submitStudentNote}/>:tab==='面试准备'?<StudentInterviewPrep notes={interviewNotes} onSave={saveInterviewNote} onNotify={onNotify}/>:tab==='PhDHub工具'?<StudentPhdHubView student={{name:studentName,target:studentTarget}} mentors={recommended} feedback={feedback} feedbackNotes={feedbackNotes} interviewNotes={interviewNotes} onSaveInterviewNote={saveInterviewNote} onNotify={onNotify} activeModule={phdHubTab} setActiveModule={setPhdHubTab} caseId={caseId}/>:<PortalOverview tab={tab}/>} {tab!=='PhDHub工具'&&<FileUploadPanel caseId={caseId} uploadedBy={`学生 · ${studentName}`} title="我的材料与共享文件"/>}</main></div>;
}

function PortalOverview({tab}) {
  const rows={总览:[['选导反馈','2 位导师待确认','今天 16:30','orange'],['个人陈述','等待你确认初稿','明日 10:00','blue'],['研究计划','老师正在修改','-','green']],文书材料:[['个人陈述','初稿待确认','明日 10:00','blue'],['研究计划','老师正在修改','-','green']],申请进度:[['University of Cambridge','导师确认阶段','2026 Fall','orange'],['Imperial College London','导师确认阶段','2026 Fall','orange']],签证:[['签证准备','尚未开始','申请录取后','gray']]}[tab] || [];
  return <div className="portal-section"><div className="portal-section-title"><div><h2>{tab==='总览'?'当前待办':tab}</h2><p>{tab==='总览'?'完成这些事项，老师才能继续推进你的申请。':'你的服务项目进度和待办事项。'}</p></div></div><div className="portal-progress-list">{rows.map((r,i)=><div key={i}><span className={`portal-dot ${r[3]}`}></span><span><strong>{r[0]}</strong><small>{r[1]}</small></span><b>{r[2]}</b><ArrowRight size={15}/></div>)}</div>{tab==='文书材料'&&<MaterialChecklist/>}</div>;
}

const studentMaterialChecklist=[
  ['简历 CV','突出研究经历、方法训练和成果链接','已上传','green'],
  ['Research Proposal','确认研究问题、方法与导师方向的衔接','待老师审核','orange'],
  ['成绩单与语言成绩','中英文版本和有效期检查','待补充','blue'],
  ['推荐信与作品集','按学校要求确认格式和提交方式','未开始','gray']
];

function MaterialChecklist() {
  return <div className="material-checklist"><div className="material-checklist-head"><div><h3>博士申请材料清单</h3><p>PhDHub 的材料管理思路，先看状态，再上传对应文件。</p></div><span>1 / 4 完成</span></div><div className="material-checklist-grid">{studentMaterialChecklist.map(([name,detail,status,tone])=><div key={name}><span className={`material-status ${tone}`}><Check size={12}/></span><div><strong>{name}</strong><small>{detail}</small></div><em>{status}</em></div>)}</div></div>;
}

const interviewQuestions=[
  ['direction','为什么选择这个研究方向？','把个人经历、问题意识和未来研究问题串成一条线。'],
  ['supervisor','为什么想跟这位导师？','结合导师近期论文、方法和你的经历，避免只说学校排名。'],
  ['paper','你如何理解导师的一篇代表性论文？','记录论文问题、方法、结论，以及你想继续追问的地方。'],
  ['proposal','你的 Research Proposal 准备怎么落地？','准备研究对象、数据来源、方法边界和可能的风险。']
];

function StudentInterviewPrep({notes={},onSave,onNotify}) {
  const [drafts,setDrafts]=useState(notes);
  useEffect(()=>setDrafts(notes),[notes]);
  const save=(id)=>{onSave(id,drafts[id]||'');};
  return <section className="interview-prep"><div className="prep-hero"><div><span className="prep-kicker"><MessageSquare size={14}/>博士面试准备舱</span><h2>把每一次面试准备，变成可复用的答案资产</h2><p>从 PhDHub 的题库和复盘流程开始，先写下自己的版本，再和老师一起打磨。</p></div><span className="prep-progress"><b>{Object.values(notes).filter(Boolean).length}/{interviewQuestions.length}</b><small>题目已准备</small></span></div><div className="prep-checklist"><span><Check size={13}/>导师主页已阅读</span><span><Check size={13}/>Research Proposal 已上传</span><span className="pending"><ClipboardCheck size={13}/>模拟面试待完成</span></div><div className="prep-question-grid">{interviewQuestions.map(([id,title,tip],index)=><article key={id}><div className="prep-question-head"><span>0{index+1}</span><div><h3>{title}</h3><p>{tip}</p></div></div><textarea value={drafts[id]||''} onChange={event=>setDrafts(current=>({...current,[id]:event.target.value}))} placeholder="先写下你的回答要点..." aria-label={title}/><div className="prep-question-actions"><small>{drafts[id]?.length||0} 字</small>{drafts[id]!==notes[id]&&<button type="button" onClick={()=>save(id)}><Check size={12}/>保存并同步</button>}</div></article>)}</div><button className="prep-notify" type="button" onClick={()=>onNotify('已提醒老师查看你的面试准备')}>提醒老师查看准备进度 <Send size={14}/></button></section>;
}

const studentPhdHubNav=[
  ['dashboard','套磁看板 (CRM)',LayoutDashboard],
  ['email','邮件记录',Mail],
  ['library','导师库管理',Database],
  ['templates','套瓷信模板',FileText],
  ['review','面试回顾',MessageSquare],
  ['clock','世界时钟',Globe2],
  ['schoollist','院校榜单',GraduationCap],
  ['data','资料管理',Paperclip],
  ['settings','系统设置',Settings2]
];

const studentEmailRecords=[
  {id:'email-1',date:'2026-07-11',mentor:'Prof. Sarah Thompson',school:'University of Cambridge',tag:'已发送套磁信',subject:'Prospective PhD Applicant · Human-Centred AI',state:'等待导师查看'},
  {id:'email-2',date:'2026-07-09',mentor:'Dr. Michael Chen',school:'Imperial College London',tag:'积极回复',subject:'Re: PhD opportunity in Machine Learning · Healthcare',state:'准备下一步沟通'},
  {id:'email-3',date:'2026-07-06',mentor:'Prof. Emily Watson',school:'University College London',tag:'中立回复',subject:'Prospective PhD Applicant · Responsible AI',state:'等待补充研究计划'},
  {id:'email-4',date:'2026-07-03',mentor:'Dr. James Miller',school:'University of Edinburgh',tag:'面试预约',subject:'Interview confirmation · AI Safety / Agents',state:'面试准备中'}
];

const studentWorldClockZones=[
  {city:'剑桥',country:'英国',zone:'Europe/London',note:'Sarah Thompson · Cambridge'},
  {city:'纽约',country:'美国',zone:'America/New_York',note:'美国东部导师常用时区'},
  {city:'新加坡',country:'新加坡',zone:'Asia/Singapore',note:'亚洲院校沟通参考'},
  {city:'北京',country:'中国',zone:'Asia/Shanghai',note:'你的本地时间'}
];

function studentMentorStage(mentor,feedback) {
  const choice=feedback?.[mentor.id];
  if(choice==='first'||choice==='second')return 'sent';
  const raw=Object.values(mentor.rawFields||{}).map(formatFieldValue).join(' ');
  if(/面试/.test(raw))return 'interview';
  if(/回复|已回/.test(raw))return 'replied';
  if(/已发送|套磁中/.test(raw))return 'sent';
  return 'draft';
}

function StudentOutreachDashboard({mentors,feedback,onNotify}) {
  const replied=mentors.filter(mentor=>studentMentorStage(mentor,feedback)==='replied').length;
  const interview=mentors.filter(mentor=>studentMentorStage(mentor,feedback)==='interview').length;
  return <div className="student-phd-panel"><div className="student-phd-panel-head"><div><span className="student-phd-kicker"><LayoutDashboard size={14}/>套磁看板 (CRM)</span><h2>我的套磁进度</h2><p>查看老师与导师的沟通阶段，下一步行动会同步在这里。</p></div><span className="student-phd-readonly">学生端只读进度</span></div><div className="student-phd-metrics"><div><small>候选导师</small><b>{mentors.length}</b></div><div><small>已进入沟通</small><b>{mentors.filter(mentor=>studentMentorStage(mentor,feedback)==='sent').length}</b></div><div><small>收到回复</small><b>{replied}</b></div><div><small>面试中</small><b>{interview}</b></div></div><div className="student-phd-board">{phdOutreachStages.map(stage=>{const rows=mentors.filter(mentor=>studentMentorStage(mentor,feedback)===stage.id);return <section className={`student-phd-stage ${stage.tone}`} key={stage.id}><header><div><strong>{stage.label}</strong><small>{stage.hint}</small></div><b>{rows.length}</b></header><div>{rows.map(mentor=>{const ranking=mentorRankings(mentor);return <article key={mentor.id}><strong>{mentor.name}</strong><small>{mentor.school}</small><p>{mentor.topic}</p><span>QS {ranking.qs} · {mentorField(mentor,'Location')}</span><MentorLinks mentor={mentor}/></article>})}</div>{!rows.length&&<p className="student-phd-empty">暂无记录</p>}</section>})}</div><button type="button" className="student-phd-action" onClick={()=>onNotify('已提醒选导老师更新套磁进度')}><Send size={14}/>提醒老师更新进度</button></div>;
}

function StudentEmailRecords() {
  return <div className="student-phd-panel"><div className="student-phd-panel-head"><div><span className="student-phd-kicker"><Mail size={14}/>邮件记录</span><h2>套磁往来记录</h2><p>老师登记的邮件节点会按导师归档，方便你准备下一次沟通。</p></div><span className="student-phd-count">{studentEmailRecords.length} 条记录</span></div><div className="student-email-list">{studentEmailRecords.map(record=><article key={record.id}><time>{record.date}</time><div><strong>{record.mentor}</strong><small>{record.school}</small><p>{record.subject}</p></div><span><b>{record.tag}</b><small>{record.state}</small></span></article>)}</div></div>;
}

function StudentMentorLibrary({mentors,onNotify}) {
  const [query,setQuery]=useState('');
  const [saved,setSaved]=useState([]);
  const visible=mentors.filter(mentor=>[mentor.name,mentor.school,mentor.dept,mentor.topic,mentorField(mentor,'Location')].join(' ').toLowerCase().includes(query.toLowerCase()));
  const toggleSaved=id=>{setSaved(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]);onNotify(saved.includes(id)?'已取消关注这位导师':'已加入你的关注清单');};
  return <div className="student-phd-panel"><div className="student-phd-panel-head"><div><span className="student-phd-kicker"><Database size={14}/>导师库管理</span><h2>导师资料库</h2><p>查看老师为你的申请整理的导师、学校、排名与研究方向。</p></div><label className="student-phd-search"><Search size={14}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索导师、学校、方向..." aria-label="搜索导师库"/></label></div><div className="student-mentor-library">{visible.map(mentor=>{const ranking=mentorRankings(mentor);const isSaved=saved.includes(mentor.id);return <article key={mentor.id}><div className="student-mentor-library-head"><span className="student-mentor-avatar">{mentor.name.split(' ').slice(-1)[0][0]}</span><div><strong>{mentor.name}</strong><small>{mentor.school} · {mentor.dept}</small></div><button type="button" className={isSaved?'saved':''} onClick={()=>toggleSaved(mentor.id)} aria-pressed={isSaved}><Star size={14} fill={isSaved?'currentColor':'none'}/>{isSaved?'已关注':'关注'}</button></div><p>{mentor.topic}</p><div className="student-mentor-library-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(mentor,'Location')}</span><span>{mentor.open||'招生窗口待确认'}</span></div><MentorLinks mentor={mentor}/></article>})}</div>{!visible.length&&<div className="student-phd-empty-state"><Search size={20}/><strong>没有找到匹配导师</strong><span>换一个导师姓名、学校或研究方向试试。</span></div>}</div>;
}

function StudentTemplateLibrary({onNotify}) {
  const [copied,setCopied]=useState('');
  const copy=template=>{if(navigator.clipboard){navigator.clipboard.writeText(template.body).then(()=>{setCopied(template.id);onNotify(`${template.label}模板已复制`);setTimeout(()=>setCopied(''),1600);}).catch(()=>onNotify('浏览器未允许自动复制，请手动复制'));}else onNotify('当前环境不支持自动复制');};
  return <div className="student-phd-panel"><div className="student-phd-panel-head"><div><span className="student-phd-kicker"><FileText size={14}/>套瓷信模板</span><h2>给导师的邮件模板</h2><p>复制后按自己的经历、研究方向和导师论文修改，再交给老师确认。</p></div><span className="student-phd-count">{phdMailTemplates.length} 组模板</span></div><div className="student-template-grid">{phdMailTemplates.map(template=><article key={template.id}><header><strong>{template.label}</strong><button type="button" onClick={()=>copy(template)}>{copied===template.id?<Check size={13}/>:<FileText size={13}/>} {copied===template.id?'已复制':'复制正文'}</button></header><label>邮件主题<input value={template.subject} readOnly/></label><label>邮件正文<textarea value={template.body} readOnly/></label></article>)}</div></div>;
}

function StudentInterviewReview({interviewNotes,onSave,onNotify}) {
  const completed=Object.values(interviewNotes).filter(Boolean).length;
  return <div className="student-phd-panel"><div className="student-phd-panel-head"><div><span className="student-phd-kicker"><MessageSquare size={14}/>面试回顾</span><h2>面试准备与复盘</h2><p>把每次准备留下来的答案，沉淀成下一次面试可以复用的资产。</p></div><span className="student-phd-count">{completed}/{interviewQuestions.length} 已完成</span></div><div className="student-review-strip"><span><Check size={13}/>导师主页已阅读</span><span><Check size={13}/>研究计划已上传</span><span className={completed===interviewQuestions.length?'done':''}><MessageSquare size={13}/>{completed===interviewQuestions.length?'准备已完成':'继续完善回答'}</span></div><StudentInterviewPrep notes={interviewNotes} onSave={onSave} onNotify={onNotify}/></div>;
}

function StudentWorldClock() {
  const [now,setNow]=useState(()=>new Date());
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),30000);return()=>clearInterval(timer);},[]);
  return <div className="student-phd-panel"><div className="student-phd-panel-head"><div><span className="student-phd-kicker"><Globe2 size={14}/>世界时钟</span><h2>和导师约时间前先看时区</h2><p>按照导师所在地快速判断适合发送邮件或安排会议的时间。</p></div><span className="student-phd-count">实时更新</span></div><div className="student-clock-grid">{studentWorldClockZones.map(zone=>{const time=new Intl.DateTimeFormat('zh-CN',{timeZone:zone.zone,hour:'2-digit',minute:'2-digit',hour12:false}).format(now);const date=new Intl.DateTimeFormat('zh-CN',{timeZone:zone.zone,month:'numeric',day:'numeric',weekday:'short'}).format(now);return <article key={zone.zone}><span><Globe2 size={16}/>{zone.country}</span><strong>{zone.city}</strong><b>{time}</b><small>{date} · {zone.note}</small></article>})}</div></div>;
}

function StudentSchoolList() {
  const [query,setQuery]=useState('');
  const visible=schoolCatalog.filter(school=>[school.name,school.en,school.country,school.city,...school.programs].join(' ').toLowerCase().includes(query.toLowerCase())).sort((a,b)=>a.ranking-b.ranking);
  return <div className="student-phd-panel"><div className="student-phd-panel-head"><div><span className="student-phd-kicker"><GraduationCap size={14}/>院校榜单</span><h2>院校排名与申请参考</h2><p>先看排名和项目方向，再结合老师给你的申请策略做选择。</p></div><label className="student-phd-search"><Search size={14}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索院校、地区或项目..." aria-label="搜索院校榜单"/></label></div><div className="student-school-list">{visible.slice(0,12).map(school=><article key={school.id}><span className="student-school-rank"><small>QS</small><b>{school.ranking}</b></span><div><strong>{school.name}</strong><small>{school.en}</small></div><span>{school.country} · {school.city}</span><p>{school.programs.slice(0,3).join(' · ')}</p><b>{school.intake}</b></article>)}</div></div>;
}

function StudentDataManagement({caseId,studentName}) {
  return <div className="student-phd-panel"><div className="student-phd-panel-head"><div><span className="student-phd-kicker"><Paperclip size={14}/>资料管理</span><h2>我的申请资料</h2><p>简历、Research Proposal 和共享文件都集中在这里，老师上传后会同步显示。</p></div><span className="student-phd-count">学生与老师共享</span></div><div className="student-material-shortcuts"><article><FileText size={17}/><div><strong>我的简历 CV</strong><small>研究经历、方法训练和成果链接</small></div><span>已上传</span></article><article><FileText size={17}/><div><strong>我的 Research Proposal</strong><small>研究问题、方法与导师方向衔接</small></div><span>待老师审核</span></article></div><MaterialChecklist/><FileUploadPanel caseId={caseId} uploadedBy={`学生 · ${studentName}`} title="共享文件与附件"/></div>;
}

function StudentSettings() {
  const [emailNotice,setEmailNotice]=useState(true); const [weekly,setWeekly]=useState(true);
  return <div className="student-phd-panel"><div className="student-phd-panel-head"><div><span className="student-phd-kicker"><Settings2 size={14}/>系统设置</span><h2>学生端偏好设置</h2><p>学生端仅开放个人提醒与显示偏好；邮箱授权、AI Key 等系统配置由老师或管理员管理。</p></div><span className="student-phd-readonly">安全范围内可调整</span></div><div className="student-settings-list"><label><span><strong>导师回复提醒</strong><small>有新的套磁状态或老师留言时提醒我</small></span><input type="checkbox" checked={emailNotice} onChange={event=>setEmailNotice(event.target.checked)}/></label><label><span><strong>每周申请进度摘要</strong><small>每周收到一次材料、申请和面试准备摘要</small></span><input type="checkbox" checked={weekly} onChange={event=>setWeekly(event.target.checked)}/></label><div><strong>数据与隐私</strong><small>你的反馈、面试答案和文件只在当前服务项目内与老师共享。</small></div></div></div>;
}

function StudentPhdHubView({student,mentors,feedback,feedbackNotes,interviewNotes,onSaveInterviewNote,onNotify,activeModule,setActiveModule,caseId}) {
  const active=studentPhdHubNav.find(([id])=>id===activeModule)||studentPhdHubNav[0];
  const content={
    dashboard:<StudentOutreachDashboard mentors={mentors} feedback={feedback} onNotify={onNotify}/>,
    email:<StudentEmailRecords/>,
    library:<StudentMentorLibrary mentors={mentors} onNotify={onNotify}/>,
    templates:<StudentTemplateLibrary onNotify={onNotify}/>,
    review:<StudentInterviewReview interviewNotes={interviewNotes} onSave={onSaveInterviewNote} onNotify={onNotify}/>,
    clock:<StudentWorldClock/>,
    schoollist:<StudentSchoolList/>,
    data:<StudentDataManagement caseId={caseId} studentName={student.name}/>,
    settings:<StudentSettings/>
  }[active[0]];
  return <section className="student-phdhub-view"><div className="student-phdhub-head"><div><span className="student-phd-kicker"><BriefcaseBusiness size={14}/>PhDHub 学生端</span><h2>博士申请工具</h2><p>把套磁、导师资料、面试准备、院校信息和申请材料放在一个工作区。</p></div><span className="student-phdhub-case">{student.name} · {student.target}</span></div><div className="student-phdhub-layout"><aside className="student-phdhub-nav"><div className="student-phdhub-brand"><strong>PhD<span>Hub</span></strong><small>学生申请工作台</small></div><span className="student-phdhub-nav-title">导航菜单</span><nav aria-label="PhDHub 学生端导航">{studentPhdHubNav.map(([id,label,Icon])=><button type="button" key={id} className={active[0]===id?'active':''} onClick={()=>setActiveModule(id)}><Icon size={15}/><span>{label}</span></button>)}</nav><div className="student-phdhub-permission"><Check size={13}/><span>已连接服务项目<br/><small>老师与学生共享申请进度</small></span></div></aside><div className="student-phdhub-content"><div className="student-phdhub-breadcrumb"><span>PhDHub</span><ArrowRight size={13}/><strong>{active[1]}</strong></div>{content}</div></div></section>;
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

function VikaGrid({mentors, fields, selected, toggle, filterText, setFilterText, filterField, setFilterField, onOpenRecord}) {
  const fieldRows=Array.from(new Map((fields.length?fields:Object.keys(mentors[0]?.rawFields||{}).map(name=>({name,type:'Text'}))).map(field=>[field.name,field])).values());
  const [hiddenFields,setHiddenFields]=useState([]); const [showFields,setShowFields]=useState(false); const [sortField,setSortField]=useState('__fit'); const [sortAsc,setSortAsc]=useState(false); const [selectedOnly,setSelectedOnly]=useState(false); const [detailMentor,setDetailMentor]=useState(null);
  const openRecord=onOpenRecord||setDetailMentor;
  const visibleFields=fieldRows.filter(field=>!hiddenFields.includes(field.name));
  const coreFieldNames=fieldRows.filter(field=>/导师$|Location|学校名字|QS排名|USNEWS排名|Department|导师主页|博士申请信息|招生窗口/.test(field.name)).map(field=>field.name);
  const fieldGroups=[
    ['基础信息',fieldRows.filter(field=>/导师$|Location|学校名字|Department/.test(field.name))],
    ['排名与申请',fieldRows.filter(field=>/QS排名|USNEWS排名|主页|申请信息|招生窗口/.test(field.name))],
    ['协作与反馈',fieldRows.filter(field=>/备注|意向|反馈|状态/.test(field.name))]
  ];
  const groupedNames=new Set(fieldGroups.flatMap(([,rows])=>rows.map(field=>field.name)));
  const remainingFields=fieldRows.filter(field=>!groupedNames.has(field.name));
  if(remainingFields.length)fieldGroups.push(['其他字段',remainingFields]);
  const toggleField=name=>setHiddenFields(current=>current.includes(name)?current.filter(field=>field!==name):visibleFields.length>1?[...current,name]:current);
  const showCoreFields=()=>setHiddenFields(fieldRows.filter(field=>!coreFieldNames.includes(field.name)).map(field=>field.name));
  const visible=mentors.filter(mentor=>{const raw=mentor.rawFields||{};const all=fieldRows.map(field=>formatFieldValue(raw[field.name])).join(' ').toLowerCase();const selectedValue=filterField==='__all'?all:formatFieldValue(raw[filterField]).toLowerCase();return(!filterText||selectedValue.includes(filterText.toLowerCase()))&&(!selectedOnly||selected.includes(mentor.id));}).sort((a,b)=>{const value=mentor=>sortField==='__fit'?mentor.fit:formatFieldValue(mentor.rawFields?.[sortField]);const left=value(a);const right=value(b);const result=typeof left==='number'&&typeof right==='number'?left-right:String(left).localeCompare(String(right),'zh-CN');return sortAsc?result:-result;});
  return <><div className="vika-grid-view">
    <div className="vika-grid-toolbar"><div className="grid-source"><Table2 size={15}/><strong>Vika 多维表格视图</strong><span>{fieldRows.length} 个字段 · {visible.length}/{mentors.length} 条</span></div><label className="grid-search"><Search size={14}/><input value={filterText} onChange={e=>setFilterText(e.target.value)} placeholder="搜索字段值..."/></label><select value={filterField} onChange={e=>setFilterField(e.target.value)} aria-label="搜索字段"><option value="__all">全部字段</option>{fieldRows.map(field=><option key={field.name} value={field.name}>{field.name}</option>)}</select><select value={sortField} onChange={e=>setSortField(e.target.value)} aria-label="表格排序"><option value="__fit">匹配度</option>{fieldRows.map(field=><option key={field.name} value={field.name}>{field.name}</option>)}</select><button className={`grid-tool-button ${sortAsc?'ascending':''}`} onClick={()=>setSortAsc(value=>!value)} title="切换排序方向"><ArrowRight size={14}/>排序</button><button className={`grid-tool-button ${selectedOnly?'active':''}`} onClick={()=>setSelectedOnly(value=>!value)}><Check size={13}/>只看已选</button><button className={`grid-tool-button ${showFields?'active':''}`} aria-expanded={showFields} onClick={()=>setShowFields(value=>!value)}><ListFilter size={13}/>字段 {visibleFields.length}/{fieldRows.length}<ChevronDown size={13}/></button></div>
    {showFields&&<section className="grid-field-picker" aria-label="字段展示设置"><div className="grid-field-picker-head"><div><span className="grid-field-picker-icon"><ListFilter size={17}/></span><span><strong>字段展示</strong><small>按工作阶段保留重点信息，原始数据不会被删除</small></span></div><div className="grid-field-actions"><button type="button" onClick={showCoreFields}>核心字段</button><button type="button" onClick={()=>setHiddenFields([])}>全部显示</button></div></div><div className="grid-field-status"><span><Eye size={13}/>当前显示 <b>{visibleFields.length}</b> / {fieldRows.length} 个字段</span><i><em style={{width:`${fieldRows.length?visibleFields.length/fieldRows.length*100:0}%`}}/></i></div><div className="grid-field-groups">{fieldGroups.map(([label,rows])=>rows.length?<section key={label}><header><strong>{label}</strong><span>{rows.filter(field=>!hiddenFields.includes(field.name)).length}/{rows.length}</span></header><div>{rows.map(field=>{const active=!hiddenFields.includes(field.name);return <button type="button" key={field.name} className={active?'active':''} aria-pressed={active} onClick={()=>toggleField(field.name)}><span>{active?<Check size={13}/>:<Plus size={13}/>}</span>{field.name}</button>})}</div></section>:null)}</div></section>}
    <div className="grid-scroll-hint" role="note"><ArrowRight size={13}/><span>点击任意记录查看完整字段详情，长内容可悬停查看</span></div><div className="vika-table-scroll" aria-label="Vika 多维表格，当前窗口完整展示全部字段"><table className="vika-table"><thead><tr><th className="pin-col">方案</th>{visibleFields.map(field=><th key={field.name} title={`${field.name} · ${field.type}`}>{field.name}</th>)}</tr></thead><tbody>{visible.map(mentor=><tr className={`${selected.includes(mentor.id)?'selected-row ':''}record-clickable`} key={mentor.id} tabIndex={0} onClick={()=>openRecord(mentor)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openRecord(mentor);}}}><td className="pin-col"><button className={selected.includes(mentor.id)?'grid-select selected':'grid-select'} onClick={event=>{event.stopPropagation();toggle(mentor.id)}}>{selected.includes(mentor.id)?<Check size={13}/>:<Plus size={13}/>}<span>{selected.includes(mentor.id)?'已选':'选入'}</span></button></td>{visibleFields.map(field=><td key={field.name} title={formatFieldValue(mentor.rawFields?.[field.name])}>{formatFieldValue(mentor.rawFields?.[field.name])}</td>)}</tr>)}</tbody></table></div>{!visible.length&&<div className="grid-empty"><ListFilter size={20}/><p>没有符合筛选条件的导师记录</p></div>}
  </div>{!onOpenRecord&&<MentorRecordDrawer mentor={detailMentor} onClose={()=>setDetailMentor(null)} selected={selected?.includes(detailMentor?.id)} onToggle={toggle}/>}</>;
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
  {id:3,name:'陈一诺',target:'澳洲 · 商科研究型硕士',owner:'顾问 李卓',count:8,stage:'等待套磁'},
  ...additionalStudents.slice(0,7).map(student=>({id:student.id,name:student.name,target:student.target,owner:`顾问 ${student.manager}`,count:student.count,stage:student.stage})),
  {id:16,name:'俞哲轩',target:'全球 · 青少年心理健康博士',owner:'顾问 张晓彤',count:121,stage:'导师初筛',mentorSource:'yuzhexuan'}
];

const VIKA_SHARE_URL = 'https://vika.cn/share/shrTzS4oK9drnKBRsf0r8/dstZnUUzHafFYQXoZT/viwtwGOy6pNXn';

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
  return <details className="mentor-note-editor"><summary><span><PenLine size={12}/>给学生的推荐备注 <Bone size={11} aria-hidden="true"/> <b>学生可见</b></span><p>{note||'点击补充推荐依据，避免只留下一个截断单元格。'}</p></summary><textarea value={draft} onChange={event=>setDraft(event.target.value)} placeholder="例如：助理教授；青少年网络霸凌与心理健康、学校社会工作……" aria-label={`${mentor.name} 的学生可见推荐备注`}/><div className="mentor-note-actions"><span>{dirty?'尚未同步':'已同步'}</span>{dirty&&<button type="button" className="note-save-button" onClick={()=>onChange(draft)}><Check size={12}/>保存并同步</button>}</div></details>;
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

function MentorRecordDrawer({mentor,onClose,studentMode=false,selected=false,onToggle,feedback={},feedbackNotes={},notes={},onFeedback,onFeedbackNote,onNoteChange}) {
  if(!mentor)return null;
  const selectedFeedback=feedbackMeta(feedback[mentor.id]);
  const note=mentorRecommendationNote(mentor,notes);
  const entries=Object.entries(mentor.rawFields||{});
  const renderValue=value=>{
    const text=formatFieldValue(value);
    const isLink=/^https?:\/\//.test(text);
    return isLink?<a href={text} target="_blank" rel="noreferrer" title={text}>{text}</a>:text;
  };
  return <div className="mentor-record-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><aside className={`mentor-record-drawer${studentMode?' student':''}`} role="dialog" aria-modal="true" aria-label={`${mentor.name} 记录详情`} onMouseDown={event=>event.stopPropagation()}>
    <header className="mentor-record-head"><div><span className="mentor-record-kicker"><Table2 size={14}/>多维记录详情</span><h2>{mentor.name}</h2><p>{mentor.school} · {mentor.dept} · {mentorField(mentor,'Location')}</p></div><button type="button" className="mentor-record-close" onClick={onClose} aria-label="关闭详情"><X size={18}/></button></header>
    <div className="mentor-record-tabs"><span className="active">详情</span><span>字段历史</span><span>打印视图</span></div>
    <div className="mentor-record-body"><div className="mentor-record-summary"><div><small>匹配度</small><strong>{mentor.fit}%</strong></div><div><small>QS 排名</small><strong>{mentorRankings(mentor).qs}</strong></div><div><small>招生窗口</small><strong>{mentor.open||'待确认'}</strong></div><div><small>当前反馈</small><strong>{selectedFeedback?.label||'待反馈'}</strong></div></div><section className="mentor-record-section"><div className="mentor-record-section-head"><h3>全部字段</h3><span>{entries.length} 个字段</span></div><div className="mentor-record-fields">{entries.map(([label,value])=><div key={label}><span>{label}</span><strong>{renderValue(value)}</strong></div>)}</div></section><section className="mentor-record-section mentor-record-note-section"><div className="mentor-record-section-head"><h3>{studentMode?'老师给你的推荐备注':'推荐备注'}</h3><span>{studentMode?'学生可见':'可同步给学生'}</span></div>{studentMode?<MentorNoteReadonly note={note}/>:<MentorNoteEditor mentor={mentor} note={note} onChange={onNoteChange||(()=>{})}/>}</section>{studentMode&&<section className="mentor-record-section"><div className="mentor-record-section-head"><h3>学生反馈</h3><span>{selectedFeedback?'已记录':'请选择一个推进批次'}</span></div><div className="mentor-record-feedback-actions">{feedbackOptions.map(option=><button type="button" key={option.id} className={selectedFeedback?.id===option.id?`selected ${option.tone}`:''} onClick={()=>onFeedback?.(mentor,option.id)}>{option.id==='first'&&<Star size={14}/>} {option.label}</button>)}</div><MentorFeedbackComposer mentor={mentor} value={feedbackNotes[mentor.id]||''} onSave={onFeedbackNote||(()=>{})}/></section>}</div>
    <footer className="mentor-record-footer">{studentMode?<span><Eye size={14}/>学生端可查看全部字段和老师备注</span>:<button type="button" className={selected?'selected':''} onClick={()=>onToggle?.(mentor.id)}>{selected?<><Check size={14}/>已加入推荐方案</>:<><Plus size={14}/>加入推荐方案</>}</button>}<button type="button" className="mentor-record-footer-close" onClick={onClose}>完成</button></footer>
  </aside></div>;
}

function FileUploadPanel({caseId, uploadedBy, title='共享文件'}) {
  const [files,setFiles]=useState([]); const [uploading,setUploading]=useState(false); const [error,setError]=useState('');
  const loadFiles=()=>apiRequest(`/api/files?caseId=${encodeURIComponent(caseId)}`).then(data=>{setFiles(Array.isArray(data.files)?data.files:[]);return data;}).catch(error=>{setError(error.message||'文件列表暂时无法读取');return null;});
  useEffect(()=>{loadFiles();},[caseId]);
  const upload=event=>{const file=event.target.files?.[0]; if(!file)return; setUploading(true); setError(''); const body=new FormData(); body.append('file',file); body.append('caseId',caseId); body.append('uploadedBy',uploadedBy); apiRequest('/api/files',{method:'POST',body}).then(()=>loadFiles()).catch(err=>setError(err.message||'上传失败')).finally(()=>{setUploading(false);event.target.value='';});};
  const remove=file=>{if(!window.confirm(`确认删除 ${file.name}？`))return;setError('');apiRequest('/api/files',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:file.id})}).then(()=>loadFiles()).catch(err=>setError(err.message||'删除失败'));};
  return <section className="file-panel"><div className="section-heading"><h3><Paperclip size={14}/> {title}</h3><label className="upload-button"><CloudUpload size={14}/>{uploading?'上传中...':'上传文件'}<input type="file" onChange={upload} disabled={uploading}/></label></div>{error&&<p className="file-error">{error}</p>}{files.length?<div className="file-list">{files.map(file=><div key={file.id}><span className="file-icon"><File size={14}/></span><span><strong>{file.name}</strong><small>{file.uploadedBy} · {new Date(file.uploadedAt).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</small></span><span className="file-actions"><a href={`/api/files/${file.id}/download`} title="下载文件"><Download size={14}/></a><button type="button" onClick={()=>remove(file)} title="删除文件" aria-label={`删除 ${file.name}`}><Trash2 size={14}/></button></span></div>)}</div>:<div className="file-empty"><Paperclip size={18}/><span>还没有文件，学生和老师上传后会在这里同步显示</span></div>}</section>;
}

function MentorWorkspaceLegacy({onNotify}) {
  const [studentId,setStudentId]=useState(1); const [selected,setSelected]=useState([1,2]); const [preview,setPreview]=useState(false); const [sent,setSent]=useState(false); const [synced,setSynced]=useState(false); const [displayMode,setDisplayMode]=useState('crm'); const [filterText,setFilterText]=useState(''); const [filterField,setFilterField]=useState('__all'); const [vika,setVika]=useState({status:'loading',mentors:[],fields:[],total:0,syncedAt:''});
  const loadVika=(force=false)=>apiRequest(`/api/vika/sync${force?'?force=1':''}`).then(data => { if (data.mentors) setVika({status:'ready',mentors:data.mentors,fields:data.fields||[],total:data.total,syncedAt:data.syncedAt}); else setVika({status:'error',mentors:[],fields:[],total:0,error:data.error}); }).catch(error => setVika({status:'error',mentors:[],fields:[],total:0,error:error.message}));
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

function StudentMentorTable({mentors,feedback={},onOpenRecord}) {
  const fieldRows=Array.from(new Map(Object.keys(mentors[0]?.rawFields||{}).map(name=>[name,{name,type:'Text'}])).values());
  const [query,setQuery]=useState('');
  const [fieldFilter,setFieldFilter]=useState('__all');
  const [hiddenFields,setHiddenFields]=useState([]);
  const [showFields,setShowFields]=useState(false);
  const [sortField,setSortField]=useState('__fit');
  const [sortAsc,setSortAsc]=useState(false);
  const visibleFields=fieldRows.filter(field=>!hiddenFields.includes(field.name));
  const toggleField=name=>setHiddenFields(current=>current.includes(name)?current.filter(field=>field!==name):visibleFields.length>1?[...current,name]:current);
  const visible=mentors.filter(mentor=>{const raw=mentor.rawFields||{};const all=fieldRows.map(field=>formatFieldValue(raw[field.name])).join(' ').toLowerCase();const value=fieldFilter==='__all'?all:formatFieldValue(raw[fieldFilter]).toLowerCase();return !query||value.includes(query.toLowerCase());}).sort((left,right)=>{const value=mentor=>sortField==='__fit'?mentor.fit:formatFieldValue(mentor.rawFields?.[sortField]);const result=sortField==='__fit'?value(left)-value(right):String(value(left)).localeCompare(String(value(right)),'zh-CN');return sortAsc?result:-result;});
  return <div className="vika-grid-view student-vika-grid"><div className="vika-grid-toolbar"><div className="grid-source"><Table2 size={15}/><strong>Vika 多维表格视图</strong><span>{fieldRows.length} 个字段 · {visible.length}/{mentors.length} 条</span></div><label className="grid-search"><Search size={14}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索导师、学校、方向或字段值..." aria-label="学生端表格搜索"/></label><select value={fieldFilter} onChange={event=>setFieldFilter(event.target.value)} aria-label="学生端表格搜索字段"><option value="__all">全部字段</option>{fieldRows.map(field=><option key={field.name} value={field.name}>{field.name}</option>)}</select><select value={sortField} onChange={event=>setSortField(event.target.value)} aria-label="学生端表格排序"><option value="__fit">匹配度</option>{fieldRows.map(field=><option key={field.name} value={field.name}>{field.name}</option>)}</select><button type="button" className={`grid-tool-button ${sortAsc?'ascending':''}`} onClick={()=>setSortAsc(value=>!value)} title="切换排序方向"><ArrowRight size={14}/>排序</button><button type="button" className={showFields?'grid-tool-button active':'grid-tool-button'} aria-expanded={showFields} onClick={()=>setShowFields(value=>!value)}><ListFilter size={13}/>字段 {visibleFields.length}/{fieldRows.length}<ChevronDown size={13}/></button></div>{showFields&&<div className="student-vika-fields" aria-label="学生端字段展示设置">{fieldRows.map(field=>{const active=!hiddenFields.includes(field.name);return <button type="button" key={field.name} className={active?'active':''} aria-pressed={active} onClick={()=>toggleField(field.name)}><span>{active?<Check size={12}/>:<Plus size={12}/>}</span>{field.name}</button>})}</div>}<div className="grid-scroll-hint" role="note"><ArrowRight size={13}/><span>点击任意记录查看完整字段详情，长内容可悬停查看</span></div><div className="vika-table-scroll" aria-label="学生端 Vika 多维表格"><table className="vika-table"><thead><tr><th className="pin-col">详情</th>{visibleFields.map(field=><th key={field.name} title={`${field.name} · ${field.type}`}>{field.name}</th>)}</tr></thead><tbody>{visible.map(mentor=><tr key={mentor.id} tabIndex={0} onClick={()=>onOpenRecord?.(mentor)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' ')onOpenRecord?.(mentor)}}><td className="pin-col"><button type="button" className="grid-select grid-record-open" onClick={event=>{event.stopPropagation();onOpenRecord?.(mentor)}} title="查看完整记录"><Eye size={13}/><span>{feedbackMeta(feedback[mentor.id])?.short||'查看'}</span></button></td>{visibleFields.map(field=><td key={field.name} title={formatFieldValue(mentor.rawFields?.[field.name])}>{formatFieldValue(mentor.rawFields?.[field.name])}</td>)}</tr>)}</tbody></table></div>{!visible.length&&<div className="grid-empty"><ListFilter size={20}/><p>没有符合筛选条件的导师记录</p></div>}</div>;
}

function MentorBoardInteractive({mentors,selected=[],toggle=()=>{},feedback={},studentMode=false,onFeedback,onOpenRecord}) {
  const columns=[
    {id:'priority',label:'优先套磁',hint:'学生优先反馈',tone:'priority'},
    {id:'second',label:'第二批',hint:'待第一轮完成后推进',tone:'second'},
    {id:'third',label:'第三批',hint:'保留排序，后续推进',tone:'third'},
    {id:'pending',label:'待反馈',hint:'等待学生选择',tone:'pending'},
    {id:'no',label:'不考虑',hint:'保留记录，不进入方案',tone:'muted'}
  ];
  const [statusOverrides,setStatusOverrides]=useState({});
  const [draggedMentorId,setDraggedMentorId]=useState(null);
  const [dragOverColumn,setDragOverColumn]=useState('');
  const choiceByColumn={priority:'first',second:'second',third:'third',no:'no'};
  const statusOf=mentor=>{if(statusOverrides[mentor.id])return statusOverrides[mentor.id];const choice=feedback[mentor.id];if(choice==='first')return'priority';if(choice==='second')return'second';if(choice==='third')return'third';if(choice==='no')return'no';const raw=mentor.rawFields||{};const value=Object.entries(raw).find(([key])=>/意向|反馈|选择/.test(key))?.[1];const valueText=formatFieldValue(value);if(/不考虑|拒绝/.test(valueText))return'no';if(/第三批/.test(valueText))return'third';if(/第二批/.test(valueText))return'second';if(/优先|第一批/.test(valueText))return'priority';return selected.includes(mentor.id)?'priority':'pending';};
  const moveMentor=(mentorId,columnId)=>{const mentor=mentors.find(item=>item.id===mentorId);if(!mentor)return;setStatusOverrides(current=>({...current,[mentorId]:columnId}));const choice=choiceByColumn[columnId];if(choice)onFeedback?.(mentor,choice);setDraggedMentorId(null);setDragOverColumn('');};
  const openRecord=mentor=>onOpenRecord?.(mentor);
  const handleCardKeyDown=(event,mentor)=>{if((event.key==='Enter'||event.key===' ')&&onOpenRecord){event.preventDefault();openRecord(mentor);}};
  return <div className="mentor-board" aria-label="导师反馈看板"><p className="board-drag-hint"><GitCompareArrows size={13}/>拖动卡片到其他列，即可切换状态</p>{columns.map(column=>{const rows=mentors.filter(mentor=>statusOf(mentor)===column.id);return <section className={`mentor-board-column ${column.tone}${dragOverColumn===column.id?' drag-over':''}`} key={column.id} onDragOver={event=>{event.preventDefault();setDragOverColumn(column.id)}} onDragLeave={event=>{if(!event.currentTarget.contains(event.relatedTarget))setDragOverColumn('')}} onDrop={event=>{event.preventDefault();const mentorId=Number(event.dataTransfer.getData('text/plain'))||draggedMentorId;moveMentor(mentorId,column.id)}}><header><div><strong>{column.label}</strong><small>{column.hint}</small></div><b>{rows.length}</b></header><div className="mentor-board-list">{rows.map(mentor=>{const ranking=mentorRankings(mentor);const choice=feedbackMeta(choiceByColumn[statusOf(mentor)]);return <article key={mentor.id} draggable className={`${onOpenRecord?'board-record-card ':''}${draggedMentorId===mentor.id?'dragging':''}`} role={onOpenRecord?'button':undefined} tabIndex={onOpenRecord?0:undefined} aria-grabbed={draggedMentorId===mentor.id} onDragStart={event=>{if(event.target.closest('button,a,input,select,textarea')){event.preventDefault();return;}setDraggedMentorId(mentor.id);event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',String(mentor.id))}} onDragEnd={()=>{setDraggedMentorId(null);setDragOverColumn('')}} onClick={()=>openRecord(mentor)} onKeyDown={event=>handleCardKeyDown(event,mentor)}><div className="board-card-head"><span className="mentor-avatar">{mentor.name.split(' ').slice(-1)[0][0]}</span><div><strong>{mentor.name}</strong><small>{mentor.school}</small></div><b>{mentor.fit}%</b></div><p>{mentor.dept} · {mentor.topic}</p><div className="mentor-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(mentor,'Location')}</span></div><MentorLinks mentor={mentor}/>{studentMode?<><div className="board-record-state"><MessageSquare size={12}/>{choice?.label||'待反馈'}</div><button type="button" className="board-action" onClick={event=>{event.stopPropagation();openRecord(mentor)}}><Eye size={13}/>查看详情</button></>:<button type="button" className={selected.includes(mentor.id)?'board-action selected':'board-action'} onClick={event=>{event.stopPropagation();toggle(mentor.id)}}>{selected.includes(mentor.id)?<><Check size={13}/>已在方案</>:<><Plus size={13}/>加入方案</>}</button>}</article>})}</div>{!rows.length&&<div className="board-empty">暂无导师</div>}</section>})}</div>;
}

function StudentMentorTableWithDrawer({mentors,feedback={},feedbackNotes={},notes={},onFeedback,onFeedbackNote}) {
  const [detailMentor,setDetailMentor]=useState(null);
  return <><StudentMentorTable mentors={mentors} feedback={feedback} onOpenRecord={setDetailMentor}/><MentorRecordDrawer mentor={detailMentor} onClose={()=>setDetailMentor(null)} studentMode selected={false} feedback={feedback} feedbackNotes={feedbackNotes} notes={notes} onFeedback={onFeedback} onFeedbackNote={onFeedbackNote}/></>;
}

function MentorBoardWithDrawer({studentMode=false,feedback={},feedbackNotes={},notes={},onFeedback,onFeedbackNote,onNoteChange,...props}) {
  const [detailMentor,setDetailMentor]=useState(null);
  return <><MentorBoardInteractive {...props} studentMode={studentMode} feedback={feedback} onFeedback={onFeedback} onOpenRecord={setDetailMentor}/><MentorRecordDrawer mentor={detailMentor} onClose={()=>setDetailMentor(null)} studentMode={studentMode} selected={props.selected?.includes(detailMentor?.id)} onToggle={props.toggle} feedback={feedback} feedbackNotes={feedbackNotes} notes={notes} onFeedback={onFeedback} onFeedbackNote={onFeedbackNote} onNoteChange={onNoteChange}/></>;
}

const MentorBoardView = MentorBoardWithDrawer;

function MentorLinkView({mentors,selected,toggle}) {
  return <div className="mentor-link-view"><div className="link-view-head"><div><h3>导师链接中心</h3><p>把导师主页、博士申请信息和其他导师链接集中在一张可扫描清单里。</p></div><span>{mentors.length} 位候选</span></div><div className="link-view-table"><div className="link-view-row link-view-header"><span>导师 / 学校</span><span>排名与地点</span><span>链接</span><span>方案</span></div>{mentors.map(mentor=>{const ranking=mentorRankings(mentor);return <div className="link-view-row" key={mentor.id}><span className="link-person"><i>{mentor.name.split(' ').slice(-1)[0][0]}</i><b>{mentor.name}<small>{mentor.school} · {mentor.dept}</small></b></span><span className="link-facts"><b>QS {ranking.qs}</b><b>US {ranking.usnews}</b><small>{mentorField(mentor,'Location')}</small></span><span className="link-actions">{mentorLinks(mentor).map(([label,url])=>url?<a href={url} target="_blank" rel="noreferrer" key={label}><ExternalLink size={12}/>{label}</a>:<span className="link-missing" key={label}>{label}未提供</span>)}</span><button className={selected.includes(mentor.id)?'link-select selected':'link-select'} onClick={()=>toggle(mentor.id)}>{selected.includes(mentor.id)?<><Check size={13}/>已选</>:<><Plus size={13}/>选入</>}</button></div>})}</div></div>;
}

function MentorWorkspaceBase({onNotify}) {
  const [studentId,setStudentId]=useState(1); const [selected,setSelected]=useState([1,2]); const [preview,setPreview]=useState(false); const [sent,setSent]=useState(false); const [synced,setSynced]=useState(false); const [displayMode,setDisplayMode]=useState('cards'); const [filterText,setFilterText]=useState(''); const [filterField,setFilterField]=useState('__all'); const [quickFilter,setQuickFilter]=useState('all'); const [sortMode,setSortMode]=useState('fit'); const [vika,setVika]=useState({status:'loading',mentors:[],fields:[],total:0,syncedAt:''});
  const loadVika=(force=false)=>apiRequest(`/api/vika/sync${force?'?force=1':''}`).then(data=>{if(data.mentors)setVika({status:'ready',mentors:data.mentors,fields:data.fields||[],total:data.total,syncedAt:data.syncedAt});else setVika({status:'error',mentors:[],fields:[],total:0,error:data.error});}).catch(error=>setVika({status:'error',mentors:[],fields:[],total:0,error:error.message}));
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
  const loadVika=(force=false)=>{const params=new URLSearchParams({studentId:String(studentId)});if(force)params.set('force','1');return apiRequest(`/api/vika/sync?${params}`).then(data=>{if(data.mentors)setVika({status:'ready',mentors:data.mentors,fields:data.fields||[],total:data.total,syncedAt:data.syncedAt,sourceUrl:data.sourceUrl});else setVika({status:'error',mentors:[],fields:[],total:0,error:data.error});}).catch(error=>setVika({status:'error',mentors:[],fields:[],total:0,error:error.message}));};
  useEffect(()=>{setVika(current=>({...current,status:'loading',mentors:[]}));loadVika();const timer=setInterval(loadVika,5*60*1000);return()=>clearInterval(timer);},[studentId]);
  const student=caseStudents.find(s=>s.id===studentId); const caseId=`student-${studentId}`; const activeMentors=vika.mentors.length?vika.mentors:mentors;
  const loadCaseState=()=>apiRequest(`/api/case-state?caseId=${encodeURIComponent(caseId)}`).then(data=>{const state=data.state||{};setMentorNotes(current=>({...current,...(state.notes||{})}));setStudentFeedback(state.feedback||{});setStudentFeedbackNotes(state.feedbackNotes||{});setStudentNote(state.studentNote||'');if(Array.isArray(state.selectedMentorIds))setSelected(state.selectedMentorIds);setSent(Boolean(state.sent));}).catch(()=>{});
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

function StudentMentorViewLegacy3({student,mentors,sent,onNotify,notes={},feedback={},onFeedback,feedbackNotes={},onFeedbackNote,studentNote='',onStudentNoteSubmit}) {
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

function StudentMentorCard({mentor,index,feedback={},feedbackNotes={},notes={},celebration,onFeedback,onFeedbackNote}) {
  const ranking=mentorRankings(mentor);
  const selectedFeedback=feedbackMeta(feedback[mentor.id]);
  const isCelebrating=celebration?.mentorId===mentor.id;
  return <article className={`student-mentor-card ${selectedFeedback?'feedback-settled ':''}${isCelebrating?'feedback-celebrating':''}`} data-mentor-id={mentor.id}>
    {isCelebrating&&<span className={`feedback-burst ${celebration.tone}`} aria-hidden="true"><i className="spark spark-one"></i><i className="spark spark-two"></i><i className="spark spark-three"></i><PawPrint className="burst-paw" size={18}/><Star className="burst-star" size={18}/><Bone className="burst-bone" size={16}/></span>}
    <div className="student-card-top"><span>推荐 {index+1}</span><div className="student-card-top-meta"><strong>{mentor.fit}% 匹配</strong><em className={selectedFeedback||feedbackNotes[mentor.id]?'done':'pending'}>{selectedFeedback||feedbackNotes[mentor.id]?<><CheckCircle2 size={11}/>已反馈</>:<><MessageSquare size={11}/>待反馈</>}</em></div></div>
    <h3>{mentor.name}</h3>
    <p className="school-name">{mentor.school} · {mentor.dept}</p>
    <div className="student-facts"><span>QS {ranking.qs}</span><span>US News {ranking.usnews}</span><span>{mentorField(mentor,'Location')}</span><span>招生 {mentor.open||'待确认'}</span><span>{mentor.dept}</span></div>
    <div className="research-area"><small>研究方向</small><b>{mentor.topic}</b></div>
    <MentorLinks mentor={mentor}/>
    <MentorNoteReadonly note={mentorRecommendationNote(mentor,notes)}/>
    <div className="student-actions four">{feedbackOptions.map(option=><button key={option.id} type="button" aria-pressed={selectedFeedback?.id===option.id} className={selectedFeedback?.id===option.id?`feedback-selected ${option.tone}`:''} onClick={()=>onFeedback(mentor,option.id)}>{option.id==='first'&&<Star size={14}/>} {option.short}</button>)}</div>
    {selectedFeedback&&<div className={`student-feedback-tag ${selectedFeedback.tone}`}><CheckCircle2 size={12}/>已完成反馈：{selectedFeedback.label}</div>}
    <MentorFeedbackComposer mentor={mentor} value={feedbackNotes[mentor.id]||''} onSave={onFeedbackNote||(()=>{})}/>
  </article>;
}

function StudentMentorViewCards({student,mentors,sent,onNotify,notes={},feedback={},onFeedback,feedbackNotes={},onFeedbackNote,studentNote='',onStudentNoteSubmit}) {
  const [note,setNote]=useState(studentNote);
  const [celebration,setCelebration]=useState(null);
  const [studentView,setStudentView]=useState('cards');
  const [browseMode,setBrowseMode]=useState('grid');
  const [activeIndex,setActiveIndex]=useState(0);
  useEffect(()=>setNote(studentNote||''),[studentNote]);
  const handleFeedback=(mentor,choice)=>{const tone=feedbackMeta(choice)?.tone||'first';const stamp=Date.now();setCelebration({mentorId:mentor.id,tone,stamp});window.setTimeout(()=>setCelebration(current=>current?.stamp===stamp?null:current),850);if(onFeedback)onFeedback(mentor,choice);else onNotify(`已标记 ${mentor.name} 为${feedbackMeta(choice)?.label||'反馈'}`);};
  const feedbackCount=mentors.filter(mentor=>feedback[mentor.id]||feedbackNotes[mentor.id]?.trim()).length;
  const isComplete=Boolean(mentors.length&&feedbackCount===mentors.length);
  const [studentFilters,setStudentFilters]=useState({query:'',location:'all',direction:'all',ranking:'all',open:'all',sort:'fit',status:'all'});
  const locations=Array.from(new Set(mentors.map(mentor=>mentorField(mentor,'Location')).filter(value=>value&&value!=='—')));
  const directions=Array.from(new Set(mentors.flatMap(mentor=>[mentor.dept,mentor.topic]).filter(Boolean)));
  const openings=Array.from(new Set(mentors.map(mentor=>mentor.open).filter(Boolean)));
  const rankNumber=value=>{const match=String(value??'').match(/\d+/);return match?Number(match[0]):Number.MAX_SAFE_INTEGER;};
  const rankMatches=(mentor,ranking)=>{const qs=rankNumber(ranking.qs);const usnews=rankNumber(ranking.usnews);switch(studentFilters.ranking){case'qs10':return qs<=10;case'qs30':return qs<=30;case'us10':return usnews<=10;case'us30':return usnews<=30;case'either30':return qs<=30||usnews<=30;default:return true;}};
  const visibleMentors=mentors.filter(mentor=>{const ranking=mentorRankings(mentor);const feedbackDone=Boolean(feedback[mentor.id]||feedbackNotes[mentor.id]?.trim());const rawValues=Object.values(mentor.rawFields||{}).map(formatFieldValue).join(' ');const haystack=[mentor.name,mentor.school,mentor.dept,mentor.topic,mentor.open,mentorField(mentor,'Location'),rawValues].join(' ').toLowerCase();return(!studentFilters.query||haystack.includes(studentFilters.query.toLowerCase()))&&(studentFilters.location==='all'||mentorField(mentor,'Location')===studentFilters.location)&&(studentFilters.direction==='all'||mentor.dept===studentFilters.direction||mentor.topic===studentFilters.direction)&&(studentFilters.open==='all'||mentor.open===studentFilters.open)&&(studentFilters.status==='all'||(studentFilters.status==='pending'&&!feedbackDone)||(studentFilters.status==='done'&&feedbackDone))&&rankMatches(mentor,ranking);}).sort((left,right)=>{switch(studentFilters.sort){case'qs':return rankNumber(mentorRankings(left).qs)-rankNumber(mentorRankings(right).qs);case'usnews':return rankNumber(mentorRankings(left).usnews)-rankNumber(mentorRankings(right).usnews);case'school':return left.school.localeCompare(right.school,'en');default:return right.fit-left.fit;}});
  const activeFilterCount=[studentFilters.query,studentFilters.location!=='all',studentFilters.direction!=='all',studentFilters.ranking!=='all',studentFilters.open!=='all',studentFilters.status!=='all'].filter(Boolean).length;
  const visibleMentorIds=visibleMentors.map(mentor=>mentor.id).join(',');
  const clearStudentFilters=()=>setStudentFilters(current=>({...current,query:'',location:'all',direction:'all',ranking:'all',open:'all',status:'all'}));
  const switchBrowseMode=mode=>{setStudentView('cards');setBrowseMode(mode);if(mode==='single')setActiveIndex(0);};
  const switchStudentView=mode=>{setStudentView(mode);if(mode==='cards')setBrowseMode('grid');};
  const moveSingleCard=direction=>setActiveIndex(current=>{if(!visibleMentors.length)return 0;return(current+direction+visibleMentors.length)%visibleMentors.length;});
  useEffect(()=>setActiveIndex(0),[visibleMentorIds]);
  useEffect(()=>{
    if(studentView!=='cards'||browseMode!=='single')return undefined;
    const handleKeyDown=event=>{
      const tagName=event.target?.tagName;
      if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(tagName)||event.target?.isContentEditable)return;
      if(!visibleMentors.length||!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();
      setActiveIndex(current=>{const direction=event.key==='ArrowLeft'?-1:1;return(current+direction+visibleMentors.length)%visibleMentors.length;});
    };
    window.addEventListener('keydown',handleKeyDown);
    return()=>window.removeEventListener('keydown',handleKeyDown);
  },[studentView,browseMode,visibleMentors.length]);
  const activeMentor=visibleMentors[Math.min(activeIndex,Math.max(visibleMentors.length-1,0))]||null;
  const renderMentorCard=(mentor,index)=><StudentMentorCard key={mentor.id} mentor={mentor} index={index} feedback={feedback} feedbackNotes={feedbackNotes} notes={notes} celebration={celebration} onFeedback={handleFeedback} onFeedbackNote={onFeedbackNote}/>;
  return <section className="student-preview">
    <div className="student-preview-head"><div><span className="student-avatar large">{student.name[0]}</span><div><small>你好，{student.name}</small><h2>你的导师推荐方案</h2><p>老师已经把推荐依据整理成卡片，请按优先级反馈，完整意见会同步给老师。</p></div></div><span className="student-preview-pet" aria-hidden="true"><PawPrint size={15}/><Bone size={13}/></span><span className="share-state">{sent?'已发送给学生':'预览模式'}</span></div>
    <div className={isComplete?'student-preview-progress complete':'student-preview-progress'}><div><strong>{feedbackCount}/{mentors.length}</strong><span>位导师已完成反馈</span></div><i><em style={{width:(mentors.length?feedbackCount/mentors.length*100:0)+'%'}}></em></i>{isComplete&&<span className="feedback-complete-copy"><CheckCircle2 size={11}/>全部完成</span>}</div>
    <div className="student-filter-panel"><div className="student-filter-head"><div><span className="student-filter-kicker"><SlidersHorizontal size={14}/>多维筛选</span><strong>按你的关注点查找导师</strong></div><div className="student-filter-head-actions"><span className="student-filter-result">{visibleMentors.length}/{mentors.length} 位</span><div className="student-view-mode" role="group" aria-label="切换导师展示模式"><button type="button" className={browseMode==='grid'?'active':''} aria-pressed={browseMode==='grid'} onClick={()=>switchBrowseMode('grid')} title="双列卡片"><Grid2X2 size={14}/>多卡片</button><button type="button" className={browseMode==='single'?'active':''} aria-pressed={browseMode==='single'} onClick={()=>switchBrowseMode('single')} title="单卡片浏览"><LayoutList size={14}/>单卡片</button></div></div></div><div className="student-feedback-filters" role="group" aria-label="按反馈状态筛选"><span><CheckCircle2 size={12}/>反馈状态</span><button type="button" className={studentFilters.status==='all'?'active':''} aria-pressed={studentFilters.status==='all'} onClick={()=>setStudentFilters(current=>({...current,status:'all'}))}>全部 <b>{mentors.length}</b></button><button type="button" className={studentFilters.status==='pending'?'active':''} aria-pressed={studentFilters.status==='pending'} onClick={()=>setStudentFilters(current=>({...current,status:'pending'}))}>待反馈 <b>{mentors.length-feedbackCount}</b></button><button type="button" className={studentFilters.status==='done'?'active':''} aria-pressed={studentFilters.status==='done'} onClick={()=>setStudentFilters(current=>({...current,status:'done'}))}>已反馈 <b>{feedbackCount}</b></button></div><div className="student-filter-grid"><label className="student-filter-search"><Search size={14}/><input aria-label="搜索推荐导师" value={studentFilters.query} onChange={event=>setStudentFilters(current=>({...current,query:event.target.value}))} placeholder="搜索导师、学校、方向..."/></label><label><span>国家 / 地区</span><select aria-label="按国家或地区筛选" value={studentFilters.location} onChange={event=>setStudentFilters(current=>({...current,location:event.target.value}))}><option value="all">全部地区</option>{locations.map(location=><option key={location} value={location}>{location}</option>)}</select></label><label><span>研究方向</span><select aria-label="按研究方向筛选" value={studentFilters.direction} onChange={event=>setStudentFilters(current=>({...current,direction:event.target.value}))}><option value="all">全部方向</option>{directions.map(direction=><option key={direction} value={direction}>{direction}</option>)}</select></label><label><span>排名条件</span><select aria-label="按排名筛选" value={studentFilters.ranking} onChange={event=>setStudentFilters(current=>({...current,ranking:event.target.value}))}><option value="all">不限排名</option><option value="qs10">QS 前 10</option><option value="qs30">QS 前 30</option><option value="us10">US News 前 10</option><option value="us30">US News 前 30</option><option value="either30">QS / US News 前 30</option></select></label><label><span>招生窗口</span><select aria-label="按招生窗口筛选" value={studentFilters.open} onChange={event=>setStudentFilters(current=>({...current,open:event.target.value}))}><option value="all">全部窗口</option>{openings.map(opening=><option key={opening} value={opening}>{opening}</option>)}</select></label><label><span>排序方式</span><select aria-label="学生端导师排序" value={studentFilters.sort} onChange={event=>setStudentFilters(current=>({...current,sort:event.target.value}))}><option value="fit">匹配度优先</option><option value="qs">QS 排名优先</option><option value="usnews">US News 优先</option><option value="school">学校名称</option></select></label></div>{activeFilterCount>0&&<div className="student-filter-summary"><span><CheckCircle2 size={13}/>已应用 {activeFilterCount} 个筛选条件</span><button type="button" onClick={clearStudentFilters}><X size={13}/>清除条件</button></div>}</div>
    {visibleMentors.length ? browseMode==='single' ? <div className="student-single-browser"><button type="button" className="student-single-nav" onClick={()=>moveSingleCard(-1)} disabled={visibleMentors.length<2} aria-label="上一位导师" title="上一位导师"><ChevronLeft size={24}/></button><div className="student-single-stage" aria-live="polite"><div className="student-single-stage-head"><div><strong>单卡片浏览</strong><small>使用左右按钮或键盘 ← → 切换导师</small></div><b>{activeIndex+1} / {visibleMentors.length}</b></div><div className="student-mentor-grid student-single-grid">{activeMentor&&renderMentorCard(activeMentor,activeIndex)}</div></div><button type="button" className="student-single-nav" onClick={()=>moveSingleCard(1)} disabled={visibleMentors.length<2} aria-label="下一位导师" title="下一位导师"><ChevronRight size={24}/></button></div> : <div className="student-mentor-grid">{visibleMentors.map(renderMentorCard)}</div> : <div className="student-preview-empty"><Search size={20}/><strong>{mentors.length?'没有符合条件的导师':'还没有加入推荐方案的导师'}</strong><span>{mentors.length?'试试清除一个筛选条件，或换一个研究方向。':'返回老师工作台，选入导师后再发送给学生。'}</span></div>}
    <div className="student-note"><MessageSquare size={18}/><input value={note} onChange={event=>setNote(event.target.value)} placeholder="对推荐方案还有哪些想法？给选导老师留言..."/><button className="primary" onClick={()=>{if(!note.trim()){onNotify('请先填写反馈内容');return;}if(onStudentNoteSubmit)onStudentNoteSubmit(note.trim());else onNotify('反馈已提交给选导老师');setNote('')}}>提交留言</button></div>
  </section>;
}

function StudentMentorView({student,mentors,sent,onNotify,notes={},feedback={},onFeedback,feedbackNotes={},onFeedbackNote,studentNote='',onStudentNoteSubmit}) {
  const [view,setView]=useState('cards');
  const commonProps={student,mentors,sent,onNotify,notes,feedback,onFeedback,feedbackNotes,onFeedbackNote,studentNote,onStudentNoteSubmit};
  return <section className="student-multiview-shell">
    <div className="student-global-view-switcher" role="group" aria-label="切换导师多维视图">
      <div><Table2 size={14}/><strong>导师多维视图</strong><span>像飞书多维表格一样切换查看</span></div>
      <nav>
        <button type="button" className={view==='cards'?'active':''} onClick={()=>setView('cards')}><Grid2X2 size={14}/>卡片</button>
        <button type="button" className={view==='table'?'active':''} onClick={()=>setView('table')}><Table2 size={14}/>多维表格</button>
        <button type="button" className={view==='board'?'active':''} onClick={()=>setView('board')}><LayoutList size={14}/>看板</button>
      </nav>
    </div>
    {view==='table'?<StudentMentorTableWithDrawer mentors={mentors} feedback={feedback} feedbackNotes={feedbackNotes} notes={notes} onFeedback={onFeedback} onFeedbackNote={onFeedbackNote}/>:view==='board'?<MentorBoardWithDrawer mentors={mentors} studentMode feedback={feedback} feedbackNotes={feedbackNotes} notes={notes} onFeedback={onFeedback} onFeedbackNote={onFeedbackNote}/>:<StudentMentorViewCards {...commonProps}/>}
  </section>;
}

const phdOutreachStages=[
  {id:'draft',label:'待发送',hint:'确认材料与主题',tone:'draft'},
  {id:'sent',label:'已发送',hint:'等待导师查看',tone:'sent'},
  {id:'replied',label:'已回复',hint:'记录下一步动作',tone:'replied'},
  {id:'interview',label:'面试中',hint:'准备面试与跟进',tone:'interview'}
];

const phdMailTemplates=[
  {id:'first',label:'首次套磁',subject:'Prospective PhD Applicant · {Research Topic}',body:'Dear Professor {Name},\n\nI am a prospective PhD applicant interested in {research topic}. Your recent work on {paper or project} closely connects with my experience in {experience}.\n\nI have attached my CV and research proposal for your reference. May I ask whether you expect to take PhD students for {intake}?\n\nBest regards,\n{Student Name}'},
  {id:'followup',label:'礼貌跟进',subject:'Follow-up · Prospective PhD Application',body:'Dear Professor {Name},\n\nI hope you are well. I am writing to follow up on my previous email about potential PhD opportunities. I would be grateful if you could let me know whether my research direction may fit your group.\n\nBest regards,\n{Student Name}'},
  {id:'positive',label:'积极回复后',subject:'Thank you · Next steps for PhD discussion',body:'Dear Professor {Name},\n\nThank you for your kind reply. I would be happy to share a short research summary or arrange a conversation at your convenience. Please let me know if there are any materials you would like me to prepare.\n\nBest regards,\n{Student Name}'},
  {id:'interview',label:'面试确认',subject:'Interview confirmation · {Student Name}',body:'Dear Professor {Name},\n\nThank you for inviting me to interview. I confirm that {date and time} works well for me. I look forward to discussing my research interests and learning more about your group.\n\nBest regards,\n{Student Name}'}
];

function PhdHubTeacherView({onNotify}) {
  const [toolTab,setToolTab]=useState('outreach');
  const [studentId,setStudentId]=useState(1);
  const [selectedMentorId,setSelectedMentorId]=useState(1);
  const [library,setLibrary]=useState(mentors);
  const [librarySearch,setLibrarySearch]=useState('');
  const [stageByMentor,setStageByMentor]=useState({});
  const [coachNotes,setCoachNotes]=useState({});
  const [copiedTemplate,setCopiedTemplate]=useState('');
  const student=caseStudents.find(item=>item.id===studentId)||caseStudents[0];
  const caseId=`student-${student.id}`;
  const selectedMentor=library.find(item=>item.id===selectedMentorId)||library[0];
  useEffect(()=>{let active=true;setLibrary(mentors);apiRequest(`/api/vika/sync?studentId=${encodeURIComponent(studentId)}`).then(data=>{if(active&&data.mentors?.length)setLibrary(data.mentors)}).catch(()=>{});return()=>{active=false};},[studentId]);
  useEffect(()=>{apiRequest(`/api/case-state?caseId=${encodeURIComponent(caseId)}`).then(data=>{setStageByMentor(data.state?.outreachStages||{});setCoachNotes(data.state?.interviewNotes||{});}).catch(()=>{});},[caseId]);
  const persist=patch=>persistCaseState(caseId,patch,`老师 · 张晓彤`).catch(()=>onNotify('博士工具状态暂时未同步，请稍后重试'));
  const inferredStage=mentor=>{const raw=Object.values(mentor.rawFields||{}).map(formatFieldValue).join(' ');if(/面试/.test(raw))return'interview';if(/回复|已回/.test(raw))return'replied';if(/已发送|套磁中/.test(raw))return'sent';return'draft';};
  const currentStage=mentor=>stageByMentor[mentor.id]||inferredStage(mentor);
  const setStage=(mentor,nextStage)=>{setStageByMentor(current=>({...current,[mentor.id]:nextStage}));void persist({outreachStages:{[mentor.id]:nextStage}});onNotify(`${mentor.name} 已推进到${phdOutreachStages.find(item=>item.id===nextStage)?.label}`);};
  useEffect(()=>{if(toolTab!=='outreach')return;const board=document.querySelector('.phd-board-columns');if(!board)return;const cards=[...board.querySelectorAll('.phd-outreach-card')];let cardIndex=0;for(const stage of phdOutreachStages){for(const mentor of library.filter(item=>currentStage(item)===stage.id)){const card=cards[cardIndex++];if(card){card.draggable=true;card.dataset.mentorId=String(mentor.id);}}}const dragStart=event=>{const card=event.target.closest('.phd-outreach-card');if(!card)return;card.classList.add('dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',card.dataset.mentorId||'');};const dragOver=event=>{const column=event.target.closest('.phd-stage-column');if(!column)return;event.preventDefault();board.querySelectorAll('.drag-over').forEach(item=>item.classList.remove('drag-over'));column.classList.add('drag-over');};const dragEnd=()=>board.querySelectorAll('.dragging,.drag-over').forEach(item=>item.classList.remove('dragging','drag-over'));const drop=event=>{const column=event.target.closest('.phd-stage-column');if(!column)return;event.preventDefault();const mentorId=Number(event.dataTransfer.getData('text/plain'));const mentor=library.find(item=>item.id===mentorId);const columnIndex=[...board.querySelectorAll('.phd-stage-column')].indexOf(column);const nextStage=phdOutreachStages[columnIndex]?.id;if(mentor&&nextStage&&currentStage(mentor)!==nextStage)setStage(mentor,nextStage);dragEnd();};board.addEventListener('dragstart',dragStart);board.addEventListener('dragover',dragOver);board.addEventListener('dragend',dragEnd);board.addEventListener('drop',drop);return()=>{board.removeEventListener('dragstart',dragStart);board.removeEventListener('dragover',dragOver);board.removeEventListener('dragend',dragEnd);board.removeEventListener('drop',drop);};},[toolTab,library,stageByMentor]);
  const saveCoachNote=(key,value)=>{setCoachNotes(current=>({...current,[key]:value}));void persist({interviewNotes:{[key]:value}});onNotify('面试辅导备注已同步');};
  const filteredLibrary=useMemo(()=>library.filter(mentor=>[mentor.name,mentor.school,mentor.dept,mentor.topic,mentorField(mentor,'Location'),formatFieldValue(mentor.rawFields?.研究方向)].join(' ').toLowerCase().includes(librarySearch.toLowerCase())),[library,librarySearch]);
  const copyTemplate=template=>{if(typeof navigator!=='undefined'&&navigator.clipboard){navigator.clipboard.writeText(template.body).then(()=>{setCopiedTemplate(template.id);onNotify(`${template.label}模板已复制`);setTimeout(()=>setCopiedTemplate(''),1600);}).catch(()=>onNotify('浏览器未允许自动复制，请手动复制正文'));}else onNotify('当前环境不支持自动复制');};
  return <section className="phd-tool-view"><div className="phd-tool-head"><div><span className="phd-tool-kicker"><BriefcaseBusiness size={14}/>PhDHub 能力中心</span><h1>博士申请工具</h1><p>把导师库、套磁推进、邮件模板和面试准备放进同一个服务项目。</p></div><label className="phd-student-select"><span>当前服务项目</span><select value={student.id} onChange={event=>setStudentId(Number(event.target.value))}>{caseStudents.map(item=><option key={item.id} value={item.id}>{item.name} · {item.target}</option>)}</select></label></div><div className="phd-tool-summary"><span><b>{library.length}</b>位导师资料</span><span><b>{library.filter(item=>currentStage(item)==='draft').length}</b>封待发邮件</span><span><b>{Object.values(coachNotes).filter(Boolean).length}</b>条辅导备注</span><span><b>4</b>组面试题库</span></div><nav className="phd-tool-tabs" aria-label="博士工具模块"><button className={toolTab==='outreach'?'active':''} onClick={()=>setToolTab('outreach')}><Send size={15}/>套磁看板</button><button className={toolTab==='templates'?'active':''} onClick={()=>setToolTab('templates')}><FileText size={15}/>邮件模板</button><button className={toolTab==='interview'?'active':''} onClick={()=>setToolTab('interview')}><MessageSquare size={15}/>面试准备</button><button className={toolTab==='library'?'active':''} onClick={()=>setToolTab('library')}><GraduationCap size={15}/>导师库</button></nav>{toolTab==='outreach'&&<div className="phd-board"><div className="phd-board-note"><span><PawPrint size={14}/>套磁推进会同步到学生服务项目</span><small>先记录阶段，再把每封邮件和下一步动作留在 CRM。</small></div><div className="phd-board-columns">{phdOutreachStages.map(stage=>{const rows=library.filter(mentor=>currentStage(mentor)===stage.id);return <section className={`phd-stage-column ${stage.tone}`} key={stage.id}><header><div><strong>{stage.label}</strong><small>{stage.hint}</small></div><b>{rows.length}</b></header><div className="phd-stage-list">{rows.map(mentor=>{const ranking=mentorRankings(mentor);return <article className="phd-outreach-card" key={mentor.id}><div className="phd-card-title"><span className="mentor-avatar">{mentor.name.split(' ').slice(-1)[0][0]}</span><div><strong>{mentor.name}</strong><small>{mentor.school}</small></div></div><p>{mentor.topic}</p><div className="phd-card-facts"><span>QS {ranking.qs}</span><span>{mentorField(mentor,'Location')}</span><span>{mentor.open}</span></div><div className="phd-card-actions"><select value={currentStage(mentor)} onChange={event=>setStage(mentor,event.target.value)} aria-label={`推进 ${mentor.name} 的套磁阶段`}>{phdOutreachStages.map(option=><option key={option.id} value={option.id}>{option.label}</option>)}</select>{mentorLinks(mentor).find(([,url])=>url)&&<a href={mentorLinks(mentor).find(([,url])=>url)?.[1]} target="_blank" rel="noreferrer"><ExternalLink size={12}/>主页</a>}</div></article>})}</div>{!rows.length&&<div className="phd-stage-empty">这一列还没有导师</div>}</section>})}</div></div>}{toolTab==='templates'&&<section className="phd-template-panel"><div className="phd-subhead"><div><h2>邮件模板中心</h2><p>保留变量占位符，老师复制后按学生和导师事实修改。</p></div><span><FileText size={14}/>4 组模板</span></div><div className="phd-template-grid">{phdMailTemplates.map(template=><article key={template.id}><div className="phd-template-head"><strong>{template.label}</strong><button type="button" onClick={()=>copyTemplate(template)}>{copiedTemplate===template.id?<Check size={13}/>:<FileText size={13}/>} {copiedTemplate===template.id?'已复制':'复制正文'}</button></div><label>邮件主题<input value={template.subject} readOnly/></label><label>邮件正文<textarea value={template.body} readOnly/></label></article>)}</div></section>}{toolTab==='interview'&&<section className="phd-interview-panel"><div className="phd-subhead"><div><h2>面试准备舱</h2><p>老师可以针对学生和具体导师写辅导意见，学生端会看到自己的准备进度。</p></div><div className="phd-interview-controls"><select value={selectedMentor?.id||''} onChange={event=>setSelectedMentorId(Number(event.target.value))} aria-label="选择面试导师">{library.map(mentor=><option key={mentor.id} value={mentor.id}>{mentor.name} · {mentor.school}</option>)}</select></div></div><div className="phd-interview-context"><span className="student-avatar large">{student.name[0]}</span><div><strong>{student.name} × {selectedMentor?.name||'待选择导师'}</strong><small>{selectedMentor?.topic||'请选择导师'} · 老师辅导记录会同步进服务项目</small></div></div><div className="phd-coaching-grid">{interviewQuestions.map(([id,title,tip],index)=>{const key=`teacher-${student.id}-${selectedMentor?.id||'none'}-${id}`;return <article key={id}><span>0{index+1}</span><div><h3>{title}</h3><p>{tip}</p></div><textarea value={coachNotes[key]||''} onChange={event=>setCoachNotes(current=>({...current,[key]:event.target.value}))} placeholder="写给学生的准备建议..."/><button type="button" onClick={()=>saveCoachNote(key,coachNotes[key]||'')}><Check size={12}/>保存辅导备注</button></article>})}</div></section>}{toolTab==='library'&&<section className="phd-library-panel"><div className="phd-subhead"><div><h2>导师库与申请资料</h2><p>PhDHub 的教授库、排名、研究方向和申请链接已接到 CRM 导师主数据。</p></div><label className="phd-library-search"><Search size={14}/><input value={librarySearch} onChange={event=>setLibrarySearch(event.target.value)} placeholder="搜索导师、学校、方向..."/></label></div><div className="phd-library-table"><div className="phd-library-row phd-library-head"><span>导师 / 学校</span><span>研究方向</span><span>排名与地点</span><span>资料链接</span></div>{filteredLibrary.map(mentor=>{const ranking=mentorRankings(mentor);return <div className="phd-library-row" key={mentor.id}><span className="phd-library-person"><i>{mentor.name.split(' ').slice(-1)[0][0]}</i><b>{mentor.name}<small>{mentor.school} · {mentor.dept}</small></b></span><span>{mentor.topic}</span><span className="phd-library-facts"><b>QS {ranking.qs}</b><b>US {ranking.usnews}</b><small>{mentorField(mentor,'Location')}</small></span><span className="phd-library-links">{mentorLinks(mentor).map(([label,url]) => (url ? <a key={label} href={url} target="_blank" rel="noreferrer"><ExternalLink size={11}/>{label}</a> : null))}</span></div>})}</div>{!filteredLibrary.length&&<div className="student-preview-empty"><Search size={20}/><strong>没有找到导师</strong></div>}</section>}</section>;
}

const SCHOOL_FAVORITES_KEY='qingxue-school-favorites';

function SchoolLibraryView({applications,schools: schoolRecords=schoolCatalog,onStartApplication,onNewSchool,onEditSchool,onNotify,setActive}) {
  const [query,setQuery]=useState('');
  const [country,setCountry]=useState('全部地区');
  const [degree,setDegree]=useState('全部学位');
  const [sort,setSort]=useState('ranking');
  const [viewMode,setViewMode]=useState('grid');
  const [favoritesOnly,setFavoritesOnly]=useState(false);
  const [compare,setCompare]=useState([]);
  const [favorites,setFavorites]=useState(()=>{
    if(typeof window==='undefined')return ['cambridge','ucl'];
    try{return JSON.parse(window.localStorage.getItem(SCHOOL_FAVORITES_KEY)||'["cambridge","ucl"]');}catch{return ['cambridge','ucl'];}
  });
  useEffect(()=>{try{window.localStorage.setItem(SCHOOL_FAVORITES_KEY,JSON.stringify(favorites));}catch{}},[favorites]);
  const schools=useMemo(()=>schoolRecords.map(school=>({...school,activeApplications:applications.filter(application=>application.school===school.name).length})),[applications,schoolRecords]);
  const countries=['全部地区',...new Set(schools.map(school=>school.country))];
  const visibleSchools=useMemo(()=>{
    const keyword=query.trim().toLowerCase();
    return schools.filter(school=>(country==='全部地区'||school.country===country)&&(degree==='全部学位'||school.degrees.includes(degree))&&(!favoritesOnly||favorites.includes(school.id))&&[school.name,school.en,school.country,school.city,...school.programs,...school.tags].join(' ').toLowerCase().includes(keyword)).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name,'zh-CN'):sort==='applications'?b.activeApplications-a.activeApplications||a.ranking-b.ranking:a.ranking-b.ranking);
  },[schools,country,degree,favoritesOnly,favorites,query,sort]);
  const comparedSchools=compare.map(id=>schools.find(school=>school.id===id)).filter(Boolean);
  const toggleFavorite=id=>setFavorites(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]);
  const toggleCompare=id=>{
    if(compare.includes(id)){setCompare(current=>current.filter(item=>item!==id));return;}
    if(compare.length>=3){onNotify('最多同时对比 3 所院校');return;}
    setCompare(current=>[...current,id]);
  };
  return <section className="school-library-view">
    <div className="school-library-head"><div><span><GraduationCap size={15}/>选校资料中心</span><h1>院校库</h1><p>集中查看院校排名、项目方向、申请截止和团队在办项目。</p></div><div className="directory-head-actions"><button onClick={onNewSchool}><Building2 size={16}/>新增院校</button><button className="primary" onClick={()=>onStartApplication('')}><Plus size={17}/>新建申请</button></div></div>
    <div className="school-metrics"><div><small>收录院校</small><strong>{schools.length}</strong><span>覆盖 {new Set(schools.map(school=>school.country)).size} 个地区</span></div><div><small>项目方向</small><strong>{new Set(schools.flatMap(school=>school.programs)).size}</strong><span>硕士与博士项目</span></div><div><small>已收藏</small><strong>{favorites.length}</strong><span>个人选校清单</span></div><div><small>在办申请</small><strong>{applications.length}</strong><button onClick={()=>setActive('申请')}>查看申请 <ArrowRight size={14}/></button></div></div>
    <div className="school-toolbar"><label className="school-search"><Search size={17}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="搜索院校、城市、项目方向"/></label><label><MapPin size={15}/><select value={country} onChange={event=>setCountry(event.target.value)} aria-label="按国家或地区筛选院校">{countries.map(item=><option key={item}>{item}</option>)}</select></label><label><GraduationCap size={15}/><select value={degree} onChange={event=>setDegree(event.target.value)} aria-label="按学位筛选院校"><option>全部学位</option><option>硕士</option><option>博士</option></select></label><label><SlidersHorizontal size={15}/><select value={sort} onChange={event=>setSort(event.target.value)} aria-label="院校排序"><option value="ranking">排名优先</option><option value="applications">在办项目优先</option><option value="name">院校名称</option></select></label><button className={favoritesOnly?'active':''} onClick={()=>setFavoritesOnly(current=>!current)} aria-pressed={favoritesOnly}><Star size={15} fill={favoritesOnly?'currentColor':'none'}/>仅看收藏</button><div className="school-view-toggle" aria-label="院校库视图"><button className={viewMode==='grid'?'active':''} onClick={()=>setViewMode('grid')} title="卡片视图" aria-label="卡片视图"><Grid2X2 size={16}/></button><button className={viewMode==='list'?'active':''} onClick={()=>setViewMode('list')} title="列表视图" aria-label="列表视图"><Table2 size={16}/></button></div></div>
    {comparedSchools.length>0&&<section className="school-compare-panel"><header><span><GitCompareArrows size={17}/><strong>院校对比</strong><small>已选 {comparedSchools.length}/3</small></span><button onClick={()=>setCompare([])}>清空对比</button></header><div className="school-compare-grid"><span className="school-compare-labels"><b>院校</b><b>QS 排名</b><b>地区</b><b>学位</b><b>学费参考</b><b>申请截止</b></span>{comparedSchools.map(school=><article key={school.id}><button onClick={()=>toggleCompare(school.id)} aria-label={`移除 ${school.name}`}><X size={14}/></button><strong>{school.name}</strong><b>#{school.ranking}</b><span>{school.country} · {school.city}</span><span>{school.degrees.join(' / ')}</span><span>{school.tuition}</span><span>{school.deadline}</span></article>)}</div></section>}
    <div className="school-result-head"><span>找到 <b>{visibleSchools.length}</b> 所院校</span>{compare.length>0&&<small>已选择 {compare.length} 所进行对比</small>}</div>
    {visibleSchools.length?(viewMode==='grid'?<div className="school-card-grid">{visibleSchools.map(school=><article className="school-card" key={school.id}><header><span className="school-rank"><small>QS</small><strong>{school.ranking}</strong></span><div><h2>{school.name}</h2><p>{school.en}</p></div><span className="school-card-tools"><button onClick={()=>onEditSchool(school)} title="编辑院校" aria-label={`编辑 ${school.name}`}><PenLine size={16}/></button><button className={`school-favorite ${favorites.includes(school.id)?'active':''}`} onClick={()=>toggleFavorite(school.id)} title={favorites.includes(school.id)?'取消收藏':'收藏院校'} aria-label={favorites.includes(school.id)?`取消收藏 ${school.name}`:`收藏 ${school.name}`} aria-pressed={favorites.includes(school.id)}><Star size={17} fill={favorites.includes(school.id)?'currentColor':'none'}/></button></span></header><div className="school-location"><MapPin size={13}/>{school.country} · {school.city}<span>{school.intake}</span></div><div className="school-programs">{school.programs.map(program=><span key={program}>{program}</span>)}</div><div className="school-facts"><span><small>学位</small><b>{school.degrees.join(' / ')}</b></span><span><small>学费参考</small><b>{school.tuition}</b></span><span><small>申请截止</small><b>{school.deadline}</b></span></div><div className="school-tags">{school.tags.map(tag=><span key={tag}>{tag}</span>)}{school.activeApplications>0&&<em>{school.activeApplications} 个在办项目</em>}</div><footer><button className={compare.includes(school.id)?'selected':''} onClick={()=>toggleCompare(school.id)}><GitCompareArrows size={14}/>{compare.includes(school.id)?'已加入对比':'加入对比'}</button><a href={school.website} target="_blank" rel="noreferrer"><ExternalLink size={14}/>院校官网</a><button className="primary" onClick={()=>onStartApplication(school.name)}><Plus size={14}/>发起申请</button></footer></article>)}</div>:<div className="school-list-view"><div className="school-list-head"><span>院校 / 排名</span><span>地区</span><span>项目方向</span><span>申请截止</span><span>在办</span><span>操作</span></div>{visibleSchools.map(school=><article key={school.id}><span className="school-list-name"><i>{school.ranking}</i><b>{school.name}<small>{school.en}</small></b></span><span>{school.country} · {school.city}</span><span>{school.programs.slice(0,2).join(' · ')}</span><span>{school.deadline}</span><b>{school.activeApplications}</b><span className="school-list-actions"><button onClick={()=>toggleFavorite(school.id)} aria-label={favorites.includes(school.id)?`取消收藏 ${school.name}`:`收藏 ${school.name}`}><Star size={15} fill={favorites.includes(school.id)?'currentColor':'none'}/></button><button onClick={()=>toggleCompare(school.id)} aria-label={`对比 ${school.name}`}><GitCompareArrows size={15}/></button><button onClick={()=>onEditSchool(school)} aria-label={`编辑 ${school.name}`}><PenLine size={15}/></button><button onClick={()=>onStartApplication(school.name)} aria-label={`发起 ${school.name} 申请`}><Plus size={15}/></button></span></article>)}</div>):<div className="school-empty"><Search size={26}/><strong>没有找到符合条件的院校</strong><button onClick={()=>{setQuery('');setCountry('全部地区');setDegree('全部学位');setFavoritesOnly(false)}}>清除筛选条件</button></div>}
  </section>;
}

const teamRoleFilters = [
  ['all', '全部角色'],
  ['manager', '项目管理'],
  ['comms', '沟通协作'],
  ['select', '选导服务'],
  ['writing', '文书服务'],
  ['visa', '签证服务']
];

const studentAssignmentFields = [
  ['manager', '项目管理'],
  ['comms', '沟通'],
  ['select', '选导'],
  ['writing', '文书'],
  ['visa', '签证']
];

function teacherRoleGroups(teacher, studentRecords) {
  const assignedFields = new Set();
  studentRecords.forEach(student => studentAssignmentFields.forEach(([field]) => {
    if (student[field] === teacher.name) assignedFields.add(field);
  }));
  const role = teacher.role || '';
  if (/顾问|主管|项目管理/.test(role)) assignedFields.add('manager');
  if (/沟通|背景提升/.test(role)) assignedFields.add('comms');
  if (/选导|博士项目/.test(role)) assignedFields.add('select');
  if (/文书/.test(role)) assignedFields.add('writing');
  if (/签证/.test(role)) assignedFields.add('visa');
  return assignedFields;
}

function teacherCapacity(score) {
  if (score >= 11) return {label:'当前满载', tone:'full', percent:100};
  if (score >= 7) return {label:'接近满载', tone:'busy', percent:Math.min(94, Math.round(score / 12 * 100))};
  return {label:'可继续分配', tone:'available', percent:Math.max(8, Math.round(score / 12 * 100))};
}

function TeacherTeamView({studentRecords, applications, tasks, staff: staffRecords=staffDirectory, onNewStaff, onEditStaff, setActive}) {
  const [roleFilter,setRoleFilter]=useState('all');
  const [search,setSearch]=useState('');
  const [sort,setSort]=useState('workload');
  const [selectedName,setSelectedName]=useState(staffRecords[0]?.name||'');
  const teachers=useMemo(()=>staffRecords.map(teacher=>{
    const studentAssignments=studentRecords.flatMap(student=>{
      const roles=studentAssignmentFields.filter(([field])=>student[field]===teacher.name).map(([,label])=>label);
      return roles.length?[{...student,assignmentRoles:roles}]:[];
    });
    const ownedApplications=applications.filter(application=>application.owner===teacher.name);
    const pendingTasks=tasks.filter(task=>!task.done&&(task.owner||'张晓彤')===teacher.name);
    const workload=studentAssignments.length*2+ownedApplications.length+pendingTasks.length*1.5;
    return {...teacher,studentAssignments,ownedApplications,pendingTasks,workload,capacity:teacherCapacity(workload),roleGroups:teacherRoleGroups(teacher,studentRecords)};
  }),[studentRecords,applications,tasks,staffRecords]);
  const visibleTeachers=useMemo(()=>{
    const keyword=search.trim().toLowerCase();
    return teachers.filter(teacher=>(roleFilter==='all'||teacher.roleGroups.has(roleFilter))&&`${teacher.name} ${teacher.role} ${teacher.specialty}`.toLowerCase().includes(keyword)).sort((a,b)=>sort==='name'?a.name.localeCompare(b.name,'zh-CN'):b.workload-a.workload||a.name.localeCompare(b.name,'zh-CN'));
  },[teachers,roleFilter,search,sort]);
  useEffect(()=>{
    if (visibleTeachers.length&&!visibleTeachers.some(teacher=>teacher.name===selectedName)) setSelectedName(visibleTeachers[0].name);
  },[visibleTeachers,selectedName]);
  const selected=teachers.find(teacher=>teacher.name===selectedName)||visibleTeachers[0];
  const pendingCount=tasks.filter(task=>!task.done).length;
  const availableCount=teachers.filter(teacher=>teacher.capacity.tone==='available').length;
  return <section className="teacher-team-view">
    <div className="teacher-team-head"><div><span><UserRound size={15}/>团队工作台</span><h1>老师团队</h1><p>查看每位老师的负责学生、申请项目与待办任务，及时平衡团队工作量。</p></div><div className="directory-head-actions"><button onClick={()=>setActive('任务')}><ClipboardCheck size={16}/>任务中心</button><button className="primary" onClick={onNewStaff}><UserPlus size={17}/>新增老师</button></div></div>
    <div className="team-metrics"><div><span className="team-metric-icon"><Users size={18}/></span><small>团队成员</small><strong>{teachers.length}</strong></div><div><span className="team-metric-icon"><GraduationCap size={18}/></span><small>服务中学生</small><strong>{studentRecords.length}</strong></div><div><span className="team-metric-icon"><ClipboardCheck size={18}/></span><small>待处理任务</small><strong>{pendingCount}</strong></div><div><span className="team-metric-icon"><Plus size={18}/></span><small>可继续分配</small><strong>{availableCount}</strong></div></div>
    <div className="team-toolbar"><div className="team-role-tabs">{teamRoleFilters.map(([id,label])=><button key={id} className={roleFilter===id?'active':''} onClick={()=>setRoleFilter(id)}>{label}<span>{id==='all'?teachers.length:teachers.filter(teacher=>teacher.roleGroups.has(id)).length}</span></button>)}</div><div className="team-toolbar-actions"><label className="team-search"><Search size={17}/><input value={search} onChange={event=>setSearch(event.target.value)} placeholder="搜索姓名、职位或擅长方向"/></label><label className="team-sort"><SlidersHorizontal size={16}/><select value={sort} onChange={event=>setSort(event.target.value)} aria-label="团队排序"><option value="workload">按工作量排序</option><option value="name">按姓名排序</option></select></label></div></div>
    <div className="teacher-team-layout">
      <div className="teacher-list" aria-label="老师列表">{visibleTeachers.length?visibleTeachers.map(teacher=><button key={teacher.name} className={`teacher-list-card ${selected?.name===teacher.name?'selected':''}`} onClick={()=>setSelectedName(teacher.name)}><span className="teacher-avatar">{teacher.name.slice(0,1)}</span><span className="teacher-card-copy"><span className="teacher-name-row"><strong>{teacher.name}</strong><em className={`capacity-label ${teacher.capacity.tone}`}>{teacher.capacity.label}</em></span><small>{teacher.role}</small><p>{teacher.specialty}</p><span className="teacher-card-stats"><b><Users size={13}/>{teacher.studentAssignments.length} 负责学生</b><b><Building2 size={13}/>{teacher.ownedApplications.length} 申请项目</b><b><ClipboardCheck size={13}/>{teacher.pendingTasks.length} 待办任务</b></span><span className="capacity-track"><i style={{width:`${teacher.capacity.percent}%`}}/></span></span><ArrowRight size={17}/></button>):<div className="teacher-list-empty"><Search size={24}/><strong>没有找到匹配的老师</strong></div>}</div>
      {selected&&<aside className="teacher-detail"><div className="teacher-detail-head"><span className="teacher-detail-avatar">{selected.name.slice(0,1)}</span><div><span className="teacher-detail-name"><h2>{selected.name}</h2><em className={`capacity-label ${selected.capacity.tone}`}>{selected.capacity.label}</em></span><p>{selected.role} · {selected.specialty}</p></div><button className="teacher-detail-edit" onClick={()=>onEditStaff(selected)} title="编辑老师档案" aria-label={`编辑 ${selected.name}`}><PenLine size={16}/></button></div><div className="teacher-detail-workload"><span><small>工作量</small><strong>{selected.capacity.percent}%</strong></span><i><b style={{width:`${selected.capacity.percent}%`}}/></i><p>{selected.studentAssignments.length} 位学生 · {selected.ownedApplications.length} 个申请 · {selected.pendingTasks.length} 项待办</p></div>
        <section className="teacher-detail-section"><header><span><Users size={16}/><strong>负责的学生</strong></span><b>{selected.studentAssignments.length}</b></header><div>{selected.studentAssignments.length?selected.studentAssignments.map(student=><article key={student.id}><span className="detail-person-avatar">{student.name.slice(0,1)}</span><span><strong>{student.name}</strong><small>{student.target}</small><em>{student.assignmentRoles.join(' · ')}</em></span><b>{student.progress}%</b></article>):<p className="teacher-detail-empty">暂无负责学生</p>}</div></section>
        <section className="teacher-detail-section"><header><span><Building2 size={16}/><strong>负责的申请</strong></span><b>{selected.ownedApplications.length}</b></header><div>{selected.ownedApplications.length?selected.ownedApplications.map(application=><article key={application.id}><span className="detail-stage-mark"/><span><strong>{application.school}</strong><small>{application.name} · {application.program}</small><em>{stages.find(stage=>stage.id===application.stage)?.label||application.stage}</em></span><b>{application.progress}%</b></article>):<p className="teacher-detail-empty">暂无负责申请</p>}</div></section>
        <section className="teacher-detail-section"><header><span><ClipboardCheck size={16}/><strong>未完成任务</strong></span><b>{selected.pendingTasks.length}</b></header><div>{selected.pendingTasks.length?selected.pendingTasks.map(task=><article key={task.id}><span className={`detail-task-level level-${task.level}`}>{task.level}</span><span><strong>{task.title}</strong><small>{task.detail||'未关联对象'}</small><em>{taskDisplayTime(task)}</em></span></article>):<p className="teacher-detail-empty">暂无待办任务</p>}</div></section>
      </aside>}
    </div>
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
    <div className="top-actions"><button className="portal-switch" onClick={onStudentView}><Eye size={15}/>学生预览</button><button className="icon-btn" aria-label="新建" onClick={()=>onNotify('新建快捷入口已准备')}><Plus size={20}/></button><button className="icon-btn bell" aria-label="通知" onClick={()=>onNotify('暂无新的高优先级通知')}><Bell size={19}/><i>6</i></button><button className="icon-btn" aria-label="帮助" onClick={()=>onNotify('帮助中心即将开放')}><CircleHelp size={19}/></button><span className="avatar">{session?.name?.slice(0,1)||'张'}</span><div className="profile"><strong>{session?.name||'张晓彤'}</strong><small>{session?.title||'资深顾问'}</small></div><ChevronDown size={16}/><LanguageLayer inline/></div>
  </header>;
}

function Toast({message}) {
  return message ? <div className="toast" role="status"><CheckCircle2 size={16}/><span>{message}</span></div> : null;
}

function ApplicationCard({ app, selected, onClick, onMove }) {
  const stageIndex = stages.findIndex(s => s.id === app.stage);
  return <article className={`application-card ${selected ? 'selected' : ''}`} draggable data-application-id={app.id} onClick={onClick}>
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
  const [draggedId,setDraggedId]=useState(null);
  const [dragOverStage,setDragOverStage]=useState('');
  return <div className="pipeline">
    {stages.map(stage => {
      const rows = apps.filter(a => a.stage === stage.id);
      return <section className={`stage${dragOverStage===stage.id?' drag-over':''}`} key={stage.id} onDragOver={event=>{event.preventDefault();setDragOverStage(stage.id)}} onDragLeave={event=>{if(!event.currentTarget.contains(event.relatedTarget))setDragOverStage('')}} onDrop={event=>{event.preventDefault();const id=Number(event.dataTransfer.getData('text/plain'))||draggedId;if(id)onMove(id,stage.id);setDraggedId(null);setDragOverStage('')}}>
        <div className="stage-head"><span className="dot" style={{background: stage.color}}></span><strong>{stage.label}</strong><span>{rows.length}</span><MoreHorizontal size={17}/></div>
        <div className="stage-list" onDragStart={event=>{const card=event.target.closest('.application-card');if(!card)return;const id=Number(card.dataset.applicationId);setDraggedId(id);card.classList.add('dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',String(id))}} onDragEnd={event=>{event.target.closest('.application-card')?.classList.remove('dragging');setDraggedId(null);setDragOverStage('')}}>{rows.map(app => <ApplicationCard key={app.id} app={app} selected={app.id === selectedId} onClick={() => setSelectedId(app.id)} onMove={onMove}/>)}</div>
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

function taskDisplayTime(task) {
  if (!task.dueAt || !Number.isFinite(Date.parse(task.dueAt))) return task.time || '待安排';
  const due=new Date(task.dueAt);
  const now=new Date();
  const dueDay=new Date(due.getFullYear(),due.getMonth(),due.getDate());
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const days=Math.round((dueDay-today)/86400000);
  const clock=`${String(due.getHours()).padStart(2,'0')}:${String(due.getMinutes()).padStart(2,'0')}`;
  if(days===-1)return `昨天 ${clock}`;
  if(days===0)return `今天 ${clock}`;
  if(days===1)return `明天 ${clock}`;
  return `${due.getMonth()+1}月${due.getDate()}日 ${clock}`;
}

function taskIsOverdue(task) {
  return !task.done&&Boolean(task.dueAt)&&Number.isFinite(Date.parse(task.dueAt))&&Date.parse(task.dueAt)<Date.now();
}

function TaskRail({ tasks, onToggleTask, onNewTask, onOpenTaskCenter }) {
  const [tab, setTab] = useState('todo');
  const visible = tasks.filter(t => tab === 'done' ? t.done : !t.done);
  return <aside className="task-rail">
    <div className="rail-title"><h2>今日任务</h2><button onClick={onOpenTaskCenter}>更多</button></div>
    <div className="task-tabs"><button className={tab === 'todo' ? 'active' : ''} onClick={() => setTab('todo')}>待办 ({tasks.filter(t => !t.done).length})</button><button className={tab === 'done' ? 'active' : ''} onClick={() => setTab('done')}>已完成 ({tasks.filter(t => t.done).length})</button></div>
    <div className="task-list">{visible.length ? visible.map(task => <button className="task-row" key={task.id} onClick={() => onToggleTask(task.id)}>
      <span className={`task-time ${task.level === '高' || taskIsOverdue(task) ? 'urgent' : ''}`}>{taskDisplayTime(task)}</span><span className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span><span className={`level ${task.level}`}>{task.level}</span>
    </button>) : <div className="empty"><Check size={24}/><p>今天的任务都完成了</p></div>}</div>
    <button className="new-task" onClick={onNewTask}><Plus size={16}/>新建任务</button>
  </aside>;
}

function TaskCenterView({tasks, onToggleTask, onDeleteTask, onEditTask, onNewTask, setActive}) {
  const [filter,setFilter]=useState('todo');
  const [search,setSearch]=useState('');
  const [ownerFilter,setOwnerFilter]=useState('全部负责人');
  const owners=['全部负责人',...new Set(tasks.map(task=>task.owner||'张晓彤'))];
  const visible=tasks
    .filter(task=>filter==='all'||(filter==='done'?task.done:filter==='overdue'?taskIsOverdue(task):!task.done))
    .filter(task=>ownerFilter==='全部负责人'||(task.owner||'张晓彤')===ownerFilter)
    .filter(task=>`${task.title} ${task.detail} ${task.owner||'张晓彤'}`.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a,b)=>{
      if(a.done!==b.done)return Number(a.done)-Number(b.done);
      if(a.dueAt&&b.dueAt)return Date.parse(a.dueAt)-Date.parse(b.dueAt);
      if(a.dueAt)return -1;
      if(b.dueAt)return 1;
      return String(a.time).localeCompare(String(b.time));
    });
  const pending=tasks.filter(task=>!task.done).length;
  const completed=tasks.filter(task=>task.done).length;
  const high=tasks.filter(task=>!task.done&&task.level==='高').length;
  const overdue=tasks.filter(taskIsOverdue).length;
  return <section className="task-center-view">
    <div className="page-head task-center-head"><div><h1>任务中心</h1><p>集中管理学生跟进、申请节点和团队交接</p></div><button className="primary" onClick={onNewTask}><Plus size={16}/>新建任务</button></div>
    <div className="task-center-stats"><div><small>待处理</small><strong>{pending}</strong><span>需要继续跟进</span></div><div><small>已逾期</small><strong>{overdue}</strong><span>需要优先处理</span></div><div><small>高优先级</small><strong>{high}</strong><span>优先安排时间</span></div><div><small>已完成</small><strong>{completed}</strong><span>可随时恢复</span></div><button onClick={()=>setActive('工作台')}>返回工作台 <ArrowRight size={15}/></button></div>
    <section className="task-center-board">
      <div className="task-center-toolbar"><div className="task-filter-tabs"><button className={filter==='todo'?'active':''} onClick={()=>setFilter('todo')}>待办 {pending}</button><button className={filter==='overdue'?'active':''} onClick={()=>setFilter('overdue')}>逾期 {overdue}</button><button className={filter==='done'?'active':''} onClick={()=>setFilter('done')}>已完成 {completed}</button><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>全部 {tasks.length}</button></div><div className="task-toolbar-tools"><label className="task-owner-filter"><UserRound size={15}/><select value={ownerFilter} onChange={event=>setOwnerFilter(event.target.value)} aria-label="按负责人筛选">{owners.map(owner=><option key={owner}>{owner}</option>)}</select></label><label className="task-search"><Search size={16}/><input value={search} onChange={event=>setSearch(event.target.value)} placeholder="搜索任务或关联对象"/></label></div></div>
      <div className="task-center-list"><div className="task-center-list-head"><span>状态</span><span>任务</span><span>关联对象</span><span>时间</span><span>优先级</span><span>操作</span></div>{visible.length?visible.map(task=>{const overdueTask=taskIsOverdue(task);return <article className={`task-center-row ${task.done?'done':''} ${overdueTask?'overdue':''}`} key={task.id}><button className="task-check" onClick={()=>onToggleTask(task.id)} title={task.done?'恢复任务':'完成任务'} aria-label={task.done?'恢复任务':'完成任务'}>{task.done?<Check size={17}/>:<span/>}</button><div className="task-main-copy"><strong>{task.title}</strong><small>{overdueTask?'已逾期':task.done?'已完成':'待处理'} · {task.owner||'张晓彤'}</small></div><span className="task-relation">{task.detail||'未关联对象'}</span><time className={overdueTask?'overdue-time':''}>{taskDisplayTime(task)}</time><em className={`task-priority level-${task.level}`}>{task.level}</em><div className="task-row-actions"><button onClick={()=>onToggleTask(task.id)} title={task.done?'恢复任务':'完成任务'} aria-label={task.done?'恢复任务':'完成任务'}>{task.done?<RefreshCw size={16}/>:<Check size={16}/>}</button><button onClick={()=>onEditTask(task)} title="编辑任务" aria-label="编辑任务"><PenLine size={16}/></button><button className="danger" onClick={()=>onDeleteTask(task.id)} title="删除任务" aria-label="删除任务"><Trash2 size={16}/></button></div></article>}):<div className="task-center-empty"><ClipboardCheck size={30}/><strong>{search?'没有匹配的任务':filter==='done'?'还没有已完成任务':filter==='overdue'?'当前没有逾期任务':'当前没有待办任务'}</strong><span>{search?'换个关键词试试':'新建任务后会显示在这里'}</span></div>}</div>
    </section>
  </section>;
}

function ServiceItemModal({item,module,students: studentRecords,staff: staffRecords,onClose,onSave}) {
  const activeModule=item?.module||module||'文书';
  const [student,setStudent]=useState(item?.student||studentRecords[0]?.name||'');
  const [subject,setSubject]=useState(item?.subject||'');
  const [owner,setOwner]=useState(item?.owner||staffRecords[0]?.name||'待分配');
  const [status,setStatus]=useState(item?.status||'待处理');
  const [due,setDue]=useState(item?.due||'待确认');
  const [priority,setPriority]=useState(item?.priority||'中');
  const [amount,setAmount]=useState(item?.amount||'');
  const statusOptions={文书:['待处理','初稿审核','学生补充中','终稿审核','已定稿'],签证:['未开始','材料检查','材料补充','等待 CoE','已递交','已完成'],收款:['待首付款','待第二期','分期 2 / 3','已付 30%','已付 80%','已付清']}[activeModule];
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal service-item-modal" onMouseDown={event=>event.stopPropagation()} onSubmit={event=>{event.preventDefault();onSave({id:item?.id||`service-${Date.now()}`,module:activeModule,student,subject:subject.trim(),owner,status:status.trim(),due:due.trim(),priority,amount:activeModule==='收款'?amount.trim():''})}}>
    <div className="modal-head"><div><h2>{item?`编辑${activeModule}事项`:`新建${activeModule}事项`}</h2><p>记录负责人、当前状态和下一截止时间</p></div><button type="button" className="icon-btn" onClick={onClose} aria-label="关闭"><X size={18}/></button></div>
    <div className="service-modal-kicker"><span>{activeModule==='文书'?<PenLine size={16}/>:activeModule==='签证'?<ShieldCheck size={16}/>:<WalletCards size={16}/>}</span><strong>{activeModule}</strong><small>{activeModule==='文书'?'版本与交付管理':activeModule==='签证'?'材料与递交流程':'合同与分期记录'}</small></div>
    <div className="service-modal-grid"><label>关联学生<select value={student} onChange={event=>setStudent(event.target.value)}>{studentRecords.map(record=><option key={record.id}>{record.name}</option>)}</select></label><label>负责人<select value={owner} onChange={event=>setOwner(event.target.value)}>{staffRecords.map(record=><option key={record.id||record.name}>{record.name}</option>)}<option>待分配</option></select></label></div>
    <label>{activeModule==='文书'?'文书内容':activeModule==='签证'?'签证事项':'服务套餐'}<input required autoFocus value={subject} onChange={event=>setSubject(event.target.value)} placeholder={activeModule==='文书'?'例如：个人陈述 · MSc Marketing':activeModule==='签证'?'例如：英国学生签证':'例如：硕士申请全流程'}/></label>
    {activeModule==='收款'&&<label>合同 / 到账金额<input required value={amount} onChange={event=>setAmount(event.target.value)} placeholder="例如：¥30,000 / ¥9,000"/></label>}
    <div className="service-modal-grid"><label>当前状态<input required list={`service-status-${activeModule}`} value={status} onChange={event=>setStatus(event.target.value)}/><datalist id={`service-status-${activeModule}`}>{statusOptions.map(option=><option key={option} value={option}/>)}</datalist></label><label>截止时间<input required value={due} onChange={event=>setDue(event.target.value)} placeholder="例如：7月20日 16:00"/></label></div>
    <fieldset><legend>优先级</legend><div className="priority-picker">{['低','中','高'].map(value=><button key={value} type="button" className={priority===value?'active':''} onClick={()=>setPriority(value)} aria-pressed={priority===value}><span className={`priority-dot level-${value}`}/>{value}</button>)}</div></fieldset>
    <div className="modal-actions"><button type="button" onClick={onClose}>取消</button><button className="primary" type="submit"><Check size={15}/>{item?'保存修改':'创建事项'}</button></div>
  </form></div>;
}

function DirectoryModal({type,record,onClose,onSave,onDelete}) {
  const isStaff=type==='staff';
  const [name,setName]=useState(record?.name||'');
  const [role,setRole]=useState(record?.role||'项目管理老师');
  const [specialty,setSpecialty]=useState(record?.specialty||'');
  const [en,setEn]=useState(record?.en||'');
  const [country,setCountry]=useState(record?.country||'');
  const [city,setCity]=useState(record?.city||'');
  const [ranking,setRanking]=useState(record?.ranking||'');
  const [degrees,setDegrees]=useState((record?.degrees||['硕士']).join('、'));
  const [programs,setPrograms]=useState((record?.programs||[]).join('、'));
  const [deadline,setDeadline]=useState(/^\d{4}-\d{2}-\d{2}$/.test(record?.deadline||'')?record.deadline:'');
  const [intake,setIntake]=useState(record?.intake||'2026 秋季');
  const [tuition,setTuition]=useState(record?.tuition||'');
  const [tags,setTags]=useState((record?.tags||[]).join('、'));
  const [website,setWebsite]=useState(record?.website||'');
  const list=value=>value.split(/[、,，]/).map(item=>item.trim()).filter(Boolean);
  const submit=event=>{
    event.preventDefault();
    if(isStaff)onSave({id:record?.id||`staff-${Date.now()}`,name:name.trim(),role:role.trim(),specialty:specialty.trim()});
    else onSave({id:record?.id||`school-${Date.now()}`,name:name.trim(),en:en.trim(),country:country.trim(),city:city.trim(),ranking:Number(ranking)||999,degrees:list(degrees),programs:list(programs),deadline:deadline||'待确认',intake:intake.trim(),tuition:tuition.trim(),tags:list(tags),website:website.trim()});
  };
  return <div className="modal-backdrop" onMouseDown={onClose}><form className={`modal directory-modal ${isStaff?'staff-directory-modal':'school-directory-modal'}`} onMouseDown={event=>event.stopPropagation()} onSubmit={submit}>
    <div className="modal-head"><div><h2>{record?isStaff?'编辑老师档案':'编辑院校档案':isStaff?'新增老师':'新增院校'}</h2><p>{isStaff?'维护老师的角色与擅长方向':'维护院校排名、项目和申请信息'}</p></div><button type="button" className="icon-btn" onClick={onClose} aria-label="关闭"><X size={18}/></button></div>
    {isStaff?<div className="directory-form-section"><span className="directory-section-title"><UserRound size={15}/>基本信息</span><label>老师姓名<input required autoFocus value={name} onChange={event=>setName(event.target.value)} placeholder="请输入老师姓名"/></label><div className="directory-form-grid"><label>岗位角色<input required value={role} onChange={event=>setRole(event.target.value)} placeholder="例如：申请顾问"/></label><label>擅长方向<input required value={specialty} onChange={event=>setSpecialty(event.target.value)} placeholder="例如：英国与商科项目"/></label></div></div>:<>
      <section className="directory-form-section"><span className="directory-section-title"><Building2 size={15}/>院校信息</span><div className="directory-form-grid"><label>院校中文名<input required autoFocus value={name} onChange={event=>setName(event.target.value)} placeholder="请输入院校名称"/></label><label>院校英文名<input required value={en} onChange={event=>setEn(event.target.value)} placeholder="University name"/></label><label>国家 / 地区<input required value={country} onChange={event=>setCountry(event.target.value)} placeholder="例如：英国"/></label><label>城市<input required value={city} onChange={event=>setCity(event.target.value)} placeholder="例如：伦敦"/></label></div></section>
      <section className="directory-form-section"><span className="directory-section-title"><GraduationCap size={15}/>项目与排名</span><div className="directory-form-grid three"><label>QS 排名<input required type="number" min="1" max="999" value={ranking} onChange={event=>setRanking(event.target.value)} placeholder="1-999"/></label><label>学位类型<input required value={degrees} onChange={event=>setDegrees(event.target.value)} placeholder="硕士、博士"/></label><label>入学季<input required value={intake} onChange={event=>setIntake(event.target.value)} placeholder="2026 秋季"/></label></div><label>项目方向<input required value={programs} onChange={event=>setPrograms(event.target.value)} placeholder="人工智能、金融学、教育学"/><small>使用顿号或逗号分隔多个方向</small></label></section>
      <section className="directory-form-section"><span className="directory-section-title"><CalendarDays size={15}/>申请信息</span><div className="directory-form-grid"><label>申请截止<input type="date" value={deadline} onChange={event=>setDeadline(event.target.value)}/></label><label>学费参考<input value={tuition} onChange={event=>setTuition(event.target.value)} placeholder="例如：£30k-£40k"/></label><label>院校标签<input value={tags} onChange={event=>setTags(event.target.value)} placeholder="研究型、就业导向"/></label><label>院校官网<input type="url" value={website} onChange={event=>setWebsite(event.target.value)} placeholder="https://..."/></label></div></section>
    </>}
    <div className="modal-actions directory-modal-actions">{record&&<button type="button" className="directory-delete" onClick={()=>onDelete(record)}><Trash2 size={15}/>删除档案</button>}<span/><button type="button" onClick={onClose}>取消</button><button className="primary" type="submit"><Check size={15}/>{record?'保存修改':'确认新增'}</button></div>
  </form></div>;
}

function StudentCaseModal({record,staff: staffRecords,onClose,onSave,onDelete}) {
  const [name,setName]=useState(record?.name||'');
  const [target,setTarget]=useState(record?.target||'待确认 · 待确认方向');
  const [service,setService]=useState(record?.service||'留学申请全流程');
  const [stage,setStage]=useState(record?.stage||'需求确认');
  const [progress,setProgress]=useState(record?.progress??5);
  const [count,setCount]=useState(record?.count??0);
  const [manager,setManager]=useState(record?.manager||'待分配');
  const [comms,setComms]=useState(record?.comms||'待分配');
  const [selectTeacher,setSelectTeacher]=useState(record?.select||'待分配');
  const [writing,setWriting]=useState(record?.writing||'待分配');
  const [visa,setVisa]=useState(record?.visa||'待分配');
  const [due,setDue]=useState(record?.due||'待确认');
  const [payment,setPayment]=useState(record?.payment||'待收款');
  const [invite,setInvite]=useState(record?.invite||`QX${Date.now().toString().slice(-6)}`);
  const teacherOptions=['待分配',...new Set(staffRecords.map(member=>member.name))];
  const assignmentFields=[['管理老师',manager,setManager],['沟通老师',comms,setComms],['选导老师',selectTeacher,setSelectTeacher],['文书老师',writing,setWriting],['签证老师',visa,setVisa]];
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal student-case-modal" onMouseDown={event=>event.stopPropagation()} onSubmit={event=>{event.preventDefault();const normalizedName=name.trim();onSave({id:record?.id||Date.now(),name:normalizedName,initial:normalizedName.slice(0,1),target:target.trim(),service:service.trim(),stage:stage.trim(),progress:Number(progress),count:Number(count),manager,comms,select:selectTeacher,writing,visa,due:due.trim(),payment:payment.trim(),invite:invite.trim()})}}>
    <div className="modal-head"><div><h2>{record?'编辑学生档案':'新建学生档案'}</h2><p>统一维护服务进度、老师分工和交付信息</p></div><button type="button" className="icon-btn" onClick={onClose} aria-label="关闭"><X size={18}/></button></div>
    <section className="student-case-section"><span className="directory-section-title"><UserRound size={15}/>学生与服务</span><div className="student-case-grid"><label>学生姓名<input required autoFocus value={name} onChange={event=>setName(event.target.value)} placeholder="请输入学生姓名"/></label><label>目标方向<input required value={target} onChange={event=>setTarget(event.target.value)} placeholder="例如：英国 · AI 博士"/></label><label>服务项目<input required value={service} onChange={event=>setService(event.target.value)} placeholder="留学申请全流程"/></label><label>当前阶段<input required value={stage} onChange={event=>setStage(event.target.value)} placeholder="例如：选导中"/></label></div></section>
    <section className="student-case-section"><span className="directory-section-title"><ClipboardCheck size={15}/>进度与交付</span><div className="student-progress-field"><span><b>整体进度</b><label className="student-progress-number"><input aria-label="整体进度数值" type="number" min="0" max="100" value={progress} onChange={event=>setProgress(Math.min(100,Math.max(0,Number(event.target.value))))}/><em>%</em></label></span><input aria-label="整体进度滑块" type="range" min="0" max="100" step="1" value={progress} onChange={event=>setProgress(event.target.value)}/></div><div className="student-case-grid three"><label>导师候选数<input type="number" min="0" max="999" value={count} onChange={event=>setCount(event.target.value)}/></label><label>下一截止<input required value={due} onChange={event=>setDue(event.target.value)} placeholder="例如：明日 16:00"/></label><label>收款状态<input required value={payment} onChange={event=>setPayment(event.target.value)} placeholder="例如：已付 50%"/></label></div></section>
    <section className="student-case-section"><span className="directory-section-title"><Users size={15}/>老师分工</span><div className="student-assignment-grid">{assignmentFields.map(([label,value,setValue])=><label key={label}>{label}<select value={value} onChange={event=>setValue(event.target.value)}>{teacherOptions.map(option=><option key={option}>{option}</option>)}</select></label>)}</div></section>
    <section className="student-case-section compact"><span className="directory-section-title"><Send size={15}/>学生入口</span><label>服务项目邀请码<input required value={invite} onChange={event=>setInvite(event.target.value)} placeholder="例如：LINXIA2026"/></label></section>
    <div className="modal-actions student-case-actions">{record&&<button type="button" className="directory-delete" onClick={()=>onDelete(record)}><Trash2 size={15}/>删除学生</button>}<span/><button type="button" onClick={onClose}>取消</button><button className="primary" type="submit"><Check size={15}/>{record?'保存修改':'创建学生'}</button></div>
  </form></div>;
}

function NewStudentModal({ onClose, onCreate, mode='student', initialSchool='' }) {
  const [name, setName] = useState(''); const [school, setSchool] = useState(initialSchool);
  const isApplication=mode==='application';
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal" onMouseDown={e => e.stopPropagation()} onSubmit={e => {e.preventDefault(); if(name && school) onCreate(name, school)}}>
    <div className="modal-head"><h2>{isApplication?'新建申请项目':'新建学生'}</h2><button type="button" className="icon-btn" onClick={onClose} aria-label="关闭"><X size={18}/></button></div>
    <label>学生姓名<input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="请输入姓名"/></label>
    <label>意向院校<input value={school} onChange={e => setSchool(e.target.value)} placeholder="例如：伦敦大学学院"/></label>
    <label>入学季<select><option>2025年秋季</option><option>2026年春季</option><option>2026年秋季</option></select></label>
    <div className="modal-actions"><button type="button" onClick={onClose}>取消</button><button className="primary" type="submit">{isApplication?'创建申请':'创建学生'}</button></div>
  </form></div>;
}

function TaskModal({ task, onClose, onSave, students: studentRecords, applications, staff: staffRecords=staffDirectory }) {
  const [title,setTitle]=useState(task?.title||'');
  const [detail,setDetail]=useState(task?.detail||'');
  const initialDue=task?.dueAt&&Number.isFinite(Date.parse(task.dueAt))?new Date(task.dueAt):new Date();
  const [date,setDate]=useState(()=>{
    const now=initialDue;
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  });
  const fallbackTime=String(task?.time||'').match(/\d{2}:\d{2}/)?.[0]||'09:00';
  const [time,setTime]=useState(()=>task?.dueAt&&Number.isFinite(Date.parse(task.dueAt))?`${String(initialDue.getHours()).padStart(2,'0')}:${String(initialDue.getMinutes()).padStart(2,'0')}`:fallbackTime);
  const [level,setLevel]=useState(task?.level||'中');
  const [owner,setOwner]=useState(task?.owner||'张晓彤');
  const ownerOptions=staffRecords.map(member=>member.name);
  const relatedOptions=[
    ...studentRecords.map(student=>({value:`${student.name} · ${student.target}`,label:`学生 · ${student.name} · ${student.target}`})),
    ...applications.map(application=>({value:`${application.name} · ${application.school} ${application.program}`,label:`申请 · ${application.name} · ${application.school}`}))
  ];
  const dueAt=()=>new Date(`${date}T${time}:00`).toISOString();
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal task-modal" onMouseDown={event=>event.stopPropagation()} onSubmit={event=>{event.preventDefault();if(title.trim()){const nextDueAt=dueAt();onSave({title:title.trim(),detail,time:taskDisplayTime({dueAt:nextDueAt}),level,owner,dueAt:nextDueAt})}}}>
    <div className="modal-head"><div><h2>{task?'编辑任务':'新建任务'}</h2><p>{task?'更新负责人、截止时间和任务信息':'安排一个清晰、可跟进的业务事项'}</p></div><button type="button" className="icon-btn" onClick={onClose} aria-label="关闭"><X size={18}/></button></div>
    <label>任务标题<input autoFocus required value={title} onChange={event=>setTitle(event.target.value)} placeholder="例如：确认推荐信提交进度"/></label>
    <label>关联对象<select value={detail} onChange={event=>setDetail(event.target.value)}><option value="">不关联学生或申请</option>{relatedOptions.map((option,index)=><option key={`${option.value}-${index}`} value={option.value}>{option.label}</option>)}</select></label>
    <div className="task-modal-grid three"><label>负责人<select value={owner} onChange={event=>setOwner(event.target.value)}>{ownerOptions.map(option=><option key={option}>{option}</option>)}</select></label><label>日期<input required type="date" value={date} onInput={event=>setDate(event.currentTarget.value)}/></label><label>时间<input required type="time" value={time} onInput={event=>setTime(event.currentTarget.value)}/></label></div>
    <fieldset><legend>优先级</legend><div className="priority-picker">{['低','中','高'].map(value=><button key={value} type="button" className={level===value?'active':''} onClick={()=>setLevel(value)} aria-pressed={level===value}><span className={`priority-dot level-${value}`}/>{value}</button>)}</div></fieldset>
    <div className="modal-actions"><button type="button" onClick={onClose}>取消</button><button className="primary" type="submit">{task?<Check size={15}/>:<Plus size={15}/>} {task?'保存修改':'创建任务'}</button></div>
  </form></div>;
}

export function App() {
  const [active, setActive] = useState('选导'); const [query, setQuery] = useState('');
  const [intake, setIntake] = useState('全部入学季'); const [applications, setApplications] = useState(initialApplications);
  const [selectedId, setSelectedId] = useState(1); const [tasks, setTasks] = useState(initialTasks); const [serviceRecords,setServiceRecords]=useState(initialServiceItems); const [modal, setModal] = useState(false); const [modalSchool,setModalSchool]=useState(''); const [studentModal,setStudentModal]=useState(null); const [taskModal,setTaskModal]=useState(null); const [serviceModal,setServiceModal]=useState(null); const [directoryModal,setDirectoryModal]=useState(null); const [modalContext,setModalContext]=useState('application'); const [studentRecords,setStudentRecords]=useState(students); const [staffRecords,setStaffRecords]=useState(staffDirectory); const [schoolRecords,setSchoolRecords]=useState(schoolCatalog); const [session,setSession]=useState(readSession); const [portalMode,setPortalMode] = useState(null); const [mobileMenu, setMobileMenu] = useState(false); const [toast,setToast]=useState('');
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),2800);return()=>clearTimeout(timer)},[toast]);
  useEffect(()=>{if(!session||session.role!=='teacher')return;apiRequest('/api/crm').then(data=>{const crm=data.data||{};if(Array.isArray(crm.students))setStudentRecords(crm.students);if(Array.isArray(crm.applications))setApplications(crm.applications);if(Array.isArray(crm.tasks))setTasks(crm.tasks);if(Array.isArray(crm.staff)&&crm.staff.length)setStaffRecords(crm.staff);if(Array.isArray(crm.schools)&&crm.schools.length)setSchoolRecords(crm.schools);if(Array.isArray(crm.serviceItems)&&crm.serviceItems.length)setServiceRecords(crm.serviceItems);}).catch(error=>setToast(error.message||'数据库暂时无法读取，当前显示本地演示数据'));},[session?.role]);
  const filtered = useMemo(() => applications.filter(a => (intake === '全部入学季' || a.intake === intake) && [a.name,a.school,a.program].join(' ').toLowerCase().includes(query.toLowerCase())), [applications, intake, query]);
  const selected = applications.find(a => a.id === selectedId);
  const move = (id, stage) => {const previous=applications.find(item=>item.id===id)?.stage;setApplications(items=>items.map(item=>item.id===id?{...item,stage}:item));void mutateCrmData('PATCH',{resource:'applications',id,patch:{stage},actor:session?.name||'老师'}).catch(()=>{setApplications(items=>items.map(item=>item.id===id?{...item,stage:previous}:item));notify('申请阶段保存失败，已恢复原状态');});};
  const toggleTask = id => {const previous=tasks.find(item=>item.id===id);if(!previous)return;const done=!previous.done;setTasks(items=>items.map(item=>item.id===id?{...item,done}:item));void mutateCrmData('PATCH',{resource:'tasks',id,patch:{done},actor:session?.name||'老师'}).catch(()=>{setTasks(items=>items.map(item=>item.id===id?previous:item));notify('任务状态保存失败，已恢复原状态');});};
  const createTask = task => {const record={id:Date.now(),...task,done:false};setTasks(items=>[record,...items]);setTaskModal(null);notify(`任务“${record.title}”已创建`);void mutateCrmData('POST',{resource:'tasks',record,actor:session?.name||'老师'}).catch(()=>{setTasks(items=>items.filter(item=>item.id!==record.id));notify('任务创建失败，请稍后重试');});};
  const updateTask = (id,patch) => {const previous=tasks.find(item=>item.id===id);if(!previous)return;setTasks(items=>items.map(item=>item.id===id?{...item,...patch}:item));setTaskModal(null);notify(`任务“${patch.title}”已更新`);void mutateCrmData('PATCH',{resource:'tasks',id,patch,actor:session?.name||'老师'}).catch(()=>{setTasks(items=>items.map(item=>item.id===id?previous:item));notify('任务更新失败，已恢复原内容');});};
  const deleteTask = id => {const previous=tasks.find(item=>item.id===id);if(!previous||!window.confirm(`确定删除任务“${previous.title}”吗？`))return;setTasks(items=>items.filter(item=>item.id!==id));notify('任务已删除');void mutateCrmData('DELETE',{resource:'tasks',id,actor:session?.name||'老师'}).catch(()=>{setTasks(items=>{const next=[...items,previous];return next.sort((a,b)=>String(a.id).localeCompare(String(b.id)));});notify('任务删除失败，已恢复原任务');});};
  const saveServiceRecord = record => {
    const previous=serviceRecords.find(item=>String(item.id)===String(record.id));
    setServiceRecords(items=>previous?items.map(item=>String(item.id)===String(record.id)?record:item):[record,...items]);
    setServiceModal(null);
    notify(`${record.student} 的${record.module}事项${previous?'已更新':'已创建'}`);
    void mutateCrmData(previous?'PATCH':'POST',previous?{resource:'serviceItems',id:record.id,patch:record,actor:session?.name||'老师'}:{resource:'serviceItems',record,actor:session?.name||'老师'}).catch(()=>{
      setServiceRecords(items=>previous?items.map(item=>String(item.id)===String(record.id)?previous:item):items.filter(item=>String(item.id)!==String(record.id)));
      notify(`${record.module}事项保存失败，已恢复原数据`);
    });
  };
  const deleteServiceRecord = record => {
    if(!window.confirm(`确定删除 ${record.student} 的“${record.subject}”吗？`))return;
    setServiceRecords(items=>items.filter(item=>String(item.id)!==String(record.id)));
    notify(`${record.module}事项已删除`);
    void mutateCrmData('DELETE',{resource:'serviceItems',id:record.id,actor:session?.name||'老师'}).catch(()=>{
      setServiceRecords(items=>[record,...items]);
      notify(`${record.module}事项删除失败，已恢复记录`);
    });
  };
  const saveStudentRecord = record => {
    const previous=studentRecords.find(item=>String(item.id)===String(record.id));
    setStudentRecords(items=>previous?items.map(item=>String(item.id)===String(record.id)?record:item):[record,...items]);
    setStudentModal(null);
    setActive('学生');
    notify(`${record.name} ${previous?'档案已更新':'已创建并加入服务列表'}`);
    void mutateCrmData(previous?'PATCH':'POST',previous?{resource:'students',id:record.id,patch:record,actor:session?.name||'老师'}:{resource:'students',record,actor:session?.name||'老师'}).catch(()=>{
      setStudentRecords(items=>previous?items.map(item=>String(item.id)===String(record.id)?previous:item):items.filter(item=>String(item.id)!==String(record.id)));
      notify(`${record.name} 保存失败，已恢复原数据`);
    });
  };
  const deleteStudentRecord = record => {
    const relatedCount=applications.filter(application=>application.name===record.name).length+serviceRecords.filter(item=>item.student===record.name).length+tasks.filter(task=>String(task.detail||'').includes(record.name)).length;
    if(!window.confirm(`确定删除学生“${record.name}”吗？${relatedCount?` 当前有 ${relatedCount} 条关联业务，删除学生档案不会删除关联业务与文件。`:''}`))return;
    setStudentRecords(items=>items.filter(item=>String(item.id)!==String(record.id)));
    setStudentModal(null);
    notify(`${record.name} 学生档案已删除`);
    void mutateCrmData('DELETE',{resource:'students',id:record.id,actor:session?.name||'老师'}).catch(()=>{
      setStudentRecords(items=>[record,...items]);
      notify(`${record.name} 删除失败，已恢复档案`);
    });
  };
  const saveDirectoryRecord = record => {
    const type=directoryModal?.type;
    if(!type)return;
    const resource=type==='staff'?'staff':'schools';
    const records=type==='staff'?staffRecords:schoolRecords;
    const setRecords=type==='staff'?setStaffRecords:setSchoolRecords;
    const previous=records.find(item=>String(item.id)===String(record.id));
    setRecords(items=>previous?items.map(item=>String(item.id)===String(record.id)?record:item):[...items,record]);
    setDirectoryModal(null);
    notify(`${record.name} ${previous?'档案已更新':'已加入资料库'}`);
    void mutateCrmData(previous?'PATCH':'POST',previous?{resource,id:record.id,patch:record,actor:session?.name||'老师'}:{resource,record,actor:session?.name||'老师'}).catch(()=>{
      setRecords(items=>previous?items.map(item=>String(item.id)===String(record.id)?previous:item):items.filter(item=>String(item.id)!==String(record.id)));
      notify(`${record.name} 保存失败，已恢复原数据`);
    });
  };
  const deleteDirectoryRecord = record => {
    const type=directoryModal?.type;
    if(!type)return;
    const resource=type==='staff'?'staff':'schools';
    const records=type==='staff'?staffRecords:schoolRecords;
    const setRecords=type==='staff'?setStaffRecords:setSchoolRecords;
    const relatedCount=type==='staff'?studentRecords.filter(student=>[student.manager,student.comms,student.select,student.writing,student.visa].includes(record.name)).length+applications.filter(application=>application.owner===record.name).length+tasks.filter(task=>(task.owner||'张晓彤')===record.name).length:applications.filter(application=>application.school===record.name).length;
    if(!window.confirm(`确定删除“${record.name}”吗？${relatedCount?` 当前有 ${relatedCount} 条关联业务，删除档案不会删除关联业务。`:''}`))return;
    setRecords(items=>items.filter(item=>String(item.id)!==String(record.id)));
    setDirectoryModal(null);
    notify(`${record.name} 档案已删除`);
    void mutateCrmData('DELETE',{resource,id:record.id,actor:session?.name||'老师'}).catch(()=>{
      setRecords(items=>[...items,record]);
      notify(`${record.name} 删除失败，已恢复档案`);
    });
  };
  const create = (name, school) => { if(modalContext==='student'){const record={id:Date.now(),name,initial:name.slice(0,1),target:`待确认 · ${school}`,service:'留学申请全流程',stage:'选导中',progress:5,count:0,manager:'张晓彤',comms:'待分配',select:'待分配',writing:'待分配',visa:'待分配',due:'待确认',payment:'待收款',invite:`QX${Date.now().toString().slice(-6)}`};setStudentRecords(records=>[record,...records]);setActive('学生');notify(`${name} 已创建，已进入学生服务列表`);void mutateCrmData('POST',{resource:'students',record,actor:session?.name||'老师'}).catch(()=>{setStudentRecords(records=>records.filter(item=>item.id!==record.id));notify(`${name} 创建失败，请稍后重试`);});}else{const app = {id: Date.now(), stage:'prep', name, school, program:'待确认专业', intake:'2025年秋季', owner:'张晓彤', progress:10}; setApplications(items=>[app,...items]); setSelectedId(app.id);setActive('申请');notify(`${name} 的申请项目已创建`);void mutateCrmData('POST',{resource:'applications',record:app,actor:session?.name||'老师'}).catch(()=>{setApplications(items=>items.filter(item=>item.id!==app.id));notify(`${name} 的申请项目创建失败`);});} setModal(false);setModalSchool(''); };
  const notify = message => setToast(message);
  const handleLogin = next => { setSession(next); setPortalMode(null); try { window.localStorage.setItem(SESSION_KEY, JSON.stringify(next)); } catch {} };
  const logout = () => { setSession(null); setPortalMode(null); try { window.localStorage.removeItem(SESSION_KEY); } catch {} };
  if (!session) return <><LanguageLayer/><LoginScreen onLogin={handleLogin}/></>;
  const studentProfile = session.role === 'student' ? {id:session.studentId||DEMO_STUDENT.id,name:session.name,target:session.target||DEMO_STUDENT.target,invite:session.invite||DEMO_STUDENT.invite} : DEMO_STUDENT;
  if (session.role === 'student') return <><StudentPortal student={studentProfile} onExit={logout} onNotify={notify}/><Toast message={toast}/></>;
  if (portalMode === 'teacher-preview') return <><StudentPortal preview student={studentProfile} onExit={()=>setPortalMode(null)} onNotify={notify}/><Toast message={toast}/></>;
  const navigate = label => { setActive(label); setMobileMenu(false); };
  const openApplicationModal = school => {setModalContext('application');setModalSchool(school);setModal(true);};
  const offerRate=applications.length?Math.round(applications.filter(application=>application.stage==='offer').length/applications.length*100):0;
  const content = active === '工作台' ? <DashboardView setActive={navigate} students={studentRecords} applications={applications} tasks={tasks}/> : active === '学生' ? <StudentsView setActive={navigate} studentRecords={studentRecords} onNewStudent={()=>setStudentModal({record:null})} onEditStudent={record=>setStudentModal({record})} onNotify={notify}/> : active === '老师团队' ? <TeacherTeamView studentRecords={studentRecords} applications={applications} tasks={tasks} staff={staffRecords} onNewStaff={()=>setDirectoryModal({type:'staff',record:null})} onEditStaff={record=>setDirectoryModal({type:'staff',record})} setActive={navigate}/> : active === '选导' ? <MentorWorkspace onNotify={notify}/> : active === '博士工具' ? <PhdHubTeacherView onNotify={notify}/> : active === '院校库' ? <SchoolLibraryView applications={applications} schools={schoolRecords} onStartApplication={openApplicationModal} onNewSchool={()=>setDirectoryModal({type:'schools',record:null})} onEditSchool={record=>setDirectoryModal({type:'schools',record})} onNotify={notify} setActive={navigate}/> : active === '任务' ? <TaskCenterView tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} onEditTask={task=>setTaskModal(task)} onNewTask={()=>setTaskModal('new')} setActive={navigate}/> : active === '申请' ? <main><section className="main-content"><div className="page-head"><div><h1>申请工作台</h1><p>跟进院校申请进度，及时处理关键节点</p></div><div className="head-actions"><label className="select-wrap"><select value={intake} onChange={e => setIntake(e.target.value)}><option>全部入学季</option><option>2025年秋季</option><option>2026年春季</option></select><ChevronDown size={15}/></label><button className="filter-btn"><SlidersHorizontal size={16}/>筛选</button><button className="primary" onClick={() => openApplicationModal('')}><Plus size={17}/>新建申请</button></div></div><div className="metrics"><div><small>总申请数</small><strong>{applications.length}</strong></div>{stages.map(s => <div key={s.id}><small><i style={{background:s.color}}></i>{s.label}</small><strong>{applications.filter(a => a.stage === s.id).length}</strong><span>{applications.length?Math.round(applications.filter(a => a.stage === s.id).length / applications.length * 100):0}%</span></div>)}<div><small>录取率</small><strong>{offerRate}%</strong></div></div><Pipeline apps={filtered} selectedId={selectedId} setSelectedId={setSelectedId} onMove={move}/><DetailPanel app={selected} onClose={() => setSelectedId(null)}/></section><TaskRail tasks={tasks} onToggleTask={toggleTask} onNewTask={()=>setTaskModal('new')} onOpenTaskCenter={()=>navigate('任务')}/></main> : ['文书','签证','收款'].includes(active) ? <ModuleView module={active} items={serviceRecords} onNew={module=>setServiceModal({module,item:null})} onEdit={item=>setServiceModal({module:item.module,item})} onDelete={deleteServiceRecord} setActive={navigate}/> : <ModuleView module="文书" items={serviceRecords} onNew={module=>setServiceModal({module,item:null})} onEdit={item=>setServiceModal({module:item.module,item})} onDelete={deleteServiceRecord} setActive={navigate}/>;
  return <div className="app-shell"><Sidebar active={active} setActive={navigate}/><div className="workspace"><Topbar query={query} setQuery={setQuery} session={session} onStudentView={()=>setPortalMode('teacher-preview')} onMenu={()=>setMobileMenu(true)} onNotify={notify}/>{content}</div>{mobileMenu&&<MobileNav active={active} setActive={navigate} onClose={()=>setMobileMenu(false)}/>} {modal && <NewStudentModal mode={modalContext} initialSchool={modalSchool} onClose={()=>{setModal(false);setModalSchool('')}} onCreate={create}/>} {studentModal&&<StudentCaseModal record={studentModal.record} staff={staffRecords} onClose={()=>setStudentModal(null)} onSave={saveStudentRecord} onDelete={deleteStudentRecord}/>} {taskModal&&<TaskModal task={taskModal==='new'?null:taskModal} onClose={()=>setTaskModal(null)} onSave={values=>taskModal==='new'?createTask(values):updateTask(taskModal.id,values)} students={studentRecords} applications={applications} staff={staffRecords}/>} {serviceModal&&<ServiceItemModal item={serviceModal.item} module={serviceModal.module} students={studentRecords} staff={staffRecords} onClose={()=>setServiceModal(null)} onSave={saveServiceRecord}/>} {directoryModal&&<DirectoryModal type={directoryModal.type} record={directoryModal.record} onClose={()=>setDirectoryModal(null)} onSave={saveDirectoryRecord} onDelete={deleteDirectoryRecord}/>}<Toast message={toast}/></div>;
}
