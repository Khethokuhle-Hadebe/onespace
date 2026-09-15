import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Link2, Calendar } from "lucide-react";
import MobileNav from "../components/MobileNav";

const API_URL = import.meta.env.VITE_API_URL;

const COVER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=300&fit=crop";

const DEFAULT_BIO = "";

export default function Profile() {
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("Zilethiwe");
  const [username, setUsername] = useState("@ZilethiweHadebe");
  const [bio, setBio] = useState(DEFAULT_BIO);
  const [profilePicture, setProfilePicture] = useState("");
  const [profilePreview, setProfilePreview] = useState("");

  const [draftName, setDraftName] = useState("");
  const [draftUsername, setDraftUsername] = useState("");
  const [draftBio, setDraftBio] = useState("");
  const [profileError, setProfileError] = useState("");

 useEffect(() => {
  const token = localStorage.getItem("onespace-token");

  if (!token) return;

  fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setName(data.user.displayName || data.user.username);
        setUsername(`@${data.user.username}`);
        setBio(data.user.bio ?? DEFAULT_BIO);
        setProfilePicture(data.user.profilePicture || "");
      }
    })
    .catch((error) => {
      console.error("Failed to load profile:", error);
    });
}, []); 

  
  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <div className="sticky top-0 z-30 border-b border-pink-dim bg-background/90 backdrop-blur-md px-4 py-4">
        <h1 className="text-lg font-bold">Profile</h1>
      </div>

      <div className="mx-auto max-w-xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Cover */}
          <div className="relative h-32">
            <img src={COVER} alt="cover" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <div className="px-4">
            
            <div className="-mt-1 mb-1 flex items-end justify-between">
              <div className="rounded-full p-1 bg-gradient-to-tr from-pink via-purple-500 to-orange-400">
                <div className="rounded-full p-1 bg-background">
                  <img
                    src={
  profilePreview
    ? profilePreview
    : profilePicture
      ? typeof profilePicture === "string" && profilePicture.startsWith("http")
        ? profilePicture
        : `${API_URL}${profilePicture}`
      : "/default-avatar.png"
}
                    alt="me"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  setDraftName(name);
                  setDraftUsername(username);
                  setDraftBio(bio);
                  setProfileError("");
                  setEditing(true);
              }}
                className="rounded-xl border border-pink/40 px-4 py-1.5 text-sm font-semibold text-pink hover:bg-pink/10 transition-colors">
                 Edit Profile
              </button>
            </div>
            {editing && (
              <div className="mb-4 rounded-xl border border-pink/40 bg-pink/10 p-4 space-y-3">
               <input
                 value={draftName}
                 onChange={(e) => setDraftName(e.target.value)}
                className="w-full rounded-lg border border-pink/30 bg-background p-2"
                placeholder="Name"
              />

           <div>
  <label className="mb-1 block text-sm font-semibold">
    Profile Picture
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
  const file = e.target.files?.[0];

  if (file) {
    setProfilePicture(file);
    setProfilePreview(URL.createObjectURL(file));
  }
}}
    className="w-full rounded-lg border border-pink/30 bg-background p-2"
  />
</div>   

    <input
       value={draftUsername}
       onChange={(e) => setDraftUsername(e.target.value)}
      className="w-full rounded-lg border border-pink/30 bg-background p-2"
      placeholder="Username"
    />

    <textarea
       value={draftBio}
       onChange={(e) => setDraftBio(e.target.value)}
      className="w-full rounded-lg border border-pink/30 bg-background p-2"
      rows="3"
      placeholder="Bio"
    />
    {profileError && (
      <p className="text-sm font-medium text-red-500">
      {profileError}
      </p>
   )}

      <div className="flex gap-2">
 <button
  onClick={async () => {
    const token = localStorage.getItem("onespace-token");

    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
          username: draftUsername.replace(/^@/, ""),
          displayName: draftName,
          bio: draftBio,
         }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setName(data.user.displayName || data.user.username);
        setUsername(`@${data.user.username}`);
        setBio(data.user.bio ?? DEFAULT_BIO);
      } else {
        setProfileError(data.message || "Failed to update profile");
        return;
      }

      if (profilePicture instanceof File) {
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);

        const pictureResponse = await fetch(
          `${API_URL}/api/profile/picture`,
          {
            method: "PATCH",
            headers: {
              Authorization: token,
            },
            body: formData,
          }
        );

        const pictureData = await pictureResponse.json();

        if (pictureData.success) {
          setProfilePicture(pictureData.profilePicture);
        } else {
          console.error(
            "Profile picture upload failed:",
            pictureData.message
          );
        }
      }

      setEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  }}
  className="rounded-lg bg-pink px-4 py-2 text-white font-semibold"
>
  Save Profile
</button>

  <button
    onClick={() => setEditing(false)}
    className="rounded-lg border border-pink/40 px-4 py-2 font-semibold"
  >
    Cancel
  </button>
</div>
    
  </div>
)}
           
            <div>
              <h2 className="text-xl font-bold">{name}</h2> 
              <p className="text-sm text-muted-foreground">{username}</p>
              <p className="mt-2 text-sm leading-relaxed">{bio}</p> 
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> South Africa</span>
                <span className="flex items-center gap-1"><Link2 className="h-3.5 w-3.5" /> onespace.io</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined 2024</span>
              </div>

              <div className="mt-4 flex gap-6 border-t border-pink-dim pt-4">
                {[["342", "Posts"], ["12.4K", "Followers"], ["890", "Following"]].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-base font-bold">{v}</p>
                    <p className="text-xs text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <MobileNav />
    </div>
  );
}