"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { DataContext } from "./DataContext";

const DataWrapper = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);

  const reload = (key) => {
    if (key === "dbUser") {
      fetchUserData();
    } else if (key === "categories") {
      fetchCategories();
    } else if (key === "banners") {
      fetchBanners();
    }
  };

  const fetchUserData = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const res = await fetch("/api/user/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });
        const data = await res.json();
        setUser(data.user);
        setIsLoading({ ...isLoading, dbUser: false });
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    }
  }, [session?.user]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/user/getCategories");
      const data = await res.json();
      setCategories(data.categories || []);
      setIsLoading({ ...isLoading, categories: false });
    } catch (err) {
      console.error("Products fetch failed:", err);
    }
  }, []);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch("/api/user/getBanners");
      const data = await res.json();
      setBanners(data.banners || []);
      setIsLoading({ ...isLoading, banners: false });
    } catch (err) {
      console.error("Bannes fetch failed:", err);
    }
  }, []);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  useEffect(() => {
    setIsLoading({ categories: true, banners: true, dbUser: true });
  }, []);

  useEffect(() => {
    const isAdminUser = async () => {
      const res = await fetch("/api/admin/verify");
      const data = await res.json();
      setisAdmin(data.isAdmin);
    };

    isAdminUser();

    if (status === "authenticated") {
      fetchUserData();
      setIsLogedIn(true);
    } else {
      setUser(null);
      setIsLoading({ ...isLoading, dbUser: false });
      setIsLogedIn(false);
    }
  }, [status, session?.user, fetchUserData]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <DataContext.Provider
      value={{
        dbUser: user,
        categories,
        banners,
        isAdmin,
        isLoading,
        reload,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataWrapper;
