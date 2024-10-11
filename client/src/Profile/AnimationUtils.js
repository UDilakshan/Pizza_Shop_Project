
export const staggerFadeInOut = (index) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5, delay: index * 0.1 }
  });
  
  export const buttonClick = {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 }
  };
  