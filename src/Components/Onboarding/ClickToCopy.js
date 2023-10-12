import { useState } from "react";

const ClickToCopy = ({ pairKey }) => {
  const [copied, setCopied] = useState(false);

  // Create - Copy clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pairKey);
    setCopied(true);
  };

  return (
    <>
      {copied ? (
        <p className="text-green-800">Pair key copied!</p>
      ) : (
        <p>Click to copy:</p>
      )}
      <button
        id="copyToClipboard"
        className="rounded-lg bg-window p-2 text-lg font-bold shadow-md hover:translate-y-[-1px] active:translate-y-[3px]"
        onClick={copyToClipboard}
      >
        📑 {pairKey}
      </button>
    </>
  );
};

export default ClickToCopy;
