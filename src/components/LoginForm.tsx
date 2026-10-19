"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, MailCheck } from "lucide-react";
import { useShop } from "@/context/ShopContext";

export function LoginForm() {
  const router = useRouter();
  const { login } = useShop();
  const [mode, setMode] = useState<"login" | "forgot" | "sent">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [resetEmail, setResetEmail] = useState("");

  return (
    <div className="container-page pt-10 md:pt-16">
      <div className="mx-auto max-w-[440px]">
        {mode === "login" && (
          <>
            <div className="text-center">
              <h1 className="text-[32px] leading-tight font-semibold md:text-[40px]">Logga in</h1>
              <p className="mt-2 text-ink-soft">Logga in med ditt företagskonto för att se priser och beställa.</p>
            </div>
            <form
              className="card mt-8 space-y-5 p-6 sm:p-8"
              data-testid="login-form"
              onSubmit={(e) => {
                e.preventDefault();
                login();
                router.push("/");
              }}
            >
              <div>
                <label htmlFor="email" className="field-label">
                  E-post
                </label>
                <input id="email" name="email" type="email" required autoComplete="email" placeholder="namn@foretag.se" className="field" />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Lösenord
                  </label>
                  <button type="button" onClick={() => setMode("forgot")} className="text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline">
                    Glömt lösenord?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Ditt lösenord"
                    className="field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Dölj lösenord" : "Visa lösenord"}
                    className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-sand"
                  >
                    {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                  </button>
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="peer sr-only" />
                <span
                  className={`grid size-[18px] place-items-center rounded-[5px] border peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40 ${
                    remember ? "border-ink bg-ink text-white" : "border-line-strong"
                  }`}
                >
                  {remember && <Check className="size-3" strokeWidth={3} />}
                </span>
                Kom ihåg mig på den här enheten
              </label>
              <button type="submit" className="btn btn-lg btn-primary w-full" data-testid="login-submit">
                Logga in
              </button>
            </form>
            <div className="mt-6 rounded-2xl bg-sand p-5 text-center text-sm">
              <p className="font-semibold text-ink">Inte kund än?</p>
              <p className="mt-0.5 text-ink-soft">Ansök om ett företagskonto så öppnar vi det, oftast inom en arbetsdag.</p>
              <Link href="/bli-kund" className="btn btn-sm btn-outline mt-4">
                Bli kund
              </Link>
            </div>
          </>
        )}

        {mode === "forgot" && (
          <>
            <button type="button" onClick={() => setMode("login")} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
              <ArrowLeft className="size-4" /> Tillbaka till inloggning
            </button>
            <h1 className="mt-6 text-[30px] leading-tight font-semibold md:text-[36px]">Glömt lösenord?</h1>
            <p className="mt-2 text-ink-soft">Skriv din e-post så skickar vi en länk där du kan välja ett nytt lösenord.</p>
            <form
              className="card mt-7 space-y-5 p-6 sm:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                setMode("sent");
              }}
            >
              <div>
                <label htmlFor="reset-email" className="field-label">
                  E-post
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="namn@foretag.se"
                  className="field"
                />
              </div>
              <button type="submit" className="btn btn-lg btn-dark w-full">
                Skicka länk
              </button>
            </form>
          </>
        )}

        {mode === "sent" && (
          <div className="card p-8 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-50 text-success">
              <MailCheck className="size-7" strokeWidth={1.8} />
            </span>
            <h1 className="mt-5 text-2xl font-semibold">Kolla din inkorg</h1>
            <p className="mt-2 text-ink-soft">
              Om <span className="font-semibold text-ink">{resetEmail}</span> finns hos oss har vi skickat en länk för att välja nytt lösenord. Länken gäller i 24 timmar.
            </p>
            <button type="button" onClick={() => setMode("login")} className="btn btn-outline mt-6">
              Tillbaka till inloggning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
