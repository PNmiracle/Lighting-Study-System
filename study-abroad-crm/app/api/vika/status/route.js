import { getVikaStatus } from '../../../../src/server/vika.js';

export function GET() {
  return Response.json(getVikaStatus());
}
