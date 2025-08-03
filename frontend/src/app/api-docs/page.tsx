'use client';

import { useState } from 'react';
import { Code, Book, Key, Shield, Zap, Globe, Copy, Check, ExternalLink, ChevronRight, ChevronDown, MessageCircle } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const apiEndpoints = [
  {
    category: '用户认证',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: '用户注册',
        params: ['email', 'password', 'name'],
        response: '{ "token": "jwt_token", "user": {...} }'
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: '用户登录',
        params: ['email', 'password'],
        response: '{ "token": "jwt_token", "user": {...} }'
      },
      {
        method: 'POST',
        path: '/api/auth/refresh',
        description: '刷新访问令牌',
        params: ['refresh_token'],
        response: '{ "access_token": "new_token" }'
      }
    ]
  },
  {
    category: '用户管理',
    endpoints: [
      {
        method: 'GET',
        path: '/api/users/profile',
        description: '获取用户资料',
        params: [],
        response: '{ "id": 1, "name": "用户名", "email": "...", "avatar": "..." }'
      },
      {
        method: 'PUT',
        path: '/api/users/profile',
        description: '更新用户资料',
        params: ['name', 'avatar', 'bio'],
        response: '{ "success": true, "user": {...} }'
      },
      {
        method: 'GET',
        path: '/api/users/progress',
        description: '获取学习进度',
        params: [],
        response: '{ "courses": [...], "completion_rate": 75 }'
      }
    ]
  },
  {
    category: '课程管理',
    endpoints: [
      {
        method: 'GET',
        path: '/api/courses',
        description: '获取课程列表',
        params: ['page', 'limit', 'category'],
        response: '{ "courses": [...], "total": 100, "page": 1 }'
      },
      {
        method: 'GET',
        path: '/api/courses/{id}',
        description: '获取课程详情',
        params: [],
        response: '{ "id": 1, "title": "...", "lessons": [...] }'
      },
      {
        method: 'POST',
        path: '/api/courses/{id}/enroll',
        description: '报名课程',
        params: [],
        response: '{ "success": true, "enrollment_id": 123 }'
      }
    ]
  },
  {
    category: '市场数据',
    endpoints: [
      {
        method: 'GET',
        path: '/api/market/quotes',
        description: '获取实时行情',
        params: ['symbols', 'interval'],
        response: '{ "data": [{"symbol": "AAPL", "price": 150.25, ...}] }'
      },
      {
        method: 'GET',
        path: '/api/market/history',
        description: '获取历史数据',
        params: ['symbol', 'from', 'to', 'interval'],
        response: '{ "symbol": "AAPL", "data": [{"time": "...", "open": 150, ...}] }'
      },
      {
        method: 'GET',
        path: '/api/market/search',
        description: '搜索证券',
        params: ['query', 'type'],
        response: '{ "results": [{"symbol": "AAPL", "name": "Apple Inc.", ...}] }'
      }
    ]
  },
  {
    category: '模拟交易',
    endpoints: [
      {
        method: 'GET',
        path: '/api/trading/portfolio',
        description: '获取投资组合',
        params: [],
        response: '{ "cash": 50000, "positions": [...], "total_value": 55000 }'
      },
      {
        method: 'POST',
        path: '/api/trading/orders',
        description: '下单交易',
        params: ['symbol', 'quantity', 'side', 'type'],
        response: '{ "order_id": 123, "status": "filled", "price": 150.25 }'
      },
      {
        method: 'GET',
        path: '/api/trading/orders',
        description: '获取订单历史',
        params: ['page', 'limit'],
        response: '{ "orders": [...], "total": 50 }'
      }
    ]
  }
];

