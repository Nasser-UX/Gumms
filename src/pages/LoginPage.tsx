import * as React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState<string | null>(null);

  // Check if already logged in
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const { data } = await api.post<LoginResponse>("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      // Store token in localStorage
      localStorage.setItem("token", data.access_token);

      // Optionally store user data
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-primary text-primary-foreground">
              <span className="text-xl font-semibold">G</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">GUMMS</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Enter your email and password to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gumms.local"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            {/* Test Credentials Hint */}
            <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
              <strong>Test Account:</strong><br />
              Email: admin@gumms.local<br />
              Password: password
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
