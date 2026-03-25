import { useState } from 'react';
import { useStore, getDaysInMonth } from '@/store/useStore';
import { MESES, TIPOS_SERVICO, GUARNICOES } from '@/types/firefighter';
import type { TipoServico } from '@/types/firefighter';
import { CalendarDays, Plus, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function EscalaPage() {
  const { militares, mesAtual, anoAtual, setMesAtual, setAnoAtual, getEscalaMes, setEscalaDia, criarMes, copiarMesAnterior, getAlertasDia } = useStore();
  const [filterGuarnicao, setFilterGuarnicao] = useState<string>('all');

  const escala = getEscalaMes(mesAtual, anoAtual);
  const diasNoMes = getDaysInMonth(mesAtual, anoAtual);

  const filteredMilitares = filterGuarnicao === 'all'
    ? militares
    : militares.filter(m => m.guarnicao === filterGuarnicao);

  const getServico = (militarId: string, dia: number): TipoServico => {
    const e = escala.escalas.find(e => e.militarId === militarId && e.dia === dia);
    return e?.tipo || '';
  };

  const servicoColor = (tipo: TipoServico) => {
    switch (tipo) {
      case 'O': return 'bg-status-ok/20 text-status-ok border-status-ok/30';
      case 'P': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'R': return 'bg-muted text-muted-foreground border-border';
      case 'E': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'CIF': return 'bg-status-critical/20 text-status-critical border-status-critical/30';
      default: return 'bg-transparent text-muted-foreground/30 border-border/50';
    }
  };

  const prevMes = () => {
    if (mesAtual === 0) { setMesAtual(11); setAnoAtual(anoAtual - 1); }
    else setMesAtual(mesAtual - 1);
  };
  const nextMes = () => {
    if (mesAtual === 11) { setMesAtual(0); setAnoAtual(anoAtual + 1); }
    else setMesAtual(mesAtual + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="fire-gradient rounded-lg p-2.5">
            <CalendarDays className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Escala Mensal</h1>
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

      {/* Month tabs */}
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
      <div className="flex gap-3">
        <Select value={filterGuarnicao} onValueChange={setFilterGuarnicao}>
          <SelectTrigger className="w-[180px] bg-input border-border text-foreground"><SelectValue placeholder="Guarnição" /></SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Todas guarnições</SelectItem>
            {GUARNICOES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Schedule grid */}
      <div className="bg-card border border-border rounded-lg overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border">
              <th className="text-left p-2 font-display tracking-wider text-muted-foreground sticky left-0 bg-card min-w-[160px]">MILITAR</th>
              {Array.from({ length: diasNoMes }, (_, i) => {
                const dia = i + 1;
                const alertas = getAlertasDia(mesAtual, anoAtual, dia);
                const hasCritico = alertas.some(a => a.nivel === 'critico');
                return (
                  <th
                    key={dia}
                    className={`p-2 text-center font-display min-w-[36px] ${
                      hasCritico ? 'text-status-critical' : 'text-muted-foreground'
                    }`}
                    title={alertas.map(a => a.mensagem).join('\n')}
                  >
                    {dia}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredMilitares.length === 0 ? (
              <tr><td colSpan={diasNoMes + 1} className="p-8 text-center text-muted-foreground">Cadastre militares primeiro</td></tr>
            ) : filteredMilitares.map(mil => (
              <tr key={mil.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-2 sticky left-0 bg-card font-medium text-foreground whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-primary/20 text-secondary px-1 rounded">{mil.graduacao}</span>
                    <span className="truncate max-w-[120px]">{mil.nome}</span>
                  </div>
                </td>
                {Array.from({ length: diasNoMes }, (_, i) => {
                  const dia = i + 1;
                  const tipo = getServico(mil.id, dia);
                  return (
                    <td key={dia} className="p-0.5 text-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className={`w-full h-7 rounded border text-[10px] font-bold transition-colors ${servicoColor(tipo)}`}>
                            {tipo || '·'}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-1 bg-popover border-border" side="bottom">
                          <div className="flex flex-col gap-0.5">
                            {TIPOS_SERVICO.map(ts => (
                              <button
                                key={ts.valor}
                                onClick={() => setEscalaDia(mesAtual, anoAtual, mil.id, dia, ts.valor)}
                                className={`px-3 py-1.5 text-xs rounded text-left hover:bg-muted transition-colors ${
                                  tipo === ts.valor ? 'bg-muted text-foreground' : 'text-muted-foreground'
                                }`}
                              >
                                {ts.valor ? <><span className="font-bold mr-2">{ts.valor}</span>{ts.label}</> : 'Limpar'}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
