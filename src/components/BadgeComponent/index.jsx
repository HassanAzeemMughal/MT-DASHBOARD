import React from "react";

const Index = ({ border = "#FE2A5D", text = "SELL" }) => {
    return (
      <div
        className="inline-flex items-center justify-center px-5 py-2 font-medium text-sm leading-4 rounded-md"
        style={{ border: `1px solid ${border}`, color: border }}
      >
        {text}
      </div>
    );
  };

export default Index;
