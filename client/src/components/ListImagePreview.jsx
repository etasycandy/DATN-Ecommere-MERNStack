import { AiFillCloseCircle } from "react-icons/ai";

const ListImagePreview = ({ images }) => {
    return (
      <div className="w-full grid grid-cols-6 gap-4 mb-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img className="w-full h-20 object-cover" src={image} />
          </div>
        ))}
      </div>
    );
}

export default ListImagePreview;