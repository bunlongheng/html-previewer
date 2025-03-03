import React, { useState } from "react";

const HtmlPreviewer = () => {
  const [htmlCode, setHtmlCode] = useState("");
  const [isValidHtml, setIsValidHtml] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [gistUrl, setGistUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      const response = await fetch("/api/createGist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlCode }),
      });

      const data = await response.json();
      setPreviewHtml(htmlCode);
      setGistUrl(data.html_url); // Save the Gist URL
    } catch (error) {
      console.error("Error creating Gist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenGist = () => {
    if (gistUrl) {
      window.open(gistUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {!previewHtml ? (
        // HTML Input View
        <div className="h-screen flex flex-col bg-white rounded-lg">
          <textarea
            className="flex-grow p-6 border-none focus:outline-none text-xl"
            placeholder="Paste your HTML code here..."
            value={htmlCode}
            onChange={handleInputChange}
          />
        </div>
      ) : (
        // HTML Preview View
        <div className="h-screen flex flex-col bg-white rounded-lg">
          <iframe
            srcDoc={previewHtml}
            className="flex-grow w-full border-none"
          />
          {gistUrl && (
            <div className="p-4 bg-gray-100 border-t border-gray-300">
              <p className="text-xl text-gray-800">
                Gist Link:{" "}
                <a
                  href={gistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {gistUrl}
                </a>
              </p>
              <button
                onClick={handleOpenGist}
                className="mt-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xl"
              >
                Open Gist
              </button>
            </div>
          )}
        </div>
      )}

      {!previewHtml && (
        <div className="fixed top-1 left-1/2 transform -translate-x-1/2">
          <button
            className={`px-6 py-3 rounded-lg text-white font-semibold text-xl ${
              isValidHtml && !isLoading
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!isValidHtml || isLoading}
          >
            {isLoading ? "Loading..." : "Preview HTML"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HtmlPreviewer;