import { useState, useEffect } from 'react';

function ClassSearch() {

     const [courses, setCourses] = useState([]);

     useEffect(() => {
          fetch("http://localhost:3001/api/courses")
          .then((res) => res.json())
          .then((json) => setCourses(json))
          .catch((err) => console.error("Error fetching courses", err));
     }, []);

     return (
          <>
               <h2>Available Courses</h2>
               <ul>
                    {courses.map((course) => (
                         <li key={course.id}>
                              {course.code} - {course.title} ({course.instructor})
                         </li>
                    ))}
               </ul>

          </>
     )

}
export default ClassSearch;