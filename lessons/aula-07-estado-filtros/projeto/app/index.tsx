import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dados, rotulo } from '../src/dados.mjs';
import { avaliar } from '../src/avaliacao.mjs';
import { classificarTela, filtrar, prepararLista, resumir } from '../src/missoes.mjs';
import type { Barra, Linha, Registro, Resumo, Status, Tela, Trilha } from '../src/tipos';

const fmt = (n: number) => n.toFixed(1).replace('.', ',');
type Cenario = 'dados' | 'vazia' | 'erro';
const objeto = (valor: unknown): valor is Record<string, unknown> => typeof valor === 'object' && valor !== null;
const numero = (valor: unknown): valor is number => typeof valor === 'number' && Number.isFinite(valor);
function registroSeguro(valor: unknown): valor is Registro {
  return objeto(valor) && (typeof valor.id === 'string' || numero(valor.id))
    && typeof valor.titulo === 'string' && typeof valor.descricao === 'string' && typeof valor.categoria === 'string'
    && (valor.periodo === undefined || typeof valor.periodo === 'string')
    && (valor.valor === undefined || numero(valor.valor))
    && (valor.unidade === undefined || typeof valor.unidade === 'string');
}
function registrosSeguros(valor: unknown): valor is Registro[] {
  return Array.isArray(valor) && Array.from(valor).every(registroSeguro);
}
function linhasSeguras(valor: unknown): valor is Linha[] {
  return Array.isArray(valor) && Array.from(valor).every(linha => objeto(linha)
    && typeof linha.key === 'string' && registroSeguro(linha.item));
}
function barraSegura(valor: unknown): valor is Barra {
  return objeto(valor) && typeof valor.nome === 'string' && typeof valor.texto === 'string'
    && typeof valor.unidade === 'string' && numero(valor.valor) && numero(valor.largura);
}
function resumoSeguro(valor: unknown): valor is Resumo {
  return objeto(valor) && numero(valor.total) && numero(valor.segundo)
    && Array.isArray(valor.barras) && Array.from(valor.barras).every(barraSegura);
}
function telaSegura(valor: unknown): valor is Tela {
  return typeof valor === 'string' && ['carregando', 'erro', 'vazia', 'semResultado', 'conteudo'].includes(valor);
}
function tentar<T,>(missao: string, fn: () => unknown, seguro: (valor: unknown) => valor is T, contrato: string): { valor?: T; erro?: string } {
  try {
    const valor = fn();
    if (!seguro(valor)) throw new Error(contrato);
    return { valor };
  } catch (erro) {
    return { erro: `${missao}: ${erro instanceof Error ? erro.message : String(erro)}` };
  }
}
function Botao({ texto, onPress, selecionado = false }: { texto: string; onPress: () => void; selecionado?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: selecionado }}
    onPress={onPress} style={({ pressed }) => [s.botao, selecionado && s.escolhido, pressed && s.pressionado]}>
    <Text style={[s.botaoTexto, selecionado && s.escolhidoTexto]}>{selecionado ? '✓ ' : ''}{texto}</Text>
  </Pressable>;
}

