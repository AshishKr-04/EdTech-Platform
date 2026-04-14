import React, { useState } from "react";
import api from "../utils/api";

const CreateCoursePage = () => {

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    lessons: [{ title: "", content: "", videoUrl: "" }],
  });

  const [videoPreview, setVideoPreview] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideoUpload = async (index, file) => {
    if (!file) return;

    // 🎬 PREVIEW
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview((prev) => ({ ...prev, [index]: previewUrl }));

    const formData = new FormData();
    formData.append("video", file);

    const res = await api.post("/upload/video", formData, {
      onUploadProgress: (e) => {
        setUploadProgress(Math.round((e.loaded * 100) / e.total));
      },
    });

    const updatedLessons = [...courseData.lessons];
    updatedLessons[index].videoUrl = res.data.url;

    setCourseData({ ...courseData, lessons: updatedLessons });
  };

  return (
    <div>
      {courseData.lessons.map((lesson, index) => (
        <div key={index}>

          <input type="file"
            onChange={(e) => handleVideoUpload(index, e.target.files[0])}
          />

          {/* 🎬 PREVIEW */}
          {videoPreview[index] && (
            <video src={videoPreview[index]} controls width="300" />
          )}

          {/* 📊 PROGRESS */}
          <p>{uploadProgress}%</p>

        </div>
      ))}
    </div>
  );
};

export default CreateCoursePage;