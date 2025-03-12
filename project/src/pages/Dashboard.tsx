import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ProgressData {
  track_date: string;
  weight: number;
}

interface NutritionSummary {
  total_calories: number;
  total_protein: number;
}

function Dashboard() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [nutritionSummary, setNutritionSummary] = useState<NutritionSummary>({ total_calories: 0, total_protein: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch progress data
        const { data: progressData } = await supabase
          .from('progress_tracking')
          .select('track_date, weight')
          .order('track_date', { ascending: true })
          .limit(10);

        if (progressData) {
          setProgressData(progressData);
        }

        // Fetch today's nutrition summary
        const today = new Date().toISOString().split('T')[0];
        const { data: nutritionData } = await supabase
          .from('nutrition_logs')
          .select('calories, protein_grams')
          .eq('user_id', user.id)
          .gte('log_date', today);

        if (nutritionData) {
          const totalCalories = nutritionData.reduce((sum, item) => sum + (item.calories || 0), 0);
          const totalProtein = nutritionData.reduce((sum, item) => sum + (item.protein_grams || 0), 0);
          setNutritionSummary({ total_calories: totalCalories, total_protein: totalProtein });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Today's Nutrition</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total Calories</p>
              <p className="text-2xl font-bold">{nutritionSummary.total_calories}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Protein</p>
              <p className="text-2xl font-bold">{nutritionSummary.total_protein}g</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Weight Progress</h2>
          {progressData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="track_date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                    formatter={(value) => [`${value} lbs`, 'Weight']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="weight" 
                    fill="#2563eb" 
                    name="Weight (lbs)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-600">No weight data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;