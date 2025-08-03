import { FileText, AlertTriangle, Scale, UserCheck, Shield, CreditCard } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

export default function TermsPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              服务条款
            </h1>
            <p className="text-xl text-gray-200 mb-4">
              使用SmartFin Education Platform的条款和条件
            </p>
            <p className="text-sm text-gray-300">
              最后更新：2025年1月1日 | 生效日期：2025年1月1日
            </p>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Scale className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">公平条款</h3>
              <p className="text-gray-600">明确双方权利义务，确保公平合理的服务关系</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">用户权益</h3>
              <p className="text-gray-600">充分保障用户在学习过程中的各项合法权益</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">责任明确</h3>
              <p className="text-gray-600">清楚界定服务范围和责任限制，避免纠纷</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-12">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-900">重要提示</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                请仔细阅读本服务条款。使用SmartFin Education Platform的服务即表示您同意遵守本条款。
                如果您不同意本条款的任何部分，请不要使用我们的服务。
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. 定义和解释</h2>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  本条款中使用的术语定义如下：
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-gray-900">"我们"、"平台"</strong>：指SmartFin Education Platform及其运营方
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-gray-900">"您"、"用户"</strong>：指使用我们服务的个人或实体
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-gray-900">"服务"</strong>：指我们提供的在线教育平台、课程内容、工具和相关功能
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <strong className="text-gray-900">"内容"</strong>：指平台上的所有文字、图像、视频、音频、软件等材料
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. 服务提供</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2.1 教育服务</h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>课程内容</strong>：提供投资和技术分析相关的系统化课程</li>
                  <li>• <strong>实战训练</strong>：模拟交易环境和技能练习工具</li>
                  <li>• <strong>学习社区</strong>：用户交流讨论和专家指导平台</li>
                  <li>• <strong>学习跟踪</strong>：个性化学习进度管理和成果评估</li>
                  <li>• <strong>技术支持</strong>：平台使用指导和技术问题解答</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">2.2 服务等级</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">免费服务</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 基础课程试听</li>
                    <li>• 社区基础功能</li>
                    <li>• 基本学习工具</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">付费服务</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 完整课程体系</li>
                    <li>• 高级学习工具</li>
                    <li>• 专业指导服务</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">VIP服务</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 一对一指导</li>
                    <li>• 优先技术支持</li>
                    <li>• 专属学习资源</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. 用户权利与义务</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3.1 用户权利</h3>
                  <div className="bg-green-50 rounded-lg p-6">
                    <ul className="space-y-2 text-gray-700">
                      <li>• 享受约定的教育服务</li>
                      <li>• 获得学习进度和成果反馈</li>
                      <li>• 参与社区讨论和交流</li>
                      <li>• 保护个人信息和隐私</li>
                      <li>• 合理投诉和建议反馈</li>
                      <li>• 在法律允许范围内退款</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3.2 用户义务</h3>
                  <div className="bg-red-50 rounded-lg p-6">
                    <ul className="space-y-2 text-gray-700">
                      <li>• 提供真实准确的注册信息</li>
                      <li>• 妥善保管账户和密码</li>
                      <li>• 遵守平台使用规则</li>
                      <li>• 尊重他人权益和知识产权</li>
                      <li>• 按时支付服务费用</li>
                      <li>• 不得从事违法违规活动</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. 付费服务与退款</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">4.1 收费标准</h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">$99</div>
                    <div className="font-medium text-gray-900">基础套餐</div>
                    <div className="text-sm text-gray-600">每季度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">$199</div>
                    <div className="font-medium text-gray-900">专业套餐</div>
                    <div className="text-sm text-gray-600">每季度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">$199</div>
                    <div className="font-medium text-gray-900">VIP指导</div>
                    <div className="text-sm text-gray-600">每小时</div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">4.2 退款政策</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">7天无理由退款</h4>
                  <p className="text-gray-700 text-sm">
                    购买付费服务后7天内，如未开始学习课程内容，可申请无理由退款。
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">30天学习保障</h4>
                  <p className="text-gray-700 text-sm">
                    如对课程内容不满意，可在30天内申请退款（已学习部分按比例扣除）。
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-6">
                  <h4 className="font-semibold text-gray-900 mb-2">技术问题退款</h4>
                  <p className="text-gray-700 text-sm">
                    因平台技术问题导致无法正常使用服务的，可申请相应的退款或补偿。
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. 知识产权</h2>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">5.1 平台内容版权</h3>
                <p className="text-gray-700 mb-4">
                  平台上的所有原创内容，包括但不限于课程材料、文字、图像、视频、音频、软件代码等，
                  均为我们所有或经授权使用，受知识产权法保护。
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• 用户仅可在个人学习目的下使用平台内容</li>
                  <li>• 禁止复制、修改、分发或商业利用平台内容</li>
                  <li>• 禁止破解、逆向工程或其他侵权行为</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">5.2 用户生成内容</h3>
                <p className="text-gray-700 mb-4">
                  用户在平台上发布的原创内容（如讨论、评论、作品等）的知识产权归用户所有，
                  但用户授予我们在平台运营必要范围内使用的权利。
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• 用户保证发布内容不侵犯他人权益</li>
                  <li>• 平台有权审核和管理用户发布的内容</li>
                  <li>• 违规内容将被删除，严重者可能被封禁账户</li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. 免责声明</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">重要提示</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  我们提供的是教育服务，旨在提升用户的投资知识和技能。
                  投资活动本身存在风险，用户应当理性投资，风险自担。
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">教育性质</h4>
                      <p className="text-sm text-gray-700">
                        平台内容仅供教育学习使用，不构成投资建议或保证收益承诺
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">风险提示</h4>
                      <p className="text-sm text-gray-700">
                        投资有风险，入市需谨慎。用户应根据自身情况做出独立投资决策
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">技术限制</h4>
                      <p className="text-sm text-gray-700">
                        我们会尽力保证服务稳定，但不能保证完全无中断或无错误
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. 责任限制</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">7.1 直接损失</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    除法律明确规定外，我们对因使用或无法使用服务而导致的任何直接损失的责任，
                    不超过用户已支付的服务费用总额。
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">7.2 间接损失</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    我们不对任何间接损失承担责任，包括但不限于利润损失、商誉损害、
                    数据丢失或其他无形损失。
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">7.3 第三方责任</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    对于第三方服务（如支付处理、云服务等）的中断或故障，
                    我们会协助解决但不承担最终责任。
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. 服务终止</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">8.1 用户主动终止</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 可随时注销账户并停止使用服务</li>
                    <li>• 注销前请备份重要数据</li>
                    <li>• 已购买的服务在有效期内仍可使用</li>
                    <li>• 符合退款条件的可申请退款</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">8.2 平台终止服务</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• 用户严重违反条款的，立即终止</li>
                    <li>• 用户长期不活跃的，可终止服务</li>
                    <li>• 平台停止运营的，提前通知用户</li>
                    <li>• 会合理处理用户的已付费服务</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. 争议解决</h2>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">解决途径</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-medium text-gray-900">友好协商</h4>
                      <p className="text-sm text-gray-700">
                        首先通过平台客服或邮件联系，寻求友好协商解决
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-medium text-gray-900">第三方调解</h4>
                      <p className="text-sm text-gray-700">
                        协商不成的，可申请相关行业协会或消费者保护组织调解
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-medium text-gray-900">法律程序</h4>
                      <p className="text-sm text-gray-700">
                        调解无效的，向有管辖权的人民法院提起诉讼
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 10 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">10. 其他条款</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">10.1 条款修订</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    我们保留随时修订本条款的权利。重大修订将提前30天通知用户。
                    继续使用服务即视为接受修订后的条款。
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">10.2 可分割性</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    如本条款的任何条文被认定无效或不可执行，其余条文仍然有效。
                    无效条文将被替换为最接近原意图的有效条文。
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">10.3 适用法律</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    本条款受中华人民共和国法律管辖。条款的解释、效力和执行均适用中国法律。
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">10.4 语言版本</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    本条款以中文为准。如有其他语言版本，在发生歧义时以中文版本为准。
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">联系我们</h2>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  如果您对本服务条款有任何疑问或需要帮助，请联系我们：
                </p>
                
                <div className="space-y-2 text-gray-700">
                  <div>邮箱：legal@smartfin.edu</div>
                  <div>客服热线：400-8888-999</div>
                  <div>地址：北京市朝阳区金融街88号智慧金融大厦18层</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">准备开始学习了吗？</h2>
          <p className="text-xl text-gray-600 mb-8">
            同意服务条款，立即开始您的投资教育之旅
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="px-8 py-4 bg-[#002244] text-white rounded-lg font-semibold hover:bg-[#001122] transition-all"
            >
              同意并注册
            </a>
            <a
              href="/contact"
              className="px-8 py-4 border-2 border-[#002244] text-[#002244] rounded-lg font-semibold hover:bg-[#002244] hover:text-white transition-all"
            >
              有疑问？联系我们
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}