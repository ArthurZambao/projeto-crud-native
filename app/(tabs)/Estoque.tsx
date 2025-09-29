import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { FormularioProduto } from '@/components/formComponents/fomulario-produto';
import { ProdutoCard } from '@/components/formComponents/produto-card';
import { useEstoque } from '@/hooks/useEstoque';

export default function Estoque() {
  const {
    produtos,
    nome,
    categoria,
    preco,
    quantidade,
    erros,
    modoEdicao,
    adicionarProduto,
    editarProduto,
    salvarEdicao,
    excluirProduto,
    handleChangeCampo,
    limparFormulario,
  } = useEstoque();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProdutoCard produto={item} onEditar={editarProduto} onExcluir={excluirProduto} />
        )}
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>
              📦 <Text style={styles.tituloTexto}>Estoque Zambs & Dantes</Text>
            </Text>
            {produtos.length === 0 && (
              <Text style={styles.listaVazia}>📭 Nenhum produto no estoque.</Text>
            )}
          </>
        }
        ListFooterComponent={
          <>
            <FormularioProduto
              nome={nome}
              categoria={categoria}
              preco={preco}
              quantidade={quantidade}
              erros={erros}
              modoEdicao={modoEdicao}
              onChangeCampo={handleChangeCampo}
              onSalvar={modoEdicao ? salvarEdicao : adicionarProduto}
              onCancelar={modoEdicao ? limparFormulario : undefined}
            />
            <View style={{ height: 40 }} />
          </>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#2e86de',
  },
  tituloTexto: {
    color: '#000',
  },
  listaVazia: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 20,
  },
});
