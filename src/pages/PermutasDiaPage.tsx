import { useStore } from '@/store/useStore';
import { MESES } from '@/types/firefighter';
import { CalendarClock, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function PermutasDiaPage() {
  const { militares, permutas, mesAtual, anoAtual } = useStore();
  const hoje = new Date();
  const diaAtual = hoje.getDate();
  const mesHoje = hoje.getMonth();
  const anoHoje = hoje.getFullYear();

  const isHoje = mesAtual === mesHoje && anoAtual === anoHoje;
  const dia = isHoje ? diaAtual : 1;

  const permutasDoDia = permutas.filter(p =>
    p.mes === mesAtual && p.ano === anoAtual && (p.dia1 === dia || p.dia2 === dia)
  );

  const getNome = (id: string) => militares.find(m => m.id === id)?.nome || 'N/A';

  const criticas = permutasDoDia.filter(p => p.status === 'pendente');
  const seguras = permutasDoDia.filter(p => p.status === 'executada');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="fire-gradient rounded-lg p-2.5">
          <CalendarClock className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Permutas do Dia</h1>
          <p className="text-sm text-muted-foreground">Dia {dia} - {MESES[mesAtual]} {anoAtual}</p>
        </div>
      </div>

      {criticas.length > 0 && (
        <div className="bg-status-critical/10 border border-status-critical/30 rounded-lg p-4 flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-status-critical shrink-0" />
          <span className="text-status-critical text-sm font-medium">{criticas.length} permuta(s) pendente(s) requer(em) atenção</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 text-center">
          <p className="text-xs text-muted-foreground font-display tracking-wider">TOTAL</p>
          <p className="text-3xl font-bold font-display text-foreground mt-2">{permutasDoDia.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 text-center">
          <p className="text-xs text-muted-foreground font-display tracking-wider">PENDENTES</p>
          <p className="text-3xl font-bold font-display status-critical-text mt-2">{criticas.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 text-center">
          <p className="text-xs text-muted-foreground font-display tracking-wider">EXECUTADAS</p>
          <p className="text-3xl font-bold font-display status-ok-text mt-2">{seguras.length}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">Nº</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">MILITARES</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">DIAS</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {permutasDoDia.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Nenhuma permuta para hoje</td></tr>
            ) : permutasDoDia.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-3 text-foreground font-bold">#{p.numero}</td>
                <td className="p-3 text-foreground">{getNome(p.militar1Id)} ↔ {getNome(p.militar2Id)}</td>
                <td className="p-3 text-muted-foreground">{p.dia1} ↔ {p.dia2}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    p.status === 'executada' ? 'status-ok' : p.status === 'cancelada' ? 'status-critical' : 'status-warning'
                  }`}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
