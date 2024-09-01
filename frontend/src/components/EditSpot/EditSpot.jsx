import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadOneSpotThunk } from "../../store/spot";
import AddSpot from "../AddSpot/AddSpot";

function EditSpot() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spot[spotId])

    useEffect(() => {
        dispatch(loadOneSpotThunk(spotId))
    }, [dispatch, spotId])


    return (
            <>
            <AddSpot
            spot={spot}
            formType="Update Your Spot"
            />
            </>
        )
}

export default EditSpot;
