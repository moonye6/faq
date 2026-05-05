import { SchemaTypeDef, FormData, getString, getRepeater } from '~/lib/schema-types';
import { schemaRegistry, getSchemaBySlug } from '../../../src/schemas';
import { createInterface } from 'readline';

export interface GenerateOptions {
  type?: string;
  output?: string;
  preview?: boolean;
}

// Simple prompt function for CLI interaction
async function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

function getAvailableSchemaTypes(): { id: string; name: string; slug: string }[] {
  return schemaRegistry.map(schema => ({
    id: schema.id,
    name: schema.name,
    slug: schema.slug
  }));
}

async function collectFormData(schema: SchemaTypeDef): Promise<FormData> {
  const formData: FormData = {};
  
  console.log(`\nGenerating ${schema.name} schema. Please provide the following information:\n`);
  
  for (const field of schema.fields) {
    if (field.kind === 'text' || field.kind === 'textarea') {
      const question = `${field.label}${field.required ? ' (required)' : ''}: `;
      const value = await prompt(question);
      
      if (value.trim() || !field.required) {
        formData[field.key] = value.trim();
      }
    } else if (field.kind === 'repeater') {
      console.log(`\nEnter ${field.label} (press Enter with empty input to finish):`);
      const items: Array<Record<string, string>> = [];
      let itemIndex = 1;
      
      while (true) {
        console.log(`\n${field.itemLabel} #${itemIndex}:`);
        const item: Record<string, string> = {};
        let hasInput = false;
        
        for (const subField of field.itemFields) {
          const value = await prompt(`  ${subField.label}: `);
          
          if (value.trim()) {
            item[subField.key] = value.trim();
            hasInput = true;
          }
        }
        
        if (!hasInput) {
          break;
        }
        
        items.push(item);
        itemIndex++;
      }
      
      formData[field.key] = items;
    }
  }
  
  return formData;
}

function generateJsonLd(schema: SchemaTypeDef, formData: FormData): string {
  const jsonLdObj = schema.buildJsonLd(formData);
  return JSON.stringify(jsonLdObj, null, 2);
}

export async function runGenerate(opts: GenerateOptions): Promise<number> {
  try {
    let selectedSchema: SchemaTypeDef | undefined;
    
    if (opts.type) {
      // If type is specified, use it directly
      selectedSchema = getSchemaBySlug(opts.type);
      if (!selectedSchema) {
        // Try to match by ID as well
        selectedSchema = schemaRegistry.find(s => s.id === opts.type);
      }
      
      if (!selectedSchema) {
        process.stderr.write(`schemaguardian: Unknown schema type '${opts.type}'. Available types: ${getAvailableSchemaTypes().map(s => s.slug).join(', ')}\n`);
        return 1;
      }
    } else {
      // Interactive selection
      const availableTypes = getAvailableSchemaTypes();
      console.log("Available schema types:");
      availableTypes.forEach((type, index) => {
        console.log(`${index + 1}. ${type.name} (${type.slug})`);
      });
      
      const choice = await prompt("\nSelect a schema type (enter number or slug): ");
      const trimmedChoice = choice.trim();
      
      const selected = availableTypes.find(
        (type, index) => 
          String(index + 1) === trimmedChoice || 
          type.slug === trimmedChoice ||
          type.id === trimmedChoice
      );
      
      if (!selected) {
        process.stderr.write(`schemaguardian: Invalid selection. Please choose a valid option.\n`);
        return 1;
      }
      
      selectedSchema = schemaRegistry.find(s => s.id === selected.id);
    }
    
    if (!selectedSchema) {
      process.stderr.write(`schemaguardian: Failed to select schema.\n`);
      return 1;
    }
    
    // Collect form data
    const formData = await collectFormData(selectedSchema);
    
    // Generate JSON-LD
    const jsonLdString = generateJsonLd(selectedSchema, formData);
    
    if (opts.preview) {
      console.log("\nGenerated JSON-LD:");
      console.log("==================");
      console.log(jsonLdString);
      console.log("==================");
    }
    
    if (opts.output) {
      // Write to file
      const fs = require('fs');
      fs.writeFileSync(opts.output, jsonLdString, 'utf8');
      console.log(`\nSchema saved to: ${opts.output}`);
    } else if (!opts.preview) {
      // Output to stdout if no output file specified and not just preview
      process.stdout.write(jsonLdString + '\n');
    }
    
    return 0;
  } catch (error) {
    process.stderr.write(`schemaguardian: Error generating schema: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}