export type Graduacao = 'SD' | 'CB' | 'SGT' | 'TEN';

export type Funcao = 
  | 'Motorista B' 
  | 'Motorista D' 
  | 'Piloto' 
  | 'Chefe de Guarnição' 
  | 'Outros';

export type Guarnicao = 'ALFA' | 'BRAVO' | 'CHARLIE' | 'DELTA';

export type TipoServico = 'O' | 'P' | 'R' | 'E' | 'CIF' | '';

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

export const GRADUACOES: Graduacao[] = ['SD', 'CB', 'SGT', 'TEN'];
export const FUNCOES: Funcao[] = ['Motorista B', 'Motorista D', 'Piloto', 'Chefe de Guarnição', 'Outros'];
export const GUARNICOES: Guarnicao[] = ['ALFA', 'BRAVO', 'CHARLIE', 'DELTA'];
export const TIPOS_SERVICO: { valor: TipoServico; label: string }[] = [
  { valor: 'O', label: 'Operacional' },
  { valor: 'P', label: 'Plantão' },
  { valor: 'R', label: 'Reserva' },
  { valor: 'E', label: 'Expediente' },
  { valor: 'CIF', label: 'Inc. Florestal' },
  { valor: '', label: 'Vazio' },
];

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
