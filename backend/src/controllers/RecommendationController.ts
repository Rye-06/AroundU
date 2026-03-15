import { Request, Response } from 'express';
import { supabase } from '../supabase.js';
import { spawn } from 'child_process';
import { existsSync, promises as fs } from 'fs';
import path from 'path';

const MIN_VISIBLE_MATCH_SCORE = 0.65;

type GenAiUser = {
  name: string;
  user_profile?: {
    year_of_study?: number;
    major?: string;
    interests?: string[];
    class?: string[];
    club?: string[];
    age?: number;
    gender?: string;
    mbti?: string;
    mood?: string;
    fitness?: string;
    personality?: {
      extroversion?: number;
      group_preference?: string;
      energy_level?: string;
    };
  };
};

function normalizeKey(value: string): string {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

function clampScore(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function toTitle(value?: string): string {
  const text = String(value || '').trim();
  if (!text) return 'unknown';
  return text
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function findPythonScriptPath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'genai', 'genai_final.py'),
    path.resolve(process.cwd(), '..', 'genai', 'genai_final.py'),
  ];

  const match = candidates.find(candidate => existsSync(candidate));
  if (!match) {
    throw new Error('Could not locate genai/genai_final.py');
  }

  return match;
}

function findUsersJsonPath(): string {
  const candidates = [
    path.resolve(process.cwd(), 'genai', 'users.json'),
    path.resolve(process.cwd(), '..', 'genai', 'users.json'),
  ];

  const match = candidates.find(candidate => existsSync(candidate));
  if (!match) {
    throw new Error('Could not locate genai/users.json');
  }

  return match;
}

