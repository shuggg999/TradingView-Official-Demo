// 课程数据 - 基于整体思考.md的课程规划

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'advanced' | 'practical';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number; // 分钟
  lessons: Lesson[];
  thumbnail: string;
  price: number;
  published: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number; // 分钟
  order: number;
  videoUrl?: string;
}

// 基础课程（10门）
export const basicCourses: Course[] = [
  {
    id: 'basic-001',
    title: '投资入门指南',
    description: '全面了解股票市场基础知识，建立正确的投资理念和目标',
    category: 'basic',
    level: 'BEGINNER',
    duration: 120,
    price: 0,
    published: true,
    thumbnail: '/images/courses/investment-basics.jpg',
    lessons: [
      {
        id: 'lesson-001-01',
        title: '什么是股票投资',
        content: `
# 什么是股票投资

## 股票的本质
股票代表对公司的所有权。当您购买一家公司的股票时，您就成为了该公司的股东，享有相应的权利和承担相应的风险。

## 投资与投机的区别
- **投资**：基于对公司基本面的分析，长期持有优质公司股票
- **投机**：基于短期价格波动进行买卖，追求快速获利

## 股票市场的功能
1. **资本配置**：将社会资金引导到最有效率的企业
2. **价格发现**：通过供需关系确定公司的市场价值
3. **风险分散**：为投资者提供多样化的投资选择

## 投资的基本原则
- 不要把所有鸡蛋放在一个篮子里
- 长期投资比短期投机更容易成功
- 了解自己投资的公司
- 控制情绪，理性决策

## 实践要点
在开始投资之前，请确保：
- 有稳定的收入来源
- 已经建立应急基金
- 清楚自己的风险承受能力
- 设定明确的投资目标
        `,
        duration: 25,
        order: 1,
      },
      {
        id: 'lesson-001-02',
        title: '投资理念和目标设定',
        content: `
# 投资理念和目标设定

## 建立正确的投资理念

### 价值投资理念
- 寻找被低估的优质公司
- 关注公司的内在价值
- 长期持有，获得复利收益

### 成长投资理念
- 投资于高成长性的公司
- 关注行业趋势和公司前景
- 承受一定的估值溢价

## 投资目标的设定

### SMART原则
- **具体的(Specific)**：明确投资金额和预期收益
- **可衡量的(Measurable)**：设定具体的收益率目标
- **可实现的(Achievable)**：根据自身情况设定合理目标
- **相关的(Relevant)**：与个人财务规划相关
- **有时限的(Time-bound)**：设定明确的时间框架

### 常见投资目标
1. **退休规划**：为退休后的生活积累资金
2. **教育基金**：为子女教育准备资金
3. **购房基金**：为购买房产储备资金
4. **财富增值**：实现财富的保值增值

## 风险承受能力评估

### 年龄因素
- 年轻人：可承受较高风险，追求长期增长
- 中年人：平衡风险和收益
- 老年人：注重资本保全，降低风险

### 财务状况
- 收入稳定性
- 债务水平
- 应急基金充足性
- 其他投资组合情况

## 投资期限规划
- **短期（1-3年）**：流动性强的投资品种
- **中期（3-10年）**：平衡型投资组合
- **长期（10年以上）**：可承受较高风险，追求增长
        `,
        duration: 30,
        order: 2,
      },
      {
        id: 'lesson-001-03',
        title: '风险认知和心理准备',
        content: `
# 风险认知和心理准备

## 投资风险的类型

### 系统性风险
- **市场风险**：整个市场下跌的风险
- **利率风险**：利率变化对股价的影响
- **通胀风险**：通胀侵蚀投资收益的风险
- **政策风险**：政府政策变化的影响

### 非系统性风险
- **公司风险**：特定公司经营不善的风险
- **行业风险**：特定行业衰落的风险
- **信用风险**：公司违约的风险

## 投资心理学

### 常见心理偏误
1. **损失厌恶**：对损失的敏感度高于收益
2. **从众心理**：盲目跟随大众行为
3. **过度自信**：高估自己的判断能力
4. **锚定效应**：过分依赖第一印象

### 情绪管理
- **贪婪时要恐惧**：市场过热时保持冷静
- **恐惧时要贪婪**：市场恐慌时寻找机会
- **保持耐心**：好的投资需要时间验证
- **接受亏损**：亏损是投资的一部分

## 风险管理策略

### 分散投资
- 不同行业的股票
- 不同地区的市场
- 不同类型的资产

### 定期审视
- 定期检查投资组合
- 根据市场变化调整策略
- 保持投资纪律

### 止损机制
- 设定止损点位
- 严格执行止损策略
- 避免情绪化决策

## 心理准备清单
✓ 理解投资有风险，收益不保证
✓ 准备承受一定程度的亏损
✓ 不用借钱投资
✓ 不投资自己不了解的产品
✓ 保持长期投资的心态
✓ 学会控制投资情绪
        `,
        duration: 35,
        order: 3,
      },
    ],
  },
  {
    id: 'basic-002',
    title: 'K线图基础',
    description: '掌握K线图的构成、常见形态和组合分析方法',
    category: 'basic',
    level: 'BEGINNER',
    duration: 90,
    price: 0,
    published: true,
    thumbnail: '/images/courses/candlestick-basics.jpg',
    lessons: [
      {
        id: 'lesson-002-01',
        title: 'K线的构成和含义',
        content: `
# K线的构成和含义

## K线的起源
K线图起源于18世纪的日本，最初用于分析大米价格走势。因其形状像蜡烛，也被称为"蜡烛图"。

## K线的基本构成

### 实体部分
- **开盘价**：交易日开始时的价格
- **收盘价**：交易日结束时的价格
- **实体**：开盘价和收盘价之间的矩形部分

### 影线部分
- **上影线**：最高价与实体上端的连线
- **下影线**：最低价与实体下端的连线

## K线的颜色含义

### 阳线（红色/绿色）
- 收盘价高于开盘价
- 表示当日买方力量较强
- 市场情绪相对乐观

### 阴线（黑色/红色）
- 收盘价低于开盘价
- 表示当日卖方力量较强
- 市场情绪相对悲观

## K线的时间周期
- **分钟K线**：1分钟、5分钟、15分钟、30分钟
- **小时K线**：1小时、4小时
- **日K线**：最常用的分析周期
- **周K线**：适合中期分析
- **月K线**：适合长期分析

## K线的基本形态

### 光头光脚阳线
- 没有上下影线的阳线
- 表示买方完全占据主导地位
- 通常是强烈的看涨信号

### 光头光脚阴线
- 没有上下影线的阴线
- 表示卖方完全占据主导地位
- 通常是强烈的看跌信号

### 十字星
- 开盘价与收盘价相等或非常接近
- 表示买卖双方力量均衡
- 通常出现在趋势转折点

## 实践应用
- 观察K线的实体大小判断力量强弱
- 通过影线长短判断多空争夺激烈程度
- 结合成交量分析K线的可靠性
        `,
        duration: 30,
        order: 1,
      },
      {
        id: 'lesson-002-02',
        title: '常见K线形态识别',
        content: `
# 常见K线形态识别

## 单根K线形态

### 锤子线
- **特征**：实体较小，下影线较长，上影线很短或没有
- **含义**：在下跌趋势中出现，表示可能见底
- **确认**：需要后续K线确认

### 上吊线
- **特征**：与锤子线形态相同，但出现在上涨趋势中
- **含义**：可能的顶部信号
- **注意**：需要结合成交量和后续走势确认

### 射击之星
- **特征**：实体较小，上影线很长，下影线很短或没有
- **含义**：在上涨趋势中的顶部反转信号
- **确认**：需要后续阴线确认

### 倒锤子
- **特征**：与射击之星形态相同，但出现在下跌趋势中
- **含义**：可能的底部反转信号
- **确认**：需要后续阳线确认

## 双K线组合

### 看涨吞没
- **特征**：先是一根阴线，后是一根阳线完全包含前一根阴线
- **含义**：强烈的看涨信号
- **位置**：在下跌趋势中更有效

### 看跌吞没
- **特征**：先是一根阳线，后是一根阴线完全包含前一根阳线
- **含义**：强烈的看跌信号
- **位置**：在上涨趋势中更有效

### 乌云盖顶
- **特征**：阳线后跟一根阴线，阴线开盘价高于阳线最高价，收盘价低于阳线实体中点
- **含义**：看跌反转信号
- **确认**：需要后续走势确认

### 曙光初现
- **特征**：阴线后跟一根阳线，阳线开盘价低于阴线最低价，收盘价高于阴线实体中点
- **含义**：看涨反转信号
- **确认**：需要后续走势确认

## 三K线组合

### 红三兵
- **特征**：连续三根阳线，每根都创新高
- **含义**：强烈的看涨信号
- **注意**：在高位出现需谨慎

### 三只乌鸦
- **特征**：连续三根阴线，每根都创新低
- **含义**：强烈的看跌信号
- **注意**：在低位出现可能是超卖

## 形态识别要点
1. **趋势背景**：同样的形态在不同趋势中含义不同
2. **成交量**：成交量配合能提高形态的可靠性
3. **市场环境**：整体市场环境会影响形态效果
4. **及时确认**：形态出现后需要后续走势确认
        `,
        duration: 35,
        order: 2,
      },
      {
        id: 'lesson-002-03',
        title: 'K线组合分析',
        content: `
# K线组合分析

## 组合分析的重要性
单根K线的信号相对较弱，多根K线组合能够提供更可靠的市场信号。组合分析是技术分析的核心技能之一。

## 反转形态组合

### 头肩顶
- **构成**：左肩、头部、右肩三个高点
- **特征**：头部最高，两肩大致等高
- **确认**：跌破颈线位
- **目标位**：头部到颈线的距离

### 头肩底
- **构成**：左肩、头部、右肩三个低点
- **特征**：头部最低，两肩大致等低
- **确认**：突破颈线位
- **目标位**：头部到颈线的距离

### 双顶(M顶)
- **构成**：两个相近的高点
- **特征**：两个顶部基本等高
- **确认**：跌破中间低点
- **目标位**：顶部到颈线的距离

### 双底(W底)
- **构成**：两个相近的低点
- **特征**：两个底部基本等低
- **确认**：突破中间高点
- **目标位**：底部到颈线的距离

## 整理形态组合

### 三角形整理
- **上升三角形**：水平阻力位+上升支撑线
- **下降三角形**：水平支撑位+下降阻力线
- **对称三角形**：上升支撑线+下降阻力线

### 矩形整理
- **特征**：价格在水平区间内震荡
- **突破方向**：通常延续原趋势
- **交易策略**：区间操作或突破跟进

### 楔形整理
- **上升楔形**：看跌信号
- **下降楔形**：看涨信号
- **特点**：成交量逐步萎缩

## 缺口分析

### 普通缺口
- **特征**：在整理过程中出现
- **意义**：不具备太大技术意义
- **填补**：通常会被快速填补

### 突破缺口
- **特征**：突破重要阻力或支撑时出现
- **意义**：确认突破有效性
- **填补**：不会轻易被填补

### 持续缺口
- **特征**：在趋势中途出现
- **意义**：确认趋势继续
- **位置**：通常在整个走势的中点

### 竭尽缺口
- **特征**：在趋势末期出现
- **意义**：趋势可能即将结束
- **填补**：经常被快速填补

## 组合分析实战技巧

### 多时间周期确认
- 大周期确定趋势方向
- 小周期寻找入场时机
- 各周期信号协调一致时可靠性更高

### 成交量配合
- 突破时成交量应该放大
- 回调时成交量应该萎缩
- 量价配合的信号更可靠

### 关键位置关注
- 重要支撑阻力位
- 前期高低点
- 技术指标关键位置

## 组合分析注意事项
1. **不要孤立看待单个形态**
2. **结合整体市场环境分析**
3. **关注形态的完整性**
4. **设置合理的止损位置**
5. **耐心等待形态确认**
        `,
        duration: 25,
        order: 3,
      },
    ],
  },
  {
    id: 'basic-003',
    title: '技术分析概论',
    description: '学习技术分析的基本假设、趋势理论和支撑阻力位分析',
    category: 'basic',
    level: 'BEGINNER',
    duration: 100,
    price: 0,
    published: true,
    thumbnail: '/images/courses/technical-analysis.jpg',
    lessons: [
      {
        id: 'lesson-003-01',
        title: '技术分析三大假设',
        content: `# 技术分析三大假设\n\n## 假设一：市场行为包含一切信息\n所有影响股价的因素都已经反映在股价中，包括基本面、政策面、资金面等。\n\n## 假设二：价格沿趋势运动\n股价运动具有趋势性，趋势一旦形成，会持续一段时间。\n\n## 假设三：历史会重演\n人类心理和行为模式相对稳定，过去的价格模式会在未来重复出现。`,
        duration: 25,
        order: 1,
      },
    ],
  },
  {
    id: 'basic-004',
    title: '基本面分析入门',
    description: '掌握财务报表解读、行业分析和估值方法基础',
    category: 'basic',
    level: 'BEGINNER',
    duration: 120,
    price: 0,
    published: true,
    thumbnail: '/images/courses/fundamental-analysis.jpg',
    lessons: [
      {
        id: 'lesson-004-01',
        title: '财务报表基础',
        content: `# 财务报表基础\n\n## 三大财务报表\n- **资产负债表**：显示公司财务状况\n- **利润表**：显示公司盈利能力\n- **现金流量表**：显示公司现金流状况\n\n## 关键财务指标\n- ROE（净资产收益率）\n- ROA（总资产收益率）\n- 毛利率、净利率\n- 资产负债率`,
        duration: 30,
        order: 1,
      },
    ],
  },
  {
    id: 'basic-005',
    title: '风险管理基础',
    description: '学习仓位管理、止盈止损和风险控制的基本原则',
    category: 'basic',
    level: 'BEGINNER',
    duration: 90,
    price: 0,
    published: true,
    thumbnail: '/images/courses/risk-management.jpg',
    lessons: [
      {
        id: 'lesson-005-01',
        title: '仓位管理策略',
        content: `# 仓位管理策略\n\n## 仓位管理的重要性\n合理的仓位管理是投资成功的关键，它决定了风险承受能力和收益潜力。\n\n## 常用仓位管理方法\n- **金字塔加仓法**：盈利时逐步加仓\n- **倒金字塔减仓法**：亏损时逐步减仓\n- **固定比例法**：每只股票固定仓位\n- **凯利公式法**：根据胜率和赔率确定仓位`,
        duration: 25,
        order: 1,
      },
    ],
  },
  {
    id: 'basic-006',
    title: '交易心理学',
    description: '了解投资心理偏误，学习情绪控制和交易纪律',
    category: 'basic',
    level: 'BEGINNER',
    duration: 80,
    price: 0,
    published: true,
    thumbnail: '/images/courses/trading-psychology.jpg',
    lessons: [
      {
        id: 'lesson-006-01',
        title: '常见心理误区',
        content: `# 常见心理误区\n\n## 认知偏误\n- **确认偏误**：只关注支持自己观点的信息\n- **锚定效应**：过分依赖第一印象\n- **代表性偏误**：用小样本推断总体\n\n## 情绪偏误\n- **损失厌恶**：对损失的敏感度是收益的2-3倍\n- **过度自信**：高估自己的判断能力\n- **从众心理**：盲目跟随大众行为`,
        duration: 20,
        order: 1,
      },
    ],
  },
  {
    id: 'basic-007',
    title: '证券市场基础',
    description: '了解证券市场结构、交易机制和监管制度',
    category: 'basic',
    level: 'BEGINNER',
    duration: 100,
    price: 0,
    published: true,
    thumbnail: '/images/courses/securities-market.jpg',
    lessons: [
      {
        id: 'lesson-007-01',
        title: '市场结构和参与者',
        content: `# 市场结构和参与者\n\n## 市场层次\n- **主板市场**：大型成熟企业\n- **中小板**：中型企业\n- **创业板**：高科技成长企业\n- **科创板**：科技创新企业\n\n## 市场参与者\n- **机构投资者**：基金、保险、社保等\n- **个人投资者**：散户投资者\n- **做市商**：提供流动性\n- **监管机构**：证监会、交易所等`,
        duration: 25,
        order: 1,
      },
    ],
  },
  {
    id: 'basic-008',
    title: '投资组合理论',
    description: '学习分散投资原理、资产配置和风险收益平衡',
    category: 'basic',
    level: 'BEGINNER',
    duration: 110,
    price: 0,
    published: true,
    thumbnail: '/images/courses/portfolio-theory.jpg',
    lessons: [
      {
        id: 'lesson-008-01',
        title: '分散投资原理',
        content: `# 分散投资原理\n\n## 风险的类型\n- **系统性风险**：影响整个市场的风险\n- **非系统性风险**：影响个别股票的风险\n\n## 分散投资的好处\n- 降低非系统性风险\n- 提高风险调整后收益\n- 减少组合波动性\n\n## 有效分散投资\n- 不同行业股票\n- 不同地区市场\n- 不同类型资产\n- 不同投资风格`,
        duration: 30,
        order: 1,
      },
    ],
  },
  {
    id: 'basic-009',
    title: '财务报表解读',
    description: '深入解读三大财务报表和关键财务指标',
    category: 'basic',
    level: 'BEGINNER',
    duration: 130,
    price: 0,
    published: true,
    thumbnail: '/images/courses/financial-statements.jpg',
    lessons: [
      {
        id: 'lesson-009-01',
        title: '资产负债表分析',
        content: `# 资产负债表分析\n\n## 资产负债表结构\n资产 = 负债 + 所有者权益\n\n## 关键分析要点\n- **资产质量**：流动资产vs固定资产\n- **负债结构**：短期债务vs长期债务\n- **权益结构**：实收资本vs留存收益\n\n## 重要财务比率\n- 流动比率 = 流动资产/流动负债\n- 速动比率 = (流动资产-存货)/流动负债\n- 资产负债率 = 总负债/总资产`,
        duration: 35,
        order: 1,
      },
    ],
  },
  {
    id: 'basic-010',
    title: '宏观经济分析',
    description: '了解经济周期、宏观指标和政策对股市的影响',
    category: 'basic',
    level: 'BEGINNER',
    duration: 120,
    price: 0,
    published: true,
    thumbnail: '/images/courses/macro-economics.jpg',
    lessons: [
      {
        id: 'lesson-010-01',
        title: '经济周期理论',
        content: `# 经济周期理论\n\n## 经济周期阶段\n1. **复苏期**：经济开始回暖，股市通常上涨\n2. **繁荣期**：经济快速增长，股市可能见顶\n3. **衰退期**：经济增长放缓，股市下跌\n4. **萧条期**：经济低迷，股市筑底\n\n## 重要宏观指标\n- GDP增长率\n- CPI通胀率\n- PMI采购经理指数\n- 失业率\n- 利率水平`,
        duration: 30,
        order: 1,
      },
    ],
  },
];

