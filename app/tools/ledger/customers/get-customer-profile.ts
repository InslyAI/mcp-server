/**
 * Get Customer Profile Tool
 * Retrieves comprehensive profile information for a customer
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createLedgerClient } from "../client";

export function registerGetCustomerProfileTool(server: McpServer) {
  server.tool(
    "ledger_customers_profile_get",
    "Retrieve comprehensive profile details for a customer including personal details, preferences, and account settings",
    {
      bearerToken: z.string().min(1).describe("JWT bearer token from identifier_login"),
      tenantId: z.string().describe("Tenant ID for X-Tenant-ID header"),
      customerId: z.string().min(1).describe("ID of the customer to get profile for"),
    },
    async ({ bearerToken, tenantId, customerId }) => {
      try {
        const client = createLedgerClient(bearerToken, tenantId);
        
        const response = await client.get(`/api/v1/ledger/customers/${customerId}/profile`);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: true,
                customerId: customerId,
                profile: {
                  personalInfo: {
                    firstName: response.firstName,
                    lastName: response.lastName,
                    fullName: response.fullName,
                    dateOfBirth: response.dateOfBirth,
                    gender: response.gender,
                    maritalStatus: response.maritalStatus,
                    occupation: response.occupation,
                    employer: response.employer,
                    annualIncome: response.annualIncome
                  },
                  contactInfo: {
                    email: response.email,
                    phone: response.phone,
                    mobilePhone: response.mobilePhone,
                    preferredContactMethod: response.preferredContactMethod,
                    bestTimeToContact: response.bestTimeToContact
                  },
                  address: {
                    street: response.address,
                    city: response.city,
                    state: response.state,
                    zipCode: response.zipCode,
                    country: response.country,
                    mailingAddress: response.mailingAddress
                  },
                  businessInfo: {
                    companyName: response.companyName,
                    businessType: response.businessType,
                    industry: response.industry,
                    yearsInBusiness: response.yearsInBusiness,
                    numberOfEmployees: response.numberOfEmployees,
                    annualRevenue: response.annualRevenue
                  },
                  preferences: {
                    languagePreference: response.languagePreference,
                    communicationPreferences: response.communicationPreferences,
                    marketingConsent: response.marketingConsent,
                    paperlessStatements: response.paperlessStatements,
                    autoPayEnabled: response.autoPayEnabled
                  },
                  riskInfo: {
                    riskProfile: response.riskProfile,
                    creditScore: response.creditScore,
                    claimsHistory: response.claimsHistory,
                    loyaltyScore: response.loyaltyScore,
                    segmentCategory: response.segmentCategory
                  },
                  accountInfo: {
                    customerSince: response.customerSince,
                    status: response.status,
                    tier: response.tier,
                    referralSource: response.referralSource,
                    assignedAgent: response.assignedAgent,
                    lastContactDate: response.lastContactDate,
                    nextFollowUpDate: response.nextFollowUpDate
                  }
                }
              }, null, 2)
            }
          ]
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                success: false,
                error: "Failed to retrieve customer profile",
                details: error.message,
                statusCode: error.status
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}