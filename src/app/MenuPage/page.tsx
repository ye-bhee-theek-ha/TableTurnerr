"use client";

import MenuCards from '@/components/MenuPage_menu_card';
import React from 'react'

function Menu() {
  interface MenuItem {
    id: string;
    name: string;
    image: string;
    priceM: number;
    priceL: number;
    loyaltyPoints: number;
    description: string;
    tags: string[];
    isFavorite?: boolean;
  }
	
  const trendingItems: MenuItem[] = [
    {
      id: '1',
      name: 'Popcorn Chicken',
      image: '/images/popcorn-chicken.jpg',
      priceM: 9.95,
      priceL: 12.95, // Added large size price
      loyaltyPoints: 45,
      description: 'Crispy bite-sized chicken pieces with a golden crust.',
      tags: ['chicken', 'spice level 1 to 5'],
      isFavorite: false,
    },
    {
      id: '2',
      name: "Chef's Special Spicy Broth",
      image: '/images/spicy-broth.jpg',
      priceM: 19.95,
      priceL: 24.95, // Added large size price
      loyaltyPoints: 25,
      description: 'A fiery broth infused with special spices, perfect for spice lovers.',
      tags: ['chicken', 'spice level 1 to 5', '+ 5.00 Meat', '+ 2.00 Egg'],
      isFavorite: false,
    },
    {
      id: '3',
      name: 'Fried Tofu',
      image: '/images/fried-tofu.jpg',
      priceM: 11.95,
      priceL: 14.95, // Added large size price
      loyaltyPoints: 55,
      description: 'Deliciously crispy on the outside, soft on the inside tofu.',
      tags: ['tofu'],
      isFavorite: true,
    },
    {
      id: '4',
      name: 'Beef Noodle Soup',
      image: '/images/beef-noodle.jpg',
      priceM: 14.95,
      priceL: 18.95, // Added large size price
      loyaltyPoints: 35,
      description: 'Hearty beef slices in a savory noodle soup.',
      tags: ['beef', 'spice level 1 to 3'],
      isFavorite: false,
    },
    {
      id: '5',
      name: 'Vegetable Dumplings',
      image: '/images/veg-dumplings.jpg',
      priceM: 8.95,
      priceL: 10.95, // Added large size price
      loyaltyPoints: 30,
      description: 'Steamed dumplings filled with fresh vegetables.',
      tags: ['vegetarian', 'gluten'],
      isFavorite: false,
    },
  ];
  

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      
      <MenuCards
        title="Trending Items"
        items={trendingItems}
        onReadMore={(id) => console.log(`Read more about item ${id}`)}
        onAddToCart={(id) => console.log(`Added item ${id} to cart`)}
        onToggleFavorite={(id) => console.log(`Toggled favorite for item ${id}`)}
      />

    </div>
  )
}

export default Menu