'use server'

import * as fal from "@fal-ai/serverless-client";

export async function removeBackground(imageUrl: string) {
  try {
    const result = await fal.subscribe("fal-ai/birefnet", {
      input: {
        image_url: imageUrl,
        model: "General Use (Light)",
        operating_resolution: "1024x1024",
        output_format: "png"
      },
    });

    return result.image.url;
  } catch (error) {
    console.error("Error removing background:", error);
    throw new Error("Failed to remove background");
  }
}