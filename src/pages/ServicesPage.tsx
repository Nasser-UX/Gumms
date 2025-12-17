import * as React from "react";
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
import CreateServiceModal from "@/components/CreateServiceModal";

interface Service {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  createdAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchServices = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<Service[]>("/services");
      setServices(data);
    } catch (err) {
      setError("Failed to load services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleServiceCreated = () => {
    setIsModalOpen(false);
    fetchServices();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Services</CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>
            Create Service
          </Button>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading...</p>}

          {error && (
            <div className="text-center py-8 space-y-4">
              <p className="text-red-500">{error}</p>
              <div>
                <Button onClick={fetchServices} variant="outline">
                  Retry
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name (Arabic)</TableHead>
                  <TableHead>Name (English)</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No services found
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.code}</TableCell>
                      <TableCell>{service.nameAr}</TableCell>
                      <TableCell>{service.nameEn}</TableCell>
                      <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateServiceModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleServiceCreated}
      />
    </div>
  );
}
