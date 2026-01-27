import React from "react";
import { Card } from "react-bootstrap";

export default function PageShell({ title, icon, children }) {
  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex align-items-center gap-2">
        {icon ? <i className={`bi ${icon} fs-4`} aria-hidden="true" /> : null}
        <h1 className="h3 m-0">{title}</h1>
      </div>

      <Card className="shadow-sm">
        <Card.Body>{children}</Card.Body>
      </Card>
    </div>
  );
}
