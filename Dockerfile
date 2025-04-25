# Dockerfile
FROM python:3.11-slim

# Instala dependências
RUN apt-get update && apt-get install -y curl unzip

# Diretório da app
WORKDIR /app

# Copia arquivos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Exponha a porta usada pelo uvicorn
EXPOSE 3000

# Comando padrão (o ngrok será iniciado via docker-compose)
CMD ["uvicorn", "index:asgi_app", "--host", "0.0.0.0", "--port", "3000"]
