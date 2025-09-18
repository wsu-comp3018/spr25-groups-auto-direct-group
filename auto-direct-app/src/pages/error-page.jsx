import {
	Link
} from "react-router-dom";
import '../App.css'

function ErrorPage() {

	return (
		<>
			<h1>Error :&lt;</h1>
			<p> error, please return to <Link to={`/`}>homepage</Link> </p>
		</>
	)
}

export default ErrorPage
