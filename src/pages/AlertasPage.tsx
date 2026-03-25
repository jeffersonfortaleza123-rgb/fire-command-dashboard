import { useStore, getDaysInMonth } from '@/store/useStore';
import { MESES } from '@/types/firefighter';
import { Bell, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

export default function AlertasPage() {
  const { mesAtual, anoAtual, getAlertasDia } = useStore();
  const diasNoMes = getDaysInMonth(mesAtual, anoAtual);

  const todosAlertas = [];
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const alertas = getAlertasDia(mesAtual, anoAtual, dia);
    alertas.forEach(a => todosAlertas.push(a));
  }

  const criticos = todosAlertas.filter(a => a.nivel === 'critico');
  const importantes = todosAlertas.filter(a => a.nivel === 'importante');
  const informativos = todosAlertas.filter(a => a.nivel === 'informativo');

  const nivelIcon = (nivel: string) => {
    switch (nivel) {
      case 'critico': return <ShieldAlert className="h-4 w-4 text-status-critical" />;
      case 'importante': return <AlertTriangle className="h-4 w-4 text-status-warning" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="fire-gradient rounded-lg p-2.5">
          <Bell className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
          <p className="text-sm text-muted-foreground">{MESES[mesAtual]} {anoAtual}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-status-critical/30 rounded-lg p-5">
          <p className="text-xs font-display tracking-wider text-status-critical">CRÍTICOS</p>
          <p className="text-3xl font-bold font-display text-foreground mt-2">{criticos.length}</p>
        </div>
        <div className="bg-card border border-status-warning/30 rounded-lg p-5">
          <p className="text-xs font-display tracking-wider text-status-warning">IMPORTANTES</p>
          <p className="text-3xl font-bold font-display mt-2 text-foreground">{importantes.length}</p>
        </div>
        <div className="bg-card border border-blue-500/30 rounded-lg p-5">
          <p className="text-xs font-display tracking-wider text-blue-400">INFORMATIVOS</p>
          <p className="text-3xl font-bold font-display mt-2 text-foreground">{informativos.length}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">DIA</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">NÍVEL</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">MENSAGEM</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">IMPACTO</th>
            </tr>
          </thead>
          <tbody>
            {todosAlertas.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nenhum alerta</td></tr>
            ) : todosAlertas.map((a, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-3 text-foreground font-bold">{a.dia}</td>
                <td className="p-3">{nivelIcon(a.nivel)}</td>
                <td className="p-3 text-foreground">{a.mensagem}</td>
                <td className="p-3 text-muted-foreground">{a.impacto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
