import {useEffect} from "react";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";

type Color = {
    r: number,
    g: number,
    b: number,
    a: number
};

const minimogus = [
    [0, 1, 1, 1],
    [1, 1, 2, 2],
    [1, 1, 1, 1],
    [0, 1, 1, 1],
    [0, 1, 0, 1]
];
const minimogusOnes = minimogus.flat().reduce((a,b)=> a+b, 0);

let output = [] as number[];
let b64encoded = '';
function Amogus({pxl, imgCnt, width, height, options} :{pxl: number[], imgCnt: number, width: number, height: number, options: any}){


    const threshold = options.threshold as number;
    const spacing = options.spacing as number - 1;
    const colorVariation = options.colorVariation as number;
    const zonesMatched = [] as Array<{x: number, y: number, c: Color}>;

    const getPixel = (x: number, y: number, array: number[]) => {
        const index = (y*width + x) * 4;
        return {
            r: array[index],
            g: array[index+1],
            b: array[index+2],
            a: array[index+3]
        };
    }

    const setPixel = (x: number, y: number, color: Color) => {
        const index = (y*width + x) * 4;
        output[index] = color.r;
        output[index+1] = color.g;
        output[index+2] = color.b;
        output[index+3] = color.a;
    }

    const zoneMatches = (xCorner: number, yCorner: number) => {
        const meanColor: Color = {
            r: 0,
            g: 0,
            b: 0,
            a: 255
        };

        const pixels = [];


        for(let y = 0; y < 5; y++){
            for(let x = 0; x < 4; x++){
                const mm = minimogus[y][x];
                if(mm === 0) continue;
                const p = getPixel(x+xCorner, y+yCorner, pxl);
                if(p.a === 0) return null;
                meanColor.r += p.r;
                meanColor.g += p.g;
                meanColor.b += p.b;
                pixels.push(p);
            }
        }
        meanColor.r /= minimogusOnes;
        meanColor.g /= minimogusOnes;
        meanColor.b /= minimogusOnes;

        //const distance = Math.sqrt((meanColor.r - colorRef.r)**2 + (meanColor.g - colorRef.g)**2 + (meanColor.b - colorRef.b)**2);
        //const pourcentage = distance/Math.sqrt((255**2)*3);
        // return pourcentage > 0.7;


        //const similarity = deltaE(meanColor, colorRef);
        //return similarity <= 12;

        const ecartype = Math.sqrt(pixels
            .map(p => Math.sqrt((p.r-meanColor.r)**2+(p.g-meanColor.g)**2+(p.b-meanColor.b)**2))
            .reduce((a, b)=>a+b,0));
        return ecartype < threshold ? meanColor : null;

    }

    const inZoneMatched = (xCorner: number, yCorner: number) => {
        const maxAx = xCorner + 4 + spacing;
        const maxAy = yCorner + 5 + Math.floor(spacing/2);
        //xCorner -= ecartement;
        //yCorner -= ecartement;
        return zonesMatched.some(({x, y}) => {
            const maxBx = x + 4 + spacing;
            const maxBy = y + 5 + Math.floor(spacing/2);
            //x -= ecartement;
            //y -= ecartement;

            const aLeftOfB = maxAx < x;
            const aRightOfB = xCorner > maxBx;
            const aAboveB = yCorner > maxBy;
            const aBelowB = maxAy < y;

            return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
        });
    }

    const paint = (xCorner: number, yCorner: number, c: Color) => {
        const colorVisor = {...c} as Color;
        multiplyColor(colorVisor, 1.1);
        for(let y = 0; y < 5; y++){
            for(let x = 0; x < 4; x++){
                const mm = minimogus[y][x];
                if(mm === 0) continue;
                setPixel(x+xCorner, y+yCorner, mm === 1 ? c : colorVisor);
            }
        }
    }

    useEffect(() => {
        console.log('effect', [pxl.length, threshold, spacing, colorVariation]);
        output = [...pxl];
        for(let y = 0; y < height-4; y++){
            for(let x = 0; x < width-3; x++){
                if(!inZoneMatched(x, y)){
                    const c = zoneMatches(x, y);
                    if(c){
                        multiplyColor(c, colorVariation);
                        zonesMatched.push({x, y, c});
                    }
                }
            }
        }

        zonesMatched.forEach(zm => paint(zm.x, zm.y, zm.c));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        document.body.append(canvas);
        const ctx = canvas!.getContext('2d') as CanvasRenderingContext2D;
        for(let y = 0; y < height; y++){
            for(let x = 0; x < width; x++){
                const {r, g, b, a} = getPixel(x, y, output);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                ctx.fillRect(x, y, 1, 1);
            }
        }
        canvas.remove();
        b64encoded = canvas.toDataURL('image/jpeg', 1);
    }, [pxl.length, threshold, spacing, colorVariation]);


    return pxl.length ?
        <TransformWrapper>
            <TransformComponent>
                <img src={b64encoded} height="400"  alt={''} style={{imageRendering: 'pixelated'}}/>
            </TransformComponent>
        </TransformWrapper>
        : <></>


}


function multiplyColor(c: Color, ratio = 1){
    c.r = Math.max(Math.min(Math.floor(c.r*ratio), 255), 0);
    c.g = Math.max(Math.min(Math.floor(c.g*ratio), 255), 0);
    c.b = Math.max(Math.min(Math.floor(c.b*ratio), 255), 0);
}




export default Amogus;
