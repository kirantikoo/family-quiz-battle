# AGENTS.md

# Family Quiz Battle — Master AI Development Guide

## 1. Project Identity

Family Quiz Battle is a modern, mobile-first, AI-powered family quiz game and learning platform.

The app is designed for families, kids, parents, and friends to play quiz battles together, learn new things, earn rewards, unlock achievements, and enjoy daily AI-generated quiz experiences.

This project must feel like a real premium app, not a simple website.

Core values:

- Fun
- Family-friendly
- Safe for kids
- Educational
- Competitive
- Beautiful UI/UX
- Fast performance
- AI-powered
- Mobile-first
- PWA-ready
- Scalable

---

## 2. Main Product Vision

Family Quiz Battle should become a complete quiz entertainment platform with:

- Solo quiz mode
- Family team battle
- Multiplayer battle rooms
- AI Daily Quiz
- Voice Assistant
- AI quiz host
- Achievement Store
- XP, coins, levels, streaks
- Leaderboards
- Daily challenges
- Weekly events
- Seasonal events
- Avatar system
- Quiz history
- Supabase cloud sync
- Offline PWA support
- Safe kids-friendly experience

The long-term goal is to build something with the polish of Kahoot, Quizizz, Duolingo, and a family game app combined.

---

## 3. Technology Stack

Use this stack unless the project owner explicitly changes it.

Frontend:

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- App Router
- Framer Motion

Backend:

- Supabase Auth
- Supabase Database
- Supabase Storage
- Supabase Edge Functions in future

AI:

- OpenAI API
- Gemini API as alternative
- AI question generation
- AI explanation generation
- AI voice narration in future

Question Sources:

- Supabase cached database
- Open Trivia DB
- The Trivia API
- AI-generated questions
- Admin-created custom questions

Deployment:

- GitHub
- Vercel

PWA:

- Manifest
- Service worker
- Offline cache
- Installable app icons

---

## 4. Project Architecture Rules

Keep pages small.

Never place too much logic inside `app/page.tsx` or route files.

Use reusable components, hooks, utilities, and data files.

Recommended structure:

```txt
app/
  page.tsx
  login/
  play/
  quiz/
  result/
  profile/
  settings/
  rooms/
  leaderboard/
  achievements/
  store/
  daily/
  api/

components/
  layout/
  home/
  quiz/
  profile/
  settings/
  rooms/
  leaderboard/
  achievements/
  store/
  common/
  ui/

lib/
  supabase/
  storage.ts
  getDisplayName.ts
  quizEngine.ts
  questionSources.ts
  xpSystem.ts
  achievementSystem.ts
  avatarSystem.ts
  soundSystem.ts
  ai/

data/
  avatars.ts
  categories.ts
  achievements.ts
  storeItems.ts
  fallbackQuestions.ts

hooks/
  usePlayer.ts
  useAuth.ts
  useSound.ts
  useQuiz.ts
  useDailyChallenge.ts

types/
  player.ts
  quiz.ts
  question.ts
  achievement.ts
  store.ts

public/
  avatars/
  icons/
  sounds/
  logo.png
  icon-192.png
  icon-512.png
  favicon.ico
```

---

## 5. Coding Standards

Always use TypeScript.

Avoid `any` unless there is no practical alternative.

Use strict typing for:

- Player data
- Quiz questions
- API responses
- Supabase data
- Achievements
- Store items
- Avatars
- Quiz results

Every component should be:

- Reusable
- Small
- Typed
- Mobile responsive
- Accessible

Never copy-paste the same UI multiple times.

Create shared components instead.

---

## 6. UI/UX Direction

The app should look:

- Premium
- Modern
- Fun
- Colorful
- Rounded
- Family-friendly
- Mobile-app style
- Smooth
- Clean

Use:

- Large rounded cards
- Soft gradients
- Glassmorphism where suitable
- Strong visual hierarchy
- Clear CTAs
- Large touch targets
- Friendly icons
- Beautiful avatar cards
- App-like bottom navigation

Avoid:

- Plain HTML-style layouts
- Small buttons
- Sharp square cards
- Overcrowded screens
- Too much text
- Poor spacing
- Desktop-only design

