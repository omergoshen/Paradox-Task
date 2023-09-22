import { MultiPromptChain } from "langchain/chains";
import { OpenAIChat } from "langchain/llms/openai";
import * as dotenv from "dotenv";
import { ConversationSummaryMemory } from "langchain/memory";

dotenv.config();

const llm = new OpenAIChat({
    temperature: 0.5,
    streaming:true,
    verbose: false,
    callbacks:[
        {
            handleLLMNewToken(token){
                process.stdout.write(token);
            }
        }
    ]
}); 

const campData = `Welcome to GenAI Summer Camp!
At GenAI Summer Camp, we are committed to providing a fun and educational experience for young minds eager to explore the exciting world of artificial intelligence and technology. Our camp is designed to foster creativity, critical thinking, and collaboration while equipping campers with valuable AI skills. Below, you'll find all the details about our camp, including offerings, values, policies, location, dates, pricing, and age range.
Camp Offerings:
1. AI Workshops:Our core program includes hands-on workshops covering a range of AI topics such as machine learning, computer vision, natural language processing, and robotics. Campers will learn to build AI models and applications from scratch.
2.Coding and Programming:Campers will develop their coding skills through Python and other programming languages, gaining a solid foundation for AI development.
3.STEM Challenges:We offer STEM challenges and competitions that encourage campers to apply their AI knowledge to solve real-world problems.
4.Guest Speaker Series:Renowned AI experts and entrepreneurs will share their insights and experiences, inspiring campers to dream big.
5.Field Trips:Campers will visit AI research labs, tech companies, and innovation centers to see AI in action.
6.Team Projects:Campers will collaborate on AI projects, fostering teamwork and innovation.
7.AI Ethics and Responsibility:We emphasize the ethical use of AI and its societal impact, encouraging responsible AI development.
Our Values:
1. Inclusivity: We welcome campers from diverse backgrounds and abilities, fostering an inclusive learning environment.
2. Learning:We prioritize learning and skill-building, aiming to equip campers for future opportunities in the AI field.
3. Safety: Campers' safety and well-being are our top priorities, with trained staff and appropriate security measures in place.
4. Fun: We believe that learning should be enjoyable, and we strive to make every day at camp exciting and memorable.
5. Respect: We encourage respect for others' ideas, cultures, and perspectives, promoting a positive and respectful camp community.
Camp Policies:
1.Code of Conduct:Campers must adhere to a code of conduct that promotes respect, responsibility, and safety.
2. Health and Safety:We maintain strict health and safety protocols to ensure a secure camp environment.
3.Attendance:Campers are expected to attend all scheduled activities unless they have a valid reason for absence.
4. Communication: Parents and guardians are encouraged to maintain open communication with camp staff.
5. Anti-Discrimination:Discrimination of any kind will not be tolerated at our camp.
Location:
GenAI Summer Camp is located in the picturesque tech hub of Silicon Valley, California. Campers will have access to cutting-edge facilities and the opportunity to explore the heart of the technology industry.
Dates:
Our summer camp runs for six weeks from June 15th to July 31st, providing campers with ample time to immerse themselves in the world of AI and technology.
Pricing:
We offer two pricing options:
1.Full Program:$3,500 - This package includes all workshops, activities, meals, and accommodations for the entire six-week camp duration.
2. Weekend Warrior: $750 per weekend - Campers can join us for any weekend during the camp, participating in workshops and activities without accommodations or meals.
Age Range:
GenAI Summer Camp is open to campers aged 12 to 17. We believe that this age range is ideal for fostering interest and skill development in the field of AI while ensuring a supportive and engaging learning environment.
Join us at GenAI Summer Camp for an unforgettable summer of learning, innovation, and fun! Our goal is to empower the next generation of AI enthusiasts and innovators, and we can't wait to embark on this exciting journey with your child.`

const promptNames = ["Router", "Q&A","Application-sign up"];

const promptDescriptions = [
  "Good for determine whether the participant is asking about the camp or sign their kid up for the camp",
  `Good for handle questions from parents and provide answers based on the provided camp information`,
  "Good for handle the kid's application to the camp"
];

const questionPrompt = `You are a Q&A prompt. You will answer the question based on this information:
${campData}

Here is the question:
{input}
`;

const applicationPrompt = `You are an application prompt, responsible for managing camp applications. 
If the user mentions their child's age, please check if it falls within the camp's age range (12-17 years). 
If it matches, proceed to collect the following information:
1.Parent's full name
2.Phone number
3.Email address
If the age doesn't match, kindly conclude the conversation with an apology and inform them that their child is not eligible to participate in the camp. If the user doesn't mention their child's age, please prompt them to provide this information."

Here is the question:
{input}
`;
const routerPrompt = `You are a router prompt.
YOU DONT ANSWER ANY QUESTIONS, JUST ROUTE THE QUESTION TO THE CORRECT PROMPT BY USING THE FOLLOWING RULES:
if the question is about the camp, you will use the Question prompt to reply a short answer- ${questionPrompt} .
if the question is about sign up, you will use the Application-sign up prompt to handle the application- ${applicationPrompt}.
Here is a question:
{input}
`;
const promptTemplates = [routerPrompt, questionPrompt,applicationPrompt];

const memory = new ConversationSummaryMemory({ 
    memoryKey: "chat_history",
  });

const multiPromptChain = MultiPromptChain.fromLLMAndPrompts(llm, {
  promptNames,
  promptDescriptions,
  promptTemplates,
  memory,
});

//Chat:

//should go to the router prompt
await multiPromptChain.call({
  input: "how can i get information about the camp?",
});
//should go to the QA prompt
await multiPromptChain.call({
  input: "what are the camp values?",
});

//should go to the application prompt and verify the kid age
 await multiPromptChain.call({
  input: "how can i sign up my son he is 18?",
});
//should go to the application prompt and continue with the application process
await multiPromptChain.call({
  input: "My son is 16 years old, can i sign him up?",
});



