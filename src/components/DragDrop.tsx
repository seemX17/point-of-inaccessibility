type Props = {
    onFileChange: any;
}

export function DragDrop(props: Props) {
    return <div className="drag-area">
        <div className="icon"><i className="fas fa-cloud-upload-alt"></i></div>
        <header>Drag &amp; Drop to Upload File</header>
        <span>OR</span>
        <button className="button-outline">Browse File
            <input type="file" name="polygon" accept="image/svg+xml" onChange={(event) =>{props.onFileChange(event)}} />
        </button>
    </div>
}