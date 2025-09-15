import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload PDF, DOC, DOCX, or image files.",
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File too large. Maximum size is 10MB.",
        },
        { status: 400 }
      );
    }

    // Create folder structure
    const folderPath = folder ? `${folder}/` : "";
    const fileName = `${folderPath}${Date.now()}-${file.name}`;

    // Upload to Vercel Blob with folder structure
    const blob = await put(fileName, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      fileName: file.name,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Delete from Vercel Blob
    await del(url);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete file. Please try again.",
      },
      { status: 500 }
    );
  }
}
