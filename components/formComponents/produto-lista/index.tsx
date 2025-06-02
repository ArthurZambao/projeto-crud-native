import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { ProdutoCard } from '../produto-card';


interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
}

interface ProdutoListaProps {
  produtos: Produto[];
  onEditar: (produto: Produto) => void;
  onExcluir: (id: string) => void;  // novo prop
}

export const ProdutoLista: React.FC<ProdutoListaProps> = ({ produtos, onEditar, onExcluir }) => (
  <FlatList
    data={produtos}
    renderItem={({ item }) => (
      <ProdutoCard produto={item} onEditar={onEditar} onExcluir={onExcluir} />
    )}
    keyExtractor={(item) => item.id}
    style={styles.lista}
    ListEmptyComponent={<Text style={styles.listaVazia}>📭 Nenhum produto no estoque.</Text>}
  />
);

const styles = StyleSheet.create({
  lista: {
    maxHeight: 350,
  },
  listaVazia: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
});
