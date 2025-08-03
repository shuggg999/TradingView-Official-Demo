import { z } from 'zod'

// 用户相关验证
export const registerSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要8个字符').max(100, '密码过长'),
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名过长').optional(),
})

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名过长').optional(),
  avatar: z.string().url('请输入有效的头像URL').optional(),
})

// 市场数据验证
export const symbolParamsSchema = z.object({
  symbol: z.string().min(1, '股票代码不能为空').max(20, '股票代码过长'),
})

export const marketHistoryQuerySchema = z.object({
  interval: z.enum(['1m', '5m', '15m', '1h', '4h', '1d', '1w']).default('1d'),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  limit: z.coerce.number().min(1).max(1000).default(100),
})

export const marketSearchQuerySchema = z.object({
  q: z.string().min(1, '搜索关键词不能为空').max(50, '搜索关键词过长'),
  type: z.enum(['STOCK', 'CRYPTO', 'FOREX', 'INDEX', 'COMMODITY']).optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
})

// 教育内容验证
export const courseQuerySchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
})

export const updateProgressSchema = z.object({
  courseId: z.string().cuid('无效的课程ID'),
  progress: z.number().min(0).max(100),
  completed: z.boolean().optional(),
})

// 观察列表验证
export const createWatchlistSchema = z.object({
  name: z.string().min(1, '观察列表名称不能为空').max(50, '名称过长'),
  description: z.string().max(200, '描述过长').optional(),
  symbols: z.array(z.string()).max(50, '最多只能添加50个股票').optional(),
})

export const updateWatchlistSchema = z.object({
  name: z.string().min(1, '观察列表名称不能为空').max(50, '名称过长').optional(),
  description: z.string().max(200, '描述过长').optional(),
})

export const addToWatchlistSchema = z.object({
  symbolId: z.string().cuid('无效的股票ID'),
  notes: z.string().max(200, '备注过长').optional(),
})

// API密钥验证
export const createApiKeySchema = z.object({
  name: z.string().min(1, 'API密钥名称不能为空').max(50, '名称过长'),
  permissions: z.array(z.enum(['MARKET_DATA_READ', 'USER_DATA_READ', 'USER_DATA_WRITE', 'ADMIN_ACCESS'])),
  rateLimit: z.number().min(100).max(10000).default(1000),
})

// 分页验证
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

// 管理员验证
export const createCourseSchema = z.object({
  title: z.string().min(1, '课程标题不能为空').max(200, '标题过长'),
  slug: z.string().min(1, 'URL别名不能为空').max(100, 'URL别名过长'),
  description: z.string().max(500, '描述过长').optional(),
  content: z.string().min(1, '课程内容不能为空'),
  excerpt: z.string().max(300, '摘要过长').optional(),
  categoryId: z.string().cuid('无效的分类ID'),
  tags: z.array(z.string()).optional(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  duration: z.number().min(1).max(1000).optional(),
  order: z.number().min(0).default(0),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(100, 'SEO标题过长').optional(),
  metaDescription: z.string().max(200, 'SEO描述过长').optional(),
})

export const updateCourseSchema = createCourseSchema.partial()

// 类型导出
export type RegisterData = z.infer<typeof registerSchema>
export type LoginData = z.infer<typeof loginSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>
export type MarketHistoryQuery = z.infer<typeof marketHistoryQuerySchema>
export type MarketSearchQuery = z.infer<typeof marketSearchQuerySchema>
export type CourseQuery = z.infer<typeof courseQuerySchema>
export type UpdateProgressData = z.infer<typeof updateProgressSchema>
export type CreateWatchlistData = z.infer<typeof createWatchlistSchema>
export type UpdateWatchlistData = z.infer<typeof updateWatchlistSchema>
export type AddToWatchlistData = z.infer<typeof addToWatchlistSchema>
export type CreateApiKeyData = z.infer<typeof createApiKeySchema>
export type PaginationQuery = z.infer<typeof paginationSchema>
export type CreateCourseData = z.infer<typeof createCourseSchema>
export type UpdateCourseData = z.infer<typeof updateCourseSchema>