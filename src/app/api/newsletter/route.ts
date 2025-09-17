import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import dbConnect from '@/lib/mongodb'
import mongoose from 'mongoose'
import { rateLimit, rateLimits } from '@/lib/rateLimit'
import { validateEmail } from '@/lib/security'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

// Newsletter subscriber schema
const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
})

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema)

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(rateLimits.newsletter)(request)
    if (rateLimitResult) return rateLimitResult

    const { email } = await request.json()

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email })
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Email is already subscribed to our newsletter' },
          { status: 400 }
        )
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true
        existingSubscriber.subscribedAt = new Date()
        await existingSubscriber.save()
      }
    } else {
      // Create new subscriber
      const subscriber = new Subscriber({ email })
      await subscriber.save()
    }

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // Verify transporter configuration
    try {
      await transporter.verify()
      console.log('SMTP connection verified successfully')
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError)
      throw new Error('Email service configuration error')
    }

    const welcomeEmail = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Welcome to TechBlog Newsletter! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; border-radius: 12px; overflow: hidden;">
          <div style="background: rgba(255,255,255,0.1); padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              🚀 Welcome to TechBlog!
            </h1>
            <p style="color: #f0f0f0; font-size: 18px; margin: 0; line-height: 1.6;">
              Thank you for subscribing to our newsletter!
            </p>
          </div>
          
          <div style="background: #ffffff; padding: 40px;">
            <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">What to Expect:</h2>
            
            <div style="margin: 20px 0;">
              <div style="display: flex; align-items: center; margin: 15px 0;">
                <span style="font-size: 24px; margin-right: 15px;">📰</span>
                <div>
                  <h3 style="color: #667eea; margin: 0; font-size: 16px;">Weekly Tech Insights</h3>
                  <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Latest trends, tutorials, and industry news</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; margin: 15px 0;">
                <span style="font-size: 24px; margin-right: 15px;">🔥</span>
                <div>
                  <h3 style="color: #667eea; margin: 0; font-size: 16px;">Exclusive Content</h3>
                  <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Subscriber-only articles and early access</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; margin: 15px 0;">
                <span style="font-size: 24px; margin-right: 15px;">💡</span>
                <div>
                  <h3 style="color: #667eea; margin: 0; font-size: 16px;">Tech Tips & Tricks</h3>
                  <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Practical advice for developers and tech enthusiasts</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                Visit TechBlog
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                You're receiving this because you subscribed to TechBlog newsletter.<br>
                Don't want these emails? <a href="#" style="color: #667eea;">Unsubscribe</a>
              </p>
            </div>
          </div>
        </div>
      `,
    }

    // Notification email to you
    const notificationEmail = {
      from: process.env.GMAIL_USER,
      to: 'techtrendinnovation0@gmail.com',
      subject: 'New Newsletter Subscriber! 📧',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">🎉 New Newsletter Subscriber!</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subscribed:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(welcomeEmail)
    await transporter.sendMail(notificationEmail)

    return NextResponse.json({
      message: 'Successfully subscribed to newsletter! Check your email for confirmation.',
    })
  } catch (error: any) {
    console.error('Newsletter subscription error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email is already subscribed to our newsletter' },
        { status: 400 }
      )
    }
    
    if (error.message === 'Email service configuration error') {
      return NextResponse.json(
        { error: 'Email service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}
