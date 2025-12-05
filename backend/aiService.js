/**
 * Service for generating initiative analysis using rule-based logic
 * No external API dependencies required
 */
class AIService {
  constructor() {
    // No API key needed anymore
  }

  /**
   * Analyze HR initiative idea using rule-based logic
   */
  async generateAnalysis(idea) {
    const { 
      title = '',
      ideaDescription = '', 
      businessObjective = '', 
      businessValue, 
      monetaryValue,
      principalFeatures = '',
      personsAffected = '',
      businessAreasAffected = '',
      platformClientsImpacted = []
    } = idea;

    // Calculate business value score based on provided information
    let calculatedScore;
    let userProvidedScore = false;
    
    if (businessValue !== null && businessValue !== undefined) {
      // User provided a score, use it
      calculatedScore = Math.min(10, Math.max(1, Math.round(businessValue)));
      userProvidedScore = true;
    } else {
      // Calculate score based on rules
      calculatedScore = this.calculateBusinessValueScore(idea);
    }

    // Determine if it's cost-saving or value-generating
    const costSaving = this.isCostSaving(ideaDescription, businessObjective);

    // Generate justification based on the score and provided data
    const businessValueJustification = this.generateJustification(
      calculatedScore, 
      monetaryValue, 
      businessObjective,
      userProvidedScore
    );

    // Generate Statement of Work
    const statementOfWork = this.generateStatementOfWork(idea, calculatedScore);

    return {
      statementOfWork,
      businessValueScore: calculatedScore,
      businessValueJustification,
      costSaving,
      userProvidedScore
    };
  }

  /**
   * Calculate business value score based on Business Value Scale rules
   */
  calculateBusinessValueScore(idea) {
    const { monetaryValue, businessObjective, ideaDescription } = idea;
    
    // Rule 1: Critical (10-9) - Legal or Compliance
    if (this.isLegalOrCompliance(businessObjective, ideaDescription)) {
      return 10;
    }

    // Rule 2: Significant Value (8-7) - Value > £1m OR significant value to Next NOW / Reduces Urgent Tech Debt
    if (monetaryValue && monetaryValue >= 1000) {
      return 8;
    }
    if (this.hasSignificantValue(ideaDescription, businessObjective)) {
      return 7;
    }

    // Rule 3: High Value (6-5) - Value > £500k
    if (monetaryValue && monetaryValue >= 500) {
      return 6;
    }

    // Rule 4: Medium Value (4-3) - Value > £250k
    if (monetaryValue && monetaryValue >= 250) {
      return 4;
    }

    // Rule 5: Low Value (2-1) - Value < £250k
    if (monetaryValue && monetaryValue < 250) {
      return 2;
    }

    // Default: Medium value if no monetary value provided
    return 5;
  }

  /**
   * Check if initiative is legal or compliance related
   */
  isLegalOrCompliance(businessObjective, description) {
    const legalKeywords = [
      'legal', 'compliance', 'regulatory', 'gdpr', 'audit', 'law', 
      'regulation', 'policy', 'mandatory', 'required by law', 'statutory'
    ];
    
    const lowerDesc = description.toLowerCase();
    const lowerObj = businessObjective.toLowerCase();
    
    return legalKeywords.some(keyword => 
      lowerDesc.includes(keyword) || lowerObj.includes(keyword)
    ) || businessObjective === 'Audit & Compliance';
  }

  /**
   * Check if initiative has significant value or reduces tech debt
   */
  hasSignificantValue(description, businessObjective) {
    const significantKeywords = [
      'urgent', 'critical', 'tech debt', 'technical debt', 'platform',
      'scalability', 'performance', 'security', 'infrastructure'
    ];
    
    const lowerDesc = description.toLowerCase();
    
    return significantKeywords.some(keyword => lowerDesc.includes(keyword));
  }

  /**
   * Determine if initiative is primarily cost-saving
   */
  isCostSaving(description, businessObjective) {
    const costSavingKeywords = [
      'cost saving', 'reduce cost', 'save money', 'efficiency', 
      'automate', 'automation', 'streamline', 'eliminate manual',
      'reduce time', 'optimize', 'cost reduction'
    ];
    
    const lowerDesc = description.toLowerCase();
    
    return costSavingKeywords.some(keyword => lowerDesc.includes(keyword)) ||
           businessObjective === 'Profitability';
  }