export default function Painel() {
  const [trilha, setTrilha] = useState<Trilha>('memorias');
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [periodo, setPeriodo] = useState('Todos');
  const [cenario, setCenario] = useState<Cenario>('dados');
  const [status, setStatus] = useState<Status>('carregando');
  const [tentativa, setTentativa] = useState(0);
  const [nota, setNota] = useState(() => avaliar());
  useEffect(() => {
    setStatus('carregando');
    const timer = setTimeout(() => setStatus(cenario === 'erro' ? 'erro' : 'sucesso'), 650);
    return () => clearTimeout(timer);
  }, [cenario, tentativa, trilha]);

  function limpar() { setBusca(''); setCategoria('Todas'); setPeriodo('Todos'); }
  function mudarTrilha(proxima: Trilha) { setTrilha(proxima); limpar(); setCenario('dados'); }
  const base: Registro[] = cenario === 'vazia' ? [] : dados[trilha];
  const selecao = tentar('M2 — Busca e filtros', () => filtrar(base, busca, categoria, periodo), registrosSeguros,
    'Retorne um array de registros com id, título, descrição e categoria; preserve os campos opcionais de cada registro.');
  const visiveis = selecao.valor ?? [];
  const tela = tentar('M1 — Estado da tela', () => classificarTela(status, base, visiveis), telaSegura,
    'Retorne carregando, erro, vazia, semResultado ou conteudo, conforme MISSOES.md.');
  const lista = tentar('M3 — Lista com identidade', () => prepararLista(visiveis), linhasSeguras,
    'Retorne um array de linhas, cada uma com key textual e item contendo os dados do registro.');
  const resumo = tentar('M4 — Resumo visual', () => resumir(visiveis, trilha), resumoSeguro,
    'Retorne total e segundo numéricos e um array barras; cada barra precisa de nome, valor, unidade, largura e texto nos tipos indicados em MISSOES.md.');
  const pendencias = [...new Set([selecao.erro, tela.erro, lista.erro, resumo.erro].filter(Boolean))];
  const categorias = ['Todas', ...new Set(dados[trilha].map(item => item.categoria))];
  const linhas = !selecao.erro && tela.valor === 'conteudo' ? lista.valor ?? [] : [];
  const dependenciaPendente = tela.erro ? 'Conclua ou corrija M1 para definir a mensagem desta área.'
    : selecao.erro && (tela.valor === 'conteudo' || tela.valor === 'semResultado') ? 'Conclua ou corrija M2 para visualizar o recorte; a falha da função não significa que não há resultados.'
    : lista.erro && tela.valor === 'conteudo' ? 'Conclua ou corrija M3 para apresentar os cartões do recorte.'
    : null;

  const topo = <View style={s.topo}>
    <Text style={s.selo}>IFMA · AULA 07 · DADOS FICTÍCIOS</Text>
    <Text accessibilityRole="header" style={s.h1}>Dados em movimento</Text>
    <Text style={s.texto}>Implemente as quatro missões em src/missoes.mjs. Esta interface usa as suas funções e mostra os resultados dos mesmos testes executados no terminal.</Text>
    <View style={s.placar} accessibilityLiveRegion="polite">
      <Text style={s.titulo}>{nota.nivel}</Text>
      <Text style={s.nota}>{fmt(nota.total)} / 10,0</Text>
      <Text style={s.texto}>{nota.xp} / 100 XP · 20 testes de 0,5 ponto</Text>
      {nota.missoes.map(m => <Text style={s.texto} key={m.id}>{m.nome}: {fmt(m.pontos)} / {fmt(m.max)}</Text>)}
      <Text style={s.pequeno}>Após editar o código, recalcule. Missões não implementadas valem zero, sem bloquear as demais.</Text>
      <Botao texto="Recalcular nota do código" onPress={() => setNota(avaliar())} />
    </View>
    <Text style={s.pequeno}>Para gerar o relatório e salvar o PDF parcial: execute npm run nota e abra entrega/resultado.html. A validação visual e no aparelho é registrada separadamente na ficha.</Text>
    <View style={s.linha}>
      <Botao texto="Memórias" selecionado={trilha === 'memorias'} onPress={() => mudarTrilha('memorias')} />
      <Botao texto="Permanência escolar" selecionado={trilha === 'eda'} onPress={() => mudarTrilha('eda')} />
    </View>
    <Text style={s.rotulo}>Buscar no título</Text>
    <TextInput value={busca} onChangeText={setBusca} accessibilityLabel="Buscar no título"
      placeholder={trilha === 'memorias' ? 'Ex.: praça' : 'Ex.: frequência'} placeholderTextColor="#52685b"
      style={s.input} maxLength={120} />
    <Text style={s.rotulo}>{trilha === 'memorias' ? 'Categoria' : 'Situação'}</Text>
    <View style={s.linha}>{categorias.map(c => <Botao key={c} texto={rotulo(c)} selecionado={categoria === c} onPress={() => setCategoria(c)} />)}</View>
    {trilha === 'eda' && <><Text style={s.rotulo}>Período</Text><View style={s.linha}>{['Todos', 'Semana 1', 'Semana 2'].map(p => <Botao key={p} texto={p} selecionado={periodo === p} onPress={() => setPeriodo(p)} />)}</View></>}
    <Botao texto="Limpar filtros" onPress={limpar} />
    <Text style={s.rotulo}>Cenários locais de aprendizagem</Text>
    <View style={s.linha}>{(['dados', 'vazia', 'erro'] as Cenario[]).map(c => <Botao key={c}
      texto={({ dados: 'Com dados', vazia: 'Base vazia', erro: 'Simular erro' })[c]} selecionado={cenario === c} onPress={() => setCenario(c)} />)}</View>
    <Text style={s.pequeno}>Não há rede nem dados reais. A espera é simulada; limpar filtros não corrige uma falha.</Text>
    {pendencias.length > 0 && <View style={s.aviso}><Text style={s.rotulo}>Missões a implementar ou corrigir</Text>{pendencias.map((p, i) => <Text key={i} style={s.texto}>{p}</Text>)}</View>}
    {status === 'sucesso' && !selecao.erro && resumo.valor && <View style={s.resumo}>
      <Text accessibilityRole="header" style={s.titulo}>Resumo do recorte</Text>
      <Text style={s.texto}>{resumo.valor.total} {trilha === 'eda' ? 'indicadores' : 'memórias'} no recorte</Text>
      <Text style={s.texto}>{resumo.valor.segundo} {trilha === 'eda' ? 'indicadores em atenção' : 'categorias representadas'}</Text>
      <Text style={s.rotulo}>{trilha === 'eda' ? 'Percentuais · escala fixa 0–100%' : 'Memórias por categoria · escala comum no recorte'}</Text>
      {resumo.valor.barras.map((b, i) => <View key={`${b.nome}-${i}`} style={s.barra}>
        <Text style={s.texto}>{b.texto}</Text>
        <View style={s.trilho} accessible={false} importantForAccessibility="no-hide-descendants">
          <View style={[s.preenchimento, { width: `${Math.max(0, Math.min(100, b.largura))}%` as `${number}%` }]} />
        </View>
      </View>)}
      {trilha === 'eda' && visiveis.filter(item => item.unidade !== '%').map(item => <Text key={String(item.id)} style={s.texto}>{item.titulo} · {item.periodo}: {item.valor} {item.unidade}. Fora do eixo percentual.</Text>)}
    </View>}
    <Text accessibilityRole="header" style={s.titulo}>Registros</Text>
  </View>;

  const vazio = <View style={s.aviso} accessibilityLiveRegion="polite">
    {dependenciaPendente ? <Text style={s.texto}>{dependenciaPendente}</Text> : <>
      {tela.valor === 'carregando' && <><ActivityIndicator color="#006b3c" accessibilityLabel="Carregando registros" /><Text style={s.texto}>Carregando registros...</Text></>}
      {tela.valor === 'erro' && <><Text style={s.texto}>Não foi possível carregar os registros.</Text><Botao texto="Tentar novamente" onPress={() => { setCenario('dados'); setTentativa(n => n + 1); }} /></>}
      {tela.valor === 'vazia' && <Text style={s.texto}>Nenhum registro disponível na base.</Text>}
      {tela.valor === 'semResultado' && <><Text style={s.texto}>Nenhum resultado para estes filtros.</Text><Botao texto="Limpar filtros e recuperar a lista" onPress={limpar} /></>}
    </>}
  </View>;
  return <SafeAreaView style={s.pagina}>
    <FlatList<Linha> data={linhas} keyExtractor={linha => linha.key} ListHeaderComponent={topo}
      ListEmptyComponent={vazio} keyboardShouldPersistTaps="handled" contentContainerStyle={s.conteudo}
      renderItem={({ item: linha }) => <Pressable accessibilityRole="button"
        accessibilityLabel={`Abrir ${linha.item.titulo}`}
        onPress={() => router.push({ pathname: '/detalhe', params: { trilha, id: String(linha.item.id) } })}
        style={({ pressed }) => [s.cartao, pressed && s.pressionado]}>
        <Text style={s.titulo}>{linha.item.titulo}</Text><Text style={s.texto}>{rotulo(linha.item.categoria)}</Text>
        {linha.item.periodo && <Text style={s.pequeno}>{linha.item.periodo}</Text>}
        <Text style={s.pequeno}>Ver detalhes · ID {linha.item.id}</Text>
      </Pressable>}
      ListFooterComponent={<View style={s.rodape}><Text style={s.pequeno}>{nota.limite}</Text><Text style={s.pequeno}>Fonte e relatório de nota: npm run nota. Teste também orientação, toque, teclado e leitor de tela; registre falhas na ficha.</Text></View>} />
  </SafeAreaView>;
}

