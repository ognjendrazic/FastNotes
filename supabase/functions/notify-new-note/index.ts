import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const payload = await req.json()
  const { record } = payload // the newly inserted note

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get all push tokens EXCEPT the user who created the note
  const { data: tokens, error } = await supabase
    .from('push_tokens')
    .select('token')
    //.neq('user_id', record.user_id)

  if (error || !tokens || tokens.length === 0) {
    return new Response(JSON.stringify({ message: 'No tokens to notify' }), { status: 200 })
  }

  // Send push notification to all other users
  const messages = tokens.map((t) => ({
    to: t.token,
    sound: 'default',
    title: 'New Note',
    body: `New Note: ${record.title}`,
    data: { noteId: record.id },
  }))

  const pushResponse = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  })

  const pushResult = await pushResponse.json()
  return new Response(JSON.stringify(pushResult), { status: 200 })
})