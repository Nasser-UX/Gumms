import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewQueue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Review and approve pending manuals.
        </p>
      </CardContent>
    </Card>
  );
}