const s = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: '#f4f8f5' }, conteudo: { padding: 18, maxWidth: 1000, width: '100%', alignSelf: 'center' },
  topo: { gap: 12 }, selo: { fontSize: 14, fontWeight: '700', color: '#006b3c' }, h1: { fontSize: 34, fontWeight: '800', color: '#006b3c' },
  texto: { fontSize: 18, color: '#1e3829', lineHeight: 27 }, pequeno: { fontSize: 16, color: '#445d4d', lineHeight: 24 },
  titulo: { fontSize: 22, fontWeight: '700', color: '#17452c' }, rotulo: { fontSize: 18, fontWeight: '700', color: '#1e3829' },
  placar: { padding: 18, backgroundColor: '#e3f1e8', borderRadius: 12, gap: 8, borderWidth: 1, borderColor: '#709d82' },
  nota: { fontSize: 38, fontWeight: '800', color: '#006b3c' }, linha: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  botao: { padding: 12, minHeight: 48, borderRadius: 6, borderWidth: 1, borderColor: '#006b3c', justifyContent: 'center', backgroundColor: '#fff' },
  botaoTexto: { fontSize: 17, fontWeight: '700', color: '#006b3c' }, escolhido: { backgroundColor: '#006b3c' }, escolhidoTexto: { color: '#fff' }, pressionado: { opacity: 0.75 },
  input: { borderWidth: 2, borderColor: '#587661', borderRadius: 6, padding: 12, minHeight: 48, backgroundColor: '#fff', color: '#1e3829', fontSize: 18 },
  aviso: { padding: 16, borderLeftWidth: 5, borderLeftColor: '#8b5a0c', backgroundColor: '#fff5e3', gap: 12, marginVertical: 12 },
  resumo: { gap: 12, paddingVertical: 16 }, barra: { gap: 6 }, trilho: { backgroundColor: '#dbe8df', height: 20 }, preenchimento: { backgroundColor: '#196b98', height: 20 },
  cartao: { backgroundColor: '#fff', padding: 18, borderWidth: 1, borderColor: '#799c87', borderRadius: 8, marginTop: 12, gap: 8 },
  rodape: { marginTop: 24, gap: 10, paddingBottom: 24 }
});
