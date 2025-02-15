'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { motion } from 'framer-motion'
import { Brush, ChevronRight, Code, Text, Wrench, Cpu, Palette, Maximize2, Type, Shield, Terminal, Clock, PaletteIcon, EyeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const instructions = [
    {
      icon: Brush,
      title: 'Drawing Operations',
      description: 'Create stunning visuals with basic shapes and lines',
      items: [
        { name: 'putpixel(x, y, color)', description: 'Place a single pixel on the canvas.' },
        { name: 'line(x1, y1, x2, y2)', description: 'Draw a straight line between two points.' },
        { name: 'circle(x, y, radius)', description: 'Create perfect circles with ease.' },
        { name: 'rectangle(left, top, right, bottom)', description: 'Draw rectangles and squares.' },
        { name: 'bar(left, top, right, bottom)', description: 'Create filled rectangles for solid areas.' },
        { name: 'ellipse(x, y, startAngle, endAngle, xRadius, yRadius)', description: 'Draw ellipses and ovals.' },
        { name: 'arc(x, y, startAngle, endAngle, radius)', description: 'Create circular arcs and curves.' },
        { name: 'fillpoly(numPoints, points)', description: 'Draw and fill complex polygons.' },
      ]
    },
    {
      icon: Text,
      title: 'Text Operations & Styles',
      description: 'Add and style text in your graphics',
      items: [
        { name: 'outtextxy(x, y, text)', description: 'Place text at specific coordinates.' },
        { name: 'settextstyle(font, direction, size)', description: 'Customize font, size, and direction.' },
        { name: 'HORIZ_DIR, VERT_DIR', description: 'Text direction constants (0 for horizontal, 1 for vertical).' },
        { name: 'LEFT_TEXT, CENTER_TEXT, RIGHT_TEXT', description: 'Text alignment constants.' },
        { name: 'DEFAULT_FONT, TRIPLEX_FONT, SMALL_FONT, SANS_SERIF_FONT, etc.', description: 'Font type constants.' }
      ]
    },
    {
      icon: Wrench,
      title: 'Utilities',
      description: 'Essential tools for managing your canvas',
      items: [
        { name: 'cleardevice()', description: 'Clear the entire drawing area and fill it with black.' },
        { name: 'setcolor(color)', description: 'Change the current drawing color based on the color palette.' },
        { name: 'setfillstyle(active, color)', description: 'Set fill pattern (0 for empty, 1 for solid) and color.' },
        { name: 'EMPTY_FILL', description: 'Set fill pattern to empty, i.e., no fill.' },
        { name: 'SOLID_FILL', description: 'Set fill pattern to solid, i.e., solid fill.' },
      ]
    },
    {
      icon: Cpu,
      title: 'System Functions',
      description: 'Initialize and manage the graphics system',
      items: [
        { name: 'initgraph(gd, gm, path)', description: 'Initialize the graphics system with specified driver and mode.' },
        { name: 'closegraph()', description: 'Close the graphics window and cleanup.' },
        { name: 'detectgraph(gd, gm)', description: 'Detect the graphics driver and mode.' }
      ]
    },
    {
      icon: Palette,
      title: 'Color Management',
      description: 'Work with colors and palettes',
      items: [
        { name: 'getpixel(x, y)', description: 'Get the color index of a pixel at (x, y).' },
        { name: 'BLACK, RED, BLUE, GREEN, CYAN, MAGENTA, BROWN, LIGHTGRAY, DARKGRAY, LIGHTBLUE, LIGHTGREEN, LIGHTCYAN, LIGHTRED, LIGHTMAGENTA, YELLOW, WHITE', description: 'All 15 standard colors supported.' }
      ]
    },
    {
      icon: Maximize2,
      title: 'Dimensions',
      description: 'Get information about the drawing area',
      items: [
        { name: 'getmaxx()', description: 'Get the maximum X-coordinate of the canvas.' },
        { name: 'getmaxy()', description: 'Get the maximum Y-coordinate of the canvas.' },
        { name: 'maxX, maxY', description: 'Constants for maximum coordinates (640, 480).' }
      ]
    },
    {
      icon: EyeIcon,
      title: 'Graphics Modes',
      description: 'Constants and modes for graphics settings',
      items: [
        { name: 'gd', description: 'Graphics driver variable, default is 0.' },
        { name: 'gm', description: 'Graphics mode variable, default is 0.' },
        { name: 'DETECT', description: 'Graphics detection mode, default is 0.' },
        { name: '_fillmode', description: 'Toggle for fill mode, default is false.' }
      ]
    },
    {
      icon: PaletteIcon,
      title: 'Color Palette',
      description: 'Access to a predefined palette of colors',
      items: [
        { name: 'colorPalette', description: 'Array of RGB color strings (16 standard colors).' },
        { name: 'NORM_WIDTH, THICK_WIDTH', description: 'Constants for line thickness (1 and 3).' }
      ]
    },
    {
      icon: Clock,
      title: 'Delays and Timing',
      description: 'Control timing in the graphics system',
      items: [
        { name: 'delay(ms)', description: 'Pause execution for specified milliseconds.' },
        { name: 'sleep(s)', description: 'Pause execution for specified seconds.' }
      ]
    },
    {
      icon: Terminal,
      title: 'Terminal Operations',
      description: 'Manage terminal input and output',
      items: [
        { name: 'terminal(text)', description: 'Output text to terminal.' },
        { name: 'scanf(text)', description: 'Prompt user for input and return it.' },
        { name: 'printf(text, ...args)', description: 'Print formatted text to terminal.' }
      ]
    },
    {
      icon: Shield,
      title: 'Abort Management',
      description: 'Handle execution abortion',
      items: [
        { name: 'checkAbort()', description: 'Check if execution is aborted and throw an error if so.' }
      ]
    }
  ];
  

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
          className="text-center z-10 max-w-4xl mx-auto h-[60vh]"
        >
          <h2 className="text-6xl font-semibold mb-8 text-[#4EC9B0] mt-24">
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

      <motion.div
        className="py-16 px-6 bg-[#252526]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0 }}
      >
        <h2 id="reference" className="text-4xl font-bold mb-12 text-center text-[#4EC9B0]">Graphics Library Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {instructions.map((instruction, index) => (
            <motion.div
              key={instruction.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-[#2D2D2D] border-none h-full flex flex-col">
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
      </motion.div>

      <footer className="bg-[#252526] text-[#D4D4D4] p-6 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} | Sujal Choudhari
        </p>
      </footer>
    </div>
  )
}