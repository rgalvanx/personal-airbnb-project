import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spot";
import { useDispatch } from "react-redux";
import './ConfirmDeleteSpotModal.css';

function ConfirmDeleteSpotModal({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();


    const deleteSpot = () => {
        dispatch(deleteSpotThunk(spotId))
        closeModal()
    }
    console.log(spotId)

    return (
        <div className="delete_spot_modal">
            <h1 className="confirm_delete_title">Confirm Delete</h1>
            <div className="subtitle">
                <p className="confirmation_note">Are you sure you want to remove this spot from the listings?</p>
            </div>
            <div className="buttons">
                <button className="yes_button" onClick={deleteSpot}>Yes (Delete Spot)</button>
                <button className='no_button' onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    )
}

export default ConfirmDeleteSpotModal;
