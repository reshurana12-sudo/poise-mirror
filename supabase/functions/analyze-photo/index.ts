import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");

    // Verify user
    const supabaseUser = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const { photoPath } = await req.json();
    if (!photoPath) throw new Error("photoPath is required");

    // Get a signed URL for the photo so AI can see it
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from("scan-photos")
      .createSignedUrl(photoPath, 300);
    if (signedError || !signedData?.signedUrl) throw new Error("Failed to get signed URL");

    // Call Lovable AI with the photo
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an AI appearance analyst for the LooksLens app. Analyze the provided photo and rate the person on these dimensions. Be encouraging and constructive — never harsh or critical. Frame weaknesses as "opportunities for improvement."

You MUST call the analyze_appearance function with your analysis.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this photo and provide scores and insights for my appearance.",
              },
              {
                type: "image_url",
                image_url: { url: signedData.signedUrl },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_appearance",
              description: "Return structured appearance analysis scores and insights",
              parameters: {
                type: "object",
                properties: {
                  overall_score: { type: "integer", description: "Overall presence score 0-100" },
                  symmetry_score: { type: "integer", description: "Facial symmetry score 0-100" },
                  jawline_score: { type: "integer", description: "Jawline definition score 0-100" },
                  eye_balance_score: { type: "integer", description: "Eye balance and positioning score 0-100" },
                  posture_score: { type: "integer", description: "Posture alignment score 0-100" },
                  grooming_score: { type: "integer", description: "Grooming and presentation score 0-100" },
                  summary: { type: "string", description: "2-3 sentence encouraging summary of the person's presence, written like a personal coach" },
                  coach_tip: { type: "string", description: "1-2 sentence actionable tip focusing on the biggest improvement opportunity" },
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        category: { type: "string", enum: ["Posture", "Grooming", "Presentation", "Camera Presence"] },
                        title: { type: "string", description: "Short actionable title" },
                        description: { type: "string", description: "2-3 sentence detailed recommendation" },
                        impact: { type: "string", enum: ["high", "medium"] },
                      },
                      required: ["category", "title", "description", "impact"],
                    },
                    description: "5-8 personalized improvement suggestions",
                  },
                },
                required: [
                  "overall_score", "symmetry_score", "jawline_score",
                  "eye_balance_score", "posture_score", "grooming_score",
                  "summary", "coach_tip", "suggestions",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_appearance" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", status, errText);
      throw new Error(`AI analysis failed: ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI did not return structured analysis");

    const analysis = JSON.parse(toolCall.function.arguments);

    // Store the scan result
    const { data: scan, error: insertError } = await supabaseAdmin
      .from("scans")
      .insert({
        user_id: user.id,
        photo_url: photoPath,
        overall_score: analysis.overall_score,
        symmetry_score: analysis.symmetry_score,
        jawline_score: analysis.jawline_score,
        eye_balance_score: analysis.eye_balance_score,
        posture_score: analysis.posture_score,
        grooming_score: analysis.grooming_score,
        ai_summary: analysis.summary,
        ai_coach_tip: analysis.coach_tip,
        suggestions: analysis.suggestions,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save scan results");
    }

    return new Response(JSON.stringify(scan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-photo error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
