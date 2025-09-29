import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

interface Produto {
    id: string;
    nome: string;
    categoria: string;
    preco: number;
    quantidade: number;
}

export function useEstoque() {

    const STORAGE_KEY = '@produtos_estoque';

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
        setProdutos((atual) => atual.filter((p) => p.id !== id));
    };

    const editarProduto = (produto: Produto) => {
        setModoEdicao(true);
        setProdutoEditando(produto);
        setNome(produto.nome);
        setCategoria(produto.categoria);
        setPreco(produto.preco.toString());
        setQuantidade(produto.quantidade.toString());
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
        setModoEdicao(false);
        setProdutoEditando(null);
        setErros({ nome: false, categoria: false, preco: false, quantidade: false });
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
        else if (campo === 'preco') setPreco(valor.replace(/[^0-9.,]/g, '').replace(',', '.'));
        else if (campo === 'quantidade') setQuantidade(valor.replace(/[^0-9]/g, ''));

        if (valor.trim() !== '') setErros((e) => ({ ...e, [campo]: false }));
    };

    return {
        produtos,
        nome,
        categoria,
        preco,
        quantidade,
        erros,
        modoEdicao,
        adicionarProduto,
        editarProduto,
        excluirProduto,
        salvarEdicao,
        limparFormulario,
        handleChangeCampo,
    };
}