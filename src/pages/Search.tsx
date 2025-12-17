import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Search() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Manuals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input placeholder="Search by service name, code, or keyword..." className="flex-1" />
          <Button>Search</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter search terms to find manuals across all services.
        </p>
      </CardContent>
    </Card>
  );
}
