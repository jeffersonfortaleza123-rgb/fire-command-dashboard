export type Graduacao = 'SD' | 'CB' | '3º SGT' | '2º SGT' | '1º SGT' | 'TEN';

export type Funcao = 
  | 'Motorista B' 
  | 'Motorista D' 
  | 'Piloto' 
  | 'Chefe de Guarnição' 
  | 'Outros';

export type Guarnicao = 'ALFA' | 'BRAVO' | 'CHARLIE' | 'DELTA';

export type TipoServico = 'O' | 'P' | 'R' | 'E' | 'CIF' | 'D' | 'U' | 'X' | '';

export interface Militar {
  id: string;
  nome: string;
  matricula: string;
  graduacao: Graduacao;
  funcao: Funcao;
  funcaoCustom?: string;
  guarnicao: Guarnicao;
}

export interface EscalaDia {
  militarId: string;
  dia: number;
  tipo: TipoServico;
}

export interface EscalaMes {
  mes: number; // 0-11
  ano: number;
  escalas: EscalaDia[];
}

export interface Permuta {
  id: string;
  numero: number;
  militar1Id: string;
  dia1: number;
  militar2Id: string;
  dia2: number;
  mes: number;
  ano: number;
  processoSei?: string;
  situacao: 'pendente' | 'assinada' | 'executada' | 'cancelada';
  status: 'pendente' | 'executada' | 'cancelada';
  dataExecucao?: string;
}

export type NivelAlerta = 'critico' | 'importante' | 'informativo';

export interface Alerta {
  dia: number;
  nivel: NivelAlerta;
  mensagem: string;
  impacto: string;
}

export const GRADUACOES: Graduacao[] = ['SD', 'CB', '3º SGT', '2º SGT', '1º SGT', 'TEN'];
export const FUNCOES: Funcao[] = ['Motorista B', 'Motorista D', 'Piloto', 'Chefe de Guarnição', 'Outros'];
export const GUARNICOES: Guarnicao[] = ['ALFA', 'BRAVO', 'CHARLIE', 'DELTA'];

export const TIPOS_SERVICO: { valor: TipoServico; label: string; cor: string }[] = [
  { valor: 'O', label: 'Serviço Operacional - Ordinário', cor: 'bg-green-600 text-white' },
  { valor: 'P', label: 'Serviço Operacional - PJES 24H', cor: 'bg-yellow-400 text-black' },
  { valor: 'R', label: 'Serviço Rabecão - 24H', cor: 'bg-purple-600 text-white' },
  { valor: 'E', label: 'Expediente Administrativo', cor: 'bg-blue-500 text-white' },
  { valor: 'D', label: 'Serviço Operacional - 12H 1º Turno', cor: 'bg-orange-500 text-white' },
  { valor: 'U', label: 'Serviço Operacional - 12H 2º Turno', cor: 'bg-orange-700 text-white' },
  { valor: 'X', label: 'Serviço Extra', cor: 'bg-red-600 text-white' },
  { valor: 'CIF', label: 'Combate a Incêndio Florestal', cor: 'bg-red-800 text-white' },
  { valor: '', label: 'Limpar', cor: '' },
];

export const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
