import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../../lib/prisma";
import { envVars } from "../../config/env";

const queryRagFromDB = async (query: string) => {


        const genAI = new GoogleGenerativeAI(envVars.GEMINI_API_KEY as string);
    
    // আপনার API Key এর জন্য উপলব্ধ মডেলগুলো চেক করা হচ্ছে
    const models = await genAI.;
    console.log("Available Models:", models);
    
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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

   
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
        You are a helpful healthcare assistant. 
        Based on the following doctor database, answer the user's query.
        Recommend the most suitable doctors based on the user's question. 
        Format the output clearly.

        Doctor Database:
        ${doctorContext}

        User Query: ${query}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    return {
        answer,
        sources: [],
        contextUsed: doctorContext
    };
};

export const ragService = { queryRagFromDB };