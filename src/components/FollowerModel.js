

const Modal = ({ followers,type, onClose }) => {



    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-lg w-[90%] sm:w-[50%] max-h-[80%] overflow-y-auto p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Followers</h2>
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          <ul>
            {followers.map((follower) => (
              <li key={follower._id} className="py-2 border-b text-black border-gray-300">
                {follower.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

export default Modal;