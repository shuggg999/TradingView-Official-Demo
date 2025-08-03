"""Create theme system tables

Revision ID: cfb1f7182797
Revises: c155ced19f82
Create Date: 2025-01-26 15:30:00.000000

"""
from typing import Sequence, Union
from datetime import datetime

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'cfb1f7182797'
down_revision: Union[str, None] = '4d052f489a02'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create theme system tables."""
    
    # 创建主题配置表
    op.create_table('theme_configurations',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('display_name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('color_scheme', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('style_config', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_default', sa.Boolean(), nullable=True, default=False),
        sa.Column('sort_order', sa.Integer(), nullable=True, default=0),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # 创建用户主题偏好表
    op.create_table('user_theme_preferences',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('theme_id', sa.String(length=50), nullable=False, default='light'),
        sa.Column('auto_switch', sa.Boolean(), nullable=True, default=False),
        sa.Column('light_start_time', sa.Time(), nullable=True, default=sa.text("'06:00:00'")),
        sa.Column('dark_start_time', sa.Time(), nullable=True, default=sa.text("'18:00:00'")),
        sa.Column('follow_system', sa.Boolean(), nullable=True, default=True),
        sa.Column('custom_settings', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['theme_id'], ['theme_configurations.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    
    # 创建索引
    op.create_index('idx_user_theme_preferences_user_id', 'user_theme_preferences', ['user_id'])
    op.create_index('idx_user_theme_preferences_theme_id', 'user_theme_preferences', ['theme_id'])
    op.create_index('idx_theme_configurations_active', 'theme_configurations', ['is_active'])
    op.create_index('idx_theme_configurations_sort_order', 'theme_configurations', ['sort_order'])
    
    # 插入默认主题配置
    theme_configurations = sa.table('theme_configurations',
        sa.column('id', sa.String),
        sa.column('name', sa.String),
        sa.column('display_name', sa.String),
        sa.column('description', sa.String),
        sa.column('color_scheme', postgresql.JSONB),
        sa.column('style_config', postgresql.JSONB),
        sa.column('is_active', sa.Boolean),
        sa.column('is_default', sa.Boolean),
        sa.column('sort_order', sa.Integer)
    )
    
    # 专业白色主题
    light_theme_colors = {
        "primary": "#003366",
        "primaryHover": "#004080",
        "secondary": "#0066CC",
        "background": "#FFFFFF",
        "surface": "#F8F9FA",
        "card": "#FFFFFF",
        "textPrimary": "#111827",
        "textSecondary": "#6B7280",
        "textTertiary": "#9CA3AF",
        "success": "#00AA44",
        "danger": "#DD3333",
        "warning": "#F59E0B",
        "info": "#3B82F6",
        "border": "#E5E7EB",
        "divider": "#F3F4F6",
        "chartBackground": "#FFFFFF",
        "chartGrid": "#F3F4F6",
        "chartAxis": "#6B7280",
        "candleUp": "#00AA44",
        "candleDown": "#DD3333"
    }
    
    # 专业黑色主题
    dark_theme_colors = {
        "primary": "#0066CC",
        "primaryHover": "#0080FF",
        "secondary": "#0099FF",
        "background": "#0A0A0A",
        "surface": "#1A1A1A",
        "card": "#2A2A2A",
        "textPrimary": "#FFFFFF",
        "textSecondary": "#D1D5DB",
        "textTertiary": "#9CA3AF",
        "success": "#00DD88",
        "danger": "#FF4444",
        "warning": "#FBBF24",
        "info": "#60A5FA",
        "border": "#374151",
        "divider": "#4B5563",
        "chartBackground": "#1A1A1A",
        "chartGrid": "#374151",
        "chartAxis": "#9CA3AF",
        "candleUp": "#00DD88",
        "candleDown": "#FF4444"
    }
    
    # 默认样式配置
    default_styles = {
        "shadows": {
            "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)"
        },
        "borderRadius": {
            "sm": "0.125rem",
            "md": "0.375rem",
            "lg": "0.5rem"
        },
        "transitions": {
            "fast": "all 0.15s ease",
            "normal": "all 0.2s ease",
            "slow": "all 0.3s ease"
        }
    }
    
    dark_styles = {
        "shadows": {
            "sm": "0 1px 2px 0 rgb(0 0 0 / 0.3)",
            "md": "0 4px 6px -1px rgb(0 0 0 / 0.4)",
            "lg": "0 10px 15px -3px rgb(0 0 0 / 0.4)",
            "xl": "0 20px 25px -5px rgb(0 0 0 / 0.5)"
        },
        "borderRadius": {
            "sm": "0.125rem",
            "md": "0.375rem",
            "lg": "0.5rem"
        },
        "transitions": {
            "fast": "all 0.15s ease",
            "normal": "all 0.2s ease",
            "slow": "all 0.3s ease"
        }
    }
    
    op.bulk_insert(theme_configurations, [
        {
            'id': 'light',
            'name': 'professional-light',
            'display_name': '专业白色主题',
            'description': '适合日间办公和正式场合的专业主题',
            'color_scheme': light_theme_colors,
            'style_config': default_styles,
            'is_active': True,
            'is_default': True,
            'sort_order': 1
        },
        {
            'id': 'dark',
            'name': 'professional-dark',
            'display_name': '专业黑色主题',
            'description': '适合长时间工作和夜间使用的护眼主题',
            'color_scheme': dark_theme_colors,
            'style_config': dark_styles,
            'is_active': True,
            'is_default': False,
            'sort_order': 2
        }
    ])


def downgrade() -> None:
    """Drop theme system tables."""
    # 删除索引
    op.drop_index('idx_theme_configurations_sort_order', 'theme_configurations')
    op.drop_index('idx_theme_configurations_active', 'theme_configurations')
    op.drop_index('idx_user_theme_preferences_theme_id', 'user_theme_preferences')
    op.drop_index('idx_user_theme_preferences_user_id', 'user_theme_preferences')
    
    # 删除表
    op.drop_table('user_theme_preferences')
    op.drop_table('theme_configurations')
