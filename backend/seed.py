"""
Начальное заполнение БД: админ, меню, новости, копирование картинок из coffeecafe/src/assets/images.
Запуск: из каталога backend, после alembic upgrade head.
"""

from __future__ import annotations

import asyncio
import json
import shutil
from datetime import datetime
from pathlib import Path

from sqlalchemy import func, select

from app.config import get_settings
from app.database import async_session_maker
from app.models.admin import Admin
from app.models.category import MenuCategory
from app.models.menu_item import MenuItem
from app.models.menu_variant import MenuVariant
from app.models.news import News
from app.services.auth import hash_password


def _assets_dir() -> Path:
    base = Path(__file__).resolve().parent
    candidates = [
        base / "seed_assets",
        base.parent / "coffeecafe" / "src" / "assets" / "images",
    ]
    for p in candidates:
        if p.is_dir() and any(p.glob("*.png")):
            return p
    return candidates[1]


def _copy_if_exists(src_name: str, dest_subdir: str, dest_name: str, uploads: Path) -> str | None:
    assets = _assets_dir()
    src = assets / src_name
    if not src.is_file():
        print(f"[seed] нет файла {src}, пропуск копирования")
        return None
    sub = uploads / dest_subdir
    sub.mkdir(parents=True, exist_ok=True)
    dest = sub / dest_name
    shutil.copy2(src, dest)
    return f"/uploads/{dest_subdir}/{dest_name}"


async def ensure_admin(session) -> None:
    settings = get_settings()
    r = await session.execute(select(func.count()).select_from(Admin))
    if (r.scalar_one() or 0) > 0:
        return
    session.add(
        Admin(
            username=settings.admin_username,
            password_hash=hash_password(settings.admin_password),
        )
    )
    print(f"[seed] создан администратор «{settings.admin_username}»")


MENU_SEED = [
    (
        "Кофе",
        0,
        [
            ("Эспрессо", "menu-coffee.png", "coffee-espresso.png", 0, [("30 мл", 120)]),
            ("Американо", "menu-coffee.png", "coffee-americano.png", 1, [("200 мл", 150), ("300 мл", 170), ("400 мл", 190)]),
            ("Капучино", "menu-coffee.png", "coffee-cappuccino.png", 2, [("200 мл", 170), ("300 мл", 190), ("400 мл", 210)]),
            ("Латте", "menu-coffee.png", "coffee-latte.png", 3, [("250 мл", 180), ("350 мл", 200), ("450 мл", 220)]),
            ("Флэт Уайт", "menu-coffee.png", "coffee-flat-white.png", 4, [("200 мл", 190), ("300 мл", 210), ("400 мл", 230)]),
            ("Раф", "menu-coffee.png", "coffee-raf.png", 5, [("250 мл", 210), ("350 мл", 230), ("450 мл", 250)]),
        ],
    ),
    (
        "Чай",
        1,
        [
            ("Черный чай", "menu-tea.png", "tea-black.png", 0, [("300 мл", 150), ("400 мл", 170), ("500 мл", 190)]),
            ("Зеленый чай", "menu-tea.png", "tea-green.png", 1, [("300 мл", 150), ("400 мл", 170), ("500 мл", 190)]),
            ("Травяной чай", "menu-tea.png", "tea-herbal.png", 2, [("300 мл", 160), ("400 мл", 180), ("500 мл", 200)]),
            ("Фруктовый чай", "menu-tea.png", "tea-fruit.png", 3, [("300 мл", 170), ("400 мл", 190), ("500 мл", 210)]),
        ],
    ),
    (
        "Десерты",
        2,
        [
            ("Чизкейк", "menu-desserts.png", "dessert-cheesecake.png", 0, [("150 г", 240)]),
            ("Брауни", "menu-desserts.png", "dessert-brownie.png", 1, [("100 г", 200)]),
            ("Тирамису", "menu-desserts.png", "dessert-tiramisu.png", 2, [("150 г", 250)]),
            ("Шоколадный трюфель", "menu-desserts.png", "dessert-truffle.png", 3, [("80 г", 210)]),
        ],
    ),
    (
        "Выпечка",
        3,
        [
            ("Круассан", "menu-bakery.png", "bakery-croissant.png", 0, [("80 г", 170)]),
            ("Слойка с шоколадом", "menu-bakery.png", "bakery-chocolate.png", 1, [("90 г", 180)]),
            ("Маффин", "menu-bakery.png", "bakery-muffin.png", 2, [("100 г", 190)]),
            ("Булочка с корицей", "menu-bakery.png", "bakery-cinnamon.png", 3, [("100 г", 180)]),
        ],
    ),
]

