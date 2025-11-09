import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

export default function Generated(){
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const showCopyLink = async () => {
      console.log('Share ID:', id);
      const session = await fetchAuthSession()
      if(session){
        setShowModal(true)
      }
    }

    showCopyLink()
    
  }, [id, searchParams]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div>
      Shared content for {id}
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share Link</h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                value={window.location.href} 
                readOnly 
                className="flex-1 p-2 border rounded bg-gray-50"
              />
              <button 
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full p-2 border rounded hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
