import { memo, useRef, useState } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { useTournamentStore } from '../store/tournamentStore';

function ExportImportComponent() {
  const exportTournament = useTournamentStore((s) => s.exportTournament);
  const importTournament = useTournamentStore((s) => s.importTournament);
  const resetTournament = useTournamentStore((s) => s.resetTournament);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleExport = () => {
    const json = exportTournament();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wc2026-tournament-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Tournament exported successfully');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const ok = importTournament(text);
      setMessage(ok ? 'Tournament imported successfully' : 'Invalid tournament file');
      setTimeout(() => setMessage(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Reset entire tournament? All scores will be lost.')) {
      resetTournament();
      setMessage('Tournament reset');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-wc-gold/20 hover:bg-wc-gold/30 text-wc-gold border border-wc-gold/30 transition-colors text-sm font-medium"
      >
        <Download size={16} />
        Export Tournament
      </button>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-colors text-sm font-medium"
      >
        <Upload size={16} />
        Import Tournament
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors text-sm font-medium"
      >
        <RotateCcw size={16} />
        Reset Tournament
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
      {message && (
        <span className="text-sm text-wc-gold animate-pulse">{message}</span>
      )}
    </div>
  );
}

export const ExportImport = memo(ExportImportComponent);
