import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow responses to stream for up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    console.log('--- API/CHAT/ROUTE POST RECEIVED ---');
    try {
        const json = await req.json();
        const { messages, contextPlan } = json;

        if (!process.env.OPENAI_API_KEY) {
            console.error('CRITICAL: OPENAI_API_KEY is missing!');
            return new Response('Missing API Key', { status: 500 });
        }

        // 2. DATA DISTILLATION
        const financialData = {
            plan_name: contextPlan?.identity?.plan_name || 'Unknown Plan',
            price: contextPlan?.price,
            savings_account: contextPlan?.savings_annual,
            network_rule: contextPlan?.network_restriction,
            benefits: contextPlan?.defined_baskets,
            co_payments: contextPlan?.procedure_copays,
            critical_warning: contextPlan?.red_flag,
        };

        // 3. PROMPT ENGINEERING
        const systemPrompt = `
    You are the **Intellihealth Senior Analyst**, an expert in South African medical schemes.
    Your goal is to explain the specific plan data provided below to the user.

    ### SOURCE OF TRUTH (JSON DATA):
    ${JSON.stringify(financialData, null, 2)}

    ### CRITICAL RULES:
    1.  **Strict Data Sovereignty:** ONLY answer based on the JSON data above.
    2.  **The "Red Flag" Pivot:** If asked if the plan is "good", mention the 'critical_warning'.
    3.  **Currency Formatting:** Always format money as **R**, e.g., **R1,200**.
    4.  **Tone:** Professional, objective, and concise.

    ### SALES BEHAVIOR:
    - **No Financial Advice:** Never say "You should buy this."
    - **Handling Unknowns:** If asked about specific doctors/waiting periods, offer to connect them to a human.
    - **Triggering the Lead:** Append **[TRIGGER_LEAD_FORM]** if intent is high.
    `;

        // 1. RATE LIMIT CHECK
        const assistantReplies = messages.filter((m: any) => m.role === 'assistant').length;
        if (assistantReplies >= 3) {
            return streamText({
                model: openai('gpt-4o-mini'),
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.map((m: any) => {
                        // Ensure content is ALWAYS a string
                        let content = '';

                        if (typeof m.content === 'string') {
                            content = m.content;
                        } else if (m.parts && Array.isArray(m.parts)) {
                            // Handle parts if they exist
                            content = m.parts
                                .filter((p: any) => p.type === 'text')
                                .map((p: any) => p.text)
                                .join('');
                        }

                        return {
                            role: m.role,
                            content: content || ' ' // Fallback to space to prevent empty string errors
                        };
                    })
                ]
            }).toTextStreamResponse();
        }

        // 4. GENERATE STREAM
        // FIX: Use manual sanitization instead of deprecated helpers
        const coreMessages = sanitizeMessages(messages);

        // Add system prompt to the front
        coreMessages.unshift({ role: 'system', content: systemPrompt });

        const result = streamText({
            model: openai('gpt-4o-mini'),
            messages: coreMessages,
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error('API ROUTE ERROR:', error);
        return new Response(JSON.stringify({
            error: 'Internal Server Error',
            message: error.message,
            stack: error.stack
        }), { status: 500 });
    }
}

/**
 * STRICT SANITIZER
 * Converts complex UI messages (with 'parts') into simple Core messages for the LLM.
 * This prevents crashes when the SDK encounters undefined content.
 */
function sanitizeMessages(messages: any[]): any[] {
    return messages.map((m) => {
        let content = '';

        // Case A: content is already a string
        if (typeof m.content === 'string') {
            content = m.content;
        }
        // Case B: content is an array (older SDKs)
        else if (Array.isArray(m.content)) {
            content = m.content
                .filter((p: any) => p?.type === 'text')
                .map((p: any) => p?.text || '')
                .join('');
        }
        // Case C: New "parts" structure (SDK v5+)
        else if (m.parts && Array.isArray(m.parts)) {
            content = m.parts
                .filter((p: any) => p?.type === 'text')
                .map((p: any) => p?.text || '')
                .join('');
        }

        return {
            role: m.role === 'data' ? 'user' : m.role, // Map 'data' roles to user if necessary
            content: content || '' // Ensure strictly string, never null/undefined
        };
    });
}