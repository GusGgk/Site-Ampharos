from flask import Flask, jsonify, request

app = Flask(__name__)

# Lista de quadrados selecionados
# Cada quadrado será representado por um dicionário com as informações do patrocinador e posição.
quadrados_selecionados = []

@app.route('/quadrados', methods=['GET'])
def get_quadrados():
    """Retorna a lista de quadrados selecionados."""
    return jsonify(quadrados_selecionados)

@app.route('/quadrados', methods=['POST'])
def add_quadrado():
    """Adiciona um novo quadrado."""
    data = request.get_json()
    # Verifica se o quadrado já foi selecionado
    for quadrado in quadrados_selecionados:
        if quadrado['id'] == data['id']:
            return jsonify({'error': 'Quadrado já selecionado!'}), 400

    quadrados_selecionados.append(data)
    return jsonify({'message': 'Quadrado selecionado com sucesso!'}), 201

@app.route('/quadrados/<int:id>', methods=['DELETE'])
def remove_quadrado(id):
    """Remove um quadrado pelo ID."""
    global quadrados_selecionados
    quadrados_selecionados = [q for q in quadrados_selecionados if q['id'] != id]
    return jsonify({'message': 'Quadrado removido com sucesso!'})

if __name__ == '__main__':
    app.run(debug=True)
