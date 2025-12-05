const fetch = require('node-fetch');

/**
 * Service for interacting with Google Gemini AI API
 */
class AIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  /**
   * Generate mock analysis when API key is not available
   */
  generateMockAnalysis(idea) {
    const { ideaDescription, businessObjective, businessValue, monetaryValue } = idea;
    
    // Determine score based on monetary value or use provided value
    let score = businessValue || 5;
    if (!businessValue && monetaryValue) {
      if (monetaryValue >= 1000) score = 8;
      else if (monetaryValue >= 500) score = 6;
      else if (monetaryValue >= 250) score = 4;
      else score = 2;
    }

    return {
      statementOfWork: `This initiative aims to ${businessObjective}. The proposed solution will address ${ideaDescription}. Key deliverables include requirements gathering, system design, implementation, testing, and deployment. The project will follow an agile methodology with regular stakeholder reviews to ensure alignment with business objectives.`,
      businessValueScore: score,
      businessValueJustification: `Based on the provided information and business objective, this initiative scores ${score}/10 on the Business Value Scale. ${monetaryValue ? `With an estimated monetary value of £${monetaryValue}K, ` : ''}This represents ${score >= 7 ? 'significant' : score >= 5 ? 'high' : score >= 3 ? 'medium' : 'low'} value potential for the organization.`,
      costSaving: monetaryValue ? monetaryValue < 0 : false,
      userProvidedScore: businessValue ? true : false
    };
  }

  /**
   * Analyze HR initiative idea using Gemini AI
   */
  async generateAnalysis(idea) {
    const { ideaDescription, businessObjective, businessValue, monetaryValue } = idea;

    // If no API key, return mock analysis
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.log('⚠️  Using mock AI analysis (no API key configured)');
      return this.generateMockAnalysis(idea);
    }

    const systemPrompt = `You are an expert HR Technology Product Owner. Your role is to analyze raw ideas from HR business partners and transform them into actionable project proposals.

Your analysis MUST use the following 'Business Value Scale' to determine the score:
- **Score 10-9 (Critical):** ONLY for Legal or Compliance. Must be done. Could stop the business, incur significant costs, or damage reputation.
- **Score 8-7 (Significant Value):** Initiative has a 'Value > £1m' OR 'Offers significant value to Next NOW / Reduces Urgent Tech Debt'.
- **Score 6-5 (High Value):** Initiative has a 'Value > £500k'. Brings value to Next.
- **Score 4-3 (Medium Value):** Initiative has a 'Value > £250k'. Brings value, may NOT be immediately realised.
- **Score 2-1 (Low Value):** Initiative has a 'Value < £250k'. Minor functional or non-functional changes with useful value.

${businessValue ? `The user has provided a Business Value score of ${businessValue}. You should use this score in your analysis.` : 'The user has not provided a Business Value score. You must calculate it based on the idea using the scale above.'}

You must evaluate the idea and generate a structured JSON response containing:
1. A formal 'statementOfWork' (a concise paragraph outlining objectives, scope, and key deliverables).
2. A 'businessValueScore' (a numerical score from 1-10${businessValue ? `, which should be ${businessValue} as provided by the user` : ', based *strictly* on the scale above'}).
3. A 'businessValueJustification' (a brief explanation for the score, explicitly linking it to one of the scale's criteria above).
4. A 'costSaving' (a boolean value, true if the initiative is primarily cost-saving, false if it is primarily value-generating).
5. ${businessValue ? `A 'userProvidedScore' field set to true to indicate the score was provided by the user.` : `A 'userProvidedScore' field set to false to indicate the score was AI-generated.`}

You must always provide a score and justification, even if the idea is poor (in that case, give a low score and explain why).`;

    let userQuery = `Analyze the following HR initiative idea:
- Description of the Idea: ${ideaDescription}
- Business Objective: ${businessObjective}`;

    if (businessValue) {
      userQuery += `\n- Business Value (User Provided): ${businessValue}/10`;
    }

    if (monetaryValue) {
      userQuery += `\n- Monetary Value: £${monetaryValue}K`;
    }

    const schema = {
      type: "OBJECT",
      properties: {
        statementOfWork: {
          type: "STRING",
          description: "A detailed, professional Statement of Work (SoW) outlining objectives, scope, and key deliverables."
        },
        businessValueScore: {
          type: "NUMBER",
          description: businessValue 
            ? `The business value score, which should be ${businessValue} as provided by the user.`
            : "A score from 1 (low) to 10 (high) representing the potential business value, based on the provided scale."
        },
        businessValueJustification: {
          type: "STRING",
          description: "A concise justification for the assigned score, explaining how it maps to the provided Business Value Scale."
        },
        costSaving: {
          type: "BOOLEAN",
          description: "True if the initiative is primarily focused on cost savings, false if it is primarily value-generating."
        },
        userProvidedScore: {
          type: "BOOLEAN",
          description: "True if the business value score was provided by the user, false if it was AI-generated."
        }
      },
      required: ["statementOfWork", "businessValueScore", "businessValueJustification", "costSaving", "userProvidedScore"]
    };

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.3,
      }
    };

    const maxAttempts = 5;
    let attempts = 0;
    let delay = 1000;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();

          if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {

            const jsonText = result.candidates[0].content.parts[0].text;
            const parsedJson = JSON.parse(jsonText);
            return parsedJson;
          } else {
            console.error("Invalid response structure from Gemini:", result);
            throw new Error("AI response was empty or malformed.");
          }
        } else if (response.status === 429 || response.status >= 500) {
          if (attempts >= maxAttempts) {
            throw new Error(`API request failed after ${maxAttempts} attempts with status: ${response.status}`);
          }
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          const errorBody = await response.json();
          console.error("API Error Body:", errorBody);
          throw new Error(`API request failed with status: ${response.status}. ${errorBody?.error?.message || ''}`);
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          console.error("Failed to fetch AI analysis after multiple attempts:", error);
          throw error;
        }
        if (error.name !== 'AbortError') {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }
  }
}

module.exports = AIService;
