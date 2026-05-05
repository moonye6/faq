#!/usr/bin/env node

// Test script to verify schema types are accessible
import { schemaRegistry } from './src/schemas/index.ts';

console.log('Available Schema Types:');
console.log('=====================');

schemaRegistry.forEach((schema, index) => {
  console.log(`${index + 1}. ${schema.name} (ID: ${schema.id}, Slug: ${schema.slug})`);
});

console.log(`\nTotal: ${schemaRegistry.length} schema types`);