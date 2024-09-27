// App.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

function FoodManager({ addFood }) {
  const [name, setName] = useState('');
  const [caloriesPerGram, setCaloriesPerGram] = useState('');
  const [proteinPerGram, setProteinPerGram] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && caloriesPerGram && proteinPerGram) {
      const food = {
        name,
        caloriesPerGram: parseFloat(caloriesPerGram),
        proteinPerGram: parseFloat(proteinPerGram),
      };
      addFood(food);
      setName('');
      setCaloriesPerGram('');
      setProteinPerGram('');
    }
  };

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add Food
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Food Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: 2 }}
          required
        />
        <TextField
          label="Calories per Gram"
          type="number"
          variant="outlined"
          fullWidth
          value={caloriesPerGram}
          onChange={(e) => setCaloriesPerGram(e.target.value)}
          sx={{ marginBottom: 2 }}
          required
        />
        <TextField
          label="Protein per Gram"
          type="number"
          variant="outlined"
          fullWidth
          value={proteinPerGram}
          onChange={(e) => setProteinPerGram(e.target.value)}
          sx={{ marginBottom: 2 }}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Food
        </Button>
      </form>
    </Box>
  );
}

function DailyIntake({ foods }) {
  const [dailyFood, setDailyFood] = useState(() => {
    const storedDailyIntake = JSON.parse(localStorage.getItem('dailyIntake')) || [];
    return storedDailyIntake;
  });
  const [selectedFood, setSelectedFood] = useState('');
  const [grams, setGrams] = useState('');

  // Save daily intake to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dailyIntake', JSON.stringify(dailyFood));
  }, [dailyFood]);

  const addDailyFood = () => {
    const food = foods.find((f) => f.name === selectedFood);
    if (food && grams) {
      const intake = {
        name: food.name,
        grams: parseFloat(grams),
        calories: food.caloriesPerGram * grams,
        protein: food.proteinPerGram * grams,
      };
      setDailyFood([...dailyFood, intake]);
      setGrams('');
    }
  };

  const resetDailyIntake = () => {
    setDailyFood([]);
    localStorage.removeItem('dailyIntake'); // Clear from localStorage as well
  };

  const totalCalories = dailyFood.reduce((acc, item) => acc + item.calories, 0);
  const totalProtein = dailyFood.reduce((acc, item) => acc + item.protein, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Daily Intake
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Select Food</InputLabel>
        <Select value={selectedFood} onChange={(e) => setSelectedFood(e.target.value)}>
          {foods.map((food) => (
            <MenuItem key={food.name} value={food.name}>
              {food.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Grams"
        type="number"
        variant="outlined"
        fullWidth
        value={grams}
        onChange={(e) => setGrams(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={addDailyFood} sx={{ marginBottom: 4 }}>
        Add
      </Button>
      <Button variant="outlined" color="secondary" onClick={resetDailyIntake} sx={{ marginBottom: 4 }}>
        Reset Daily Intake
      </Button>

      <Typography variant="h5" gutterBottom>
        Today's Intake
      </Typography>
      <List>
        {dailyFood.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${item.grams}g ${item.name}`}
              secondary={`Calories: ${item.calories.toFixed(2)}, Protein: ${item.protein.toFixed(2)}g`}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">
        Total Calories: {totalCalories.toFixed(2)}
      </Typography>
      <Typography variant="h6">
        Total Protein: {totalProtein.toFixed(2)}g
      </Typography>
    </Box>
  );
}

function App() {
  const [foods, setFoods] = useState(() => {
    const storedFoods = JSON.parse(localStorage.getItem('foods')) || [];
    return storedFoods;
  });

  // Save foods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('foods', JSON.stringify(foods));
  }, [foods]);

  const addFood = (food) => {
    setFoods([...foods, food]);
  };

  return (
    <Container sx={{ paddingTop: 4 }}>
      <Typography variant="h2" gutterBottom align="center">
        Calorie and Protein Counter
      </Typography>
      <FoodManager addFood={addFood} />
      <DailyIntake foods={foods} />
    </Container>
  );
}

export default App;