---

## 7. Main Design Tokens

Primary background:

```txt
#070A22
```

Primary purple:

```txt
#7C3AED
```

Secondary purple:

```txt
#8B5CF6
```

Accent gold:

```txt
#F59E0B
```

Success green:

```txt
#10B981
```

Error red:

```txt
#EF4444
```

Text white:

```txt
#FFFFFF
```

Muted text:

```txt
rgba(255,255,255,0.65)
```

Cards:

```txt
rgba(255,255,255,0.08)
```

Borders:

```txt
rgba(255,255,255,0.10)
```

---

## 8. Responsive Rules

Mobile first always.

Test every page at:

- 320px
- 375px
- 390px
- 414px
- 768px
- 1024px
- 1440px

Mobile requirements:

- No horizontal scroll
- Bottom nav visible
- Cards stack nicely
- Buttons minimum 48px high
- Text readable
- Quiz answers easy to tap
- Header does not overflow
- Avatar grid fits properly

Desktop requirements:

- Max width containers
- Sidebar or app shell where useful
- Balanced card layout
- Good whitespace

---

## 9. Core Components Required

Create and reuse these components:

```txt
AppHeader
BottomNav
MobileDrawer
UserCard
ProfileCard
AvatarPicker
XPBar
LevelBadge
CoinBadge
StreakBadge
CategoryCard
QuizCard
QuestionCard
AnswerButton
TimerRing
ResultSummary
AchievementCard
DailyChallengeCard
LeaderboardTable
StoreItemCard
FamilyTeamCard
VoiceAssistantButton
SoundToggle
ThemeToggle
LoadingState
EmptyState
ErrorState
```

---

## 10. Authentication Rules

Use Supabase Auth.

Support:

- Google login
- Email login in future
- Guest mode in future

After login, redirect user to:

```txt
/
```

Do not redirect to profile by default.

Never hardcode a user name.

Use:

```ts
export function getDisplayName(user: any) {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Guest'
  );
}
```

Later replace `any` with proper Supabase user type.

---

## 11. User Profile Rules

Player profile must support:

- Google name
- Email
- Google profile image
- Uploaded image
- Selected 3D avatar
- Default avatar
- XP
- Coins
- Level
- Streak
- Achievements
- Quiz history
- Sound preference
- Theme preference

Avatar priority:

```txt
Uploaded image
↓
Selected 3D avatar
↓
Google profile image
↓
Default avatar
```

Never add a “Use Google Photo” button.

When uploaded image is removed, automatically fall back to Google photo or selected avatar based on priority.

---

## 12. Player Data Type

Use this shape:

```ts
export interface QuizHistory {
  id: string;
  category: string;
  score: number;
  total: number;
  xp: number;
  coins: number;
  playedAt: string;
}

export interface PlayerData {
  avatar: string;
  avatarType: 'emoji' | 'image';
  customAvatarImage?: string;
  xp: number;
  coins: number;
  level: number;
  streak: number;
  quizzesPlayed: number;
  achievements: string[];
  history: QuizHistory[];
  soundEnabled: boolean;
}
```

Always migrate old localStorage values safely.

Never assume a field exists.

---

## 13. LocalStorage Rules

Use localStorage only inside client components or hooks.

Never access localStorage in server components.

Always wrap localStorage reads in safe functions.

Example:

```ts
try {
  const raw = localStorage.getItem('family-quiz-player');
  if (!raw) return defaultPlayerData;
  const parsed = JSON.parse(raw);
  return migratePlayerData(parsed);
} catch {
  return defaultPlayerData;
}
```

---

## 14. Quiz Engine Rules

Each standard quiz should have:

- 10 questions
- 4 options
- 1 correct answer
- 15 second timer
- Score tracking
- XP reward
- Coin reward
- Result page
- History save

Question format:

```ts
export interface QuizQuestion {
  id: string;
  category: string;
  genre?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  source: 'local' | 'opentdb' | 'trivia-api' | 'ai' | 'admin';
}
```

---

## 15. Question Source Strategy

Do not hardcode thousands of questions directly inside code.