// 进阶课程（15门）
export const advancedCourses: Course[] = [
  {
    id: 'advanced-001',
    title: '高级技术分析',
    description: '深入学习波浪理论、江恩理论等高级技术分析方法',
    category: 'advanced',
    level: 'ADVANCED',
    duration: 180,
    price: 299,
    published: true,
    thumbnail: '/images/courses/advanced-technical.jpg',
    lessons: [
      {
        id: 'lesson-adv-001-01',
        title: '波浪理论基础',
        content: `
# 波浪理论基础

## 波浪理论概述
波浪理论由拉尔夫·尼尔森·艾略特在1938年提出，是一种基于群众心理和市场情绪变化的技术分析理论。

## 基本原理

### 八波浪结构
市场趋势按照特定的八波浪模式发展：
- **推动浪（1、3、5浪）**：顺趋势运动
- **调整浪（2、4浪）**：逆趋势运动
- **大调整浪（A、B、C浪）**：主要趋势后的调整

### 三大铁律
1. **第3浪永远不是最短的推动浪**
2. **第2浪的底不能低于第1浪的起点**
3. **第4浪的底不能低于第1浪的顶**

## 推动浪特征

### 第1浪特征
- 通常是五浪结构的开始
- 往往在悲观情绪中产生
- 很多人认为只是反弹

### 第2浪特征
- 调整幅度通常很深
- 经常回撤第1浪的50%-61.8%
- 市场情绪重新转向悲观

### 第3浪特征
- 通常是最长、最强的一浪
- 突破前期高点，确认趋势
- 市场开始被广泛关注

### 第4浪特征
- 调整时间较长，幅度相对较浅
- 通常以三角形或平台型整理
- 为第5浪做准备

### 第5浪特征
- 完成整个推动浪结构
- 可能出现衰竭现象
- 市场情绪达到高潮

## 调整浪模式

### 锯齿形调整(5-3-5)
- A浪：5波下跌
- B浪：3波反弹
- C浪：5波下跌

### 平台型调整(3-3-5)
- A浪：3波下跌
- B浪：3波反弹（接近A浪起点）
- C浪：5波下跌

### 三角形调整(3-3-3-3-3)
- 五个子浪都是3波结构
- 波幅逐渐收窄
- 突破方向通常延续原趋势

## 斐波那契比率应用

### 常用比率
- **0.236、0.382、0.500、0.618、0.764**
- **1.000、1.272、1.382、1.618、2.618**

### 回撤比率
- 第2浪通常回撤第1浪的50%-61.8%
- 第4浪通常回撤第3浪的38.2%-50%

### 延伸比率
- 第3浪通常是第1浪的1.618倍
- 第5浪通常等于第1浪或是其0.618倍

## 实际应用技巧

### 数浪规则
1. 从明显的起点开始数浪
2. 严格遵守三大铁律
3. 多个时间周期相互验证
4. 结合成交量变化

### 交易策略
- **第3浪**：主要的进场机会
- **第5浪**：谨慎参与，准备离场
- **调整浪**：寻找反向交易机会

## 波浪理论的局限性
- 主观性较强，数浪容易分歧
- 需要大量经验积累
- 短期预测效果有限
- 需要结合其他分析方法
        `,
        duration: 45,
        order: 1,
      },
    ],
  },
  {
    id: 'advanced-002',
    title: '量化交易入门',
    description: '学习量化策略原理、因子分析和回测系统搭建',
    category: 'advanced',
    level: 'ADVANCED',
    duration: 200,
    price: 399,
    published: true,
    thumbnail: '/images/courses/quantitative-trading.jpg',
    lessons: [
      {
        id: 'lesson-adv-002-01',
        title: '量化交易概述',
        content: `# 量化交易概述\n\n## 什么是量化交易\n量化交易是指利用数学模型和计算机程序进行投资决策的交易方式。\n\n## 量化交易的优势\n- 消除人为情绪干扰\n- 提高交易执行效率\n- 实现大规模数据处理\n- 降低交易成本\n\n## 量化策略类型\n- 趋势跟踪策略\n- 均值回归策略\n- 套利策略\n- 机器学习策略`,
        duration: 35,
        order: 1,
      },
    ],
  },
  {
    id: 'advanced-003',
    title: '期权策略',
    description: '掌握期权基础知识和常用期权投资策略',
    category: 'advanced',
    level: 'ADVANCED',
    duration: 170,
    price: 299,
    published: true,
    thumbnail: '/images/courses/options-strategies.jpg',
    lessons: [
      {
        id: 'lesson-adv-003-01',
        title: '期权基础知识',
        content: `# 期权基础知识\n\n## 期权的定义\n期权是一种衍生金融工具，给持有者在特定时间以特定价格买入或卖出标的资产的权利。\n\n## 期权的分类\n- **看涨期权(Call)**：买入权利\n- **看跌期权(Put)**：卖出权利\n- **美式期权**：可随时行权\n- **欧式期权**：只能到期行权\n\n## 期权的基本要素\n- 标的资产\n- 行权价格\n- 到期时间\n- 期权费`,
        duration: 30,
        order: 1,
      },
    ],
  },
  // 其余12门进阶课程...
];

