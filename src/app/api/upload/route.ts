import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const safeName = file.name
      .replace(ext, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();
    const filename = `${safeName}-${timestamp}${ext}`;

    // Try Google Cloud Storage first
    if (process.env.GCS_BUCKET_NAME && process.env.GCS_PROJECT_ID) {
      try {
        const storage = new Storage({
          projectId: process.env.GCS_PROJECT_ID,
        });

        const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
        const blob = bucket.file(`uploads/${filename}`);

        await blob.save(buffer, {
          metadata: {
            contentType: file.type,
          },
        });

        await blob.makePublic();

        const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/uploads/${filename}`;

        return NextResponse.json({ url: publicUrl }, { status: 201 });
      } catch (gcsError) {
        console.error('GCS upload failed, falling back to local:', gcsError);
      }
    }

    // Fallback: save to public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
