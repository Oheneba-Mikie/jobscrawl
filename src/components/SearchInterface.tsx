import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

interface SearchInterfaceProps {
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

const SearchInterface = ({
  onSearch = () => {},
  isLoading = false,
}: SearchInterfaceProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border-0 ring-1 ring-slate-200/50">
      <CardContent className="pt-8 pb-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 md:flex-row md:items-end"
        >
          <div className="flex-1 space-y-4">
            <div className="text-xl font-semibold text-slate-800">
              Start Your Search
            </div>
            <div className="text-slate-600">
              Enter a search query to crawl the web for relevant information
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="e.g. Jobs in Ghana, Remote tech jobs in Africa"
                className="pl-12 h-14 text-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-10 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? "Searching..." : "Start Search"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchInterface;
