import React from "react";
import TextField from "./TextField.jsx";
import TextareaField from "./TextareaField.jsx";
import ImageField from "./ImageField.jsx";
import ArrayField from "./ArrayField.jsx";

/** Dispatch to the appropriate field component based on the schema type. */
export default function FieldRouter({ field, value, onChange }) {
  if (!field) return null;
  switch (field.type) {
    case "textarea":
      return <TextareaField field={field} value={value} onChange={onChange} />;
    case "image":
      return <ImageField field={field} value={value} onChange={onChange} />;
    case "array":
      return <ArrayField field={field} value={value} onChange={onChange} />;
    case "url":
    case "text":
    default:
      return <TextField field={field} value={value} onChange={onChange} />;
  }
}
