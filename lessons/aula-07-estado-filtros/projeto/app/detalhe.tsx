import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dados, rotulo } from '../src/dados.mjs';

export default function Detalhe() {
  const { id, trilha } = useLocalSearchParams<{ id: string; trilha: string }>();
  const base = trilha === 'eda' ? dados.eda : trilha === 'memorias' ? dados.memorias : [];
  const item = base.find(registro => String(registro.id) === id);
  return <SafeAreaView style={s.pagina}><ScrollView contentContainerStyle={s.conteudo}>
    <Text accessibilityRole="header" style={s.titulo}>{item?.titulo ?? 'Registro não encontrado'}</Text>
    <Text style={s.texto}>{item?.descricao ?? 'Este ID não existe na coleção da trilha selecionada.'}</Text>
    {item && <><Text style={s.texto}>Categoria: {rotulo(item.categoria)}</Text><Text style={s.texto}>ID: {String(item.id)}</Text>
      {item.valor !== undefined && <Text style={s.texto}>{item.valor} {item.unidade} · {item.periodo}</Text>}</>}
    <Text style={s.texto}>Exemplo fictício. O botão retorna à lista preservada no histórico.</Text>
    <Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
      style={({ pressed }) => [s.botao, pressed && { opacity: 0.75 }]}><Text style={s.botaoTexto}>Voltar à lista</Text></Pressable>
  </ScrollView></SafeAreaView>;
}
const s = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: '#f4f8f5' }, conteudo: { padding: 24, gap: 18, maxWidth: 900, width: '100%', alignSelf: 'center' },
  titulo: { fontSize: 28, fontWeight: '700', color: '#006b3c' }, texto: { fontSize: 18, lineHeight: 27, color: '#1e3829' },
  botao: { minHeight: 48, padding: 14, borderRadius: 6, backgroundColor: '#006b3c', justifyContent: 'center' }, botaoTexto: { fontSize: 18, color: '#fff', fontWeight: '700' }
});
