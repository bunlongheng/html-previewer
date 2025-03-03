import React, { useState } from 'react';

const HtmlPreviewer = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [isValidHtml, setIsValidHtml] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [gistUrl, setGistUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setHtmlCode(input);
    detectHtml(input);
  };

  const detectHtml = (input: string) => {
    const htmlRegex = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;
    setIsValidHtml(htmlRegex.test(input));
  };

  const handleSubmit = async () => {
    if (!isValidHtml) return;

    setIsLoading(true);
    setIsSuccess(false);

    try {
      const response = await fetch('/api/createGist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: htmlCode }),
      });

      const data = await response.json();
      setPreviewHtml(htmlCode); // Render the preview immediately
      setGistUrl(data.html_url); // Set the Gist URL
      setIsSuccess(true); // Show success message
    } catch (error) {
      console.error('Error creating Gist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-center font-semibold ${
              !previewHtml ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            HTML Input
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-semibold ${
              previewHtml ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!previewHtml ? (
            // HTML Input Tab
            <div>
              <textarea
                className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste your HTML code here..."
                value={htmlCode}
                onChange={handleInputChange}
              />
              <button
                className={`mt-4 w-full px-4 py-2 rounded-lg text-white font-semibold ${
                  isValidHtml && !isLoading
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
                disabled={!isValidHtml || isLoading}
              >
                {isLoading ? 'Creating Gist...' : 'Submit'}
              </button>
            </div>
          ) : (
            // Preview Tab
            <div>
              <iframe
                srcDoc={previewHtml}
                className="w-full h-96 border border-gray-300 rounded-lg"
              />
              {gistUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Gist created successfully!{' '}
                    <a
                      href={gistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Gist
                    </a>
                  </p>
                </div>
              )}
              {isSuccess && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  Gist created successfully!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HtmlPreviewer;