'use server';

import { Resend } from 'resend';

// Initialize Resend with env key
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper for HTML email templates
const EmailTemplate = ({ title, data }: { title: string; data: Record<string, string> }) => (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
        <h2 style={{ color: '#059669' }}> {title} </h2>
        < div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            {
                Object.entries(data).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '10px' }} >
                        <strong style={{ textTransform: 'uppercase', fontSize: '12px', color: '#6b7280' }}> {key} </strong>
                        < div style={{ fontSize: '16px', marginTop: '2px' }}> {value} </div>
                    </div>
                ))}
        </div>
        < p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
            Sent from Intellihealth Platform
        </p>
    </div>
);

/**
 * Handle Expert Modal Leads
 */
export async function submitLead(formData: FormData, context: { planName: string; persona: string }) {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    if (!name || !phone) {
        return { success: false, error: 'Missing fields' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Intellihealth <onboarding@resend.dev>', // Update this if you have a verified domain
            to: ['mankwemokgabudi@gmail.com'], // Updated for testing compliance // The user's support email
            subject: `New Lead: ${name}`,
            react: EmailTemplate({
                title: 'New Coverage Verification Request',
                data: {
                    Name: name,
                    Phone: phone,
                    'Interested Plan': context.planName,
                    'User Persona': context.persona,
                    'Submitted At': new Date().toLocaleString()
                }
            })
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (e) {
        console.error('Server Action Error:', e);
        return { success: false, error: 'Internal Server Error' };
    }
}

/**
 * Handle Contact Support Inquiries
 */
export async function submitContact(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { success: false, error: 'Missing fields' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Intellihealth Support <onboarding@resend.dev>',
            to: ['mankwemokgabudi@gmail.com'], // Updated for testing compliance
            replyTo: email, // Direct reply to user
            subject: `[Support] ${subject} - ${name}`,
            react: EmailTemplate({
                title: 'New Support Inquiry',
                data: {
                    Name: name,
                    Email: email,
                    Subject: subject,
                    Message: message,
                    'Submitted At': new Date().toLocaleString()
                }
            })
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (e) {
        console.error('Server Action Error:', e);
        return { success: false, error: 'Internal Server Error' };
    }
}