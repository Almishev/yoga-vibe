import { useRoute } from '@react-navigation/native';
import CourseDetails from '../componenets/CourseDetails';

export default function CourseDetailsScreen() {
  const route = useRoute();
  const { course } = route.params;

  return <CourseDetails course={course} />;
}