// AnimatedMenuButton.client.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface MenuItem {
  name: string;
  href: string;
}

interface AnimatedMenuButtonProps {
  menuItems: MenuItem[];
}

export function AnimatedMenuButton({ menuItems }: AnimatedMenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  // Variants for button animation
  const topLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: 45, translateY: 2 }
  };

  const bottomLineVariants = {
    closed: { rotate: 0, translateY: 0 },
    open: { rotate: -45, translateY: -3.5 }
  };

  // Variants for menu animation
  const menuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      opacity: 1,
      height: "auto",
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05,
        staggerDirection: 1
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Button */}
      <button 
        className="w-10 h-[14px] flex flex-col justify-evenly bg-transparent border-none cursor-pointer p-0 z-100"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <motion.div
          className="w-[24px] h-[1.75px] bg-black rounded-full"
          variants={topLineVariants}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-[24px] h-[1.75px] bg-black rounded-full"
          variants={bottomLineVariants}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
      </button>

      {/* Menu Items */}
      <motion.div
        className="w-fit top-15 left-5  mt-2 absolute bg-white rounded-lg shadow-lg overflow-hidden z-100"
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            className="py-2 px-8 text-normal4 hover:bg-gray-100 cursor-pointer"
            variants={menuItemVariants}
            onClick={() => navigateTo(item.href)}
          >
            {item.name}
            {/* <div className='w-[80%] h-[1px] bg-grey'/> */}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}