  /**
   * Generate business value justification
   */
  generateJustification(score, monetaryValue, businessObjective, userProvided) {
    if (userProvided) {
      return `Business value score of ${score}/10 was provided by the user based on their assessment of the initiative's impact.`;
    }

    if (score >= 9) {
      return `Critical initiative (Score ${score}/10): This is a legal or compliance-related requirement. Must be completed to avoid business disruption, regulatory penalties, or reputational damage.`;
    } else if (score >= 7) {
      if (monetaryValue >= 1000) {
        return `Significant value initiative (Score ${score}/10): Estimated monetary value exceeds £1m (£${monetaryValue}K), representing substantial financial impact to the organization.`;
      }
      return `Significant value initiative (Score ${score}/10): Offers considerable value to current operations or addresses urgent technical requirements.`;
    } else if (score >= 5) {
      if (monetaryValue >= 500) {
        return `High value initiative (Score ${score}/10): Estimated value of £${monetaryValue}K represents significant benefit that will bring measurable value to the organization.`;
      }
      return `High value initiative (Score ${score}/10): Delivers meaningful improvements and value to business operations.`;
    } else if (score >= 3) {
      if (monetaryValue >= 250) {
        return `Medium value initiative (Score ${score}/10): Estimated value of £${monetaryValue}K provides notable benefit, though impact may take time to realize fully.`;
      }
      return `Medium value initiative (Score ${score}/10): Provides good value that contributes to business objectives, though benefits may not be immediately realized.`;
    } else {
      if (monetaryValue) {
        return `Low value initiative (Score ${score}/10): Estimated value of £${monetaryValue}K represents minor functional improvements with useful but limited impact.`;
      }
      return `Low value initiative (Score ${score}/10): Provides functional improvements with useful but limited business impact.`;
    }
  }

  /**
   * Generate Statement of Work
   */
  generateStatementOfWork(idea, score) {
    const { 
      title, 
      ideaDescription, 
      businessObjective, 
      principalFeatures,
      personsAffected,
      businessAreasAffected,
      platformClientsImpacted,
      monetaryValue
    } = idea;

    let sow = `**Statement of Work: ${title}**\n\n`;
    
    sow += `**Objective:** ${ideaDescription}\n\n`;
    
    sow += `**Business Alignment:** This initiative supports the ${businessObjective} business objective`;
    if (score >= 9) {
      sow += ` and is classified as critical for legal/compliance requirements`;
    } else if (score >= 7) {
      sow += ` with significant strategic value`;
    } else if (score >= 5) {
      sow += ` with high potential impact`;
    }
    sow += `.\n\n`;

    if (monetaryValue) {
      sow += `**Estimated Value:** £${monetaryValue}K\n\n`;
    }

    if (principalFeatures && principalFeatures.trim()) {
      sow += `**Key Features & Deliverables:**\n`;
      const features = principalFeatures.split('\n').filter(f => f.trim());
      features.forEach((feature, index) => {
        sow += `${index + 1}. ${feature.trim()}\n`;
      });
      sow += `\n`;
    } else {
      sow += `**Key Deliverables:** Implementation of the proposed solution including design, development, testing, and deployment phases.\n\n`;
    }

    if (personsAffected && personsAffected.trim()) {
      sow += `**Stakeholders Impacted:** ${personsAffected}\n\n`;
    }

    if (businessAreasAffected && businessAreasAffected.trim()) {
      sow += `**Business Areas:** ${businessAreasAffected}\n\n`;
    }

    if (platformClientsImpacted && platformClientsImpacted.length > 0) {
      sow += `**Platform Clients Affected:** ${platformClientsImpacted.join(', ')}\n\n`;
    }

    sow += `**Expected Outcomes:** Successful implementation will deliver measurable improvements in ${businessObjective.toLowerCase()}`;
    if (this.isCostSaving(ideaDescription, businessObjective)) {
      sow += `, resulting in operational cost savings and increased efficiency`;
    } else {
      sow += `, creating new value and enhanced capabilities`;
    }
    sow += ` for the organization.`;

    return sow;
  }
}

module.exports = AIService;
