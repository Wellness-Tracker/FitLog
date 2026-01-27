import React from "react";
import { Card } from "react-bootstrap";

export default function SummaryCard({ title, value, subtext, icon }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Subtitle className="text-muted">{title}</Card.Subtitle>
            <Card.Title className="mt-2 fs-3">{value}</Card.Title>
            {subtext ? <div className="text-muted small">{subtext}</div> : null}
          </div>

          <div className="fs-3 text-secondary">
            <i className={`bi ${icon}`} aria-hidden="true" />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
