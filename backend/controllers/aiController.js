
const { GoogleGenAI } = require("@google/genai");
const User = require("../models/User");

const analyzeProfile = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing from backend/.env",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    const dashboard = user.dashboard || {};
    const development = dashboard.development || {};
    const paths = development.paths || {};

    const studentData = {
      name: user.fullName,
      university: user.university || "Not provided",
      degree: user.degree || "Not provided",
      academicYear: user.year || "Not provided",
      interests: user.interests || [],
      skills: user.skills || [],
      savedCareers: dashboard.careerInterests || [],
      savedUniversities: dashboard.universities || [],
      learningPath: development.selectedPath || "Not selected",
      learningProgress: paths,
    };

    const prompt = `
You are Onkur's AI Student Development Advisor.

Analyze the following student's profile and create a personalized
development report.

STUDENT INFORMATION:
${JSON.stringify(studentData, null, 2)}

RULES:
- Only use the information provided.
- Never invent grades, achievements, skills or experience.
- Clearly identify missing information.
- Do not guarantee university admission, scholarships or employment.
- Give realistic and beginner-friendly recommendations.
- Treat saved careers and universities as interests, not confirmed decisions.
- Make recommendations suitable for the student's academic level.

Return ONLY valid JSON using this exact structure:

{
  "summary": "Overall student profile assessment",
  "strengths": [
    "Specific strength supported by the profile"
  ],
  "growthAreas": [
    "Area that needs improvement"
  ],
  "careerDirections": [
    {
      "title": "Career direction",
      "reason": "Why this direction may suit the student"
    }
  ],
  "skillsToBuild": [
    {
      "skill": "Skill name",
      "reason": "Why this skill is useful",
      "priority": "High"
    }
  ],
  "actionPlan": [
    {
      "step": "Practical action",
      "timeline": "Suggested timeframe"
    }
  ]
}

Provide 3 to 5 useful items per list when possible.
Do not make unsupported assumptions.
`;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt,
    });

    const responseText = response.output_text;

    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    let analysis;

    try {
      analysis = JSON.parse(responseText);
    } catch (error) {
      console.error("Gemini JSON parsing error:", responseText);

      throw new Error("Gemini returned an invalid JSON response.");
    }

    return res.status(200).json({
      success: true,
      message: "Your profile analysis is ready.",
      analysis,
    });

  } catch (error) {
    console.error("========== ONKUR AI ERROR ==========");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Stack:", error.stack);
    console.error("====================================");

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: "AI usage limit reached. Please try again later.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to analyze your profile.",
      ...(process.env.NODE_ENV !== "production" && {
        debug: error.message,
        errorStatus: error.status || null,
      }),
    });
  }
};

module.exports = { analyzeProfile };
