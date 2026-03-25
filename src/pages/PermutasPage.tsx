import { useState } from 'react';
import { useStore, getDaysInMonth } from '@/store/useStore';
import { MESES } from '@/types/firefighter';
import { ArrowLeftRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function PermutasPage() {
  const { militares, mesAtual, anoAtual, getPermutasMes, addPermuta, executarPermuta, excluirPermuta } = useStore();
  const permutas = getPermutasMes(mesAtual, anoAtual);
  const diasNoMes = getDaysInMonth(mesAtual, anoAtual);
  const dias = Array.from({ length: diasNoMes }, (_, i) => i + 1);

  const [m1, setM1] = useState('');
  const [d1, setD1] = useState('');
  const [m2, setM2] = useState('');
  const [d2, setD2] = useState('');
  const [processoSei, setProcessoSei] = useState('');

  const handleAdd = () => {
    if (!m1 || !d1 || !m2 || !d2) return;
    addPermuta({
      militar1Id: m1, dia1: parseInt(d1),
      militar2Id: m2, dia2: parseInt(d2),
      mes: mesAtual, ano: anoAtual,
      processoSei: processoSei || undefined,
      situacao: 'pendente',
    });
    setM1(''); setD1(''); setM2(''); setD2(''); setProcessoSei('');
  };

  const getNome = (id: string) => {
    const mil = militares.find(m => m.id === id);
    return mil ? `${mil.graduacao} ${mil.nome}` : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="fire-gradient rounded-lg p-2.5">
          <ArrowLeftRight className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Permutas Autorizadas</h1>
          <p className="text-sm text-muted-foreground">{MESES[mesAtual]} {anoAtual}</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-sm font-display tracking-wider text-muted-foreground mb-4">NOVA PERMUTA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <Label className="text-muted-foreground text-xs">Bombeiro 1</Label>
            <Select value={m1} onValueChange={setM1}>
              <SelectTrigger className="bg-input border-border text-foreground"><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {militares.map(m => <SelectItem key={m.id} value={m.id}>{m.graduacao} {m.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Data 1</Label>
            <Select value={d1} onValueChange={setD1}>
              <SelectTrigger className="bg-input border-border text-foreground"><SelectValue placeholder="Dia" /></SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {dias.map(d => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Bombeiro 2</Label>
            <Select value={m2} onValueChange={setM2}>
              <SelectTrigger className="bg-input border-border text-foreground"><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {militares.map(m => <SelectItem key={m.id} value={m.id}>{m.graduacao} {m.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Data 2</Label>
            <Select value={d2} onValueChange={setD2}>
              <SelectTrigger className="bg-input border-border text-foreground"><SelectValue placeholder="Dia" /></SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {dias.map(d => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Processo SEI</Label>
            <Input 
              value={processoSei} 
              onChange={e => setProcessoSei(e.target.value)} 
              placeholder="Nº do processo" 
              className="bg-input border-border text-foreground" 
            />
          </div>
        </div>
        <Button onClick={handleAdd} className="mt-4 fire-gradient border-0 text-primary-foreground hover:opacity-90">
          Registrar Permuta
        </Button>
      </div>

      {/* Table matching Excel format */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-yellow-500/20">
              <th className="text-left p-3 text-xs font-display tracking-wider text-foreground">Nº</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-foreground">BOMBEIRO 1</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-foreground">BOMBEIRO 2</th>
              <th className="text-center p-3 text-xs font-display tracking-wider text-foreground">DATA 1</th>
              <th className="text-center p-3 text-xs font-display tracking-wider text-foreground">DATA 2</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-foreground">PROCESSO SEI</th>
              <th className="text-center p-3 text-xs font-display tracking-wider text-foreground">SITUAÇÃO</th>
              <th className="text-right p-3 text-xs font-display tracking-wider text-foreground">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {permutas.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Nenhuma permuta registrada</td></tr>
            ) : permutas.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                <td className="p-3 text-foreground font-bold">P{String(p.numero).padStart(2, '0')}</td>
                <td className="p-3 text-foreground">{getNome(p.militar1Id)}</td>
                <td className="p-3 text-foreground">{getNome(p.militar2Id)}</td>
                <td className="p-3 text-center text-muted-foreground">{p.dia1}/{mesAtual + 1}</td>
                <td className="p-3 text-center text-muted-foreground">{p.dia2}/{mesAtual + 1}</td>
                <td className="p-3 text-muted-foreground text-xs">{p.processoSei || '—'}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    p.situacao === 'assinada' ? 'bg-green-600/20 text-green-500' :
                    p.status === 'executada' ? 'bg-blue-600/20 text-blue-400' : 
                    p.status === 'cancelada' ? 'bg-red-600/20 text-red-400' : 
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {p.situacao === 'assinada' ? 'Assinada' : p.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-right flex gap-1 justify-end">
                  {p.status === 'pendente' && (
                    <Button size="sm" onClick={() => executarPermuta(p.id)} className="text-xs fire-gradient border-0 text-primary-foreground">
                      Executar
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => excluirPermuta(p.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