// 实战课程（10门）
export const practicalCourses: Course[] = [
  {
    id: 'practical-001',
    title: '实盘交易技巧',
    description: '学习开盘策略、盘中操作和收盘总结的实战技巧',
    category: 'practical',
    level: 'INTERMEDIATE',
    duration: 150,
    price: 199,
    published: true,
    thumbnail: '/images/courses/practical-trading.jpg',
    lessons: [
      {
        id: 'lesson-prac-001-01',
        title: '开盘策略制定',
        content: `
# 开盘策略制定

## 开盘前的准备工作

### 信息收集
- **宏观经济数据**：关注重要经济指标发布
- **政策消息**：政府政策、央行决议等
- **公司公告**：财报、重大事项公告
- **外盘走势**：欧美股市表现
- **期货指数**：股指期货走势

### 技术分析准备
- 分析前一交易日收盘情况
- 确定重要支撑阻力位
- 观察技术指标状态
- 制定交易计划

## 开盘类型分析

### 高开
- **温和高开（0.5%-2%）**：通常延续前日趋势
- **大幅高开（>2%）**：可能出现高开低走
- **跳空高开**：关注缺口是否会被回补

### 平开
- 延续前日收盘价附近震荡
- 需要观察首个30分钟的方向选择
- 通常等待明确信号再入场

### 低开
- **温和低开（0.5%-2%）**：可能是调整机会
- **大幅低开（>2%）**：可能出现低开高走
- **跳空低开**：关注是否有恐慌性抛售

## 开盘30分钟策略

### 观察要点
- **成交量**：是否放量
- **价格波动**：振幅大小
- **市场情绪**：买卖盘强弱

### 交易策略
1. **突破策略**：突破前日高低点
2. **回踩策略**：回踩重要支撑位
3. **区间策略**：在明确区间内操作

## 不同市况的开盘策略

### 牛市开盘策略
- 高开可以追涨强势股
- 低开是买入机会
- 重点关注成长性好的股票

### 熊市开盘策略
- 高开要谨慎，可能是反弹
- 低开继续观望
- 以防守为主，控制仓位

### 震荡市开盘策略
- 高开低走概率大
- 低开高走机会多
- 适合高抛低吸操作

## 板块轮动策略

### 热点板块识别
- 涨跌幅榜前列
- 成交量活跃
- 消息面刺激

### 轮动规律
- 权重股→题材股
- 大盘股→小盘股
- 价值股→成长股

## 风险控制

### 仓位管理
- 开盘不满仓操作
- 保留资金应对变化
- 根据确定性调整仓位

### 止损设置
- 开盘买入立即设置止损
- 止损位设在重要技术位下方
- 严格执行止损纪律

## 开盘实战案例

### 案例一：突破买入
- 股票在重要阻力位附近
- 开盘放量突破阻力位
- 立即买入，止损设在阻力位下方

### 案例二：回踩加仓
- 股票处于上升趋势中
- 开盘回踩重要支撑位
- 确认支撑有效后加仓

## 注意事项
1. 不要在开盘第一分钟急于交易
2. 观察成交量是否配合价格变化
3. 关注大盘整体走势
4. 保持冷静，不被情绪影响
5. 严格按计划执行，不随意改变策略
        `,
        duration: 40,
        order: 1,
      },
    ],
  },
  {
    id: 'practical-002',
    title: '牛市操作策略',
    description: '学习牛市特征识别和追涨技巧',
    category: 'practical',
    level: 'INTERMEDIATE',
    duration: 120,
    price: 199,
    published: true,
    thumbnail: '/images/courses/bull-market-strategy.jpg',
    lessons: [
      {
        id: 'lesson-prac-002-01',
        title: '牛市特征识别',
        content: `# 牛市特征识别\n\n## 技术特征\n- 股指持续创新高\n- 成交量持续放大\n- 板块轮动明显\n- 回调幅度有限\n\n## 市场情绪\n- 投资者信心增强\n- 媒体报道积极\n- 新增开户数增加\n- 融资余额上升\n\n## 操作策略\n- 重仓持股\n- 逢低买入\n- 板块轮动\n- 控制贪婪情绪`,
        duration: 30,
        order: 1,
      },
    ],
  },
  {
    id: 'practical-003',
    title: '熊市生存指南',
    description: '掌握熊市防守策略和反弹机会把握',
    category: 'practical',
    level: 'INTERMEDIATE',
    duration: 110,
    price: 199,
    published: true,
    thumbnail: '/images/courses/bear-market-guide.jpg',
    lessons: [
      {
        id: 'lesson-prac-003-01',
        title: '熊市防守策略',
        content: `# 熊市防守策略\n\n## 熊市特征\n- 股指持续下跌\n- 成交量萎缩\n- 投资者信心不足\n- 估值回归理性\n\n## 防守策略\n- 控制仓位\n- 选择防守型股票\n- 设置止损位\n- 保持现金流动性\n\n## 机会把握\n- 超跌反弹\n- 政策底部\n- 估值底部\n- 技术性反弹`,
        duration: 28,
        order: 1,
      },
    ],
  },
  {
    id: 'practical-004',
    title: '板块轮动策略',
    description: '掌握板块分析方法和轮动规律',
    category: 'practical',
    level: 'INTERMEDIATE',
    duration: 130,
    price: 199,
    published: true,
    thumbnail: '/images/courses/sector-rotation.jpg',
    lessons: [
      {
        id: 'lesson-prac-004-01',
        title: '板块轮动规律',
        content: `# 板块轮动规律\n\n## 经济周期与板块轮动\n- **衰退期**：必需消费、公用事业\n- **复苏期**：金融、房地产\n- **扩张期**：科技、可选消费\n- **滞胀期**：能源、原材料\n\n## 轮动识别信号\n- 成交量异常放大\n- 板块涨幅居前\n- 龙头股表现强势\n- 消息面催化\n\n## 操作策略\n- 提前布局\n- 龙头股策略\n- 及时止盈\n- 资金管理`,
        duration: 32,
        order: 1,
      },
    ],
  },
  {
    id: 'practical-005',
    title: '短线交易技巧',
    description: '学习日内交易和分时图分析',
    category: 'practical',
    level: 'ADVANCED',
    duration: 140,
    price: 299,
    published: true,
    thumbnail: '/images/courses/short-term-trading.jpg',
    lessons: [
      {
        id: 'lesson-prac-005-01',
        title: '分时图分析',
        content: `# 分时图分析\n\n## 分时图要素\n- 价格走势线\n- 成交量柱状图\n- 均价线\n- 买卖盘数据\n\n## 关键时间点\n- 开盘30分钟\n- 上午收盘前\n- 下午开盘后\n- 尾盘30分钟\n\n## 短线买点\n- 突破前高\n- 回踩均价线\n- 放量上攻\n- 强势整理\n\n## 风险控制\n- 快进快出\n- 严格止损\n- 控制仓位\n- 避免隔夜风险`,
        duration: 35,
        order: 1,
      },
    ],
  },
  {
    id: 'practical-006',
    title: '价值投资实践',
    description: '学习价值股筛选和长期持有策略',
    category: 'practical',
    level: 'INTERMEDIATE',
    duration: 160,
    price: 249,
    published: true,
    thumbnail: '/images/courses/value-investing-practice.jpg',
    lessons: [
      {
        id: 'lesson-prac-006-01',
        title: '价值股筛选',
        content: `# 价值股筛选\n\n## 价值股特征\n- 低估值（低PE、PB）\n- 高分红率\n- 财务稳健\n- 行业地位稳固\n- 管理层优秀\n\n## 筛选标准\n- PE < 15倍\n- PB < 2倍\n- ROE > 15%\n- 分红率 > 3%\n- 负债率 < 50%\n\n## 巴菲特投资理念\n- 投资优秀企业\n- 长期持有\n- 能力圈投资\n- 安全边际\n- 市场先生理论\n\n## 实践要点\n- 深度研究\n- 耐心等待\n- 逆向思维\n- 长期视角`,
        duration: 40,
        order: 1,
      },
    ],
  },
  {
    id: 'practical-007',
    title: '成长股投资',
    description: '掌握成长股特征和投资方法',
    category: 'practical',
    level: 'INTERMEDIATE',
    duration: 150,
    price: 249,
    published: true,
    thumbnail: '/images/courses/growth-investing.jpg',
    lessons: [
      {
        id: 'lesson-prac-007-01',
        title: '成长股特征',
        content: `# 成长股特征\n\n## 财务特征\n- 收入快速增长\n- 利润增长率高\n- 毛利率提升\n- 现金流充沛\n- 轻资产模式\n\n## 行业特征\n- 新兴行业\n- 市场空间大\n- 技术门槛高\n- 竞争格局好\n- 政策支持\n\n## 成长性评估\n- 收入增长率\n- 净利润增长率\n- 市场份额变化\n- 新产品推出\n- 业务扩张计划\n\n## 投资策略\n- 关注增长持续性\n- 合理估值买入\n- 阶段性获利了结\n- 控制投资比例`,
        duration: 38,
        order: 1,
      },
    ],
  },
  {
    id: 'practical-008',
    title: 'ETF投资策略',
    description: '学习ETF产品和指数投资方法',
    category: 'practical',
    level: 'BEGINNER',
    duration: 100,
    price: 149,
    published: true,
    thumbnail: '/images/courses/etf-investing.jpg',
    lessons: [
      {
        id: 'lesson-prac-008-01',
        title: 'ETF产品介绍',
        content: `# ETF产品介绍\n\n## ETF定义\n交易所交易基金，跟踪特定指数表现。\n\n## ETF优势\n- 分散风险\n- 费用低廉\n- 交易便利\n- 透明度高\n- 税收效率\n\n## ETF类型\n- **宽基ETF**：沪深300、中证500\n- **行业ETF**：科技、医药、金融\n- **主题ETF**：5G、新能源、消费\n- **海外ETF**：纳指、标普500\n\n## 投资策略\n- 定投策略\n- 核心卫星配置\n- 行业轮动\n- 套利交易\n\n## 选择要点\n- 跟踪误差\n- 流动性\n- 管理费率\n- 基金规模`,
        duration: 25,
        order: 1,
      },
    ],
  },
  {
    id: 'practical-009',
    title: '期货交易实战',
    description: '了解期货市场特点和交易策略',
    category: 'practical',
    level: 'ADVANCED',
    duration: 180,
    price: 399,
    published: true,
    thumbnail: '/images/courses/futures-trading.jpg',
    lessons: [
      {
        id: 'lesson-prac-009-01',
        title: '期货市场基础',
        content: `# 期货市场基础\n\n## 期货特点\n- 标准化合约\n- 保证金交易\n- 杠杆效应\n- 双向交易\n- T+0交易\n\n## 主要品种\n- **股指期货**：沪深300、中证500\n- **商品期货**：螺纹钢、原油、黄金\n- **农产品**：大豆、玉米、棉花\n- **金融期货**：国债期货\n\n## 交易策略\n- 套期保值\n- 投机交易\n- 套利交易\n- 程序化交易\n\n## 风险控制\n- 严格止损\n- 控制仓位\n- 避免逆势\n- 资金管理`,
        duration: 45,
        order: 1,
      },
    ],
  },
  {
    id: 'practical-010',
    title: '外汇交易入门',
    description: '掌握外汇市场基础和主要货币对分析',
    category: 'practical',
    level: 'INTERMEDIATE',
    duration: 140,
    price: 299,
    published: true,
    thumbnail: '/images/courses/forex-trading.jpg',
    lessons: [
      {
        id: 'lesson-prac-010-01',
        title: '外汇市场基础',
        content: `# 外汇市场基础\n\n## 外汇市场特点\n- 全球最大金融市场\n- 24小时交易\n- 高流动性\n- 杠杆交易\n- 双向交易机会\n\n## 主要货币对\n- **欧美(EUR/USD)**：交易量最大\n- **英美(GBP/USD)**：波动较大\n- **美日(USD/JPY)**：亚洲时段活跃\n- **美加(USD/CAD)**：商品货币\n\n## 影响因素\n- 经济数据\n- 央行政策\n- 政治事件\n- 风险情绪\n- 技术面因素\n\n## 交易策略\n- 趋势跟踪\n- 区间交易\n- 新闻交易\n- 套息交易\n\n## 风险管理\n- 合理杠杆\n- 严格止损\n- 分散交易\n- 情绪控制`,
        duration: 35,
        order: 1,
      },
    ],
  },
];

// 汇总所有课程
export const allCourses: Course[] = [
  ...basicCourses,
  ...advancedCourses,
  ...practicalCourses,
];

// 根据分类获取课程
export const getCoursesByCategory = (category: 'basic' | 'advanced' | 'practical') => {
  return allCourses.filter(course => course.category === category);
};

// 根据难度获取课程
export const getCoursesByLevel = (level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => {
  return allCourses.filter(course => course.level === level);
};

// 获取免费课程
export const getFreeCourses = () => {
  return allCourses.filter(course => course.price === 0);
};

// 获取付费课程
export const getPaidCourses = () => {
  return allCourses.filter(course => course.price > 0);
};