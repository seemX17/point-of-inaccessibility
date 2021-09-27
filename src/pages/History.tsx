import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImages, imageModel } from "shared/services/images";

export function History() {
    const [list, setList] = useState([]);

    useEffect(() => {
        //fetch list from db
        getImages().then((res) => {
            setList(res.data)
        })
    }, [])

    return <div className="history-page">
        <div className="App-navigation">
            <h2 className="title">History</h2>
            <Link to="/" className="App-link">  <i className="fas fa-chevron-left"></i> Add new</Link>
        </div>
        <ul className="container">
            {
                list.map((item: imageModel) =>
                (<li key={item.id}>
                    <div className="card">
                        <div className="image-container" dangerouslySetInnerHTML={{ __html: item.svg }} />
                        <div className="container">
                            <p><b>Name: </b>{item.name}</p>
                            <p><b>Created At: </b> {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </li>)
                )
            }
        </ul>
    </div>
}