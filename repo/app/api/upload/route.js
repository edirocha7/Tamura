import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import { isAdmin } from '../../../lib/auth';
export async function POST(request) {
  const body = await request.json();
  try {
    return NextResponse.json(await handleUpload({ body, request,
      onBeforeGenerateToken: async () => {
        if (!isAdmin()) throw new Error('Não autorizado');
        return { allowedContentTypes: ['application/pdf', 'image/jpeg', 'text/html'], maximumSizeInBytes: 50 * 1024 * 1024, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {} }));
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 400 }); }
}
