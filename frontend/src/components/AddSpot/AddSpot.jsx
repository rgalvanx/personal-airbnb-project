import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import './AddSpot.css';
import { createSpotThunk, loadAllSpotsThunk } from "../../store/spot";
// import * as spotActions from '../../store/spot'

const AddSpot = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ]= useState('');
    const [ country, setCountry ] = useState('');
    const [ price, setPrice ] = useState(0);
    const [ previewImage, setPreviewImage ] = useState('');
    const [ image2, setImages2 ] = useState('');
    const [ image3, setImages3 ] = useState('');
    const [ image4, setImages4 ] = useState('');
    const [ image5, setImages5 ] = useState('');
    const [ submitted, setSubmitted ] = useState(false);
    const [ errors, setErrors ] = useState({});

    useEffect(() => {
        const errors = {};
        const validImg = [ '.png', '.jpg', '.jpeg', '.svg', '.heic' ];
        const imageExt = (image) => {
            const ext = '.' + image.split('.').pop().toLowerCase();
            return validImg.includes(ext);
        }

        if(name.length <= 0) errors.name = 'Name is required';
        if(description.length < 30) errors.description = 'Description must be at least 30 characters';
        if(address.length < 5) errors.address = 'Address is required';
        if(city.length <= 0) errors.city = 'City is required'
        if(state.length <= 0) errors.state = 'State is required'
        if(country.length <= 0) errors.country = 'Country is required';
        if(price <= 0 ) errors.price = 'Price must be a positive number';
        if(previewImage === undefined) errors.previewImage = 'Provide valid image'
        if(!previewImage) errors.previewImage = 'Preview image must be provided';
        if(!imageExt(previewImage)) errors.previewImage = 'Please provide a valid image';
        if(image2 && !imageExt(image2)) errors.image2 = 'Please provide a valid image';
        if(image3 && !imageExt(image3)) errors.image3 = 'Please provide a valid image';
        if(image4 && !imageExt(image4)) errors.image4 = 'Please provide a valid image';
        if(image5 && !imageExt(image5)) errors.image5 = 'Please provide a valid image';

        setErrors(errors);
    }, [name, description, address, city, state, country, price, previewImage, image2, image3, image4, image5])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true)
        if(Object.values(errors).length) return;
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
            setPrice(0);
            setPreviewImage('')
            setImages2('');
            setImages3('');
            setImages4('');
            setImages5('');
        }
    }, [])

    useEffect(() => {
        async function getAllSpots() {
            await dispatch(loadAllSpotsThunk())
        }
        getAllSpots()
    }, [dispatch])

    return (
        <div className="add_spot">
            <div className="starting_spot">
            <h3>Create a New Spot</h3>
            <h4>Where&apos;s your spot located?</h4>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <form >
                <div className='spot_input'>
                    <label>Country</label>
                    <input
                    value={country}
                    placeholder="Country"
                    onChange={(e) => setCountry(e.target.value)}
                    ></input>
                    {submitted && errors.country && <p className="newerrors"> {errors.country}</p>}
                </div>
                <div className="spot_input">
                    <label>Street Address</label>
                    <input
                    value={address}
                    placeholder="Street Address"
                    onChange={(e) => setAddress(e.target.value)}
                    ></input>
                    {submitted && errors.address && <p className="newerrors">{errors.address}</p>}
                </div>
                <div className='last_input'>
                    <label>City</label>
                    <input
                    value={city}
                    placeholder="City"
                    onChange={(e)=> setCity(e.target.value)}
                    ></input>
                    {submitted && errors.city && <p className="newerrors">{errors.city}</p>}
                    <label>State</label>
                    <input
                    value={state}
                    placeholder="State"
                    onChange={(e) => setState(e.target.value)}
                    ></input>
                    {submitted && errors.state && <p className="newerrors">{errors.state}</p>}
                </div>
                <div className="spot_description">
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amenities like fast wifi or parking,
                    and what you love about the neighborhood.</p>
                <textarea
                value={description}
                className='description_box'
                placeholder="Please write at least 30 characters"
                onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                {submitted && errors.description && <p className="newerrors">{errors.description}</p>}
                </div>
                <div className="spot_title">
                    <h3>Create a title for your spot</h3>
                    <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
                    <input
                    value={name}
                    placeholder="Name of your spot"
                    onChange={(e) => setName(e.target.value)}
                    ></input>
                    {submitted && errors.name && <p className="newerrors">{errors.name}</p>}
                </div>
                <div className="spot_price">
                    <h3>Set a base price for your spot</h3>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <p className="bottom_price">$
                        <input
                        type="number"
                        value={price}
                        className="spot_price_input"
                        placeholder="Price per night(USD)"
                        onChange={(e) => setPrice(e.target.value)}
                        ></input>
                        {submitted && errors.price && <p className="newerrors">{errors.price}</p>}
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
                    {submitted && errors.previewImage && <p className="newerrors">{errors.previewImage}</p>}
                    <input
                    value={image2}
                    placeholder="Image URL"
                    onChange={(e) => setImages2(e.target.value)}
                    ></input>
                    {submitted && errors.image2 && <p className="newerrors">{errors.image2}</p>}
                    <input
                    value={image3}
                    placeholder="Image URL"
                    onChange={(e) => setImages3(e.target.value)}
                    ></input>
                    {submitted && errors.image3 && <p className="newerrors">{errors.image3}</p>}
                    <input
                    value={image4}
                    placeholder="Image URL"
                    onChange={(e) => setImages4(e.target.value)}
                    ></input>
                    {submitted && errors.image4 && <p className="newerrors">{errors.image4}</p>}
                    <input
                    value={image5}
                    placeholder="Image URL"
                    onChange={(e) => setImages5(e.target.value)}
                    ></input>
                    {submitted && errors.image5 && <p className="newerrors">{errors.image5}</p>}
                </div>
                <div className="submit">
                <button onClick={handleSubmit} type='submit'>Create Spot</button>
                </div>
            </form>
            </div>
        </div>
    )
}

export default AddSpot;
