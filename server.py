from flask import Flask, jsonify, request
import psycopg2
from psycopg2.extras import RealDictCursor
import os

app = Flask(__name__)

# Conexão com o banco de dados local
conn = psycopg2.connect("postgresql://postgres:gu260806@localhost:5432/postgres")

# Função para criar a tabela (execute uma vez)
def criar_tabela():
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS reservas (
                id SERIAL PRIMARY KEY,
                quadrado_id VARCHAR(50) UNIQUE NOT NULL,
                usuario VARCHAR(50) NOT NULL
            );
        """)
        conn.commit()

# Rota para carregar reservas
@app.route("/reservas", methods=["GET"])
def carregar_reservas():
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("SELECT * FROM reservas;")
        reservas = cur.fetchall()
    return jsonify(reservas)

# Rota para salvar reservas
@app.route("/reservas", methods=["POST"])
def salvar_reserva():
    dados = request.json
    quadrado_id = dados.get("quadrado_id")
    usuario = dados.get("usuario")
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO reservas (quadrado_id, usuario)
            VALUES (%s, %s)
            ON CONFLICT (quadrado_id) DO NOTHING;
        """, (quadrado_id, usuario))
        conn.commit()
    return jsonify({"mensagem": "Reserva salva com sucesso!"})

# Rota para remover reservas
@app.route("/reservas/<quadrado_id>", methods=["DELETE"])
def remover_reserva(quadrado_id):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM reservas WHERE quadrado_id = %s;", (quadrado_id,))
        conn.commit()
    return jsonify({"mensagem": "Reserva removida com sucesso!"})

if __name__ == "__main__":
    criar_tabela()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
