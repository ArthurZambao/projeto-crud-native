import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
}

const STORAGE_KEY = '@produtos_estoque';

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Formulário
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  // Edição
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const [erros, setErros] = useState({
    nome: false,
    categoria: false,
    preco: false,
    quantidade: false,
  });

  // Carregar produtos do AsyncStorage quando o app iniciar
  useEffect(() => {
    carregarProdutos();
  }, []);

  // Salvar produtos no AsyncStorage sempre que a lista mudar
  useEffect(() => {
    salvarProdutos(produtos);
  }, [produtos]);

  const salvarProdutos = async (lista: Produto[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {
      console.error('Erro ao salvar produtos:', e);
    }
  };

  const carregarProdutos = async () => {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEY);
      if (dados) {
        setProdutos(JSON.parse(dados));
      }
    } catch (e) {
      console.error('Erro ao carregar produtos:', e);
    }
  };

  // Validação dos campos
  const validarCampos = () => {
    const novosErros = {
      nome: nome.trim() === '',
      categoria: categoria.trim() === '',
      preco: preco.trim() === '',
      quantidade: quantidade.trim() === '',
    };
    setErros(novosErros);
    return !Object.values(novosErros).some(Boolean);
  };

  // Função para limpar os campos do formulário
  const limparFormulario = () => {
    setNome('');
    setCategoria('');
    setPreco('');
    setQuantidade('');
    setErros({ nome: false, categoria: false, preco: false, quantidade: false });
    setModoEdicao(false);
    setProdutoEditando(null);
  };

  // Função para adicionar produto
  const adicionarProduto = () => {
    if (!validarCampos()) return;

    const novoProduto: Produto = {
      id: Math.random().toString(),
      nome,
      categoria,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
    };

    setProdutos([...produtos, novoProduto]);
    limparFormulario();
  };

  // Função para editar produto
  const editarProduto = (produto: Produto) => {
    setModoEdicao(true);
    setProdutoEditando(produto);
    setNome(produto.nome);
    setCategoria(produto.categoria);
    setPreco(produto.preco.toString());
    setQuantidade(produto.quantidade.toString());
  };

  // Função para salvar edição do produto
  const salvarEdicao = () => {
    if (!validarCampos() || !produtoEditando) return;

    const atualizados = produtos.map((p) =>
      p.id === produtoEditando.id
        ? { ...p, nome, categoria, preco: parseFloat(preco), quantidade: parseInt(quantidade) }
        : p
    );

    setProdutos(atualizados);
    limparFormulario();
  };

  // Função para mostrar os produtos
  const renderItem = ({ item }: { item: Produto }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardNome}>{item.nome}</Text>
        <Text style={styles.cardTexto}>📂 {item.categoria}</Text>
        <Text style={styles.cardTexto}>💰 R$ {item.preco.toFixed(2)}</Text>
        <Text style={styles.cardTexto}>📦 {item.quantidade} unidade(s)</Text>
      </View>
      <View style={styles.acoes}>
        <TouchableOpacity onPress={() => editarProduto(item)} style={styles.botaoEditar}>
          <Text style={styles.acaoTexto}>✏️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handlePrecoChange = (text: string) => {
    const valid = text.replace(/[^0-9.,]/g, '').replace(',', '.');
    setPreco(valid);
    if (valid.trim() !== '') setErros((e) => ({ ...e, preco: false }));
  };

  const handleQuantidadeChange = (text: string) => {
    const valid = text.replace(/[^0-9]/g, '');
    setQuantidade(valid);
    if (valid.trim() !== '') setErros((e) => ({ ...e, quantidade: false }));
  };

  const handleChangeCampo = (value: string, campo: keyof typeof erros) => {
    if (campo === 'nome') setNome(value);
    if (campo === 'categoria') setCategoria(value);
    if (value.trim() !== '') setErros((e) => ({ ...e, [campo]: false }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>📊 <Text style={styles.tituloTexto}>Estoque</Text></Text>

        <FlatList
          data={produtos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.lista}
          ListEmptyComponent={<Text style={styles.listaVazia}>📭 Nenhum produto no estoque.</Text>}
        />

        <View style={styles.divisor} />

        <Text style={styles.subtitulo}>{modoEdicao ? '✏️ Editar Produto' : '➕ Adicionar Produto'}</Text>

        <TextInput
          style={[styles.input, erros.nome && styles.inputErro]}
          placeholder="Nome do produto"
          value={nome}
          onChangeText={(text) => handleChangeCampo(text, 'nome')}
        />
        {erros.nome && <Text style={styles.mensagemErro}>Campo inválido</Text>}

        <TextInput
          style={[styles.input, erros.categoria && styles.inputErro]}
          placeholder="Categoria"
          value={categoria}
          onChangeText={(text) => handleChangeCampo(text, 'categoria')}
        />
        {erros.categoria && <Text style={styles.mensagemErro}>Campo inválido</Text>}

        <TextInput
          style={[styles.input, erros.preco && styles.inputErro]}
          placeholder="Preço (ex: 19.99)"
          value={preco}
          onChangeText={handlePrecoChange}
          keyboardType="decimal-pad"
        />
        {erros.preco && <Text style={styles.mensagemErro}>Campo inválido</Text>}

        <TextInput
          style={[styles.input, erros.quantidade && styles.inputErro]}
          placeholder="Quantidade"
          value={quantidade}
          onChangeText={handleQuantidadeChange}
          keyboardType="number-pad"
        />
        {erros.quantidade && <Text style={styles.mensagemErro}>Campo inválido</Text>}

        <TouchableOpacity
          style={[styles.botaoAdicionar, modoEdicao && { backgroundColor: '#f39c12' }]}
          onPress={modoEdicao ? salvarEdicao : adicionarProduto}
        >
          <Text style={styles.textoBotao}>
            {modoEdicao ? '💾 Salvar Edição' : '+ Adicionar'}
          </Text>
        </TouchableOpacity>

        {modoEdicao && (
          <TouchableOpacity onPress={limparFormulario} style={styles.botaoCancelar}>
            <Text style={styles.textoCancelar}>Cancelar Edição</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#2e86de',
  },
  tituloTexto: {
    color: '#000',
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#2e86de',
  },
  lista: {
    maxHeight: 350,
  },
  listaVazia: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
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
  acaoTexto: {
    fontSize: 18,
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
  divisor: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    opacity: 0.4,
  },
});
