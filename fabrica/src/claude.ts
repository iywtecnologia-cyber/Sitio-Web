// Llamadas a Claude (API de Anthropic) con salida estructurada: se le da UNA herramienta y se
// le exige usarla, así la respuesta siempre viene como JSON con la forma pedida.

export interface Herramienta {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface MensajeClaude {
  role: 'user' | 'assistant';
  content: string;
}

export interface EnvClaude {
  ANTHROPIC_API_KEY: string;
  MODELO: string;
}

export async function usarHerramienta<T>(
  env: EnvClaude,
  sistema: string,
  mensajes: MensajeClaude[],
  herramienta: Herramienta,
  maxTokens = 2000,
): Promise<T> {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: env.MODELO,
      max_tokens: maxTokens,
      // El sistema es igual en cada llamada: se cachea para pagar menos y responder más rápido.
      system: [{ type: 'text', text: sistema, cache_control: { type: 'ephemeral' } }],
      messages: mensajes,
      tools: [herramienta],
      tool_choice: { type: 'tool', name: herramienta.name },
    }),
  });
  if (!r.ok) throw new Error(`Claude respondió ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const datos = (await r.json()) as { content: { type: string; name?: string; input?: unknown }[] };
  const uso = datos.content.find((c) => c.type === 'tool_use' && c.name === herramienta.name);
  if (!uso) throw new Error('Claude no devolvió la respuesta estructurada.');
  return uso.input as T;
}
