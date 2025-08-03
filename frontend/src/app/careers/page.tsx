'use client';

import { MapPin, Clock, Users, Briefcase, Heart, Lightbulb, Target, Award, Mail, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const jobOpenings = [
  {
    id: 1,
    title: '高级前端开发工程师',
    department: '技术部',
    location: '北京',
    type: '全职',
    experience: '3-5年',
    salary: '25-40K',
    description: '负责投资教育平台前端开发，使用React、Next.js等现代技术栈',
    requirements: [
      '3年以上前端开发经验',
      '精通React、TypeScript、Next.js',
      '熟悉现代前端工程化工具',
      '有金融或教育产品经验优先'
    ],
    posted: '2025-01-20'
  },
  {
    id: 2,
    title: '投资教育内容专家',
    department: '教育部',
    location: '北京',
    type: '全职',
    experience: '5-8年',
    salary: '30-50K',
    description: '负责投资教育课程设计、内容开发和教学质量管理',
    requirements: [
      '金融、投资相关专业背景',
      'CFA、FRM等专业资格证书',
      '5年以上投资分析或教育经验',
      '优秀的课程设计和表达能力'
    ],
    posted: '2025-01-18'
  },
  {
    id: 3,
    title: '产品经理',
    department: '产品部',
    location: '北京',
    type: '全职',
    experience: '3-5年',
    salary: '25-35K',
    description: '负责在线教育平台产品规划、需求分析和用户体验优化',
    requirements: [
      '3年以上互联网产品经验',
      '有在线教育产品经验优先',
      '优秀的用户体验设计能力',
      '强烈的用户导向思维'
    ],
    posted: '2025-01-15'
  },
  {
    id: 4,
    title: '数据分析师',
    department: '技术部',
    location: '北京/上海',
    type: '全职',
    experience: '2-4年',
    salary: '20-30K',
    description: '负责用户行为分析、学习效果评估和产品数据洞察',
    requirements: [
      '统计学、数学相关专业背景',
      '熟练使用Python、SQL、R等工具',
      '有教育或金融数据分析经验',
      '良好的业务理解和沟通能力'
    ],
    posted: '2025-01-12'
  },
  {
    id: 5,
    title: '用户运营专员',
    department: '运营部',
    location: '北京',
    type: '全职',
    experience: '1-3年',
    salary: '15-25K',
    description: '负责用户社区运营、活动策划和用户增长',
    requirements: [
      '1年以上互联网运营经验',
      '熟悉社区运营和用户增长',
      '优秀的文案策划能力',
      '对教育行业有热情'
    ],
    posted: '2025-01-10'
  },
  {
    id: 6,
    title: 'UI/UX设计师',
    department: '设计部',
    location: '北京',
    type: '全职',
    experience: '3-5年',
    salary: '20-30K',
    description: '负责教育平台界面设计和用户体验优化',
    requirements: [
      '3年以上UI/UX设计经验',
      '熟练使用Figma、Sketch等设计工具',
      '有教育产品设计经验优先',
      '深度理解用户体验设计原则'
    ],
    posted: '2025-01-08'
  }
];

const benefits = [
  {
    icon: Heart,
    title: '健康保障',
    description: '全员五险一金，补充商业医疗保险，年度体检',
    color: 'text-red-600'
  },
  {
    icon: Lightbulb,
    title: '学习成长',
    description: '专业培训机会，技术大会参与，内部分享交流',
    color: 'text-yellow-600'
  },
  {
    icon: Target,
    title: '弹性工作',
    description: '弹性工作时间，远程工作支持，工作生活平衡',
    color: 'text-blue-600'
  },
  {
    icon: Award,
    title: '激励机制',
    description: '绩效奖金，股权激励，年度优秀员工奖励',
    color: 'text-purple-600'
  },
  {
    icon: Users,
    title: '团队文化',
    description: '开放包容的工作环境，定期团建活动',
    color: 'text-green-600'
  },
  {
    icon: Briefcase,
    title: '职业发展',
    description: '清晰的晋升通道，跨部门轮岗机会',
    color: 'text-indigo-600'
  }
];

const departments = [
  { name: '技术部', count: 15, description: '打造最先进的教育技术平台' },
  { name: '教育部', count: 12, description: '开发优质的投资教育内容' },
  { name: '产品部', count: 8, description: '设计极致的用户体验' },
  { name: '运营部', count: 10, description: '连接用户与优质教育资源' },
  { name: '设计部', count: 6, description: '创造美观易用的产品界面' },
  { name: '市场部', count: 8, description: '传播专业的投资教育理念' }
];

export default function CareersPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              加入我们
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              与优秀的团队一起，用科技重新定义投资教育，帮助更多人实现财富增长
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">100+</div>
                <div className="text-sm">优秀员工</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">6</div>
                <div className="text-sm">核心部门</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">15</div>
                <div className="text-sm">在招职位</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">企业文化</h2>
            <p className="text-lg text-gray-600">
              我们相信优秀的产品来自优秀的团队和文化
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">用户至上</h3>
              <p className="text-gray-600">
                始终以用户需求为中心，创造真正有价值的教育产品和服务
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">持续创新</h3>
              <p className="text-gray-600">
                鼓励创新思维，不断探索教育技术和投资教育的前沿发展
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">团队协作</h3>
              <p className="text-gray-600">
                开放透明的沟通，跨部门协作，共同追求卓越的产品和服务
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">员工福利</h2>
            <p className="text-lg text-gray-600">
              我们提供具有竞争力的薪酬福利和成长平台
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100`}>
                      <Icon className={`w-6 h-6 ${benefit.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">团队部门</h2>
            <p className="text-lg text-gray-600">
              多个专业团队协作，打造最优质的教育平台
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{dept.name}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {dept.count}人
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">热招职位</h2>
            <p className="text-lg text-gray-600">
              发现适合您的职业机会，与我们一起成长
            </p>
          </div>

          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div
                key={job.id}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        {job.department}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                  </div>
                  <div className="lg:ml-6">
                    <button className="px-6 py-3 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all font-medium">
                      立即申请
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{job.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">{job.salary}/月</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">任职要求：</h4>
                  <ul className="grid md:grid-cols-2 gap-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-500">发布时间：{job.posted}</span>
                  <div className="flex items-center gap-4">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      查看详情
                    </button>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      投递简历
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">没有找到合适的职位？</p>
            <button className="px-8 py-3 border-2 border-[#002244] text-[#002244] rounded-lg font-semibold hover:bg-[#002244] hover:text-white transition-all">
              发送简历给我们
            </button>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">申请流程</h2>
            <p className="text-lg text-gray-600">
              简单高效的招聘流程，让优秀的您快速加入我们
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">在线申请</h3>
              <p className="text-gray-600 text-sm">
                选择心仪职位，在线提交简历和个人信息
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">简历筛选</h3>
              <p className="text-gray-600 text-sm">
                HR团队将在3个工作日内完成简历初步筛选
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">面试环节</h3>
              <p className="text-gray-600 text-sm">
                1-2轮面试，包括技术面试和文化匹配度评估
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">入职报到</h3>
              <p className="text-gray-600 text-sm">
                确定入职时间，安排入职培训和团队介绍
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Office Environment */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">办公环境</h2>
            <p className="text-lg text-gray-600">
              现代化的办公空间，营造舒适的工作氛围
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Briefcase className="w-16 h-16 mx-auto mb-4" />
                <p>开放式办公区</p>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4" />
                <p>会议室和讨论区</p>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4" />
                <p>休闲娱乐区</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              （实际部署时替换为真实办公环境照片）
            </p>
          </div>
        </div>
      </section>

      {/* Contact HR */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">联系HR</h2>
              <p className="text-lg text-gray-600">
                有任何招聘相关问题，欢迎随时联系我们
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">联系方式</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">hr@smartfin.edu</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">北京市朝阳区金融街88号智慧金融大厦18层</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">工作日 9:00-18:00</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">HR团队</h4>
                  <p className="text-sm text-gray-600">
                    我们的HR团队由经验丰富的招聘专家组成，致力于为每位候选人提供专业的服务。
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">快速咨询</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      咨询内容
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请描述您的问题或需求..."
                    />
                  </div>
                  
                  <button className="w-full py-3 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all font-semibold flex items-center justify-center gap-2">
                    发送咨询
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#002244] text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">准备加入我们了吗？</h2>
          <p className="text-xl text-gray-300 mb-8">
            与优秀的团队一起，重新定义投资教育的未来
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-[#002244] rounded-lg font-semibold hover:bg-gray-100 transition-all">
              查看所有职位
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#002244] transition-all">
              投递简历
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}