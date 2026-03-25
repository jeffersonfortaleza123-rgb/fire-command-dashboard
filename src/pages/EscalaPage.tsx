import { useState, useMemo } from 'react';
import { useStore, getDaysInMonth } from '@/store/useStore';
import { MESES, TIPOS_SERVICO, GUARNICOES, DIAS_SEMANA } from '@/types/firefighter';
import type { TipoServico, Guarnicao } from '@/types/firefighter';
import { CalendarDays, Plus, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function getDayOfWeek(ano: number, mes: number, dia: number): string {
  const d = new Date(ano, mes, dia);
  return DIAS_SEMANA[d.getDay()];
}

function isWeekend(ano: number, mes: number, dia: number): boolean {
  const d = new Date(ano, mes, dia);
  return d.getDay() === 0 || d.getDay() === 6;
}

const servicoColorCell = (tipo: TipoServico) => {
  switch (tipo) {
    case 'O': return 'bg-green-600 text-white';
    case 'P': return 'bg-yellow-400 text-black';
    case 'R': return 'bg-purple-600 text-white';
    case 'E': return 'bg-blue-500 text-white';
    case 'D': return 'bg-orange-500 text-white';
    case 'U': return 'bg-orange-700 text-white';
    case 'X': return 'bg-red-600 text-white';
    case 'CIF': return 'bg-red-800 text-white';
    default: return 'bg-transparent';
  }
};

const guarnicaoColor = (g: Guarnicao) => {
  switch (g) {
    case 'ALFA': return 'bg-yellow-500 text-black';
    case 'BRAVO': return 'bg-blue-600 text-white';
    case 'CHARLIE': return 'bg-green-700 text-white';
    case 'DELTA': return 'bg-red-700 text-white';
  }
};

export default function EscalaPage() {
  const { militares, mesAtual, anoAtual, setMesAtual, setAnoAtual, getEscalaMes, setEscalaDia, criarMes, copiarMesAnterior, getAlertasDia } = useStore();
  const [filterGuarnicao, setFilterGuarnicao] = useState<string>('all');

  const escala = getEscalaMes(mesAtual, anoAtual);
  const diasNoMes = getDaysInMonth(mesAtual, anoAtual);
  const dias = Array.from({ length: diasNoMes }, (_, i) => i + 1);

  const filteredMilitares = filterGuarnicao === 'all'
    ? militares
    : militares.filter(m => m.guarnicao === filterGuarnicao);

  // Group by guarnicao
  const guarnicoes = useMemo(() => {
    const groups: Record<string, typeof filteredMilitares> = {};
    filteredMilitares.forEach(m => {
      if (!groups[m.guarnicao]) groups[m.guarnicao] = [];
      groups[m.guarnicao].push(m);
    });
    return Object.entries(groups);
  }, [filteredMilitares]);

  const getServico = (militarId: string, dia: number): TipoServico => {
    const e = escala.escalas.find(e => e.militarId === militarId && e.dia === dia);
    return e?.tipo || '';
  };

  // Count services per militar
  const countServicos = (militarId: string): number => {
    return escala.escalas.filter(e => e.militarId === militarId && e.tipo !== '').length;
  };

  const prevMes = () => {
    if (mesAtual === 0) { setMesAtual(11); setAnoAtual(anoAtual - 1); }
    else setMesAtual(mesAtual - 1);
  };
  const nextMes = () => {
    if (mesAtual === 11) { setMesAtual(0); setAnoAtual(anoAtual + 1); }
    else setMesAtual(mesAtual + 1);
  };

  // Count per day
  const militaresPerDay = dias.map(dia => {
    return escala.escalas.filter(e => e.dia === dia && (e.tipo === 'O' || e.tipo === 'P' || e.tipo === 'D' || e.tipo === 'U')).length;
  });

  // Function description for each militar
  const getFuncDesc = (mil: typeof militares[0]) => {
    const parts: string[] = [];
    if (mil.graduacao !== 'SD') parts.push('Graduado');
    if (mil.funcao === 'Motorista D') parts.push('Motorista D');
    if (mil.funcao === 'Motorista B') parts.push('Motorista B');
    if (mil.funcao === 'Piloto') parts.push('Piloto');
    if (mil.funcao === 'Chefe de Guarnição') parts.push('Chefe');
    return parts.join(', ');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="fire-gradient rounded-lg p-2.5">
            <CalendarDays className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Escala de Serviço</h1>
            <p className="text-xs text-muted-foreground">CORPO DE BOMBEIROS MILITAR</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => copiarMesAnterior(mesAtual, anoAtual)} className="text-xs border-border text-muted-foreground hover:text-foreground">
            <Copy className="h-3.5 w-3.5 mr-1" /> Copiar Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => criarMes(mesAtual, anoAtual)} className="text-xs border-border text-muted-foreground hover:text-foreground">
            <Plus className="h-3.5 w-3.5 mr-1" /> Criar Mês
          </Button>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={prevMes} className="text-muted-foreground hover:text-foreground shrink-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {MESES.map((m, i) => (
            <button
              key={m}
              onClick={() => setMesAtual(i)}
              className={`px-3 py-1.5 rounded text-xs font-display tracking-wider whitespace-nowrap transition-colors ${
                i === mesAtual
                  ? 'fire-gradient text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {m.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={nextMes} className="text-muted-foreground hover:text-foreground shrink-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-lg font-display text-foreground ml-2">{anoAtual}</span>
      </div>

      {/* Filter */}
      <div className="flex gap-3 items-center">
        <Select value={filterGuarnicao} onValueChange={setFilterGuarnicao}>
          <SelectTrigger className="w-[180px] bg-input border-border text-foreground"><SelectValue placeholder="Guarnição" /></SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Todas guarnições</SelectItem>
            {GUARNICOES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Schedule grid - PDF-style */}
      <div className="bg-card border border-border rounded-lg overflow-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 z-10">
            {/* Day numbers row */}
            <tr className="bg-muted border-b border-border">
              <th className="text-left p-1.5 font-display tracking-wider text-muted-foreground sticky left-0 bg-muted min-w-[60px] border-r border-border text-[9px]">FUNÇÃO</th>
              <th className="text-left p-1.5 font-display tracking-wider text-muted-foreground sticky left-[60px] bg-muted min-w-[50px] border-r border-border text-[9px]">GRAD.</th>
              <th className="text-left p-1.5 font-display tracking-wider text-muted-foreground sticky left-[110px] bg-muted min-w-[120px] border-r border-border text-[9px]">NOME</th>
              <th className="text-center p-1.5 font-display tracking-wider text-muted-foreground sticky left-[230px] bg-muted min-w-[65px] border-r border-border text-[9px]">MAT.</th>
              {dias.map(dia => {
                const alertas = getAlertasDia(mesAtual, anoAtual, dia);
                const hasCritico = alertas.some(a => a.nivel === 'critico');
                const weekend = isWeekend(anoAtual, mesAtual, dia);
                return (
                  <th
                    key={dia}
                    className={`p-1 text-center font-display min-w-[28px] border-r border-border ${
                      hasCritico ? 'text-red-500' : weekend ? 'text-yellow-500' : 'text-muted-foreground'
                    } ${weekend ? 'bg-muted/80' : 'bg-muted'}`}
                    title={alertas.map(a => a.mensagem).join('\n')}
                  >
                    {String(dia).padStart(2, '0')}
                  </th>
                );
              })}
              <th className="p-1.5 text-center font-display tracking-wider text-muted-foreground bg-muted min-w-[35px] text-[9px]">QTD</th>
            </tr>
            {/* Day of week row */}
            <tr className="bg-muted/60 border-b border-border">
              <th className="sticky left-0 bg-muted/60 border-r border-border" />
              <th className="sticky left-[60px] bg-muted/60 border-r border-border" />
              <th className="sticky left-[110px] bg-muted/60 border-r border-border" />
              <th className="sticky left-[230px] bg-muted/60 border-r border-border" />
              {dias.map(dia => {
                const dow = getDayOfWeek(anoAtual, mesAtual, dia);
                const weekend = isWeekend(anoAtual, mesAtual, dia);
                return (
                  <th key={dia} className={`p-0.5 text-center text-[9px] font-bold border-r border-border ${
                    weekend ? 'text-yellow-500' : 'text-muted-foreground'
                  }`}>
                    {dow}
                  </th>
                );
              })}
              <th className="bg-muted/60" />
            </tr>
          </thead>
          <tbody>
            {guarnicoes.length === 0 ? (
              <tr><td colSpan={diasNoMes + 5} className="p-8 text-center text-muted-foreground">Cadastre militares primeiro</td></tr>
            ) : guarnicoes.map(([guarnicao, mils]) => (
              <>
                {/* Guarnicao header */}
                <tr key={`header-${guarnicao}`}>
                  <td colSpan={diasNoMes + 5} className={`p-1.5 font-display text-xs tracking-widest font-bold ${guarnicaoColor(guarnicao as Guarnicao)} border-b border-border`}>
                    GUARNIÇÃO {guarnicao}
                  </td>
                </tr>
                {/* Militares */}
                {mils.map(mil => {
                  const qtd = countServicos(mil.id);
                  return (
                    <tr key={mil.id} className="border-b border-border/30 hover:bg-muted/10">
                      <td className="p-1 sticky left-0 bg-card text-[9px] text-muted-foreground border-r border-border/50 whitespace-nowrap">
                        {getFuncDesc(mil)}
                      </td>
                      <td className="p-1 sticky left-[60px] bg-card text-[10px] font-bold text-secondary border-r border-border/50 whitespace-nowrap">
                        {mil.graduacao}
                      </td>
                      <td className="p-1 sticky left-[110px] bg-card text-foreground border-r border-border/50 whitespace-nowrap font-medium">
                        {mil.nome}
                      </td>
                      <td className="p-1 sticky left-[230px] bg-card text-muted-foreground text-center border-r border-border/50 text-[9px]">
                        {mil.matricula}
                      </td>
                      {dias.map(dia => {
                        const tipo = getServico(mil.id, dia);
                        const weekend = isWeekend(anoAtual, mesAtual, dia);
                        return (
                          <td key={dia} className={`p-0 text-center border-r border-border/30 ${weekend ? 'bg-muted/20' : ''}`}>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className={`w-full h-6 text-[10px] font-bold transition-colors ${tipo ? servicoColorCell(tipo) : 'hover:bg-muted/30'}`}>
                                  {tipo || ''}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-1 bg-popover border-border" side="bottom">
                                <div className="flex flex-col gap-0.5">
                                  {TIPOS_SERVICO.map(ts => (
                                    <button
                                      key={ts.valor}
                                      onClick={() => setEscalaDia(mesAtual, anoAtual, mil.id, dia, ts.valor)}
                                      className={`px-3 py-1.5 text-xs rounded text-left hover:bg-muted transition-colors flex items-center gap-2 ${
                                        tipo === ts.valor ? 'bg-muted text-foreground' : 'text-muted-foreground'
                                      }`}
                                    >
                                      {ts.valor && <span className={`w-5 h-4 rounded text-[9px] font-bold flex items-center justify-center ${ts.cor}`}>{ts.valor}</span>}
                                      <span>{ts.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </td>
                        );
                      })}
                      <td className="p-1 text-center font-bold text-foreground bg-muted/30">
                        {qtd}
                      </td>
                    </tr>
                  );
                })}
              </>
            ))}
            {/* Totals row */}
            {filteredMilitares.length > 0 && (
              <tr className="bg-muted/50 border-t-2 border-border">
                <td colSpan={4} className="p-1.5 sticky left-0 bg-muted/50 text-[10px] font-display tracking-wider text-muted-foreground font-bold">
                  MILITARES POR DIA
                </td>
                {dias.map((dia, i) => (
                  <td key={dia} className={`p-1 text-center text-[10px] font-bold border-r border-border/30 ${
                    militaresPerDay[i] === 0 ? 'text-red-500' : militaresPerDay[i] < 5 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {militaresPerDay[i]}
                  </td>
                ))}
                <td className="p-1 text-center font-bold text-foreground bg-muted/30">
                  {militaresPerDay.reduce((a, b) => a + b, 0)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-xs font-display tracking-wider text-muted-foreground mb-3">LEGENDA</h3>
        <div className="flex flex-wrap gap-3">
          {TIPOS_SERVICO.filter(t => t.valor).map(t => (
            <div key={t.valor} className="flex items-center gap-1.5">
              <span className={`w-6 h-5 rounded text-[10px] font-bold flex items-center justify-center ${t.cor}`}>{t.valor}</span>
              <span className="text-xs text-muted-foreground">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
