import { GoogleGenAI } from "@google/genai";
import { prisma } from "../../lib/prisma";
import { envVars } from "../../config/env";

const queryRagFromDB = async (query: string) => {
   
    const doctors = await prisma.doctor.findMany({
        include: {
            specialties: {
                include: { specialty: true }
            }
        }
    });

   
    const doctorContext = doctors.map(doc => {
        const specs = doc.specialties.map(s => s.specialty.title).join(", ");
        return `Name: ${doc.name}, Specialty: ${specs || "General"}, Fee: ${doc.appointmentFee}, Experience: ${doc.experience} years, Qualification: ${doc.qualification}`;
    }).join("\n");

    
    const ai = new GoogleGenAI({ apiKey: envVars.GEMINI_API_KEY as string });

    const promptText = `
        You are a helpful healthcare assistant. 
        Based on the following doctor database, answer the user's query.
        Recommend the most suitable doctors based on the user's question. 

        Doctor Database:
        ${doctorContext}

        User Query: ${query}
    `;

  
    const response = await ai.models.generateContent({
  model: "gemini-3.8-flash", // ekhane model name update kore dao
  contents: [
    {
      role: "user",
      parts: [{ text: promptText }]
    }
  ]
});

    const answer = response.text;

    return {
        answer,
        sources: [],
        contextUsed: doctorContext
    };
};

export const ragService = { queryRagFromDB };