Use a hybrid question system:

1. Check Supabase question cache.
2. If questions exist, load from Supabase.
3. If not enough questions, fetch from external API.
4. If API does not have enough, generate with AI.
5. Validate and normalize questions.
6. Save generated/fetched questions into Supabase.
7. Serve quiz from cached questions.

Recommended flow:

```txt
User selects genre/category
        ↓
Check Supabase cached questions
        ↓
Enough questions?
   Yes → Start quiz
   No  → Fetch API / Generate AI
        ↓
Validate questions
        ↓
Save to Supabase
        ↓
Start quiz
```

---

## 16. Supported Question Sources

### Open Trivia DB

Use for free quiz questions.

Good for:

- General Knowledge
- Entertainment
- Science
- History
- Geography
- Sports
- Computers
- Animals
- Vehicles

### The Trivia API

Use as another free/low-cost trivia source.

Good for:

- Mixed quizzes
- Category quizzes
- Difficulty-based quizzes

### AI Generated Questions

Use OpenAI or Gemini to generate questions when:

- Public API does not have enough questions
- Need custom family quiz
- Need kid-friendly wording
- Need local Australia quiz
- Need daily quiz
- Need explanation
- Need multi-language support
- Need adaptive difficulty

### Admin Questions

Allow the project owner to create custom questions from an admin dashboard in future.

---

## 17. AI Question Generation Rules

AI-generated questions must always return JSON only.

Example prompt:

```txt
Generate 10 family-friendly multiple-choice quiz questions.
Category: Geography
Genre: World Capitals
Difficulty: Easy
Age group: 10-15
Language: English
Return JSON only.
Each question must include:
id, category, genre, difficulty, question, options, correctAnswer, explanation.
No unsafe, adult, political persuasion, hateful, or violent content.
```

Validate AI output before saving.

Reject questions if:

- Less than 4 options
- No correct answer
- Correct answer not in options
- Duplicate question
- Unsafe content
- Poor grammar
- Too difficult for selected age
- Not family-friendly

---

## 18. AI Daily Quiz

The app must support AI Daily Quiz.

Daily quiz types:

- Daily Family Quiz
- Kids Daily Quiz
- Parents Daily Quiz
- Australia Daily Quiz
- Science Daily Quiz
- Movie Daily Quiz
- Music Daily Quiz
- Sports Daily Quiz
- Geography Daily Quiz
- Mixed Daily Challenge

Rules:

- New quiz every day
- Same daily quiz can be cached for all users
- Save to Supabase
- Avoid repeat questions
- Reward completion
- Give streak bonus

Daily rewards:

```txt
Completion: +20 XP, +10 coins
Perfect score: +50 XP, +25 coins
Streak bonus: +5 coins per day
```

---

## 19. Genre System

Support categories and genres.

Examples:

```txt
General Knowledge
  - Mixed
  - Fun Facts
  - Brain Teasers

Science
  - Space
  - Animals
  - Human Body
  - Inventions
  - Nature

Geography
  - Countries
  - Capitals
  - Flags
  - Australia
  - World Landmarks

History
  - Ancient History
  - Modern History
  - Famous People
  - Australian History

Movies
  - Disney
  - Superheroes
  - Family Movies
  - Animation

Music
  - Pop Music
  - Instruments
  - Songs
  - Artists

Sports
  - Cricket
  - Football
  - Olympics
  - Tennis

School
  - Maths
  - English
  - Science
  - Computers

Kids
  - Animals
  - Cartoons
  - Simple Maths
  - Fairy Tales
```

---

## 20. Voice Assistant

The app should support a Voice Assistant in future.

Voice Assistant features:

- Read questions aloud
- Read answer options
- Repeat question
- Accept voice answer
- Give encouragement
- Explain correct answer
- Celebrate wins
- Support kids-friendly voice

Voice UI rules:

- Add microphone button
- Show listening state
- Show speaking state
- Allow mute
- Allow voice speed setting
- Always provide text fallback

Never make voice required.

Accessibility first.

---

## 21. AI Quiz Host

Future feature: AI Host.

The AI Host should act like a friendly game show host.

It can say:

- “Welcome to Family Quiz Battle!”
- “Question one is ready.”
- “Great answer!”
- “Almost there!”
- “You unlocked a new badge!”

Rules:

- Keep language family-friendly
- No sarcasm
- No insults
- Encourage learning
- Short messages only

---

## 22. Family Team Battle

Family Team Battle is a major feature.

Support:

- Create family team
- Add family members
- Shared family score
- Individual scores
- Team badges
- Weekly family challenge
- Parent vs kids mode
- Siblings battle mode
- Family leaderboard

Team roles:

```txt
Parent
Child
Guest
Admin
```

Family team data:

```ts
export interface FamilyTeam {
  id: string;
  name: string;
  ownerId: string;
  members: FamilyMember[];
  xp: number;
  coins: number;
  level: number;
  badges: string[];
  createdAt: string;
}
```

---

## 23. Multiplayer Battle Rooms

Support rooms in future.

Room types:

- Private family room
- Friends room
- Public battle room
- Daily challenge room

Room features:

- Room code
- Join by link
- Live score
- Countdown
- Question sync
- Winner screen
- Rematch

Use Supabase Realtime for multiplayer.

---

## 24. Achievement System

Achievements should motivate users.

Examples:

```txt
First Quiz
Perfect Score
7 Day Streak
30 Day Streak
Science Star
History Hero
Geography Genius
Movie Master
Music Champ
Sports Legend
Family Champion
Daily Warrior
Coin Collector
Level 10
Level 25
Level 50
Quiz Legend
```

Achievement object:

```ts
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  condition: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

---

## 25. Achievement Store

Achievement Store lets players spend coins.

Store item types:

- Premium avatars
- Avatar frames
- Name colors
- Profile backgrounds
- Celebration animations
- Sound packs
- Trophy room items
- Stickers
- Themes
- Power-ups

Store item object:

```ts
export interface StoreItem {
  id: string;
  name: string;
  description: string;
  type: 'avatar' | 'frame' | 'theme' | 'sound' | 'sticker' | 'effect' | 'powerup';
  price: number;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
}
```

Never use real-money purchases until the app is legally ready.

Start with coins only.

---

## 26. XP, Coins, and Level Rules

XP rewards:

```txt
Correct answer: +5 XP
Quiz completed: +20 XP
Perfect score: +50 XP
Daily quiz: +20 XP
Achievement unlock: varies
```

Coin rewards:

```txt
Correct answer: +2 coins
Quiz completed: +10 coins
Perfect score: +25 coins
Daily streak: variable
Achievement unlock: varies
```

Level formula:

```ts
level = Math.floor(xp / 1000) + 1;
```

XP progress:

```ts
currentLevelXp = xp % 1000;
progress = (currentLevelXp / 1000) * 100;
```

---

## 27. Streak System

Track daily play.

Rules:

- If user plays today, streak continues.
- If user played yesterday, add +1.
- If user missed a day, reset to 1.
- Save lastPlayed date.

Rewards:

```txt
3 days: +10 coins
7 days: +50 coins + badge
30 days: +250 coins + rare badge
100 days: legendary badge
```

---

## 28. Leaderboards

Support:

- Daily leaderboard
- Weekly leaderboard
- Monthly leaderboard
- All-time leaderboard
- Family leaderboard
- Friends leaderboard
- Category leaderboard

Leaderboard fields:

```txt
rank
userId
name
avatar
xp
score
level
streak
```

Protect against cheating.

Do not trust client-only score updates in final production.

---

## 29. Anti-Cheat Rules

In MVP, local scoring is acceptable.

For production:

- Validate quiz session server-side
- Store question IDs
- Store startedAt and completedAt
- Reject impossible speed
- Reject duplicate submissions
- Do not allow client to directly set XP/coins freely
- Use Supabase RLS

---

## 30. Supabase Database Plan

Recommended tables:

```txt
profiles
player_stats
questions
quiz_sessions
quiz_results
achievements
user_achievements
store_items
user_inventory
family_teams
family_members
leaderboards
daily_quizzes
```

Profiles:

```sql
id uuid primary key references auth.users(id)
name text
email text
avatar_url text
selected_avatar text
custom_avatar_url text
created_at timestamptz
updated_at timestamptz
```

Player stats:

```sql
user_id uuid references profiles(id)
xp integer
coins integer
level integer
streak integer
quizzes_played integer
last_played date
```

Questions:

```sql
id uuid primary key
category text
genre text
difficulty text
question text
options jsonb
correct_answer text
explanation text
source text
language text
created_at timestamptz
```

---

## 31. Supabase Security Rules

Use Row Level Security.

Users can:

- Read own profile
- Update own profile
- Read public questions
- Read own quiz history
- Read public leaderboard

Users cannot:

- Modify other users
- Give themselves unlimited coins
- Edit official questions
- Edit achievements
- Edit store prices

Admin-only operations must be protected.

---

## 32. PWA Rules

The app must be installable.

Required files:

```txt
manifest.json
icon-192.png
icon-512.png
apple-touch-icon.png
favicon.ico
service worker
```

PWA should support:

- Install on phone
- Install on desktop
- Offline fallback
- Cached assets
- Cached previous quiz data

Never let service worker break Supabase auth.

Be careful caching auth routes.

---

## 33. Sound System

Required sounds:

```txt
click.mp3
correct.mp3
wrong.mp3
levelup.mp3
achievement.mp3
coin.mp3
```

Rules:

- Sound must be optional
- Save soundEnabled preference
- Do not autoplay loud sounds
- Respect browser restrictions
- Keep sound files small

---

## 34. Animation Rules

Use Framer Motion for:

- Card entrance
- Answer selection
- Correct/wrong feedback
- Level up celebration
- Achievement unlock
- Store purchase animation

Animations must be:

- Smooth
- Fast
- Subtle
- Not annoying
- Mobile friendly

Avoid heavy animations that reduce performance.

---

## 35. Accessibility Rules

Every feature must be accessible.

Use:

- Proper button elements
- aria-labels
- alt text
- keyboard support
- visible focus states
- good color contrast
- text fallback for voice
- readable font sizes

Do not rely only on color to show correct/wrong answer.

Also use icons/text.

---

## 36. Error Handling

Every page must handle:

- Loading state
- Empty state
- Error state
- Offline state
- Auth missing
- Data missing
- API failure
- AI failure

Never crash the app because a value is undefined.

---

## 37. Common Runtime Errors to Prevent

Never allow:

```txt
displayName is not defined
getDisplayName is not defined
localStorage is not defined
window is not defined
duplicate key warning
hydration mismatch
Supabase env missing crash
undefined avatar
undefined player data
```

Use client components where browser APIs are needed.

---

## 38. Environment Variables

Use `.env.local` locally.

Never commit secrets.

Required:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
```

Only expose public keys with `NEXT_PUBLIC_`.

Never expose secret AI keys to the frontend.

AI calls must go through server routes or Edge Functions.

---

## 39. API Route Rules

Create API routes for:

```txt
/api/questions/generate
/api/questions/fetch
/api/daily-quiz
/api/voice
/api/leaderboard
/api/achievements
```

API routes must:

- Validate input
- Return typed JSON
- Handle errors
- Never expose secrets
- Rate limit AI generation in future

---

## 40. AI Safety Rules

AI output must be safe for families and children.

Reject:

- Adult content
- Graphic violence
- Hate
- Bullying
- Unsafe challenges
- Political persuasion
- Medical/legal/financial advice as quiz truth without sources
- Offensive jokes

For kids categories, keep wording simple and positive.

---

## 41. Admin Dashboard Future Rules

Admin should manage:

- Questions
- Categories
- Genres
- Daily quizzes
- Store items
- Achievements
- Reports
- Users
- Events

Admin routes must be protected.

Never expose admin controls to normal users.

---

## 42. Testing Rules

Before every commit, run:

```bash
npm run lint
npm run build
```

If tests exist:

```bash
npm test
```

Manual checks:

- Login works
- Logout works
- Home loads
- Quiz starts
- Answers work
- Timer works
- Result saves
- Profile shows correct name/avatar
- Avatar selection persists
- Sounds toggle works
- Mobile responsive
- PWA still installs

