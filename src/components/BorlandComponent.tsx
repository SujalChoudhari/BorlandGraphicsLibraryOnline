"use client";
import { translateCode } from '@/app/translateCode';
import { validateCCode } from '@/app/validateCCode';
import Editor from '@monaco-editor/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Edit2, Maximize2, Minimize2, Play, Terminal, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';



const BorlandGraphicsSimulator = () => {

    const [code, setCode] = useState<string>(`
int main(){
	int maxX,maxY,originX,originY;

	// Draw Axis
	maxX = getmaxx();
	maxY = getmaxy();
	originX = maxX /2;
	originY = maxY /2;
	line(0,originY,maxX,originY);
	line(originX,0,originX,maxY);
    // your code here

	getch();
	closegraph();
	return 0;
}
`);

    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [terminal, setTerminal] = useState<string>('');
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
    const [isMagnified, setIsMagnified] = useState(false)
    const magnifiedCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen)
    }

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

            _draw: () => {
                if (!ctx) return;
                if (graphicsLib._fillmode) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }

                graphicsLib._updateCanvas();
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
                return pixel[0];
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
                ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            },
            ellipse: (x: number, y: number, startAngle: number, endAngle: number, xRadius: number, yRadius: number) => {
                ctx?.beginPath();
                ctx?.ellipse(x, y, xRadius, yRadius, 0, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
                ctx?.stroke();
            },
            fillpoly: (numPoints: number, points: number[]) => {
                ctx?.beginPath();
                ctx?.moveTo(points[0], points[1]);
                for (let i = 2; i < numPoints * 2; i += 2) {
                    ctx?.lineTo(points[i], points[i + 1]);
                }
                ctx?.closePath();
                ctx?.fill();
            },
        };


        setTerminal('Program Started\n');
        const errors = validateCCode(code);
        if (errors.length > 0) {
            setError("Invalid Code: Check Terminal");
            setTerminal(errors.join('\n'));
            return;
        }
        const jsCode = translateCode(code);
        console.log(jsCode);
        try {
            const runGraphics = new Function('lib', 'input', `
                return (async () => {
                with (lib) {
                        ${jsCode}
                }
            })();
            `);
            await runGraphics(graphicsLib, []);
            setOutput('Graphics rendered successfully');
            setTerminal(prev => prev + "\nProgram Ended");
            setTimeout(() => {
                setOutput('');
            }, 2000);
        } catch (err) {
            setError(`Error: ${(err as Error).toString()}`);
            setTimeout(() => {
                setError('');
            }, 5000);
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
        <div className="flex flex-col h-screen bg-gradient-to-br from-[#1e1e1e] to-[#2d2d2d] text-[#d4d4d4]">
            <div className="flex flex-1 p-4 space-x-4">
                {/* Code Editor */}
                <motion.div
                    className={`${isFullScreen ? 'w-full' : 'w-1/2'} h-full transition-all duration-300 ease-in-out bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden`}
                    layout
                >
                    <div className="h-full relative flex flex-col">
                        <div className="flex items-center justify-between p-3 bg-[#2d2d2d] border-b border-[#3c3c3c]">
                            <h2 className="text-lg font-bold flex items-center text-[#d4d4d4]">
                                <Edit2 className="mr-2" size={18} />
                                Code Editor
                            </h2>
                            <button
                                className="p-1 bg-[#3c3c3c] text-[#d4d4d4] rounded hover:bg-[#4c4c4c] transition-colors duration-150"
                                onClick={toggleFullScreen}
                                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
                            >
                                {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                        </div>
                        <Editor
                            defaultLanguage='c'
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
                                padding: { top: 10 },
                            }}
                        />
                    </div>
                </motion.div>

                {/* Output & Canvas */}
                <AnimatePresence>
                    {!isFullScreen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="w-1/2 h-full flex flex-col bg-[#2d2d2d] rounded-lg shadow-lg overflow-hidden"
                        >
                            <div className="flex-1 relative bg-[#1e1e1e] rounded-lg overflow-hidden">
                                <canvas
                                    ref={canvasRef}
                                    width="640"
                                    height="480"
                                    className="border border-[#3c3c3c] w-full h-[60%] object-contain shadow-inner cursor-pointer"
                                    onClick={() => setIsMagnified(true)}
                                />
                                {/* Output Terminal */}
                                <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[#252526] p-4 border-t border-[#3c3c3c]">
                                    <h2 className="text-lg font-bold mb-2 flex items-center text-[#d4d4d4]">
                                        <Terminal className="mr-2" size={18} />
                                        Output Terminal
                                    </h2>
                                    <div className="h-[calc(100%-2rem)] bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-md shadow-inner overflow-auto font-mono text-sm">
                                        <pre className="whitespace-pre-wrap break-words">{terminal}</pre>
                                    </div>
                                </div>

                                {/* Error Alert */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
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

                                {/* Output Alert */}
                                <AnimatePresence>
                                    {output && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
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

                                <button
                                    className="absolute bottom-4 right-4 px-4 py-2 bg-[#007acc] text-white rounded-md hover:bg-[#006bb3] transition duration-150 flex items-center shadow-md"
                                    onClick={runCode}
                                >
                                    <Play className="mr-2" size={18} />
                                    Run Code
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isMagnified && <MagnifiedCanvas />}
            </AnimatePresence>
        </div >
    );

};

export default BorlandGraphicsSimulator;