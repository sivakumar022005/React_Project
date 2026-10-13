import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import { useTheme } from "../context/ThemeContext";

/* =========================================================
   STORAGE
========================================================= */

const PROFILE_STORAGE_KEY = "task-app-profiles";
const TASK_STORAGE_KEY = "task-forge-tasks";

const TASKS_UPDATED_EVENT = "task-forge-tasks-updated";
const ACCOUNT_UPDATED_EVENT = "task-forge-account-updated";

/* =========================================================
   DEFAULT PROFILE
========================================================= */

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  role: "Full Stack Java Developer",
  bio:
    "Computer Science graduate and Full Stack Developer focused on building clean, responsive and user-friendly web applications using Java, JavaScript, React and SQL.",
  location: "Chennai, Tamil Nadu, India",
  website: "",
};

/* =========================================================
   STORAGE HELPERS
========================================================= */

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    return false;
  }
};

/* =========================================================
   GET CURRENT LOGGED-IN USER
========================================================= */

const getCurrentUser = () => {
  const userEmail = localStorage.getItem("userEmail");

  const oldAccount = readStorage("userAccount", null);

  const accounts = readStorage("userAccounts", []);

  if (userEmail) {
    const normalizedEmail = userEmail
      .trim()
      .toLowerCase();

    if (Array.isArray(accounts)) {
      const account = accounts.find(
        (item) =>
          String(item?.email || "")
            .trim()
            .toLowerCase() === normalizedEmail
      );

      if (account) {
        return account;
      }
    }

    if (
      oldAccount &&
      String(oldAccount.email || "")
        .trim()
        .toLowerCase() === normalizedEmail
    ) {
      return oldAccount;
    }
  }

  if (oldAccount) {
    return oldAccount;
  }

  if (Array.isArray(accounts) && accounts.length > 0) {
    return accounts[0];
  }

  return null;
};

/* =========================================================
   GET CURRENT USER EMAIL
========================================================= */

const getCurrentUserEmail = () => {
  const userEmail = localStorage.getItem("userEmail");

  if (userEmail) {
    return userEmail.trim().toLowerCase();
  }

  const account = getCurrentUser();

  return String(account?.email || "")
    .trim()
    .toLowerCase();
};

/* =========================================================
   GET USER PROFILE
========================================================= */

const getUserProfile = () => {
  const currentUser = getCurrentUser();
  const currentEmail = getCurrentUserEmail();

  const allProfiles = readStorage(
    PROFILE_STORAGE_KEY,
    {}
  );

  const savedProfile =
    allProfiles &&
    typeof allProfiles === "object" &&
    !Array.isArray(allProfiles)
      ? allProfiles[currentEmail]
      : null;

  return {
    ...DEFAULT_PROFILE,
    name:
      currentUser?.fullName ||
      currentUser?.name ||
      localStorage.getItem("userName") ||
      "User",
    email:
      currentUser?.email ||
      currentEmail ||
      "",
    ...(savedProfile || {}),
  };
};

/* =========================================================
   SAVE USER PROFILE
========================================================= */

const saveUserProfile = (profile) => {
  const currentEmail = getCurrentUserEmail();

  if (!currentEmail) {
    return false;
  }

  const allProfiles = readStorage(
    PROFILE_STORAGE_KEY,
    {}
  );

  const updatedProfiles =
    allProfiles &&
    typeof allProfiles === "object" &&
    !Array.isArray(allProfiles)
      ? allProfiles
      : {};

  updatedProfiles[currentEmail] = profile;

  return writeStorage(
    PROFILE_STORAGE_KEY,
    updatedProfiles
  );
};

/* =========================================================
   TASKS
========================================================= */

const getStoredTasks = () => {
  const tasks = readStorage(TASK_STORAGE_KEY, []);

  return Array.isArray(tasks) ? tasks : [];
};

/* =========================================================
   PROFILE PAGE
========================================================= */

