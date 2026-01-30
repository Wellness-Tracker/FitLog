import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function NotFound() {
  return (
    <PageShell title="Page not found" icon="bi-exclamation-triangle">
      <p className="text-muted">The page you’re looking for doesn’t exist.</p>
      <Button as={Link} to="/" variant="primary">
        Back to Dashboard
      </Button>
    </PageShell>
  );
}