NEWS_SEED = [
    (
        "Скидка на утренний кофе",
        "Каждое утро с 8:00 до 11:00 в нашей кофейне действует скидка 10% на все кофейные напитки. Это отличная возможность начать день с любимого напитка.",
        ["Мы рады сообщить, что в «ДомКофе» действует специальное предложение для гостей.", "Подробности акции и сроки действия уточняйте у бариста или в наших соцсетях.", "Следите за обновлениями — скоро будет ещё больше интересных событий."],
        "coffee_news.png",
        "news-1.png",
        "2026-03-03",
        True,
    ),
    (
        "Новая сезонная выпечка",
        "К ближайшим выходным мы добавили в меню круассаны с миндалём и вишнёвый пирог. Заходите пробовать — количество ограничено.",
        ["Скоро в продаже сезонная выпечка.", "Количество ограничено."],
        "menu-coffee.png",
        "news-2.png",
        "2026-03-01",
        True,
    ),
    (
        "Вечер джаза в кофейне",
        "По пятницам с 19:00 играет живая музыка. Вход свободный, столик лучше забронировать заранее.",
        ["По пятницам живая музыка.", "Бронирование по телефону."],
        "menu-tea.png",
        "news-3.png",
        "2026-02-28",
        True,
    ),
    (
        "Обновление зернового меню",
        "Появились новые сорта арабики из Эфиопии и Колумбии. Спросите бариста о вкусовых нотах.",
        ["Новые сорта в меню.", "Спросите бариста о дегустации."],
        "menu-desserts.png",
        "news-4.png",
        "2026-02-25",
        True,
    ),
]


async def seed_menu_and_news(session) -> None:
    r = await session.execute(select(func.count()).select_from(MenuCategory))
    if (r.scalar_one() or 0) > 0:
        print("[seed] меню уже заполнено — пропуск")
        return

    uploads = Path(get_settings().uploads_dir)

    for cat_name, cat_order, items in MENU_SEED:
        cat = MenuCategory(name=cat_name, sort_order=cat_order)
        session.add(cat)
        await session.flush()

        for item_name, src_file, dest_name, item_order, variants in items:
            img_path = _copy_if_exists(src_file, "menu", dest_name, uploads)
            item = MenuItem(
                category_id=cat.id,
                name=item_name,
                image=img_path,
                sort_order=item_order,
                is_visible=True,
            )
            session.add(item)
            await session.flush()
            for vo, (lbl, price) in enumerate(variants):
                session.add(
                    MenuVariant(item_id=item.id, label=lbl, price=price, sort_order=vo)
                )

    for title, excerpt, content, src_file, dest_name, pub_day, published in NEWS_SEED:
        img_path = _copy_if_exists(src_file, "news", dest_name, uploads)
        pub_dt = datetime.strptime(pub_day, "%Y-%m-%d") if published else None
        session.add(
            News(
                title=title,
                excerpt=excerpt,
                content=json.dumps(content, ensure_ascii=False),
                image=img_path,
                is_published=published,
                published_at=pub_dt,
            )
        )

    print("[seed] меню и новости добавлены")


async def main() -> None:
    async with async_session_maker() as session:
        await ensure_admin(session)
        await seed_menu_and_news(session)
        await session.commit()
    print("[seed] готово")


if __name__ == "__main__":
    asyncio.run(main())
