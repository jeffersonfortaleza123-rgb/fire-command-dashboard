import { useStore, getDaysInMonth } from '@/store/useStore';
import { MESES } from '@/types/firefighter';
import { Flame, Users, AlertTriangle, CheckCircle, Shield, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { militares, mesAtual, anoAtual, getEscalaMes, getAlertasDia } = useStore();
  const escala = getEscalaMes(mesAtual, anoAtual);
  const diasNoMes = getDaysInMonth(mesAtual, anoAtual);

  let diasOk = 0;
  let diasErro = 0;
  const contagem: Record<string, number> = {};

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const alertas = getAlertasDia(mesAtual, anoAtual, dia);
    const hasCritico = alertas.some(a => a.nivel === 'critico');
    if (hasCritico) diasErro++;
    else diasOk++;

    const escalaDia = escala.escalas.filter(e => e.dia === dia && (e.tipo === 'O' || e.tipo === 'P'));
    escalaDia.forEach(e => {
      contagem[e.militarId] = (contagem[e.militarId] || 0) + 1;
    });
  }

  const entries = Object.entries(contagem);
  const maisSobrecarregado = entries.length > 0
    ? entries.reduce((a, b) => a[1] > b[1] ? a : b)
    : null;
  const menosUtilizado = entries.length > 0
    ? entries.reduce((a, b) => a[1] < b[1] ? a : b)
    : null;

  const getNome = (id: string) => militares.find(m => m.id === id)?.nome || 'N/A';

  const cards = [
    { title: 'Total Militares', value: militares.length, icon: Users, color: 'text-secondary' },
    { title: 'Dias OK', value: diasOk, icon: CheckCircle, color: 'status-ok-text' },
    { title: 'Dias com Erro', value: diasErro, icon: AlertTriangle, color: 'status-critical-text' },
    { title: 'Cobertura', value: `${diasNoMes > 0 ? Math.round((diasOk / diasNoMes) * 100) : 0}%`, icon: Shield, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="fire-gradient rounded-lg p-2.5">
          <Flame className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{MESES[mesAtual]} {anoAtual}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="bg-card border border-border rounded-lg p-5 hover:border-secondary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-display tracking-wider">{card.title.toUpperCase()}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-bold font-display text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-display text-foreground">MAIS SOBRECARREGADO</h2>
          </div>
          {maisSobrecarregado ? (
            <div className="flex items-center justify-between">
              <span className="text-foreground">{getNome(maisSobrecarregado[0])}</span>
              <span className="text-secondary font-bold">{maisSobrecarregado[1]} dias</span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Sem dados</p>
          )}
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-status-ok rotate-180" />
            <h2 className="text-lg font-display text-foreground">MENOS UTILIZADO</h2>
          </div>
          {menosUtilizado ? (
            <div className="flex items-center justify-between">
              <span className="text-foreground">{getNome(menosUtilizado[0])}</span>
              <span className="text-status-ok font-bold">{menosUtilizado[1]} dias</span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Sem dados</p>
          )}
        </div>
      </div>

      {/* Daily overview */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-lg font-display text-foreground mb-4">VISÃO DO MÊS</h2>
        <div className="grid grid-cols-7 md:grid-cols-10 lg:grid-cols-15 gap-2">
          {Array.from({ length: diasNoMes }, (_, i) => i + 1).map(dia => {
            const alertas = getAlertasDia(mesAtual, anoAtual, dia);
            const hasCritico = alertas.some(a => a.nivel === 'critico');
            const hasImportante = alertas.some(a => a.nivel === 'importante');
            const escalaDia = escala.escalas.filter(e => e.dia === dia);
            const hasEscala = escalaDia.length > 0;

            let bgClass = 'bg-muted';
            if (hasEscala && hasCritico) bgClass = 'status-critical';
            else if (hasEscala && hasImportante) bgClass = 'status-warning';
            else if (hasEscala) bgClass = 'status-ok';

            return (
              <div
                key={dia}
                className={`${bgClass} rounded-md p-2 text-center text-xs font-bold`}
                title={`Dia ${dia}: ${alertas.map(a => a.mensagem).join(', ') || 'OK'}`}
              >
                {dia}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
