import { Link } from "react-router-dom";

export function History() {
    return <div>
        <div className="App-navigation">
            <Link to="/" className="App-link">  <i className="fas fa-chevron-left"></i> Add new</Link>
        </div>
    </div>
}