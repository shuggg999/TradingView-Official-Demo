"""
Password Security Utilities for SmartFin Technology Platform
Implements password hashing, validation, and strength checking
Based on the security design in docs/specs/user-auth/design.md
"""

from passlib.context import CryptContext
from typing import Dict, List, Tuple
import re


# 密码加密上下文
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto",
    bcrypt__rounds=12  # 成本因子设为12，提供良好的安全性和性能平衡
)


class PasswordValidator:
    """密码验证器 - 检查密码强度和复杂度"""
    
    def __init__(self):
        # 默认密码策略
        self.min_length = 8
        self.max_length = 128
        self.require_uppercase = True
        self.require_lowercase = True
        self.require_numbers = True
        self.require_special_chars = True
        self.special_chars = "!@#$%^&*(),.?\":{}|<>_+-=[]\\;'/`~"
        
        # 常见弱密码模式
        self.forbidden_patterns = [
            'password', '123456', 'qwerty', 'admin', 'user',
            'login', 'welcome', 'letmein', 'abc123', 'master',
            'monkey', 'dragon', 'football', 'baseball', 'iloveyou',
            'trustno1', 'sunshine', 'princess', 'starwars'
        ]
        
        # 键盘模式
        self.keyboard_patterns = [
            'qwertyuiop', 'asdfghjkl', 'zxcvbnm',  # 横向
            'qazwsx', 'wsxedc', 'edcrfv',          # 纵向
            '1qaz2wsx', '2wsx3edc', '3edc4rfv',    # 斜向
            'q1w2e3r4', '1q2w3e4r', 'a1s2d3f4'     # 混合
        ]
    
    def validate_password(self, password: str, username: str = None, email: str = None) -> Dict[str, any]:
        """
        验证密码强度
        
        返回格式：
        {
            "valid": bool,
            "score": int (0-5),
            "errors": List[str],
            "suggestions": List[str]
        }
        """
        errors = []
        suggestions = []
        score = 0
        
        # 基础检查
        if not password:
            errors.append("密码不能为空")
            return {
                "valid": False,
                "score": 0,
                "errors": errors,
                "suggestions": ["请输入密码"]
            }
        
        # 长度检查
        if len(password) < self.min_length:
            errors.append(f"密码长度至少{self.min_length}位")
            suggestions.append(f"请使用至少{self.min_length}个字符")
        elif len(password) > self.max_length:
            errors.append(f"密码长度不能超过{self.max_length}位")
        else:
            score += 1
            if len(password) >= 12:
                score += 1  # 额外奖励长密码
        
        # 字符类型检查
        has_uppercase = bool(re.search(r'[A-Z]', password))
        has_lowercase = bool(re.search(r'[a-z]', password))
        has_numbers = bool(re.search(r'\d', password))
        has_special = bool(re.search(f'[{re.escape(self.special_chars)}]', password))
        
        if self.require_uppercase and not has_uppercase:
            errors.append("密码必须包含大写字母")
            suggestions.append("添加至少一个大写字母(A-Z)")
        elif has_uppercase:
            score += 0.5
        
        if self.require_lowercase and not has_lowercase:
            errors.append("密码必须包含小写字母")
            suggestions.append("添加至少一个小写字母(a-z)")
        elif has_lowercase:
            score += 0.5
        
        if self.require_numbers and not has_numbers:
            errors.append("密码必须包含数字")
            suggestions.append("添加至少一个数字(0-9)")
        elif has_numbers:
            score += 0.5
        
        if self.require_special_chars and not has_special:
            errors.append("密码必须包含特殊字符")
            suggestions.append(f"添加至少一个特殊字符: {self.special_chars[:10]}...")
        elif has_special:
            score += 0.5
        
        # 检查常见弱密码
        password_lower = password.lower()
        for pattern in self.forbidden_patterns:
            if pattern in password_lower:
                errors.append("密码包含常见弱密码模式")
                suggestions.append("避免使用常见词汇或简单模式")
                score = max(0, score - 1)
                break
        
        # 检查键盘模式
        for pattern in self.keyboard_patterns:
            if pattern in password_lower or pattern[::-1] in password_lower:
                errors.append("密码包含键盘顺序模式")
                suggestions.append("避免使用键盘上的连续字符")
                score = max(0, score - 0.5)
                break
        
        # 检查重复字符
        if re.search(r'(.)\1{2,}', password):
            errors.append("密码包含过多重复字符")
            suggestions.append("避免连续使用相同字符超过2次")
            score = max(0, score - 0.5)
        
        # 检查与用户名/邮箱的相似性
        if username and username.lower() in password_lower:
            errors.append("密码不应包含用户名")
            suggestions.append("密码应该独立于用户名")
            score = max(0, score - 1)
        
        if email:
            email_prefix = email.split('@')[0].lower()
            if len(email_prefix) > 3 and email_prefix in password_lower:
                errors.append("密码不应包含邮箱地址")
                suggestions.append("密码应该独立于邮箱")
                score = max(0, score - 1)
        
        # 检查连续数字或字母
        if re.search(r'(012|123|234|345|456|567|678|789|890)', password):
            suggestions.append("避免使用连续的数字序列")
            score = max(0, score - 0.25)
        
        if re.search(r'(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)', password_lower):
            suggestions.append("避免使用连续的字母序列")
            score = max(0, score - 0.25)
        
        # 计算最终分数（0-5）
        score = min(5, max(0, score))
        
        # 根据分数给出强度建议
        if score < 2:
            suggestions.append("密码强度较弱，建议使用密码生成器创建强密码")
        elif score < 3:
            suggestions.append("密码强度一般，可以通过增加长度和复杂度来提升")
        elif score < 4:
            suggestions.append("密码强度良好，继续保持")
        else:
            if not suggestions:
                suggestions.append("密码强度很好！")
        
        return {
            "valid": len(errors) == 0,
            "score": round(score, 1),
            "errors": errors,
            "suggestions": suggestions,
            "strength": self._get_strength_label(score)
        }
    
    def _get_strength_label(self, score: float) -> str:
        """获取密码强度标签"""
        if score < 1:
            return "非常弱"
        elif score < 2:
            return "弱"
        elif score < 3:
            return "一般"
        elif score < 4:
            return "强"
        else:
            return "非常强"
    
    def generate_password_suggestion(self, length: int = 16) -> str:
        """生成密码建议（仅用于展示格式，不是实际密码）"""
        import random
        import string
        
        # 确保包含所有必需的字符类型
        password_chars = []
        
        # 添加必需的字符类型
        if self.require_uppercase:
            password_chars.append(random.choice(string.ascii_uppercase))
        if self.require_lowercase:
            password_chars.append(random.choice(string.ascii_lowercase))
        if self.require_numbers:
            password_chars.append(random.choice(string.digits))
        if self.require_special_chars:
            password_chars.append(random.choice(self.special_chars))
        
        # 填充剩余长度
        all_chars = ""
        if self.require_uppercase:
            all_chars += string.ascii_uppercase
        if self.require_lowercase:
            all_chars += string.ascii_lowercase
        if self.require_numbers:
            all_chars += string.digits
        if self.require_special_chars:
            all_chars += self.special_chars
        
        remaining_length = length - len(password_chars)
        password_chars.extend(random.choices(all_chars, k=remaining_length))
        
        # 打乱顺序
        random.shuffle(password_chars)
        
        return ''.join(password_chars)


# 密码工具函数
def hash_password(password: str) -> str:
    """哈希密码"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def needs_rehash(hashed_password: str) -> bool:
    """检查密码哈希是否需要更新（例如，使用了旧的哈希算法）"""
    return pwd_context.needs_update(hashed_password)


# 创建全局密码验证器实例
password_validator = PasswordValidator()