"use client";

import { Card } from "@/components/ui/card";

export const FolderSkeleton = () => {
  return (
    <div className="p-4 md:p-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="p-6 shadow-none border border-border/30 bg-muted/10"
            style={{
              animation: `fadeInUp 0.5s ease-out`,
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <div className="flex gap-4 items-start justify-start w-full mb-4">
              <div className="p-3 border rounded-lg bg-muted w-12 h-12" />

              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-3 w-1/2 bg-muted rounded"></div>
              </div>

              <div className="h-4 w-4 bg-muted rounded-full"></div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-muted rounded-full"></div>
                <div className="h-3 w-16 bg-muted rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
