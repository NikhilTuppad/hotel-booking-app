import { useEffect, useState } from "react";
import { getReviews, addReview } from "../../api/reviewsApi.js";
import { Star, UserCircle2 } from "lucide-react";
import { showSuccess, showError } from "../../utils/toast.js";

export default function ReviewSection({ placeId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // 🔥 fetch reviews
  useEffect(() => {
    getReviews(placeId).then((res) => {
      setReviews(res.data);
    });
  }, [placeId]);

  // 🔥 add review
  async function handleAddReview() {
    if (!comment.trim()) {
      showError("Please enter a review comment.");
      return;
    }

    try {
      await addReview({
        place: placeId,
        rating,
        comment,
      });

      setComment("");
      setRating(5);

      // reload reviews
      const res = await getReviews(placeId);
      setReviews(res.data);
      showSuccess("Review submitted successfully!");
    } catch (err) {
      showError("Failed to add review. Please try again.");
    }
  }

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="">
      <div className="flex items-center gap-2 mb-8">
        <Star className="w-6 h-6 fill-gray-900 stroke-gray-900" />
        <h2 className="text-2xl font-bold">
          {avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {/* ⭐ Add Review */}
      <div className="mb-10 glass-deep p-6 rounded-3xl border border-white/60 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Leave a review</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl bg-white outline-none focus:ring-2 focus:border-brand focus:ring-brand/20 font-medium text-gray-800 transition-shadow shadow-sm"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? 's' : ''}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Share details of your own experience at this place..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl flex-1 outline-none focus:ring-2 focus:border-brand focus:ring-brand/20 transition-shadow shadow-sm"
            onKeyDown={(e) => {
              if(e.key === 'Enter') handleAddReview();
            }}
          />

          <button
            onClick={handleAddReview}
            className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-semibold transition-colors active:scale-95 shadow-md"
          >
            Submit
          </button>
        </div>
      </div>

      {/* 📄 Show Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
        {reviews.length === 0 && (
          <p className="text-gray-500 col-span-2">Be the first to review this place!</p>
        )}

        {reviews.map((r) => (
          <div key={r._id} className="flex flex-col">
            <div className="flex items-center gap-4 mb-3">
              <UserCircle2 className="w-12 h-12 text-gray-400 stroke-1" />
              <div>
                <div className="font-bold text-gray-900 text-[15px]">
                  {r.user?.name || "Guest"}
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-1.5 font-medium">
                  <div className="flex items-center">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gray-900 stroke-gray-900" />
                    ))}
                  </div>
                  <span>·</span>
                  <span>{new Date(r.createdAt).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-800 leading-relaxed font-light">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}