function validateCCode(code: string): string[] {
    const errors: string[] = [];
    const lines = code.split('\n');

    // regexes for different enclosures
    const enclosures = [{
        open: /\{/g,
        close: /\}/g,
    }, {
        open: /\(/g,
        close: /\)/g,
    }, {
        open: /\[/g,
        close: /\]/g,
    }];

    // array to keep track of unbalanced enclosures
    let enclosureCount = [0, 0, 0];

    // check for enclosure balance
    const checkEnclosure = (line: string, index: number) => {
        enclosureCount[index] += (line.match(enclosures[index].open) || []).length;
        enclosureCount[index] -= (line.match(enclosures[index].close) || []).length;
    };

    lines.forEach((line, lineNumber) => {
        // Ignore comments
        if (/^\s*\/\//.test(line)) {
            return;
        }

        // Check for missing semicolons
        if (!/;\s*(\/\/.*)?$/.test(line) && !/^\s*#/.test(line) && !/^\s*$/.test(line) && !/{/.test(line) && !/}/.test(line)) {
            errors.push(`line: ${lineNumber + 1} Missing semicolon at the end of the line`);
        }

        // Check for unbalanced parentheses, braces, and brackets
        enclosures.forEach((_, index) => checkEnclosure(line, index));

        // Check for unclosed string literals
        const quoteCount = (line.match(/"/g) || []).length;
        if (quoteCount % 2 !== 0) {
            errors.push(`line: ${lineNumber + 1} Unclosed string literal`);
        }

        // Check for invalid variable names
        const variableDeclaration = line.match(/\b(int|char|float|double)\s+(\w+)/);
        if (variableDeclaration && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variableDeclaration[2])) {
            errors.push(`line: ${lineNumber + 1} Invalid variable name`);
        }

        // Check for missing main function
        if (lineNumber === lines.length - 1 && !code.includes('main(')) {
            errors.push(`line: 1 Missing main function`);
        }
    });

    // Check if any enclosures are unbalanced
    enclosures.forEach((_, index) => {
        if (enclosureCount[index] !== 0) {
            const types = ['curly braces', 'parentheses', 'square brackets'];
            errors.push(`Unbalanced ${types[index]}: ${enclosureCount[index]} more ${enclosureCount[index] > 0 ? 'open' : 'close'} ${types[index]}`);
        }
    });

    return errors;
}

export { validateCCode };