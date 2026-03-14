import { Request, Response } from 'express';
import { supabase } from '../supabase.js';
import { randomUUID } from 'crypto';

export const getAll = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const {id } = req.params;
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, bio, profile, classes, clubs, interests } = req.body;

    // 1. Create the base user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({ id: randomUUID(), name, bio } )
      .select('id')
      .single();

    if (userError) throw userError;
    const userId = newUser.id;

    // 2. Create the user profile
    if (profile) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          year_of_study: profile.year_of_study,
          major: profile.major,
          mbti: profile.mbti,
          mood: profile.mood,
          fitness: profile.fitness,
          extroversion: profile.extroversion,
          group_preference: profile.group_preference,
          energy_level: profile.energy_level
        });
      
      if (profileError) throw profileError;
    }

    // 3 & 4. Insert and link classes
    if (classes && Array.isArray(classes) && classes.length > 0) {
      await supabase.from('classes').upsert(
        classes.map((cName: string) => ({ name: cName })),
        { onConflict: 'name', ignoreDuplicates: true }
      );
      
      const { data: classData, error: classSelectError } = await supabase
        .from('classes')
        .select('id')
        .in('name', classes);

      if (classSelectError) throw classSelectError;

      if (classData && classData.length > 0) {
        const userClasses = classData.map(c => ({ user_id: userId, class_id: c.id }));
        const { error: userClassesError } = await supabase.from('user_classes').insert(userClasses);
        if (userClassesError) throw userClassesError;
      }
    }

    // 5 & 6. Insert and link clubs
    if (clubs && Array.isArray(clubs) && clubs.length > 0) {
      await supabase.from('clubs').upsert(
        clubs.map((cName: string) => ({ name: cName })),
        { onConflict: 'name', ignoreDuplicates: true }
      );
      
      const { data: clubData, error: clubSelectError } = await supabase
        .from('clubs')
        .select('id')
        .in('name', clubs);

      if (clubSelectError) throw clubSelectError;

      if (clubData && clubData.length > 0) {
        const userClubs = clubData.map(c => ({ user_id: userId, club_id: c.id }));
        const { error: userClubsError } = await supabase.from('user_clubs').insert(userClubs);
        if (userClubsError) throw userClubsError;
      }
    }

    // 7 & 8. Insert and link interests
    if (interests && Array.isArray(interests) && interests.length > 0) {
      await supabase.from('interests').upsert(
        interests.map((iName: string) => ({ name: iName })),
        { onConflict: 'name', ignoreDuplicates: true }
      );
      
      const { data: interestData, error: interestSelectError } = await supabase
        .from('interests')
        .select('id')
        .in('name', interests);

      if (interestSelectError) throw interestSelectError;

      if (interestData && interestData.length > 0) {
        const userInterests = interestData.map(i => ({ user_id: userId, interest_id: i.id }));
        const { error: userInterestsError } = await supabase.from('user_interests').insert(userInterests);
        if (userInterestsError) throw userInterestsError;
      }
    }

    res.status(201).json({
      message: 'User profile created successfully',
      data: { id: userId, name }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('users').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
