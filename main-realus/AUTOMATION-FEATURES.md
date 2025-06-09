# Automation Features

This document outlines the automation features implemented in the real estate transaction management system.

## 1. Email & Notification Automation

Automated email notifications are sent at various stages of the transaction lifecycle:

- **Transaction Creation**: When a new transaction is created
- **Status Updates**: When transaction status changes
- **Document Validation**: When documents are validated by AI
- **Reminders**: For pending documents and approaching deadlines

### Implementation Details:

- Enhanced email system using EmailJS in `lib/email.ts`
- Email templates for different notification types
- Automatic triggering of emails on transaction events

## 2. Document Validation Automation (AI OCR)

Documents uploaded to the system are automatically validated using AI OCR:

- **Automatic Validation**: Documents are validated immediately after upload
- **Quality Scoring**: Each document receives an AI quality score
- **Issue Detection**: The system identifies potential issues with documents
- **Notification**: Agents are notified of validation results

### Implementation Details:

- Document validation logic in `utils/automationUtils.ts`
- API endpoint at `/api/agent/documents/validate`
- Automatic triggering from document upload API

## 3. Auto-Reminder System

The system automatically sends reminders for pending actions:

- **Document Reminders**: For transactions with pending documents
- **Deadline Reminders**: For approaching closing dates
- **Action Reminders**: For required actions from agents or clients

### Implementation Details:

- Reminder logic in `utils/automationUtils.ts`
- API endpoint at `/api/automation/reminders`
- Scheduled via cron jobs in Vercel configuration

## 4. Predictive Analytics for Delay Detection

The system uses predictive analytics to identify transactions at risk of delay:

- **Risk Scoring**: Each transaction receives a risk score based on multiple factors
- **Early Warning**: Identifies potential delays before they occur
- **Notification**: Alerts agents and TCs about high-risk transactions

### Implementation Details:

- Predictive analytics logic in `utils/automationUtils.ts`
- API endpoint at `/api/automation/predictive-analytics`
- Scheduled via cron jobs in Vercel configuration

## Cron Job Configuration

Automation tasks are scheduled using Vercel Cron Jobs:

- Document reminders: Daily at 9 AM
- Predictive analytics: Daily at 6 AM

## Environment Variables

The following environment variables should be set:

- `EMAILJS_SERVICE_ID`: EmailJS service ID
- `EMAILJS_USER_ID`: EmailJS user ID
- `AUTOMATION_API_KEY`: API key for automation endpoints
- `NEXT_PUBLIC_API_URL`: Base URL for API endpoints

## Testing Automation Features

For development and testing:

1. **Document Validation**: Upload a document and check the validation results
2. **Email Notifications**: Create a transaction and verify email logs
3. **Reminders**: Use the GET endpoint at `/api/automation/reminders` to manually trigger reminders
4. **Predictive Analytics**: Use the GET endpoint at `/api/automation/predictive-analytics` to manually run analytics