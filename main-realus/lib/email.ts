interface EmailData {
  to: string | string[];
  subject: string;
  template: string;
  data: Record<string, any>;
}

export async function sendEmail(emailData: EmailData) {
  try {
    // TODO: Implement actual email sending logic
    // For now, just log the email data
    console.log('Sending email:', {
      to: emailData.to,
      subject: emailData.subject,
      template: emailData.template,
      data: emailData.data
    });
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 