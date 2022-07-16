import { useState, useEffect } from "react";
import axios from 'axios'
import { useRouter } from 'next/router'
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLessons from "../../components/modal/SingleCourseLessons";

const SingleCourse = ({ course }) => {
    // state
    const [showModal, setShowModal] = useState(false)
    const [preview, setPreview]= useState("");

    const router = useRouter();
    const { slug } = router.query
    // const { name, description, instructor, updateAt, lessons, image, price, paid, category } = course

    return (
        <>

            <SingleCourseJumbotron course={course} showModal={showModal} setShowModal={setShowModal} preview={preview} setPreview={setPreview} />

            {showModal ? course.lessons[0].video.Location : "don't show"}
            <PreviewModal showModal={showModal} setShowModal={setShowModal} preview={preview} />

            {course.lessons && (
                <SingleCourseLessons 
                    lessons={course.lessons} 
                    setPreview={setPreview} 
                    showModal={showModal} 
                    setShowModal={setShowModal}
                />
            )}
        </>
    )
};

export async function getServerSideProps({ query }) {
    console.log('query')
    const { data } = await axios.get(`${process.env.API}/course/${query.slug}`)
    return {
        props: {
            course: data
        }
    }
}

export default SingleCourse