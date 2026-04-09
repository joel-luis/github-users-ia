import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { AISearchRequest, AISearchResponse } from '@/types/ai-search'

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}

const SYSTEM_PROMPT = `You are a helpful assistant that interprets user requests about GitHub searches. 
Your job is to extract the user's intent and parameters from their natural language input.

You must respond with valid JSON only, no markdown, no extra text.

The possible intents are:
1. "search_users" — the user wants to search for GitHub users or organizations by a keyword or topic. Extract the search query.
2. "view_user" — the user wants to see a specific GitHub user's or organization's profile and repositories. Extract the username or organization name. GitHub organizations are accessed the same way as users.
3. "view_repo" — the user wants to see a specific repository. Extract the owner and repo name.
4. "unknown" — you cannot understand what the user wants.

IMPORTANT: GitHub organizations (e.g. vercel, facebook, google, microsoft) are treated exactly like users. When someone asks about an organization, use "view_user" with the org name as the username. The user may write in any language — always extract the intent correctly regardless of language.

IMPORTANT: Use "view_repo" ONLY when the user specifies BOTH the owner AND the repository name (e.g. "facebook/react", "vercel/next.js"). If the user mentions only a username/org and wants to see their repos (e.g. "show repos by joel-luis", "find joel-luis repositories"), use "view_user" instead — this opens their profile page which lists all repositories.

Response format:
{
  "intent": "search_users" | "view_user" | "view_repo" | "unknown",
  "params": {
    "query": "search term (for search_users)",
    "username": "github username or org name (for view_user)",
    "owner": "repo owner (for view_repo)",
    "repo": "repo name (for view_repo)"
  },
  "message": "A brief friendly message in English describing what you understood and what action will be taken."
}

Examples:
- "find joel-luis repositories on github" → {"intent":"view_user","params":{"username":"joel-luis"},"message":"Opening joel-luis's profile and repositories."}
- "search for react developers" → {"intent":"search_users","params":{"query":"react developers"},"message":"Searching for users matching 'react developers'."}
- "show me the repo facebook/react" → {"intent":"view_repo","params":{"owner":"facebook","repo":"react"},"message":"Opening the facebook/react repository."}
- "show the vercel/next.js repository" → {"intent":"view_repo","params":{"owner":"vercel","repo":"next.js"},"message":"Opening the vercel/next.js repository."}
- "I want to see octocat's profile" → {"intent":"view_user","params":{"username":"octocat"},"message":"Opening octocat's profile."}
- "show repos by joel-luis" → {"intent":"view_user","params":{"username":"joel-luis"},"message":"Opening joel-luis's profile and repositories."}
- "quero ver os repositórios do joel-luis" → {"intent":"view_user","params":{"username":"joel-luis"},"message":"Opening joel-luis's profile and repositories."}
- "show me the vercel organization" → {"intent":"view_user","params":{"username":"vercel"},"message":"Opening vercel's organization profile and repositories."}
- "busque pela organização da google" → {"intent":"view_user","params":{"username":"google"},"message":"Opening google's organization profile and repositories."}
- "search for AI organizations" → {"intent":"search_users","params":{"query":"AI organizations"},"message":"Searching for users and organizations matching 'AI organizations'."}
- "asdfghjkl" → {"intent":"unknown","params":{},"message":"I couldn't understand your request. Try something like: 'find repos by octocat' or 'search for react developers'."}`

const MAX_PROMPT_LENGTH = 500

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const body = (await request.json()) as AISearchRequest

    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const prompt = body.prompt.trim().slice(0, MAX_PROMPT_LENGTH)

    if (prompt.length === 0) {
      return NextResponse.json(
        { error: 'Prompt cannot be empty' },
        { status: 400 }
      )
    }

    const openai = getOpenAIClient()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 200,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    const parsed: AISearchResponse = JSON.parse(content)

    const validIntents = ['search_users', 'view_user', 'view_repo', 'unknown']
    if (!validIntents.includes(parsed.intent)) {
      parsed.intent = 'unknown'
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('AI Search error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