const sdkExamples = [
  {
    language: 'JavaScript',
    code: `// 安装 SDK
npm install @smartfin/api-client

// 初始化客户端
import { SmartFinAPI } from '@smartfin/api-client';

const client = new SmartFinAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.smartfin.edu'
});

// 获取用户资料
const profile = await client.users.getProfile();
console.log(profile);

// 获取课程列表
const courses = await client.courses.list({
  category: 'technical-analysis',
  limit: 10
});`
  },
  {
    language: 'Python',
    code: `# 安装 SDK
pip install smartfin-api

# 初始化客户端
from smartfin_api import SmartFinAPI

client = SmartFinAPI(
    api_key='your-api-key',
    base_url='https://api.smartfin.edu'
)

# 获取用户资料
profile = client.users.get_profile()
print(profile)

# 获取市场数据
quotes = client.market.get_quotes(['AAPL', 'GOOGL'])
print(quotes)`
  },
  {
    language: 'cURL',
    code: `# 获取用户资料
curl -X GET "https://api.smartfin.edu/api/users/profile" \\
  -H "Authorization: Bearer your-jwt-token" \\
  -H "Content-Type: application/json"

# 获取课程列表
curl -X GET "https://api.smartfin.edu/api/courses?category=technical-analysis&limit=10" \\
  -H "Authorization: Bearer your-jwt-token"

# 下单交易
curl -X POST "https://api.smartfin.edu/api/trading/orders" \\
  -H "Authorization: Bearer your-jwt-token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "symbol": "AAPL",
    "quantity": 100,
    "side": "buy",
    "type": "market"
  }'`
  }
];

const rateLimits = [
  { plan: '免费版', requests: '100 requests/hour', concurrent: '5 concurrent', websocket: '1 connection' },
  { plan: '基础版', requests: '1,000 requests/hour', concurrent: '10 concurrent', websocket: '3 connections' },
  { plan: '专业版', requests: '10,000 requests/hour', concurrent: '50 concurrent', websocket: '10 connections' },
  { plan: '企业版', requests: 'Unlimited', concurrent: 'Unlimited', websocket: 'Unlimited' }
];

