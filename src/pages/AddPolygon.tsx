import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addNewImage, imageModel } from 'shared/services/images';
import { listToMatrix } from 'shared/utils/conversion';
import { QuadTree } from 'shared/utils/quadtree';

export function AddPolygon() {
    let imageI: any = React.createRef()
    const [labelText, setLabelText] = useState("I'm here!");
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('');
    const [showError, setShowError] = useState(false);
    const [isActive, setIsActive] = useState(false);

    //On file selection through Browse file
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
        setFileName(event?.target.files[0].name);
    }

    //On click of Render button add label to SVG
    const render = () => {
        if (valid()) {
            assignLabel();
            setShowError(false);
        } else {
            setShowError(true);
        }
    }

    //function to add label to the SVG
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
        let text = svgelement?.getElementsByTagName('text')[0];
        if (text) {
            text.innerHTML = labelText
        } else {
            text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', poI[0]);
            text.setAttribute('y', poI[1]);
            text.setAttribute('text-anchor', 'middle');
            text.innerHTML = labelText;
        }

        //add text to svg element
        svgelement?.appendChild(text);

        //save rendered image
        let payload: imageModel = {
            svg: `${svgelement?.outerHTML}`,
            name: fileName,
            createdAt: new Date()
        }
        addNewImage(payload).then((res) => {
            console.log("item added")
        })
    }

    //Validation
    const valid = () => {
        if (labelText != "" && file)
            return true
        return false
    }

    //Drag & Drop functions
    const handleDragEnter = (e: any) => {
        e.preventDefault();
        setIsActive(true);
        e.stopPropagation();
    };
    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setIsActive(false);
        e.stopPropagation();
    };
    const handleDragOver = (e: any) => {
        e.preventDefault();
        setIsActive(true);
        e.stopPropagation();
    };
    const handleDrop = (e: any) => {
        e.preventDefault();
        let file = e.dataTransfer.files[0];
        if (file.type != "image/svg+xml") {
            alert("Please add svg only")
        } else {
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
            reader.readAsBinaryString(file);
            setFileName(file.name);
        }
        console.log(file)
        setIsActive(false);
        e.stopPropagation();
    };

    return <div className="add-polygon-page">
        <div className="App-navigation">
            <h2 className="title">Create SVG</h2>
            <Link to="/history" className="App-link"> View History <i className="fas fa-chevron-right"></i></Link>
        </div>
        <div className="container">
            <div className="form" >
                {/* <h2 className="title">Create SVG</h2> */}
                <div className="label-input">
                    <label>Label Name</label>
                    <input type="text" value={labelText} onChange={(e) => { setLabelText(e.target.value) }} />
                </div>
                <div className={`drag-area ${isActive ? 'active' : ''}`} onDrop={e => handleDrop(e)}
                    onDragOver={e => handleDragOver(e)}
                    onDragEnter={e => handleDragEnter(e)}
                    onDragLeave={e => handleDragLeave(e)}>
                    <div className="icon"><i className="fas fa-cloud-upload-alt"></i></div>
                    <header>Drag &amp; Drop to Upload File</header>
                    <span>OR</span>
                    <button className="button-outline">Browse File
                        <input type="file" name="polygon" accept="image/svg+xml" onChange={onFileChange} />
                    </button>
                    {fileName ? <h6>File added: {fileName}</h6> : <h6></h6>}
                </div>
                <label className="error" style={{ display: showError ? 'flex' : 'none', marginBottom: '5px' }}>All fields are mandatory!</label>
                <button className="button submit" onClick={render}>Render</button>
            </div>
            <div id="renderImage" className='image-preview' ref={imageI}>
                SVG preview
            </div>
        </div>
    </div>

}