const Profile = () => {
  useTheme();

  const [isEditing, setIsEditing] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");

  /* =======================================================
     PROFILE STATE
  ======================================================= */

  const [profile, setProfile] = useState(() =>
    getUserProfile()
  );

  const [originalProfile, setOriginalProfile] =
    useState(profile);

  /* =======================================================
     TASK STATE
  ======================================================= */

  const [taskList, setTaskList] = useState(() =>
    getStoredTasks()
  );

  /* =======================================================
     REFRESH USER PROFILE
  ======================================================= */

  const refreshProfile = useCallback(() => {
    const latestProfile = getUserProfile();

    setProfile(latestProfile);
    setOriginalProfile(latestProfile);
  }, []);

  /* =======================================================
     REFRESH TASKS
  ======================================================= */

  const refreshTasks = useCallback(() => {
    setTaskList(getStoredTasks());
  }, []);

  /* =======================================================
     PROFILE + TASK SYNC
  ======================================================= */

  useEffect(() => {
    window.addEventListener(
      ACCOUNT_UPDATED_EVENT,
      refreshProfile
    );

    window.addEventListener(
      TASKS_UPDATED_EVENT,
      refreshTasks
    );

    const handleStorageChange = (event) => {
      if (
        event.key === PROFILE_STORAGE_KEY ||
        event.key === "userEmail" ||
        event.key === "userName" ||
        event.key === "userAccount" ||
        event.key === "userAccounts"
      ) {
        refreshProfile();
      }

      if (event.key === TASK_STORAGE_KEY) {
        refreshTasks();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        ACCOUNT_UPDATED_EVENT,
        refreshProfile
      );

      window.removeEventListener(
        TASKS_UPDATED_EVENT,
        refreshTasks
      );

      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };
  }, [refreshProfile, refreshTasks]);

  /* =======================================================
     PROFILE CHANGE
  ======================================================= */

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     EDIT PROFILE
  ======================================================= */

  const handleEdit = () => {
    setOriginalProfile(profile);
    setIsEditing(true);
    setSaveMessage("");
  };

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const handleSave = () => {
    const saved = saveUserProfile(profile);

    if (saved) {
      setOriginalProfile(profile);
      setIsEditing(false);

      setSaveMessage(
        "Your profile has been updated successfully."
      );

      window.dispatchEvent(
        new Event(ACCOUNT_UPDATED_EVENT)
      );

      window.setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } else {
      setSaveMessage(
        "Unable to save your profile changes."
      );
    }
  };

  /* =======================================================
     CANCEL EDIT
  ======================================================= */

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
    setSaveMessage("");
  };

  /* =======================================================
     WEBSITE
  ======================================================= */

  const handleWebsiteClick = () => {
    if (!profile.website?.trim()) {
      return;
    }

    let website = profile.website.trim();

    if (
      !website.startsWith("http://") &&
      !website.startsWith("https://")
    ) {
      website = `https://${website}`;
    }

    window.open(
      website,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =======================================================
     INITIALS
  ======================================================= */

  const initials = useMemo(() => {
    const name =
      profile.name?.trim() || "User";

    const parts = name
      .split(/\s+/)
      .filter(Boolean);

    return (
      parts
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "U"
    );
  }, [profile.name]);

  /* =======================================================
     TASK STATISTICS
  ======================================================= */

  const totalTasks = taskList.length;

  const completedTasks = taskList.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = taskList.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgressTasks = taskList.filter(
    (task) => task.status === "In Progress"
  ).length;

  const overdueTasks = taskList.filter(
    (task) => task.status === "Overdue"
  ).length;

  const productivityScore =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  /* =======================================================
     PROFILE COMPLETION
  ======================================================= */

  const profileCompletion = useMemo(() => {
    const fields = [
      profile.name,
      profile.email,
      profile.role,
      profile.bio,
      profile.location,
      profile.website,
    ];

    const completed = fields.filter(
      (field) =>
        typeof field === "string" &&
        field.trim()
    ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [profile]);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* PAGE HEADER */}

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Developer Workspace
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
                My Profile
              </h1>

              <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400 leading-relaxed">
                Manage your professional profile and
                productivity insights from one place.
              </p>
            </div>

            <div className="px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Account Active
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* SAVE MESSAGE */}

        {saveMessage && (
          <div className="mb-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                ✓
              </div>

              <div>
                <p className="font-bold text-emerald-700 dark:text-emerald-400">
                  Profile Updated
                </p>

                <p className="text-sm text-emerald-600 dark:text-emerald-500">
                  {saveMessage}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* PROFILE HERO */}

        <Card>
          <div className="relative overflow-hidden">

            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row gap-7 items-center lg:items-start">

              {/* AVATAR */}

              <div className="relative">

                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-primary/20">
                  {initials}
                </div>

                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center text-white text-sm">
                  ✓
                </div>

              </div>

              {/* PROFILE INFO */}

              <div className="flex-1 text-center lg:text-left">

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <ProfileInput
                      label="Full Name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                    />

                    <ProfileInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />

                  </div>
                ) : (
                  <>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">

                      <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                        {profile.name}
                      </h2>

                      <Badge variant="primary">
                        {profile.role}
                      </Badge>

                    </div>

                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      {profile.email}
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">

                      <span className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        📍 {profile.location}
                      </span>

                      <span className="text-slate-300 dark:text-slate-700">
                        •
                      </span>

                      <span className="inline-flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        ● Available
                      </span>

                    </div>
                  </>
                )}

              </div>

              {/* ACTION */}

              <div className="flex-shrink-0">

                {!isEditing ? (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleEdit}
                  >
                    ✎ Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">

                    <Button
                      variant="outline"
                      size="small"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="primary"
                      size="small"
                      onClick={handleSave}
                    >
                      ✓ Save
                    </Button>

                  </div>
                )}

              </div>

            </div>
          </div>
        </Card>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

          {/* LEFT CONTENT */}

          <div className="xl:col-span-2 space-y-6">

            {/* PROFESSIONAL PROFILE */}

            <Card>

              <SectionHeading
                icon="👨‍💻"
                title="Professional Profile"
                description="Manage your professional identity and developer information."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {isEditing ? (
                  <>
                    <ProfileInput
                      label="Professional Role"
                      name="role"
                      value={profile.role}
                      onChange={handleProfileChange}
                    />

                    <ProfileInput
                      label="Current Location"
                      name="location"
                      value={profile.location}
                      onChange={handleProfileChange}
                    />

                    <div className="md:col-span-2">
                      <ProfileInput
                        label="Portfolio Website"
                        name="website"
                        value={profile.website}
                        onChange={handleProfileChange}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <ProfileInfo
                      label="Professional Role"
                      value={profile.role}
                    />

                    <ProfileInfo
                      label="Location"
                      value={profile.location}
                    />

                    <div className="md:col-span-2">
                      <ProfileInfo
                        label="Portfolio Website"
                        value={profile.website}
                        clickable
                        onClick={handleWebsiteClick}
                      />
                    </div>
                  </>
                )}

              </div>

              {/* BIO */}

              <div className="mt-5">

                {isEditing ? (
                  <>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Professional Summary
                    </label>

                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleProfileChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                  </>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70">

                    <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                      Professional Summary
                    </p>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {profile.bio}
                    </p>

                  </div>
                )}

              </div>

              {/* SKILLS */}

              <div className="mt-6">

                <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  Core Skills
                </p>

                <div className="flex flex-wrap gap-2">

                  {[
                    "Java",
                    "JavaScript",
                    "React.js",
                    "HTML5",
                    "CSS3",
                    "Tailwind CSS",
                    "SQL",
                    "MySQL",
                    "REST API",
                    "Git",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

            </Card>

            {/* DEVELOPER INFORMATION */}

            <Card>

              <SectionHeading
                icon="🚀"
                title="Developer Information"
                description="A quick overview of your current technical profile."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <InfoCard
                  icon="☕"
                  title="Primary Language"
                  value="Java"
                />

                <InfoCard
                  icon="⚛️"
                  title="Frontend"
                  value="React.js"
                />

                <InfoCard
                  icon="🗄️"
                  title="Database"
                  value="MySQL / SQL"
                />

                <InfoCard
                  icon="🎓"
                  title="Certification"
                  value="IBM Certified"
                />

              </div>

            </Card>

          </div>

          {/* RIGHT SIDEBAR */}

          <div className="space-y-6">

            {/* PROFILE COMPLETION */}

            <Card>

              <div className="flex items-center justify-between mb-5">

                <div>

                  <p className="text-xs uppercase tracking-wider font-bold text-primary">
                    Profile Health
                  </p>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    Profile Completion
                  </h3>

                </div>

                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                  {profileCompletion}%
                </div>

              </div>

              <ProgressBar
                progress={profileCompletion}
                color="primary"
              />

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                Keep your profile information complete and
                up to date.
              </p>

            </Card>

            {/* PRODUCTIVITY */}

            <Card>

              <div className="flex items-center justify-between mb-5">

                <div>

                  <p className="text-xs uppercase tracking-wider font-bold text-primary">
                    Performance
                  </p>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                    Productivity
                  </h3>

                </div>

                <span className="text-2xl">
                  📈
                </span>

              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-center">

                <div className="text-5xl font-black text-primary">
                  {productivityScore}%
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Overall Completion Rate
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">

                <StatBox
                  value={totalTasks}
                  label="Total"
                  icon="📋"
                />

                <StatBox
                  value={completedTasks}
                  label="Completed"
                  icon="✓"
                />

                <StatBox
                  value={pendingTasks}
                  label="Pending"
                  icon="◷"
                />

                <StatBox
                  value={overdueTasks}
                  label="Overdue"
                  icon="!"
                />

              </div>

              <div className="mt-5">

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Progress
                  </span>

                  <span className="text-sm font-bold text-primary">
                    {productivityScore}%
                  </span>

                </div>

                <ProgressBar
                  progress={productivityScore}
                  color="primary"
                />

              </div>

            </Card>

            {/* DEVELOPER SNAPSHOT */}

            <Card>

              <div className="flex items-center gap-3 mb-5">

                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                  💻
                </div>

                <div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Developer Snapshot
                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Current technical focus
                  </p>

                </div>

              </div>

              <div className="space-y-3">

                <SnapshotItem
                  label="Primary Stack"
                  value="Java + React"
                />

                <SnapshotItem
                  label="Database"
                  value="MySQL / SQL"
                />

                <SnapshotItem
                  label="Frontend"
                  value="HTML, CSS, JavaScript"
                />

                <SnapshotItem
                  label="Certification"
                  value="IBM Certified"
                />

              </div>

            </Card>

            {/* WORKSPACE STATISTICS */}

            <Card>

              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-5">
                Workspace Statistics
              </h3>

              <div className="space-y-3">

                <AccountStat
                  label="Total Tasks"
                  value={totalTasks}
                />

                <AccountStat
                  label="Completed"
                  value={completedTasks}
                />

                <AccountStat
                  label="In Progress"
                  value={inProgressTasks}
                />

                <AccountStat
                  label="Pending"
                  value={pendingTasks}
                />

                <AccountStat
                  label="Overdue"
                  value={overdueTasks}
                />

                <AccountStat
                  label="Completion Rate"
                  value={`${productivityScore}%`}
                  highlight
                />

              </div>

            </Card>

            {/* TIP */}

            <div className="p-6 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white overflow-hidden relative">

              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/20 blur-2xl" />

              <div className="relative">

                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-xl mb-4">
                  🚀
                </div>

                <h3 className="text-lg font-black">
                  Developer Tip
                </h3>

                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Break large tasks into smaller steps,
                  prioritize important work and review your
                  progress regularly.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

/* =========================================================
   SECTION HEADING
========================================================= */

const SectionHeading = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-3 mb-6">

      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>

      <div>

        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {description}
        </p>

      </div>

    </div>
  );
};

