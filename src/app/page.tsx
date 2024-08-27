'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Brush, Text, Wrench, ChevronRight, Code } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [currentInstruction, setCurrentInstruction] = useState(0)

  const instructions = [
    {
      icon: Brush,
      title: 'Drawing Operations',
      description: 'Create stunning visuals with basic shapes and lines',
      items: [
        { name: 'putpixel', description: 'Place a single pixel on the canvas' },
        { name: 'line', description: 'Draw a straight line between two points' },
        { name: 'circle', description: 'Create perfect circles with ease' },
        { name: 'rectangle', description: 'Draw rectangles and squares' },
        { name: 'bar', description: 'Create filled rectangles for solid areas' },
        { name: 'ellipse', description: 'Draw ellipses and ovals' },
        { name: 'arc', description: 'Create circular arcs and curves' },
        { name: 'fillpoly', description: 'Draw and fill complex polygons' },
        { name: 'floodfill', description: 'Fill enclosed areas with color' }
      ]
    },
    {
      icon: Text,
      title: 'Text Operations',
      description: 'Add and style text in your graphics',
      items: [
        { name: 'outtextxy', description: 'Place text at specific coordinates' },
        { name: 'settextstyle', description: 'Customize font, size, and direction' }
      ]
    },
    {
      icon: Wrench,
      title: 'Utilities',
      description: 'Essential tools for managing your canvas',
      items: [
        { name: 'cleardevice', description: 'Clear the entire drawing area' },
        { name: 'setcolor', description: 'Change the current drawing color' },
        { name: 'setfillstyle', description: 'Set fill pattern and color' }
      ]
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInstruction((prev) => (prev + 1) % instructions.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#1E1E1E] text-[#D4D4D4]">
      <header className="bg-[#252526] text-[#D4D4D4] p-6 flex justify-between items-center shadow-lg">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold flex items-center"
        >
          <Brush className="mr-3 text-[#4EC9B0]" /> Borland Graphics Simulator
        </motion.h1>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center p-12 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center z-10 max-w-4xl mx-auto"
        >
          <h2 className="text-6xl font-semibold mb-8 text-[#4EC9B0]">
            Welcome to the Graphics Simulator
          </h2>
          <p className="text-xl mb-12 text-[#9CDCFE] max-w-2xl mx-auto">
            Dive into the world of digital artistry and programming. Create, explore, and bring your ideas to life with our powerful graphics toolkit.
          </p>
          <Button
            className="px-8 py-4 bg-[#007ACC] text-white rounded-full hover:bg-[#005A9E] transition duration-300 text-xl shadow-lg group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push('/simulator')}
          >
            <span className="mr-2">Launch Graphics Editor</span>
            <ChevronRight className={`inline-block transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''} group-hover:translate-x-2`} />
          </Button>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#4EC9B0] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-[#9CDCFE] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-[#C586C0] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
      </main>

      <section className="py-16 px-6 bg-[#252526]">
        <h2 className="text-4xl font-bold mb-12 text-center text-[#4EC9B0]">Usage Instructions</h2>
        <div className="max-w-7xl mx-auto">
          {instructions.map((instruction, index) => (
            <motion.div
              key={instruction.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-[#2D2D2D] border-none flex flex-col mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-[#4EC9B0]">
                    <instruction.icon className="mr-3 h-6 w-6" />
                    {instruction.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-[#9CDCFE] mb-4">{instruction.description}</p>
                  <ul className="space-y-3">
                    {instruction.items.map((item) => (
                      <li key={item.name} className="flex items-start">
                        <Code className="mr-2 h-5 w-5 text-[#DCDCAA] flex-shrink-0 mt-1" />
                        <div>
                          <code className="text-[#CE9178]">{item.name}</code>
                          <p className="text-sm text-[#9CDCFE] mt-1">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>


      <footer className="bg-[#252526] text-[#D4D4D4] p-6 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Borland Graphics Simulator. Empowering digital creativity.
        </p>
      </footer>
    </div>
  )
}