import * as React from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Manual {
  id: string;
  serviceCode: string;
  serviceName: string;
  version: string;
  status: string;
  updatedAt: string;
}

export default function ManualsPage() {
  const navigate = useNavigate();
  const [manuals, setManuals] = React.useState<Manual[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchManuals = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<Manual[]>("/manuals");
      setManuals(data);
    } catch (err) {
      setError("Failed to load manuals");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchManuals();
  }, [fetchManuals]);

  const handleEditManual = (manualId: string) => {
    navigate(`/manuals/${manualId}/edit`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service Manuals</CardTitle>
          <Button onClick={() => navigate("/manuals/new")}>
            Create Manual
          </Button>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading...</p>}

          {error && (
            <div className="text-center py-8 space-y-4">
              <p className="text-red-500">{error}</p>
              <div>
                <Button onClick={fetchManuals} variant="outline">
                  Retry
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Code</TableHead>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manuals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No manuals found
                    </TableCell>
                  </TableRow>
                ) : (
                  manuals.map((manual) => (
                    <TableRow key={manual.id}>
                      <TableCell className="font-medium">{manual.serviceCode}</TableCell>
                      <TableCell>{manual.serviceName}</TableCell>
                      <TableCell>{manual.version}</TableCell>
                      <TableCell>{manual.status}</TableCell>
                      <TableCell>{new Date(manual.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditManual(manual.id)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
