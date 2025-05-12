"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SeachBar: React.FC<{ baseUrl: string }> = ({ baseUrl }) => {
  const [keywords, setKeywords] = useState<string>();

  const handleSearch = async () => {
    const res = await fetch(
      `${baseUrl}/api/amazon/products?keywords=${keywords}`
    );
    const data = await res.json();
    console.log("DATA", data);
  };

  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mt-4">
      <Input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="seach for products"
      />

      <Button className="ml-2" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default SeachBar;
