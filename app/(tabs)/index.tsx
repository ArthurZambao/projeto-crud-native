import { FormularioProduto } from '@/components/formComponents/fomulario-produto';
import { ProdutoLista } from '@/components/formComponents/produto-lista';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const [erros, setErros] = useState({
    nome: false,
    categoria: false,
    preco: false,
    quantidade: false,
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

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

const excluirProduto = (id: string) => {
  setProdutos((produtosAtuais) => produtosAtuais.filter((p) => p.id !== id));
};


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

  const limparFormulario = () => {
    setNome('');
    setCategoria('');
    setPreco('');
    setQuantidade('');
    setErros({ nome: false, categoria: false, preco: false, quantidade: false });
    setModoEdicao(false);
    setProdutoEditando(null);
  };

  const adicionarProduto = () => {
    if (!validarCampos()) return;

    const novoProduto: Produto = {
      id: Math.random().toString(),
      nome,
      categoria,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade, 10),
    };

    setProdutos([...produtos, novoProduto]);
    limparFormulario();
  };

  const editarProduto = (produto: Produto) => {
    setModoEdicao(true);
    setProdutoEditando(produto);
    setNome(produto.nome);
    setCategoria(produto.categoria);
    setPreco(produto.preco.toString());
    setQuantidade(produto.quantidade.toString());
  };

  const salvarEdicao = () => {
    if (!validarCampos() || !produtoEditando) return;

    const atualizados = produtos.map((p) =>
      p.id === produtoEditando.id
        ? { ...p, nome, categoria, preco: parseFloat(preco), quantidade: parseInt(quantidade, 10) }
        : p
    );

    setProdutos(atualizados);
    limparFormulario();
  };

  const handleChangeCampo = (campo: keyof typeof erros, valor: string) => {
    if (campo === 'nome') setNome(valor);
    else if (campo === 'categoria') setCategoria(valor);
    else if (campo === 'preco') {
      const valid = valor.replace(/[^0-9.,]/g, '').replace(',', '.');
      setPreco(valid);
    } else if (campo === 'quantidade') {
      const valid = valor.replace(/[^0-9]/g, '');
      setQuantidade(valid);
    }

    if (valor.trim() !== '') setErros((e) => ({ ...e, [campo]: false }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>
          📊 <Text style={styles.tituloTexto}>Estoque Zambs & Dantes</Text>
        </Text>

        <ProdutoLista produtos={produtos} onEditar={editarProduto} onExcluir={excluirProduto} />


        <View style={styles.divisor} />

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
  divisor: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
    opacity: 0.4,
  },
});
