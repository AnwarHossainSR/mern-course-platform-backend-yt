import express from 'express';
import {
  addLecture,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllCourses,
  getCourseLectures,
} from '../controllers/courseController.js';
import {
  authorizeAdmin,
  authorizeSubscribers,
  isAuthenticated,
} from '../middlewares/auth.js';
import singleUpload from '../middlewares/multer.js';

const router = express.Router();

router.route('/courses').get(getAllCourses);

router
  .route('/create-course')
  .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

router
  .route('/course/:id')
  .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
  .post(isAuthenticated, authorizeAdmin, singleUpload, addLecture)
  .delete(isAuthenticated, authorizeAdmin, deleteCourse);

router.route('/lecture').delete(isAuthenticated, authorizeAdmin, deleteLecture);

export default router;
