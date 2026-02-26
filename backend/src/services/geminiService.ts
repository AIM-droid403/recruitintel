import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const extractResume = async (text: string) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    You are an expert recruitment AI. Analyze the following raw CV text and extract the information into a strict JSON format.
    
    TEXT:
    ${text}

    OUTPUT FORMAT:
    {
      "name": "Full Name",
      "contact": "Email or Phone",
      "skills": ["Skill1", "Skill2"],
      "experience": [
        {
          "company": "Company Name",
          "role": "Position",
          "years": "Duration"
        }
      ],
      "summary": "Brief professional overview"
    }

    RULES:
    - Return ONLY JSON.
    - No markdown formatting.
    - If a field is missing, use an empty string or array.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonString = response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('AI Extraction Error:', error);
        throw new Error('Failed to extract resume data');
    }
};

export const neuralMatch = async (jobPersona: string, candidates: any[]) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    You are a high-performance recruitment matching engine. 
    Compare the following Job Persona with the list of candidates.
    
    JOB PERSONA:
    ${jobPersona}

    CANDIDATES:
    ${JSON.stringify(candidates)}

    OUTPUT FORMAT:
    [
      {
        "candidateId": "ID",
        "matchScore": 0-100,
        "reasoning": "Brief explanation of why"
      }
    ]

    RULES:
    - Rank based on semantic similarity, experience alignment, and skill overlap.
    - Return ONLY the JSON array.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonString = response.text().replace(/```json|```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('AI Matching Error:', error);
        throw new Error('Failed to perform neural match');
    }
};

export const generateEmbedding = async (text: string) => {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
};
