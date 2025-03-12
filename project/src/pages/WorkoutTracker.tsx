import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

function WorkoutTracker() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '', sets: '', reps: '', weight: '' }]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
  };

  const removeExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('workouts').insert({
        user_id: user.id,
        exercises,
        notes,
      });

      if (error) throw error;

      setMessage('Workout logged successfully!');
      setExercises([{ name: '', sets: '', reps: '', weight: '' }]);
      setNotes('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Workout Tracker</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Exercise name"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Weight (lbs)"
                  value={exercise.weight}
                  onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              {exercises.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExercise(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addExercise}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Exercise
        </button>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {message && (
          <div className={`p-4 rounded-md ${message.includes('error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Log Workout'}
        </button>
      </form>
    </div>
  );
}

export default WorkoutTracker;