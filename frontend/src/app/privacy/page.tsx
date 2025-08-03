import { Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              隐私政策
            </h1>
            <p className="text-xl text-gray-200 mb-4">
              我们致力于保护您的个人信息和隐私权
            </p>
            <p className="text-sm text-gray-300">
              最后更新：2025年1月1日 | 生效日期：2025年1月1日
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">数据保护</h3>
              <p className="text-gray-600">采用业界标准的加密技术保护您的个人数据安全</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">用户控制</h3>
              <p className="text-gray-600">您完全控制自己的个人信息，可随时查看、修改或删除</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">透明度</h3>
              <p className="text-gray-600">清楚说明我们如何收集、使用和共享您的信息</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Section 1 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. 概述</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  SmartFin Education Platform（"我们"、"平台"）尊重并保护用户（"您"）的隐私权。
                  本隐私政策说明了我们如何收集、使用、存储和共享您的个人信息，以及您对这些信息享有的权利。
                </p>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>使用我们的服务即表示您同意本隐私政策。如果您不同意本政策的任何部分，请不要使用我们的服务。</p>
                <p>我们可能会不时更新本隐私政策。任何重大变更都会通过适当方式通知您。</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. 我们收集的信息</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2.1 您主动提供的信息</h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>账户信息</strong>：用户名、密码、邮箱地址</li>
                  <li>• <strong>个人资料</strong>：姓名、头像、个人简介</li>
                  <li>• <strong>学习偏好</strong>：课程选择、学习进度、测试结果</li>
                  <li>• <strong>支付信息</strong>：通过第三方支付处理，我们不存储完整的支付卡信息</li>
                  <li>• <strong>沟通记录</strong>：客服咨询、反馈建议、社区发言</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">2.2 自动收集的信息</h3>
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>技术信息</strong>：IP地址、设备类型、操作系统、浏览器类型</li>
                  <li>• <strong>使用数据</strong>：页面访问、功能使用、学习时长、操作记录</li>
                  <li>• <strong>性能数据</strong>：页面加载时间、错误日志、崩溃报告</li>
                  <li>• <strong>位置信息</strong>：基于IP的大致地理位置（不精确定位）</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">2.3 第三方来源的信息</h3>
              <div className="bg-purple-50 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>社交媒体登录</strong>：如果您选择使用社交媒体账户登录，我们会收集基本的公开资料信息</li>
                  <li>• <strong>推荐来源</strong>：如果您是通过他人推荐注册，我们会记录推荐关系</li>
                  <li>• <strong>第三方集成</strong>：与我们合作的教育机构或内容提供商可能共享的相关信息</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. 信息使用方式</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">服务提供</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 创建和管理您的账户</li>
                    <li>• 提供个性化的学习体验</li>
                    <li>• 跟踪学习进度和成果</li>
                    <li>• 处理支付和交易</li>
                    <li>• 提供客户支持服务</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">服务改进</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 分析使用模式和偏好</li>
                    <li>• 优化平台性能和功能</li>
                    <li>• 开发新的教育内容</li>
                    <li>• 改进用户界面和体验</li>
                    <li>• 进行安全监控和保护</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">沟通联系</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 发送重要的服务通知</li>
                    <li>• 提供技术支持和帮助</li>
                    <li>• 分享教育资源和更新</li>
                    <li>• 征求反馈和建议</li>
                    <li>• 发送营销信息（可选）</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">法律合规</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 遵守适用的法律法规</li>
                    <li>• 配合执法部门的合法要求</li>
                    <li>• 保护平台和用户的安全</li>
                    <li>• 防止欺诈和滥用行为</li>
                    <li>• 履行合同义务</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. 信息共享和披露</h2>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">重要承诺</h3>
                <p className="text-gray-700">
                  我们不会出售、出租或以其他方式商业化您的个人信息。我们只在以下明确情况下共享您的信息：
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">服务提供商</h4>
                  <p className="text-gray-700 text-sm">
                    与可信的第三方服务提供商共享必要信息以提供服务（如云存储、支付处理、邮件发送等）。
                    这些提供商受到严格的保密协议约束。
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">法律要求</h4>
                  <p className="text-gray-700 text-sm">
                    当法律要求或为了保护我们的权利、财产或安全，以及保护用户或公众的权利、财产或安全时，
                    我们可能会披露您的信息。
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">业务转让</h4>
                  <p className="text-gray-700 text-sm">
                    在合并、收购或资产出售的情况下，您的信息可能会转移。我们会在此类转移发生前通知您，
                    并确保您的信息仍受隐私政策保护。
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">用户同意</h4>
                  <p className="text-gray-700 text-sm">
                    在获得您明确同意的情况下，我们可能会与其他方共享您的信息。您可以随时撤回这种同意。
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. 您的权利和选择</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">访问和更新</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 查看您的个人信息</li>
                    <li>• 更新或纠正不准确的信息</li>
                    <li>• 下载您的数据副本</li>
                    <li>• 查看数据处理历史</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">控制和删除</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 删除您的账户和数据</li>
                    <li>• 限制某些数据处理</li>
                    <li>• 反对特定的数据使用</li>
                    <li>• 撤回之前给予的同意</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">通信偏好</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 选择接收的邮件类型</li>
                    <li>• 设置通知频率</li>
                    <li>• 退订营销邮件</li>
                    <li>• 管理推送通知</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">隐私设置</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 控制个人资料的可见性</li>
                    <li>• 管理学习数据的使用</li>
                    <li>• 设置cookie偏好</li>
                    <li>• 配置分析跟踪</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. 数据安全</h2>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed">
                  我们采用行业标准的技术和管理措施来保护您的个人信息安全，防止未经授权的访问、使用、修改或披露。
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">加密保护</h4>
                  <p className="text-sm text-gray-600">使用SSL/TLS加密传输，AES-256加密存储</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">访问控制</h4>
                  <p className="text-sm text-gray-600">严格的身份验证和权限管理</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">监控审计</h4>
                  <p className="text-sm text-gray-600">7x24小时安全监控和定期安全审计</p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Cookie和跟踪技术</h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">我们使用的技术</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  我们使用cookies、像素标签和类似技术来改善您的体验、提供个性化内容、分析网站使用情况和投放相关广告。
                  您可以通过浏览器设置控制cookies的使用。
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">必要的Cookies</h4>
                    <p className="text-sm text-gray-600">用于网站基本功能，如身份验证和安全性</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">功能性Cookies</h4>
                    <p className="text-sm text-gray-600">记住您的偏好设置和个性化选择</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">分析性Cookies</h4>
                    <p className="text-sm text-gray-600">帮助我们了解网站使用情况并改进服务</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">营销Cookies</h4>
                    <p className="text-sm text-gray-600">用于投放相关的个性化广告（可选）</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. 数据保留</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们只在必要的时间内保留您的个人信息，具体保留期限取决于信息类型和使用目的：
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-900 font-medium">账户信息</span>
                    <span className="text-gray-600">账户活跃期间 + 3年</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-900 font-medium">学习记录</span>
                    <span className="text-gray-600">账户活跃期间 + 5年</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-900 font-medium">交易记录</span>
                    <span className="text-gray-600">7年（法律要求）</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-900 font-medium">技术日志</span>
                    <span className="text-gray-600">12个月</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-900 font-medium">营销数据</span>
                    <span className="text-gray-600">3年或直到您撤回同意</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. 国际数据传输</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  您的信息可能会被传输到、存储在或处理于您所在国家/地区以外的地方。
                  我们会采取适当措施确保您的数据在国际传输中得到充分保护，包括使用标准合同条款、
                  获得充分性认定或其他法律认可的保护措施。
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">10. 儿童隐私</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  我们的服务主要面向成年用户。我们不会故意收集13岁以下儿童的个人信息。
                  如果您是13-18岁的未成年人，请在父母或监护人的指导下使用我们的服务。
                  如果我们发现已收集了儿童的个人信息，我们会尽快删除这些信息。
                </p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">11. 联系我们</h2>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  如果您对本隐私政策有任何问题、意见或需要行使您的权利，请通过以下方式联系我们：
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">邮箱：privacy@smartfin.edu</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">数据保护官：dpo@smartfin.edu</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">地址：北京市朝阳区金融街88号智慧金融大厦18层</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mt-4">
                  我们会在收到您的请求后30天内回复。对于复杂的请求，我们可能需要额外的时间，但会及时告知您。
                </p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">12. 政策更新</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  我们可能会不时更新本隐私政策以反映我们的做法变化或法律要求。
                  重大变更将通过以下方式通知您：
                </p>
                
                <ul className="space-y-2 text-sm">
                  <li>• 在网站上发布显著通知</li>
                  <li>• 发送邮件通知（如果您已提供邮箱地址）</li>
                  <li>• 在应用内推送通知</li>
                  <li>• 要求您重新确认同意（如适用）</li>
                </ul>
                
                <p>
                  我们建议您定期查看本隐私政策以了解最新信息。继续使用我们的服务即表示您接受更新后的政策。
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">还有问题？</h2>
          <p className="text-xl text-gray-600 mb-8">
            我们的隐私保护团队随时为您提供帮助
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-[#002244] text-white rounded-lg font-semibold hover:bg-[#001122] transition-all"
            >
              联系我们
            </a>
            <a
              href="/help"
              className="px-8 py-4 border-2 border-[#002244] text-[#002244] rounded-lg font-semibold hover:bg-[#002244] hover:text-white transition-all"
            >
              查看帮助中心
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}