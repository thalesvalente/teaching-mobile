// Dados inventados para aprender. Nenhum registro descreve uma pessoa real.
/** @type {import('./tipos').Registro[]} */
export const memorias = [
  { id: 'm1', titulo: 'Roda de histórias', descricao: 'Encontro fictício de narrativas.', categoria: 'Relato' },
  { id: 'm2', titulo: 'Praça das conversas', descricao: 'Lugar fictício de convivência.', categoria: 'Lugar' },
  { id: 'm3', titulo: 'Festa da colheita', descricao: 'Celebração inventada para a aula.', categoria: 'Celebração' },
  { id: 'm4', titulo: 'História do caminho', descricao: 'Narrativa fictícia sobre um caminho.', categoria: 'Relato' },
  { id: 'm5', titulo: 'Casa de encontros', descricao: 'Espaço inventado de reunião.', categoria: 'Lugar' },
  { id: 'm6', titulo: 'Cantigas da praça', descricao: 'Celebração fictícia para praticar filtros.', categoria: 'Celebração' }
];
/** @type {import('./tipos').Registro[]} */
export const eda = [
  { id: 'i1', titulo: 'Frequência média', descricao: 'Percentual fictício, sem identificação individual.', categoria: 'atencao', periodo: 'Semana 1', valor: 88, unidade: '%' },
  { id: 'i2', titulo: 'Atividades entregues', descricao: 'Percentual fictício de entregas.', categoria: 'adequado', periodo: 'Semana 1', valor: 94, unidade: '%' },
  { id: 'i3', titulo: 'Estudantes em acompanhamento', descricao: 'Quantidade inteiramente inventada.', categoria: 'atencao', periodo: 'Semana 1', valor: 7, unidade: 'estudantes' },
  { id: 'i4', titulo: 'Frequência média', descricao: 'Percentual de outra semana inventada.', categoria: 'adequado', periodo: 'Semana 2', valor: 91, unidade: '%' },
  { id: 'i5', titulo: 'Atividades entregues', descricao: 'Percentual fictício de outro período.', categoria: 'atencao', periodo: 'Semana 2', valor: 86, unidade: '%' },
  { id: 'i6', titulo: 'Estudantes em acompanhamento', descricao: 'Quantidade de outro período inventado.', categoria: 'adequado', periodo: 'Semana 2', valor: 5, unidade: 'estudantes' }
];
export const dados = { memorias, eda };
export const rotulo = (valor) => ({ atencao: 'Em atenção', adequado: 'Adequado' }[valor] || valor);
