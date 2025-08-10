import { Metadata } from 'next';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于我们 - 南京量策博智软件开发有限公司',
  description: '了解量策博智的使命、愿景和专业服务',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#000f1e] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            关于量策博智
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            专业的金融科技软件开发与数据分析服务
          </p>
          <p className="text-lg text-gray-300 mt-4">
            南京量策博智软件开发有限公司
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Company Mission */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">我们的使命</h2>
            <p className="text-lg text-gray-600 mb-4">
              南京量策博智软件开发有限公司成立于2024年9月25日，致力于为金融行业提供专业的软件开发和数据分析服务。
              我们专注于金融科技领域，通过技术创新为客户提供高质量的解决方案。
            </p>
            <p className="text-lg text-gray-600">
              我们的目标是成为金融科技领域的专业服务商，为金融机构、投资者和相关企业提供可靠的技术支持和数据服务，
              助力金融行业的数字化转型和发展。
            </p>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">核心价值观</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">专业可靠</h3>
                <p className="text-gray-600">
                  提供准确、及时的金融数据和经过验证的投资知识，确保用户获得最专业的服务。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">用户至上</h3>
                <p className="text-gray-600">
                  始终以用户需求为中心，不断优化产品体验，提供个性化的解决方案。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">持续创新</h3>
                <p className="text-gray-600">
                  紧跟技术发展趋势，不断推出创新功能，为用户创造更大价值。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">透明诚信</h3>
                <p className="text-gray-600">
                  保持信息透明，诚信经营，建立用户信任，共同成长。
                </p>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">公司信息</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <dl className="space-y-4">
                <div>
                  <dt className="font-semibold text-gray-900">成立时间</dt>
                  <dd className="text-gray-600">2024年9月25日</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900">公司性质</dt>
                  <dd className="text-gray-600">金融科技企业</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900">主营业务</dt>
                  <dd className="text-gray-600">金融软件开发、数据分析、技术服务</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-900">服务范围</dt>
                  <dd className="text-gray-600">全球市场</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">我们的团队</h2>
            <p className="text-lg text-gray-600 mb-8">
              量策博智汇聚了来自金融、技术、教育等领域的专业人才，共同致力于为用户提供最优质的服务。
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">技</span>
                </div>
                <h3 className="font-semibold text-gray-900">技术团队</h3>
                <p className="text-sm text-gray-600">负责平台开发与技术创新</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">金</span>
                </div>
                <h3 className="font-semibold text-gray-900">金融团队</h3>
                <p className="text-sm text-gray-600">提供专业的金融分析与内容</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">运</span>
                </div>
                <h3 className="font-semibold text-gray-900">运营团队</h3>
                <p className="text-sm text-gray-600">确保优质的用户服务体验</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">想要了解更多？</h2>
            <p className="text-gray-600 mb-6">
              如果您对我们的平台有任何疑问或建议，欢迎随时联系我们。
            </p>
            <Link
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              联系我们
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}