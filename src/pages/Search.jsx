import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleTypeChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedType(selectedValue);
    setMenuVisible(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 max-w-xs border-b-2 md:border-r-2 md:min-h-screen bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-sm p-3 w-full focus:outline-none focus:ring focus:border-blue-500"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <hr />
          <div className="flex items-center justify-center">
            <label className="hidden sm:inline sm:h-0 text-gray-800 font-semibold">
              Type
            </label>
          </div>
          <div className="relative sm:hidden">
            <div className="cursor-pointer relative" onClick={toggleMenu}>
              <label
                htmlFor="menu-toggle"
                className="block cursor-pointer text-gray-800 font-semibold absolute top-1/2 transform -translate-y-1/2"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "-30px",
                  border: "1px solid slate" ,
                  padding: "5px 90px",
                  borderRadius:"3px"
                  
                }}
              >
                Type
              </label>
            </div>
            <input type="checkbox" id="menu-toggle" className="hidden" />
            <div
              id="menu"
              className={`absolute right-0 w-48 mt-2 py-2 bg-white border border-gray-300 rounded shadow-lg z-10 ${
                menuVisible ? "" : "hidden"
              }`}
            >
              <div className="flex flex-col gap-2 p-3">
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="rent"
                    className="w-5 h-5 text-blue-500"
                    onChange={handleChange}
                    checked={sidebardata.type === "rent"}
                  />
                  <span className="text-gray-700">Rent</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    id="sale"
                    className="w-5 h-5 text-blue-500"
                    onChange={handleChange}
                    checked={sidebardata.type === "sale"}
                  />
                  <span className="text-gray-700">Sale</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex  flex-wrap items-center justify-evenly gap-4">
            <div className="flex gap-2  items-center">
              <input
                type="checkbox"
                id="rent"
                className="w-5 h-5 text-blue-500"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span className="text-gray-700">Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="sale"
                className="w-5 h-5 text-blue-500"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span className="text-gray-700">Sale</span>
            </div>
          </div>
          <hr />
          <div className="flex items-center justify-center">
            <label className="text-gray-800 font-semibold">Amenities</label>
          </div>{" "}
          <div className="flex items-center gap-4 justify-evenly">
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="parking"
                className="w-5 h-5 text-blue-500"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span className="text-gray-700">Parking</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 h-5 text-blue-500"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span className="text-gray-700">Furnished</span>
            </div>
          </div>
          <hr />
          <div className="flex items-center gap-4 justify-evenly">
            <label className="text-gray-800 font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3 focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <hr />
          <button className="bg-blue-500 text-white p-4 rounded-md uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-3xl font-semibold border-b p-4 text-blue-500 mt-5 bg-white shadow-md">
          Search Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-gray-800">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-gray-800 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-4 text-center w-full bg-blue-100 hover:bg-blue-200 rounded-md transition-all duration-300 ease-in-out"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
