import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

interface FoodItem {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
}

function NutritionTracker() {
  const { user } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([{ name: '', calories: '', protein: '', carbs: '', fats: '' }]);
  const [mealType, setMealType] = useState('breakfast');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFoodChange = (index: number, field: keyof FoodItem, value: string) => {
    const newFoods = [...foods];
    newFoods[index] = { ...newFoods[index], [field]: value };
    setFoods(newFoods);
  };

  const addFood = () => {
    setFoods([...foods, { name: '', calories: '', protein: '', carbs: '', fats: '' }]);
  };

  const removeFood = (index: number) => {
    const newFoods = foods.filter((_, i) => i !== index);
    setFoods(newFoods);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const promises = foods.map(food => 
        supabase.from('nutrition_logs').insert({
          user_id: user.id,
          meal_type: mealType,
          food_name: food.name,
          calories: parseInt(food.calories),
          protein_grams: parseFloat(food.protein),
          carbs_grams: parseFloat(food.carbs),
          fats_grams: parseFloat(food.fats)
        })
      );

      await Promise.all(promises);
      setMessage('Nutrition logged successfully!');
      setFoods([{ name: '', calories: '', protein: '', carbs: '', fats: '' }]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracker</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">
            Meal Type
          </label>
          <select
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div className="space-y-4">
          {foods.map((food, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Food name"
                  value={food.name}
                  onChange={(e) => handleFoodChange(index, 'name', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Calories"
                  value={food.calories}
                  onChange={(e) => handleFoodChange(index, 'calories', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={food.protein}
                  onChange={(e) => handleFoodChange(index, 'protein', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={food.carbs}
                  onChange={(e) => handleFoodChange(index, 'carbs', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Fats (g)"
                  value={food.fats}
                  onChange={(e) => handleFoodChange(index, 'fats', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              {foods.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFood(index)}
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
          onClick={addFood}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Food
        </button>

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
          {loading ? 'Saving...' : 'Log Nutrition'}
        </button>
      </form>
    </div>
  );
}

export default NutritionTracker;