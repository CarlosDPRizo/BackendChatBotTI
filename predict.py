import tensorflow as tf
from datetime import datetime, timedelta
from keras.layers import TFSMLayer  # Importação necessária para Keras 3

MODEL_DIR = "modelos/tempo_saida_model"
model = TFSMLayer(MODEL_DIR, call_endpoint="serving_default")

def predict(input_data):
    data_entrada = datetime.strptime(input_data["data"], "%d/%m/%Y")

    input_tensor = tf.convert_to_tensor([input_data])
    prediction = model.predict(input_tensor)

    diferenca_dias = float(prediction[0][0])
    data_agendamento_prevista = data_entrada + timedelta(days=diferenca_dias)

    return data_agendamento_prevista.strftime("%d/%m/%Y")