"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BorlandGraphicsSimulator = () => {

    const [code, setCode] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [error, setError] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, 640, 480);
            }
        }
    }, []);

    const translateCToJS = (cCode: string): string => {
        let jsCode = cCode + "\nmain()";

        // Remove #include statements
        jsCode = jsCode.replace(/#include.*\n/g, '');

        // Replace main function
        jsCode = jsCode.replace(/(?:void|int|float|char|double|long|short)\s+(\w+)\s*\(([^)]*)\)\s*{/g, (match, funcName, params) => {
            // Remove data types from parameters
            let cleanedParams = params.replace(/(?:void|int|float|char|double|long|short)\s*(\w+)/g, '$1');
            return `async function ${funcName}(${cleanedParams}) {`;
        });
        jsCode = jsCode.replace(/return\s+0;?\s*}/g, '}');

        // IO functions
        jsCode = jsCode.replace(/getch\(\);?/g, 'await new Promise(resolve => setTimeout(resolve, 5000));');
        jsCode = jsCode.replace(/printf\s*\(([^)]+)\);?/g, 'console.log($1);');
        jsCode = jsCode.replace(/delay\s*\(([^)]+)\);?/g, 'await new Promise(resolve => setTimeout(resolve, $1));');
        jsCode = jsCode.replace(/sleep\s*\(([^)]+)\);?/g, 'await new Promise(resolve => setTimeout(resolve, $1 * 1000));');
        jsCode = jsCode.replace(/scanf\s*\(\s*"([^"]+)"[^)]*\)/g, (match, formatString) => {
            // Split the format string to determine the number and type of inputs
            const formatSpecifiers = formatString.match(/%[d|f|c|s]/g) || [];
            const variableMatches = match.match(/&(\w+)/g);
            const variables = variableMatches ? variableMatches.map(v => v.replace('&', '')) : [];

            // Generate input prompts for each variable
            let inputCode = '';
            formatSpecifiers.forEach((specifier: string, index: number) => {
                if (variables[index]) {
                    inputCode += `${variables[index]} = prompt('Enter value for ${variables[index]}:');\n`;

                    // Cast input based on format specifier
                    switch (specifier) {
                        case '%d': // Integer
                            inputCode += `${variables[index]} = parseInt(${variables[index]});\n`;
                            break;
                        case '%f': // Float
                            inputCode += `${variables[index]} = parseFloat(${variables[index]});\n`;
                            break;
                        case '%c': // Char (taking first character)
                            inputCode += `${variables[index]} = ${variables[index]}.charAt(0);\n`;
                            break;
                        case '%s': // String
                            inputCode += `${variables[index]} = ${variables[index]};\n`;
                            break;
                        default:
                            inputCode += `${variables[index]} = ${variables[index]};\n`; // Default to string
                    }
                }
            });

            return inputCode;
        });

        // Handle variable declarations
        const dataTypes = [
            'int', 'float', 'double', 'char', 'long', 'short',
            'unsigned', 'signed', 'bool', 'void'
        ];
        dataTypes.forEach(type => {
            const regex = new RegExp(`${type}\\s+([a-zA-Z_][a-zA-Z0-9_]*(?:\\s*=\\s*[a-zA-Z0-9_]+)?(?:\\s*,\\s*[a-zA-Z_][a-zA-Z0-9_]*(?:\\s*=\\s*[a-zA-Z0-9_]+)?)*)\\s*;`, 'g');
            jsCode = jsCode.replace(regex, 'let $1;');
        });

        // Replace graphics functions with JavaScript equivalents
        jsCode = jsCode.replace(/initgraph\s*\(&([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'initgraph($1, $2, $3)');
        jsCode = jsCode.replace(/detectgraph\s*\(&([^,]+),\s*([^)]*)\)/g, 'detectgraph($1, $2)');
        jsCode = jsCode.replace(/closegraph\(\);?/g, 'closegraph();');

        // Replace text and drawing functions
        jsCode = jsCode.replace(/outtextxy\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'outtextxy($1, $2, $3)');
        jsCode = jsCode.replace(/rectangle\s*\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'rectangle($1, $2, $3, $4)');
        jsCode = jsCode.replace(/circle\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'circle($1, $2, $3)');
        jsCode = jsCode.replace(/setcolor\s*\(([^)]+)\)/g, 'setcolor($1)');
        jsCode = jsCode.replace(/settextstyle\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'settextstyle($1, $2, $3)');
        jsCode = jsCode.replace(/setfillstyle\s*\(([^,]+),\s*([^)]+)\)/g, 'setfillstyle($1, $2)');
        jsCode = jsCode.replace(/floodfill\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'floodfill($1, $2, $3)');

        // Replace math functions
        jsCode = jsCode.replace(/abs\(/g, 'Math.abs(');
        jsCode = jsCode.replace(/sqrt\(/g, 'Math.sqrt(');
        jsCode = jsCode.replace(/pow\(/g, 'Math.pow(');
        jsCode = jsCode.replace(/sin\(/g, 'Math.sin(');
        jsCode = jsCode.replace(/cos\(/g, 'Math.cos(');
        jsCode = jsCode.replace(/tan\(/g, 'Math.tan(');
        jsCode = jsCode.replace(/exp\(/g, 'Math.exp(');
        jsCode = jsCode.replace(/rand\(/g, 'Math.random() * ');
        jsCode = jsCode.replace(/ceil\(/g, 'Math.ceil(');
        jsCode = jsCode.replace(/floor\(/g, 'Math.floor(');
        jsCode = jsCode.replace(/round\(/g, 'Math.round(');

        // 15 colors
        jsCode = jsCode.replace(/BLACK/g, '0');
        jsCode = jsCode.replace(/BLUE/g, '1');
        jsCode = jsCode.replace(/GREEN/g, '2');
        jsCode = jsCode.replace(/CYAN/g, '3');
        jsCode = jsCode.replace(/RED/g, '4');
        jsCode = jsCode.replace(/MAGENTA/g, '5');
        jsCode = jsCode.replace(/BROWN/g, '6');
        jsCode = jsCode.replace(/LIGHTGRAY/g, '7');
        jsCode = jsCode.replace(/DARKGRAY/g, '8');
        jsCode = jsCode.replace(/LIGHTBLUE/g, '9');
        jsCode = jsCode.replace(/LIGHTGREEN/g, '10');
        jsCode = jsCode.replace(/LIGHTCYAN/g, '11');
        jsCode = jsCode.replace(/LIGHTRED/g, '12');
        jsCode = jsCode.replace(/LIGHTMAGENTA/g, '13');
        jsCode = jsCode.replace(/YELLOW/g, '14');
        jsCode = jsCode.replace(/WHITE/g, '15');

        // Wrap the entire code in an async function and run it
        jsCode = `async function runSimulation() {\n${jsCode}\n}\nrunSimulation();`;

        return jsCode;
    };

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
                ctx?.stroke();
            },
            rectangle: (left: number, top: number, right: number, bottom: number) => {
                ctx?.beginPath();
                ctx?.rect(left, top, right - left, bottom - top);
                ctx?.stroke();
            },
            setcolor: (color: number) => {
                if (!ctx) return;
                ctx.strokeStyle = graphicsLib.colorPalette[color] || graphicsLib.colorPalette[0];
            },
            setfillstyle: (pattern: number, color: number) => {
                if (!ctx) return;
                ctx.fillStyle = graphicsLib.colorPalette[color] || graphicsLib.colorPalette[0];
            },
            floodfill: (x: number, y: number, borderColor: number) => {
                if (!ctx) return;
                const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                const pixelStack = [[x, y]];
                const startColor = ctx.getImageData(x, y, 1, 1).data;
                const fillColor = graphicsLib.colorPalette[borderColor] || graphicsLib.colorPalette[0];

                function matchStartColor(pixelPos: number) {
                    const r = imageData.data[pixelPos];
                    const g = imageData.data[pixelPos + 1];
                    const b = imageData.data[pixelPos + 2];
                    return r === startColor[0] && g === startColor[1] && b === startColor[2];
                }

                function colorPixel(pixelPos: number) {
                    const rgbValues = fillColor.match(/\d+/g);
                    if (!rgbValues) return;
                    imageData.data[pixelPos] = parseInt(rgbValues[0]);
                    imageData.data[pixelPos + 1] = parseInt(rgbValues[1]);
                    imageData.data[pixelPos + 2] = parseInt(rgbValues[2]);
                    imageData.data[pixelPos + 3] = 255; // Alpha
                }

                while (pixelStack.length) {
                    const newPos = pixelStack.pop();
                    if (!newPos) continue;
                    let x = newPos[0];
                    let y = newPos[1];

                    let pixelPos = (y * ctx.canvas.width + x) * 4;

                    while (y >= 0 && matchStartColor(pixelPos)) {
                        y--;
                        pixelPos -= ctx.canvas.width * 4;
                    }

                    pixelPos += ctx.canvas.width * 4;
                    y++;

                    let reachLeft = false;
                    let reachRight = false;
                    while (y <= ctx.canvas.height - 1 && matchStartColor(pixelPos)) {
                        colorPixel(pixelPos);

                        if (x > 0) {
                            if (matchStartColor(pixelPos - 4)) {
                                if (!reachLeft) {
                                    pixelStack.push([x - 1, y]);
                                    reachLeft = true;
                                }
                            } else if (reachLeft) {
                                reachLeft = false;
                            }
                        }

                        if (x < ctx.canvas.width - 1) {
                            if (matchStartColor(pixelPos + 4)) {
                                if (!reachRight) {
                                    pixelStack.push([x + 1, y]);
                                    reachRight = true;
                                }
                            } else if (reachRight) {
                                reachRight = false;
                            }
                        }

                        y++;
                        pixelPos += ctx.canvas.width * 4;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
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



        const jsCode = translateCToJS(code);
        try {
            const runGraphics = new Function('lib', 'input', `
                return (async () => {
                with (lib) {
                        ${jsCode}
                }
            })();
                        `);
            console.log(`Translated JavaScript Code: \n${runGraphics.toString()}`);
            await runGraphics(graphicsLib, []);
            setOutput('Graphics rendered successfully');
        } catch (err) {
            setError(`Error: ${(err as Error).toString()} \n\nTranslated JavaScript Code: \n${jsCode}`);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <div className="w-1/2 p-4 flex flex-col">
                    <textarea
                        className="flex-1 p-2 bg-gray-800 text-white font-mono"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter your Borland Graphics Library C code here..."
                    />
                </div>
                <div className="w-1/2 p-4 bg-gray-900 flex flex-col">
                    <canvas ref={canvasRef} width="640" height="480" className="border border-gray-700" />
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={runCode}
                    >
                        Run Code
                    </button>
                    {output && (
                        <Alert className="mt-4">
                            <AlertDescription>{output}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertDescription>
                        <pre className="whitespace-pre-wrap">{error}</pre>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default BorlandGraphicsSimulator;