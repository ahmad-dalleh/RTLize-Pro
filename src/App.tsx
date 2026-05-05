import { useState, useRef } from 'react';
import { 
  Settings2,
  Play,
  RotateCcw,
  Check,
  Terminal,
  Code2,
  Search,
  Globe,
  CircleDot,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { runRTLFix } from './utils/rtlUtils';

const DEFAULT_CONTENT = `
<div class="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
  <h2 class="text-xl font-bold mb-4 text-slate-800">Welcome to our Service</h2>
  <p class="text-slate-600 mb-6 font-medium">This is a demo area with mixed content.</p>
  
  <div class="space-y-4">
    <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
      <h3 class="font-bold text-slate-900 text-sm mb-1">English Component</h3>
      <p class="text-slate-600 text-xs text-balance">All text here is left-aligned by default. No changes needed.</p>
    </div>
    
    <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
      <h3 class="font-bold text-slate-900 text-sm mb-1 text-right">مكون اللغة العربية</h3>
      <p class="text-slate-600 text-xs text-right">هذا النص باللغة العربية ويحتاج إلى محاذاة من اليمين إلى اليسار ليظهر بشكل صحيح.</p>
      <div class="flex justify-end mt-3">
        <button class="px-4 py-1.5 bg-slate-900 text-white rounded-md text-xs font-bold uppercase tracking-wider">اضغط هنا</button>
      </div>
    </div>

    <div class="p-4 bg-slate-50 rounded-lg border border-slate-100">
      <p class="italic text-slate-400 text-xs">Note how the Arabic text above looks weird when left-aligned by default.</p>
    </div>
  </div>
</div>
`;

export default function App() {
  const [html, setHtml] = useState(DEFAULT_CONTENT);
  const [fixed, setFixed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<{time: string, msg: string, type: 'success' | 'info'}[]>([
    { time: '14:20:00', msg: 'System initialized. Waiting for input...', type: 'info' }
  ]);
  const previewRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string, type: 'success' | 'info' = 'info') => {
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev.slice(-6), { time, msg, type }]);
  };

  const handleFix = () => {
    if (previewRef.current) {
      addLog('Scanning DOM for Arabic content...');
      const parent = runRTLFix(previewRef.current);
      if (parent) {
        setFixed(true);
        addLog(`Applied RTL to <${parent.tagName.toLowerCase()}> container.`, 'success');
      } else {
        addLog('No Arabic text nodes found in the current scope.', 'info');
      }
    }
  };

  const handleReset = () => {
    setHtml(DEFAULT_CONTENT);
    setFixed(false);
    addLog('Resetting environment to defaults.');
  };

  const copySnippet = () => {
    const snippet = `(function() {
  const ARABIC_REGEX = /[\\u0600-\\u06FF]/;
  const findArabicElements = (root = document) => {
    const elements = [];
    const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent && ARABIC_REGEX.test(node.textContent)) {
        const parent = node.parentElement;
        if (parent && !elements.includes(parent)) elements.push(parent);
      }
    }
    return elements;
  };
  const findCommonAncestor = (elements) => {
    if (elements.length === 0) return null;
    if (elements.length === 1) return elements[0];
    const getParents = (el) => {
      const p = []; let c = el;
      while (c) { p.push(c); c = c.parentElement; }
      return p;
    };
    const pList = elements.map(getParents);
    for (const p of pList[0]) {
      if (pList.every(l => l.includes(p))) return p;
    }
    return null;
  };
  const common = findCommonAncestor(findArabicElements());
  if (common) {
    common.setAttribute('dir', 'rtl');
    common.setAttribute('data-rtlfree', 'rtl');
    common.style.direction = 'rtl';
    common.style.textAlign = 'right';
    console.log('RTL Applied to:', common);
  } else {
    console.log('No Arabic text found.');
  }
})();`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    addLog('Universal browser snippet copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden select-none">
      {/* Header (Nav) */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm shadow-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl font-sans shadow-lg shadow-blue-200">
            أ
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800 leading-none">RTLize Pro</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 shrink-0 whitespace-nowrap">Browser Extension v2.4.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
            <CircleDot className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Extension Active</span>
          </div>
          <button 
            onClick={copySnippet}
            className={`p-2.5 rounded-full transition-all flex items-center gap-2 px-4 shadow-sm border ${copied ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-200' : 'hover:bg-slate-50 bg-white border-slate-200 text-slate-600'}`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
            <span className="text-xs font-bold uppercase tracking-widest leading-none mt-0.5">
              {copied ? 'Copied' : 'Snippet'}
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row p-8 gap-8 max-w-[1600px] mx-auto w-full overflow-hidden">
        
        {/* Left Column (Stats / Config) */}
        <div className="lg:w-1/3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-slate-400" />
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Scanning Engine</h2>
            </div>
            
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Depth Search Level</span>
                  <span className="text-xs font-bold text-blue-600">High (Recursive)</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full w-3/4 shadow-sm shadow-blue-200"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-1 border-b border-slate-50/50">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-600">Auto-Detect Arabic</span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-tight">Scan entire page automatically</span>
                </div>
                <div className="w-9 h-5 bg-blue-600 rounded-full flex items-center px-0.5 shadow-inner">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-md"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-1 border-b border-slate-50/50">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-600">Force Inline Styles</span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-tight">Bypass parent CSS rules</span>
                </div>
                <div className="w-9 h-5 bg-blue-600 rounded-full flex items-center px-0.5 shadow-inner">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-md"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-4 h-4 text-slate-400" />
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Attributes Config</h2>
            </div>
            
            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group transition-all hover:bg-slate-100">
                <span className="text-slate-400 leading-none font-medium">dir</span>
                <span className="text-blue-600 font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">"rtl"</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group transition-all hover:bg-slate-100">
                <span className="text-slate-400 leading-none font-medium">data-rtlfree</span>
                <span className="text-blue-600 font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">"rtl"</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 transition-all hover:bg-slate-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-slate-400 leading-none font-medium">style</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                </div>
                <div className="text-slate-700 font-bold bg-white p-2 rounded shadow-sm border border-slate-200 leading-tight text-[10px]">
                  "direction: rtl; text-align: right;"
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleFix}
            disabled={fixed}
            className={`w-full font-extrabold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-3 tracking-[0.1em] text-sm
              ${fixed 
                ? 'bg-emerald-500 text-white shadow-emerald-200/50' 
                : 'bg-slate-900 hover:bg-black text-white shadow-slate-200 hover:shadow-slate-300'
              }`}
          >
            {fixed ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                RTL CONVERSION ACTIVE
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                RE-SCAN WORK AREA
              </>
            )}
          </button>
        </div>

        {/* Right Column (Log / Preview) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[400px]">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-400" />
                <h2 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Real-time Debug System</h2>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${fixed ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Parents Fixed: {fixed ? 1 : 0}</span>
                </div>
                <button 
                  onClick={handleReset}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all active:rotate-[-45deg]"
                  title="Reset Environment"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col gap-8 min-h-0">
              
              {/* HTML Editor Overlay */}
              <div className="flex flex-col h-1/2 min-h-[160px]">
                <div className="flex items-center gap-2 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source Document</span>
                </div>
                <textarea
                  value={html}
                  onChange={(e) => { setHtml(e.target.value); setFixed(false); }}
                  className="flex-1 w-full bg-slate-900 font-mono text-[11px] p-5 rounded-xl border border-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-700 outline-none transition-all resize-none shadow-xl text-blue-50/90 [scrollbar-width:thin] selection:bg-blue-500/30"
                  spellCheck={false}
                />
              </div>

              {/* Live Preview Area */}
              <div className="flex flex-col h-1/2 min-h-[200px]">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Render Output</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${fixed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {fixed ? 'RTL Optimized' : 'Standard View'}
                  </span>
                </div>
                <div className="flex-1 relative bg-slate-50 rounded-xl border border-slate-200 overflow-y-auto p-6 custom-scrollbar shadow-inner select-text">
                  <motion.div 
                    layout
                    ref={previewRef}
                    className="min-h-full transition-all duration-700 bg-transparent"
                    dangerouslySetInnerHTML={{ __html: html }}
                    key={html + fixed}
                  />
                  <AnimatePresence>
                    {!fixed && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/5 pointer-events-none rounded-xl"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
            
            {/* Logs List Section */}
            <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 font-mono text-[10px] space-y-2 max-h-[140px] overflow-y-auto shrink-0 custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-3 border-l-2 pl-4 py-1 animate-in fade-in slide-in-from-left-4 duration-500
                  ${log.type === 'success' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-slate-700 text-slate-500'}`}>
                  <span className="text-slate-600 shrink-0 select-none">[{log.time}]</span>
                  <span className="line-clamp-1">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 rounded-xl p-8 text-white relative overflow-hidden shrink-0 group border border-blue-500 shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1 group-hover:text-blue-100 transition-colors tracking-tight">Export for Chrome</h3>
              <p className="text-blue-100 text-xs mb-5 font-medium max-w-sm leading-relaxed italic opacity-90">
                Ready to use this on real websites? Click the Gear icon {'>'} Export to ZIP and load the 'extension' folder in Chrome.
              </p>
              <div className="flex gap-2 flex-wrap">
                {['manifest.json', 'content.js'].map(file => (
                  <span key={file} className="px-2.5 py-1.5 bg-blue-700/80 rounded text-[9px] font-bold border border-blue-400/30 tracking-wider text-blue-50 hover:text-white hover:border-blue-200 cursor-default transition-all uppercase whitespace-nowrap">
                    {file}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.1] rotate-12 transition-transform group-hover:rotate-0 duration-1000 select-none pointer-events-none text-white">
              <Code2 className="w-56 h-56" strokeWidth={1} />
            </div>
          </div>

          {/* Bottom Card (Whitelisting / Global State) */}
          <div className="h-40 bg-slate-900 rounded-xl p-8 text-white relative overflow-hidden shrink-0 group border border-slate-800 shadow-2xl">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors tracking-tight">Domain Whitelist</h3>
              <p className="text-slate-400 text-xs mb-5 font-medium max-w-sm leading-relaxed italic opacity-80">
                Extension logic gracefully handles restricted domains to prevent critical layout failure.
              </p>
              <div className="flex gap-2 flex-wrap">
                {['gmail.com', 'github.com', 'figma.com', 'notion.so'].map(domain => (
                  <span key={domain} className="px-2.5 py-1.5 bg-slate-800/80 rounded text-[9px] font-bold border border-slate-700 tracking-wider text-slate-400 hover:text-white hover:border-slate-500 cursor-default transition-all uppercase whitespace-nowrap">
                    {domain}
                  </span>
                ))}
              </div>
            </div>
            {/* Background Icon Decor */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0 duration-1000 select-none pointer-events-none">
              <Globe className="w-56 h-56 text-white" strokeWidth={1} />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.2em] shrink-0 gap-4">
        <div className="flex gap-8">
          <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Manifest V3</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
        </div>
        <div className="text-slate-400/40 font-mono tracking-normal">
          © 2024 RTLIZE OPEN SOURCE INITIATIVE <span className="mx-2 opacity-50">•</span> v2.4.0-STABLE
        </div>
      </footer>
    </div>
  );
}
