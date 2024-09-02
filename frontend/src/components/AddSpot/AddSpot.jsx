import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import './AddSpot.css';
import { createSpotThunk, loadAllSpotsThunk } from "../../store/spot";

const AddSpot = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ]= useState('');
    const [ country, setCountry ] = useState('');
    // const [ lat, setLat ] = useState('');
    // const [ lng, setLng ] = useState('');
    const [ price, setPrice ] = useState('');
    const [ previewImage, setPreviewImage ] = useState('');
    const [ images, setImages ] = useState('');
    const [ submitted, setSubmitted ] = useState(false);
    const [ errors, setErrors ] = useState({});

    useEffect(() => {
        const errors = {};
        if(name.length <= 0) errors.name = 'Name is required';
        if(description.length < 30) errors.description = 'Description must be at least 30 characters';
        if(address.length < 5) errors.address = 'Address is required';
        if(city.length <= 0) errors.city = 'City is required'
        if(state.length <= 0) errors.state = 'State is required'
        if(country.length <= 0) errors.country = 'Country is required';
        // if(lat < -90 || lat > 90) errors.lat = 'Latitude must be between -90 and 90';
        // if(lng < -180 || lng > 180) errors.lng = 'Longitude must be between -180 and 180';
        if(price <= 0) errors.price = 'Price must be a positive number';
        if(!previewImage) errors.previewImage = 'Preview image must be provided';

        setErrors(errors);
    }, [name, description, address, city, state, country, price, previewImage])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true)
        const spot = { name, description, address, city, state, country, price, previewImage }
        const createdSpot = await dispatch(createSpotThunk(spot))
        navigate(`/spots/${createdSpot.id}`)
    }

    useEffect(() => {
        return() => {
            setName('');
            setDescription('');
            setAddress('');
            setCity('');
            setState('');
            setCountry('');
            // setLat('');
            // setLng('');
            setPrice('');
            setPreviewImage('')
        }
    }, [])

    useEffect(() => {
        async function getAllSpots() {
            await dispatch(loadAllSpotsThunk())
        }
        getAllSpots()
    }, [dispatch])

    console.log(errors)
    return (
        <div className="add_spot">
            <div className="starting_spot">
            <h3>Create a New Spot</h3>
            <h4>Where&apos;s your spot located?</h4>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <form onSubmit={handleSubmit}>
                <div className='spot_input'>
                    <label>Country</label>
                    <input
                    value={country}
                    placeholder="Country"
                    onChange={(e) => setCountry(e.target.value)}
                    ></input>
                    {submitted && errors.country && <p className="errors"> {errors.country}</p>}
                </div>
                <div className="spot_input">
                    <label>Street Address</label>
                    <input
                    value={address}
                    placeholder="Street Address"
                    onChange={(e) => setAddress(e.target.value)}
                    ></input>
                    {submitted && errors.address && <p className="errors">{errors.address}</p>}
                </div>
                <div className='last_input'>
                    <label>City</label>
                    <input
                    value={city}
                    placeholder="City"
                    onChange={(e)=> setCity(e.target.value)}
                    ></input>
                    {submitted && errors.city && <p className="errors">{errors.city}</p>}
                    <label>State</label>
                    <input
                    value={state}
                    placeholder="State"
                    onChange={(e) => setState(e.target.value)}
                    ></input>
                    {submitted && errors.state && <p className="errors">{errors.state}</p>}
                {/* <div className="last_input"> */}
                    {/* <label>Latitude</label>
                    <input
                    value={lat}
                    onChange={(e) => setLat(+e.target.value)}
                    ></input>,
                    <label>Longitude</label>
                    <input
                    value={lng}
                    onChange={(e) => setLng(+e.target.value)}
                    ></input>
                </div> */}
                </div>
                <div className="spot_description">
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking,
                    and what you love about the neighborhood.</p>
                <input
                value={description}
                className='description_box'
                placeholder="Please write at least 30 characters"
                onChange={(e) => setDescription(e.target.value)}
                ></input>
                {submitted && errors.description && <p className="errors">{errors.description}</p>}
                </div>
                <div className="spot_title">
                    <h3>Create a title for your spot</h3>
                    <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
                    <input
                    value={name}
                    placeholder="Name of your spot"
                    onChange={(e) => setName(e.target.value)}
                    ></input>
                    {submitted && errors.name && <p className="errors">{errors.name}</p>}
                </div>
                <div className="spot_price">
                    <h3>Set a base price for your spot</h3>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <p className="bottom_price">$
                        <input
                        value={price}
                        className="spot_price_input"
                        placeholder="Price per night(USD)"
                        onChange={(e) => setPrice(e.target.value)}
                        ></input>
                        {submitted && errors.price && <p className="errors">{errors.price}</p>}
                    </p>
                </div>
                <div className="spot_photos">
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot</p>
                    <input
                    value={previewImage}
                    placeholder="Preview Image URL"
                    onChange={(e) => setPreviewImage(e.target.value)}
                    >
                    </input>
                    {submitted && errors.previewImage && <p className="errors">{errors.previewImage}</p>}
                    <input
                    value={images}
                    placeholder="Image URL"
                    onChange={(e) => setImages(e.target.value)}
                    ></input>
                    {submitted && errors.images && <p className="errors">{errors.images}</p>}
                    <input
                    value={images}
                    placeholder="Image URL"
                    onChange={(e) => setImages(e.target.value)}
                    ></input>
                    <input
                    value={images}
                    placeholder="Image URL"
                    onChange={(e) => setImages(e.target.value)}
                    ></input>
                    <input
                    value={images}
                    placeholder="Image URL"
                    onChange={(e) => setImages(e.target.value)}
                    ></input>
                </div>
                <div className="submit">
                <button type='submit'>Create Spot</button>
                </div>
            </form>
            </div>
        </div>
    )
}

export default AddSpot;
