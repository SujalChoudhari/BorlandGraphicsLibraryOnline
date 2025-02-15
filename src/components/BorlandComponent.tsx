"use client";
import { graphicsLibDefinitions } from '@/app/libraryDefination';
import { templates } from '@/app/templates';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Editor from '@monaco-editor/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Edit2, HelpCircle, Maximize2, Minimize2, Pause, Play, Terminal, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';



const BorlandGraphicsSimulator = () => {

    const [code, setCode] = useState<string>(`
// Draw Axis
let originX = maxX /2;
let originY = maxY /2;
line(0,originY,maxX,originY);
line(originX,0,originX,maxY);

// your code here

`);


    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [terminal, setTerminal] = useState<string>('');
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
    const [isMagnified, setIsMagnified] = useState(false)
    const magnifiedCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRunning, setIsRunning] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);


    const handleTemplateSelect = (index: string) => {
        setCode(templates[parseInt(index)].code);
    }

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen)
    }

    useEffect(() => {
        // load code from local storage
        const storedCode = localStorage.getItem('code');
        if (storedCode) {
            setCode(storedCode);
        }
    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, 640, 480);
            }
        }

    }, []);

    useEffect(() => {
        if (isMagnified && canvasRef.current && magnifiedCanvasRef.current) {
            const ctx = magnifiedCanvasRef.current.getContext('2d')
            if (ctx) {
                ctx.drawImage(canvasRef.current, 0, 0, 640, 480, 0, 0, magnifiedCanvasRef.current.width, magnifiedCanvasRef.current.height)
            }
        }
    }, [isMagnified])

    const runCode = async () => {
        // save code to local storage
        localStorage.setItem('code', code);


        setError('');
        setOutput('');
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, 640, 480);
            ctx.strokeStyle = 'white';
        }

        const graphicsLib = {
            gd: 0,
            gm: 0,
            maxX: 640,
            maxY: 480,
            DETECT: 0,
            _fillmode: false,
            colorPalette: [
                'rgb(0, 0, 0)',       // 0: BLACK
                'rgb(0, 0, 128)',     // 1: BLUE
                'rgb(0, 128, 0)',     // 2: GREEN
                'rgb(0, 128, 128)',   // 3: CYAN
                'rgb(128, 0, 0)',     // 4: RED
                'rgb(128, 0, 128)',   // 5: MAGENTA
                'rgb(128, 128, 0)',   // 6: BROWN
                'rgb(192, 192, 192)', // 7: LIGHTGRAY
                'rgb(128, 128, 128)', // 8: DARKGRAY
                'rgb(0, 0, 255)',     // 9: LIGHTBLUE
                'rgb(0, 255, 0)',     // 10: LIGHTGREEN
                'rgb(0, 255, 255)',   // 11: LIGHTCYAN
                'rgb(255, 0, 0)',     // 12: LIGHTRED
                'rgb(255, 0, 255)',   // 13: LIGHTMAGENTA
                'rgb(255, 255, 0)',   // 14: YELLOW
                'rgb(255, 255, 255)'  // 15: WHITE
            ],

            BLACK: 0,
            BLUE: 1,
            GREEN: 2,
            CYAN: 3,
            RED: 4,
            MAGENTA: 5,
            BROWN: 6,
            LIGHTGRAY: 7,
            DARKGRAY: 8,
            LIGHTBLUE: 9,
            LIGHTGREEN: 10,
            LIGHTCYAN: 11,
            LIGHTRED: 12,
            LIGHTMAGENTA: 13,
            YELLOW: 14,
            WHITE: 15,



            NORM_WIDTH: 1,
            THICK_WIDTH: 3,

            USER_CHAR_SIZE: 0,
            HORIZ_DIR: 0,
            VERT_DIR: 1,

            LEFT_TEXT: "Left",
            CENTER_TEXT: "Center",
            RIGHT_TEXT: "Right",

            DEFAULT_FONT: "Arial",
            TRIPLEX_FONT: "Times New Roman",
            SMALL_FONT: "Courier New",
            SANS_SERIF_FONT: "Verdana",
            GOTHIC_FONT: "MS Sans Serif",
            SCRIPT_FONT: "Lucida Console",
            SIMPLEX_FONT: "Symbol",
            TRIPLEX_SCR_FONT: "Courier New",
            COMPLEX_FONT: "Lucida Sans Typewriter",
            EUROPEAN_FONT: "Lucida Sans",
            BOLD_FONT: "Times New Roman",
            BOLD_SCR_FONT: "Courier New",

            EMPTY_FILL: 0,
            SOLID_FILL: 1,
            LINE_FILL: 0,
            LTSLASH_FILL: 0,
            SLASH_FILL: 0,
            BKSLASH_FILL: 0,
            LTBKSLASH_FILL: 0,
            HATCH_FILL: 1,
            XHATCH_FILL: 1,
            INTERLEAVE_FILL: 1,
            WIDE_DOT_FILL: 1,
            CLOSE_DOT_FILL: 1,
            USER_FILL: 0,

            terminal: (text: string) => {
                setTerminal(previous => previous + text + '\n');
            },

            _updateCanvas: () => {
                if (!ctx) return;
                // Create a temporary canvas to hold the current state
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = ctx.canvas.width;
                tempCanvas.height = ctx.canvas.height;
                const tempCtx = tempCanvas.getContext('2d');

                // Draw the current canvas state to the temporary canvas
                tempCtx?.drawImage(ctx.canvas, 0, 0);

                // Clear the main canvas
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // Draw the temporary canvas back to the main canvas
                ctx.drawImage(tempCanvas, 0, 0);
            },

            checkAbort: () => {
                if (abortControllerRef!.current!.signal.aborted) {
                    throw new Error('Execution aborted');
                }
            },

            _draw: () => {
                if (!ctx) return;
                if (graphicsLib._fillmode) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }

                graphicsLib._updateCanvas();
            },

            scanf: (text: string): string => {
                graphicsLib.terminal(text);
                let out = prompt(text);
                graphicsLib.terminal(out || "");
                return out || "";
            },
            printf: (text: string, ...args: any) => {
                graphicsLib.terminal(text + " " + args.join(" "));
            },

            delay: async (ms: number) => {
                return new Promise(resolve => setTimeout(resolve, ms));
            },

            sleep: async (s: number) => {
                return Promise.resolve(new Promise(resolve => setTimeout(resolve, s * 1000)));
            },


            detectgraph: (gd: number, gm: number) => {
                console.log('detectgraph called');
            },
            initgraph: (gd: number, gm: number, path: string) => {
                console.log('initgraph called');
            },
            getmaxx: () => graphicsLib.maxX,
            getmaxy: () => graphicsLib.maxY,
            closegraph: () => {
                console.log('closegraph called');
            },
            putpixel: (x: number, y: number, color: number) => {
                if (!ctx) return;
                ctx.fillStyle = graphicsLib.colorPalette[color] || graphicsLib.colorPalette[0]; // Default to BLACK if color is out of bounds
                ctx.fillRect(x, y, 1, 1);
            },

            getpixel: (x: number, y: number) => {
                if (!ctx) return -1;
                const pixel = ctx.getImageData(x, y, 1, 1).data;
                const pixelColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

                // Find the color index by matching the pixel's color with the palette
                const colorIndex = graphicsLib.colorPalette.findIndex(color => color === pixelColor);

                // If the color is found, return its index; otherwise, return -1
                return colorIndex !== -1 ? colorIndex : -1;
            },

            line: (x1: number, y1: number, x2: number, y2: number) => {
                ctx?.beginPath();
                ctx?.moveTo(x1, y1);
                ctx?.lineTo(x2, y2);
                ctx?.stroke();
            },
            circle: (x: number, y: number, radius: number) => {
                ctx?.beginPath();
                ctx?.arc(x, y, radius, 0, 2 * Math.PI);
                graphicsLib._draw();
            },
            rectangle: (left: number, top: number, right: number, bottom: number) => {
                ctx?.beginPath();
                ctx?.rect(left, top, right - left, bottom - top);
                graphicsLib._draw();
            },
            setcolor: (color: number) => {
                if (!ctx) return;
                ctx.strokeStyle = graphicsLib.colorPalette[color] || graphicsLib.colorPalette[0];
            },
            setfillstyle: (active: number, color: number) => {
                if (!ctx) return;
                graphicsLib._fillmode = active == 0 ? false : true;
                ctx.fillStyle = graphicsLib.colorPalette[color] || graphicsLib.colorPalette[0];
            },
            floodfill: (x: number, y: number, borderColor: number) => {
                graphicsLib.terminal(`floodfill is not supported in Borland Graphics Simulator, use setfillstyle(1, ${borderColor}) instead`);
            },
            outtextxy: (x: number, y: number, text: string) => {
                ctx?.fillText(text, x, y);
            },
            settextstyle: (font: string, direction: number, size: number) => {
                if (!ctx) return;
                ctx.font = `${size}px ${font}`;
            },
            bar: (left: number, top: number, right: number, bottom: number) => {
                ctx?.fillRect(left, top, right - left, bottom - top);
            },
            arc: (x: number, y: number, startAngle: number, endAngle: number, radius: number) => {
                ctx?.beginPath();
                ctx?.arc(x, y, radius, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
                ctx?.stroke();
            },
            cleardevice: () => {
                ctx!.fillStyle = 'black';
                ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx?.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                graphicsLib._updateCanvas();

            },
            ellipse: (x: number, y: number, startAngle: number, endAngle: number, xRadius: number, yRadius: number) => {
                ctx?.beginPath();
                ctx?.ellipse(x, y, xRadius, yRadius, 0, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
                ctx?.stroke();
            },
            fillpoly: (numPoints: number, points: number[]) => {
                if (numPoints < 3) {
                    console.error('A polygon must have at least 3 points.');
                    return;
                }

                ctx!.beginPath();
                ctx!.moveTo(points[0], points[1]);

                for (let i = 2; i < numPoints * 2; i += 2) {
                    ctx!.lineTo(points[i], points[i + 1]);
                }

                ctx!.closePath();
                ctx!.fill();
            },
        };

        // only allow to if delay and sleep is suffixed with `await`

        if (code.includes("delay")) {
            if (!code.matchAll(/await(\s+)delay/g)) {
                graphicsLib.terminal("Error: delay must be suffixed with `await`");
                return;
            }
        }

        if (code.includes("s")) {
            if (!code.matchAll(/await(\s+)sleep/g)) {
                graphicsLib.terminal("Error: s must be suffixed with `await`");
                return;
            }
        }

        // every fifth line add a checkAbort() call
        const splitCode = code.split('\n');

        for (let i = 0; i < splitCode.length; i++) {
            if (i % 5 === 0) {
                splitCode[i] = `checkAbort();\n${splitCode[i]}`;
            }
        }

        let newCode = splitCode.join('\n');

        setTerminal('Program Started\n');
        abortControllerRef.current = new AbortController();
        setIsRunning(true);
        try {
            let runGraphics = new Function('lib', 'input', 'abortControllerRef', `
                return (async () => {
                    with (lib) {
                        ${newCode}
                    }
                })();
            `);
            await runGraphics(graphicsLib, [], abortControllerRef);
            return;
        } catch (error) {
            if (abortControllerRef.current!.signal.aborted) {
                setTerminal(prev => prev + "\nProgram Aborted");
            } else {
                setTerminal(prev => prev + "\nProgram Error");
                setError((error as Error).message);
                setTimeout(() => {
                    setError('');
                }, 5000)
            }
            setIsRunning(false);
            return;
        }
        finally {
            setOutput('Graphics rendered successfully');
            setTimeout(() => {
                setOutput('');
            }, 1000)
            setTerminal(prev => prev + "\nProgram Ended");
            setIsRunning(false);
        }
    };

    const stopCode = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };




    const MagnifiedCanvas = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        >
            <div className="relative py-8 px-16 h-[90vh] bg-[#1e1e1e] rounded-lg shadow-2xl overflow-hidden">
                <canvas
                    ref={magnifiedCanvasRef}
                    width="1920"
                    height="1440"
                    className="w-full h-full object-contain"
                />
                <button
                    onClick={() => setIsMagnified(false)}
                    className="absolute top-4 right-4 p-2 bg-[#3c3c3c] text-[#d4d4d4] rounded-full hover:bg-[#4c4c4c] transition-colors duration-150"
                    aria-label="Close magnified view"
                >
                    <X size={24} />
                </button>
            </div>
        </motion.div>
    )


    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-[#1e1e1e] to-[#2d2d2d] text-[#d4d4d4] p-4 space-y-4 md:space-y-0 md:flex-row md:space-x-4">
            <motion.div
                className={`${isFullScreen ? 'w-full' : 'w-full md:w-1/2'} h-full md:h-auto transition-all duration-300 ease-in-out bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden`}
                layout
            >
                <div className="h-full relative flex flex-col">
                    <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-[#2d2d2d] border-b border-[#3c3c3c]">
                        <h2 className="text-lg font-bold flex items-center text-[#d4d4d4] mb-2 sm:mb-0">
                            <Edit2 className="mr-2" size={18} />
                            Code Editor (JS)
                        </h2>

                        <div className='flex flex-wrap gap-2 items-center justify-center'>
                            <Select onValueChange={handleTemplateSelect}>
                                <SelectTrigger className="w-40 bg-[#1e1e1e] text-[#d4d4d4] border border-[#3c3c3c] focus:ring-[#007acc] focus:ring-opacity-50">
                                    <SelectValue placeholder="Templates" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2d2d2d] text-[#d4d4d4] border border-[#3c3c3c]">
                                    {templates.map((template, index) => (
                                        <SelectItem
                                            key={index}
                                            value={`${index}`}
                                            className="focus:bg-[#3c3c3c] focus:text-[#d4d4d4]"
                                        >
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button variant="ghost" size="icon" onClick={toggleFullScreen}>
                                {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </Button>

                            <Link href={"/#reference"} target="_blank">
                                <Button variant="ghost" size="icon" className='bg-gray-500 hover:bg-gray-600'>
                                    <HelpCircle size={18} />
                                </Button>
                            </Link>
 
                            <Button variant="default" size="icon" onClick={runCode} disabled={isRunning} className='bg-teal-700 hover:bg-teal-950'>
                                <Play size={18} />
                            </Button>

                            <Button variant="default" size="icon" onClick={stopCode} disabled={!isRunning} className=''>
                                <Pause size={18} />
                            </Button>
                        </div>
                    </div>
                    <Editor
                        defaultLanguage='javascript'
                        theme="vs-dark"
                        loading={<div className="text-center p-4">Loading Graphics Library...</div>}
                        className="flex-grow"
                        onChange={(value) => setCode(value || '')}
                        value={code}
                        options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 14,
                            lineNumbers: 'on',
                            roundedSelection: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                            padding: { top: 10 },
                            autoClosingBrackets: 'always',
                        }}
                    />
                </div>
            </motion.div>

            <AnimatePresence>
                {!isFullScreen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
                        className="w-full md:w-1/2 h-full flex flex-col bg-[#2d2d2d] rounded-lg shadow-lg overflow-hidden"
                    >
                        <div className="flex-1 relative bg-[#1e1e1e] rounded-lg overflow-hidden">
                            <motion.canvas
                                ref={canvasRef}
                                width="640"
                                height="480"
                                className="border border-[#3c3c3c] w-full h-[60%] object-contain shadow-inner cursor-pointer"
                                onClick={() => setIsMagnified(true)}
                                layoutId="canvas"
                            />
                            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[#252526] p-4 border-t border-[#3c3c3c]">
                                <h2 className="text-lg font-bold mb-2 flex items-center text-[#d4d4d4]">
                                    <Terminal className="mr-2" size={18} />
                                    Output Terminal
                                </h2>
                                <div className="h-[calc(100%-2rem)] bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-md shadow-inner overflow-auto font-mono text-sm">
                                    <pre className="whitespace-pre-wrap break-words">{terminal}</pre>
                                </div>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
                                        className="absolute top-4 right-4 w-64 bg-[#b43838] bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-md shadow-lg"
                                    >
                                        <div className="flex items-start">
                                            <AlertCircle className="mr-2 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="font-semibold">Error:</p>
                                                <pre className="whitespace-pre-wrap text-sm mt-1">{error}</pre>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {output && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="absolute top-4 right-4 w-64 bg-[#119762] bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-md shadow-lg"
                                    >
                                        <div className="flex items-start">
                                            <CheckCircle className="mr-2 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="font-semibold">Output:</p>
                                                <pre className="whitespace-pre-wrap text-sm mt-1">{output}</pre>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isMagnified && <MagnifiedCanvas />}
            </AnimatePresence>
        </div>
    );

};

export default BorlandGraphicsSimulator;