import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { ApiError } from "../services/api";

export function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      if (user.role === "admin") {
        navigate("/admin");
        return;
      }
      navigate(from);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not sign in");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-ink-500">Use your Harbor account to check out and track orders.</p>
      <form onSubmit={onSubmit} className="surface mt-8 space-y-4 p-6">
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-sm">
        New here? <Link to="/register" className="text-pine-800">Create an account</Link>
      </p>
    </div>
  );
}