async function runGenAiCompatibility(currentUserName: string, users: GenAiUser[]): Promise<Record<string, { final_score?: number }>> {
  const pythonCommand = process.env.PYTHON_BIN || 'python';
  const scriptPath = findPythonScriptPath();
  const payload = JSON.stringify({
    current_user_name: currentUserName,
    users,
  });

  return new Promise((resolve, reject) => {
    const child = spawn(pythonCommand, [scriptPath, '--stdin'], {
      cwd: process.cwd(),
      env: process.env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });

    child.on('error', err => {
      reject(err);
    });

    child.on('close', code => {
      if (code !== 0) {
        reject(new Error(stderr || `genai_final.py exited with code ${code}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout.trim()) as Record<string, { final_score?: number }>;
        resolve(parsed);
      } catch {
        reject(new Error(`Invalid genai_final.py output: ${stdout}`));
      }
    });

    child.stdin.write(payload);
    child.stdin.end();
  });
}

async function loadGenAiUsersFromDb(): Promise<GenAiUser[]> {
  const { data: users, error: usersError } = await supabase.from('users').select('id, name');
  if (usersError) {
    throw usersError;
  }

  if (!users || users.length === 0) {
    return [];
  }

  const userIds = users.map(u => u.id);

  const [profilesResult, userClassesResult, classesResult, userClubsResult, clubsResult, userInterestsResult, interestsResult] =
    await Promise.all([
      supabase
        .from('user_profiles')
        .select('user_id, year_of_study, major, mbti, mood, fitness, extroversion, group_preference, energy_level')
        .in('user_id', userIds),
      supabase.from('user_classes').select('user_id, class_id').in('user_id', userIds),
      supabase.from('classes').select('id, name'),
      supabase.from('user_clubs').select('user_id, club_id').in('user_id', userIds),
      supabase.from('clubs').select('id, name'),
      supabase.from('user_interests').select('user_id, interest_id').in('user_id', userIds),
      supabase.from('interests').select('id, name'),
    ]);

  if (profilesResult.error) throw profilesResult.error;
  if (userClassesResult.error) throw userClassesResult.error;
  if (classesResult.error) throw classesResult.error;
  if (userClubsResult.error) throw userClubsResult.error;
  if (clubsResult.error) throw clubsResult.error;
  if (userInterestsResult.error) throw userInterestsResult.error;
  if (interestsResult.error) throw interestsResult.error;

  const profilesByUser = new Map((profilesResult.data || []).map(profile => [profile.user_id, profile]));
  const classNameById = new Map((classesResult.data || []).map(row => [row.id, row.name]));
  const clubNameById = new Map((clubsResult.data || []).map(row => [row.id, row.name]));
  const interestNameById = new Map((interestsResult.data || []).map(row => [row.id, row.name]));

  const classesByUser = new Map<string, string[]>();
  for (const row of userClassesResult.data || []) {
    const className = classNameById.get(row.class_id);
    if (!className) continue;
    const current = classesByUser.get(row.user_id) || [];
    current.push(className);
    classesByUser.set(row.user_id, current);
  }

  const clubsByUser = new Map<string, string[]>();
  for (const row of userClubsResult.data || []) {
    const clubName = clubNameById.get(row.club_id);
    if (!clubName) continue;
    const current = clubsByUser.get(row.user_id) || [];
    current.push(clubName);
    clubsByUser.set(row.user_id, current);
  }

  const interestsByUser = new Map<string, string[]>();
  for (const row of userInterestsResult.data || []) {
    const interestName = interestNameById.get(row.interest_id);
    if (!interestName) continue;
    const current = interestsByUser.get(row.user_id) || [];
    current.push(interestName);
    interestsByUser.set(row.user_id, current);
  }

  return users.map(user => {
    const profile = profilesByUser.get(user.id);

    return {
      name: user.name,
      user_profile: {
        year_of_study: profile?.year_of_study ?? 1,
        major: profile?.major ?? 'Undeclared',
        age: 18,
        gender: 'unspecified',
        mbti: profile?.mbti ?? 'INTP',
        mood: profile?.mood ?? 'neutral',
        fitness: profile?.fitness ?? 'moderate',
        class: classesByUser.get(user.id) || [],
        club: clubsByUser.get(user.id) || [],
        interests: interestsByUser.get(user.id) || [],
        personality: {
          extroversion: profile?.extroversion ?? 5,
          group_preference: profile?.group_preference ?? 'medium_group',
          energy_level: profile?.energy_level ?? 'moderate',
        },
      },
    };
  });
}

async function loadGenAiUsersFromJson(): Promise<GenAiUser[]> {
  const filePath = findUsersJsonPath();
  const raw = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('users.json is not an array');
  }

  return parsed as GenAiUser[];
}

function buildMatches(users: GenAiUser[], activeUserName: string, scoreMap: Record<string, { final_score?: number }>) {
  const activeUserKey = normalizeKey(activeUserName);

  return users
    .filter(user => normalizeKey(user.name) !== activeUserKey)
    .map(user => {
      const key = normalizeKey(user.name);
      const aiScore = clampScore(Number(scoreMap[user.name]?.final_score ?? 0));
      const score = Number(aiScore.toFixed(2));
      const profile = user.user_profile || {};

      return {
        username: key,
        name: user.name,
        avatar: `https://picsum.photos/seed/${key}/120/120`,
        year: profile.year_of_study ?? null,
        major: profile.major ?? 'Unknown',
        interests: Array.isArray(profile.interests) ? profile.interests : [],
        sharedClasses: Array.isArray(profile.class) ? profile.class : [],
        sharedClubs: Array.isArray(profile.club) ? profile.club : [],
        groupPreference: toTitle(profile.personality?.group_preference),
        energyLevel: toTitle(profile.personality?.energy_level),
        aiReason: `Compatibility score from genai_final.py compared with ${activeUserName}.`,
        rating: score,
        isTopMatch: false,
      };
    })
    .filter(match => match.rating > MIN_VISIBLE_MATCH_SCORE)
    .sort((a, b) => b.rating - a.rating);
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('recommendations').select('*');
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('recommendations').select('*').eq('id', id).single();
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getBuddyMatches = async (req: Request, res: Response) => {
  try {
    const users = await loadGenAiUsersFromDb();
    if (users.length === 0) {
      return res.json({ data: [] });
    }

    const activeUserName = String(req.query.for || 'Jennifer');
    const activeUserKey = normalizeKey(activeUserName);

    const hasCurrentUser = users.some(user => normalizeKey(user.name) === activeUserKey);
    if (!hasCurrentUser) {
      return res.json({ data: [] });
    }

    const scoreMap = await runGenAiCompatibility(activeUserName, users);

    const matches = buildMatches(users, activeUserName, scoreMap);

    res.json({ data: matches });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsersJson = async (req: Request, res: Response) => {
  try {
    const users = await loadGenAiUsersFromJson();
    res.json({ data: users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getBuddyMatchesJson = async (req: Request, res: Response) => {
  try {
    const users = await loadGenAiUsersFromJson();
    if (users.length === 0) {
      return res.json({ data: [] });
    }

    const activeUserName = String(req.query.for || 'Jennifer');
    const activeUserKey = normalizeKey(activeUserName);

    const hasCurrentUser = users.some(user => normalizeKey(user.name) === activeUserKey);
    if (!hasCurrentUser) {
      return res.json({ data: [] });
    }

    const scoreMap = await runGenAiCompatibility(activeUserName, users);
    const matches = buildMatches(users, activeUserName, scoreMap);

    res.json({ data: matches });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('recommendations').insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('recommendations').update(req.body).eq('id', id).select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('recommendations').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
