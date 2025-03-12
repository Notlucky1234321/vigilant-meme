/*
  # Initial Schema for Fitness Tracking Application

  1. New Tables
    - users (handled by Supabase Auth)
    - user_profiles
      - Stores user-specific information like goals, weight, height
    - workouts
      - Logs workout sessions with type, duration, intensity
    - nutrition_logs
      - Tracks daily food intake, calories, and macros
    - progress_tracking
      - Records weight, measurements, and progress photos
    
  2. Security
    - Enable RLS on all tables
    - Policies to ensure users can only access their own data
*/

-- User Profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  goal TEXT NOT NULL DEFAULT 'bulking',
  target_calories INT NOT NULL DEFAULT 3000,
  target_protein INT NOT NULL DEFAULT 180,
  current_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  height DECIMAL(5,2),
  activity_level TEXT DEFAULT 'moderate',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  workout_type TEXT NOT NULL,
  duration_minutes INT NOT NULL,
  exercises JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Nutrition logs table
CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL,
  food_name TEXT NOT NULL,
  calories INT NOT NULL,
  protein_grams DECIMAL(5,2) NOT NULL,
  carbs_grams DECIMAL(5,2) NOT NULL,
  fats_grams DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Progress tracking table
CREATE TABLE progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  track_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight DECIMAL(5,2),
  chest_cm DECIMAL(5,2),
  waist_cm DECIMAL(5,2),
  arms_cm DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own profile"
  ON user_profiles
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage their own workouts"
  ON workouts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own nutrition logs"
  ON nutrition_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress tracking"
  ON progress_tracking
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);