import emailjs from 'emailjs-com';

interface EmailData {
  to: string | string[];
  subject: string;
  template: string;
  data: Record<string, any>;
}

// Email templates mapping
const EMAIL_TEMPLATES: Record<string, string> = {
  'transaction-created': 'template_transaction_created',
  'transaction-in-progress': 'template_transaction_progress',
  'documents-required': 'template_documents_required',
  'transaction-under-review': 'template_transaction_review',
  'ready-for-closure': 'template_ready_closure',
  'forwarded-to-broker': 'template_forwarded_broker',
  'transaction-approved': 'template_transaction_approved',
  'approved-for-closure': 'template_approved_closure',
  'closure-rejected': 'template_closure_rejected',
  'transaction-closed': 'template_transaction_closed',
  'transaction-cancelled': 'template_transaction_cancelled',
  'document-reminder': 'template_document_reminder',
  'delay-risk-alert': 'template_delay_risk_alert',
  'document-validation-results': 'template_document_validation',
};

export async function sendEmail(emailData: EmailData) {
  try {
    // Get environment variables
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const userId = process.env.EMAILJS_USER_ID;
    
    // Check if EmailJS is configured
    if (!serviceId || !userId) {
      console.log('EmailJS not configured. Logging email instead:', {
        to: emailData.to,
        subject: emailData.subject,
        template: emailData.template,
        data: emailData.data
      });
      return true;
    }
    
    // Get template ID from mapping
    const templateId = EMAIL_TEMPLATES[emailData.template];
    if (!templateId) {
      console.error(`No template ID found for template: ${emailData.template}`);
      return false;
    }
    
    // Format recipients if it's an array
    const recipients = Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to;
    
    // Prepare template parameters
    const templateParams = {
      to_email: recipients,
      to_name: emailData.data.recipientName || 'Valued Client',
      subject: emailData.subject,
      ...emailData.data
    };
    
    // Send email using EmailJS
    await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      userId
    );
    
    console.log(`Email sent successfully to ${recipients}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Function to send batch emails (for reminders and notifications)
export async function sendBatchEmails(emailsData: EmailData[]) {
  const results = [];
  
  for (const emailData of emailsData) {
    try {
      const result = await sendEmail(emailData);
      results.push({ 
        success: true, 
        to: emailData.to, 
        subject: emailData.subject 
      });
    } catch (error) {
      console.error(`Failed to send email to ${emailData.to}:`, error);
      results.push({ 
        success: false, 
        to: emailData.to, 
        subject: emailData.subject,
        error: String(error)
      });
    }
  }
  
  return results;
}