from flask import Flask, request, jsonify
from flask_cors import CORS  # Importar o CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Ativar CORS para todas as rotas

# Arquivo para salvar as reservas
RESERVAS_FILE = "reservas.json"

# Função para carregar reservas do arquivo
def carregar_reservas():
    try:
        with open(RESERVAS_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

# Função para salvar reservas no arquivo
def salvar_reservas(reservas):
    with open(RESERVAS_FILE, "w") as file:
        json.dump(reservas, file)

@app.route("/quadrados", methods=["GET"])
def obter_quadrados():
    reservas = carregar_reservas()
    return jsonify(reservas)

@app.route("/quadrados", methods=["POST"])
def reservar_quadrado():
    dados = request.json
    reservas = carregar_reservas()

    # Verificar se o quadrado já foi reservado
    for reserva in reservas:
        if reserva["id"] == dados["id"]:
            return jsonify({"error": "Quadrado já reservado!"}), 400

    # Adicionar nova reserva
    reservas.append({
        "id": dados["id"],
        "usuario": dados["usuario"]
    })
    salvar_reservas(reservas)
    return jsonify({"message": "Reserva feita com sucesso!"}), 200

@app.route("/quadrados/<quadrado_id>", methods=["DELETE"])
def remover_reserva(quadrado_id):
    reservas = carregar_reservas()
    reservas = [reserva for reserva in reservas if reserva["id"] != quadrado_id]
    salvar_reservas(reservas)
    return jsonify({"message": "Reserva removida com sucesso!"}), 200

if __name__ == "__main__":
    app.run(debug=True)