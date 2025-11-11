"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

interface ComparisonChange {
  type: "added" | "removed" | "modified";
  field: string;
  oldValue?: string;
  newValue?: string;
}

const comparisonData: Record<string, Record<string, ComparisonChange[]>> = {
  // "v5-v4": [
  //   {
  //     type: "modified",
  //     field: "Q4 Revenue Forecast",
  //     oldValue: "$2.5M",
  //     newValue: "$2.625M (+5%)",
  //   },
  //   {
  //     type: "modified",
  //     field: "Operating Expenses",
  //     oldValue: "$1.2M",
  //     newValue: "$1.15M (-4.2%)",
  //   },
  //   {
  //     type: "added",
  //     field: "Market Analysis Section",
  //     newValue: "New competitive landscape analysis",
  //   },
  //   {
  //     type: "modified",
  //     field: "Appendix Calculations",
  //     oldValue: "Contains errors",
  //     newValue: "Corrected",
  //   },
  // ],
  // "v4-v3": [
  //   {
  //     type: "added",
  //     field: "Q4 Revenue Breakdown",
  //     newValue: "By region and product line",
  //   },
  //   {
  //     type: "added",
  //     field: "Customer Acquisition Metrics",
  //     newValue: "New customer data included",
  //   },
  //   {
  //     type: "modified",
  //     field: "Market Share Analysis",
  //     oldValue: "Q1-Q3 only",
  //     newValue: "Updated with latest data",
  //   },
  // ],
  // "v3-v2": [
  //   {
  //     type: "added",
  //     field: "Q1-Q3 Financial Data",
  //     newValue: "Complete quarterly breakdown",
  //   },
  //   {
  //     type: "added",
  //     field: "Charts and Graphs",
  //     newValue: "Visual data representation",
  //   },
  //   {
  //     type: "modified",
  //     field: "Document Structure",
  //     oldValue: "Basic template",
  //     newValue: "Organized sections",
  //   },
  // ],
};

export function VersionComparison({
  version1,
  version2,
  onChangeCompareVersion,
}: {
  version1: string;
  version2: string;
  onChangeCompareVersion: (version: string) => void;
}) {
  const comparisonKey = `${version1}-${version2}`;
  const changes = comparisonData[comparisonKey] || comparisonData["v5-v4"];

  return (
    <div className="space-y-6">
      {/* Version Selector */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            From
          </p>
          <div className="px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-mono font-semibold">
            {version1}
          </div>
        </div>

        <ArrowRight className="w-5 h-5 text-muted-foreground mt-6" />

        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            To
          </p>
          <Select value={version2} onValueChange={onChangeCompareVersion}>
            <SelectTrigger className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v4">v4</SelectItem>
              <SelectItem value="v3">v3</SelectItem>
              <SelectItem value="v2">v2</SelectItem>
              <SelectItem value="v1">v1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Changes List */}
      {/* <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Changes between versions</h4>
        <div className="space-y-2">
          {changes.map((change, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
              style={{
                animation: `fadeInUp 0.3s ease-out`,
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-sm font-medium text-foreground">{change.field}</p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    change.type === "added"
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : change.type === "removed"
                        ? "bg-red-500/10 text-red-700 dark:text-red-400"
                        : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {change.type === "added" ? "Added" : change.type === "removed" ? "Removed" : "Modified"}
                </span>
              </div>

              {change.oldValue && change.newValue && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">From:</span>
                    <span className="line-through text-muted-foreground">{change.oldValue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">To:</span>
                    <span className="text-foreground font-medium">{change.newValue}</span>
                  </div>
                </div>
              )}

              {change.newValue && !change.oldValue && <p className="text-xs text-foreground">{change.newValue}</p>}
            </div>
          ))}
        </div>
      </div> */}

      {/* Summary */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Summary
        </p>
        <p className="text-sm text-foreground">
          {/* {changes.length} change{changes.length !== 1 ? "s" : ""} between {version2} and {version1} */}
        </p>
      </div>
    </div>
  );
}
