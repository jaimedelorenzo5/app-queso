import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request body
    const { storagePath, bucket = 'cheese-photos' } = await req.json()

    if (!storagePath) {
      throw new Error('storagePath is required')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Download original image
    const { data: originalImage, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(storagePath)

    if (downloadError) {
      throw new Error(`Failed to download image: ${downloadError.message}`)
    }

    // Convert to array buffer
    const imageBuffer = await originalImage.arrayBuffer()

    // Create image from buffer
    const image = await createImageBitmap(new Blob([imageBuffer]))

    // Generate thumbnails
    const thumbnails = await generateThumbnails(image, storagePath)

    // Upload thumbnails
    const uploadPromises = thumbnails.map(async (thumbnail) => {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(thumbnail.path, thumbnail.blob, {
          contentType: 'image/webp',
          cacheControl: '31536000', // 1 year
          upsert: true,
        })

      if (error) {
        console.error(`Failed to upload ${thumbnail.path}:`, error)
        return { success: false, path: thumbnail.path, error }
      }

      return { success: true, path: thumbnail.path }
    })

    const results = await Promise.all(uploadPromises)

    return new Response(
      JSON.stringify({
        success: true,
        original: storagePath,
        thumbnails: results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function generateThumbnails(image: ImageBitmap, originalPath: string) {
  const pathWithoutExt = originalPath.replace(/\.[^/.]+$/, '')
  
  // Define thumbnail sizes
  const sizes = [
    { name: 'sm', width: 200, height: 200 },
    { name: 'lg', width: 800, height: 800 },
  ]

  const thumbnails = []

  for (const size of sizes) {
    const canvas = new OffscreenCanvas(size.width, size.height)
    const ctx = canvas.getContext('2d')!

    // Calculate aspect ratio
    const imageAspect = image.width / image.height
    const canvasAspect = size.width / size.height

    let drawWidth, drawHeight, offsetX, offsetY

    if (imageAspect > canvasAspect) {
      // Image is wider than canvas
      drawHeight = size.height
      drawWidth = size.height * imageAspect
      offsetX = (size.width - drawWidth) / 2
      offsetY = 0
    } else {
      // Image is taller than canvas
      drawWidth = size.width
      drawHeight = size.width / imageAspect
      offsetX = 0
      offsetY = (size.height - drawHeight) / 2
    }

    // Fill background with white
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, size.width, size.height)

    // Draw image centered
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)

    // Convert to WebP blob
    const blob = await canvas.convertToBlob({
      type: 'image/webp',
      quality: 0.8,
    })

    thumbnails.push({
      path: `${pathWithoutExt}-${size.name}.webp`,
      blob,
      width: size.width,
      height: size.height,
    })
  }

  return thumbnails
}
