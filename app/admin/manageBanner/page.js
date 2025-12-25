"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useData } from "@/components/DataContext";
import { UploadButton } from "@uploadthing/react";
import "@/stylesheets/admin/banner.css";

export default function BannerManager() {
  const { banners, reload } = useData();
  const [bannerImage, setBannerImage] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBanner = async () => {
    if (!bannerImage || !name) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/banner/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerImage, name, link }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add banner");

      toast.success("Banner added successfully!");
      setBannerImage("");
      setName("");
      setLink("");
      reload("banners");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      const res = await fetch("/api/admin/banner/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete banner");
      toast.success("Banner deleted successfully!");
      reload("banners");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="banner-page">
      <ToastContainer />
      <h1 className="banner-title">Manage Banners</h1>

      <div className="banner-form">
        <UploadButton
          endpoint="bannerUploader"
          appearance={{
            button:
              "w-full bg-yellow-500 flex flex-col hover:bg-yellow-700 !text-white font-medium px-4 py-2 rounded-md transition-all shadow",
            allowedContent: "text-sm text-gray-500 mt-1",
          }}
          onClientUploadComplete={(res) => setBannerImage(res[0].url)}
          onUploadError={(error) => {
            toast.error("Upload failed: " + error.message);
          }}
        />

        <input
          type="text"
          placeholder="Banner Text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Banner Link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button onClick={handleAddBanner} disabled={loading}>
          {loading ? "Adding..." : "Add Banner"}
        </button>
      </div>

      <div className="banner-grid">
        {banners?.length > 0 ? (
          banners.map((banner) => (
            <div key={banner._id} className="banner-card">
              <Image
                width={1100}
                height={350}
                src={banner.image}
                alt={banner.text}
              />
              <div className="banner-info">
                <h2>{banner.text}</h2>
                {banner.link && (
                  <Link href={banner.link} target="_blank">
                    {banner.link}
                  </Link>
                )}
                <button onClick={() => handleDeleteBanner(banner._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-banner">No banners found.</p>
        )}
      </div>
    </div>
  );
}
