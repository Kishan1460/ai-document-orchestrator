export default function FileDropzone({ file, setFile }) {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain')) {
      setFile(selectedFile);
    } else {
      alert('Invalid file format. Please upload a .pdf or .txt file.');
      setFile(null);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
        Select Document Target (.pdf, .txt)
      </label>
      <div className="relative group border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-4 transition-colors bg-slate-900/40 text-center">
        <input 
          type="file" 
          accept=".pdf,.txt" 
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="space-y-1">
          <svg className="mx-auto h-8 w-8 text-slate-500 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-slate-300 font-medium">
            {file ? file.name : 'Click to browse or drop file here'}
          </p>
          {file && (
            <p className="text-xs text-emerald-400 font-mono">
              {(file.size / 1024).toFixed(1)} KB recognized
            </p>
          )}
        </div>
      </div>
    </div>
  );
}