---

## 43. Git Rules

Use clear commits:

```txt
feat: add AI daily quiz generator
fix: resolve profile avatar fallback
refactor: move quiz logic into reusable hook
style: improve mobile quiz card layout
chore: update pwa icons
```

Do not commit:

```txt
.env.local
node_modules
.next
.vercel
AGENTS.md if the project owner wants it private
```

---

## 44. Gitignore Rules

If AGENTS.md should not be pushed to GitHub, add this to `.gitignore`:

```txt
AGENTS.md
```

If you want to keep a public lightweight version, use:

```txt
AGENTS.public.md
```

Then keep private detailed instructions in:

```txt
AGENTS.md
```

---

## 45. Deployment Rules

Deploy to Vercel.

Before deployment:

- Build locally
- Add environment variables in Vercel
- Check Supabase URL
- Check Supabase anon key
- Check OAuth redirect URLs
- Check PWA icons
- Check manifest

Supabase OAuth redirect URLs should include:

```txt
http://localhost:3000/auth/callback
https://your-vercel-domain.vercel.app/auth/callback
```

---

## 46. Definition of Done

A task is done only when:

- TypeScript passes
- Build passes
- Lint passes
- No console errors
- No runtime errors
- No hydration errors
- Mobile works
- Desktop works
- UI matches premium style
- Auth still works
- Profile still works
- Quiz still works
- PWA still works
- No secrets are committed

---

## 47. AI Coding Assistant Instructions

When using ChatGPT, Cursor, Windsurf, Claude Code, or Copilot:

Always ask the AI to:

1. Analyze the existing project first.
2. Reuse existing files where possible.
3. Avoid breaking current features.
4. Return full corrected code for every changed file.
5. Keep TypeScript safe.
6. Keep mobile responsive.
7. Test for build errors.
8. Avoid hardcoded names.
9. Avoid duplicated UI.
10. Explain exactly where each file should go.

---

## 48. Magic Prompt for AI Coding Agents

Use this prompt when asking an AI coding tool to implement features:

```txt
You are a senior Next.js 16, TypeScript, Tailwind CSS, Supabase, PWA, and AI app engineer.

You are working on Family Quiz Battle, a premium mobile-first AI-powered family quiz game.

Before coding, analyze the existing structure.

Follow AGENTS.md exactly.

Do not break current working features.

Implement the requested feature using reusable components, strict TypeScript, responsive Tailwind CSS, and production-ready code.

Return complete corrected code for every modified file.

After implementation, check for:
- TypeScript errors
- ESLint errors
- runtime errors
- hydration errors
- duplicate keys
- mobile responsiveness
- Supabase auth issues
- PWA compatibility

Feature to implement:
[WRITE FEATURE HERE]
```

---

## 49. Current Priority Roadmap

Phase 1:

- Fix auth
- Fix profile
- Fix avatar system
- Fix localStorage migration
- Improve home page
- Improve mobile UI
- Ensure PWA works

Phase 2:

- Daily Challenge
- Streak rewards
- Achievement badges
- Level progression
- Leaderboard improvements
- Better sounds

Phase 3:

- AI Daily Quiz
- Question API integration
- Supabase question cache
- Genre system
- AI explanations

Phase 4:

- Family Team Battle
- Multiplayer rooms
- Supabase Realtime
- Family leaderboard

Phase 5:

- Voice Assistant
- AI Host
- Spoken questions
- Voice answers

Phase 6:

- Achievement Store
- Inventory
- Premium avatars
- Themes
- Celebration effects

Phase 7:

- Admin dashboard
- Analytics
- Moderation
- Seasonal events
- Production security

---

## 50. Final Product Standard

Family Quiz Battle must always feel:

- Fun
- Safe
- Fast
- Beautiful
- Premium
- Family-friendly
- Educational
- Competitive
- Modern
- App-like

Every feature should make the app better for families playing together.

Do not add features that make the app confusing, unsafe, slow, or ugly.

The project owner wants beginner-friendly, complete, step-by-step, production-ready guidance.

Always explain where to put code and what command to run.

