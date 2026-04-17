// compute profile completion percentage in one place so all components agree
export default function computeProfileCompletion(u = {}) {
  const total = 8;
  let score = 0;

  // Name: allow either firstName/lastName or a full name property
  if (u.firstName || u.lastName || u.name) score++;

  // Email
  if (u.email) score++;

  // Phone
  if (u.phone) score++;

  // Address: count only if at least one non-empty address field exists
  const addr = u.address || {};
  if (Object.values(addr).some((v) => v && v.toString().trim() !== "")) score++;

  // Education: count only if at least one level has meaningful filled fields
  const edu = u.education || {};
  const hasMeaningfulEducation = Object.keys(edu).some((level) => {
    const inst = edu[level]?.instituteFields || {};
    return Object.values(inst).some((v) => v && v.toString().trim() !== "");
  });
  if (hasMeaningfulEducation) score++;

  // Experience: count if any experience entry has a non-empty company
  const expList = Array.isArray(u.experience) ? u.experience : [];
  if (expList.some((e) => e && e.company && e.company.toString().trim() !== "")) score++;

  // Skills: count if array has at least one non-empty skill
  if (Array.isArray(u.skills) && u.skills.some((s) => s && s.toString().trim() !== "")) score++;

  // Resume/Profile picture/image
  if (u.resume || u.profilePicture || u.image) score++;

  return Math.min(100, Math.round((score / total) * 100));
}
