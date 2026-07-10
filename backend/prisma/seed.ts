import { PrismaClient, Role, UserStatus, StudentStatus, MatchLevel, StudentIntent } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * 种子数据初始化脚本
 * 创建：1个管理员 + 2个老师 + 3个学生 + 5个导师 + 若干推荐记录 + 6条提示词模板
 */
async function main(): Promise<void> {
  console.log('🌱 开始播种种子数据...');

  // 清空现有数据（按外键依赖顺序）
  await prisma.supervisorAssignment.deleteMany();
  await prisma.aiSelectionTask.deleteMany();
  await prisma.supervisor.deleteMany();
  await prisma.student.deleteMany();
  await prisma.promptTemplate.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // ==================== 创建管理员 ====================
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      passwordHash,
      name: '系统管理员',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('✅ 管理员已创建:', adminUser.email);

  // ==================== 创建老师 ====================
  const teacher1User = await prisma.user.create({
    data: {
      email: 'teacher1@test.com',
      passwordHash,
      name: '张老师',
      role: Role.TEACHER,
      status: UserStatus.ACTIVE,
    },
  });
  const teacher1 = await prisma.teacher.create({
    data: {
      userId: teacher1User.id,
      maxStudents: 20,
    },
  });
  console.log('✅ 老师1已创建:', teacher1User.email);

  const teacher2User = await prisma.user.create({
    data: {
      email: 'teacher2@test.com',
      passwordHash,
      name: '李老师',
      role: Role.TEACHER,
      status: UserStatus.ACTIVE,
    },
  });
  const teacher2 = await prisma.teacher.create({
    data: {
      userId: teacher2User.id,
      maxStudents: 15,
    },
  });
  console.log('✅ 老师2已创建:', teacher2User.email);

  // ==================== 创建学生 ====================
  const student1User = await prisma.user.create({
    data: {
      email: 'student1@test.com',
      passwordHash,
      name: '蒋元萍',
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });
  const student1 = await prisma.student.create({
    data: {
      userId: student1User.id,
      assignedTeacherId: teacher1.id,
      grade: '大三',
      targetCountry: '香港',
      targetMajor: '计算机科学',
      status: StudentStatus.ACTIVE,
    },
  });
  console.log('✅ 学生1已创建:', student1User.email, '→ 分配给张老师');

  const student2User = await prisma.user.create({
    data: {
      email: 'student2@test.com',
      passwordHash,
      name: '王明',
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });
  const student2 = await prisma.student.create({
    data: {
      userId: student2User.id,
      assignedTeacherId: teacher1.id,
      grade: '大四',
      targetCountry: '新加坡',
      targetMajor: '人工智能',
      status: StudentStatus.ACTIVE,
    },
  });
  console.log('✅ 学生2已创建:', student2User.email, '→ 分配给张老师');

  const student3User = await prisma.user.create({
    data: {
      email: 'student3@test.com',
      passwordHash,
      name: '陈晓',
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
    },
  });
  const student3 = await prisma.student.create({
    data: {
      userId: student3User.id,
      assignedTeacherId: teacher2.id,
      grade: '研一',
      targetCountry: '香港',
      targetMajor: '数据科学',
      status: StudentStatus.ACTIVE,
    },
  });
  console.log('✅ 学生3已创建:', student3User.email, '→ 分配给李老师');

  // ==================== 创建导师库（5个导师） ====================
  const supervisor1 = await prisma.supervisor.create({
    data: {
      name: 'Prof. Wei Zhang',
      title: '教授',
      location: '香港',
      university: 'The University of Hong Kong',
      qsRanking: 26,
      usnewsRanking: 39,
      department: 'Department of Computer Science',
      homepageUrl: 'https://www.cs.hku.hk/people/academic-staff/weizhang',
      email: 'weizhang@cs.hku.hk',
      phdApplicationUrl: 'https://www.cs.hku.hk/admission/phd',
      otherInfoUrl: null,
      researchArea: 'Artificial Intelligence, Machine Learning, Computer Vision',
      createdById: teacher1User.id,
    },
  });
  console.log('✅ 导师1已创建:', supervisor1.name);

  const supervisor2 = await prisma.supervisor.create({
    data: {
      name: 'Dr. Xiaoming Liu',
      title: '副教授',
      location: '香港',
      university: 'Hong Kong University of Science and Technology',
      qsRanking: 60,
      usnewsRanking: 95,
      department: 'Department of Electronic and Computer Engineering',
      homepageUrl: 'https://ece.hkust.edu.hk/eexmliu',
      email: 'eexmliu@ust.hk',
      phdApplicationUrl: 'https://pg.ust.hk/admissions',
      otherInfoUrl: null,
      researchArea: 'Natural Language Processing, Deep Learning',
      createdById: teacher1User.id,
    },
  });
  console.log('✅ 导师2已创建:', supervisor2.name);

  const supervisor3 = await prisma.supervisor.create({
    data: {
      name: 'Prof. Jianlin Chen',
      title: '教授',
      location: '新加坡',
      university: 'National University of Singapore',
      qsRanking: 11,
      usnewsRanking: 22,
      department: 'School of Computing',
      homepageUrl: 'https://www.comp.nus.edu.sg/~chenjl',
      email: 'chenjl@comp.nus.edu.sg',
      phdApplicationUrl: 'https://www.comp.nus.edu.sg/programmes/pg/admission',
      otherInfoUrl: null,
      researchArea: 'Data Science, Big Data Analytics, AI',
      createdById: teacher2User.id,
    },
  });
  console.log('✅ 导师3已创建:', supervisor3.name);

  const supervisor4 = await prisma.supervisor.create({
    data: {
      name: 'Dr. Yufei Huang',
      title: '助理教授',
      location: '新加坡',
      university: 'Nanyang Technological University',
      qsRanking: 15,
      usnewsRanking: 30,
      department: 'School of Computer Science and Engineering',
      homepageUrl: 'https://personal.ntu.edu.sg/yfhuang',
      email: 'yfhuang@ntu.edu.sg',
      phdApplicationUrl: 'https://scse.ntu.edu.sg/Programmes/CurrentStudents/Graduate',
      otherInfoUrl: null,
      researchArea: 'Computer Vision, Medical Image Analysis',
      createdById: teacher2User.id,
    },
  });
  console.log('✅ 导师4已创建:', supervisor4.name);

  const supervisor5 = await prisma.supervisor.create({
    data: {
      name: 'Prof. Daniel Tan',
      title: '教授',
      location: '香港',
      university: 'The Chinese University of Hong Kong',
      qsRanking: 47,
      usnewsRanking: 82,
      department: 'Department of Information Engineering',
      homepageUrl: 'https://www.ie.cuhk.edu.hk/people/dtan',
      email: 'dtan@ie.cuhk.edu.hk',
      phdApplicationUrl: 'https://www.gs.cuhk.edu.hk/admissions/programme/engineering',
      otherInfoUrl: 'https://www.ie.cuhk.edu.hk',
      researchArea: 'Wireless Communications, IoT, Edge Computing',
      createdById: teacher1User.id,
    },
  });
  console.log('✅ 导师5已创建:', supervisor5.name);

  // ==================== 创建推荐记录 ====================

  // 学生1（蒋元萍）的推荐记录 — 有意向标记
  await prisma.supervisorAssignment.create({
    data: {
      studentId: student1.id,
      supervisorId: supervisor1.id,
      teacherId: teacher1.id,
      notes: 'HKU CS方向，AI/ML研究强，QS排名26。建议多看看，匹配度高。',
      matchLevel: MatchLevel.HIGH,
      studentIntent: StudentIntent.WANT_CONTACT,
      intentLocked: true,
    },
  });

  await prisma.supervisorAssignment.create({
    data: {
      studentId: student1.id,
      supervisorId: supervisor2.id,
      teacherId: teacher1.id,
      notes: 'HKUST NLP方向，副教授，QS排名60。可以备选一下。',
      matchLevel: MatchLevel.MEDIUM,
      studentIntent: StudentIntent.BACKUP,
      intentLocked: true,
    },
  });

  await prisma.supervisorAssignment.create({
    data: {
      studentId: student1.id,
      supervisorId: supervisor5.id,
      teacherId: teacher1.id,
      notes: 'CUHK IE方向，通信/IoT研究，QS排名47。',
      matchLevel: null,
      studentIntent: null,
      intentLocked: false,
    },
  });
  console.log('✅ 学生1（蒋元萍）的3条推荐记录已创建');

  // 学生2（王明）的推荐记录 — 部分有意向
  await prisma.supervisorAssignment.create({
    data: {
      studentId: student2.id,
      supervisorId: supervisor3.id,
      teacherId: teacher1.id,
      notes: 'NUS Computing，数据科学方向，QS排名11。建议多看看，非常推荐。',
      matchLevel: MatchLevel.HIGH,
      studentIntent: StudentIntent.WANT_CONTACT,
      intentLocked: true,
    },
  });

  await prisma.supervisorAssignment.create({
    data: {
      studentId: student2.id,
      supervisorId: supervisor4.id,
      teacherId: teacher1.id,
      notes: 'NTU SCSE，计算机视觉方向，QS排名15。',
      matchLevel: null,
      studentIntent: null,
      intentLocked: false,
    },
  });
  console.log('✅ 学生2（王明）的2条推荐记录已创建');

  // 学生3（陈晓）的推荐记录 — 无意向标记（待反馈）
  await prisma.supervisorAssignment.create({
    data: {
      studentId: student3.id,
      supervisorId: supervisor1.id,
      teacherId: teacher2.id,
      notes: 'HKU CS方向，QS排名26，AI研究。建议多看看。',
      matchLevel: MatchLevel.HIGH,
      studentIntent: null,
      intentLocked: false,
    },
  });

  await prisma.supervisorAssignment.create({
    data: {
      studentId: student3.id,
      supervisorId: supervisor3.id,
      teacherId: teacher2.id,
      notes: 'NUS数据科学方向，QS排名11。可以备选。',
      matchLevel: MatchLevel.MEDIUM,
      studentIntent: null,
      intentLocked: false,
    },
  });
  console.log('✅ 学生3（陈晓）的2条推荐记录已创建');

  // ==================== 创建提示词模板（6条预置模板） ====================
  await prisma.promptTemplate.createMany({
    data: [
      {
        name: '通用选导模板',
        content: '请为 {student_name} 搜索合适的PhD导师。\n\n学生背景：\n- 年级：{grade}\n- 目标地区：{target_country}\n- 目标专业：{target_major}\n\n操作指令：\n1. 搜索匹配导师并填入详细信息\n2. 填写匹配度备注\n3. 验证导师主页链接',
        category: '通用',
        createdBy: teacher1User.id,
      },
      {
        name: '简洁快速搜索',
        content: '请为 {student_name} 快速搜索 {target_country} 地区的 {target_major} 方向PhD导师。只需提供导师姓名、学校、研究方向、主页链接即可。',
        category: '通用',
        createdBy: teacher1User.id,
      },
      {
        name: '理工科深度搜索',
        content: '请为 {student_name} 深度搜索 {target_major} 方向的PhD导师。\n\n要求：\n1. 优先搜索QS排名前100的大学\n2. 重点关注 {target_major} 方向的活跃研究者\n3. 查看导师最近3年的论文发表情况\n4. 注明导师是否有招生计划\n5. 提供导师实验室主页和联系方式\n\n目标地区：{target_country}',
        category: '理工科',
        createdBy: teacher1User.id,
      },
      {
        name: '计算机科学专项',
        content: '请为 {student_name} 搜索计算机科学（特别是 {target_major}）方向的PhD导师。\n\n重点方向：AI/ML/NLP/CV/Systems/Theory\n目标地区：{target_country}\n\n要求：\n1. 列出每个导师的研究兴趣和代表性论文\n2. 标注导师的h-index（如有）\n3. 注明是否有招生名额\n4. 提供申请链接和截止日期',
        category: '理工科',
        createdBy: teacher2User.id,
      },
      {
        name: '人文社科导师搜索',
        content: '请为 {student_name} 搜索 {target_country} 地区的 {target_major} 方向PhD导师。\n\n要求：\n1. 关注导师的研究领域和方法论取向\n2. 查看导师的学术影响力和出版物\n3. 了解导师指导风格（如有信息）\n4. 提供申请要求和奖学金信息\n5. 注明是否需要联系导师后再申请',
        category: '人文社科',
        createdBy: teacher2User.id,
      },
      {
        name: '商科MBA/PhD导师搜索',
        content: '请为 {student_name} 搜索 {target_country} 地区商学院的 {target_major} 方向导师。\n\n要求：\n1. 优先搜索AACSB认证商学院\n2. 查看导师研究方向和咨询经历\n3. 了解项目资金支持和助教机会\n4. 提供GMAT/GRE要求\n5. 注明申请轮次和截止日期',
        category: '商科',
        createdBy: teacher2User.id,
      },
    ],
  });
  console.log('✅ 6条预置提示词模板已创建');

  console.log('\n🎉 种子数据播种完成！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 测试账号：');
  console.log('  管理员: admin@test.com / password123');
  console.log('  老师1:  teacher1@test.com / password123');
  console.log('  老师2:  teacher2@test.com / password123');
  console.log('  学生1:  student1@test.com / password123');
  console.log('  学生2:  student2@test.com / password123');
  console.log('  学生3:  student3@test.com / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((error) => {
    console.error('❌ 种子数据播种失败:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
