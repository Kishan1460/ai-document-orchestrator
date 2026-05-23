import { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import FileDropzone from './components/FileDropzone';
import SchemaTable from './components/SchemaTable';
import LogsDisplay from './components/LogsDisplay';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingAutomation, setLoadingAutomation] = useState(false);
  
  const [extractedPairs, setExtractedPairs] = useState(null);
  const [rawTextContext, setRawTextContext] = useState('');
  const [finalAnswer, setFinalAnswer] = useState('');
  const [automationStatus, setAutomationStatus] = useState('');

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!file || !query.trim()) return alert('Please provide both an analysis file and a target query.');
    
    setLoadingExtract(true);
    setExtractedPairs(null);
    setFinalAnswer('');
    setAutomationStatus('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/extract`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExtractedPairs(res.data.extractedPairs);
      setRawTextContext(res.data.rawTextContext);
    } catch (err) {
      console.error(err);
      alert('Extraction failed. Verify backend configurations.');
    } finally {
      setLoadingExtract(false);
    }
  };

  const handleSendAutomation = async () => {
    if (!recipientEmail.trim()) return alert('Please specify a recipient email address.');
    
    setLoadingAutomation(true);
    setAutomationStatus('Piping data to n8n runtime...');

    try {
      const res = await axios.post(`${BACKEND_URL}/api/automation`, {
        recipientEmail,
        query,
        extractedPairs,
        rawTextContext
      });

      setFinalAnswer(res.data.answer);
      setAutomationStatus(res.data.status);
    } catch (err) {
      console.error(err);
      setAutomationStatus('Workflow execution exception at n8n runtime pipeline.');
    } finally {
      setLoadingAutomation(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased relative pb-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-100 bg-linear-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: Input Workspace Form */}
          <div className="lg:col-span-5 bg-slate-800/50 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">1</span>
              Upload Document & Define Query
            </h2>
            
            <form onSubmit={handleExtract} className="space-y-6">
              <FileDropzone file={file} setFile={setFile} />

              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
                  Write Query
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g., Give summary of the data."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loadingExtract}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-medium text-sm py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loadingExtract ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mapping Components...
                  </>
                ) : 'Run AI Text Extraction'}
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: Dynamic Rendering Pipeline */}
          <div className="lg:col-span-7 space-y-6">
            {!extractedPairs && !loadingExtract && (
              <div className="bg-slate-800/20 border border-slate-700/40 rounded-2xl p-12 text-center text-slate-500">
                <svg className="mx-auto h-12 w-12 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-base font-medium text-slate-400">Await Pipeline Generation</p>
                <p className="text-xs max-w-xs mx-auto mt-1">Upload files and supply context to build processing layers.</p>
              </div>
            )}

            {loadingExtract && (
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 space-y-4 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-10 bg-slate-700/60 rounded" />
                  <div className="h-10 bg-slate-700/60 rounded" />
                </div>
              </div>
            )}

            {extractedPairs && (
              <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
                <SchemaTable extractedPairs={extractedPairs} />
                
                <div className="border-t border-slate-700/60 pt-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">3</span>
                     Recipient Email ID
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      placeholder="recipient@business-routing.com" 
                      value={recipientEmail} 
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                    />
                    <button 
                      onClick={handleSendAutomation} 
                      disabled={loadingAutomation} 
                      className="bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-medium text-sm px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg"
                    >
                      {loadingAutomation ? 'Running Workflow...' : 'Send'}
                    </button>
                  </div>
                </div>

                <LogsDisplay 
                  automationStatus={automationStatus} 
                  finalAnswer={finalAnswer} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
