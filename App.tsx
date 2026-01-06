import React, { useState } from 'react';
import { useLiveSession } from './hooks/useLiveSession';
import LiveView from './components/LiveView';
import ReportView from './components/ReportView';
import { SessionStatus, MeetingMinutes } from './types';

const App: React.FC = () => {
  const { status, transcript, volume, connect, disconnect, pause, resume, generateMinutes, error } = useLiveSession();
  const [minutes, setMinutes] = useState<MeetingMinutes | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Generate Action
  const handleGenerate = async () => {
    setIsProcessing(true);
    const result = await generateMinutes();
    setMinutes(result);
    setIsProcessing(false);
  };

  const handleReset = () => {
      disconnect(); // Ensure stopped
      setMinutes(null);
  };

  // If we have generated minutes, show the report view
  if (minutes) {
    return <ReportView minutes={minutes} onReset={handleReset} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* App Shell */}
      {status === SessionStatus.IDLE && (
         <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
                <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">MinuteMaestro AI</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  あなたのインテリジェントな会議アシスタント。<br/>
                  長時間の会議もリアルタイムで記録し、要点をまとめた議事録を瞬時に作成します。
                </p>
                <button 
                  onClick={connect}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-brand-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                  会議を始める（録音開始）
                </button>
            </div>
            <p className="mt-8 text-xs text-gray-400">Powered by Gemini 2.5 Live API</p>
         </div>
      )}

      {(status === SessionStatus.CONNECTING || status === SessionStatus.RECORDING || status === SessionStatus.PAUSED || status === SessionStatus.COMPLETED || status === SessionStatus.ERROR) && !isProcessing && (
        <LiveView 
          status={status}
          transcript={transcript}
          volume={volume}
          onStop={disconnect}
          onPause={pause}
          onResume={resume}
          onGenerate={handleGenerate}
          error={error}
        />
      )}
      
      {isProcessing && (
         <div className="flex-1 flex flex-col justify-center items-center bg-white p-6">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">議事録を作成中...</h2>
            <p className="text-gray-500">会話内容を分析し、アクションアイテムを抽出しています。</p>
         </div>
      )}
    </div>
  );
};

export default App;