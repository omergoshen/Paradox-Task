# Paradox-Task
Part 3 : Open Questions

How would you optimize the process if you had more time?

First of all I would try to understand what is the best practice to deal with this task with lang chain.
Now I have developed 3 prompts that help the assistant function,
but if I had more time, I would add a memory (MemoryBuffer),
that would help the Assistant manage the conversation in a more professional and efficient.
Second, I would import the campData file and use: RecursiveCharacterTextSplitter, createDocuments, HNSWLib functions to handle Text Embeddings.

How would you test the prompts' performance?

I found that the most efficient option to check the performance of the prompts is using the verbose property,
It allows you to see what happens behind the scenes when the llm handles the answer to the questions.

What edge cases do you think are not handled currently that you would add?

For every question that asked from the user MultiPromptChain is responsible for deciding which prompt to route to,
and not the router prompt itself,
although in a lot of tests I performed MultiPromptChain does an excellent job.
and as I mentioned earlier, I would add a memory to illustrate a conversation between the chat and the user.

Chat Example:![Chat example](https://github.com/omergoshen/Paradox-Task/assets/39667792/bf8dfd2c-f821-4602-88ea-2ea9954ff827)
