import { useMemo, useState } from 'preact/hooks';
import { getSchemaBySlug } from '~/schemas';
import type {
  FieldDef,
  FormData,
  RepeaterField,
  RepeaterValue,
  SimpleField,
} from '~/lib/schema-types';

interface Props {
  /** The schema slug to render (matches SchemaTypeDef.slug). */
  schemaSlug: string;
}

export default function SchemaGenerator({ schemaSlug }: Props) {
  const schema = getSchemaBySlug(schemaSlug);
  if (!schema) {
    return (
      <div class="sg-error">Unknown schema: {schemaSlug}</div>
    );
  }

  const [data, setData] = useState<FormData>(() => structuredClone(schema.sampleData));
  const [copied, setCopied] = useState(false);

  const jsonLd = useMemo(() => schema.buildJsonLd(data), [data, schema]);
  const jsonLdString = useMemo(() => JSON.stringify(jsonLd, null, 2), [jsonLd]);
  const scriptTag = useMemo(
    () => `<script type="application/ld+json">\n${jsonLdString}\n</script>`,
    [jsonLdString],
  );

  function updateField(key: string, value: string | RepeaterValue) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(scriptTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — fall back to selection
    }
  }

  return (
    <div class="sg-root">
      <div class="sg-grid">
        <form class="sg-form" onSubmit={(e) => e.preventDefault()}>
          {schema.fields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field}
              value={data[field.key]}
              onChange={(v) => updateField(field.key, v)}
            />
          ))}
        </form>

        <div class="sg-output">
          <div class="sg-output-header">
            <span class="sg-label">Generated JSON-LD</span>
            <button type="button" class="sg-copy" onClick={copyOutput}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre class="sg-pre"><code>{scriptTag}</code></pre>
          <p class="sg-hint">
            Paste this into your page's <code>&lt;head&gt;</code>. The Q&amp;A or step
            content above must remain visible on the same page.
          </p>
        </div>
      </div>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: FormData[string] | undefined;
  onChange: (v: string | RepeaterValue) => void;
}) {
  if (field.kind === 'text') {
    return (
      <label class="sg-field">
        <span class="sg-field-label">{field.label}</span>
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          required={field.required}
          onInput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
        />
      </label>
    );
  }
  if (field.kind === 'textarea') {
    return (
      <label class="sg-field">
        <span class="sg-field-label">{field.label}</span>
        <textarea
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          required={field.required}
          rows={field.rows ?? 3}
          onInput={(e) => onChange((e.currentTarget as HTMLTextAreaElement).value)}
        />
      </label>
    );
  }
  if (field.kind === 'repeater') {
    const items = Array.isArray(value) ? value : [];
    return (
      <RepeaterRenderer field={field} items={items} onChange={onChange} />
    );
  }
  return null;
}

function RepeaterRenderer({
  field,
  items,
  onChange,
}: {
  field: RepeaterField;
  items: RepeaterValue;
  onChange: (v: RepeaterValue) => void;
}) {
  function updateItem(idx: number, key: string, val: string) {
    const next = items.map((it, i) => (i === idx ? { ...it, [key]: val } : it));
    onChange(next);
  }
  function addItem() {
    const blank = Object.fromEntries(field.itemFields.map((f) => [f.key, '']));
    onChange([...items, blank]);
  }
  function removeItem(idx: number) {
    if (field.minItems && items.length <= field.minItems) return;
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <fieldset class="sg-repeater">
      <legend class="sg-field-label">{field.label}</legend>
      {items.map((item, idx) => (
        <div class="sg-repeater-item" key={idx}>
          <div class="sg-repeater-item-header">
            <span class="sg-repeater-item-label">
              {field.itemLabel} {idx + 1}
            </span>
            <button
              type="button"
              class="sg-remove"
              onClick={() => removeItem(idx)}
              disabled={field.minItems != null && items.length <= field.minItems}
              aria-label={`Remove ${field.itemLabel} ${idx + 1}`}
            >
              Remove
            </button>
          </div>
          {field.itemFields.map((sub) => (
            <SubFieldRenderer
              key={sub.key}
              field={sub}
              value={item[sub.key] ?? ''}
              onChange={(v) => updateItem(idx, sub.key, v)}
            />
          ))}
        </div>
      ))}
      <button type="button" class="sg-add" onClick={addItem}>
        + {field.addLabel}
      </button>
    </fieldset>
  );
}

function SubFieldRenderer({
  field,
  value,
  onChange,
}: {
  field: SimpleField;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.kind === 'text') {
    return (
      <label class="sg-subfield">
        <span class="sg-subfield-label">{field.label}</span>
        <input
          type="text"
          value={value}
          placeholder={field.placeholder}
          required={field.required}
          onInput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
        />
      </label>
    );
  }
  return (
    <label class="sg-subfield">
      <span class="sg-subfield-label">{field.label}</span>
      <textarea
        value={value}
        placeholder={field.placeholder}
        required={field.required}
        rows={field.rows ?? 3}
        onInput={(e) => onChange((e.currentTarget as HTMLTextAreaElement).value)}
      />
    </label>
  );
}
