import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204 
    });
  }

  try {
    console.log('[process-file] Request received:', req.method);
    
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('[process-file] No file uploaded or invalid file');
      throw new Error('No file uploaded');
    }

    console.log('[process-file] Processing file:', file.name, 'Type:', file.type);

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    console.log('[process-file] File converted to base64, configuring Gemini...');

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('[process-file] Gemini API key not configured');
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    console.log('[process-file] Sending request to Gemini...');

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      },
      "Extract and return all text content from this document without any analysis or summary. Just return the raw text content."
    ]);

    console.log('[process-file] Received response from Gemini');

    const response = await result.response;
    const text = response.text();

    console.log('[process-file] Successfully extracted text:', text.substring(0, 100) + '...');

    return new Response(
      JSON.stringify({ text }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error('[process-file] Error:', error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process file',
        details: error.stack
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    );
  }
});