/* =========================================================
   PROFILE INPUT
========================================================= */

const ProfileInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => {
  return (
    <div>

      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
      />

    </div>
  );
};

/* =========================================================
   PROFILE INFO
========================================================= */

const ProfileInfo = ({
  label,
  value,
  clickable = false,
  onClick,
}) => {
  return (
    <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/70">

      <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
        {label}
      </p>

      {clickable ? (
        value ? (
          <button
            type="button"
            onClick={onClick}
            className="font-bold text-primary hover:underline break-all text-left"
          >
            {value}
          </button>
        ) : (
          <p className="font-semibold text-slate-400">
            Portfolio not added
          </p>
        )
      ) : (
        <p className="font-bold text-slate-900 dark:text-white">
          {value || "Not provided"}
        </p>
      )}

    </div>
  );
};

/* =========================================================
   STAT BOX
========================================================= */

const StatBox = ({
  value,
  label,
  icon,
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">

      <div className="text-primary text-lg mb-1">
        {icon}
      </div>

      <div className="text-2xl font-black text-slate-900 dark:text-white">
        {value}
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {label}
      </div>

    </div>
  );
};

/* =========================================================
   ACCOUNT STAT
========================================================= */

const AccountStat = ({
  label,
  value,
  highlight = false,
}) => {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70">

      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span
        className={`text-sm font-black ${
          highlight
            ? "text-primary"
            : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </span>

    </div>
  );
};

/* =========================================================
   SNAPSHOT ITEM
========================================================= */

const SnapshotItem = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70">

      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="text-sm font-bold text-slate-900 dark:text-white text-right">
        {value}
      </span>

    </div>
  );
};

/* =========================================================
   INFO CARD
========================================================= */

const InfoCard = ({
  icon,
  title,
  value,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
          {icon}
        </div>

        <div>

          <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
            {title}
          </p>

          <p className="text-sm font-black text-slate-900 dark:text-white mt-1">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
};

export default Profile;