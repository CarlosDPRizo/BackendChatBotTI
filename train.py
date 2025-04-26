import pandas as pd
import tensorflow_decision_forests as tfdf
import os
from datetime import datetime


MODEL_DIR = "modelos/tempo_saida_model"

def parse_date(date_str):
    """Converte datas no formato DD/MM/YYYY para datetime"""
    try:
        return datetime.strptime(date_str, "%d/%m/%Y")
    except:
        return None

def train_and_save_model():
    print('Iniciando treinamento...')
    
    if os.path.exists(MODEL_DIR):
        print("Modelo já existe em", MODEL_DIR)
        return

    try:
        # 1. Carrega e prepara os dados
        print('Lendo dataset...')
        df = pd.read_csv("occorrencias_com_agendamento.csv")
        
        # 2. Conversão de datas e cálculo alternativo de diferença
        df['data'] = df['data'].apply(parse_date)
        df['data_agendamento'] = df['data_agendamento'].apply(parse_date)
        
        # Verificação de dados nulos
        if df['diferenca_dias'].isnull().any():
            raise ValueError("Valores nulos encontrados na coluna alvo")
            
        # 3. Criação do dataset com task EXPLÍCITA
        print('Preparando dados...')
        dataset = tfdf.keras.pd_dataframe_to_tf_dataset(
            df,
            label="diferenca_dias",
            task=tfdf.keras.Task.REGRESSION  # Força regressão
        )
        
        # 4. Configuração do modelo
        print('Criando modelo...')
        model = tfdf.keras.RandomForestModel(
            task=tfdf.keras.Task.REGRESSION,
            num_trees=100,
            max_depth=16
        )
        
        # 5. Treinamento
        print('Treinando modelo...')
        model.fit(dataset)
        
        # 6. Salvamento
        print('Salvando modelo...')
        os.makedirs(MODEL_DIR, exist_ok=True)
        model.save(MODEL_DIR)
        
        print(f"Modelo treinado e salvo em {MODEL_DIR}")
        print(f"Amostra de previsões: {model.predict(dataset.head(3))}")

    except Exception as e:
        print(f"Erro durante treinamento: {str(e)}")
        raise