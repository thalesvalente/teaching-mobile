import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

// Documento da versão Web; não interfere no aplicativo nativo.
export default function Html({ children }: PropsWithChildren) {
  return <html lang="pt-BR"><head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Quatro missões de estado, filtros, listas e visualização de dados, com pontuação formativa durante a implementação." />
    <ScrollViewStyleReset />
    <style>{`:focus-visible{outline:3px solid #196b98!important;outline-offset:3px}body{margin:0}*{box-sizing:border-box}`}</style>
  </head><body>{children}</body></html>;
}
