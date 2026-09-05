import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl text-brass">404</p>
      <h1 className="mt-4 font-display text-2xl text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-slate">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="mt-8">
        <Button>Return Home</Button>
      </Link>
    </Container>
  );
}
