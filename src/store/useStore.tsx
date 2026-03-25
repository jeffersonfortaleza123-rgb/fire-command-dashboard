import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Militar, EscalaMes, EscalaDia, Permuta, TipoServico, Alerta } from '@/types/firefighter';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getDaysInMonth(mes: number, ano: number) {
  return new Date(ano, mes + 1, 0).getDate();
}

interface StoreState {
  militares: Militar[];
  meses: EscalaMes[];
  permutas: Permuta[];
  mesAtual: number;
  anoAtual: number;
}

interface StoreContextType extends StoreState {
  setMesAtual: (mes: number) => void;
  setAnoAtual: (ano: number) => void;
  addMilitar: (m: Omit<Militar, 'id'>) => void;
  updateMilitar: (m: Militar) => void;
  deleteMilitar: (id: string) => void;
  getEscalaMes: (mes: number, ano: number) => EscalaMes;
  setEscalaDia: (mes: number, ano: number, militarId: string, dia: number, tipo: TipoServico) => void;
  criarMes: (mes: number, ano: number) => void;
  copiarMesAnterior: (mes: number, ano: number) => void;
  addPermuta: (p: Omit<Permuta, 'id' | 'numero' | 'status'>) => Permuta | null;
  executarPermuta: (id: string) => boolean;
  cancelarPermuta: (id: string) => void;
  excluirPermuta: (id: string) => void;
  getAlertasDia: (mes: number, ano: number, dia: number) => Alerta[];
  getPermutasMes: (mes: number, ano: number) => Permuta[];
}

const StoreContext = createContext<StoreContextType | null>(null);

