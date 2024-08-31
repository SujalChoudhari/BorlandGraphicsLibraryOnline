
const graphicsLibDefinitions = `
    // Functions
    declare function detectgraph(gd: number, gm: number): void;
    declare function initgraph(gd: number, gm: number, path: string): void;
    declare function getmaxx(): number;
    declare function getmaxy(): number;
    declare function closegraph(): void;
    declare function putpixel(x: number, y: number, color: number): void;
    declare function getpixel(x: number, y: number): number;
    declare function line(x1: number, y1: number, x2: number, y2: number): void;
    declare function circle(x: number, y: number, radius: number): void;
    declare function rectangle(left: number, top: number, right: number, bottom: number): void;
    declare function setcolor(color: number): void;
    declare function setfillstyle(active: number, color: number): void;
    declare function floodfill(x: number, y: number, borderColor: number): void;
    declare function outtextxy(x: number, y: number, text: string): void;
    declare function settextstyle(font: string, direction: number, size: number): void;
    declare function bar(left: number, top: number, right: number, bottom: number): void;
    declare function arc(x: number, y: number, startAngle: number, endAngle: number, radius: number): void;
    declare function cleardevice(): void;
    declare function ellipse(x: number, y: number, startAngle: number, endAngle: number, xRadius: number, yRadius: number): void;
    declare function fillpoly(numPoints: number, points: number[]): void;

    // IO Functions
    declare function scanf(prompt: string): string;
    declare function printf(text: string, ...args: any[]): void;
    declare async function delay(milliseconds: number): Promise<void>;
    declare async function sleep(seconds: number): Promise<void>;
    declare function terminal(text: string): void;

    // Variables
    declare const BLACK: number;
    declare const WHITE: number;
    declare const RED: number;
    declare const GREEN: number;
    declare const BLUE: number;
    declare const YELLOW: number;
    declare const MAGENTA: number;
    declare const CYAN: number;
    declare const LIGHTGRAY: number;
    declare const DARKGRAY: number;
    declare const BROWN: number;
    declare const LIGHTBLUE: number;
    declare const LIGHTGREEN: number;
    declare const LIGHTCYAN: number;
    declare const LIGHTRED: number;
    declare const LIGHTMAGENTA: number;
    declare const LIGHTYELLOW: number;
    declare const WHITE: number;

    declare const NORM_WIDTH: number;
    declare const THICK_WIDTH: number;
    declare const USER_CHAR_SIZE: number;
    declare const HORIZ_DIR: number;
    declare const VERT_DIR: number;
    declare const LEFT_TEXT: number;
    declare const CENTER_TEXT: number;
    declare const RIGHT_TEXT: number;
    declare const DEFAULT_FONT: string;
    declare const TRIPLEX_FONT: string;
    declare const SMALL_FONT: string;
    declare const SANS_SERIF_FONT: string;
    declare const GOTHIC_FONT: string;
    declare const SCRIPT_FONT: string;
    declare const SIMPLEX_FONT: string;
    declare const TRIPLEX_SCR_FONT: string;
    declare const COMPLEX_FONT: string;
    declare const EUROPEAN_FONT: string;
    declare const BOLD_FONT: string;
    declare const BOLD_SCR_FONT: string;
    declare const EMPTY_FILL: number;
    declare const SOLID_FILL: number;
    declare const LINE_FILL: number;
    declare const LTSLASH_FILL: number;
    declare const SLASH_FILL: number;
    declare const BKSLASH_FILL: number;
    declare const LTBKSLASH_FILL: number;
    declare const HATCH_FILL: number;
    declare const XHATCH_FILL: number;
    declare const INTERLEAVE_FILL: number;
    declare const WIDE_DOT_FILL: number;
    declare const CLOSE_DOT_FILL: number;
    declare const USER_FILL: number;

    declare const gd: number;
    declare const gm: number;
    declare const maxX: number;
    declare const maxY: number;
`;

export { graphicsLibDefinitions };
