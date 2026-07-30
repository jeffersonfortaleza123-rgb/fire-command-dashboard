# Fire Command Dashboard

Crie um sistema completo de gestão de escala operacional para bombeiros, otimizado para uso em desktop (computadores), com interface profissional, moderna e tema visual “FireFighter”.

🎨 1. DESIGN E INTERFACE (DESKTOP)

Interface otimizada para telas grandes (desktop)

Layout em painel administrativo (dashboard)

Menu lateral fixo (sidebar)

Área principal ampla para visualização de dados

Tema visual “FireFighter”:

Cores principais:

Vermelho escuro (#8B0000)

Laranja (#FF6B00)

Preto (#121212)

Cinza escuro (#2A2A2A)

Destaques:

Verde (OK)

Amarelo (Atenção)

Vermelho (Crítico)

Elementos visuais:

Ícones de bombeiro, viatura, alerta, helicóptero

Estilo moderno, profissional, operacional

Interface limpa e rápida

🧱 2. ESTRUTURA DO SISTEMA (MENU LATERAL)

Menu lateral com as abas:

Dashboard

Escala Mensal

Permutas

Permutas do Dia

Militares

Alertas

Relatórios

Configurações

📅 3. SISTEMA DE MESES (MULTI-ABAS)

No topo do sistema:

[ Janeiro ] [ Fevereiro ] [ Março ] [ + Novo mês ]

Funcionalidades:

Criar novo mês

Definir ano

Copiar escala do mês anterior

Alternar entre meses sem recarregar

👤 4. CADASTRO DE MILITARES

Campos obrigatórios:

Nome completo

Matrícula

Graduação:

SD, CB, SGT, TEN

Funções:

Motorista categoria B

Motorista categoria D

Piloto

Chefe de guarnição

Outros (editável)

Guarnição:

ALFA, BRAVO, CHARLIE, DELTA

Funcionalidades:

Criar, editar e excluir militares

Filtro por função e guarnição

📊 5. ESCALA MENSAL (VISUAL PRINCIPAL)

Tabela com dias do mês (01 a 28/30/31)

Linhas com militares

Células com tipo de serviço:

O (Operacional)

P (Plantão)

R (Reserva)

E (Expediente)

CIF (Incêndio Florestal)

Cores:

Verde = OK

Amarelo = Atenção

Vermelho = Erro crítico

Funcionalidades:

Clique para editar escala

Atualização em tempo real

Visualização por guarnição

🚨 6. VALIDAÇÃO AUTOMÁTICA (REGRAS)

Validar cada dia automaticamente:

Mínimo 1 graduado

Mínimo 1 chefe de guarnição

Mínimo 2 motoristas categoria D

Mínimo 1 piloto

Classificação:

CRÍTICO:

Falta chefe

Falta piloto

Menos de 2 motoristas D

IMPORTANTE:

Falta graduado

INFORMATIVO:

Desbalanceamento

Mostrar:

Mensagem

Impacto operacional

🔁 7. MÓDULO DE PERMUTAS

Tela com formulário:

Campos:

Militar 1

Dia do Militar 1

Militar 2

Dia do Militar 2

Número da permuta

Botões:

Validar permuta

Executar permuta

Cancelar

Validações:

Ambos devem estar escalados

Não pode haver conflito

Não pode quebrar regras

Ao executar:

Troca automática

Registro da permuta

📋 8. GERENCIAMENTO DE PERMUTAS

Tabela com:

Número

Militar 1 + dia

Militar 2 + dia

Status

Impacto

Ações:

Excluir permuta

Ao excluir:

Reverter troca automaticamente

Atualizar escala

📅 9. ABA “PERMUTAS DO DIA”

Detectar automaticamente o dia atual

Listar todas as permutas do dia

Exibir:

Total de permutas

Permutas críticas

Permutas seguras

Tabela:

Nº

Militares envolvidos

Impacto

Status

Alertas:

Banner no topo

Atualização automática

🤖 10. INTELIGÊNCIA ARTIFICIAL

Criar assistente com chat:

Funções:

Analisar escala

Detectar erros

Sugerir permutas

Corrigir escala

Responder perguntas

Exemplos:
"Analise a escala"
"Tem erro hoje?"
"Corrija o dia 10"

A IA deve:

Priorizar funções críticas

Evitar efeito dominó

Explicar decisões

⚙️ 11. MOTOR DE OTIMIZAÇÃO

Botão:

"Corrigir escala automaticamente"

Função:

Resolver problemas

Ajustar militares

Manter equilíbrio

📊 12. DASHBOARD

Exibir:

Total de militares por dia

Dias com erro

Dias OK

Militar mais sobrecarregado

Militar menos utilizado

📁 13. EXPORTAÇÃO PARA EXCEL

Botão:

"Exportar para Excel"

Gerar arquivo com abas:

Escala

Permutas

Alertas

Resumo

Permitir:

Exportar mês atual

Exportar todos os meses

🔔 14. ALERTAS E NOTIFICAÇÕES

Alertas visuais em tempo real

Aviso de permutas do dia

Aviso de erros críticos

🎯 OBJETIVO FINAL

Criar um sistema completo, inteligente e profissional de gestão de escala operacional, com foco em confiabilidade, automação, análise inteligente e uso em ambiente operacional de bombeiros.

O sistema deve ser robusto, rápido, intuitivo e preparado para uso real em quartéis.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/45bcd48e-c714-4bdb-8473-3d9487b86f17).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
