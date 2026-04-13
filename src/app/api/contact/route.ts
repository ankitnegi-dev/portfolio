import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'cs24i1007@iiitdm.ac.in',
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      html: `
        <div style="font-family: monospace; background: #05050a; color: #ffffff; padding: 32px; border-radius: 8px;">
          <h2 style="color: #00ffff; margin: 0 0 24px;">New message from your portfolio</h2>
          <p style="margin: 0 0 8px; color: rgba(255,255,255,0.5); font-size: 12px; letter-spacing: 0.1em;">FROM</p>
          <p style="margin: 0 0 24px; font-size: 16px;">${name} &lt;${email}&gt;</p>
          <p style="margin: 0 0 8px; color: rgba(255,255,255,0.5); font-size: 12px; letter-spacing: 0.1em;">MESSAGE</p>
          <p style="margin: 0; font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.85);">${message.replace(/\n/g, '<br/>')}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
