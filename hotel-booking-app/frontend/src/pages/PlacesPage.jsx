import { Link, useParams } from "react-router-dom";
import AccountNav from "../components/layout/AccountNav.jsx";
import { useEffect, useState } from "react";
import PlaceImg from "../components/ui/PlaceImg.jsx";
import { getUserPlaces } from "../api/placesApi.js";

export default function PlacesPage() {
  const { action } = useParams();
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    getUserPlaces().then(({ data }) => {
      setPlaces(data);
    }).catch(err => {
      console.error("Error fetching places:", err);
    });
  }, []);

  return (
    <div>
      <AccountNav />

      {/* Add new place button */}
      <div className="text-center">
        <Link
          className="bg-primary text-white py-2 px-6 rounded-full inline-flex gap-1 items-center"
          to={'/account/places/new'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
          </svg>
          Add new place
        </Link>
      </div>

      {/* Places List */}
      <div className="mt-6 space-y-4">
        {places.length > 0 && places.map(place => (
          <Link
            to={'/place/' + place._id}
            key={place._id}
            className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl hover:bg-gray-200 transition"
          >
            {/* Image */}
            <div className="w-32 h-32 shrink-0">
              <PlaceImg
                className="rounded-xl object-cover w-full h-full"
                place={place}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold">{place.title}</h2>

                <p className="text-sm mt-1 text-gray-500">
                  {place.address}
                </p>

                <p className="text-sm mt-2 text-gray-600 line-clamp-2">
                  {place.description}
                </p>
              </div>

              {/* Price + Guests */}
              <div className="mt-2">
                <div className="font-semibold text-lg">
                  ₹{place.price} / night
                </div>

                <div className="text-gray-600 text-sm flex items-center gap-1">
                  👥 {place.maxGuests || 1} guests
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}