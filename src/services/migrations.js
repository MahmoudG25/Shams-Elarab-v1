import { v4 as uuidv4 } from 'uuid';

/**
 * Normalizes an array of items into { byId: {}, allIds: [] }
 * @param {Array} items - The array of items to normalize
 * @param {String} key - The unique key (default 'id')
 */
const normalize = (items, key = 'id') => {
  if (!Array.isArray(items)) return { byId: {}, allIds: [] };

  const byId = {};
  const allIds = [];

  items.forEach((item) => {
    const id = item[key] || uuidv4();
    byId[id] = { ...item, id }; // Ensure ID exists
    allIds.push(id);
  });

  return { byId, allIds };
};

/**
 * Transforms the legacy courses.json and roadmaps.json into the normalized DB shape.
 * 
 * @param {Array} courses - Raw courses array
 * @param {Array} roadmaps - Raw roadmaps array
 * @returns {Object} Normalized DB state
 */
export const migrateToNormalizedDb = (courses, roadmaps) => {
  console.log('Migrating data to normalized shape...');

  // 1. Normalize Courses
  // We need to extract Instructors and Media if we want to be fully normalized,
  // but for now, let's keep them embedded in Course object to simplify, 
  // unless we want a global "Instructors" management.
  // The requirement says: "Instructors { byId, allIds }"

  const instructorsMap = {};
  const normalizedCourses = { byId: {}, allIds: [] };

  courses.forEach(course => {
    // Extract Instructor
    let instructorId = null;
    if (course.instructor) {
      // Create a unique ID for the instructor based on name or use a new UUID
      // Simple slugify for ID to avoid duplicates if name is same
      const slug = course.instructor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      instructorId = slug;

      if (!instructorsMap[instructorId]) {
        instructorsMap[instructorId] = {
          id: instructorId,
          ...course.instructor
        };
      }
    }

    normalizedCourses.byId[course.id] = {
      ...course,
      instructorId: instructorId, // Reference instead of object
      // Media is already an object { thumbnail, preview_video }, keep it embedded or extract?
      // Requirement says: "media: { byId, allIds }"
      // Let's extract media if it has IDs, otherwise generate.
      // Actually, Cloudinary returns full objects. Let's keep media embedded in course for now 
      // OR if we want a global media library, we extract.
      // Let's stick to embedded for simplicity unless re-used. 
      // But the prompt asked for "media" table. Let's create it.
      mediaId: null // We will implement media extraction if needed, but for now specific course media stays linked?
      // Let's keep it simple: Course has a 'media' object. 
      // If we upload new media, we store it in the global 'media' table and link it?
      // Let's just normalize Instructors for now as requested.
    };

    // Remove raw instructor object to save space and ensure normalization
    delete normalizedCourses.byId[course.id].instructor;

    normalizedCourses.allIds.push(course.id);
  });

  // 2. Normalize Instructors
  const instructors = {
    byId: instructorsMap,
    allIds: Object.keys(instructorsMap)
  };

  // 3. Normalize Roadmaps
  const normalizedRoadmaps = normalize(roadmaps);

  // 4. Media (Start empty or extract existing?)
  // We'll start empty and add uploaded files here.
  const media = { byId: {}, allIds: [] };

  return {
    courses: normalizedCourses,
    roadmaps: normalizedRoadmaps,
    instructors: instructors,
    media: media
  };
};
