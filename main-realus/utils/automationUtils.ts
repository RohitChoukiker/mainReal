import { TransactionStatus } from "@/models/transactionModel";
import { sendEmail } from "@/lib/email";
import TransactionModel from "@/models/transactionModel";
import DocumentModel from "@/models/document";
import mongoose from "mongoose";

// Email & Notification Automation
export async function sendTransactionStatusEmail(
  transactionId: string, 
  newStatus: TransactionStatus,
  recipientEmail: string,
  recipientName: string
) {
  // Define email templates based on transaction status
  const emailTemplates = {
    [TransactionStatus.New]: {
      subject: "New Transaction Created",
      template: "transaction-created",
    },
    [TransactionStatus.InProgress]: {
      subject: "Transaction In Progress",
      template: "transaction-in-progress",
    },
    [TransactionStatus.PendingDocuments]: {
      subject: "Documents Required for Your Transaction",
      template: "documents-required",
    },
    [TransactionStatus.UnderReview]: {
      subject: "Your Transaction is Under Review",
      template: "transaction-under-review",
    },
    [TransactionStatus.ReadyForClosure]: {
      subject: "Transaction Ready for Closure",
      template: "ready-for-closure",
    },
    [TransactionStatus.ForwardedToBroker]: {
      subject: "Transaction Forwarded to Broker",
      template: "forwarded-to-broker",
    },
    [TransactionStatus.Approved]: {
      subject: "Transaction Approved",
      template: "transaction-approved",
    },
    [TransactionStatus.ApprovedForClosure]: {
      subject: "Transaction Approved for Closure",
      template: "approved-for-closure",
    },
    [TransactionStatus.ClosureRejected]: {
      subject: "Closure Request Rejected",
      template: "closure-rejected",
    },
    [TransactionStatus.Closed]: {
      subject: "Transaction Closed Successfully",
      template: "transaction-closed",
    },
    [TransactionStatus.Cancelled]: {
      subject: "Transaction Cancelled",
      template: "transaction-cancelled",
    },
  };

  // Get email template based on status
  const template = emailTemplates[newStatus];
  if (!template) {
    console.error(`No email template found for status: ${newStatus}`);
    return false;
  }

  try {
    // Send email notification
    await sendEmail({
      to: recipientEmail,
      subject: template.subject,
      template: template.template,
      data: {
        recipientName,
        transactionId,
        status: newStatus,
        timestamp: new Date().toISOString(),
      },
    });
    
    console.log(`Status update email sent to ${recipientEmail} for transaction ${transactionId}`);
    return true;
  } catch (error) {
    console.error("Error sending status update email:", error);
    return false;
  }
}

// Document Validation Automation
export async function validateDocument(documentId: string) {
  try {
    // Find the document in the database
    const document = await DocumentModel.findOne({ documentId });
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    // In a real implementation, this would call an AI OCR service
    // For now, we'll simulate the AI validation with a random score
    const aiScore = Math.random() * 100;
    const issues: string[] = [];

    // Simulate document validation issues based on score
    if (aiScore < 70) {
      issues.push("Document quality is below acceptable standards");
    }
    
    if (aiScore < 80) {
      issues.push("Some required information may be missing");
    }

    if (aiScore < 60) {
      issues.push("Document may not be properly signed");
    }

    // Update document with AI verification results
    document.aiVerified = true;
    document.aiScore = aiScore;
    document.issues = issues;
    document.status = issues.length > 0 ? "needs_attention" : "verified";
    
    await document.save();
    
    // If there are issues, notify the agent
    if (issues.length > 0) {
      // In a real implementation, this would send an email to the agent
      console.log(`Document ${documentId} has issues: ${issues.join(", ")}`);
    }
    
    return {
      documentId,
      aiVerified: true,
      aiScore,
      issues,
      status: document.status
    };
  } catch (error) {
    console.error("Error validating document:", error);
    throw error;
  }
}

// Auto-Reminder System
export async function sendReminderForPendingDocuments() {
  try {
    // Find transactions that are in PendingDocuments status for more than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const pendingTransactions = await TransactionModel.find({
      status: TransactionStatus.PendingDocuments,
      updatedAt: { $lt: threeDaysAgo }
    });
    
    console.log(`Found ${pendingTransactions.length} transactions pending documents for more than 3 days`);
    
    // Send reminders for each transaction
    for (const transaction of pendingTransactions) {
      await sendEmail({
        to: transaction.clientEmail,
        subject: "Reminder: Documents Required for Your Transaction",
        template: "document-reminder",
        data: {
          recipientName: transaction.clientName,
          transactionId: transaction.transactionId,
          daysOverdue: Math.floor((Date.now() - transaction.updatedAt.getTime()) / (1000 * 60 * 60 * 24)),
        },
      });
      
      console.log(`Reminder sent to ${transaction.clientEmail} for transaction ${transaction.transactionId}`);
    }
    
    return pendingTransactions.length;
  } catch (error) {
    console.error("Error sending reminders:", error);
    throw error;
  }
}

// Predictive Analytics for Delay Detection
export async function detectPotentialDelays() {
  try {
    const now = new Date();
    const potentialDelays = [];
    
    // Find transactions with closing dates approaching (within 14 days)
    const transactions = await TransactionModel.find({
      closingDate: { 
        $gt: now, 
        $lt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) 
      },
      status: { 
        $nin: [
          TransactionStatus.Closed, 
          TransactionStatus.Cancelled,
          TransactionStatus.ApprovedForClosure
        ] 
      }
    });
    
    for (const transaction of transactions) {
      // Calculate risk factors
      let riskScore = 0;
      const riskFactors = [];
      
      // Check if documents are missing
      const documents = await DocumentModel.find({ transactionId: transaction.transactionId });
      const requiredDocCount = 5; // Assuming 5 required documents per transaction
      
      if (documents.length < requiredDocCount) {
        riskScore += 30;
        riskFactors.push("Missing required documents");
      }
      
      // Check for documents with issues
      const documentsWithIssues = documents.filter(doc => doc.issues && doc.issues.length > 0);
      if (documentsWithIssues.length > 0) {
        riskScore += 20;
        riskFactors.push("Documents have quality issues");
      }
      
      // Check how close we are to closing date
      const daysToClosing = Math.floor((transaction.closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysToClosing < 7) {
        riskScore += 25;
        riskFactors.push("Closing date is less than 7 days away");
      }
      
      // Check transaction status - higher risk for early stages
      if (transaction.status === TransactionStatus.New || 
          transaction.status === TransactionStatus.InProgress) {
        riskScore += 25;
        riskFactors.push("Transaction still in early stages");
      }
      
      // If risk score is high, add to potential delays
      if (riskScore >= 50) {
        potentialDelays.push({
          transactionId: transaction.transactionId,
          clientName: transaction.clientName,
          closingDate: transaction.closingDate,
          riskScore,
          riskFactors,
          daysToClosing
        });
        
        // Send alert email to agent and TC
        await sendEmail({
          to: transaction.clientEmail, // In real implementation, would send to agent and TC
          subject: "⚠️ Potential Delay Risk Alert",
          template: "delay-risk-alert",
          data: {
            transactionId: transaction.transactionId,
            clientName: transaction.clientName,
            closingDate: transaction.closingDate,
            riskScore,
            riskFactors,
            daysToClosing
          },
        });
      }
    }
    
    return potentialDelays;
  } catch (error) {
    console.error("Error detecting potential delays:", error);
    throw error;
  }
}