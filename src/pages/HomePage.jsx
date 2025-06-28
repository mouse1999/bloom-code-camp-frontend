
import { Link } from 'react-router-dom';
const HomePage = () => {

    return (
        <div className="home-page">
        <h1>Welcome to BloomCode Camp</h1>
        <p>Your journey to becoming a software developer starts here!</p>
        <p>Explore our courses, connect with mentors, and build your future.</p>
        <Link to="/register" className="btn btn-primary">Get Started</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
    );


}
export default HomePage