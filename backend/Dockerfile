# Сборка из корня репозитория: docker compose build backend (context: .)
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Медленный интернет / WSL: у pip таймаут сокета по умолчанию ~15 с — на больших колёсах PyPI часто Read timed out
ENV PIP_DEFAULT_TIMEOUT=300

COPY backend/requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --retries 10 --timeout 300 -r requirements.txt

COPY backend/app ./app
COPY backend/alembic.ini .
COPY backend/alembic ./alembic
COPY backend/seed.py .

# Картинки для seed (из фронтенд-проекта)
COPY coffeecafe/src/assets/images ./seed_assets

RUN mkdir -p /app/uploads /app/data

EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && python seed.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
