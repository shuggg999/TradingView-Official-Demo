"""Add database indexes for performance optimization

Revision ID: c155ced19f82
Revises: 987df21754ce
Create Date: 2025-07-26 14:46:44.913232

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c155ced19f82'
down_revision: Union[str, Sequence[str], None] = '987df21754ce'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add database indexes for performance optimization."""
    # Users table indexes
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_users_username', 'users', ['username'])
    op.create_index('idx_users_oauth', 'users', ['oauth_provider', 'oauth_provider_id'])
    op.create_index('idx_users_created_at', 'users', ['created_at'])
    op.create_index('idx_users_role_id', 'users', ['role_id'])
    
    # User sessions table indexes
    op.create_index('idx_sessions_user_id', 'user_sessions', ['user_id'])
    op.create_index('idx_sessions_token', 'user_sessions', ['session_token'])
    op.create_index('idx_sessions_expires', 'user_sessions', ['expires_at'])
    op.create_index('idx_sessions_last_accessed', 'user_sessions', ['last_accessed_at'])
    
    # Password reset tokens table indexes  
    op.create_index('idx_reset_tokens_user_id', 'password_reset_tokens', ['user_id'])
    op.create_index('idx_reset_tokens_token', 'password_reset_tokens', ['token'])
    op.create_index('idx_reset_tokens_expires', 'password_reset_tokens', ['expires_at'])
    
    # Audit logs table indexes
    op.create_index('idx_audit_logs_user_id', 'auth_audit_logs', ['user_id'])
    op.create_index('idx_audit_logs_action', 'auth_audit_logs', ['action'])
    op.create_index('idx_audit_logs_created_at', 'auth_audit_logs', ['created_at']) 
    op.create_index('idx_audit_logs_result', 'auth_audit_logs', ['result'])


def downgrade() -> None:
    """Remove database indexes."""
    # Remove all indexes in reverse order
    op.drop_index('idx_audit_logs_result')
    op.drop_index('idx_audit_logs_created_at')
    op.drop_index('idx_audit_logs_action')
    op.drop_index('idx_audit_logs_user_id')
    
    op.drop_index('idx_reset_tokens_expires')
    op.drop_index('idx_reset_tokens_token')
    op.drop_index('idx_reset_tokens_user_id')
    
    op.drop_index('idx_sessions_last_accessed')
    op.drop_index('idx_sessions_expires')
    op.drop_index('idx_sessions_token')
    op.drop_index('idx_sessions_user_id')
    
    op.drop_index('idx_users_role_id')
    op.drop_index('idx_users_created_at')
    op.drop_index('idx_users_oauth')
    op.drop_index('idx_users_username')
    op.drop_index('idx_users_email')
