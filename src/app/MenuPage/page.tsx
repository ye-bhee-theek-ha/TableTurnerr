"use client";

import Header from '@/components/Header';
import MenuCards from '@/components/MenuPage_menu_cards';
import MenuPage_Menu_Section from '@/components/MenuPage_menu_section';
import React from 'react'

function Menu() {

  

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      
      <Header />
      <div className="h-[40px]" />
      
      <MenuPage_Menu_Section/>
    </div>
  )
}

export default Menu