import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../../lib/prisma";
import { envVars } from "../../config/env";

const queryRagFromDB = async (query: string) => {
    // ১. ডাটাবেস থেকে সব ডাক্তারের তথ্য নিয়ে আসা
    const doctors = await prisma.doctor.findMany({
        include: {
            specialties: {
                include: { specialty: true }
            }
        }
    });

    // ২. ডাক্তারদের তথ্য AI এর বোঝার মতো টেক্সট করে ফেলা
    const doctorContext = doctors.map(doc => {
        const specs = doc.specialties.map(s => s.specialty.title).join(", ");
        return `Name: ${doc.name}, Specialty: ${specs || "General"}, Fee: ${doc.appointmentFee}, Experience: ${doc.experience} years, Qualification: ${doc.qualification}`;
    }).join("\n");

    // ৩. Gemini AI কল করা
    const genAI = new GoogleGenerativeAI(envVars.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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