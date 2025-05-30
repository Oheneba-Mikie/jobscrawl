import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowUpDown, Search, Filter } from "lucide-react";

interface ResultItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  date: string;
  relevanceScore: number;
}

interface ResultsTableProps {
  results?: ResultItem[];
  isLoading?: boolean;
}

const ResultsTable = ({
  results = [],
  isLoading = false,
}: ResultsTableProps) => {
  const [sortColumn, setSortColumn] =
    useState<keyof ResultItem>("relevanceScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<string>("");

  // Mock data for when no results are provided
  const mockResults: ResultItem[] = [
    {
      id: "1",
      title: "Remote Software Engineer Jobs in Ghana",
      summary:
        "Find the best remote software engineering positions available in Ghana with competitive salaries and flexible working hours.",
      url: "https://example.com/jobs/ghana/software",
      date: "2023-06-15",
      relevanceScore: 0.95,
    },
    {
      id: "2",
      title: "Top Tech Companies Hiring in Africa",
      summary:
        "Discover leading technology companies that are actively recruiting talent across various African countries.",
      url: "https://example.com/tech-companies-africa",
      date: "2023-05-22",
      relevanceScore: 0.87,
    },
    {
      id: "3",
      title: "How to Find Remote Work in Ghana's Tech Industry",
      summary:
        "A comprehensive guide to finding and securing remote work opportunities in Ghana's growing technology sector.",
      url: "https://example.com/remote-work-ghana-guide",
      date: "2023-04-10",
      relevanceScore: 0.82,
    },
  ];

  const displayResults = results.length > 0 ? results : mockResults;

  // Handle sorting
  const handleSort = (column: keyof ResultItem) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Filter and sort results
  const filteredResults = displayResults
    .filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate =
        filterDate === "" ||
        filterDate === "all" ||
        item.date.includes(filterDate);

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      if (sortColumn === "relevanceScore") {
        return sortDirection === "asc"
          ? a.relevanceScore - b.relevanceScore
          : b.relevanceScore - a.relevanceScore;
      } else {
        const aValue = a[sortColumn]?.toString() || "";
        const bValue = b[sortColumn]?.toString() || "";
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

  // Handle export
  const handleExport = (format: "csv" | "json") => {
    if (filteredResults.length === 0) return;

    let content: string;
    let filename: string;
    let type: string;

    if (format === "csv") {
      // Create CSV content
      const headers = "Title,Summary,URL,Date,Relevance Score\n";
      const rows = filteredResults
        .map(
          (item) =>
            `"${item.title.replace(/"/g, '""')}","${item.summary.replace(/"/g, '""')}","${item.url}","${item.date}","${item.relevanceScore}"`,
        )
        .join("\n");
      content = headers + rows;
      filename = "search-results.csv";
      type = "text/csv";
    } else {
      // Create JSON content
      content = JSON.stringify(filteredResults, null, 2);
      filename = "search-results.json";
      type = "application/json";
    }

    // Create download link
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl border-0 ring-1 ring-slate-200/50">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex items-center w-full md:w-auto gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-slate-400" />
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger className="w-[200px] h-12 border-slate-200 focus:border-blue-500 rounded-lg">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All dates</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              disabled={filteredResults.length === 0}
              className="w-full md:w-auto h-12 border-slate-200 hover:bg-slate-50 rounded-lg font-medium"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("json")}
              disabled={filteredResults.length === 0}
              className="w-full md:w-auto h-12 border-slate-200 hover:bg-slate-50 rounded-lg font-medium"
            >
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-slate-200">
                <TableHead
                  className="cursor-pointer w-[250px] font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell font-semibold text-slate-700">
                  Summary
                </TableHead>
                <TableHead
                  className="cursor-pointer hidden md:table-cell font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer text-right font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  onClick={() => handleSort("relevanceScore")}
                >
                  <div className="flex items-center justify-end">
                    Relevance
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading results...
                  </TableCell>
                </TableRow>
              ) : filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((result) => (
                  <TableRow
                    key={result.id}
                    className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-medium py-4">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors"
                      >
                        {result.title}
                      </a>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-600 py-4">
                      {result.summary}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 py-4">
                      {result.date}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Badge
                        variant={
                          result.relevanceScore > 0.9
                            ? "default"
                            : result.relevanceScore > 0.7
                              ? "secondary"
                              : "outline"
                        }
                        className="font-semibold"
                      >
                        {(result.relevanceScore * 100).toFixed(0)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 text-slate-500 text-right font-medium">
          Showing {filteredResults.length} of {displayResults.length} results
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
