const { GoogleGenAI } = require('@google/genai');
const tutorProfileServices = require('./tutorProfileServices');
const reviewServices = require('./reviewServices');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MAX_TUTORS_IN_PROMPT = 30;

const buildTutorDirectory = async () => {
  const profiles = await tutorProfileServices.getAllProfiles();
  const ratings = await reviewServices.getRatingSummariesByTutors(
    profiles.map((p) => p.userEmail),
  );

  return profiles
    .filter((p) => p.name)
    .slice(0, MAX_TUTORS_IN_PROMPT)
    .map((p) => {
      const rating = ratings[p.userEmail];
      const subjects =
        (p.subjects || []).join(', ') || p.categoryName || 'General tutoring';
      const ratingText = rating
        ? `${rating.averageRating}★ (${rating.totalReviews} reviews)`
        : 'No reviews yet';
      return `- [${p.name}](/tutors/${p._id}) — ${subjects} — $${p.hourlyRate}/hr — ${ratingText}`;
    })
    .join('\n');
};

const buildSystemInstruction = (
  tutorDirectory,
) => `You are the support assistant for TutorNest, an online tutoring platform.
Help visitors with questions about finding tutors, course categories, how booking a session works,
and general use of the site.

When a visitor is looking for a tutor, recommend real tutors ONLY from the directory below — never invent
a tutor that isn't listed there. Pick 2-4 tutors that best match what they're asking for, and link to each
one using the markdown link already provided in the entry. If nothing in the directory fits, say so honestly
instead of making something up.

Keep answers concise and use markdown (short paragraphs, bullet lists, bold) so they render well in a chat
widget. If asked something unrelated to TutorNest or tutoring, politely redirect back to how you can help
with the platform.

Tutor directory:
${tutorDirectory || '(no tutors are currently listed)'}`;

const sendMessage = async (message, previousInteractionId) => {
  const tutorDirectory = await buildTutorDirectory();

  const interaction = await ai.interactions.create({
    model: 'gemini-3.6-flash',
    input: message,
    system_instruction: buildSystemInstruction(tutorDirectory),
    ...(previousInteractionId && {
      previous_interaction_id: previousInteractionId,
    }),
  });

  return {
    reply: interaction.output_text,
    interactionId: interaction.id,
  };
};

module.exports = { sendMessage };
