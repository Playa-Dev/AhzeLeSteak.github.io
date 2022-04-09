import React, {BaseSyntheticEvent, useRef, useState} from 'react';
import './App.css';
import {Container, Grid, Slider, Typography} from "@mui/material";
import Amogus from "./Amogus";
import {useSlider} from "./useSlider";


function App() {

    const [buffer, setBuffer] = useState('');
    const [pxl, setPxlState] = useState<number[]>([]);
    const [imgCnt, setImgCnt] = useState(0);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [fileName, setFileName] = useState<string>('');

    const setPxl = (nPxl: number[]) => {
        setPxlState(nPxl);
        setImgCnt(imgCnt+1);
    };

    const [visualThreshold, threshold, setThreshold] = useSlider(51);
    const [visualSpacing, spacing, setSpacing] = useSlider(0);
    const [visualColorVariation, colorVariation, setColorVariation] = useSlider(1);

    const imgRef = useRef<HTMLImageElement>(null);
    const inputFileRef = useRef<HTMLInputElement>(null);




    const fileChange = ({target} : BaseSyntheticEvent) => {
        const fr = new FileReader();
        fr.onload = function (){
            setBuffer(fr.result as string);
        };

        fr.readAsDataURL(target.files[0]);
        setFileName(target.files[0].name);
    }

    const toPixels = () => {
        const canvas = document.createElement('canvas');
        const image = imgRef.current as HTMLImageElement;
        canvas.width = image.width;
        canvas.height = image.height;
        setWidth(image.width);
        setHeight(image.height);

        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        setPxl(Array.from(imageData.data));
        setTimeout(() => setSpacing(spacing), 10);
    }




    return (
        <Container maxWidth="md" id="mainContainer">
            <Container>
                <Grid container spacing={1} style={{paddingTop: '50px'}}>
                    <Grid item md={1}/>
                    <Grid item md={5} style={{textAlign: 'center'}}>
                        <input type="file" name="file-input" onChange={fileChange} id="fileInput" ref={inputFileRef}/>
                        <input type="button" className="taskButton amogus-text" value="Choose a file" onClick={() => inputFileRef.current!.click()}/>
                    </Grid>
                    <Grid item md={5} style={{textAlign: 'center'}}>
                        <div id="fileLabel">{fileName}</div>
                    </Grid>
                    <Grid item md={1}/>

                    <Grid item md={3}/>
                    <Grid item md={6}>
                        <Grid container spacing={2}>
                            <Grid item md={3}>
                                <div className="amogus-text slider-label">
                                    Threshold
                                </div>
                            </Grid>
                            <Grid item md={1}/>
                            <Grid item md={8}>
                                <Slider value={visualThreshold} min={0} max={102} step={3} aria-label="Default" valueLabelDisplay="auto" onChange={(e, v) => setThreshold(v as number)} />
                            </Grid>

                            <Grid item md={3}>
                                <div className="amogus-text slider-label">
                                    Spacing
                                </div>
                            </Grid>
                            <Grid item md={1}/>
                            <Grid item md={8}>
                                <Slider value={visualSpacing} min={0} max={5} step={1} aria-label="Default" valueLabelDisplay="auto" onChange={(e, v) => setSpacing(v as number)} />
                            </Grid>

                            <Grid item md={3}>
                                <div className="amogus-text slider-label">
                                    Color
                                </div>
                            </Grid>
                            <Grid item md={1}/>
                            <Grid item md={8}>
                                <Slider value={visualColorVariation} min={0.5} max={1.5} step={0.1} aria-label="Default" valueLabelDisplay="auto" onChange={(e, v) => setColorVariation(v as number)} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={3}/>

                    <Grid item md={4}/>
                    <Grid item md={12} style={{textAlign: 'center'}}>
                        <Amogus pxl={pxl} imgCnt={imgCnt} width={width} height={height} options={{threshold, spacing, colorVariation}}/>
                    </Grid>
                </Grid>
            </Container>

            <img src={buffer} onLoad={toPixels} ref={imgRef} style={{display: 'none'}}/>



        </Container>
    );
}

export default App;
