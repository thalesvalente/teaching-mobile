// Funções da aplicação, não APIs do Expo. Preservam a coleção recebida.
export type Trilha = 'memorias' | 'eda';
export type Registro = {
  id: string | number;
  titulo: string;
  categoria: string;
  descricao?: string;
  periodo?: string;
  valor?: number;
  unidade?: string;
};
export const normalizar = (texto: string): string => texto.trim().toLowerCase();
export function filtrar(
  registros: readonly Registro[], busca: string,
  categoria = 'Todas', periodo = 'Todos'
): Registro[] {
  const termo = normalizar(busca);
  return registros.filter(item => {
    const textoOk = normalizar(item.titulo).includes(termo);
    const categoriaOk = categoria === 'Todas' || item.categoria === categoria;
    const periodoOk = periodo === 'Todos' || item.periodo === periodo;
    return textoOk && categoriaOk && periodoOk;
  });
}
export function resumir(visiveis: readonly Registro[], trilha: Trilha) {
  if (trilha === 'memorias') {
    const categorias = [...new Set(visiveis.map(item => item.categoria))];
    const valores = categorias.map(nome => ({
      nome, valor: visiveis.filter(item => item.categoria === nome).length,
      unidade: 'memórias'
    }));
    const maior = Math.max(1, ...valores.map(item => item.valor));
    return {
      total: visiveis.length, segundo: categorias.length,
      barras: valores.map(item => ({ ...item, largura: 100 * item.valor / maior }))
    };
  }
  return {
    total: visiveis.length,
    segundo: visiveis.filter(item => item.categoria === 'atencao').length,
    // Mesma unidade e escala; quantidades em estudantes ficam fora das barras.
    barras: visiveis.filter(item => item.unidade === '%' &&
      typeof item.valor === 'number' && Number.isFinite(item.valor) &&
      item.valor >= 0 && item.valor <= 100
    ).map(item => ({
      nome: `${item.titulo} · ${item.periodo ?? 'sem período'}`,
      valor: item.valor!, unidade: '%', largura: item.valor!
    }))
  };
}
