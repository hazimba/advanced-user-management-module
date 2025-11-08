// import { formSchemaProduct } from "@/app/api/products/route";
import { supabase } from "@/lib/supabaseClient";
import imageCompression from "browser-image-compression";
// import { UseFormReturn } from "react-hook-form";

import { FieldValues, UseFormReturn } from "react-hook-form";

// export async function handleFileSelect<T extends FieldValues>(
//   files: FileList | null,
//   form: UseFormReturn<T>
// ): Promise<string | undefined> {

export async function handleFileSelect<T extends FieldValues>(
  entity: string,
  files: FileList | null,
  form: UseFormReturn<T>
): Promise<string | undefined> {
  if (!files) return;
  const file = files[0];

  try {
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);

    const fileName = `${Date.now()}-${compressedFile.name}`;
    const { data, error } = await supabase.storage
      .from("user-image")
      // images is the folder inside the bucket fewd2u (reference: supabase)
      .upload(`images/${entity}/${fileName}`, compressedFile);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("user-image")
      .getPublicUrl(`images/${entity}/${fileName}`);

    console.log("Public URL:", publicUrl);
    return publicUrl;

    console.log("File uploaded successfully:", data);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
