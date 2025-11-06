import { HttpHandler } from 'msw';
import { fromOpenApi } from '@mswjs/source/open-api';
import algodSpec from '../algod.oas3.json' assert { type: 'json' };

// Layer 1: OpenAPI-generated handlers (baseline)
const openApiHandlers = await fromOpenApi(algodSpec as any);

export const handlers: HttpHandler[] = [
  ...openApiHandlers,
];