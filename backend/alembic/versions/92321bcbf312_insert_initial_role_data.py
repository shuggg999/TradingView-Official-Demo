"""Insert initial role data

Revision ID: 92321bcbf312
Revises: c155ced19f82
Create Date: 2025-07-26 14:47:17.908338

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '92321bcbf312'
down_revision: Union[str, Sequence[str], None] = 'c155ced19f82'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Insert initial role data."""
    # Create roles table connection
    roles_table = sa.table('roles',
        sa.column('id', sa.Integer),
        sa.column('role_name', sa.String),
        sa.column('display_name', sa.String),
        sa.column('description', sa.Text),
        sa.column('permissions', sa.JSON),
        sa.column('is_active', sa.Boolean)
    )
    
    # Insert initial roles
    op.bulk_insert(roles_table, [
        {
            'id': 1,
            'role_name': 'guest',
            'display_name': '游客用户',
            'description': '未注册用户，只能访问公开内容',
            'permissions': ['read:public'],
            'is_active': True
        },
        {
            'id': 2,
            'role_name': 'user',
            'display_name': '注册用户',
            'description': '普通注册用户，可访问基础功能',
            'permissions': ['read:public', 'read:education', 'write:profile'],
            'is_active': True
        },
        {
            'id': 3,
            'role_name': 'vip',
            'display_name': 'VIP用户',
            'description': 'VIP用户，可访问高级功能',
            'permissions': ['read:public', 'read:education', 'read:advanced', 'write:profile'],
            'is_active': True
        },
        {
            'id': 4,
            'role_name': 'admin',
            'display_name': '管理员',
            'description': '系统管理员，拥有所有权限',
            'permissions': ['*'],
            'is_active': True
        }
    ])


def downgrade() -> None:
    """Remove initial role data."""
    # Delete initial roles
    op.execute("DELETE FROM roles WHERE role_name IN ('guest', 'user', 'vip', 'admin')")
