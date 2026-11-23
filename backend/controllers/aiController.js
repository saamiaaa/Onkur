
const { GoogleGenAI } = require("@google/genai");
const User = require("../models/User");

const analyzeProfile = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured on the server.",
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

    const studentData = {
      university: user.university || "Not provided",
      degree: user.degree || "Not provided",
      academicYear: user.year || "Not provided",
      interests: user.interests || [],
      skills: user.skills || [],
      savedCareers: dashboard.careerInterests || [],
      savedUniversities: (dashboard.universities || []).map((item) => ({
        name: item.name || item.university || "Unnamed university",
        country: item.country || "Not specified",
      })),
      learningPath: development.selectedPath || "Not selected",
      completedSkills: development.completedSkills || [],
      completedProjects: development.completedProjects || [],
    };

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = `
You are Onkur's student development advisor.

Analyze the following student information and create a realistic,
encouraging, practical development report.

STUDENT INFORMATION:
${JSON.stringify(studentData, null, 2)}

IMPORTANT RULES:
- Only use information provided in the student profile.
- Do not invent grades, achievements, experience, or skills.
- If information is missing, clearly mention that it is missing.
- Do not guarantee university admission, scholarships, or employment.
- Make recommendations relevant to the student's current academic level.
- Keep the advice practical and beginner-friendly.
- Do not assume that a saved career or university is a confirmed decision.
- Avoid generic motivational statements.

Return ONLY valid JSON in this exact structure:

{
  "summary": "A short overall assessment of the student's current profile.",
  "strengths": [
    "A specific strength supported by the provided information."
  ],
  "growthAreas": [
    "An area the student could improve, with a short explanation."
  ],
  "careerDirections": [
    {
      "title": "Career direction",
      "reason": "Why this direction may suit the student."
    }
  ],
  "skillsToBuild": [
    {
      "skill": "Skill name",
      "reason": "Why the student should learn it.",
      "priority": "High"
    }
  ],
  "actionPlan": [
    {
      "step": "A practical action the student can take.",
      "timeline": "Suggested timeframe."
    }
  ]
}

Provide 3 to 5 items in each list where enough information is available.
If the profile is incomplete, make that clear rather than guessing.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    let analysis;

    try {
      analysis = JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini response parsing error:", error.message);

      return res.status(502).json({
        success: false,
        message: "The AI returned an unexpected response. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Your profile analysis is ready.",
      analysis,
    });
  } catch (error) {
    console.error("AI profile analysis error:", error);

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: "AI usage limit reached. Please try again later.",
      });
    }

    if (error.status === 400 || error.status === 403) {
      return res.status(502).json({
        success: false,
        message: "Gemini could not process the request. Check your API key and model access.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to analyze your profile right now. Please try again.",
    });
  }
};

module.exports = { analyzeProfile };
