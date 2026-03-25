import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { GRADUACOES, FUNCOES, GUARNICOES, MESES } from '@/types/firefighter';
import type { Militar, Graduacao, Funcao, Guarnicao } from '@/types/firefighter';
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function MilitaresPage() {
  const { militares, addMilitar, updateMilitar, deleteMilitar } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Militar | null>(null);
  const [search, setSearch] = useState('');
  const [filterFunc, setFilterFunc] = useState<string>('all');
  const [filterGuarnicao, setFilterGuarnicao] = useState<string>('all');

  const [form, setForm] = useState({
    nome: '',
    matricula: '',
    graduacao: 'SD' as Graduacao,
    funcao: 'Motorista B' as Funcao,
    funcaoCustom: '',
    guarnicao: 'ALFA' as Guarnicao,
  });

  const resetForm = () => {
    setForm({ nome: '', matricula: '', graduacao: 'SD', funcao: 'Motorista B', funcaoCustom: '', guarnicao: 'ALFA' });
    setEditing(null);
  };

  const handleSave = () => {
    if (!form.nome || !form.matricula) return;
    if (editing) {
      updateMilitar({ ...editing, ...form });
    } else {
      addMilitar(form);
    }
    setOpen(false);
    resetForm();
  };

  const handleEdit = (m: Militar) => {
    setEditing(m);
    setForm({ nome: m.nome, matricula: m.matricula, graduacao: m.graduacao, funcao: m.funcao, funcaoCustom: m.funcaoCustom || '', guarnicao: m.guarnicao });
    setOpen(true);
  };

  const filtered = militares.filter(m => {
    const matchSearch = m.nome.toLowerCase().includes(search.toLowerCase()) || m.matricula.includes(search);
    const matchFunc = filterFunc === 'all' || m.funcao === filterFunc;
    const matchGuarnicao = filterGuarnicao === 'all' || m.guarnicao === filterGuarnicao;
    return matchSearch && matchFunc && matchGuarnicao;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="fire-gradient rounded-lg p-2.5">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Militares</h1>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="fire-gradient border-0 text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" /> Novo Militar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-foreground">{editing ? 'EDITAR' : 'NOVO'} MILITAR</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Nome completo</Label>
                <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="bg-input border-border text-foreground" />
              </div>
              <div>
                <Label className="text-muted-foreground">Matrícula</Label>
                <Input value={form.matricula} onChange={e => setForm(f => ({ ...f, matricula: e.target.value }))} className="bg-input border-border text-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Graduação</Label>
                  <Select value={form.graduacao} onValueChange={v => setForm(f => ({ ...f, graduacao: v as Graduacao }))}>
                    <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {GRADUACOES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-muted-foreground">Guarnição</Label>
                  <Select value={form.guarnicao} onValueChange={v => setForm(f => ({ ...f, guarnicao: v as Guarnicao }))}>
                    <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {GUARNICOES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Função</Label>
                <Select value={form.funcao} onValueChange={v => setForm(f => ({ ...f, funcao: v as Funcao }))}>
                  <SelectTrigger className="bg-input border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {FUNCOES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {form.funcao === 'Outros' && (
                <div>
                  <Label className="text-muted-foreground">Especificar função</Label>
                  <Input value={form.funcaoCustom} onChange={e => setForm(f => ({ ...f, funcaoCustom: e.target.value }))} className="bg-input border-border text-foreground" />
                </div>
              )}
              <Button onClick={handleSave} className="w-full fire-gradient border-0 text-primary-foreground hover:opacity-90">
                {editing ? 'Salvar' : 'Cadastrar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou matrícula..." className="pl-10 bg-input border-border text-foreground" />
        </div>
        <Select value={filterFunc} onValueChange={setFilterFunc}>
          <SelectTrigger className="w-[180px] bg-input border-border text-foreground"><SelectValue placeholder="Função" /></SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Todas funções</SelectItem>
            {FUNCOES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterGuarnicao} onValueChange={setFilterGuarnicao}>
          <SelectTrigger className="w-[160px] bg-input border-border text-foreground"><SelectValue placeholder="Guarnição" /></SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="all">Todas guarnições</SelectItem>
            {GUARNICOES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">NOME</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">MATRÍCULA</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">GRADUAÇÃO</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">FUNÇÃO</th>
              <th className="text-left p-3 text-xs font-display tracking-wider text-muted-foreground">GUARNIÇÃO</th>
              <th className="text-right p-3 text-xs font-display tracking-wider text-muted-foreground">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum militar cadastrado</td></tr>
            ) : filtered.map(m => (
              <tr key={m.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-3 text-foreground font-medium">{m.nome}</td>
                <td className="p-3 text-muted-foreground">{m.matricula}</td>
                <td className="p-3"><span className="bg-primary/20 text-secondary px-2 py-0.5 rounded text-xs font-bold">{m.graduacao}</span></td>
                <td className="p-3 text-muted-foreground text-sm">{m.funcao === 'Outros' ? m.funcaoCustom : m.funcao}</td>
                <td className="p-3"><span className="bg-muted text-foreground px-2 py-0.5 rounded text-xs font-bold">{m.guarnicao}</span></td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(m)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteMilitar(m.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
