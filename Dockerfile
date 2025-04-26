FROM python:3.11-slim

# Instala dependências
RUN apt-get update && apt-get install -y curl unzip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Copia primeiro os arquivos essenciais
COPY requirements.txt .
COPY ocorrencias_com_agendamento.csv .
COPY train.py .

# 2. Instala dependências
RUN pip install --no-cache-dir -r requirements.txt

# 3. Treina o modelo (se necessário)
RUN mkdir -p modelos && \
    if [ ! -d "modelos/tempo_saida_model" ]; then \
        python -c "from train import train_and_save_model; \
        try: \
            train_and_save_model() \
        except Exception as e: \
            print(f'Erro crítico: {str(e)}') \
            exit(1)"; \
        chmod -R 755 modelos; \
    fi

# 4. Copia o restante do código
COPY . .

EXPOSE 3000
CMD ["uvicorn", "index:asgi_app", "--host", "0.0.0.0", "--port", "3000"]