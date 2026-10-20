export type Trilha = 'memorias' | 'eda';
export type Status = 'carregando' | 'sucesso' | 'erro';
export type Tela = 'carregando' | 'erro' | 'vazia' | 'semResultado' | 'conteudo';
export type Registro = {
  id: string | number;
  titulo: string;
  descricao: string;
  categoria: string;
  periodo?: string;
  valor?: number;
  unidade?: string;
};
export type Linha = { key: string; item: Registro };
export type Barra = { nome: string; valor: number; unidade: string; largura: number; texto: string };
export type Resumo = { total: number; segundo: number; barras: Barra[] };
