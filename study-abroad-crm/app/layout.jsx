import '../src/styles.css';
import '../src/mobile-fix.css';
import '../src/iteration.css';
import '../src/visual-refresh.css';

export const metadata = {
  title: '轻学教育 | 留学申请 CRM',
  description: '轻学教育留学机构学生、老师与导师选导协作工作台'
};

export default function RootLayout({ children }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
