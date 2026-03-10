const foodData = [
    {
        "name": "Classic Poha",
        "description": "Light and fluffy flattened rice with peanuts and turmeric.",
        "price": 80,
        "costPrice": 30,
        "category": "Breakfast",
        "image": "https://images.unsplash.com/photo-1632761332733-89bd23e8001a?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.5
    },
    {
        "name": "Stuffed Paratha",
        "description": "Wheat flatbread stuffed with spiced mashed potatoes.",
        "price": 120,
        "costPrice": 45,
        "category": "Breakfast",
        "image": "https://images.unsplash.com/photo-1626132646522-6b99863487c9?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.7
    },
    {
        "name": "Idli Sambar",
        "description": "Steamed rice cakes served with spicy lentil soup.",
        "price": 100,
        "costPrice": 35,
        "category": "Breakfast",
        "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.6
    },
    {
        "name": "Masala Dosa",
        "description": "Crispy rice crepe with spiced potato filling.",
        "price": 150,
        "costPrice": 50,
        "category": "Breakfast",
        "image": "https://images.unsplash.com/photo-1630383249896-bc2467d8d331?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.8
    },
    {
        "name": "Chole Bhature",
        "description": "Spicy chickpeas served with fluffy deep-fried bread.",
        "price": 180,
        "costPrice": 65,
        "category": "Breakfast",
        "image": "https://images.unsplash.com/photo-1626509653295-d866b528488c?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.9
    },
    {
        "name": "Margherita Pizza",
        "description": "Classic cheese pizza with fresh tomato sauce.",
        "price": 299,
        "costPrice": 110,
        "category": "Pizza",
        "image": "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.4
    },
    {
        "name": "Farmhouse Pizza",
        "description": "Deluxe pizza with mushrooms, corn, onions, and capsicum.",
        "price": 450,
        "costPrice": 160,
        "category": "Pizza",
        "image": "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.5
    },
    {
        "name": "Spicy Paneer Pizza",
        "description": "Indian twist with tandoori paneer and green chillies.",
        "price": 499,
        "costPrice": 180,
        "category": "Pizza",
        "image": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.6
    },
    {
        "name": "Veggie Overload",
        "description": "Loaded with every fresh vegetable in the kitchen.",
        "price": 550,
        "costPrice": 200,
        "category": "Pizza",
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.7
    },
    {
        "name": "Aloo Tikki Burger",
        "description": "Crispy potato patty with mayonnaise and onions.",
        "price": 99,
        "costPrice": 35,
        "category": "Burgers",
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.2
    },
    {
        "name": "Maharaja Burger",
        "description": "Premium veg patty with layers of cheese and lettuce.",
        "price": 250,
        "costPrice": 90,
        "category": "Burgers",
        "image": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.8
    },
    {
        "name": "Cheese Lava Burger",
        "description": "Burger with a heart of melted cheese.",
        "price": 299,
        "costPrice": 110,
        "category": "Burgers",
        "image": "https://images.unsplash.com/photo-1547584385-8cd4275b68e3?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.7
    },
    {
        "name": "Dal Tadka Thali",
        "description": "Dal, two rotis, rice, salad, and a sweet.",
        "price": 220,
        "costPrice": 85,
        "category": "Lunch",
        "image": "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.5
    },
    {
        "name": "Paneer Butter Masala",
        "description": "Soft paneer cubes in a rich, creamy tomato gravy.",
        "price": 320,
        "costPrice": 120,
        "category": "Lunch",
        "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.9
    },
    {
        "name": "Veg Biryani",
        "description": "Aromatic basmati rice with vegetables and spices.",
        "price": 280,
        "costPrice": 100,
        "category": "Lunch",
        "image": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.8
    },
    {
        "name": "Shahi Paneer",
        "description": "Royal paneer dish in a golden gravy.",
        "price": 380,
        "costPrice": 140,
        "category": "Dinner",
        "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.9
    },
    {
        "name": "Dal Makhani",
        "description": "Black lentils slow-cooked overnight.",
        "price": 260,
        "costPrice": 90,
        "category": "Dinner",
        "image": "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.8
    },
    {
        "name": "Samosa (2)",
        "description": "Crispy pastries filled with spiced potatoes.",
        "price": 40,
        "costPrice": 15,
        "category": "Snacks",
        "image": "https://images.unsplash.com/photo-1601050690597-df056fb4ce99?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.3
    },
    {
        "name": "Paneer Tikka",
        "description": "Grilled paneer cubes marinated in spices.",
        "price": 280,
        "costPrice": 100,
        "category": "Snacks",
        "image": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.8
    },
    {
        "name": "Gulab Jamun (2)",
        "description": "Sweet fried dough balls in sugar syrup.",
        "price": 60,
        "costPrice": 20,
        "category": "Desserts",
        "image": "https://images.unsplash.com/photo-1589119908995-c6800ffca83e?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.9
    },
    {
        "name": "Chocolate Lava Cake",
        "description": "Warm cake with a molten center.",
        "price": 180,
        "costPrice": 70,
        "category": "Desserts",
        "image": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 5.0
    },
    {
        "name": "Mango Lassi",
        "description": "Creamy sweet mango yogurt drink.",
        "price": 90,
        "costPrice": 30,
        "category": "Drinks",
        "image": "https://images.unsplash.com/photo-1566417713940-db792042a63d?auto=format&fit=crop&w=400&h=300&q=80",
        "rating": 4.7
    }
];

export default foodData;
