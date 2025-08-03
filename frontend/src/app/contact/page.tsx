'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const contactMethods = [
  {
    icon: Mail,
    title: '邮箱联系',
    content: 'support@smartfin.edu',
    description: '工作日24小时内回复',
    action: 'mailto:support@smartfin.edu'
  },
  {
    icon: Phone,
    title: '客服热线',
    content: '400-8888-999',
    description: '工作日 9:00-18:00',
    action: 'tel:400-8888-999'
  },
  {
    icon: MessageCircle,
    title: '在线客服',
    content: '即时聊天支持',
    description: '7x24小时在线服务',
    action: '#'
  },
  {
    icon: MapPin,
    title: '公司地址',
    content: '北京市朝阳区金融街88号',
    description: '智慧金融大厦18层',
    action: '#'
  }
];

const faqs = [
  {
    question: '如何开始学习课程？',
    answer: '注册账户后，您可以免费试听基础课程。完整课程需要购买相应的学习套餐。'
  },
  {
    question: '课程费用是多少？',
    answer: '我们提供灵活的定价方案：基础套餐 $99/季度，专业套餐 $199/季度，VIP一对一指导 $199/小时。'
  },
  {
    question: '模拟交易资金是真实的吗？',
    answer: '模拟交易使用虚拟资金，完全安全。您可以在无风险环境中练习交易技能。'
  },
  {
    question: '是否提供学习证书？',
    answer: '完成相应课程并通过考核后，我们会颁发专业的学习证书。'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('感谢您的留言，我们会尽快回复！');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              联系我们
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              我们致力于为每位用户提供最优质的学习体验和专业服务
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-lg font-medium text-gray-800 mb-2">{method.content}</p>
                  <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                  {method.action !== '#' && (
                    <a
                      href={method.action}
                      className="inline-block px-4 py-2 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all text-sm"
                    >
                      立即联系
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">发送消息</h2>
              <p className="text-lg text-gray-600 mb-8">
                有任何问题或建议，请随时与我们联系。我们会尽快回复您。
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    主题 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择咨询类型</option>
                    <option value="course">课程咨询</option>
                    <option value="technical">技术问题</option>
                    <option value="billing">费用问题</option>
                    <option value="feedback">意见反馈</option>
                    <option value="cooperation">商务合作</option>
                    <option value="other">其他问题</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    详细描述 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="请详细描述您的问题或需求..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#002244] text-white rounded-lg hover:bg-[#001122] transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  发送消息
                </button>
              </form>
            </div>

            {/* Company Info & FAQ */}
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">服务时间</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">客服热线</span>
                    <span className="font-medium">周一至周五 9:00-18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">在线客服</span>
                    <span className="font-medium">7x24小时</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">邮件回复</span>
                    <span className="font-medium">工作日24小时内</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">技术支持</span>
                    <span className="font-medium">周一至周日 10:00-22:00</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">常见问题</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <a
                    href="/help"
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                  >
                    查看更多常见问题 →
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">关注我们</h3>
                <p className="text-gray-600 mb-4">获取最新的投资教育资讯和学习资源</p>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <span className="text-sm font-bold">微</span>
                  </div>
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                    <span className="text-sm font-bold">信</span>
                  </div>
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
                    <span className="text-sm font-bold">博</span>
                  </div>
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                    <span className="text-sm font-bold">抖</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">办公地址</h2>
            <p className="text-lg text-gray-600">
              欢迎莅临我们的办公室进行面对面交流
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">SmartFin Education 总部</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">北京市朝阳区金融街88号智慧金融大厦18层</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">400-8888-999</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">support@smartfin.edu</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">交通指南</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 地铁：1号线金融街站A出口，步行5分钟</li>
                    <li>• 公交：106路、118路金融街站</li>
                    <li>• 自驾：大厦地下有停车场</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>地图加载中...</p>
                  <p className="text-sm">（实际部署时集成地图API）</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#002244] text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">准备开始学习了吗？</h2>
          <p className="text-xl text-gray-300 mb-8">
            立即注册，开始您的专业投资教育之旅
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="px-8 py-4 bg-white text-[#002244] rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              免费注册
            </a>
            <a
              href="/education"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#002244] transition-all"
            >
              查看课程
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}