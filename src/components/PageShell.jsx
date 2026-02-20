import React from "react";
import { Card } from "react-bootstrap";

export default function PageShell({ title, icon, children }) {
  return (
    <div className="page-shell">
      <div className="page-header d-flex align-items-center gap-2">
        {icon ? <i className={`bi ${icon} fs-4`} aria-hidden="true" /> : null}
        <h1 className="h3 m-0">{title}</h1>
      </div>

      <Card className="page-card">
        <Card.Body className="p-3 p-md-4">{children}</Card.Body>
      </Card>
    </div>
  );
}
