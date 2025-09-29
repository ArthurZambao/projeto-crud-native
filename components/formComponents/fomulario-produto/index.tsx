import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Erros {
  nome: boolean;
  categoria: boolean;
  preco: boolean;
  quantidade: boolean;
}

interface FormularioProdutoProps {
  nome: string;
  categoria: string;
  preco: string;
  quantidade: string;
  erros: Erros;
  modoEdicao: boolean;
  onChangeCampo: (campo: keyof Erros, valor: string) => void;
  onSalvar: () => void;
  onCancelar?: () => void;
}

export const FormularioProduto: React.FC<FormularioProdutoProps> = ({
  nome,
  categoria,
  preco,
  quantidade,
  erros,
  modoEdicao,
  onChangeCampo,
  onSalvar,
  onCancelar,
}) => {


  const handleSalvar = () => {
    const camposComErro: string[] = [];

    if (erros.nome) camposComErro.push('Nome');
    if (erros.categoria) camposComErro.push('Categoria');
    if (erros.preco) camposComErro.push('Preço');
    if (erros.quantidade) camposComErro.push('Quantidade');

    if (camposComErro.length > 0) {
      Alert.alert(
        'Erro',
        `Por favor, corrija os seguintes campos:\n- ${camposComErro.join('\n- ')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    onSalvar();

    Alert.alert(
      'Sucesso!',
      modoEdicao
        ? `Produto editado com sucesso!`
        : 'Produto adicionado com sucesso!',
      [{ text: 'OK' }]
    );
  };


  return (
    <View>
      <Text style={styles.subtitulo}>
        {modoEdicao ? '✏️ Editar Produto' : '➕ Adicionar Produto'}
      </Text>

      <TextInput
        style={[styles.input, erros.nome && styles.inputErro]}
        placeholder="Nome do produto"
        value={nome}
        onChangeText={(text) => onChangeCampo('nome', text)}
      />
      {erros.nome && <Text style={styles.mensagemErro}>Campo inválido</Text>}

      <TextInput
        style={[styles.input, erros.categoria && styles.inputErro]}
        placeholder="Categoria"
        value={categoria}
        onChangeText={(text) => onChangeCampo('categoria', text)}
      />
      {erros.categoria && (
        <Text style={styles.mensagemErro}>Campo inválido</Text>
      )}

      <TextInput
        style={[styles.input, erros.preco && styles.inputErro]}
        placeholder="Preço (ex: 19.99)"
        value={preco}
        onChangeText={(text) => onChangeCampo('preco', text)}
        keyboardType="decimal-pad"
      />
      {erros.preco && <Text style={styles.mensagemErro}>Campo inválido</Text>}

      <TextInput
        style={[styles.input, erros.quantidade && styles.inputErro]}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={(text) => onChangeCampo('quantidade', text)}
        keyboardType="number-pad"
      />
      {erros.quantidade && (
        <Text style={styles.mensagemErro}>Campo inválido</Text>
      )}

      <TouchableOpacity
        style={[
          styles.botaoAdicionar,
          modoEdicao && { backgroundColor: '#f39c12' },
        ]}
        onPress={handleSalvar}
      >
        <Text style={styles.textoBotao}>
          {modoEdicao ? '💾 Salvar Edição' : '+ Adicionar'}
        </Text>
      </TouchableOpacity>

      {modoEdicao && onCancelar && (
        <TouchableOpacity onPress={onCancelar} style={styles.botaoCancelar}>
          <Text style={styles.textoCancelar}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subtitulo: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#2e86de',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  inputErro: {
    borderColor: '#e74c3c',
  },
  mensagemErro: {
    color: '#e74c3c',
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 5,
  },
  botaoAdicionar: {
    backgroundColor: '#2e86de',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoCancelar: {
    alignItems: 'center',
    marginTop: 10,
  },
  textoCancelar: {
    color: '#888',
    textDecorationLine: 'underline',
  },
});
