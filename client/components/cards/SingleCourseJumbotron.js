import { currencyFormatter } from "../../utils/helpers"
import { Badge, Modal } from "antd"
import ReactPlayer from 'react-player'

const SingleCourseJumbotron = ({ course, showModal, setShowModal, preview, setPreview }) => {
  const { name, description, instructor, updateAt, lessons, image, price, paid, category } = course

  return (
    <div class="jumbotron bg-primary square">
    <div className="row">
        <div className="col-md-8">
            <h1 className="text-light font-weight-bold">{name}</h1>
            <div className="lead">
                {description && description.substring(0, 160)}...
            </div>
            {/* title */}

            <Badge count={category} style={{background: "#03a964"}} className="pd-4 mr-2" />
            {/* title */}
            <p>Created by {instructor.name}</p>
            {/* title */}
            <p>Last updated {new Date(updateAt).toLocaleDateString()}</p>
            {/* title */}
            <h4 className="text-light">{
                paid ? currencyFormatter({
                    amount: price,
                    currency : 'use'
                }) : 'Free'
            }</h4>
        </div>
        <div className="col-md-4">
            {JSON.stringify(lessons[0])}
            {lessons[0].video && lessons[0].video.Location ? 
            (<div onClick={() => {
                setPreview(lessons[0].video.Location)
                setShowModal(!showModal)
            }}>
                <ReactPlayer className="react-player-div" 
                    url={lessons[0].video.Location}
                    light={image.Location}
                    width="100%"
                    height="225px"
                />
            </div>) : (<div>
            
                    <img src = {image.Location} alt={name} className="img img-fluid" />
                
            </div>)}
            <p>show course image</p>
            <p>show enroll button</p>
            {/* show video preview or coure image */}
            {/* enroll button */}
        </div>
    </div>
</div>
  )
}

export default SingleCourseJumbotron

