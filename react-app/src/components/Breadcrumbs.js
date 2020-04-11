import React from 'react'
import { Link } from 'react-router-dom'
import "./Breadcrumbs.css"

function Breadcrumbs(props) {
    return (
        <nav aria-label="breadcrumb" className="breadcrumbNav">
            <ol className="breadcrumb">
                {props.links.map(link => (
                    <li className="breadcrumb-item">
                        <Link to={link.address}>{link.name}</Link>
                    </li>
                ))}
                <li className="breadcrumb-item active" aria-current="page">{props.currentPage}</li>
            </ol>
        </nav>
    )
}
export default Breadcrumbs