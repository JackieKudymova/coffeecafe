"""Состав и аллергены у позиций меню.

Revision ID: 20260506_03
Revises: 20260505_02
Create Date: 2026-05-06

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260506_03"
down_revision: Union[str, None] = "20260505_02"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("menu_items", sa.Column("ingredients", sa.Text(), nullable=True))
    op.add_column(
        "menu_items",
        sa.Column("allergen_milk", sa.Boolean(), server_default="false", nullable=False),
    )
    op.add_column(
        "menu_items",
        sa.Column("allergen_gluten", sa.Boolean(), server_default="false", nullable=False),
    )
    op.add_column(
        "menu_items",
        sa.Column("allergen_egg", sa.Boolean(), server_default="false", nullable=False),
    )


def downgrade() -> None:
    op.drop_column("menu_items", "allergen_egg")
    op.drop_column("menu_items", "allergen_gluten")
    op.drop_column("menu_items", "allergen_milk")
    op.drop_column("menu_items", "ingredients")
