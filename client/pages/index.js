import { useState, useEffect } from "react";
import axios from 'axios'
import CourseCard from '../components/cards/CourseCard'

const Index = ({ courses }) => {
    // const [courses, setCourses] = useState([]);

    // useEffect(() => {
    //     const fetchCourses = async () => {
    //         const {data} = await axios.get('/api/courses');
    //         setCourses(data);
    //     }

    //     fetchCourses();
    // }, [])

    return (
        <>
            <h1 className="jumbotron text-center bg-primary">Online Education Market</h1>
            <div className="container-fluid">
                <div className="row">
                    { courses.map(c => (
                        <div className="col-md-4" key={c._id}>
                            <CourseCard course={c} />
                            {/* <pre>{JSON.stringify(c, null ,4)}</pre> */}
                        </div>
                    ))}
                </div> 
            </div>
        </>
    )
}

export async function getServerSideProps (){
    const {data} = await axios.get(`${process.env.API}/courses`)
    return {
        props: {
            courses: data,
            
        }
    }
}


export default Index;