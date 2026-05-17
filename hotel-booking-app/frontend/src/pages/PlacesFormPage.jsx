import PhotosUploader from "../components/place/PhotosUploader.jsx";
import Perks from "../components/place/Perks.jsx";
import { useEffect, useState } from "react";
import { getPlaceById, updatePlace, createPlace } from "../api/placesApi.js";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../components/layout/AccountNav.jsx";
import { toastPromise } from "../utils/toast.js";

export default function PlacesFormPage() {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 Load existing place (edit mode)
  useEffect(() => {
    if (!id) return;

    getPlaceById(id).then(response => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-xl font-semibold mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  // 🔥 Save place
  async function savePlace(ev) {
    ev.preventDefault();
    setLoading(true);

    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    try {
      if (id) {
        // UPDATE
        await toastPromise(
          updatePlace({ id, ...placeData }),
          "Updating your place...",
          "Place updated successfully!",
          "Error updating place"
        );
      } else {
        // CREATE
        await toastPromise(
          createPlace(placeData),
          "Creating your place...",
          "Place created successfully!",
          "Error creating place"
        );
      }
      setRedirect(true);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />;
  }

  return (
    <div>
      <AccountNav />

      <form onSubmit={savePlace} className="max-w-2xl mx-auto mt-6 card">

        {preInput('Title', 'Short catchy title')}
        <input
          type="text"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          placeholder="My lovely apartment"
        />

        {preInput('Address', 'Location of your place')}
        <input
          type="text"
          value={address}
          onChange={ev => setAddress(ev.target.value)}
          placeholder="Address"
        />

        {preInput('Photos', 'Upload images')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput('Description', 'Describe your place')}
        <textarea
          value={description}
          onChange={ev => setDescription(ev.target.value)}
        />

        {preInput('Perks', 'Select perks')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-3">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput('Extra Info', 'House rules, etc')}
        <textarea
          value={extraInfo}
          onChange={ev => setExtraInfo(ev.target.value)}
        />

        {preInput('Check-in & Check-out', 'Add timings')}
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={checkIn}
            onChange={ev => setCheckIn(ev.target.value)}
            placeholder="Check-in (14:00)"
          />
          <input
            type="text"
            value={checkOut}
            onChange={ev => setCheckOut(ev.target.value)}
            placeholder="Check-out (11:00)"
          />
        </div>

        {preInput('Guests & Price', '')}
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="number"
            value={maxGuests}
            onChange={ev => setMaxGuests(ev.target.value)}
            placeholder="Max guests"
          />
          <input
            type="number"
            value={price}
            onChange={ev => setPrice(ev.target.value)}
            placeholder="Price per night"
          />
        </div>

        <div className="mt-6">
          <button className="primary" disabled={loading}>
            {loading ? "Saving..." : "Save Place"}
          </button>
        </div>

      </form>
    </div>
  );
}