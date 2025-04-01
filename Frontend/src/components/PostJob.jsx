import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllJobErrors,
  postJob,
  resetJobSlice,
} from "../store/slices/jobSlice";

const JobPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("/UX");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState();
  const [deliveryTime, setDeliveryTime] = useState();
  const [features, setFeatures] = useState("");
  const [jobPostedOn, setJobPostedOn] = useState(new Date());
  const [postedBy, setPostedBy] = useState("");
  const [status, setStatus] = useState("open"); // Default value

  const { loading, error, message } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  const handlePostJob = () => {
    const jobData = {
      title,
      description,
      category,
      subCategory,
      tags,
      price,
      deliveryTime,
      features,
      jobPostedOn,
      postedBy,
      status,
    };
    dispatch(postJob(jobData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
    }
  }, [dispatch, error, message]);

  return (
    <div className="account_components">
      <h3>Post A Job</h3>
      <div>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Category</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label>SubCategory</label>
        <input type="text" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} />
      </div>
      <div>
        <label>Tags</label>
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <div>
        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
      </div>
      <div>
        <label>Delivery Time (Days)</label>
        <input type="number" value={deliveryTime} onChange={(e) => setDeliveryTime(Number(e.target.value))} />
      </div>
      <div>
        <label>Features</label>
        <input type="text" value={features} onChange={(e) => setFeatures(e.target.value)} />
      </div>
      <div>
        <label>Posted By</label>
        <input type="text" value={postedBy} onChange={(e) => setPostedBy(e.target.value)} />
      </div>
      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
  <option value="open">Open</option>
  <option value="closed">Closed</option>
  <option value="in-progress">In Progress</option>
</select>

      </div>
      <div>
        <button className="btn" onClick={handlePostJob} disabled={loading}>
          Post Job
        </button>
      </div>
    </div>
  );
};

export default JobPost;
