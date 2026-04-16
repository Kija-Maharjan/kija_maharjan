import { supabase } from '../../lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

  // Save to database
  const { error: dbError } = await supabase.from('messages').insert([{ name, email, subject, message }])
  if (dbError) return res.status(500).json({ error: dbError.message })

  // Send email
  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'maharjankija@gmail.com',
        subject: `Portfolio: ${subject || 'New Message'} from ${name}`,
        html: `
          <h2>New Message from Portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      })
    } catch (emailError) {
      console.error('Email send failed:', emailError)
    }
  }

  return res.status(200).json({ success: true })
}
