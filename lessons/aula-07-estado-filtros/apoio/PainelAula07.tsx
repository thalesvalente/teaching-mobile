// Componente de referência. Integre à base; não substitua o app inteiro.
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text,
  TextInput, View, type ListRenderItem } from 'react-native';
import { filtrar, resumir, type Registro, type Trilha } from './modelo';

type Props = {
  dados: readonly Registro[];
  trilha: Trilha;
  aoAbrir: (id: Registro['id']) => void;
};
type Status = 'carregando' | 'sucesso' | 'erro';
type Cenario = 'dados' | 'vazia' | 'erro';
const rotulo = (c: string): string => c === 'atencao' ? 'Em atenção' : c === 'adequado' ? 'Adequado' : c;

export default function PainelAula07({ dados, trilha, aoAbrir }: Props) {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [periodo, setPeriodo] = useState('Todos');
  const [cenario, setCenario] = useState<Cenario>('dados');
  const [status, setStatus] = useState<Status>('carregando');
  const [tentativa, setTentativa] = useState(0);

  // Atraso LOCAL para aprender os estados; não há HTTP, API ou persistência.
  // A limpeza evita que uma resposta antiga substitua o cenário mais recente.
  useEffect(() => {
    setStatus('carregando');
    const timer = setTimeout(() => {
      setStatus(cenario === 'erro' ? 'erro' : 'sucesso');
    }, 650);
    return () => clearTimeout(timer);
  }, [cenario, tentativa]);

  const registros = cenario === 'vazia' ? [] : dados;
  const visiveis = filtrar(registros, busca, categoria, periodo);
  const resumo = resumir(visiveis, trilha);
  const categorias = ['Todas', ...new Set(dados.map(item => item.categoria))];
  const periodos = ['Todos', ...new Set(dados.flatMap(item => item.periodo ? [item.periodo] : []))];
  function limpar() { setBusca(''); setCategoria('Todas'); setPeriodo('Todos'); }
  function tentarNovamente() { setCenario('dados'); setTentativa(n => n + 1); }

  const renderizarItem: ListRenderItem<Registro> = ({ item }) => (
    <Pressable style={s.cartao} onPress={() => aoAbrir(item.id)}
      accessibilityRole="button" accessibilityLabel={`Abrir ${item.titulo}`}>
      <Text style={s.titulo}>{item.titulo}</Text>
      <Text>{rotulo(item.categoria)}{item.periodo ? ` · ${item.periodo}` : ''}</Text>
      {item.valor !== undefined && <Text>{item.valor} {item.unidade}</Text>}
    </Pressable>
  );

  const topo = <View style={s.topo}>
    <Text accessibilityRole="header" style={s.h1}>Explorar os registros</Text>
    <Text>Dados fictícios. Busca e categoria: {rotulo(categoria)}; período: {periodo}.</Text>
    <Text>Buscar no título</Text>
    <TextInput style={s.input} value={busca} onChangeText={setBusca}
      accessibilityLabel="Buscar no título" maxLength={120}/>
    <Text>Escolher {trilha === 'eda' ? 'situação' : 'categoria'}</Text>
    <View style={s.linha}>{categorias.map(c => <Pressable key={c}
      style={({ pressed }) => [s.botao, categoria === c && s.selecionado, pressed && s.pressionado]}
      accessibilityRole="button" accessibilityState={{ selected: categoria === c }}
      onPress={() => setCategoria(c)}><Text style={[s.btnText, categoria === c && s.selecionadoTexto]}>{categoria === c ? '✓ ' : ''}{rotulo(c)}</Text></Pressable>)}</View>
    {trilha === 'eda' && <><Text>Escolher período</Text><View style={s.linha}>{periodos.map(p => <Pressable key={p}
      style={({ pressed }) => [s.botao, periodo === p && s.selecionado, pressed && s.pressionado]} accessibilityRole="button" accessibilityState={{selected:periodo===p}}
      onPress={() => setPeriodo(p)}><Text style={[s.btnText, periodo === p && s.selecionadoTexto]}>{periodo === p ? '✓ ' : ''}{p}</Text></Pressable>)}</View></>}
    <Pressable style={s.botao} onPress={limpar} accessibilityRole="button"><Text style={s.btnText}>Limpar filtros</Text></Pressable>
    <Text>Cenários de aprendizagem; não são respostas de um servidor:</Text>
    <View style={s.linha}>{(['dados','vazia','erro'] as Cenario[]).map(c => <Pressable
      key={c} style={({ pressed }) => [s.botao, cenario === c && s.selecionado, pressed && s.pressionado]} accessibilityRole="button" accessibilityState={{selected:cenario===c}} onPress={() => setCenario(c)}>
      <Text style={[s.btnText, cenario === c && s.selecionadoTexto]}>{cenario === c ? '✓ ' : ''}{({dados:'Com dados',vazia:'Base vazia',erro:'Simular erro'})[c]}</Text>
    </Pressable>)}</View>
    {status === 'sucesso' && <>
      <Text style={s.titulo}>{resumo.total} {trilha === 'eda' ? 'indicadores' : 'memórias'} no recorte</Text>
      <Text>{resumo.segundo} {trilha === 'eda' ? 'indicadores em atenção' : 'categorias representadas'}</Text>
      <Text accessibilityRole="header" style={s.titulo}>{trilha === 'eda' ? 'Percentuais · escala 0–100%' : 'Memórias por categoria'}</Text>
      {resumo.barras.map((b,i) => <View key={`${b.nome}-${i}`} style={s.barra}>
        <Text>{b.nome}: {b.valor} {b.unidade}</Text>
        <View style={s.trilho} accessible={false} importantForAccessibility="no-hide-descendants">
          <View style={[s.preenchimento, {width: `${b.largura}%` as `${number}%`}]}/>
        </View>
      </View>)}
      {trilha === 'eda' && visiveis.filter(x => x.unidade !== '%').map(x =>
        <Text key={String(x.id)}>{x.titulo} · {x.periodo}: {x.valor} {x.unidade}. Fora do eixo percentual.</Text>)}
    </>}
  </View>;

  // Lista única; não envolver FlatList em ScrollView da mesma orientação.
  return <View style={s.pagina}>
    <FlatList<Registro>
      data={status === 'sucesso' ? visiveis : []}
      renderItem={renderizarItem}
      keyExtractor={item => String(item.id)}
      ListHeaderComponent={topo}
      contentContainerStyle={s.conteudo}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={status === 'carregando' ? <View style={s.aviso}>
        <ActivityIndicator accessibilityLabel="Carregando"/><Text>Carregando registros...</Text>
      </View> : status === 'erro' ? <View style={s.aviso}>
        <Text>Não foi possível carregar os registros.</Text>
        <Pressable style={s.botao} onPress={tentarNovamente} accessibilityRole="button">
          <Text style={s.btnText}>Tentar novamente</Text>
        </Pressable>
      </View> : <View style={s.aviso}>
        <Text>{registros.length === 0 ? 'Nenhum registro disponível.' : 'Nenhum resultado para estes filtros.'}</Text>
        {registros.length > 0 && <Pressable style={s.botao} onPress={limpar} accessibilityRole="button">
          <Text style={s.btnText}>Limpar filtros</Text>
        </Pressable>}
      </View>}
    />
  </View>;
}
const s = StyleSheet.create({
  pagina:{flex:1,backgroundColor:'#ffffff'},conteudo:{padding:18,paddingBottom:40},
  topo:{gap:12},h1:{fontSize:26,fontWeight:'700',color:'#006b3c'},
  titulo:{fontSize:20,fontWeight:'700'},input:{borderWidth:1,borderColor:'#567763',padding:12,fontSize:18},
  linha:{flexDirection:'row',flexWrap:'wrap',gap:8},botao:{backgroundColor:'#edf7f0',borderWidth:1,borderColor:'#006b3c',padding:12,minHeight:48,borderRadius:5},
  selecionado:{backgroundColor:'#006b3c'},selecionadoTexto:{color:'#fff'},pressionado:{opacity:0.75},
  btnText:{color:'#006b3c',fontSize:17},cartao:{padding:16,marginVertical:8,borderWidth:1,borderColor:'#a8c7b4',gap:6},
  aviso:{paddingVertical:20,gap:14},barra:{gap:6},trilho:{height:18,backgroundColor:'#e3ece6'},preenchimento:{height:18,backgroundColor:'#196b98'}
});
