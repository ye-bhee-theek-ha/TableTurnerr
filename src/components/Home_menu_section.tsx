"use client";

import { div } from 'framer-motion/client';
import React from 'react'

import Image from 'next/image';

import arrow from '@/../public/Svgs/Arrow.svg';
import ScrollableMenuCards from './Home_menu_card';

import placeholderImg from "@/../public/Images/Product img 1.png";
import { useSelector } from 'react-redux';
import { selectCategories, selectMenuItems, selectPopularItems } from '@/lib/slices/restaurantSlice';
import { RootState } from '@/lib/store/store';


export default function Home_menu_section() {

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
  

  const popularItems = useSelector(selectPopularItems);
  // console.log("popularItems", popularItems)

  // const MenuItems = useSelector(selectMenuItems);
  // console.log("MenuItems", MenuItems)

  // const categories = useSelector(selectCategories);
  // console.log("categories", categories)

  // const isLoading = useSelector((state: RootState) => 
  //   state.restaurant.loading
  // );
  // console.log("isLoading", isLoading)


  const handleAddToCart = (itemId: string) => {
      console.log(`Added item ${itemId} to cart`);
      // TODO: call to backend
  };
  
    const handleToggleFavorite = (itemId: string) => {
      console.log(`Toggled favorite for item ${itemId}`);
      // TODO: call to backend
    };
  
    const handleReadMore = (itemId: string) => {
      console.log(`Read more about item ${itemId}`);
      // TODO: call to backend
    };


  return (
    <div className='w-full h-[510px] rounded-l-[12px] bg-primary-dark flex flex-row p-[20px]'>
			
			<div className='h-full flex px-[8px] py-[26px] flex-col'>
				<div className='text-h3 text-white text-start leading-[1.2]'>
					Trending
					<br />
					Taiwanese
					<br />
					cusine
				</div>
				<div className='text-white/50 text-normal1 mt-[5px]'>
					Treat yourself to our must-try list that has everyone talking.
				</div>

				<div className='flex-1'/>
				
				<div className='text-normal3 text-white'>
					Scroll through to explore our dishes.
				</div>
				<div className=''>
					<Image
						src={arrow}
						alt="Arrow"
						className="w-[24px] h-[24px] mt-[10px] cursor-pointer"
					/>
				</div>
			</div>

			<div className='overflow-x-hidden'>
				<ScrollableMenuCards
					items={popularItems}
					onAddToCart={handleAddToCart}
					onToggleFavorite={handleToggleFavorite}
					onReadMore={handleReadMore}
				/>
			</div>
    </div>
)
}
