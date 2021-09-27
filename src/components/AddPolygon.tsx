import React, { useState } from 'react';
import { listToMatrix } from 'utils/conversion';
import { QuadTree } from 'utils/quadtree';

export function AddPolygon() {
    let imageI: any = React.createRef()
    const [labelText, setLabelText] = useState("I'm here!");
    const [file, setFile] = useState('');
    const [showError, setShowError] = useState(false);

    const onFileChange = (event: any) => {
        //convert type file to svg element
        let reader = new FileReader()
        reader.addEventListener('load', (e) => {
            let fileContent: any = e.target?.result;
            setFile(fileContent);
            //Render svg on svg viewer
            let renderDiv = document.getElementById("renderImage");
            if (renderDiv)
                renderDiv.innerHTML = '';
            renderDiv?.insertAdjacentHTML('beforeend', fileContent);//insert svg element in empty div created
        });
        reader.readAsBinaryString(event?.target.files[0]);
    }

    const render = () => {
        if (valid()) {
            assignLabel();
            setShowError(false);
        } else {
            setShowError(true);
        }
    }

    const assignLabel = () => {
        //get SVG element
        let svgelement = document.getElementById("renderImage")?.querySelector("svg");
        let polygonElement = svgelement?.querySelector('polygon');
        let points: any = polygonElement?.getAttribute('points');

        //convert one dimenion string array to two dimension number array
        let result: any[] = points.split(" ");
        let newpoints = listToMatrix(result, 2);
        newpoints = newpoints.map(point => {
            return [parseFloat(point[0]), parseFloat(point[1])]
        });

        //get uploaded SVG point of inaccessibility 
        let quadtree = new QuadTree([newpoints]);
        let poI = quadtree.getPoI();

        //create label as Text element, set position and insert in the SVG
        let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', poI[0]);
        text.setAttribute('y', poI[1]);
        text.setAttribute('text-anchor', 'middle');
        text.innerHTML = labelText;

        //add text to svg element
        svgelement?.appendChild(text);
    }

    const valid = () => {
        if (labelText != "" && file)
            return true
        return false
    }


    return <div className="add-polygon-container">
        <div className="form" >
            <h2 className="title">Create SVG</h2>
            <div className="label-input">
                <label>Label Name</label>
                <input type="text" value={labelText} onChange={(e) => { setLabelText(e.target.value) }} />
            </div>
            <div className="drag-area">
                <div className="icon"><i className="fas fa-cloud-upload-alt"></i></div>
                <header>Drag &amp; Drop to Upload File</header>
                <span>OR</span>
                <button className="button-outline">Browse File
                    <input type="file" name="polygon" accept="image/svg+xml" onChange={onFileChange} />
                </button>
            </div>
            <label className="error" style={{ display: showError ? 'flex' : 'none', marginBottom: '5px' }}>All fields are mandatory!</label>
            <button className="button submit" onClick={render}>Render</button>
        </div>
        <div id="renderImage" className='image-preview' ref={imageI}>
            SVG preview
        </div>
    </div>
}
