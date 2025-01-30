from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os

app = Flask(__name__)
CORS(app)  # Habilitando CORS para o front-end

# Configuração do banco de dados com suporte a variáveis de ambiente
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://usuario:senha@host:porta/banco")
conn = psycopg2.connect(os.environ['DATABASE_URL'])

# Função para criar a tabela (execute uma vez)
def criar_tabela():
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS reservas (
                    id SERIAL PRIMARY KEY,
                    quadrado_id VARCHAR(50) UNIQUE NOT NULL,
                    usuario VARCHAR(50) NOT NULL
                );
            """)
            conn.commit()
    except Exception as e:
        print(f"Erro ao criar a tabela: {e}")

# Rota para carregar reservas
@app.route("/reservas", methods=["GET"])
def carregar_reservas():
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM reservas;")
            reservas = cur.fetchall()
        return jsonify(reservas)
    except Exception as e:
        return jsonify({"erro": f"Erro ao carregar reservas: {e}"}), 500

# Rota para salvar reservas
@app.route("/reservas", methods=["POST"])
def salvar_reserva():
    try:
        dados = request.json
        quadrado_id = dados.get("quadrado_id")
        usuario = dados.get("usuario")

        if not quadrado_id or not usuario:
            return jsonify({"erro": "Os campos 'quadrado_id' e 'usuario' são obrigatórios."}), 400

        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO reservas (quadrado_id, usuario)
                VALUES (%s, %s)
                ON CONFLICT (quadrado_id) DO NOTHING;
            """, (quadrado_id, usuario))
            conn.commit()
        return jsonify({"mensagem": "Reserva salva com sucesso!"})
    except Exception as e:
        return jsonify({"erro": f"Erro ao salvar reserva: {e}"}), 500

# Rota para remover reservas
@app.route("/reservas/<quadrado_id>", methods=["DELETE"])
def remover_reserva(quadrado_id):
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM reservas WHERE quadrado_id = %s;", (quadrado_id,))
            conn.commit()
        return jsonify({"mensagem": "Reserva removida com sucesso!"})
    except Exception as e:
        return jsonify({"erro": f"Erro ao remover reserva: {e}"}), 500

if __name__ == "__main__":
    criar_tabela()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