export default function ApiDocsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#002244] to-[#003366] text-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              API 文档
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              强大的RESTful API，让您轻松集成SmartFin的投资教育和市场数据服务
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">RESTful</div>
                <div className="text-sm">标准API设计</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">99.9%</div>
                <div className="text-sm">服务可用性</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">24/7</div>
                <div className="text-sm">技术支持</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">快速开始</h2>
            <p className="text-lg text-gray-600">
              3分钟完成API集成，立即开始使用我们的服务
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. 获取API密钥</h3>
              <p className="text-gray-600 mb-4">
                在开发者控制台创建应用并获取您的API密钥
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                创建密钥
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Code className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. 安装SDK</h3>
              <p className="text-gray-600 mb-4">
                选择您喜欢的编程语言，安装对应的SDK
              </p>
              <div className="space-y-2">
                <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                  npm install @smartfin/api
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. 发起请求</h3>
              <p className="text-gray-600 mb-4">
                使用API密钥认证，开始调用我们的服务
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
                查看示例
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API 参考</h2>
            <p className="text-lg text-gray-600">
              完整的API端点文档和参数说明
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories */}
            <div className="lg:col-span-1">
              <div className="space-y-2">
                {apiEndpoints.map((category, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedCategory === category.category
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCategory(category.category)}
                  >
                    <h3 className="font-medium">{category.category}</h3>
                    <p className="text-sm text-gray-500">{category.endpoints.length} 个端点</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Endpoints */}
            <div className="lg:col-span-3">
              {selectedCategory ? (
                <div className="space-y-6">
                  {apiEndpoints
                    .find(cat => cat.category === selectedCategory)
                    ?.endpoints.map((endpoint, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <span className={`px-3 py-1 rounded text-sm font-medium ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                            endpoint.method === 'PUT' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {endpoint.method}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-mono text-lg text-gray-900 mb-2">
                              {endpoint.path}
                            </h4>
                            <p className="text-gray-600 mb-4">{endpoint.description}</p>
                            
                            {endpoint.params.length > 0 && (
                              <div className="mb-4">
                                <h5 className="font-medium text-gray-900 mb-2">参数:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {endpoint.params.map((param, paramIndex) => (
                                    <span
                                      key={paramIndex}
                                      className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded font-mono"
                                    >
                                      {param}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">响应示例:</h5>
                              <div className="relative">
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
                                  {endpoint.response}
                                </pre>
                                <button
                                  onClick={() => copyToClipboard(endpoint.response, `endpoint-${index}`)}
                                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white"
                                >
                                  {copiedCode === `endpoint-${index}` ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">选择API分类</h3>
                  <p className="text-gray-600">
                    点击左侧的分类查看对应的API端点文档
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SDK Examples */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">SDK 示例</h2>
            <p className="text-lg text-gray-600">
              多种编程语言的SDK，简化您的开发流程
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                {sdkExamples.map((example) => (
                  <button
                    key={example.language}
                    className={`px-6 py-4 font-medium transition-all ${
                      selectedLanguage === example.language
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setSelectedLanguage(example.language)}
                  >
                    {example.language}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {sdkExamples.map((example) => (
                selectedLanguage === example.language && (
                  <div key={example.language} className="relative">
                    <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(example.code, example.language)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-gray-800 rounded"
                    >
                      {copiedCode === example.language ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Authentication & Rate Limits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Authentication */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">身份认证</h2>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">JWT Token</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    使用JWT（JSON Web Token）进行API认证。获取token后，在请求头中添加Authorization字段。
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                    Authorization: Bearer your-jwt-token
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Key className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">API Key</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    对于服务端应用，可以使用API Key进行认证。请妥善保管您的密钥。
                  </p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                    X-API-Key: your-api-key
                  </div>
                </div>
              </div>
            </div>

            {/* Rate Limits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">限流规则</h2>
              <div className="space-y-4">
                {rateLimits.map((limit, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{limit.plan}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        index === 0 ? 'bg-gray-100 text-gray-700' :
                        index === 1 ? 'bg-blue-100 text-blue-700' :
                        index === 2 ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {index === 0 ? '免费' : index === 3 ? '企业' : '付费'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">请求限制</span>
                        <span className="font-medium">{limit.requests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">并发连接</span>
                        <span className="font-medium">{limit.concurrent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">WebSocket</span>
                        <span className="font-medium">{limit.websocket}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Codes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">错误代码</h2>
            <p className="text-lg text-gray-600">
              API可能返回的错误代码和处理建议
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg text-gray-900 mb-2">200 OK</h3>
              <p className="text-gray-600 text-sm">请求成功</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-l-4 border-yellow-500">
              <h3 className="font-bold text-lg text-gray-900 mb-2">400 Bad Request</h3>
              <p className="text-gray-600 text-sm">请求参数错误</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
              <h3 className="font-bold text-lg text-gray-900 mb-2">401 Unauthorized</h3>
              <p className="text-gray-600 text-sm">认证失败</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg text-gray-900 mb-2">429 Too Many Requests</h3>
              <p className="text-gray-600 text-sm">请求频率超限</p>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">错误响应格式</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
{`{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "参数 'symbol' 是必填项",
    "details": {
      "field": "symbol",
      "value": null
    },
    "timestamp": "2025-01-25T10:30:00Z",
    "request_id": "req_123456789"
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">需要帮助？</h2>
          <p className="text-xl text-gray-600 mb-8">
            我们的技术团队随时为您提供专业的API支持
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <Book className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">开发者指南</h3>
              <p className="text-gray-600 text-sm mb-4">详细的集成教程和最佳实践</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                查看指南 →
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <Globe className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">在线测试</h3>
              <p className="text-gray-600 text-sm mb-4">在浏览器中直接测试API接口</p>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                立即测试 →
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">技术支持</h3>
              <p className="text-gray-600 text-sm mb-4">7x24小时技术支持服务</p>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                联系我们 →
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}