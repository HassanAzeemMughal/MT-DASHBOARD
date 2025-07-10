import React from "react";

const Index = ({ text = "Market Volatility", borderColor = "#D8D46E", textColor = "#D8D46E" }) => {
  return (
    <span class="text-xs font-medium px-[15px] py-[12px] rounded-3xl dark:text-[#D8D46E] border" style={{ border: `1px solid ${borderColor}`, color: textColor }}>
      {text}
    </span>
  );
};

export default Index;
