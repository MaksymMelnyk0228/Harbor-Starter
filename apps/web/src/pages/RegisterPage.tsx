import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../stores/authStore";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { ApiError } from "../services/api";

export function RegisterPage() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await register(name, email, password);
      toast.success("Account created");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not register");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl">Create account</h1>
      <form onSubmit={onSubmit} className="surface mt-8 space-y-4 p-6">
        <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-pine-800">Sign in</Link>
      </p>
    </div>
  );
}
