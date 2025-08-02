export interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  from?: string;
  replyTo?: string;
}

export interface EmailProvider {
  name: string;
  sendEmail: (options: EmailOptions) => Promise<boolean>;
}

// Console Email Provider (for development/demo)
class ConsoleEmailProvider implements EmailProvider {
  name = 'console';

  async sendEmail(options: EmailOptions): Promise<boolean> {
    console.log('📧 EMAIL SENT (Console Provider):');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('From:', options.from || 'noreply@boattrip-planner.com');
    console.log('HTML Content:', options.htmlContent.substring(0, 200) + '...');
    console.log('Text Content:', options.textContent.substring(0, 200) + '...');
    console.log('---');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  }
}

// SendGrid Email Provider (example implementation)
class SendGridEmailProvider implements EmailProvider {
  name = 'sendgrid';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // This is a placeholder implementation
      // In a real app, you would use the SendGrid SDK
      console.log('📧 EMAIL SENT (SendGrid Provider):', options.to);
      
      // Example SendGrid implementation:
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(this.apiKey);
      // await sgMail.send({
      //   to: options.to,
      //   from: options.from || 'noreply@boattrip-planner.com',
      //   subject: options.subject,
      //   text: options.textContent,
      //   html: options.htmlContent,
      // });
      
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }
}

// Resend Email Provider (example implementation)
class ResendEmailProvider implements EmailProvider {
  name = 'resend';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // This is a placeholder implementation
      // In a real app, you would use the Resend SDK
      console.log('📧 EMAIL SENT (Resend Provider):', options.to);
      
      // Example Resend implementation:
      // const { Resend } = require('resend');
      // const resend = new Resend(this.apiKey);
      // await resend.emails.send({
      //   from: options.from || 'noreply@boattrip-planner.com',
      //   to: options.to,
      //   subject: options.subject,
      //   html: options.htmlContent,
      //   text: options.textContent,
      // });
      
      return true;
    } catch (error) {
      console.error('Resend email error:', error);
      return false;
    }
  }
}

// Email Service Class
class EmailService {
  private provider: EmailProvider;

  constructor(provider: EmailProvider) {
    this.provider = provider;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const success = await this.provider.sendEmail(options);
      
      if (success) {
        console.log(`✅ Email sent successfully to ${options.to} using ${this.provider.name}`);
      } else {
        console.error(`❌ Failed to send email to ${options.to} using ${this.provider.name}`);
      }
      
      return success;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  setProvider(provider: EmailProvider) {
    this.provider = provider;
  }

  getProviderName(): string {
    return this.provider.name;
  }
}

// Create default email service with console provider
const defaultProvider = new ConsoleEmailProvider();
export const emailService = new EmailService(defaultProvider);

// Export providers for easy switching
export const emailProviders = {
  console: defaultProvider,
  sendgrid: (apiKey: string) => new SendGridEmailProvider(apiKey),
  resend: (apiKey: string) => new ResendEmailProvider(apiKey),
};

// Helper function to switch email providers
export const switchEmailProvider = (providerName: string, apiKey?: string) => {
  switch (providerName) {
    case 'sendgrid':
      if (!apiKey) throw new Error('SendGrid API key required');
      emailService.setProvider(emailProviders.sendgrid(apiKey));
      break;
    case 'resend':
      if (!apiKey) throw new Error('Resend API key required');
      emailService.setProvider(emailProviders.resend(apiKey));
      break;
    case 'console':
    default:
      emailService.setProvider(emailProviders.console);
      break;
  }
  
  console.log(`📧 Switched to ${providerName} email provider`);
}; 