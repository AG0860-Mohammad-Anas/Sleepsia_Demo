import React from 'react';
import { X, Code2, Copy, CheckCircle2 } from 'lucide-react';

interface AgentPayloadModalProps {
  title: string;
  payload: any;
  onClose: () => void;
}

export const AgentPayloadModal: React.FC<AgentPayloadModalProps> = ({
  title,
  payload,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);
  const formattedJson = JSON.stringify(payload, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold tracking-tight text-white">{title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 border border-slate-700 transition"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="p-6 overflow-y-auto bg-slate-950 font-mono text-xs text-blue-300 rounded-b-2xl">
          <pre className="whitespace-pre-wrap">{formattedJson}</pre>
        </div>
      </div>
    </div>
  );
};
