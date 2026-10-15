
import { GoogleGenAI, Type } from "@google/genai";
import { ELECTION_DATA } from '../data/electionData';
import { Candidate, PredictionParams, PredictionResult, VoteDistribution } from '../types';

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    predictedWinner: { type: Type.STRING, description: "The full name of the predicted winning candidate." },
    winningParty: { type: Type.STRING, description: "The full name of the predicted winning candidate's party." },
    voteDistribution: {
        type: Type.ARRAY,
        description: "An array of objects, each representing a key candidate's predicted vote share.",
        items: {
            type: Type.OBJECT,
            properties: {
                candidate: { type: Type.STRING, description: "Candidate's full name." },
                party: { type: Type.STRING, description: "Candidate's party acronym (e.g., NPP, UDP)." },
                percentage: { type: Type.NUMBER, description: "Predicted percentage of votes." },
            },
            required: ["candidate", "party", "percentage"],
        }
    },
    confidenceLevel: { type: Type.STRING, description: "Confidence level of the prediction (e.g., High, Medium, Low)." },
    analysis: { type: Type.STRING, description: "A detailed analysis explaining the reasoning behind the prediction, including factors considered." },
    regionalStrongholds: {
        type: Type.ARRAY,
        description: "Key regional strongholds for the top candidates.",
        items: {
            type: Type.OBJECT,
            properties: {
                region: { type: Type.STRING },
                candidate: { type: Type.STRING }
            },
        },
    },
  },
  required: ["predictedWinner", "winningParty", "voteDistribution", "confidenceLevel", "analysis", "regionalStrongholds"]
};

export const getElectionPrediction = async (
  params: PredictionParams,
  candidates: Candidate[]
): Promise<PredictionResult> => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const historicalDataString = JSON.stringify(ELECTION_DATA, null, 2);
  const candidatesString = JSON.stringify(candidates.map(c => ({ name: c.name, party: c.party, partyAcronym: c.partyAcronym, description: c.description })), null, 2);

  const prompt = `
    As a political analyst specializing in Gambian elections, your task is to predict the outcome of the 2026 presidential election.

    **Historical Election Data (1996-2021):**
    ${historicalDataString}

    **Key Candidates for 2026:**
    ${candidatesString}

    **Current Socio-Economic & Political Indicators for Prediction:**
    - Youth Unemployment Rate: ${params.youthUnemployment}%
    - GDP Growth: ${params.gdpGrowth}%
    - Predicted Voter Turnout: ${params.voterTurnout}%
    - Incumbent Performance Approval: ${params.incumbentPerformance}%
    - Annual Inflation Rate: ${params.inflationRate}%
    - Public Infrastructure Projects Rating: ${params.infrastructureRating}% approval
    - Opposition Party Unity Score: ${params.oppositionUnity}% (where 10% is completely fragmented and 100% is a fully unified coalition)

    **Analysis Task:**
    Based on all the provided data (historical trends, candidate profiles, and the detailed indicators), generate a prediction for the 2026 election.
    Consider the following analytical dimensions:
    - **Historical Precedent:** The shift from APRC's rule, the 2016 coalition victory, and Barrow's 2021 win with his new NPP party.
    - **Incumbency Factor:** How might the incumbent's performance rating and infrastructure projects influence their support base?
    - **Economic Sentiment:** How could high inflation or strong GDP growth sway voters? High inflation may hurt the incumbent, while strong growth could help.
    - **Opposition Dynamics:** A high unity score suggests a coalition is likely, which could consolidate votes against the incumbent, similar to 2016. A low score suggests a fragmented opposition, which may benefit the incumbent.
    - **Candidate Appeal:** Factor in the consistent presence of Ousainou Darboe, the youth appeal of Talib Bensouda (potentially splitting UDP votes), and the influence of third-party candidates.
    - **Voter Engagement:** Consider how the predicted turnout might amplify or mute certain trends.

    Return your prediction in the specified JSON format. The analysis should be concise but insightful, referencing the specific indicators provided.
    Crucially, the 'voteDistribution' array must include a predicted vote percentage for all major candidates listed. The sum of these percentages should approach 100%.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: predictionSchema,
        temperature: 0.5,
      }
    });
    
    const rawText = response.text?.trim() || "{}";
    const cleanedText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const result = JSON.parse(cleanedText);

    // Ensure vote distribution is sorted from highest to lowest percentage
    if (result.voteDistribution && Array.isArray(result.voteDistribution)) {
      result.voteDistribution.sort((a: VoteDistribution, b: VoteDistribution) => b.percentage - a.percentage);
    }

    return result as PredictionResult;
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    throw new Error(error?.message || "Failed to get prediction from the model. Please check the console for details.");
  }
};