import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import './AddSpot.css';

const AddSpot = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ]= useState('');
    const [ country, setCountry ] = useState('');
    const [ lat, setLat ] = useState(0);
    const [ lng, setLng ] = useState(0);
    const [ price, setPrice ] = useState(0);
    const [ previewImage, setPreviewImage ] = useState('');
    const [ images, setImages ] = useState('');
    const [ errors, setErrors ] = useState({});

    useEffect(() => {

    })

    const validateSpot = () => {
        const errors = {};
        if(name.length < 0) errors.name = 'Name is required';
        if(description.length < 30) errors.description = 'Description must be at least 30 characters';
        if(address.length < 5) errors.address = 'Address is required';
        if(city.length < 0) errors.city = 'City is required'
        if(state.length < 0) errors.state = 'State is required'
        if(country.length < 0) errors.country = 'Country is required';
        if(lat < -90 || lat > 90) errors.lat = 'Latitude must be between -90 and 90';
        if(lng < -180 || lng > 180) errors.lng = 'Longitude must be between -180 and 180';
        if(price < 0) errors.price = 'Price must be a positive number';

        setErrors(errors);
    }

    // const onSubmit

    return (
        <div className="add_spot">
            <div className="starting_spot">
            <h3>Create a New Spot</h3>
            <h4>Where's your spot located?</h4>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <form>
                <div className='spot_input'>
                    <label > Country </label>
                    <input placeholder="Country"></input>
                </div>
                <div className="spot_input">
                    <label>Street Address</label>
                    <input placeholder="Street Address"></input>
                </div>
                <div className='last_input'>
                    <label>City</label>
                    <input placeholder="City"></input>
                    <label>State</label>
                    <input placeholder="State"></input>
                </div>
                {/* <div className="last_input">
                    <label>Latitude</label>
                    <input></input>,
                    <label>Longitude</label>
                    <input></input>
                </div> */}
                <div className="spot_description">
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking,
                    and what you love about the neighborhood.</p>
                <input className='description_box' placeholder="Please write at least 30 characters"></input>
                </div>
                <div className="spot_title">
                    <h3>Create a title for your spot</h3>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    <input placeholder="Name of your spot"></input>
                </div>
                <div className="spot_price">
                    <h3>Set a base price for your spot</h3>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <p className="bottom_price">$<input className="spot_price_input"placeholder="Price per night(USD)"></input> </p>
                </div>
                <div className="spot_photos">
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot</p>
                    <input placeholder="Preview Image URL"></input>
                    <input placeholder="Image URL"></input>
                    <input placeholder="Image URL"></input>
                    <input placeholder="Image URL"></input>
                    <input placeholder="Image URL"></input>
                </div>
                <div className="submit">
                <button >Create Spot</button>
                </div>
            </form>
            </div>
        </div>
    )
}

export default AddSpot;
