import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postJob } from "../store/slices/jobSlice";
import { useNavigate } from "react-router-dom";
import "./PostJob.css";
const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.jobs);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    tags: "",
    price: "",
    deliveryTime: "",
    revisions: "",
    features: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      title,
      description,
      category,
      price,
      deliveryTime,
      features,
    } = formData;

    if (!title || !description || !category || !price || !deliveryTime || !features || !thumbnailFile) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }

    const jobData = new FormData();
    jobData.append("title", formData.title);
    jobData.append("description", formData.description);
    jobData.append("category", formData.category);
    jobData.append("subCategory", formData.subCategory);
    jobData.append("tags", JSON.stringify(formData.tags.split(",").map(tag => tag.trim())));
    jobData.append("price", formData.price);
    jobData.append("deliveryTime", formData.deliveryTime);
    jobData.append("revisions", formData.revisions);
    jobData.append("features", JSON.stringify(formData.features.split(",").map(f => f.trim())));
    jobData.append("jobThumbnail", thumbnailFile);

    dispatch(postJob(jobData)).then((res) => {
      if (res?.payload?.success) {
        navigate("/jobs");
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Post a New Job</h2>
      
      {error && <p className="text-red-500 text-center">{error}</p>}
      {message && <p className="text-green-500 text-center">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required className="input" />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="input" />
          <input type="text" name="subCategory" placeholder="Sub-category" value={formData.subCategory} onChange={handleChange} className="input" />
          <input type="text" name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} className="input" />
          <input type="number" name="price" placeholder="Price (NPR)" value={formData.price} onChange={handleChange} required className="input" />
          <input type="number" name="deliveryTime" placeholder="Delivery Time (days)" value={formData.deliveryTime} onChange={handleChange} required className="input" />
          <input type="number" name="revisions" placeholder="Number of Revisions" value={formData.revisions} onChange={handleChange} className="input" />
          <input type="text" name="features" placeholder="Features (comma-separated)" value={formData.features} onChange={handleChange} required className="input" />
        </div>

        <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} required className="input h-28" />

        <input type="file" accept="image/*" onChange={handleFileChange} required className="w-full file-input" />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
