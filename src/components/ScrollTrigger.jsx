import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSession } from "next-auth/react";

const ScrollTrigger = () => {
  const ref = useRef(null);
  const { data: session } = useSession();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Scroll progress from Framer Motion's useScroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Word "Hello" translations
  const helloTranslations = {
    en: 'Hello',
    hi: 'नमस्ते',  // Hindi
    es: 'Hola',    // Spanish
    fr: 'Bonjour', // French
    de: 'Hallo',   // German
    zh: '你好',    // Chinese
    ja: 'こんにちは', // Japanese
    ru: 'Здравствуйте', // Russian
    gu: 'હેલો', //Gujrati
    th: 'สวัสดี' //Thai
  };

  // Automatically cycle through translations
  useEffect(() => {
    const languages = Object.keys(helloTranslations);
    let index = 0;

    const intervalId = setInterval(() => {
      index = (index + 1) % languages.length;
      setCurrentLanguage(languages[index]);
    }, 1000); // Change translation every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  // Sample text
  const text = '"Every word is a step towards creativity, and every shared idea transforms drafts into masterpieces. To-gether, we write the future."';
  const letters = text.split('');

  return (
    <section className=''>
      {/* Continuously animating "Hello" with translations */}
      <h1 className="text-[2.5rem] text-blue-700 mx-10">
        {helloTranslations[currentLanguage]}, {session?.user?.name}
      </h1>

      {/* Scroll-triggered text animation */}
      <div ref={ref} className="h-[50vh] flex justify-center items-center">
        <motion.div className="flex flex-wrap max-w-[550px] justify-center">
          {letters.map((letter, index) => {
            const opacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 1]);
            const translateX = useTransform(scrollYProgress, [0, 0.25, 0.5], [0, (Math.random() * 400 - 200), 0]);
            const translateY = useTransform(scrollYProgress, [0, 0.25, 0.5], [0, (Math.random() * 400 - 200), 0]);
            const rotate = useTransform(scrollYProgress, [0, 0.25, 0.5], [0, Math.random() * 360 - 180, 0]);

            return (
              <motion.span
                key={index}
                style={{
                  opacity,
                  translateX,
                  translateY,
                  rotate,
                  display: 'inline-block',
                }}
                className="text-[1.2rem] font-black text-blue-400"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollTrigger;