function loadState(): StoreState {
  try {
    const saved = localStorage.getItem('firefighter-store');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  const now = new Date();
  return {
    militares: [],
    meses: [],
    permutas: [],
    mesAtual: now.getMonth(),
    anoAtual: now.getFullYear(),
  };
}

function saveState(state: StoreState) {
  localStorage.setItem('firefighter-store', JSON.stringify(state));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setMesAtual = useCallback((mes: number) => {
    setState(s => ({ ...s, mesAtual: mes }));
  }, []);

  const setAnoAtual = useCallback((ano: number) => {
    setState(s => ({ ...s, anoAtual: ano }));
  }, []);

  const addMilitar = useCallback((m: Omit<Militar, 'id'>) => {
    setState(s => ({
      ...s,
      militares: [...s.militares, { ...m, id: generateId() }],
    }));
  }, []);

  const updateMilitar = useCallback((m: Militar) => {
    setState(s => ({
      ...s,
      militares: s.militares.map(x => x.id === m.id ? m : x),
    }));
  }, []);

  const deleteMilitar = useCallback((id: string) => {
    setState(s => ({
      ...s,
      militares: s.militares.filter(x => x.id !== id),
    }));
  }, []);

  const getEscalaMes = useCallback((mes: number, ano: number): EscalaMes => {
    const found = state.meses.find(m => m.mes === mes && m.ano === ano);
    return found || { mes, ano, escalas: [] };
  }, [state.meses]);

  const setEscalaDia = useCallback((mes: number, ano: number, militarId: string, dia: number, tipo: TipoServico) => {
    setState(s => {
      const meses = [...s.meses];
      let mesObj = meses.find(m => m.mes === mes && m.ano === ano);
      if (!mesObj) {
        mesObj = { mes, ano, escalas: [] };
        meses.push(mesObj);
      } else {
        const idx = meses.indexOf(mesObj);
        mesObj = { ...mesObj, escalas: [...mesObj.escalas] };
        meses[idx] = mesObj;
      }
      const existIdx = mesObj.escalas.findIndex(e => e.militarId === militarId && e.dia === dia);
      if (existIdx >= 0) {
        if (tipo === '') {
          mesObj.escalas.splice(existIdx, 1);
        } else {
          mesObj.escalas[existIdx] = { militarId, dia, tipo };
        }
      } else if (tipo !== '') {
        mesObj.escalas.push({ militarId, dia, tipo });
      }
      return { ...s, meses };
    });
  }, []);

  const criarMes = useCallback((mes: number, ano: number) => {
    setState(s => {
      if (s.meses.find(m => m.mes === mes && m.ano === ano)) return s;
      return { ...s, meses: [...s.meses, { mes, ano, escalas: [] }] };
    });
  }, []);

  const copiarMesAnterior = useCallback((mes: number, ano: number) => {
    setState(s => {
      const prevMes = mes === 0 ? 11 : mes - 1;
      const prevAno = mes === 0 ? ano - 1 : ano;
      const prev = s.meses.find(m => m.mes === prevMes && m.ano === prevAno);
      if (!prev) return s;
      const maxDays = getDaysInMonth(mes, ano);
      const escalas = prev.escalas.filter(e => e.dia <= maxDays);
      const meses = s.meses.filter(m => !(m.mes === mes && m.ano === ano));
      meses.push({ mes, ano, escalas });
      return { ...s, meses };
    });
  }, []);

  const addPermuta = useCallback((p: Omit<Permuta, 'id' | 'numero' | 'status'>): Permuta | null => {
    let newPermuta: Permuta | null = null;
    setState(s => {
      const numero = s.permutas.length + 1;
      newPermuta = { ...p, id: generateId(), numero, status: 'pendente' };
      return { ...s, permutas: [...s.permutas, newPermuta] };
    });
    return newPermuta;
  }, []);

  const executarPermuta = useCallback((id: string): boolean => {
    setState(s => {
      const permuta = s.permutas.find(p => p.id === id);
      if (!permuta || permuta.status !== 'pendente') return s;

      const meses = [...s.meses];
      let mesObj = meses.find(m => m.mes === permuta.mes && m.ano === permuta.ano);
      if (!mesObj) return s;

      const idx = meses.indexOf(mesObj);
      mesObj = { ...mesObj, escalas: [...mesObj.escalas] };
      meses[idx] = mesObj;

      const e1 = mesObj.escalas.find(e => e.militarId === permuta.militar1Id && e.dia === permuta.dia1);
      const e2 = mesObj.escalas.find(e => e.militarId === permuta.militar2Id && e.dia === permuta.dia2);

      if (!e1 || !e2) return s;

      // Swap
      const temp = e1.tipo;
      const e1Idx = mesObj.escalas.indexOf(e1);
      const e2Idx = mesObj.escalas.indexOf(e2);
      
      mesObj.escalas[e1Idx] = { militarId: permuta.militar2Id, dia: permuta.dia1, tipo: e2.tipo };
      mesObj.escalas[e2Idx] = { militarId: permuta.militar1Id, dia: permuta.dia2, tipo: temp };

      const permutas = s.permutas.map(p =>
        p.id === id ? { ...p, status: 'executada' as const, dataExecucao: new Date().toISOString() } : p
      );

      return { ...s, meses, permutas };
    });
    return true;
  }, []);

  const cancelarPermuta = useCallback((id: string) => {
    setState(s => ({
      ...s,
      permutas: s.permutas.map(p => p.id === id ? { ...p, status: 'cancelada' as const } : p),
    }));
  }, []);

  const excluirPermuta = useCallback((id: string) => {
    setState(s => {
      const permuta = s.permutas.find(p => p.id === id);
      if (!permuta) return s;

      // If executed, revert
      if (permuta.status === 'executada') {
        const meses = [...s.meses];
        let mesObj = meses.find(m => m.mes === permuta.mes && m.ano === permuta.ano);
        if (mesObj) {
          const idx = meses.indexOf(mesObj);
          mesObj = { ...mesObj, escalas: [...mesObj.escalas] };
          meses[idx] = mesObj;

          const e1 = mesObj.escalas.findIndex(e => e.militarId === permuta.militar2Id && e.dia === permuta.dia1);
          const e2 = mesObj.escalas.findIndex(e => e.militarId === permuta.militar1Id && e.dia === permuta.dia2);

          if (e1 >= 0 && e2 >= 0) {
            const temp = mesObj.escalas[e1].tipo;
            mesObj.escalas[e1] = { militarId: permuta.militar1Id, dia: permuta.dia1, tipo: mesObj.escalas[e2].tipo };
            mesObj.escalas[e2] = { militarId: permuta.militar2Id, dia: permuta.dia2, tipo: temp };
          }

          return { ...s, meses, permutas: s.permutas.filter(p => p.id !== id) };
        }
      }

      return { ...s, permutas: s.permutas.filter(p => p.id !== id) };
    });
  }, []);

  const getAlertasDia = useCallback((mes: number, ano: number, dia: number): Alerta[] => {
    const escala = state.meses.find(m => m.mes === mes && m.ano === ano);
    if (!escala) return [];

    const escalaDia = escala.escalas.filter(e => e.dia === dia && (e.tipo === 'O' || e.tipo === 'P'));
    const militaresIds = escalaDia.map(e => e.militarId);
    const militaresEscalados = state.militares.filter(m => militaresIds.includes(m.id));

    const alertas: Alerta[] = [];

    const chefes = militaresEscalados.filter(m => m.funcao === 'Chefe de Guarnição');
    if (chefes.length === 0) {
      alertas.push({ dia, nivel: 'critico', mensagem: 'Sem Chefe de Guarnição', impacto: 'Guarnição sem comando' });
    }

    const pilotos = militaresEscalados.filter(m => m.funcao === 'Piloto');
    if (pilotos.length === 0) {
      alertas.push({ dia, nivel: 'critico', mensagem: 'Sem Piloto', impacto: 'Viatura parada' });
    }

    const motD = militaresEscalados.filter(m => m.funcao === 'Motorista D');
    if (motD.length < 2) {
      alertas.push({ dia, nivel: 'critico', mensagem: `Apenas ${motD.length} Motorista(s) D (mínimo 2)`, impacto: 'Viaturas pesadas comprometidas' });
    }

    const graduados = militaresEscalados.filter(m => m.graduacao !== 'SD');
    if (graduados.length === 0) {
      alertas.push({ dia, nivel: 'importante', mensagem: 'Sem graduado no dia', impacto: 'Cadeia de comando comprometida' });
    }

    return alertas;
  }, [state.meses, state.militares]);

  const getPermutasMes = useCallback((mes: number, ano: number): Permuta[] => {
    return state.permutas.filter(p => p.mes === mes && p.ano === ano);
  }, [state.permutas]);

  return (
    <StoreContext.Provider value={{
      ...state,
      setMesAtual,
      setAnoAtual,
      addMilitar,
      updateMilitar,
      deleteMilitar,
      getEscalaMes,
      setEscalaDia,
      criarMes,
      copiarMesAnterior,
      addPermuta,
      executarPermuta,
      cancelarPermuta,
      excluirPermuta,
      getAlertasDia,
      getPermutasMes,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}

export { getDaysInMonth };
