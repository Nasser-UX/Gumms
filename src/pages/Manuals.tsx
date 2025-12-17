import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Manuals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manuals</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Browse and manage all user manuals.
        </p>
      </CardContent>
    </Card>
  );
}
