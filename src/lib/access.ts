// The first 5 lessons are free; everything else requires a subscriber role.
export function canAccessLesson(
  lesson: { isFree: boolean },
  user: { role?: string } | null | undefined
) {
  if (lesson.isFree) return true;
  return user?.role === "subscriber";
}
