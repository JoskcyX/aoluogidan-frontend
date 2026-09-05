"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <Container className="flex min-h-screen flex-col items-center justify-center py-20 text-center">
          <p className="font-display text-2xl text-ink">Something went wrong.</p>
          <p className="mt-2 max-w-sm text-slate">
            We&apos;re sorry — an unexpected error occurred. Please try again, or contact us if the problem continues.
          </p>
          <Button className="mt-8" onClick={() => reset()}>
            Try Again
          </Button>
        </Container>
      </body>
    </html>
  );
}
