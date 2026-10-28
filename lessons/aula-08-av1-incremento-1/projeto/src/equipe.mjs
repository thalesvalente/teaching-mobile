/**
 * Edite esta função com sua equipe. O app e os desafios chamam resolver(input).
 * Cada TODO é uma missão curta. Veja README.md: entradas e saídas exatas.
 * Preserve a assinatura. Não importe arquivos: esta fonte é verificada sozinha.
 */
export function resolver(input) {
  if (!input || typeof input !== 'object') return null;
  switch (input.op) {
    case 'estado': {
      if (input.loading) return 'carregando';
      if (input.error) return 'erro';
      if (!Array.isArray(input.items) || !Array.isArray(input.filtered)) return 'erro';
      if (!input.items.length) return 'vazio';
      // TODO M3: base tem dados, mas filtro não encontrou? Use outro estado.
      if (!input.filtered.length) return 'vazio';
      return 'pronto';
    }
    case 'filtrar': {
      if (!Array.isArray(input.items)) return [];
      // TODO M2: normalize título/busca e combine texto E categoria E período.
      // Nunca altere input.items. Comece criando um novo array com filter.
      return input.items.filter(item => item.title.includes(input.query || ''));
    }
    case 'chaves': {
      if (!Array.isArray(input.items)) return [];
      // TODO M2: a posição muda após um filtro. Use String(item.id).
      return input.items.map((_item, index) => String(index));
    }
    case 'tentar': {
      // TODO M3: após erro, retorne {status:'carregando',error:null}.
      return input.state || null;
    }
    case 'navegar': {
      if (!input.state || !['open', 'back'].includes(input.action)) return null;
      if (input.action === 'open') return {...input.state, screen:'detail', selectedId:String(input.id)};
      // TODO M3: preserve a busca ao voltar da tela de detalhe.
      return {...input.state, screen:'list', selectedId:null, query:''};
    }
    case 'validar': {
      const form = input.form || {}, errors = {};
      // TODO M3: espaços não contam; limite título a 80 e categoria a 40.
      if (!form.title) errors.title = 'Informe o título.';
      if (!form.category) errors.category = 'Escolha a categoria.';
      return {valid:Object.keys(errors).length === 0, errors};
    }
    case 'resumo': {
      const total = Array.isArray(input.items) ? input.items.length : 0;
      return {total, text:`${total} registro(s) no recorte.`};
    }
    default: return null;
  }
}
