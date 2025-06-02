import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
}

interface ProdutoCardProps {
  produto: Produto;
  onEditar: (produto: Produto) => void;
  onExcluir: (id: string) => void;   // novo prop
}

export const ProdutoCard: React.FC<ProdutoCardProps> = ({ produto, onEditar, onExcluir }) => (
  <View style={styles.card}>
    <View style={{ flex: 1 }}>
      <Text style={styles.cardNome}>{produto.nome}</Text>
      <Text style={styles.cardTexto}>📂 {produto.categoria}</Text>
      <Text style={styles.cardTexto}>💰 R$ {produto.preco.toFixed(2)}</Text>
      <Text style={styles.cardTexto}>📦 {produto.quantidade} unidade(s)</Text>
    </View>
    <View style={styles.acoes}>
      <TouchableOpacity onPress={() => onEditar(produto)} style={styles.botaoEditar}>
        <Text style={styles.acaoTexto}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onExcluir(produto.id)} style={styles.botaoExcluir}>
        <Text style={[styles.acaoTexto, { color: '#e74c3c' }]}>🗑️</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardTexto: {
    fontSize: 15,
    color: '#555',
    marginVertical: 1,
  },
  acoes: {
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  botaoEditar: {
    padding: 4,
  },
  botaoExcluir: {
    padding: 4,
    marginTop: 10,
  },
  acaoTexto: {
    fontSize: 18,
  },
});
