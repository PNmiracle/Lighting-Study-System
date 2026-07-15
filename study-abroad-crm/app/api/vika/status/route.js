import { getVikaStatus } from '../../../../src/server/vika.js';

export async function GET() {
  return Response.json(await getVikaStatus());
}
