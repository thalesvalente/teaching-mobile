export type Registro = { id: string; titulo: string; descricao: string; categoria: string; periodo: string; trilha: 'memorias' | 'eda' };

/** Dados demonstrativos fictícios. Não representam pessoas, comunidades ou estudantes reais. */
export const SEED: Registro[] = [
  {id:'m-01',titulo:'Fotografia da praça',descricao:'Registro fictício do espaço público.',categoria:'Lugar',periodo:'Manhã',trilha:'memorias'},
  {id:'m-02',titulo:'Memória da feira',descricao:'Descrição fictícia de uma feira local.',categoria:'Evento',periodo:'Tarde',trilha:'memorias'},
  {id:'m-03',titulo:'Mapa da praça',descricao:'Mapa demonstrativo de pontos de memória.',categoria:'Lugar',periodo:'Noite',trilha:'memorias'},
  {id:'e-01',titulo:'Frequência agregada',descricao:'Indicador demonstrativo, sem dados pessoais.',categoria:'Indicador',periodo:'Manhã',trilha:'eda'},
  {id:'e-02',titulo:'Ação de acolhimento',descricao:'Ação de apoio fictícia da equipe.',categoria:'Ação',periodo:'Tarde',trilha:'eda'},
  {id:'e-03',titulo:'Indicador de permanência',descricao:'Dados simulados para o protótipo.',categoria:'Indicador',periodo:'Noite',trilha:'eda'}
];
