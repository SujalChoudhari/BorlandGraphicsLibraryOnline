const translateCode = (cCode: string): string => {
    let jsCode = cCode + "\nmain()";

    // Remove #include statements, including possible spaces and comments
    jsCode = jsCode.replace(/^\s*#include[^\n]*\n?/gm, '');

    // Replace main function
    jsCode = jsCode.replace(/(?:void|int|float|char|double|long|short)\s+(\w+)\s*\(([^)]*)\)\s*{/g, (match, funcName, params) => {
        // Remove data types from parameters
        let cleanedParams = params.replace(/(?:void|int|float|char|double|long|short)\s*(\w+)/g, '$1');
        // Convert pass-by-reference parameters
        cleanedParams = cleanedParams.replace(/&(\w+)/g, 'ref_$1');
        return `async function ${funcName}(${cleanedParams}) {`;
    });
    jsCode = jsCode.replace(/return\s+0;?\s*}/g, '}');

    // IO functions
    jsCode = jsCode.replace(/getch\(\);?/g, 'await new Promise(resolve => setTimeout(resolve, 5000));');
    jsCode = jsCode.replace(/printf\s*\(([^)]+)\);?/g, 'terminal($1);');
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
    jsCode = jsCode.replace(/initgraph\s*\(&([^,]+),\s*([^,]+),\s*([^)]+)\)/g, '// initgraph($1, $2, $3)');
    jsCode = jsCode.replace(/detectgraph\s*\(&([^,]+),\s*([^)]*)\)/g, '// detectgraph($1, $2)');
    jsCode = jsCode.replace(/closegraph\(\);?/g, '// closegraph();');

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



    jsCode = jsCode.replace(/BLACK/g, "0");
    jsCode = jsCode.replace(/BLUE/g, "1");
    jsCode = jsCode.replace(/GREEN/g, "2");
    jsCode = jsCode.replace(/CYAN/g, "3");
    jsCode = jsCode.replace(/RED/g, "4");
    jsCode = jsCode.replace(/MAGENTA/g, "5");
    jsCode = jsCode.replace(/BROWN/g, "6");
    jsCode = jsCode.replace(/LIGHTGRAY/g, "7");
    jsCode = jsCode.replace(/DARKGRAY/g, "8");
    jsCode = jsCode.replace(/LIGHTBLUE/g, "9");
    jsCode = jsCode.replace(/LIGHTGREEN/g, "10");
    jsCode = jsCode.replace(/LIGHTCYAN/g, "11");
    jsCode = jsCode.replace(/LIGHTRED/g, "12");
    jsCode = jsCode.replace(/LIGHTMAGENTA/g, "13");
    jsCode = jsCode.replace(/YELLOW/g, "14");
    jsCode = jsCode.replace(/WHITE/g, "15");

    // Wrap the entire code in an async function and run it
    jsCode = `async function runSimulation() {\n${jsCode}\n}\nrunSimulation();`;

    return jsCode;
};

export { translateCode };