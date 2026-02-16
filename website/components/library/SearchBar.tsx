"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/library/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-claude-secondary"
          size={18}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search knowledge..."
          className="w-full pl-10 pr-10 py-2 border border-claude-secondary rounded-lg focus:outline-2 focus:outline-claude-primary transition-colors duration-150"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-claude-secondary hover:text-claude-primary transition-colors duration-150"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
