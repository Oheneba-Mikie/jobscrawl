import React, { useState } from "react";
import { Search } from "lucide-react";
import SearchInterface from "./SearchInterface";
import ResultsTable from "./ResultsTable";
import ProgressIndicator from "./ProgressIndicator";
import FirecrawlApp from "@mendable/firecrawl-js";

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  url: string;
  date: string;
  relevanceScore: number;
}

const Home = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [progress, setProgress] = useState({
    status: "idle" as
      | "idle"
      | "crawling"
      | "processing"
      | "completed"
      | "error",
    pagesScanned: 0,
    estimatedTimeRemaining: 0,
    percentComplete: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize Firecrawl client
  const firecrawl = React.useMemo(() => {
    const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;
    if (!apiKey) {
      console.warn("VITE_FIRECRAWL_API_KEY not found in environment variables");
      return null;
    }
    return new FirecrawlApp({ apiKey });
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setResults([]);
    setErrorMessage("");
    setProgress({
      status: "crawling",
      pagesScanned: 0,
      estimatedTimeRemaining: 60,
      percentComplete: 0,
    });

    try {
      // Check if Firecrawl client is available
      if (!firecrawl) {
        throw new Error(
          "Firecrawl API key is not configured. Please set VITE_FIRECRAWL_API_KEY in your environment variables.",
        );
      }

      // Use Firecrawl search API
      const searchResponse = await firecrawl.search(query, {
        pageOptions: {
          fetchPageContent: true,
        },
        searchOptions: {
          limit: 10,
        },
      });

      if (searchResponse.success && searchResponse.data) {
        // Transform Firecrawl results to our format
        const transformedResults: SearchResult[] = searchResponse.data.map(
          (item: any, index: number) => ({
            id: `result-${index}`,
            title: item.metadata?.title || item.url || `Result ${index + 1}`,
            summary:
              item.markdown?.substring(0, 200) + "..." ||
              item.metadata?.description ||
              "No description available",
            url: item.url,
            date: new Date().toISOString().split("T")[0], // Use current date as crawl date
            relevanceScore: Math.max(0.5, Math.random() * 0.5 + 0.5), // Generate relevance score between 0.5-1.0
          }),
        );

        setResults(transformedResults);
        setProgress((prev) => ({
          ...prev,
          status: "completed",
          percentComplete: 100,
        }));
      } else {
        throw new Error("No results found or search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred during search",
      );
      setProgress((prev) => ({ ...prev, status: "error" }));
    } finally {
      setIsSearching(false);
    }
  };

  React.useEffect(() => {
    if (!isSearching || !searchQuery) return;

    // Simulate progress updates while API call is in progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev.status === "completed" || prev.status === "error") {
          clearInterval(interval);
          return prev;
        }

        const newPercentComplete = Math.min(prev.percentComplete + 5, 90); // Don't go to 100% until API completes
        const newPagesScanned =
          prev.pagesScanned + Math.floor(Math.random() * 3) + 1;
        const newTimeRemaining = Math.max(0, prev.estimatedTimeRemaining - 3);

        return {
          ...prev,
          pagesScanned: newPagesScanned,
          estimatedTimeRemaining: newTimeRemaining,
          percentComplete: newPercentComplete,
        };
      });
    }, 1500);

    // Cleanup interval on component unmount or when searching stops
    return () => clearInterval(interval);
  }, [isSearching, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Firecrawl Web Search
          </h1>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Discover relevant web content with our powerful AI-driven crawler.
            Search smarter, find faster.
          </p>
        </header>

        <SearchInterface onSearch={handleSearch} isLoading={isSearching} />

        {isSearching && (
          <ProgressIndicator
            isActive={true}
            status={progress.status}
            pagesScanned={progress.pagesScanned}
            estimatedTimeRemaining={progress.estimatedTimeRemaining}
            errorMessage={errorMessage}
          />
        )}

        {!isSearching && results.length > 0 && (
          <ResultsTable results={results} isLoading={false} />
        )}

        {!isSearching && results.length === 0 && searchQuery && (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-lg">
              No results found. Try a different search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
