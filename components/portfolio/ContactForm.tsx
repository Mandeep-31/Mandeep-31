"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";
const WEBSITE_NAME = "Mandeep Acharya Website";

/*
 * NEXT_PUBLIC_* vars are inlined at BUILD time. If any is empty, the deployed
 * build was made without them (e.g. missing from the host's env settings) and
 * every emailjs.send() will fail — surface that loudly in dev instead of
 * failing silently at submit time. See .env.example.
 */
if (process.env.NODE_ENV === "development") {
  const missing = [
    ["NEXT_PUBLIC_EMAILJS_SERVICE_ID", SERVICE_ID],
    ["NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", TEMPLATE_ID],
    ["NEXT_PUBLIC_EMAILJS_PUBLIC_KEY", PUBLIC_KEY],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
  if (missing.length > 0) {
    console.error(
      `[ContactForm] Missing EmailJS env vars: ${missing.join(", ")}. ` +
        "Add them to .env.local (and to the deploy platform as BUILD-time " +
        "env vars), then restart/redeploy — submissions will fail without them."
    );
  }
}

const WHATSAPP = "https://wa.me/919741689162";

type StepKey = "name" | "email" | "subject" | "message";

type Step = {
  key: StepKey;
  question: string;
  placeholder: string;
  hint: string;
  type: "text" | "email";
};

const STEPS: Step[] = [
  {
    key: "name",
    question: "What should I call you?",
    placeholder: "Your name",
    hint: "Just so I know who I’m talking to.",
    type: "text",
  },
  {
    key: "email",
    question: "Where can I write back?",
    placeholder: "you@example.com",
    hint: "I’ll reply to this address and send you a confirmation.",
    type: "email",
  },
  {
    key: "subject",
    question: "What is it about?",
    placeholder: "A short subject",
    hint: "One line is plenty.",
    type: "text",
  },
  {
    key: "message",
    question: "What’s on your mind?",
    placeholder: "Write your message…",
    hint: "Take your time — I read everything.",
    type: "text",
  },
];

const EMPTY: Record<StepKey, string> = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/*
 * Keep the check strict — this is the only way a message finds its way to
 * Mandeep. Structure + sane lengths + no obvious malformed domains.
 */
function validateEmail(raw: string): boolean {
  const email = raw.trim().toLowerCase();
  if (!email || email.length > 254) return false;
  if (!EMAIL_RE.test(email)) return false;

  const [local, domain] = email.split("@") as [string, string];
  if (!local || !domain) return false;
  if (local.length > 64) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  if (labels.some((label) => !label || label.startsWith("-") || label.endsWith("-"))) {
    return false;
  }
  if (labels[labels.length - 1].length < 2) return false;

  return true;
}

export default function ContactForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<StepKey, string>>(EMPTY);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "failed">("idle");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      (textareaRef.current ?? inputRef.current)?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [step]);

  const setValue =
    (key: StepKey) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      setError("");
      if (status === "failed") setStatus("idle");
    };

  const stepIsValid = (key: StepKey): boolean => {
    if (key === "email") return validateEmail(values.email);
    return values[key].trim().length > 0;
  };

  const goBack = () => {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  };

  const submit = async () => {
    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: WEBSITE_NAME,
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          reply_to: values.email.trim().toLowerCase(),
          subject: values.subject.trim(),
          message: values.message.trim(),
          to_name: "Mandeep Acharya",
        },
        { publicKey: PUBLIC_KEY }
      );
      setStatus("success");
    } catch {
      setStatus("failed");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    if (!stepIsValid(current.key)) {
      setError(
        current.key === "email"
          ? "That doesn’t look like a valid email — please check it carefully."
          : "Please fill this in — it lets me reply properly."
      );
      return;
    }

    setError("");
    if (isLast) {
      void submit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    if (current.key === "message" && !(e.metaKey || e.ctrlKey)) return;
    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  };

  const reset = () => {
    setStep(0);
    setValues(EMPTY);
    setError("");
    setStatus("idle");
  };

  return (
    <section className="contact">
      <div className="contact-glow" aria-hidden="true" />
      <div className="contact-mark" aria-hidden="true">
        Mandeep
      </div>

      <div className="contact-inner">
        <div className="contact-label">
          <span>Say hello</span>
          <span className="contact-rule" aria-hidden="true" />
        </div>

        {status === "success" ? (
          <div className="contact-success">
            <h2 className="contact-success-title">
              Message <em>sent.</em>
            </h2>
            <p className="contact-success-note">
              Thank you — your message is on its way to Mandeep. A confirmation has
              been sent to{" "}
              <span className="contact-success-mail">
                {values.email.trim().toLowerCase()}
              </span>
              .
            </p>
            <p className="contact-success-hint">
              Mandeep will get back to you shortly. Talk soon.
            </p>
            <div className="contact-success-actions">
              <button
                className="contact-action contact-next"
                type="button"
                onClick={reset}
              >
                Send another
              </button>
              <Link className="contact-back-link" href="/">
                ( Back to the work )
              </Link>
            </div>
          </div>
        ) : (
          <form className="contact-body" key={step} onSubmit={handleSubmit} noValidate>
            <div className="contact-progress" aria-hidden="true">
              {STEPS.map((s, i) => (
                <span
                  key={s.key}
                  className={`contact-progress-seg${i <= step ? " is-active" : ""}`}
                />
              ))}
            </div>

            <h2 className="contact-question">
              <span className="contact-question-num">
                {String(step + 1).padStart(2, "0")}
              </span>
              {current.question}
            </h2>

            {current.key === "message" ? (
              <textarea
                ref={textareaRef}
                className="contact-input contact-input-area"
                value={values.message}
                placeholder={current.placeholder}
                aria-label={current.question}
                onChange={setValue("message")}
                onKeyDown={handleKeyDown}
                rows={4}
              />
            ) : (
              <input
                ref={inputRef}
                className="contact-input"
                type={current.type}
                value={values[current.key]}
                placeholder={current.placeholder}
                aria-label={current.question}
                autoComplete={
                  current.key === "email"
                    ? "email"
                    : current.key === "name"
                      ? "name"
                      : "off"
                }
                spellCheck={false}
                onChange={setValue(current.key)}
                onKeyDown={handleKeyDown}
              />
            )}

            <div className="contact-body-foot" aria-live="polite">
              {error ? <p className="contact-error">{error}</p> : <p className="contact-hint">{current.hint}</p>}
              {status === "failed" && (
                <p className="contact-error">
                  Something didn’t go through — please try again in a moment.
                </p>
              )}
            </div>

            <div className="contact-actions">
              {step > 0 && (
                <button
                  className="contact-action contact-back"
                  type="button"
                  onClick={goBack}
                >
                  Back
                </button>
              )}
              <button
                className="contact-action contact-next"
                type="submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : isLast ? "Send message" : "Next"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="contact-meta">
        <span>© 2026 — Mandeep</span>
        <a
          className="contact-meta-link"
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp ↗
        </a>
        <Link className="contact-meta-link contact-meta-back" href="/">
          Back to the work
        </Link>
      </div>
    </section>
  );
}
